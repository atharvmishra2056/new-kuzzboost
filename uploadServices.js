import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace with your actual Supabase credentials if they are different.
const supabaseUrl = 'https://jglwfatcrmyvslluobie.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnbHdmYXRjcm15dnNsbHVvYmllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDA2OTcsImV4cCI6MjA2ODA3NjY5N30.txByRgVVo_vIjbyKOWCuR5f6laPc9L5pQlwfCaSwmHg';
const supabase = createClient(supabaseUrl, supabaseKey);

const servicesData = [
    // WhatsApp Services
    {
        id: 1,
        title: "Whatsapp Channel Members [Real Users]",
        platform: "whatsapp",
        iconName: "SiWhatsapp",
        tiers: [{ quantity: 1000, price: 1050 }],
        rating: 4.8,
        reviews: 312,
        features: ["Real Active Users", "Targeted Audience", "Fast Growth"],
        description: "Grow your WhatsApp channel with genuine members.",
        badge: "Premium"
    },
    {
        id: 2,
        title: "Whatsapp Channel Members [Non Drop]",
        platform: "whatsapp",
        iconName: "SiWhatsapp",
        tiers: [{ quantity: 1000, price: 1650 }],
        rating: 4.9,
        reviews: 543,
        features: ["Non-Drop Guarantee", "Permanent Members", "High-Quality"],
        description: "Get permanent, non-drop members for your channel.",
        badge: "Lifetime"
    },
    {
        id: 3,
        title: "Whatsapp Contact Scraper",
        platform: "whatsapp",
        iconName: "SiWhatsapp",
        tiers: [{ quantity: 1000, price: 1350 }],
        rating: 4.5,
        reviews: 123,
        features: ["Scrape Group Links", "1k/day Speed", "24-48h Start"],
        description: "Scrape contacts from WhatsApp groups.",
        badge: "Utility"
    },
    {
        id: 4,
        title: "Whatsapp Channel Followers",
        platform: "whatsapp",
        iconName: "SiWhatsapp",
        tiers: [{ quantity: 1000, price: 1650 }],
        rating: 4.7,
        reviews: 234,
        features: ["1k-2k/day Speed", "Non-Drop", "Real Followers"],
        description: "Increase your WhatsApp channel followers.",
        badge: "Growth"
    },
    {
        id: 5,
        title: "WhatsApp Emoji Reactions (Random)",
        platform: "whatsapp",
        iconName: "SiWhatsapp",
        tiers: [{ quantity: 1000, price: 275 }],
        rating: 4.6,
        reviews: 189,
        features: ["Random Emojis", "Boost Engagement", "Instant Delivery"],
        description: "Add random emoji reactions to your WhatsApp messages.",
        badge: "Engagement"
    },
    {
        id: 6,
        title: "WhatsApp Emoji Reactions (Specific)",
        platform: "whatsapp",
        iconName: "SiWhatsapp",
        tiers: [{ quantity: 1000, price: 250 }],
        rating: 4.6,
        reviews: 189,
        features: ["Specific Emoji", "Boost Engagement", "Instant Delivery"],
        description: "Add specific emoji reactions to your WhatsApp messages.",
        badge: "Engagement"
    },

    // Instagram Services
    {
        id: 7,
        title: "Instagram Followers [With Auto Refill!]",
        platform: "instagram",
        iconName: "SiInstagram",
        tiers: [
            { quantity: 10, price: 4 },
            { quantity: 100, price: 29 },
            { quantity: 1000, price: 280 },
            { quantity: 5000, price: 1300 },
            { quantity: 10000, price: 2500 }
        ],
        rating: 4.9,
        reviews: 1284,
        features: ["Real Active Users", "Gradual Delivery", "30-Day Guarantee"],
        description: "High-quality, active followers from real accounts.",
        badge: "Auto Refill"
    },
    {
        id: 8,
        title: "Instagram Likes",
        platform: "instagram",
        iconName: "SiInstagram",
        tiers: [
            { quantity: 500, price: 25 },
            { quantity: 1000, price: 45 },
            { quantity: 2000, price: 90 },
            { quantity: 5000, price: 220 }
        ],
        rating: 4.8,
        reviews: 892,
        features: ["High-Quality Likes", "Improves Engagement", "Fast Delivery"],
        description: "Boost your posts with high-quality likes.",
        badge: "Best Value"
    },
    {
        id: 9,
        title: "Instagram Views",
        platform: "instagram",
        iconName: "SiInstagram",
        tiers: [
            { quantity: 100000, price: 60 },
            { quantity: 200000, price: 110 }
        ],
        rating: 4.7,
        reviews: 756,
        features: ["Boosts Video Reach", "Instant Start", "From Real Accounts"],
        description: "Increase the visibility of your video content.",
        badge: "Viral Boost"
    },
    {
        id: 10,
        title: "Instagram Channel Members",
        platform: "instagram",
        iconName: "SiInstagram",
        tiers: [{ quantity: 1000, price: 100 }],
        rating: 4.6,
        reviews: 432,
        features: ["Grow Your Community", "Active Members", "Quick Delivery"],
        description: "Expand your Instagram channel with real members.",
        badge: "New"
    },

    // Discord Services
    {
        id: 11,
        title: "Discord 30 Days Online Members",
        platform: "discord",
        iconName: "SiDiscord",
        tiers: [{ quantity: 1000, price: 300 }],
        rating: 4.8,
        reviews: 445,
        features: ["Online for 30 Days", "Boosts Server Activity", "Quick Delivery"],
        description: "Add online members to your Discord server for 30 days.",
        badge: "Online"
    },
    {
        id: 12,
        title: "Discord Permanent Offline Members",
        platform: "discord",
        iconName: "SiDiscord",
        tiers: [{ quantity: 1000, price: 900 }],
        rating: 4.9,
        reviews: 632,
        features: ["Permanent Members", "Lifetime Guarantee", "Offline Appearance"],
        description: "Get permanent offline members for your Discord server.",
        badge: "Lifetime"
    },

    // YouTube Services
    {
        id: 13,
        title: "YouTube Subscribers [1 Year Refill]",
        platform: "youtube",
        iconName: "SiYoutube",
        tiers: [
            { quantity: 1000, price: 600 },
            { quantity: 2000, price: 1150 },
            { quantity: 5000, price: 2850 },
            { quantity: 10000, price: 5600 },
            { quantity: 100000, price: 56000 }
        ],
        rating: 4.9,
        reviews: 1152,
        features: ["1 Year Refill Guarantee", "Real Subscribers", "Boosts Channel Authority"],
        description: "Increase your YouTube subscribers with a 1-year refill guarantee.",
        badge: "Refill"
    },
    {
        id: 14,
        title: "YouTube Subscribers [No Refill]",
        platform: "youtube",
        iconName: "SiYoutube",
        tiers: [
            { quantity: 1000, price: 150 },
            { quantity: 2000, price: 290 },
            { quantity: 5000, price: 725 },
            { quantity: 10000, price: 1400 },
            { quantity: 100000, price: 13000 }
        ],
        rating: 4.5,
        reviews: 876,
        features: ["Most Affordable", "Quick Delivery", "Good for a quick boost"],
        description: "The most affordable way to increase your YouTube subscribers.",
        badge: "Budget"
    },
    {
        id: 15,
        title: "YouTube Likes",
        platform: "youtube",
        iconName: "SiYoutube",
        tiers: [
            { quantity: 1000, price: 125 },
            { quantity: 2000, price: 240 },
            { quantity: 5000, price: 590 },
            { quantity: 10000, price: 1100 }
        ],
        rating: 4.8,
        reviews: 987,
        features: ["Boosts Video Ranking", "Real Likes", "Fast Delivery"],
        description: "Increase the number of likes on your YouTube videos.",
        badge: "Ranking Boost"
    },
    {
        id: 16,
        title: "YouTube Views",
        platform: "youtube",
        iconName: "SiYoutube",
        tiers: [
            { quantity: 1000, price: 111 },
            { quantity: 2000, price: 211 },
            { quantity: 5000, price: 525 },
            { quantity: 10000, price: 999 }
        ],
        rating: 4.7,
        reviews: 1543,
        features: ["High-Retention Views", "Improves Discoverability", "Safe for Monetization"],
        description: "Get high-quality views for your YouTube videos.",
        badge: "High Retention"
    },

    // Snapchat Services
    {
        id: 17,
        title: "Snapchat Followers",
        platform: "snapchat",
        iconName: "SiSnapchat",
        tiers: [
            { quantity: 1000, price: 1800 },
            { quantity: 2000, price: 3600 },
            { quantity: 5000, price: 8900 },
            { quantity: 10000, price: 17500 }
        ],
        rating: 4.6,
        reviews: 453,
        features: ["Real Snapchat Users", "Boosts Profile Authority", "Safe and Secure"],
        description: "Increase your Snapchat followers with real users.",
        badge: "Exclusive"
    },

    // Twitch Services
    {
        id: 18,
        title: "Twitch Followers",
        platform: "twitch",
        iconName: "SiTwitch",
        tiers: [
            { quantity: 1000, price: 70 },
            { quantity: 2000, price: 135 },
            { quantity: 5000, price: 330 },
            { quantity: 10000, price: 625 },
            { quantity: 100000, price: 6050 }
        ],
        rating: 4.9,
        reviews: 876,
        features: ["Affiliate Requirement", "Real Followers", "Instant Start"],
        description: "Get the followers you need to reach Twitch Affiliate.",
        badge: "Affiliate"
    },
    {
        id: 19,
        title: "Twitch Views",
        platform: "twitch",
        iconName: "SiTwitch",
        tiers: [
            { quantity: 1000, price: 60 },
            { quantity: 2000, price: 115 },
            { quantity: 5000, price: 280 },
            { quantity: 10000, price: 520 },
            { quantity: 50000, price: 2500 },
            { quantity: 100000, price: 5100 }
        ],
        rating: 4.8,
        reviews: 654,
        features: ["Boosts Stream Visibility", "Real Viewers", "Safe for your channel"],
        description: "Increase the number of views on your Twitch streams.",
        badge: "Stream Boost"
    },

    // Spotify Services
    {
        id: 20,
        title: "Spotify Playlist Followers",
        platform: "spotify",
        iconName: "SiSpotify",
        tiers: [
            { quantity: 1000, price: 160 },
            { quantity: 2000, price: 310 },
            { quantity: 5000, price: 777 },
            { quantity: 10000, price: 1500 },
            { quantity: 100000, price: 14900 }
        ],
        rating: 4.9,
        reviews: 987,
        features: ["Grow Your Playlist", "Real Followers", "Boosts Discoverability"],
        description: "Increase the number of followers on your Spotify playlists.",
        badge: "Playlist Growth"
    },
    {
        id: 21,
        title: "Spotify Profile Followers",
        platform: "spotify",
        iconName: "SiSpotify",
        tiers: [
            { quantity: 1000, price: 120 },
            { quantity: 2000, price: 235 },
            { quantity: 5000, price: 565 },
            { quantity: 10000, price: 1111 },
            { quantity: 100000, price: 9999 }
        ],
        rating: 4.9,
        reviews: 1234,
        features: ["Boost Your Artist Profile", "Real Followers", "Increases Credibility"],
        description: "Increase the number of followers on your Spotify artist profile.",
        badge: "Artist Special"
    },

    // Twitter Services
    {
        id: 22,
        title: "X (Twitter) Followers [No Refill]",
        platform: "twitter",
        iconName: "SiX",
        tiers: [{ quantity: 1000, price: 650 }],
        rating: 4.5,
        reviews: 432,
        features: ["Affordable Growth", "Quick Delivery", "Good for a quick boost"],
        description: "An affordable way to increase your X (Twitter) followers.",
        badge: "Budget"
    },
    {
        id: 23,
        title: "X (Twitter) Followers [Refill]",
        platform: "twitter",
        iconName: "SiX",
        tiers: [{ quantity: 1000, price: 800 }],
        rating: 4.8,
        reviews: 765,
        features: ["Refill Guarantee", "Real Followers", "Stable Growth"],
        description: "Increase your X (Twitter) followers with a refill guarantee.",
        badge: "Refill"
    }
];

const uploadData = async () => {
    // We need to delete existing data first to avoid conflicts
    console.log("Deleting existing services and tiers...");
    const { error: deleteTiersError } = await supabase.from('service_tiers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteTiersError) {
        console.error("Error deleting tiers:", deleteTiersError);
        return;
    }
    const { error: deleteServicesError } = await supabase.from('services').delete().neq('id', 0);
    if (deleteServicesError) {
        console.error("Error deleting services:", deleteServicesError);
        return;
    }
    console.log("Existing data deleted.");


    for (const service of servicesData) {
        const { tiers, iconName, ...serviceData } = service;

        const { data: insertedService, error: serviceError } = await supabase
            .from('services')
            .insert({ ...serviceData, icon_name: iconName })
            .select()
            .single();

        if (serviceError) {
            console.error('Error inserting service:', serviceData.title, serviceError);
            continue; // Skip to the next service if this one fails
        }

        if (insertedService && tiers) {
            const tiersToInsert = tiers.map(tier => ({
                service_id: insertedService.id,
                quantity: tier.quantity,
                price: tier.price
            }));

            const { error: tiersError } = await supabase
                .from('service_tiers')
                .insert(tiersToInsert);

            if (tiersError) {
                console.error('Error inserting tiers for service:', serviceData.title, tiersError);
            }
        }
    }

    console.log("✅ Success! All services have been uploaded to Supabase.");
};

uploadData();