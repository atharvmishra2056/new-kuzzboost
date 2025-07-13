import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/'); // Redirect to home on successful signup
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/'); // Redirect to home on successful signin
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
            <Tabs defaultValue="signin" className="w-[400px]">
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
                                <Button type="submit" className="w-full glass-button">Sign In</Button>
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
                                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <Button type="submit" className="w-full glass-button">Sign Up</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </Tabs>
        </div>
    );
};

export default AuthPage;