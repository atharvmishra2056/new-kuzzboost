// src/pages/Account.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useWishlist } from "@/hooks/useWishlist";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Settings, LifeBuoy, User as UserIcon, MapPin, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from '@/hooks/use-toast';
import AddressBook from '@/components/AddressBook';

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
    const { currentUser } = useAuth();
    const { wishlistCount } = useWishlist();
    const navigate = useNavigate();
    const [orderCount, setOrderCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

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

    if (loading || !currentUser) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary font-clash">My Account</h1>
                    <p className="text-muted-foreground mt-2">Manage your profile, addresses, and account settings</p>
                </div>

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
                                <Button variant="outline" onClick={() => navigate('/dashboard/account-settings')}>Edit Profile</Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <StatCard icon={<ShoppingCart />} title="Total Orders" value={orderCount} label="Lifetime orders" />
                    <StatCard icon={<UserIcon />} title="Loyalty Points" value="Coming Soon" label="Earn rewards" />
                </div>

                {/* Tabs for different sections */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="addresses">Address Book</TabsTrigger>
                        <TabsTrigger value="payment">Payment Methods</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        {/* Quick Actions */}
                        <Card className="glass">
                            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ActionButton icon={<ShoppingCart className="mr-2"/>} title="View Order History" onClick={() => navigate('/dashboard/orders')} />
                                <ActionButton icon={<Settings className="mr-2"/>} title="Account Settings" onClick={() => navigate('/dashboard/account-settings')} />
                                <ActionButton icon={<MapPin className="mr-2"/>} title="Manage Addresses" onClick={() => {}} />
                                <ActionButton icon={<LifeBuoy className="mr-2"/>} title="Contact Support" onClick={() => window.location.href='mailto:support@kuzzboost.com'} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="addresses">
                        <AddressBook />
                    </TabsContent>

                    <TabsContent value="payment">
                        <Card className="glass">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Payment Methods
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-12 text-center">
                                <CreditCard className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold text-primary mb-2">Payment methods coming soon</h3>
                                <p className="text-muted-foreground">
                                    We're working on adding saved payment methods for faster checkout.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Account;