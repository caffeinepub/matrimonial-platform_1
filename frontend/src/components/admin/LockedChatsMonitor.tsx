import { useGetLockedChats, useUnlockChat, useGetAllProfiles } from '../../hooks/useQueries';
import { getMatchById } from '../../lib/localStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Lock, Unlock, Loader2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import type { LockedChat } from '../../lib/localStorage';

export default function LockedChatsMonitor() {
  const { data: lockedChats = [], isLoading } = useGetLockedChats();
  const { data: allProfiles = [] } = useGetAllProfiles();
  const unlockChat = useUnlockChat();

  const handleUnlock = async (matchId: string) => {
    try {
      await unlockChat.mutateAsync(matchId);
      toast.success('Chat unlocked successfully');
    } catch {
      toast.error('Failed to unlock chat');
    }
  };

  const getProfileName = (userId: string) => {
    return allProfiles.find((p) => p.id === userId)?.fullName ?? userId.slice(0, 8) + '...';
  };

  return (
    <div className="space-y-4">
      {/* Privacy Notice */}
      <Alert className="border-blue-300 bg-blue-50">
        <ShieldAlert className="w-4 h-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-700">
          <strong>Privacy Protected:</strong> Only metadata is visible here. Message content is private and
          never accessible to admin. Chats are auto-locked when contact information is detected.
        </AlertDescription>
      </Alert>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="card-matrimonial">
          <CardContent className="p-4 text-center">
            <p className="font-serif text-2xl font-bold text-destructive">{lockedChats.length}</p>
            <p className="text-xs text-muted-foreground">Total Locked</p>
          </CardContent>
        </Card>
        <Card className="card-matrimonial">
          <CardContent className="p-4 text-center">
            <p className="font-serif text-2xl font-bold text-amber-600">
              {lockedChats.filter((c) => c.reason.includes('Contact')).length}
            </p>
            <p className="text-xs text-muted-foreground">Contact Info Violations</p>
          </CardContent>
        </Card>
        <Card className="card-matrimonial">
          <CardContent className="p-4 text-center">
            <p className="font-serif text-2xl font-bold text-green-600">0</p>
            <p className="text-xs text-muted-foreground">Message Content Visible</p>
          </CardContent>
        </Card>
      </div>

      {/* Locked Chats Table */}
      <Card className="card-matrimonial">
        <CardHeader>
          <CardTitle className="font-serif text-base flex items-center gap-2">
            <Lock className="w-4 h-4 text-destructive" />
            Locked Chats ({lockedChats.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : lockedChats.length === 0 ? (
            <div className="text-center py-8">
              <Lock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No locked chats. All conversations are clean!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Participants</TableHead>
                    <TableHead className="text-xs">Lock Reason</TableHead>
                    <TableHead className="text-xs">Locked At</TableHead>
                    <TableHead className="text-xs">Message Content</TableHead>
                    <TableHead className="text-xs">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lockedChats.map((chat: LockedChat) => (
                    <TableRow key={chat.id}>
                      <TableCell>
                        <div className="space-y-1">
                          {chat.participantIds.map((pid) => (
                            <p key={pid} className="text-xs font-medium">{getProfileName(pid)}</p>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive" className="text-xs">
                          {chat.reason || 'Contact info detected'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(chat.lockedAt).toLocaleDateString('en-IN')}
                        {' '}
                        {new Date(chat.lockedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs text-green-700 border-green-300">
                          🔒 Private — Not Accessible
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 text-xs border-green-300 text-green-700 hover:bg-green-50"
                          onClick={() => handleUnlock(chat.matchId)}
                          disabled={unlockChat.isPending}
                        >
                          {unlockChat.isPending ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Unlock className="w-3 h-3" />
                          )}
                          Unlock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy Guarantee */}
      <Alert className="border-green-300 bg-green-50">
        <ShieldAlert className="w-4 h-4 text-green-600" />
        <AlertDescription className="text-sm text-green-700">
          <strong>Privacy Guarantee:</strong> Zero message content is stored or accessible by admin.
          Only lock metadata (participants, timestamp, reason) is recorded. This ensures user privacy
          while maintaining platform safety.
        </AlertDescription>
      </Alert>
    </div>
  );
}
