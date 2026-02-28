import { useState } from 'react';
import { useCurrentUserId, useIsCurrentUserAdmin } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, Users, CreditCard, Lock, AlertTriangle } from 'lucide-react';
import CandidatesManagement from '../components/admin/CandidatesManagement';
import PaymentMonitoring from '../components/admin/PaymentMonitoring';
import LockedChatsMonitor from '../components/admin/LockedChatsMonitor';

export default function AdminPage() {
  const { data: userId, isLoading: userIdLoading } = useCurrentUserId();
  const { data: isAdmin, isLoading: adminLoading } = useIsCurrentUserAdmin();
  const [activeTab, setActiveTab] = useState('candidates');

  const isLoading = userIdLoading || adminLoading;

  if (!userId && !isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Admin Login Required</h2>
          <p className="text-muted-foreground mb-6">
            Please login with admin credentials (phone: admin, password: admin123) to access the admin panel.
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
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You do not have admin privileges to access this panel.
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-white/75 text-sm">Vivah Connect — Mediator Control Panel</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full mb-6 bg-secondary">
            <TabsTrigger value="candidates" className="text-sm gap-1.5">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Candidates</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-sm gap-1.5">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="locked-chats" className="text-sm gap-1.5">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Locked Chats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="candidates">
            <CandidatesManagement />
          </TabsContent>
          <TabsContent value="payments">
            <PaymentMonitoring />
          </TabsContent>
          <TabsContent value="locked-chats">
            <LockedChatsMonitor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
