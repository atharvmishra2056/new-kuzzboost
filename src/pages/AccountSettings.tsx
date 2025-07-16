// src/pages/AccountSettings.tsx

import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft } from 'lucide-react';

// Validation Schema for updating user profile
const profileFormSchema = z.object({
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }).max(50, { message: "Full name is too long." }),
    email: z.string().email(),
});

// Validation Schema for changing password
const passwordFormSchema = z.object({
    newPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});


const AccountSettings = () => {
    const { currentUser, session } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const profileForm = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            fullName: currentUser?.user_metadata.full_name || "",
            email: currentUser?.email || "",
        },
    });

    const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
        const { error } = await supabase.auth.updateUser({
            data: { full_name: values.fullName }
        });

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Your profile has been updated." });
        }
    }

    async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
        const { error } = await supabase.auth.updateUser({
            password: values.newPassword
        });

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Your password has been changed successfully." });
            passwordForm.reset();
        }
    }

    if (!currentUser) {
        navigate('/auth');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-hero">
            <Navigation />
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/account')} className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Account
                        </Button>
                    </div>

                    <h1 className="font-clash text-3xl md:text-4xl font-bold text-primary">Account Settings</h1>

                    {/* Update Profile Section */}
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal details here.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...profileForm}>
                                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                                    <FormField
                                        control={profileForm.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={profileForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl><Input placeholder="Your email" {...field} disabled /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                                        {profileForm.formState.isSubmitting ? "Saving..." : "Save Changes"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    {/* Change Password Section */}
                    {session?.user.app_metadata.provider === 'email' && (
                        <Card className="glass">
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>Update your password here. You will be logged out after a successful change.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...passwordForm}>
                                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                                        <FormField
                                            control={passwordForm.control}
                                            name="newPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>New Password</FormLabel>
                                                    <FormControl><Input type="password" placeholder="New password" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={passwordForm.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirm New Password</FormLabel>
                                                    <FormControl><Input type="password" placeholder="Confirm new password" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                                            {passwordForm.formState.isSubmitting ? "Changing..." : "Change Password"}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AccountSettings;