-- Migration to enhance reviews system for Amazon-style functionality
-- This migration updates the existing reviews table and adds necessary functions

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_is_verified ON public.reviews(is_verified);

-- Create function to get review statistics for a service
CREATE OR REPLACE FUNCTION public.get_review_stats(p_service_id integer)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total_reviews integer;
    v_average_rating numeric;
    v_rating_breakdown json;
    v_reviews_with_photos integer;
BEGIN
    -- Get total reviews and average rating
    SELECT 
        COUNT(*),
        COALESCE(AVG(rating), 0)
    INTO v_total_reviews, v_average_rating
    FROM public.reviews 
    WHERE service_id = p_service_id;

    -- Get rating breakdown (count for each star rating)
    SELECT json_object_agg(rating, count)
    INTO v_rating_breakdown
    FROM (
        SELECT 
            rating,
            COUNT(*) as count
        FROM public.reviews 
        WHERE service_id = p_service_id
        GROUP BY rating
        ORDER BY rating DESC
    ) rating_counts;

    -- Get count of reviews with photos
    SELECT COUNT(*)
    INTO v_reviews_with_photos
    FROM public.reviews 
    WHERE service_id = p_service_id 
    AND media_urls IS NOT NULL 
    AND jsonb_array_length(media_urls) > 0;

    RETURN json_build_object(
        'total_reviews', v_total_reviews,
        'average_rating', ROUND(v_average_rating, 1),
        'rating_breakdown', COALESCE(v_rating_breakdown, '{}'),
        'reviews_with_photos', v_reviews_with_photos
    );
END;
$$;

-- Enhanced delete_review function with photo cleanup
CREATE OR REPLACE FUNCTION public.delete_review_with_photos(review_id_to_delete uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    review_owner_id uuid;
    photo_urls jsonb;
    photo_url text;
    file_path text;
BEGIN
    -- Check if the user is authenticated
    IF auth.uid() IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'Authentication required');
    END IF;

    -- Get the owner and photo URLs of the review
    SELECT user_id, media_urls INTO review_owner_id, photo_urls 
    FROM public.reviews 
    WHERE id = review_id_to_delete;

    -- Check if the review exists and if the current user is the owner
    IF review_owner_id IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'Review not found');
    END IF;

    IF review_owner_id != auth.uid() THEN
        RETURN json_build_object('success', false, 'message', 'You are not authorized to delete this review');
    END IF;

    -- Delete associated photos from storage if they exist
    IF photo_urls IS NOT NULL AND jsonb_array_length(photo_urls) > 0 THEN
        FOR photo_url IN SELECT jsonb_array_elements_text(photo_urls)
        LOOP
            -- Extract file path from URL (assuming URL format: .../storage/v1/object/public/review-photos/filename)
            file_path := substring(photo_url from 'review-photos/(.*)$');
            IF file_path IS NOT NULL THEN
                -- Delete from storage (this will be handled by the frontend for now)
                -- We'll add the file paths to a cleanup queue or handle via RPC
                NULL;
            END IF;
        END LOOP;
    END IF;

    -- Delete the review
    DELETE FROM public.reviews WHERE id = review_id_to_delete;

    RETURN json_build_object(
        'success', true, 
        'message', 'Review deleted successfully',
        'deleted_photos', photo_urls
    );
END;
$$;

-- Function to get reviews with photos for a service (for the photo carousel)
CREATE OR REPLACE FUNCTION public.get_reviews_with_photos(p_service_id integer, p_limit integer DEFAULT 10)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    SELECT json_agg(
        json_build_object(
            'id', r.id,
            'rating', r.rating,
            'title', r.title,
            'comment', r.comment,
            'media_urls', r.media_urls,
            'created_at', r.created_at,
            'user_name', COALESCE(p.full_name, 'Anonymous'),
            'is_verified_purchase', r.is_verified
        )
    )
    INTO result
    FROM public.reviews r
    LEFT JOIN public.profiles p ON r.user_id = p.user_id
    WHERE r.service_id = p_service_id 
    AND r.media_urls IS NOT NULL 
    AND jsonb_array_length(r.media_urls) > 0
    ORDER BY r.created_at DESC
    LIMIT p_limit;

    RETURN COALESCE(result, '[]'::json);
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_review_stats(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_review_with_photos(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_reviews_with_photos(integer, integer) TO authenticated;
