// src/pages/AuthPage.tsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from "@/hooks/use-toast";
import { MailCheck } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showVerificationMessage, setShowVerificationMessage] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth(); // Get currentUser from context

    const searchParams = new URLSearchParams(location.search);
    const defaultTab = searchParams.get('tab') || 'signin';

    // This useEffect will redirect the user if they are already logged in
    // or after they successfully log in.
    useEffect(() => {
        if (currentUser) {
            navigate('/account');
        }
    }, [currentUser, navigate]);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/`
            }
        });
        if (error) {
            setError(error.message);
        } else {
            setShowVerificationMessage(true);
        }
        setLoading(false);
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            setError(error.message);
        }
        // We no longer navigate here. The useEffect will handle it when currentUser updates.
        setLoading(false);
    };

    const handlePasswordReset = async () => {
        if (!resetEmail) {
            toast({ title: "Error", description: "Please enter your email address.", variant: "destructive"});
            return;
        }
        const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
            redirectTo: `${window.location.origin}/update-password`,
        });

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive"});
        } else {
            toast({ title: "Success", description: "Password reset link sent! Please check your email."});
        }
    };

    if (showVerificationMessage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
                <Card className="glass w-[400px] text-center">
                    <CardHeader>
                        <MailCheck className="w-16 h-16 mx-auto text-green-500" />
                        <CardTitle className="font-clash text-2xl text-primary mt-4">Check your inbox!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">We've sent a verification link to <strong>{email}</strong>. Please click the link to complete your registration.</p>
                        <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">
                            <Button className="w-full glass-button">Open Gmail</Button>
                        </a>
                        <Button variant="link" onClick={() => setShowVerificationMessage(false)}>Back to Sign In</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
            <Tabs defaultValue={defaultTab} className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle className="font-clash text-2xl text-primary">Sign In</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSignIn} className="space-y-4">
                                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <div className="text-right">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="link" className="p-0 h-auto text-xs">Forgot Password?</Button>
                                        </DialogTrigger>
                                        <DialogContent className="glass">
                                            <DialogHeader>
                                                <DialogTitle>Reset Password</DialogTitle>
                                                <DialogDescription>Enter your email address to receive a password reset link.</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-2">
                                                <Label htmlFor="reset-email">Email Address</Label>
                                                <Input id="reset-email" type="email" placeholder="you@example.com" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
                                            </div>
                                            <DialogFooter>
                                                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                                                <Button type="button" onClick={handlePasswordReset}>Send Reset Link</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <Button type="submit" className="w-full glass-button" disabled={loading}>
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="signup">
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle className="font-clash text-2xl text-primary">Sign Up</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSignUp} className="space-y-4">
                                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <Input type="password" placeholder="Password (min. 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <Button type="submit" className="w-full glass-button" disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                {error && <p className="text-red-500 text-center mt-4 text-sm">{error}</p>}
            </Tabs>
        </div>
    );
};

export default AuthPage;