import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllProfiles,
  getProfileById,
  saveProfile,
  deleteProfile,
  getPhotosByUserId,
  getAllPhotos,
  addPhoto,
  deletePhoto,
  approvePhoto,
  getLikes,
  addLike,
  addRejectedProfile,
  getRejectedProfiles,
  getMutualMatchesForUser,
  getMatchById,
  updateMatch,
  getMessagesByMatchId,
  addMessage,
  getLockedChats,
  lockChat,
  unlockChat,
  getPayments,
  getPaymentsByUserId,
  addPayment,
  getRevealedPhones,
  addRevealedPhone,
  getCurrentUserId,
  setCurrentUserId,
  clearCurrentUser,
  seedAdminIfNeeded,
  UserProfile,
  Match,
  Payment,
} from "../lib/localStorage";

// ─── Seed ─────────────────────────────────────────────────────────────────────

seedAdminIfNeeded();

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function useCurrentUserId() {
  return useQuery({
    queryKey: ["currentUserId"],
    queryFn: () => getCurrentUserId(),
    staleTime: Infinity,
  });
}

export function useCurrentProfile() {
  const { data: userId } = useCurrentUserId();
  return useQuery({
    queryKey: ["currentProfile", userId],
    queryFn: () => (userId ? getProfileById(userId) : null),
    enabled: !!userId,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ phone, password }: { phone: string; password: string }) => {
      const profiles = getAllProfiles();
      // Admin login
      if (phone === "admin" && password === "admin123") {
        const admin = profiles.find((p) => p.role === "admin");
        if (admin) {
          setCurrentUserId(admin.id);
          return admin;
        }
      }
      const profile = profiles.find((p) => p.phone === phone && p.isPhoneVerified);
      if (!profile) throw new Error("Invalid credentials");
      setCurrentUserId(profile.id);
      return profile;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["currentUserId"] });
      qc.invalidateQueries({ queryKey: ["currentProfile"] });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      clearCurrentUser();
    },
    onSuccess: () => {
      qc.clear();
    },
  });
}

// ─── OTP ──────────────────────────────────────────────────────────────────────

export function useSendPhoneOTP() {
  return useMutation({
    mutationFn: async (phone: string) => {
      await new Promise((r) => setTimeout(r, 500));
      return { success: true, message: `OTP sent to ${phone}` };
    },
  });
}

export function useVerifyPhoneOTP() {
  return useMutation({
    mutationFn: async ({ phone, otp }: { phone: string; otp: string }) => {
      await new Promise((r) => setTimeout(r, 300));
      if (otp !== "123456") throw new Error("Invalid OTP. Please enter 123456");
      return { verified: true, phone };
    },
  });
}

export function useSendEmailOTP() {
  return useMutation({
    mutationFn: async (email: string) => {
      await new Promise((r) => setTimeout(r, 500));
      return { success: true, message: `OTP sent to ${email}` };
    },
  });
}

export function useVerifyEmailOTP() {
  return useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      await new Promise((r) => setTimeout(r, 300));
      if (otp !== "123456") throw new Error("Invalid OTP. Please enter 123456");
      return { verified: true, email };
    },
  });
}

// ─── Registration ─────────────────────────────────────────────────────────────

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      profile: Omit<UserProfile, "id" | "createdAt" | "updatedAt" | "photoCount" | "isVisible" | "role" | "status">
    ) => {
      const profiles = getAllProfiles();
      if (profiles.find((p) => p.phone === profile.phone)) {
        throw new Error("Phone number already registered");
      }
      const newProfile: UserProfile = {
        ...profile,
        id: Math.random().toString(36).slice(2) + Date.now().toString(36),
        photoCount: 0,
        isVisible: false,
        role: "user",
        status: "pending",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      saveProfile(newProfile);
      setCurrentUserId(newProfile.id);
      return newProfile;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["currentUserId"] });
      qc.invalidateQueries({ queryKey: ["currentProfile"] });
      qc.invalidateQueries({ queryKey: ["allProfiles"] });
    },
  });
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export function useGetAllProfiles() {
  return useQuery({
    queryKey: ["allProfiles"],
    queryFn: () => getAllProfiles(),
  });
}

export function useGetProfileById(id: string | null) {
  return useQuery({
    queryKey: ["profile", id],
    queryFn: () => (id ? getProfileById(id) : null),
    enabled: !!id,
  });
}

export function useSaveUserProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      saveProfile(profile);
      return profile;
    },
    onSuccess: (profile) => {
      qc.invalidateQueries({ queryKey: ["currentProfile"] });
      qc.invalidateQueries({ queryKey: ["profile", profile.id] });
      qc.invalidateQueries({ queryKey: ["allProfiles"] });
    },
  });
}

export function useUpdateProfileStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: UserProfile["status"] }) => {
      const profile = getProfileById(id);
      if (!profile) throw new Error("Profile not found");
      saveProfile({ ...profile, status });
      return { id, status };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allProfiles"] });
    },
  });
}

export function useDeleteProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      deleteProfile(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allProfiles"] });
    },
  });
}

// ─── Admin helpers (aliases for backward compat) ──────────────────────────────

export function useIsCurrentUserAdmin() {
  const { data: userId } = useCurrentUserId();
  return useQuery({
    queryKey: ["isAdmin", userId],
    queryFn: () => {
      if (!userId) return false;
      const profile = getProfileById(userId);
      return profile?.role === "admin";
    },
    enabled: !!userId,
  });
}

// ─── Photos ───────────────────────────────────────────────────────────────────

export function useGetUserPhotos(userId: string | null) {
  return useQuery({
    queryKey: ["photos", userId],
    queryFn: () => (userId ? getPhotosByUserId(userId) : []),
    enabled: !!userId,
  });
}

export function useGetAllPhotos() {
  return useQuery({
    queryKey: ["allPhotos"],
    queryFn: () => getAllPhotos(),
  });
}

export function useUploadPhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, imageData }: { userId: string; imageData: Uint8Array }) => {
      // Convert to base64 data URL for storage — cast to avoid SharedArrayBuffer compat issue
      const safeArray = new Uint8Array(imageData);
      const blob = new Blob([safeArray as unknown as BlobPart], { type: "image/jpeg" });
      const url = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      return addPhoto(userId, url);
    },
    onSuccess: (photo) => {
      qc.invalidateQueries({ queryKey: ["photos", photo.userId] });
      qc.invalidateQueries({ queryKey: ["currentProfile"] });
      qc.invalidateQueries({ queryKey: ["allProfiles"] });
    },
  });
}

export function useDeletePhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ photoId, userId }: { photoId: string; userId: string }) => {
      deletePhoto(photoId, userId);
      return { photoId, userId };
    },
    onSuccess: ({ userId }) => {
      qc.invalidateQueries({ queryKey: ["photos", userId] });
      qc.invalidateQueries({ queryKey: ["currentProfile"] });
      qc.invalidateQueries({ queryKey: ["allProfiles"] });
    },
  });
}

export function useApprovePhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (photoId: string) => {
      approvePhoto(photoId);
      return photoId;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allPhotos"] });
    },
  });
}

// ─── Matches ──────────────────────────────────────────────────────────────────

export function useGetMatches(userId: string | null) {
  return useQuery({
    queryKey: ["matches", userId],
    queryFn: () => {
      if (!userId) return [];
      const currentProfile = getProfileById(userId);
      if (!currentProfile) return [];
      const rejected = getRejectedProfiles(userId);
      const liked = getLikes()
        .filter((l) => l.fromUserId === userId)
        .map((l) => l.toUserId);

      return getAllProfiles()
        .filter((p) => {
          if (p.id === userId) return false;
          if (p.role === "admin") return false;
          if (p.status !== "approved") return false;
          if (p.photoCount < 4) return false;
          if (rejected.includes(p.id)) return false;
          if (liked.includes(p.id)) return false;
          if (currentProfile.gender === "male" && p.gender !== "female") return false;
          if (currentProfile.gender === "female" && p.gender !== "male") return false;
          return true;
        })
        .map((p) => {
          let score = 50;
          if (currentProfile.religion && p.religion && currentProfile.religion === p.religion) score += 15;
          if (currentProfile.caste && p.caste && currentProfile.caste === p.caste) score += 10;
          if (currentProfile.gotra && p.gotra && currentProfile.gotra === p.gotra) score -= 20;
          if (currentProfile.state && p.state && currentProfile.state === p.state) score += 5;
          if (currentProfile.city && p.city && currentProfile.city === p.city) score += 5;
          if (currentProfile.motherTongue && p.motherTongue && currentProfile.motherTongue === p.motherTongue) score += 5;
          if (currentProfile.maritalStatus === "Never Married" && p.maritalStatus === "Never Married") score += 5;
          const ageDiff = Math.abs((currentProfile.age || 25) - (p.age || 25));
          if (ageDiff <= 3) score += 5;
          else if (ageDiff > 10) score -= 5;
          return { ...p, compatibilityScore: Math.max(0, Math.min(100, score)) };
        })
        .sort((a, b) => (b.compatibilityScore ?? 0) - (a.compatibilityScore ?? 0));
    },
    enabled: !!userId,
  });
}

export function useGetMutualMatches(userId: string | null) {
  return useQuery({
    queryKey: ["mutualMatches", userId],
    queryFn: () => {
      if (!userId) return [];
      return getMutualMatchesForUser(userId).map((match) => {
        const otherId = match.user1Id === userId ? match.user2Id : match.user1Id;
        const profile = getProfileById(otherId);
        return { match, profile };
      });
    },
    enabled: !!userId,
  });
}

export function useLikeProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ fromUserId, toUserId }: { fromUserId: string; toUserId: string }) => {
      return addLike(fromUserId, toUserId);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["matches", vars.fromUserId] });
      qc.invalidateQueries({ queryKey: ["mutualMatches", vars.fromUserId] });
      qc.invalidateQueries({ queryKey: ["mutualMatches", vars.toUserId] });
    },
  });
}

export function useRejectProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, rejectedId }: { userId: string; rejectedId: string }) => {
      addRejectedProfile(userId, rejectedId);
      return { userId, rejectedId };
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["matches", vars.userId] });
    },
  });
}

// ─── Chat Unlock Payment ──────────────────────────────────────────────────────

export function useGetChatUnlockStatus(matchId: string | null) {
  return useQuery({
    queryKey: ["chatUnlockStatus", matchId],
    queryFn: () => {
      if (!matchId) return null;
      return getMatchById(matchId);
    },
    enabled: !!matchId,
    refetchInterval: 5000,
  });
}

export function useSubmitChatUnlockPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      matchId,
      upiId,
      reference,
    }: {
      userId: string;
      matchId: string;
      upiId: string;
      reference: string;
    }) => {
      const payment = addPayment({
        userId,
        matchId,
        serviceType: "chat-unlock",
        amount: 200,
        upiId,
        reference,
        status: "confirmed",
      });

      const match = getMatchById(matchId);
      if (match) {
        const isUser1 = match.user1Id === userId;
        const updated: Match = {
          ...match,
          user1Paid: isUser1 ? true : match.user1Paid,
          user2Paid: !isUser1 ? true : match.user2Paid,
          chatUnlocked: false,
          isLocked: match.isLocked,
        };
        updated.chatUnlocked = updated.user1Paid && updated.user2Paid;
        updateMatch(updated);
      }
      return payment;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["chatUnlockStatus", vars.matchId] });
      qc.invalidateQueries({ queryKey: ["mutualMatches", vars.userId] });
      qc.invalidateQueries({ queryKey: ["payments", vars.userId] });
    },
  });
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export function useGetMessages(matchId: string | null) {
  return useQuery({
    queryKey: ["messages", matchId],
    queryFn: () => (matchId ? getMessagesByMatchId(matchId) : []),
    enabled: !!matchId,
    refetchInterval: 5000,
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      matchId,
      senderId,
      receiverId,
      text,
    }: {
      matchId: string;
      senderId: string;
      receiverId: string;
      text: string;
    }) => {
      return addMessage(matchId, senderId, receiverId, text);
    },
    onSuccess: (msg) => {
      qc.invalidateQueries({ queryKey: ["messages", msg.matchId] });
    },
  });
}

export function useLockChat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      matchId,
      participantIds,
      reason,
    }: {
      matchId: string;
      participantIds: string[];
      reason: string;
    }) => {
      return lockChat(matchId, participantIds, reason);
    },
    onSuccess: (locked) => {
      qc.invalidateQueries({ queryKey: ["chatUnlockStatus", locked.matchId] });
      qc.invalidateQueries({ queryKey: ["lockedChats"] });
    },
  });
}

export function useGetLockedChats() {
  return useQuery({
    queryKey: ["lockedChats"],
    queryFn: () => getLockedChats(),
  });
}

export function useUnlockChat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (matchId: string) => {
      unlockChat(matchId);
      return matchId;
    },
    onSuccess: (matchId) => {
      qc.invalidateQueries({ queryKey: ["chatUnlockStatus", matchId] });
      qc.invalidateQueries({ queryKey: ["lockedChats"] });
    },
  });
}

// ─── Phone Reveal ─────────────────────────────────────────────────────────────

export function useGetRevealedPhones(userId: string | null) {
  return useQuery({
    queryKey: ["revealedPhones", userId],
    queryFn: () => (userId ? getRevealedPhones(userId) : []),
    enabled: !!userId,
  });
}

export function useRevealPhoneNumber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      candidateId,
      upiId,
      reference,
    }: {
      userId: string;
      candidateId: string;
      upiId: string;
      reference: string;
    }) => {
      const candidate = getProfileById(candidateId);
      if (!candidate) throw new Error("Candidate not found");

      addPayment({
        userId,
        candidateId,
        serviceType: "phone-reveal",
        amount: 250,
        upiId,
        reference,
        status: "confirmed",
      });

      addRevealedPhone(userId, candidateId);
      return candidate.phone;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["revealedPhones", vars.userId] });
      qc.invalidateQueries({ queryKey: ["payments", vars.userId] });
    },
  });
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export function useGetPayments(userId: string | null) {
  return useQuery({
    queryKey: ["payments", userId],
    queryFn: () => (userId ? getPaymentsByUserId(userId) : []),
    enabled: !!userId,
  });
}

export function useGetAllPayments() {
  return useQuery({
    queryKey: ["allPayments"],
    queryFn: () => getPayments(),
  });
}
