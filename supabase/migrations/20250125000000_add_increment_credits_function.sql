-- Create increment_credits function for referral system

CREATE OR REPLACE FUNCTION public.increment_credits(
    p_user_id UUID,
    p_amount NUMERIC
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update the user's credits by adding the amount
    UPDATE public.profiles
    SET credits = COALESCE(credits, 0) + p_amount
    WHERE user_id = p_user_id;

    -- If no rows were updated, the user doesn't exist
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found: %', p_user_id;
    END IF;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.increment_credits(UUID, NUMERIC) TO anon, authenticated;
