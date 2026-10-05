export type CategoryType = 
  | 'Recycling' 
  | 'Water Saving' 
  | 'Electricity Saving' 
  | 'Transportation' 
  | 'Energy' 
  | 'Tree Plantation' 
  | 'Waste Management';

export type VerificationStatus = 'Pending' | 'Under Review' | 'Verified' | 'Rejected';
export type ProofType = 'Image' | 'Screenshot' | 'GPS' | 'QR' | 'Manual';

export interface SustainabilityPreferences {
  recycling: boolean;
  waterSaving: boolean;
  electricitySaving: boolean;
  publicTransport: boolean;
  cycling: boolean;
  solarEnergy: boolean;
  treePlantation: boolean;
  wasteManagement: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  avatar: string;
  preferredLanguage: string;
  role: 'user';
  isSuspended?: boolean;
  accountSettings: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    activeSessions: {
      id: string;
      device: string;
      location: string;
      ip: string;
      lastActive: string;
    }[];
  };
  notificationSettings: {
    email: boolean;
    push: boolean;
    dailyReminder: boolean;
    weeklyReport: boolean;
    monthlyReport: boolean;
    challengeAlerts: boolean;
    rewardAlerts: boolean;
  };
  themeSettings: 'light' | 'dark' | 'system';
  privacySettings: {
    downloadRequested?: boolean;
    publicProfile: boolean;
    showAchievements: boolean;
    cookiesAccepted: boolean;
    analyticsEnabled: boolean;
  };
  sustainabilityPreferences: SustainabilityPreferences;
}

export interface DashboardStats {
  greenPoints: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalTasksCompleted: number;
  pendingTasks: number;
  carbonSavedKg: number;
  waterSavedLiters: number;
  electricitySavedKwh: number;
  plasticReducedKg: number;
  treesEquivalent: number;
  currentStreak: number;
  weeklyGoalTarget: number;
  weeklyGoalProgress: number;
  lifetimePoints: number;
  pointsEarnedToday: number;
}

export interface HabitTask {
  id: string;
  title: string;
  category: CategoryType;
  points: number;
  carbonSavedKg: number;
  waterSavedLiters: number;
  electricitySavedKwh: number;
  plasticReducedKg: number;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  verificationStatus: VerificationStatus;
  proofType?: ProofType;
  proofUrl?: string;
  proofNotes?: string;
  gpsLocation?: string;
  submittedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  adminComments?: string;
  bonusPointsAwarded?: number;
  userId?: string;
  userName?: string;
  userEmail?: string;
}

export interface RewardItem {
  id: string;
  title: string;
  category: 'Coupon' | 'Gift Card' | 'Tree Certificate' | 'Donation' | 'Eco Badge' | 'Achievement Level';
  pointsCost: number;
  description: string;
  image: string;
  provider: string;
  discountOrValue: string;
  redeemed?: boolean;
  redeemedAt?: string;
  voucherCode?: string;
}

export interface ActivityItem {
  id: string;
  type: 'task_complete' | 'badge_earned' | 'reward_claimed' | 'ai_suggestion' | 'streak_milestone' | 'verification_submitted';
  title: string;
  description: string;
  timestamp: string;
  points?: number;
  category?: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  points: number;
  level: number;
  badgesCount: number;
  badges: string[];
  streakDays: number;
  isCurrentUser?: boolean;
  categoryRank?: number;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
}
