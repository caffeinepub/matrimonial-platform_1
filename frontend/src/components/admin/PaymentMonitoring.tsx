import { useGetAllPayments, useGetAllProfiles } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { IndianRupee, CreditCard, Loader2, TrendingUp } from 'lucide-react';
import type { Payment } from '../../lib/localStorage';

const SERVICE_LABELS: Record<Payment['serviceType'], string> = {
  'chat-unlock': 'Chat Unlock',
  'phone-reveal': 'Phone Reveal',
  'profile-view': 'Profile View',
};

const STATUS_COLORS: Record<Payment['status'], string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-300',
  confirmed: 'bg-green-100 text-green-700 border-green-300',
  failed: 'bg-red-100 text-red-700 border-red-300',
};

export default function PaymentMonitoring() {
  const { data: payments = [], isLoading } = useGetAllPayments();
  const { data: allProfiles = [] } = useGetAllProfiles();

  const getProfileName = (userId: string) =>
    allProfiles.find((p) => p.id === userId)?.fullName ?? userId.slice(0, 8) + '...';

  const confirmedPayments = payments.filter((p) => p.status === 'confirmed');
  const totalRevenue = confirmedPayments.reduce((sum, p) => sum + p.amount, 0);
  const chatUnlocks = payments.filter((p) => p.serviceType === 'chat-unlock').length;
  const phoneReveals = payments.filter((p) => p.serviceType === 'phone-reveal').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="card-matrimonial">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <p className="font-serif text-xl font-bold text-foreground">₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-matrimonial">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Transactions</p>
              <p className="font-serif text-xl font-bold text-foreground">{payments.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-matrimonial">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Chat Unlocks</p>
              <p className="font-serif text-xl font-bold text-foreground">{chatUnlocks}</p>
              <p className="text-xs text-muted-foreground">₹{(chatUnlocks * 200).toLocaleString('en-IN')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-matrimonial">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone Reveals</p>
              <p className="font-serif text-xl font-bold text-foreground">{phoneReveals}</p>
              <p className="text-xs text-muted-foreground">₹{(phoneReveals * 250).toLocaleString('en-IN')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="card-matrimonial">
        <CardHeader>
          <CardTitle className="font-serif text-base">All Transactions ({payments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No transactions yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">User</TableHead>
                    <TableHead className="text-xs">Service</TableHead>
                    <TableHead className="text-xs">Amount</TableHead>
                    <TableHead className="text-xs">UPI ID</TableHead>
                    <TableHead className="text-xs">Reference</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="text-xs">
                        {new Date(payment.createdAt).toLocaleDateString('en-IN')}
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {getProfileName(payment.userId)}
                      </TableCell>
                      <TableCell className="text-xs">
                        {SERVICE_LABELS[payment.serviceType]}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-green-700">
                        ₹{payment.amount}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {payment.upiId}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {payment.reference}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${STATUS_COLORS[payment.status]} text-xs`}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
