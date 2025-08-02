-- Create the reviews table
CREATE TABLE public.reviews (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    user_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    order_item_id uuid REFERENCES public.order_items(id) ON DELETE SET NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title text,
    comment text,
    media_urls jsonb,
    is_verified boolean NOT NULL DEFAULT false,
    CONSTRAINT reviews_pkey PRIMARY KEY (id)
);

-- Enable RLS for the reviews table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for the reviews table
-- Allow public read access to all reviews
CREATE POLICY "Allow public read access to reviews" ON public.reviews
    FOR SELECT USING (true);

-- Allow users to insert their own reviews
CREATE POLICY "Allow users to insert their own reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = reviews.user_id));

-- Allow users to update their own reviews
CREATE POLICY "Allow users to update their own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = reviews.user_id));

-- Allow users to delete their own reviews
CREATE POLICY "Allow users to delete their own reviews" ON public.reviews
    FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = reviews.user_id));

-- Create the submit_review function
CREATE OR REPLACE FUNCTION public.submit_review(
    p_service_id integer,
    p_rating integer,
    p_title text,
    p_comment text,
    p_media_urls jsonb
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id uuid := auth.uid();
    v_order_item_id uuid;
    v_is_verified boolean := false;
    v_review_id uuid;
BEGIN
    -- Check if the user has purchased the service
    SELECT oi.id INTO v_order_item_id
    FROM public.order_items oi
    JOIN public.orders o ON oi.order_id = o.id
    WHERE o.user_id = v_user_id
    AND oi.service_id = p_service_id
    AND o.payment_status = 'paid'
    LIMIT 1;

    IF v_order_item_id IS NOT NULL THEN
        v_is_verified := true;
    END IF;

    -- Insert the review
    INSERT INTO public.reviews (user_id, service_id, order_item_id, rating, title, comment, media_urls, is_verified)
    VALUES (v_user_id, p_service_id, v_order_item_id, p_rating, p_title, p_comment, p_media_urls, v_is_verified)
    RETURNING id INTO v_review_id;

    RETURN json_build_object('success', true, 'review_id', v_review_id, 'message', 'Review submitted successfully.');

EXCEPTION
    WHEN others THEN
        RETURN json_build_object('success', false, 'message', 'An error occurred: ' || SQLERRM);
END;
$$;
