import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Heart, X, MapPin, GraduationCap, Briefcase, Phone, Eye, MessageCircle, Star, Loader2, CheckCircle, Users
} from "lucide-react";
import { UserProfile } from "../../lib/localStorage";
import { blurPhoneNumber } from "../../lib/utils";
import {
  useGetMatches,
  useGetMutualMatches,
  useLikeProfile,
  useRejectProfile,
  useRevealPhoneNumber,
  useGetRevealedPhones,
  useGetUserPhotos,
} from "../../hooks/useQueries";

interface MatchesSectionProps {
  profile: UserProfile;
  onOpenChat?: (matchId: string, otherUserId: string) => void;
}

function CompatibilityBadge({ score }: { score: number }) {
  const color =
    score >= 75 ? "bg-green-100 text-green-700 border-green-300" :
    score >= 50 ? "bg-yellow-100 text-yellow-700 border-yellow-300" :
    "bg-orange-100 text-orange-700 border-orange-300";
  return (
    <Badge className={`${color} font-bold text-sm px-2 py-1`}>
      <Star className="w-3 h-3 mr-1 fill-current" />
      {score}% Match
    </Badge>
  );
}

function MatchCard({
  candidate,
  currentUserId,
  onLike,
  onReject,
  liking,
  rejecting,
}: {
  candidate: UserProfile & { compatibilityScore?: number };
  currentUserId: string;
  onLike: () => void;
  onReject: () => void;
  liking: boolean;
  rejecting: boolean;
}) {
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [upiId, setUpiId] = useState("8456916064@ybl");
  const [reference, setReference] = useState("");
  const [revealError, setRevealError] = useState("");
  const [revealedPhone, setRevealedPhone] = useState<string | null>(null);

  const { data: revealedPhones = [] } = useGetRevealedPhones(currentUserId);
  const { data: photos = [] } = useGetUserPhotos(candidate.id);
  const revealPhone = useRevealPhoneNumber();

  const isRevealed = revealedPhones.includes(candidate.id) || !!revealedPhone;
  const displayPhone = isRevealed ? (revealedPhone || candidate.phone) : blurPhoneNumber(candidate.phone);

  const handleRevealPhone = async () => {
    if (!reference.trim()) { setRevealError("Please enter a UPI reference/transaction ID"); return; }
    setRevealError("");
    try {
      const phone = await revealPhone.mutateAsync({
        userId: currentUserId,
        candidateId: candidate.id,
        upiId,
        reference,
      });
      setRevealedPhone(phone);
      setShowPhoneDialog(false);
    } catch (e: any) {
      setRevealError(e.message);
    }
  };

  const mainPhoto = photos[0]?.url;
  const score = candidate.compatibilityScore ?? 50;

  return (
    <>
      <Card className="card-matrimonial overflow-hidden hover:shadow-lg transition-shadow">
        {/* Photo */}
        <div className="relative h-48 bg-muted">
          {mainPhoto ? (
            <img src={mainPhoto} alt={candidate.fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{candidate.fullName?.[0]}</span>
              </div>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <CompatibilityBadge score={score} />
          </div>
          {photos.length > 1 && (
            <div className="absolute bottom-2 right-2">
              <Badge variant="outline" className="bg-black/50 text-white border-white/30 text-xs">
                +{photos.length - 1} photos
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-lg text-foreground">{candidate.fullName}</h3>
            <p className="text-sm text-muted-foreground">
              {candidate.age} yrs • {candidate.height || "N/A"} • {candidate.maritalStatus}
            </p>
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>{[candidate.city, candidate.state].filter(Boolean).join(", ") || "Location N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="w-3 h-3 shrink-0" />
              <span>{candidate.qualification || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="w-3 h-3 shrink-0" />
              <span>{candidate.jobType || "N/A"}{candidate.company ? ` • ${candidate.company}` : ""}</span>
            </div>
          </div>

          {/* Religion/Caste */}
          <div className="flex flex-wrap gap-1">
            {candidate.religion && <Badge variant="outline" className="text-xs">{candidate.religion}</Badge>}
            {candidate.caste && <Badge variant="outline" className="text-xs">{candidate.caste}</Badge>}
            {candidate.manglikStatus && <Badge variant="outline" className="text-xs">{candidate.manglikStatus}</Badge>}
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
            <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className={`text-sm font-mono flex-1 ${!isRevealed ? "blur-sm select-none" : ""}`}>
              {displayPhone}
            </span>
            {!isRevealed ? (
              <Button size="sm" variant="outline" className="text-xs h-7 px-2" onClick={() => setShowPhoneDialog(true)}>
                <Eye className="w-3 h-3 mr-1" />₹250
              </Button>
            ) : (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </div>

          {/* Compatibility bar */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden cursor-help">
                  <div
                    className={`h-full rounded-full transition-all ${
                      score >= 75 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-orange-500"
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Compatibility: {score}%</p>
                <p className="text-xs text-muted-foreground">Based on religion, caste, gotra, location &amp; age</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
              onClick={onReject}
              disabled={rejecting || liking}
            >
              {rejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-1" />}
              Pass
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={onLike}
              disabled={liking || rejecting}
            >
              {liking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4 mr-1" />}
              Like
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Phone Reveal Dialog */}
      <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Phone Number</DialogTitle>
            <DialogDescription>
              Pay ₹250 via UPI to reveal {candidate.fullName}&apos;s phone number
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {revealError && (
              <Alert variant="destructive"><AlertDescription>{revealError}</AlertDescription></Alert>
            )}
            <div className="p-4 bg-muted/30 rounded-lg space-y-2">
              <p className="text-sm font-medium">Pay ₹250 to any of these UPI IDs:</p>
              <div className="space-y-1">
                <code className="block text-sm bg-background p-2 rounded border">8456916064@ybl</code>
                <code className="block text-sm bg-background p-2 rounded border">6370081492@ybl</code>
              </div>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPhoneDialog(false)}>Cancel</Button>
            <Button className="btn-matrimonial" onClick={handleRevealPhone} disabled={revealPhone.isPending}>
              {revealPhone.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Confirm Payment &amp; Reveal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function MatchesSection({ profile, onOpenChat }: MatchesSectionProps) {
  const [likingId, setLikingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [mutualMatchAlert, setMutualMatchAlert] = useState<string | null>(null);

  const { data: suggestions = [], isLoading: loadingSuggestions } = useGetMatches(profile.id);
  const { data: mutualMatches = [], isLoading: loadingMutual } = useGetMutualMatches(profile.id);
  const likeProfile = useLikeProfile();
  const rejectProfile = useRejectProfile();

  const handleLike = async (candidateId: string, candidateName: string) => {
    setLikingId(candidateId);
    try {
      const result = await likeProfile.mutateAsync({ fromUserId: profile.id, toUserId: candidateId });
      if (result.isMutual) {
        setMutualMatchAlert(`🎉 It's a Match! You and ${candidateName} have liked each other!`);
        setTimeout(() => setMutualMatchAlert(null), 5000);
      }
    } finally {
      setLikingId(null);
    }
  };

  const handleReject = async (candidateId: string) => {
    setRejectingId(candidateId);
    try {
      await rejectProfile.mutateAsync({ userId: profile.id, rejectedId: candidateId });
    } finally {
      setRejectingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {mutualMatchAlert && (
        <Alert className="bg-green-50 border-green-300">
          <Heart className="w-4 h-4 text-green-600 fill-green-600" />
          <AlertDescription className="text-green-700 font-semibold">{mutualMatchAlert}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="suggestions">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="suggestions">
            Suggestions
            {suggestions.length > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground text-xs">{suggestions.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="mutual">
            My Matches
            {mutualMatches.length > 0 && (
              <Badge className="ml-2 bg-green-500 text-white text-xs">{mutualMatches.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Suggestions Tab */}
        <TabsContent value="suggestions" className="mt-4">
          {loadingSuggestions ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : suggestions.length === 0 ? (
            <Card className="card-matrimonial">
              <CardContent className="py-12 text-center">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">No new suggestions right now</p>
                <p className="text-sm text-muted-foreground mt-1">Check back later for new profiles</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestions.map((candidate) => (
                <MatchCard
                  key={candidate.id}
                  candidate={candidate}
                  currentUserId={profile.id}
                  onLike={() => handleLike(candidate.id, candidate.fullName)}
                  onReject={() => handleReject(candidate.id)}
                  liking={likingId === candidate.id}
                  rejecting={rejectingId === candidate.id}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Mutual Matches Tab */}
        <TabsContent value="mutual" className="mt-4">
          {loadingMutual ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : mutualMatches.length === 0 ? (
            <Card className="card-matrimonial">
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">No mutual matches yet</p>
                <p className="text-sm text-muted-foreground mt-1">Like profiles to create matches</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {mutualMatches.map(({ match, profile: otherProfile }) => (
                <Card key={match.id} className="card-matrimonial">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="font-bold text-primary">{otherProfile?.fullName?.[0]}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{otherProfile?.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            Matched {new Date(match.matchedAt).toLocaleDateString("en-IN")}
                          </p>
                          <CompatibilityBadge score={match.compatibilityScore} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        {match.chatUnlocked ? (
                          <Button
                            size="sm"
                            className="btn-matrimonial"
                            onClick={() => onOpenChat?.(match.id, otherProfile?.id ?? "")}
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />Chat
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onOpenChat?.(match.id, otherProfile?.id ?? "")}
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {match.user1Id === profile.id
                              ? (match.user1Paid ? "Waiting..." : "Unlock Chat ₹200")
                              : (match.user2Paid ? "Waiting..." : "Unlock Chat ₹200")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
