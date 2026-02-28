import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle, Send, Lock, AlertTriangle, Loader2, CreditCard, CheckCircle, Users
} from "lucide-react";
import { UserProfile, getProfileById } from "../../lib/localStorage";
import { detectContactInfo } from "../../lib/utils";
import {
  useGetMutualMatches,
  useGetChatUnlockStatus,
  useSubmitChatUnlockPayment,
  useGetMessages,
  useSendMessage,
  useLockChat,
} from "../../hooks/useQueries";

interface ChatsSectionProps {
  profile: UserProfile;
  initialMatchId?: string;
}

// ─── Payment Gate ─────────────────────────────────────────────────────────────

function PaymentGate({
  matchId,
  userId,
  match,
  otherProfile,
  onPaid,
}: {
  matchId: string;
  userId: string;
  match: any;
  otherProfile: UserProfile | null;
  onPaid: () => void;
}) {
  const [upiId, setUpiId] = useState("8456916064@ybl");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const submitPayment = useSubmitChatUnlockPayment();

  const isUser1 = match?.user1Id === userId;
  const currentUserPaid = isUser1 ? match?.user1Paid : match?.user2Paid;
  const otherUserPaid = isUser1 ? match?.user2Paid : match?.user1Paid;

  const handlePay = async () => {
    if (!reference.trim()) { setError("Please enter UPI transaction reference"); return; }
    setError("");
    try {
      await submitPayment.mutateAsync({ userId, matchId, upiId, reference });
      onPaid();
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (currentUserPaid && !otherUserPaid) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 px-6">
        <CheckCircle className="w-16 h-16 text-green-500" />
        <h3 className="text-xl font-bold text-foreground">Payment Confirmed!</h3>
        <p className="text-muted-foreground text-center">
          Waiting for <strong>{otherProfile?.fullName}</strong> to complete their ₹200 payment to unlock chat.
        </p>
        <Badge variant="outline" className="text-yellow-700 border-yellow-300">Waiting for other user</Badge>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-6 max-w-md mx-auto px-6">
      <div className="text-center">
        <CreditCard className="w-16 h-16 text-primary mx-auto mb-3" />
        <h3 className="text-xl font-bold text-foreground">Unlock Chat</h3>
        <p className="text-muted-foreground mt-1">
          Pay ₹200 to start chatting with <strong>{otherProfile?.fullName}</strong>
        </p>
        <p className="text-xs text-muted-foreground mt-1">Both users must pay to unlock chat</p>
      </div>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      <div className="w-full space-y-4">
        <div className="p-4 bg-muted/30 rounded-lg space-y-2">
          <p className="text-sm font-medium">Pay ₹200 to any of these UPI IDs:</p>
          <code className="block text-sm bg-background p-2 rounded border">8456916064@ybl</code>
          <code className="block text-sm bg-background p-2 rounded border">6370081492@ybl</code>
        </div>
        <div>
          <Label>UPI ID Used</Label>
          <Select value={upiId} onValueChange={setUpiId}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="8456916064@ybl">8456916064@ybl</SelectItem>
              <SelectItem value="6370081492@ybl">6370081492@ybl</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Transaction Reference / UTR *</Label>
          <Input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Enter UPI transaction reference"
            className="mt-1"
          />
        </div>
        <Button className="w-full btn-matrimonial" onClick={handlePay} disabled={submitPayment.isPending}>
          {submitPayment.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Confirm Payment &amp; Unlock Chat
        </Button>
      </div>
    </div>
  );
}

// ─── Chat Thread ──────────────────────────────────────────────────────────────

function ChatThread({
  matchId,
  currentUserId,
  otherProfile,
  match,
}: {
  matchId: string;
  currentUserId: string;
  otherProfile: UserProfile | null;
  match: any;
}) {
  const [messageText, setMessageText] = useState("");
  const [contactWarning, setContactWarning] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages = [] } = useGetMessages(matchId);
  const sendMessage = useSendMessage();
  const lockChat = useLockChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!messageText.trim()) return;

    const detection = detectContactInfo(messageText);
    if (detection.detected) {
      setContactWarning(
        `Message blocked: Contains ${detection.type}. Sharing contact info is not allowed. Chat will be locked.`
      );
      await lockChat.mutateAsync({
        matchId,
        participantIds: [currentUserId, otherProfile?.id ?? ""],
        reason: `Contact info detected: ${detection.type}`,
      });
      setMessageText("");
      return;
    }

    try {
      await sendMessage.mutateAsync({
        matchId,
        senderId: currentUserId,
        receiverId: otherProfile?.id ?? "",
        text: messageText.trim(),
      });
      setMessageText("");
      setContactWarning("");
    } catch (e: any) {
      setContactWarning(e.message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (match?.isLocked) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 px-6">
        <Lock className="w-16 h-16 text-destructive" />
        <h3 className="text-xl font-bold text-destructive">Chat Locked</h3>
        <p className="text-muted-foreground text-center">
          This chat has been locked due to a policy violation.
        </p>
        {match.lockReason && <Badge variant="destructive">{match.lockReason}</Badge>}
        <p className="text-sm text-muted-foreground">Please contact admin to unlock.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {contactWarning && (
        <Alert variant="destructive" className="m-3">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>{contactWarning}</AlertDescription>
        </Alert>
      )}

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Start your conversation!</p>
              <p className="text-xs mt-1 italic opacity-70">
                Do not share phone numbers, emails, or UPI IDs in chat.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                      isMe
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-foreground rounded-bl-sm"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border flex gap-2">
        <Input
          placeholder="Type a message... (no contact info allowed)"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="text-sm"
          disabled={sendMessage.isPending || lockChat.isPending}
        />
        <Button
          onClick={handleSend}
          disabled={!messageText.trim() || sendMessage.isPending || lockChat.isPending}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          size="icon"
        >
          {sendMessage.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}

// ─── Main ChatsSection ────────────────────────────────────────────────────────

export default function ChatsSection({ profile, initialMatchId }: ChatsSectionProps) {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(initialMatchId ?? null);
  const [paidRefresh, setPaidRefresh] = useState(0);

  const { data: mutualMatches = [], isLoading } = useGetMutualMatches(profile.id);
  const { data: selectedMatchData } = useGetChatUnlockStatus(selectedMatchId);

  const selectedEntry = mutualMatches.find((m) => m.match.id === selectedMatchId);
  const otherProfile = selectedEntry?.profile ?? null;

  // Use live match data from status query if available, else from list
  const liveMatch = selectedMatchData ?? selectedEntry?.match ?? null;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (mutualMatches.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Chats Yet</h3>
        <p className="text-sm text-muted-foreground">Like profiles and get mutual matches to start chatting!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      {/* Match List */}
      <div className="space-y-2 overflow-y-auto">
        {mutualMatches.map(({ match, profile: otherP }) => (
          <Card
            key={match.id}
            className={`card-matrimonial cursor-pointer transition-all hover:shadow-md ${
              selectedMatchId === match.id ? "border-primary shadow-md" : ""
            }`}
            onClick={() => setSelectedMatchId(match.id)}
          >
            <CardContent className="p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-border shrink-0 bg-primary/20 flex items-center justify-center">
                <span className="font-bold text-primary text-sm">{otherP?.fullName?.[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{otherP?.fullName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {match.isLocked ? (
                    <Badge className="text-xs bg-red-100 text-red-600 border-red-200">🔒 Locked</Badge>
                  ) : match.chatUnlocked ? (
                    <Badge className="text-xs bg-green-100 text-green-600 border-green-200">💬 Active</Badge>
                  ) : (
                    <Badge className="text-xs bg-amber-100 text-amber-600 border-amber-200">💰 Pay ₹200</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chat / Payment Area */}
      <div className="md:col-span-2">
        {!selectedMatchId || !liveMatch ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Select a match to start chatting</p>
            </div>
          </div>
        ) : (
          <Card className="card-matrimonial overflow-hidden h-full flex flex-col">
            {/* Header */}
            <CardHeader className="py-3 px-4 border-b border-border flex flex-row items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="font-bold text-primary text-sm">{otherProfile?.fullName?.[0]}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{otherProfile?.fullName}</p>
                {liveMatch.isLocked && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Chat Locked
                  </p>
                )}
                {liveMatch.chatUnlocked && !liveMatch.isLocked && (
                  <p className="text-xs text-green-600">Chat Active</p>
                )}
              </div>
            </CardHeader>

            {/* Body */}
            <div className="flex-1 overflow-hidden">
              {liveMatch.chatUnlocked ? (
                <ChatThread
                  matchId={selectedMatchId}
                  currentUserId={profile.id}
                  otherProfile={otherProfile}
                  match={liveMatch}
                />
              ) : (
                <PaymentGate
                  matchId={selectedMatchId}
                  userId={profile.id}
                  match={liveMatch}
                  otherProfile={otherProfile}
                  onPaid={() => setPaidRefresh((n) => n + 1)}
                />
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
