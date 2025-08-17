import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Users, Wallet, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface ReferredUser {
  id: string;
  full_name: string;
  email: string;
  joined_at: string;
}

interface ProfileData {
  referral_enabled: boolean;
  referral_code: string | null;
  credits: number | null;
}

interface ReferredProfile {
  user_id: string;
  full_name: string | null;
  email: string | null;
  created_at: string | null;
}

const Referrals = () => {
  const { currentUser } = useAuth();
  const [referralCode, setReferralCode] = useState('');
  const [credits, setCredits] = useState(0);
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    fetchReferralData();
  }, [currentUser, navigate]);

  const fetchReferralData = async () => {
    setLoading(true);
    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('referral_enabled, referral_code, credits')
        .eq('user_id', currentUser!.id)
        .single();

      if (profileError) throw profileError;

      // For profile
      // @ts-ignore - Suppress type error until types regenerated
      const profile = data as unknown as ProfileData;

      setEnabled(profile.referral_enabled);
      setReferralCode(profile.referral_code || '');
      setCredits(Number(profile.credits) || 0);

      if (!profile.referral_enabled) return;

      // For referrals query
      // @ts-ignore - Suppress type error until types regenerated
      const { data: referralData, error: refError } = await (supabase as any)
        .from('referrals')
        .select('referred_id')
        .eq('referrer_id', currentUser!.id);

      if (refError) throw refError;

      if (referralData.length === 0) {
        setReferredUsers([]);
        return;
      }

      // For referredIds
      // @ts-ignore - Suppress type error until types regenerated
      const referredIds = referralData.map(r => r.referred_id);

      // For profilesData query
      // @ts-ignore - Suppress type error until types regenerated
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email, created_at')
        .in('user_id', referredIds);

      if (profilesError) throw profilesError;

      // For typedProfiles
      // @ts-ignore - Suppress type error until types regenerated
      const typedProfiles = profilesData as ReferredProfile[];

      setReferredUsers(typedProfiles.map(p => ({
        id: p.user_id,
        full_name: p.full_name || 'Anonymous',
        email: p.email || '',
        joined_at: p.created_at || ''
      })));
    } catch (error) {
      console.error('Error fetching referral data:', error);
      toast({ title: "Error", description: "Failed to load referral data. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const inviteLink = `${window.location.origin}/auth?tab=signup&ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({ title: "Copied", description: "Invite link copied to clipboard" });
  };

  const redeemable = credits >= 100 ? Math.floor((credits / 5)) * 4 : 0;

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  if (!enabled) return (
    <div className="container mx-auto py-8 text-center">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Referral Program</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The referral program is not enabled for your account. Contact support if you believe this is an error.</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Referrals</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wallet className="w-5 h-5" /> Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{credits} Credits</p>
            {credits >= 100 && (
              <p className="mt-2">Redeemable: ₹{redeemable.toFixed(2)} (5 credits = ₹4)</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Copy className="w-5 h-5" /> Invite Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input value={inviteLink} readOnly />
              <Button onClick={handleCopyLink}>Copy</Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Share this link to earn 2% credits on referrals' purchases.</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Referred Users ({referredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {referredUsers.length === 0 ? (
            <p>No referred users yet. Start sharing your link!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{new Date(user.joined_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Referrals;
