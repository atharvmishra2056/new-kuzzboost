-- Insert sample services data
INSERT INTO public.services (id, title, platform, icon_name, description, rating, reviews, badge, features, is_active) VALUES
(1, 'Instagram Followers', 'instagram', 'SiInstagram', 'Get high-quality Instagram followers to boost your social presence', 4.8, 1547, 'POPULAR', ARRAY['Real Active Users', 'Instant Delivery', '30-Day Refill Guarantee', 'No Password Required'], true),
(2, 'YouTube Views', 'youtube', 'SiYoutube', 'Increase your YouTube video views from real users worldwide', 4.9, 2134, 'TRENDING', ARRAY['100% Real Views', 'Fast Delivery', 'Watch Time Included', 'Safe & Secure'], true),
(3, 'Instagram Likes', 'instagram', 'SiInstagram', 'Boost your Instagram posts with authentic likes from real accounts', 4.7, 893, 'HOT', ARRAY['Instant Start', 'High Quality', 'No Drop Guarantee', '24/7 Support'], true),
(4, 'TikTok Followers', 'tiktok', 'SiTiktok', 'Grow your TikTok following with real, engaged users', 4.6, 756, 'NEW', ARRAY['Real Users Only', 'Gradual Delivery', 'Safe Methods', 'Lifetime Guarantee'], true),
(5, 'Twitter Followers', 'twitter', 'SiX', 'Build your Twitter audience with quality followers', 4.5, 634, 'FEATURED', ARRAY['Profile Targeted', 'Slow & Safe', 'High Retention', 'Custom Packages'], true),
(6, 'YouTube Subscribers', 'youtube', 'SiYoutube', 'Gain loyal YouTube subscribers who engage with your content', 4.8, 1245, 'PREMIUM', ARRAY['Real Subscribers', 'Watch Your Videos', 'High Retention Rate', 'Monetization Safe'], true);

-- Insert service tiers (pricing)
INSERT INTO public.service_tiers (service_id, quantity, price) VALUES
-- Instagram Followers
(1, 100, 5.99),
(1, 500, 19.99),
(1, 1000, 29.99),
(1, 5000, 89.99),
(1, 10000, 149.99),

-- YouTube Views  
(2, 1000, 9.99),
(2, 5000, 29.99),
(2, 10000, 49.99),
(2, 50000, 149.99),
(2, 100000, 249.99),

-- Instagram Likes
(3, 100, 3.99),
(3, 500, 12.99),
(3, 1000, 19.99),
(3, 5000, 59.99),
(3, 10000, 99.99),

-- TikTok Followers
(4, 100, 7.99),
(4, 500, 24.99),
(4, 1000, 39.99),
(4, 5000, 119.99),
(4, 10000, 199.99),

-- Twitter Followers
(5, 100, 8.99),
(5, 500, 27.99),
(5, 1000, 44.99),
(5, 5000, 134.99),
(5, 10000, 219.99),

-- YouTube Subscribers
(6, 100, 12.99),
(6, 500, 39.99),
(6, 1000, 64.99),
(6, 5000, 199.99),
(6, 10000, 329.99);