// ─── Types ───────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  // Personal Details
  fullName: string;
  gender: string;
  dateOfBirth: string;
  age: number;
  height: string;
  weight: string;
  religion: string;
  caste: string;
  subCaste: string;
  gotra: string;
  motherTongue: string;
  maritalStatus: string;
  state: string;
  district: string;
  city: string;
  manglikStatus: string;
  phone: string;
  email?: string;
  isPhoneVerified: boolean;
  isEmailVerified?: boolean;
  // Education & Job
  qualification: string;
  jobType: string;
  company: string;
  position: string;
  workLocation: string;
  monthlySalary: string;
  annualIncome: string;
  // Family Details
  fatherName: string;
  fatherOccupation: string;
  fatherIncome: string;
  fatherPhone: string;
  motherName: string;
  motherOccupation: string;
  motherIncome: string;
  motherPhone: string;
  numberOfBrothers: number;
  numberOfSisters: number;
  familyType: string;
  familyStatus: string;
  // Horoscope
  horoscopeUrl?: string;
  // Meta
  photoCount: number;
  isVisible: boolean;
  createdAt: number;
  updatedAt: number;
  role: "user" | "admin";
  status: "pending" | "approved" | "rejected" | "suspended";
  compatibilityScore?: number;
}

export interface Photo {
  id: string;
  userId: string;
  url: string;
  uploadedAt: number;
  approved: boolean;
}

export interface Like {
  id: string;
  fromUserId: string;
  toUserId: string;
  createdAt: number;
  status: "pending" | "mutual";
}

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  matchedAt: number;
  compatibilityScore: number;
  chatUnlocked: boolean;
  user1Paid: boolean;
  user2Paid: boolean;
  isLocked: boolean;
  lockedAt?: number;
  lockReason?: string;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  text: string;
  sentAt: number;
}

export interface LockedChat {
  id: string;
  matchId: string;
  participantIds: string[];
  lockedAt: number;
  reason: string;
}

export interface Payment {
  id: string;
  userId: string;
  candidateId?: string;
  matchId?: string;
  serviceType: "chat-unlock" | "phone-reveal" | "profile-view";
  amount: number;
  upiId: string;
  reference: string;
  status: "pending" | "confirmed" | "failed";
  createdAt: number;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const PROFILES_KEY = "matrimonial_profiles";
const PHOTOS_KEY = "matrimonial_photos";
const LIKES_KEY = "matrimonial_likes";
const MATCHES_KEY = "matrimonial_matches";
const MESSAGES_KEY = "matrimonial_messages";
const LOCKED_CHATS_KEY = "matrimonial_locked_chats";
const PAYMENTS_KEY = "matrimonial_payments";
const CURRENT_USER_KEY = "matrimonial_current_user";
const REVEALED_PHONES_KEY = "matrimonial_revealed_phones";
const REJECTED_PROFILES_KEY = "matrimonial_rejected_profiles";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStore<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStore<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function getMap<T>(key: string): Record<string, T> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setMap<T>(key: string, data: Record<string, T>): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── Current User ─────────────────────────────────────────────────────────────

export function getCurrentUserId(): string | null {
  return localStorage.getItem(CURRENT_USER_KEY);
}

export function setCurrentUserId(id: string): void {
  localStorage.setItem(CURRENT_USER_KEY, id);
}

export function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// ─── Profile Store ────────────────────────────────────────────────────────────

export function getAllProfiles(): UserProfile[] {
  return getStore<UserProfile>(PROFILES_KEY);
}

export function getProfileById(id: string): UserProfile | null {
  return getAllProfiles().find((p) => p.id === id) ?? null;
}

export function saveProfile(profile: UserProfile): void {
  const profiles = getAllProfiles();
  const idx = profiles.findIndex((p) => p.id === profile.id);
  if (idx >= 0) {
    profiles[idx] = { ...profile, updatedAt: Date.now() };
  } else {
    profiles.push({ ...profile, createdAt: Date.now(), updatedAt: Date.now() });
  }
  setStore(PROFILES_KEY, profiles);
}

export function deleteProfile(id: string): void {
  setStore(PROFILES_KEY, getAllProfiles().filter((p) => p.id !== id));
}

export function seedAdminIfNeeded(): void {
  const profiles = getAllProfiles();
  if (!profiles.find((p) => p.role === "admin")) {
    const admin: UserProfile = {
      id: "admin_001",
      fullName: "Admin User",
      gender: "male",
      dateOfBirth: "1985-01-01",
      age: 39,
      height: "5'10\"",
      weight: "75",
      religion: "Hindu",
      caste: "Brahmin",
      subCaste: "",
      gotra: "Kashyap",
      motherTongue: "Hindi",
      maritalStatus: "Never Married",
      state: "Maharashtra",
      district: "Mumbai",
      city: "Mumbai",
      manglikStatus: "Non-Manglik",
      phone: "9999999999",
      email: "admin@matrimonial.com",
      isPhoneVerified: true,
      qualification: "Post Graduate",
      jobType: "Business",
      company: "Self",
      position: "Owner",
      workLocation: "Mumbai",
      monthlySalary: "100000",
      annualIncome: "1200000",
      fatherName: "",
      fatherOccupation: "",
      fatherIncome: "",
      fatherPhone: "",
      motherName: "",
      motherOccupation: "",
      motherIncome: "",
      motherPhone: "",
      numberOfBrothers: 0,
      numberOfSisters: 0,
      familyType: "Nuclear",
      familyStatus: "Middle Class",
      photoCount: 4,
      isVisible: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      role: "admin",
      status: "approved",
    };
    profiles.push(admin);
    setStore(PROFILES_KEY, profiles);
  }
}

// ─── Photo Store ──────────────────────────────────────────────────────────────

export function getPhotosByUserId(userId: string): Photo[] {
  return getStore<Photo>(PHOTOS_KEY).filter((p) => p.userId === userId);
}

export function getAllPhotos(): Photo[] {
  return getStore<Photo>(PHOTOS_KEY);
}

export function addPhoto(userId: string, url: string): Photo {
  const photos = getStore<Photo>(PHOTOS_KEY);
  const photo: Photo = {
    id: generateId(),
    userId,
    url,
    uploadedAt: Date.now(),
    approved: false,
  };
  photos.push(photo);
  setStore(PHOTOS_KEY, photos);
  // Update profile photo count
  const profile = getProfileById(userId);
  if (profile) {
    const count = photos.filter((p) => p.userId === userId).length;
    saveProfile({ ...profile, photoCount: count, isVisible: count >= 4 });
  }
  return photo;
}

export function deletePhoto(photoId: string, userId: string): void {
  const photos = getStore<Photo>(PHOTOS_KEY).filter((p) => p.id !== photoId);
  setStore(PHOTOS_KEY, photos);
  const profile = getProfileById(userId);
  if (profile) {
    const count = photos.filter((p) => p.userId === userId).length;
    saveProfile({ ...profile, photoCount: count, isVisible: count >= 4 });
  }
}

export function approvePhoto(photoId: string): void {
  const photos = getStore<Photo>(PHOTOS_KEY);
  const idx = photos.findIndex((p) => p.id === photoId);
  if (idx >= 0) {
    photos[idx].approved = true;
    setStore(PHOTOS_KEY, photos);
  }
}

// ─── Like Store ───────────────────────────────────────────────────────────────

export function getLikes(): Like[] {
  return getStore<Like>(LIKES_KEY);
}

export function addLike(fromUserId: string, toUserId: string): { like: Like; isMutual: boolean } {
  const likes = getLikes();
  const existing = likes.find((l) => l.fromUserId === fromUserId && l.toUserId === toUserId);
  if (existing) return { like: existing, isMutual: existing.status === "mutual" };

  const reverseLike = likes.find((l) => l.fromUserId === toUserId && l.toUserId === fromUserId);
  const isMutual = !!reverseLike;

  const like: Like = {
    id: generateId(),
    fromUserId,
    toUserId,
    createdAt: Date.now(),
    status: isMutual ? "mutual" : "pending",
  };
  likes.push(like);

  if (isMutual) {
    const idx = likes.findIndex((l) => l.id === reverseLike!.id);
    likes[idx].status = "mutual";
    // Create match
    createMatch(fromUserId, toUserId);
  }

  setStore(LIKES_KEY, likes);
  return { like, isMutual };
}

export function hasLiked(fromUserId: string, toUserId: string): boolean {
  return getLikes().some((l) => l.fromUserId === fromUserId && l.toUserId === toUserId);
}

// ─── Rejected Profiles ────────────────────────────────────────────────────────

export function getRejectedProfiles(userId: string): string[] {
  const map = getMap<string[]>(REJECTED_PROFILES_KEY);
  return map[userId] ?? [];
}

export function addRejectedProfile(userId: string, rejectedId: string): void {
  const map = getMap<string[]>(REJECTED_PROFILES_KEY);
  const list = map[userId] ?? [];
  if (!list.includes(rejectedId)) list.push(rejectedId);
  map[userId] = list;
  setMap(REJECTED_PROFILES_KEY, map);
}

// ─── Match Store ──────────────────────────────────────────────────────────────

export function getMatches(): Match[] {
  return getStore<Match>(MATCHES_KEY);
}

export function getMatchById(matchId: string): Match | null {
  return getMatches().find((m) => m.id === matchId) ?? null;
}

export function createMatch(user1Id: string, user2Id: string): Match {
  const matches = getMatches();
  const existing = matches.find(
    (m) =>
      (m.user1Id === user1Id && m.user2Id === user2Id) ||
      (m.user1Id === user2Id && m.user2Id === user1Id)
  );
  if (existing) return existing;

  // Calculate compatibility score
  const p1 = getProfileById(user1Id);
  const p2 = getProfileById(user2Id);
  const score = calculateCompatibility(p1, p2);

  const match: Match = {
    id: generateId(),
    user1Id,
    user2Id,
    matchedAt: Date.now(),
    compatibilityScore: score,
    chatUnlocked: false,
    user1Paid: false,
    user2Paid: false,
    isLocked: false,
  };
  matches.push(match);
  setStore(MATCHES_KEY, matches);
  return match;
}

export function updateMatch(match: Match): void {
  const matches = getMatches();
  const idx = matches.findIndex((m) => m.id === match.id);
  if (idx >= 0) {
    matches[idx] = match;
    setStore(MATCHES_KEY, matches);
  }
}

export function getMutualMatchesForUser(userId: string): Match[] {
  return getMatches().filter((m) => m.user1Id === userId || m.user2Id === userId);
}

function calculateCompatibility(p1: UserProfile | null, p2: UserProfile | null): number {
  if (!p1 || !p2) return 50;
  let score = 50;

  // Religion match
  if (p1.religion && p2.religion && p1.religion === p2.religion) score += 15;
  // Caste match
  if (p1.caste && p2.caste && p1.caste === p2.caste) score += 10;
  // Gotra incompatibility (same gotra = bad)
  if (p1.gotra && p2.gotra && p1.gotra === p2.gotra) score -= 20;
  // Location match
  if (p1.state && p2.state && p1.state === p2.state) score += 5;
  if (p1.city && p2.city && p1.city === p2.city) score += 5;
  // Mother tongue
  if (p1.motherTongue && p2.motherTongue && p1.motherTongue === p2.motherTongue) score += 5;
  // Marital status
  if (p1.maritalStatus === "Never Married" && p2.maritalStatus === "Never Married") score += 5;
  // Age compatibility
  const ageDiff = Math.abs((p1.age || 25) - (p2.age || 25));
  if (ageDiff <= 3) score += 5;
  else if (ageDiff > 10) score -= 5;

  return Math.max(0, Math.min(100, score));
}

// ─── Message Store ────────────────────────────────────────────────────────────

export function getMessagesByMatchId(matchId: string): Message[] {
  return getStore<Message>(MESSAGES_KEY).filter((m) => m.matchId === matchId);
}

export function addMessage(matchId: string, senderId: string, receiverId: string, text: string): Message {
  const messages = getStore<Message>(MESSAGES_KEY);
  const msg: Message = {
    id: generateId(),
    matchId,
    senderId,
    receiverId,
    text,
    sentAt: Date.now(),
  };
  messages.push(msg);
  setStore(MESSAGES_KEY, messages);
  return msg;
}

// ─── Locked Chat Store ────────────────────────────────────────────────────────

export function getLockedChats(): LockedChat[] {
  return getStore<LockedChat>(LOCKED_CHATS_KEY);
}

export function lockChat(matchId: string, participantIds: string[], reason: string): LockedChat {
  const chats = getLockedChats();
  const existing = chats.find((c) => c.matchId === matchId);
  if (existing) return existing;

  const locked: LockedChat = {
    id: generateId(),
    matchId,
    participantIds,
    lockedAt: Date.now(),
    reason,
  };
  chats.push(locked);
  setStore(LOCKED_CHATS_KEY, chats);

  // Update match
  const match = getMatchById(matchId);
  if (match) {
    updateMatch({ ...match, isLocked: true, lockedAt: Date.now(), lockReason: reason });
  }
  return locked;
}

export function unlockChat(matchId: string): void {
  const chats = getLockedChats().filter((c) => c.matchId !== matchId);
  setStore(LOCKED_CHATS_KEY, chats);
  const match = getMatchById(matchId);
  if (match) {
    updateMatch({ ...match, isLocked: false, lockedAt: undefined, lockReason: undefined });
  }
}

// ─── Payment Store ────────────────────────────────────────────────────────────

export function getPayments(): Payment[] {
  return getStore<Payment>(PAYMENTS_KEY);
}

export function getPaymentsByUserId(userId: string): Payment[] {
  return getPayments().filter((p) => p.userId === userId);
}

export function addPayment(payment: Omit<Payment, "id" | "createdAt">): Payment {
  const payments = getPayments();
  const p: Payment = { ...payment, id: generateId(), createdAt: Date.now() };
  payments.push(p);
  setStore(PAYMENTS_KEY, payments);
  return p;
}

export function updatePaymentStatus(paymentId: string, status: Payment["status"]): void {
  const payments = getPayments();
  const idx = payments.findIndex((p) => p.id === paymentId);
  if (idx >= 0) {
    payments[idx].status = status;
    setStore(PAYMENTS_KEY, payments);
  }
}

// ─── Revealed Phones ──────────────────────────────────────────────────────────

export function getRevealedPhones(userId: string): string[] {
  const map = getMap<string[]>(REVEALED_PHONES_KEY);
  return map[userId] ?? [];
}

export function addRevealedPhone(userId: string, candidateId: string): void {
  const map = getMap<string[]>(REVEALED_PHONES_KEY);
  const list = map[userId] ?? [];
  if (!list.includes(candidateId)) list.push(candidateId);
  map[userId] = list;
  setMap(REVEALED_PHONES_KEY, map);
}

export function isPhoneRevealed(userId: string, candidateId: string): boolean {
  return getRevealedPhones(userId).includes(candidateId);
}
