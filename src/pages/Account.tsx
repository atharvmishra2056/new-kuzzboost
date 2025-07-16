// src/pages/Account.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useWishlist } from "@/hooks/useWishlist";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShoppingCart, Heart, Settings, LifeBuoy, LogOut, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";

const StatCard = ({ icon, title, value, label }: { icon: React.ReactNode, title: string, value: number | string, label: string }) => (
    <motion.div whileHover={{ scale: 1.05 }} className="h-full">
        <Card className="glass h-full">
            <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 mb-4 rounded-full bg-accent-peach/20 flex items-center justify-center text-accent-peach">
                    {icon}
                </div>
                <p className="text-2xl font-bold font-clash text-primary">{value}</p>
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </CardContent>
        </Card>
    </motion.div>
);

const ActionButton = ({ icon, title, onClick }: { icon: React.ReactNode, title: string, onClick: () => void }) => (
    <motion.div whileHover={{ scale: 1.02 }}>
        <Button variant="outline" className="w-full justify-start p-6 text-base" onClick={onClick}>
            {icon}
            <span>{title}</span>
        </Button>
    </motion.div>
);


const Account = () => {
    const { currentUser, signOut } = useAuth();
    const { wishlistCount } = useWishlist();
    const navigate = useNavigate();
    const [orderCount, setOrderCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            navigate('/auth');
            return;
        }

        const fetchOrderCount = async () => {
            const { count, error } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', currentUser.id);

            if (error) {
                console.error("Error fetching order count:", error);
            } else {
                setOrderCount(count || 0);
            }
            setLoading(false);
        };

        fetchOrderCount();
    }, [currentUser, navigate]);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    if (loading || !currentUser) {
        return (
            <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-hero">
            <Navigation />
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Profile Header */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="glass">
                            <CardContent className="pt-6 flex flex-col md:flex-row items-center gap-6">
                                <Avatar className="w-20 h-20">
                                    <AvatarImage src={currentUser.user_metadata.avatar_url} alt={currentUser.email} />
                                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                                        {currentUser.email?.[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-center md:text-left">
                                    <h2 className="text-2xl font-bold text-primary">{currentUser.user_metadata.full_name || currentUser.email}</h2>
                                    <p className="text-muted-foreground">{currentUser.email}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Joined on {new Date(currentUser.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="md:ml-auto flex flex-col items-center md:items-end gap-2">
                                    <Button variant="outline" onClick={() => navigate('/account-settings')}>Edit Profile</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <StatCard icon={<ShoppingCart />} title="Total Orders" value={orderCount} label="Lifetime orders" />
                        <StatCard icon={<Heart />} title="Wishlist Items" value={wishlistCount} label="Saved services" />
                        <StatCard icon={<UserIcon />} title="Loyalty Points" value="Coming Soon" label="Earn rewards" />
                    </div>

                    {/* Quick Actions */}
                    <Card className="glass">
                        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ActionButton icon={<ShoppingCart className="mr-2"/>} title="View Order History" onClick={() => navigate('/order-history')} />
                            <ActionButton icon={<Heart className="mr-2"/>} title="Manage Wishlist" onClick={() => navigate('/wishlist')} />
                            <ActionButton icon={<Settings className="mr-2"/>} title="Account Settings" onClick={() => navigate('/account-settings')} />
                            <ActionButton icon={<LifeBuoy className="mr-2"/>} title="Contact Support" onClick={() => window.location.href='mailto:support@kuzzboost.com'} />
                        </CardContent>
                    </Card>

                    <div className="text-center">
                        <Button variant="ghost" onClick={handleSignOut} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <LogOut className="mr-2"/>
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Account;