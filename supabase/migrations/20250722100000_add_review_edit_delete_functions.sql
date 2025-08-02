-- Add updated_at column to reviews table if it doesn't exist
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

-- Create a trigger function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_review_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically update updated_at on review changes
DROP TRIGGER IF EXISTS on_review_update ON public.reviews;
CREATE TRIGGER on_review_update
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.handle_review_update();

-- Create RPC function to delete a review
CREATE OR REPLACE FUNCTION public.delete_review(review_id_to_delete uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  review_owner_id uuid;
BEGIN
  -- Check if the user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Authentication required');
  END IF;

  -- Get the owner of the review
  SELECT user_id INTO review_owner_id FROM public.reviews WHERE id = review_id_to_delete;

  -- Check if the review exists and if the current user is the owner
  IF review_owner_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Review not found');
  END IF;

  IF review_owner_id != auth.uid() THEN
    RETURN json_build_object('success', false, 'message', 'You are not authorized to delete this review');
  END IF;

  -- Delete the review
  DELETE FROM public.reviews WHERE id = review_id_to_delete;

  RETURN json_build_object('success', true, 'message', 'Review deleted successfully');
END;
$$;

-- Create RPC function to update a review
CREATE OR REPLACE FUNCTION public.update_review(
  p_review_id uuid,
  p_rating int,
  p_title text,
  p_comment text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  review_owner_id uuid;
BEGIN
  -- Check if the user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Authentication required');
  END IF;

  -- Get the owner of the review
  SELECT user_id INTO review_owner_id FROM public.reviews WHERE id = p_review_id;

  -- Check if the review exists and if the current user is the owner
  IF review_owner_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Review not found');
  END IF;

  IF review_owner_id != auth.uid() THEN
    RETURN json_build_object('success', false, 'message', 'You are not authorized to update this review');
  END IF;

  -- Update the review
  UPDATE public.reviews
  SET
    rating = p_rating,
    title = p_title,
    comment = p_comment
  WHERE id = p_review_id;

  RETURN json_build_object('success', true, 'message', 'Review updated successfully');
END;
$$;
