import { initializeApp } from "firebase/app";
import { getFirestore, collection, writeBatch } from "firebase/firestore";
import {SiDiscord, SiInstagram, SiSnapchat, SiSpotify, SiTwitch, SiWhatsapp, SiX, SiYoutube} from "react-icons/si";

// IMPORTANT: Paste your actual firebaseConfig here for this script to work.
// This is a one-time, local script, so it's okay for now.
const firebaseConfig = {
    apiKey: "AIzaSyD7o9wGYTpmQKJDPYj891JOC6szPapq_oQ",
    authDomain: "kuzzboost-project.firebaseapp.com",
    projectId: "kuzzboost-project",
    storageBucket: "kuzzboost-project.firebasestorage.app",
    messagingSenderId: "374053641812",
    appId: "1:374053641812:web:a4d175b430161dc923d7c1",
    measurementId: "G-4LP2BSRRYK"
};


const servicesData= [
    {
        id: 1,
        title: "Instagram Followers [With Auto Refill!]",
        platform: "instagram",
        icon: <SiInstagram className="w-8 h-8 text-[#E4405F]" />,
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
        id: 2,
        title: "Instagram Likes",
        platform: "instagram",
        icon: <SiInstagram className="w-8 h-8 text-[#E4405F]" />,
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
        id: 3,
        title: "Instagram Views",
        platform: "instagram",
        icon: <SiInstagram className="w-8 h-8 text-[#E4405F]" />,
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
        id: 4,
        title: "Instagram Channel Members",
        platform: "instagram",
        icon: <SiInstagram className="w-8 h-8 text-[#E4405F]" />,
        tiers: [{ quantity: 1000, price: 100 }],
        rating: 4.6,
        reviews: 432,
        features: ["Grow Your Community", "Active Members", "Quick Delivery"],
        description: "Expand your Instagram channel with real members.",
        badge: "New"
    },
    {
        id: 5,
        title: "Whatsapp Channel Members [Real Users]",
        platform: "whatsapp",
        icon: <SiWhatsapp className="w-8 h-8 text-[#25D366]" />,
        tiers: [{ quantity: 1000, price: 1050 }],
        rating: 4.8,
        reviews: 312,
        features: ["Real Active Users", "Targeted Audience", "Fast Growth"],
        description: "Grow your WhatsApp channel with genuine members.",
        badge: "Premium"
    },
    {
        id: 6,
        title: "Whatsapp Channel Members [Non Drop]",
        platform: "whatsapp",
        icon: <SiWhatsapp className="w-8 h-8 text-[#25D366]" />,
        tiers: [{ quantity: 1000, price: 1650 }],
        rating: 4.9,
        reviews: 543,
        features: ["Non-Drop Guarantee", "Permanent Members", "High-Quality"],
        description: "Get permanent, non-drop members for your channel.",
        badge: "Lifetime"
    },
    {
        id: 7,
        title: "Whatsapp Contact Scraper",
        platform: "whatsapp",
        icon: <SiWhatsapp className="w-8 h-8 text-[#25D366]" />,
        tiers: [{ quantity: 1000, price: 1350 }],
        rating: 4.5,
        reviews: 123,
        features: ["Scrape Group Links", "1k/day Speed", "24-48h Start"],
        description: "Scrape contacts from WhatsApp groups.",
        badge: "Utility"
    },
    {
        id: 8,
        title: "Whatsapp Channel Followers",
        platform: "whatsapp",
        icon: <SiWhatsapp className="w-8 h-8 text-[#25D366]" />,
        tiers: [{ quantity: 1000, price: 1650 }],
        rating: 4.7,
        reviews: 234,
        features: ["1k-2k/day Speed", "Non-Drop", "Real Followers"],
        description: "Increase your WhatsApp channel followers.",
        badge: "Growth"
    },
    {
        id: 9,
        title: "WhatsApp Emoji Reactions",
        platform: "whatsapp",
        icon: <SiWhatsapp className="w-8 h-8 text-[#25D366]" />,
        tiers: [
            { quantity: 1000, price: 275 },
            { quantity: 1000, price: 250 }
        ],
        rating: 4.6,
        reviews: 189,
        features: ["Random or Specific Emoji", "Boost Engagement", "Instant Delivery"],
        description: "Add emoji reactions to your WhatsApp messages.",
        badge: "Engagement"
    },
    {
        id: 10,
        title: "Discord 30 Days Online Members",
        platform: "discord",
        icon: <SiDiscord className="w-8 h-8 text-[#7289DA]" />,
        tiers: [{ quantity: 1000, price: 300 }],
        rating: 4.8,
        reviews: 445,
        features: ["Online for 30 Days", "Boosts Server Activity", "Quick Delivery"],
        description: "Add online members to your Discord server for 30 days.",
        badge: "Online"
    },
    {
        id: 11,
        title: "Discord Permanent Offline Members",
        platform: "discord",
        icon: <SiDiscord className="w-8 h-8 text-[#7289DA]" />,
        tiers: [{ quantity: 1000, price: 900 }],
        rating: 4.9,
        reviews: 632,
        features: ["Permanent Members", "Lifetime Guarantee", "Offline Appearance"],
        description: "Get permanent offline members for your Discord server.",
        badge: "Lifetime"
    },
    {
        id: 12,
        title: "YouTube Subscribers [1 Year Refill]",
        platform: "youtube",
        icon: <SiYoutube className="w-8 h-8 text-[#FF0000]" />,
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
        id: 13,
        title: "YouTube Subscribers [No Refill]",
        platform: "youtube",
        icon: <SiYoutube className="w-8 h-8 text-[#FF0000]" />,
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
        id: 14,
        title: "YouTube Likes",
        platform: "youtube",
        icon: <SiYoutube className="w-8 h-8 text-[#FF0000]" />,
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
        id: 15,
        title: "YouTube Views",
        platform: "youtube",
        icon: <SiYoutube className="w-8 h-8 text-[#FF0000]" />,
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
    {
        id: 16,
        title: "Snapchat Followers",
        platform: "snapchat",
        icon: <SiSnapchat className="w-8 h-8 text-[#FFFC00]" />,
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
    {
        id: 17,
        title: "Twitch Followers",
        platform: "twitch",
        icon: <SiTwitch className="w-8 h-8 text-[#9146FF]" />,
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
        id: 18,
        title: "Twitch Views",
        platform: "twitch",
        icon: <SiTwitch className="w-8 h-8 text-[#9146FF]" />,
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
    {
        id: 19,
        title: "Spotify Playlist Followers",
        platform: "spotify",
        icon: <SiSpotify className="w-8 h-8 text-[#1DB954]" />,
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
        id: 20,
        title: "Spotify Profile Followers",
        platform: "spotify",
        icon: <SiSpotify className="w-8 h-8 text-[#1DB954]" />,
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
    {
        id: 21,
        title: "X (Twitter) Followers [No Refill]",
        platform: "twitter",
        icon: <SiX className="w-8 h-8 text-[#000000]" />,
        tiers: [{ quantity: 1000, price: 650 }],
        rating: 4.5,
        reviews: 432,
        features: ["Affordable Growth", "Quick Delivery", "Good for a quick boost"],
        description: "An affordable way to increase your X (Twitter) followers.",
        badge: "Budget"
    },
    {
        id: 22,
        title: "X (Twitter) Followers [Refill]",
        platform: "twitter",
        icon: <SiX className="w-8 h-8 text-[#000000]" />,
        tiers: [{ quantity: 1000, price: 800 }],
        rating: 4.8,
        reviews: 765,
        features: ["Refill Guarantee", "Real Followers", "Stable Growth"],
        description: "Increase your X (Twitter) followers with a refill guarantee.",
        badge: "Refill"
    }
];

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const uploadData = async () => {
    const servicesCollection = collection(db, "services");
    const batch = writeBatch(db);

    servicesData.forEach((service) => {
        // We use the service `id` as the document ID
        const docRef = doc(servicesCollection, service.id.toString());
        batch.set(docRef, service);
    });

    try {
        await batch.commit();
        console.log("✅ Success! All services have been uploaded to Firestore.");
    } catch (error) {
        console.error("❌ Error uploading services: ", error);
    }
};

uploadData();