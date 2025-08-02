-- CRITICAL SECURITY FIXES - Phase 1: Enable RLS on missing tables and fix policies

-- 1. Enable RLS on tables that don't have it
ALTER TABLE public.refill_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestone_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_milestones ENABLE ROW LEVEL SECURITY;

-- 2. Create RLS policies for refill_requests table
CREATE POLICY "Users can view their own refill requests"
ON public.refill_requests FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own refill requests"
ON public.refill_requests FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all refill requests"
ON public.refill_requests FOR SELECT 
USING (get_user_role() = 'admin');

CREATE POLICY "Admins can update refill requests"
ON public.refill_requests FOR UPDATE 
USING (get_user_role() = 'admin');

-- 3. Create RLS policies for milestone_templates table
CREATE POLICY "Anyone can view active milestone templates"
ON public.milestone_templates FOR SELECT 
USING (active = true);

CREATE POLICY "Admins can manage milestone templates"
ON public.milestone_templates FOR ALL 
USING (get_user_role() = 'admin')
WITH CHECK (get_user_role() = 'admin');

-- 4. Create RLS policies for user_milestones table
CREATE POLICY "Users can view their own milestones"
ON public.user_milestones FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones"
ON public.user_milestones FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user milestones"
ON public.user_milestones FOR SELECT 
USING (get_user_role() = 'admin');

CREATE POLICY "System can create milestones for users"
ON public.user_milestones FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 5. Fix SECURITY DEFINER functions by adding proper search_path
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.user_roles WHERE user_id = p_user_id LIMIT 1;
  RETURN user_role;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_role()
 RETURNS text
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT role
  FROM public.profiles
  WHERE user_id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.submit_review(p_service_id integer, p_rating numeric, p_title text, p_comment text, p_media_urls jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    v_user_id UUID := auth.uid();
    v_is_verified BOOLEAN;
    v_new_review_id UUID;
    v_result JSONB;
BEGIN
    -- Check if the user has a completed order for this service.
    SELECT EXISTS (
        SELECT 1 FROM public.orders
        WHERE user_id = v_user_id
          AND status = 'completed'
          AND EXISTS (
              SELECT 1 FROM jsonb_array_elements(items) AS item
              WHERE (item->>'service_id')::INT = p_service_id
          )
    ) INTO v_is_verified;

    -- Insert the review into the table.
    INSERT INTO public.reviews (service_id, user_id, rating, title, comment, media_urls, is_verified_purchase)
    VALUES (p_service_id, v_user_id, p_rating, p_title, p_comment, p_media_urls, v_is_verified)
    RETURNING id INTO v_new_review_id;

    -- Prepare a JSON response to send back to the frontend.
    v_result := jsonb_build_object(
        'success', true,
        'message', 'Review submitted successfully.',
        'review_id', v_new_review_id,
        'is_verified', v_is_verified
    );

    RETURN v_result;

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_order_status(order_id_param uuid, new_status text, payment_verified_param boolean)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  current_tracking jsonb;
  new_tracking_event jsonb;
  status_description text;
BEGIN
  -- Check if the user is an admin by checking their role in the JWT.
  IF (auth.jwt() -> 'app_metadata' ->> 'user_role')::text <> 'admin' THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Get the current tracking info for the order.
  SELECT tracking_info INTO current_tracking FROM public.orders WHERE id = order_id_param;

  -- Create a description for the new tracking event.
  status_description := CASE new_status
    WHEN 'processing' THEN 'Payment verified. Order is now being processed.'
    WHEN 'shipped' THEN 'Service delivery has started.'
    WHEN 'completed' THEN 'Order has been successfully completed.'
    WHEN 'cancelled' THEN 'Order has been cancelled.'
    ELSE 'Order status updated.'
  END;

  -- Build the new tracking event object.
  new_tracking_event := jsonb_build_object(
    'status', new_status,
    'description', status_description,
    'timestamp', now()
  );

  -- Update the order with the new status, payment verification, and tracking info.
  UPDATE public.orders
  SET
    status = new_status,
    payment_verified = payment_verified_param,
    tracking_info = current_tracking || new_tracking_event
  WHERE id = order_id_param;
END;
$function$;

CREATE OR REPLACE FUNCTION public.delete_review(review_id_to_delete uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.update_review(p_review_id uuid, p_rating integer, p_title text, p_comment text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_review_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.ensure_single_default_address()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
    -- If setting this address as default, unset all other defaults for this user
    IF NEW.is_default = TRUE THEN
        UPDATE public.addresses 
        SET is_default = FALSE 
        WHERE user_id = NEW.user_id AND id != NEW.id;
    END IF;
    
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.add_role_to_custom_claims()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
DECLARE
  user_role TEXT;
BEGIN
  user_role := public.get_user_role(NEW.id);
  IF user_role IS NOT NULL THEN
    NEW.raw_app_meta_data := NEW.raw_app_meta_data || jsonb_build_object('user_role', user_role);
  END IF;
  RETURN NEW;
END;
$function$;