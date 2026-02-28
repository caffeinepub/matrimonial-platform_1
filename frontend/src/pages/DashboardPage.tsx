import { useState } from 'react';
import { useCurrentProfile, useCurrentUserId } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { User, Heart, MessageCircle, CreditCard, AlertCircle, LogIn } from 'lucide-react';
import ProfileSection from '../components/dashboard/ProfileSection';
import MatchesSection from '../components/dashboard/MatchesSection';
import ChatsSection from '../components/dashboard/ChatsSection';
import PaymentsSection from '../components/dashboard/PaymentsSection';
import type { UserProfile } from '../lib/localStorage';

function calcProfileCompletion(profile: UserProfile | null | undefined): number {
  if (!profile) return 0;
  const fields = [
    profile.fullName, profile.gender, profile.dateOfBirth, profile.height,
    profile.religion, profile.caste, profile.motherTongue, profile.maritalStatus,
    profile.state, profile.city, profile.qualification, profile.jobType,
    profile.fatherName, profile.motherName, profile.familyType,
  ];
  const filled = fields.filter((f) => f && f.toString().trim() !== '').length;
  const photoBonus = profile.photoCount >= 4 ? 1 : 0;
  return Math.round(((filled + photoBonus) / (fields.length + 1)) * 100);
}

export default function DashboardPage() {
  const { data: userId } = useCurrentUserId();
  const { data: userProfile, isLoading } = useCurrentProfile();
  const [activeTab, setActiveTab] = useState('profile');
  const [chatMatchId, setChatMatchId] = useState<string | undefined>(undefined);

  if (!userId && !isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Login Required</h2>
          <p className="text-muted-foreground mb-6">
            Please login to access your dashboard and find your perfect match.
          </p>
          <Button className="btn-matrimonial" onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-24 w-full mb-6 rounded-xl" />
        <Skeleton className="h-12 w-full mb-4 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Complete Registration</h2>
          <p className="text-muted-foreground mb-6">
            You need to register first to access your dashboard.
          </p>
          <Button className="btn-matrimonial" onClick={() => window.location.href = '/register'}>
            Register Now
          </Button>
        </div>
      </div>
    );
  }

  const completion = calcProfileCompletion(userProfile);

  const handleOpenChat = (matchId: string) => {
    setChatMatchId(matchId);
    setActiveTab('chats');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold">
                  {userProfile.fullName || 'Welcome!'}
                </h1>
                <p className="text-white/80 text-sm">
                  {userProfile.city && userProfile.state
                    ? `${userProfile.city}, ${userProfile.state}`
                    : 'Complete your profile to get started'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`text-xs ${
                    userProfile.status === 'approved' ? 'bg-green-500/20 text-green-100 border-green-400/50' :
                    userProfile.status === 'rejected' ? 'bg-red-500/20 text-red-100 border-red-400/50' :
                    userProfile.status === 'suspended' ? 'bg-gray-500/20 text-gray-100 border-gray-400/50' :
                    'bg-amber-500/20 text-amber-100 border-amber-400/50'
                  }`}>
                    {userProfile.status === 'approved' ? '✓ Approved' :
                     userProfile.status === 'rejected' ? '✗ Rejected' :
                     userProfile.status === 'suspended' ? '⊘ Suspended' :
                     '⏳ Pending Approval'}
                  </Badge>
                  {userProfile.photoCount < 4 && (
                    <Badge className="text-xs bg-red-500/20 text-red-100 border-red-400/50">
                      {userProfile.photoCount}/4 Photos
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full md:w-48">
              <div className="flex justify-between text-xs text-white/80 mb-1">
                <span>Profile Completion</span>
                <span>{completion}%</span>
              </div>
              <Progress value={completion} className="h-2 bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full mb-6 bg-secondary">
            <TabsTrigger value="profile" className="text-sm gap-1.5">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="matches" className="text-sm gap-1.5">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Matches</span>
            </TabsTrigger>
            <TabsTrigger value="chats" className="text-sm gap-1.5">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Chats</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-sm gap-1.5">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSection profile={userProfile} />
          </TabsContent>
          <TabsContent value="matches">
            <MatchesSection profile={userProfile} onOpenChat={handleOpenChat} />
          </TabsContent>
          <TabsContent value="chats">
            <ChatsSection profile={userProfile} initialMatchId={chatMatchId} />
          </TabsContent>
          <TabsContent value="payments">
            <PaymentsSection userId={userProfile.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
