import {
  UserProfile,
  DashboardStats,
  HabitTask,
  RewardItem,
  ActivityItem,
  LeaderboardEntry,
  BadgeItem,
  ChatMessage
} from './types';

export const initialUserProfile: UserProfile = {
  id: 'usr_101',
  name: 'Alex Rivera',
  email: 'alex.rivera@eco.org',
  phone: '+1 (555) 382-9102',
  address: '742 Evergreen Terrace, San Francisco, CA',
  dob: '1995-06-14',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  preferredLanguage: 'English',
  role: 'user',
  isSuspended: false,
  accountSettings: {
    twoFactorEnabled: true,
    lastPasswordChange: '2026-05-10',
    activeSessions: [
      {
        id: 'sess_1',
        device: 'Chrome on macOS (Current)',
        location: 'San Francisco, USA',
        ip: '192.168.1.42',
        lastActive: 'Just now'
      },
      {
        id: 'sess_2',
        device: 'Safari on iPhone 15 Pro',
        location: 'San Francisco, USA',
        ip: '172.56.21.89',
        lastActive: '2 hours ago'
      }
    ]
  },
  notificationSettings: {
    email: true,
    push: true,
    dailyReminder: true,
    weeklyReport: true,
    monthlyReport: true,
    challengeAlerts: true,
    rewardAlerts: true
  },
  themeSettings: 'light',
  privacySettings: {
    publicProfile: true,
    showAchievements: true,
    cookiesAccepted: true,
    analyticsEnabled: true
  },
  sustainabilityPreferences: {
    recycling: true,
    waterSaving: true,
    electricitySaving: true,
    publicTransport: true,
    cycling: true,
    solarEnergy: false,
    treePlantation: true,
    wasteManagement: true
  }
};

export const initialDashboardStats: DashboardStats = {
  greenPoints: 1250,
  level: 4,
  xp: 350,
  xpToNextLevel: 500,
  totalTasksCompleted: 28,
  pendingTasks: 3,
  carbonSavedKg: 42.5,
  waterSavedLiters: 320,
  electricitySavedKwh: 68.4,
  plasticReducedKg: 14.2,
  treesEquivalent: 2.1,
  currentStreak: 8,
  weeklyGoalTarget: 10,
  weeklyGoalProgress: 7,
  lifetimePoints: 2450,
  pointsEarnedToday: 120
};

export const initialHabitTasks: HabitTask[] = [
  {
    id: 'task_1',
    title: 'Segregate Plastic & Paper Waste',
    category: 'Recycling',
    points: 50,
    carbonSavedKg: 1.2,
    waterSavedLiters: 10,
    electricitySavedKwh: 2.1,
    plasticReducedKg: 0.8,
    description: 'Separate recyclable plastic bottles, containers, and dry cardboard into designated bins.',
    difficulty: 'Easy',
    verificationStatus: 'Verified',
    proofType: 'Image',
    proofUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400',
    proofNotes: 'Recycling bins sorted before collection.',
    submittedAt: '2026-07-22 08:30',
    verifiedAt: '2026-07-22 08:45',
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@eco.org'
  },
  {
    id: 'task_2',
    title: 'Commute via Bicycle / Walk to Office',
    category: 'Transportation',
    points: 100,
    carbonSavedKg: 4.5,
    waterSavedLiters: 0,
    electricitySavedKwh: 0,
    plasticReducedKg: 0,
    description: 'Replace a car drive with a bicycle ride or 30-min walking commute.',
    difficulty: 'Medium',
    verificationStatus: 'Verified',
    proofType: 'GPS',
    gpsLocation: '37.7749° N, 122.4194° W (5.2 km route)',
    proofNotes: 'Morning bike ride tracked via GPS logs.',
    submittedAt: '2026-07-21 09:15',
    verifiedAt: '2026-07-21 09:30',
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@eco.org'
  },
  {
    id: 'task_3',
    title: 'Fix Tap Leakage / Install Aerator',
    category: 'Water Saving',
    points: 80,
    carbonSavedKg: 0.8,
    waterSavedLiters: 85,
    electricitySavedKwh: 1.5,
    plasticReducedKg: 0,
    description: 'Inspect household taps for leaks or install a low-flow water aerator.',
    difficulty: 'Medium',
    verificationStatus: 'Under Review',
    proofType: 'Image',
    proofUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
    proofNotes: 'Installed new eco aerator nozzle on kitchen sink faucet.',
    submittedAt: '2026-07-22 07:10',
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@eco.org'
  },
  {
    id: 'task_4',
    title: 'Plant a Sapling in Local Garden',
    category: 'Tree Plantation',
    points: 150,
    carbonSavedKg: 12.0,
    waterSavedLiters: 20,
    electricitySavedKwh: 0,
    plasticReducedKg: 0,
    description: 'Plant a native tree or potted sapling in your balcony or community garden.',
    difficulty: 'Hard',
    verificationStatus: 'Pending',
    proofType: 'Image',
    proofUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400',
    proofNotes: 'Planted native oak sapling in community patch.',
    submittedAt: '2026-07-22 07:40',
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@eco.org'
  },
  {
    id: 'task_5',
    title: 'Use LED Bulbs & Unplug Standby Electronics',
    category: 'Electricity Saving',
    points: 60,
    carbonSavedKg: 2.2,
    waterSavedLiters: 5,
    electricitySavedKwh: 14.5,
    plasticReducedKg: 0,
    description: 'Switch off all standby power outlets and ensure LED lighting in living area.',
    difficulty: 'Easy',
    verificationStatus: 'Under Review',
    proofType: 'Screenshot',
    proofUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=400',
    proofNotes: 'Smart power strip meter showing 0W standby drain.',
    submittedAt: '2026-07-22 07:50',
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@eco.org'
  },
  {
    id: 'task_6',
    title: 'Bring Reusable Bag & Coffee Tumbler',
    category: 'Waste Management',
    points: 40,
    carbonSavedKg: 0.6,
    waterSavedLiters: 12,
    electricitySavedKwh: 0.5,
    plasticReducedKg: 0.4,
    description: 'Avoid single-use cups and plastic carrier bags during daily shopping.',
    difficulty: 'Easy',
    verificationStatus: 'Verified',
    proofType: 'Image',
    proofUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=400',
    proofNotes: 'Used stainless tumbler at local cafe.',
    submittedAt: '2026-07-20 11:20',
    verifiedAt: '2026-07-20 11:40',
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@eco.org'
  }
];

export const initialRewards: RewardItem[] = [
  {
    id: 'rew_1',
    title: '$15 Organic Grocery Voucher',
    category: 'Coupon',
    pointsCost: 500,
    description: 'Get $15 off on organic produce at Whole Foods & local farmer markets.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
    provider: 'GreenGrocer Co.',
    discountOrValue: '$15 USD',
    redeemed: false
  },
  {
    id: 'rew_2',
    title: 'Plant 5 Trees in Amazon Rainforest',
    category: 'Tree Certificate',
    pointsCost: 800,
    description: 'Official certificate for 5 native trees planted in your name with GPS tracking.',
    image: 'https://images.unsplash.com/photo-1511497584788-876761c11969?auto=format&fit=crop&q=80&w=300',
    provider: 'OneTreePlanted Partner',
    discountOrValue: '5 Trees Certificate',
    redeemed: true,
    redeemedAt: '2026-07-15',
    voucherCode: 'TREE-AMZ-2026-9921'
  },
  {
    id: 'rew_3',
    title: 'Solar Energy Project Donation',
    category: 'Donation',
    pointsCost: 600,
    description: 'Fund solar lantern installations in off-grid rural school classrooms.',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=300',
    provider: 'SolarAid Foundation',
    discountOrValue: '$10 Fund Share',
    redeemed: false
  },
  {
    id: 'rew_4',
    title: '$25 Patagonia Eco-Apparel e-Gift Card',
    category: 'Gift Card',
    pointsCost: 1200,
    description: 'Redeem $25 towards sustainably made outdoor clothing and gear.',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=300',
    provider: 'Patagonia',
    discountOrValue: '$25 Gift Card',
    redeemed: false
  },
  {
    id: 'rew_5',
    title: 'Golden Leaf Master Badge',
    category: 'Eco Badge',
    pointsCost: 300,
    description: 'Special profile badge celebrating 100kg carbon reduction milestone.',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=300',
    provider: 'AI Green Habit Tracker',
    discountOrValue: 'Exclusive Badge',
    redeemed: true,
    redeemedAt: '2026-07-18',
    voucherCode: 'BADGE-GOLD-LEAF'
  },
  {
    id: 'rew_6',
    title: 'Clean Ocean Alliance Support Fund',
    category: 'Donation',
    pointsCost: 450,
    description: 'Remove 5kg of ocean plastic waste through automated ocean cleanup barriers.',
    image: 'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&q=80&w=300',
    provider: 'The Ocean Cleanup',
    discountOrValue: '5kg Ocean Plastic',
    redeemed: false
  }
];

export const initialActivities: ActivityItem[] = [
  {
    id: 'act_1',
    type: 'task_complete',
    title: 'Verified Task: Segregate Waste',
    description: 'Earned 50 Green Points & saved 1.2kg CO2',
    timestamp: 'Today, 08:45 AM',
    points: 50,
    category: 'Recycling'
  },
  {
    id: 'act_2',
    type: 'verification_submitted',
    title: 'Submitted Task Proof: Fix Tap Leakage',
    description: 'Under Review by Admin AI inspector',
    timestamp: 'Today, 07:10 AM',
    category: 'Water Saving'
  },
  {
    id: 'act_3',
    type: 'streak_milestone',
    title: '8-Day Streak Milestone Reached!',
    description: 'You are in the top 10% most consistent eco guardians this week.',
    timestamp: 'Yesterday, 09:00 PM',
    points: 30
  },
  {
    id: 'act_4',
    type: 'badge_earned',
    title: 'Unlocked Badge: Water Saver',
    description: 'Saved over 300 Liters of water through habit verifications.',
    timestamp: 'Jul 20, 2026'
  },
  {
    id: 'act_5',
    type: 'reward_claimed',
    title: 'Redeemed: Plant 5 Trees Certificate',
    description: 'Voucher TREE-AMZ-2026-9921 issued',
    timestamp: 'Jul 15, 2026',
    points: -800
  },
  {
    id: 'act_6',
    type: 'ai_suggestion',
    title: 'AI Eco Tip Received',
    description: 'Based on your electricity preferences, switching to cold water laundry saves 0.5 kWh per load.',
    timestamp: 'Jul 14, 2026'
  }
];

export const initialLeaderboard: LeaderboardEntry[] = [
  {
    id: 'lead_1',
    rank: 1,
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    points: 3420,
    level: 7,
    badgesCount: 12,
    badges: ['Green Master', 'Solar Pioneer', 'Recycling Champion', '30-Day Streak'],
    streakDays: 42
  },
  {
    id: 'lead_2',
    rank: 2,
    name: 'Liam Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    points: 2890,
    level: 6,
    badgesCount: 9,
    badges: ['Eco Warrior', 'Energy Hero', 'Cycling Pro'],
    streakDays: 29
  },
  {
    id: 'lead_3',
    rank: 3,
    name: 'Sophia Patel',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    points: 2150,
    level: 5,
    badgesCount: 8,
    badges: ['Water Saver', 'First Green Task', '7-Day Streak'],
    streakDays: 19
  },
  {
    id: 'usr_101',
    rank: 4,
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    points: 1250,
    level: 4,
    badgesCount: 5,
    badges: ['First Green Task', '7-Day Streak', 'Water Saver', 'Recycling Champion'],
    streakDays: 8,
    isCurrentUser: true
  },
  {
    id: 'lead_5',
    rank: 5,
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    points: 1180,
    level: 3,
    badgesCount: 4,
    badges: ['First Green Task', 'Energy Hero'],
    streakDays: 6
  },
  {
    id: 'lead_6',
    rank: 6,
    name: 'Amara Okafor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    points: 950,
    level: 3,
    badgesCount: 3,
    badges: ['First Green Task', '7-Day Streak'],
    streakDays: 7
  }
];

export const initialBadges: BadgeItem[] = [
  {
    id: 'bdg_1',
    title: 'First Green Task',
    description: 'Successfully complete and verify your very first sustainable habit.',
    iconName: 'Sprout',
    category: 'Milestone',
    unlocked: true,
    unlockedAt: '2026-07-01',
    progress: 1,
    maxProgress: 1
  },
  {
    id: 'bdg_2',
    title: '7-Day Streak',
    description: 'Log and verify green actions for 7 consecutive days.',
    iconName: 'Zap',
    category: 'Consistency',
    unlocked: true,
    unlockedAt: '2026-07-15',
    progress: 7,
    maxProgress: 7
  },
  {
    id: 'bdg_3',
    title: '30-Day Streak',
    description: 'Log and verify green actions for 30 consecutive days.',
    iconName: 'Flame',
    category: 'Consistency',
    unlocked: false,
    progress: 8,
    maxProgress: 30
  },
  {
    id: 'bdg_4',
    title: 'Water Saver',
    description: 'Save a total of 300 Liters of fresh water.',
    iconName: 'Droplets',
    category: 'Conservation',
    unlocked: true,
    unlockedAt: '2026-07-20',
    progress: 320,
    maxProgress: 300
  },
  {
    id: 'bdg_5',
    title: 'Energy Hero',
    description: 'Save 50 kWh of electricity through smart power habits.',
    iconName: 'Lightbulb',
    category: 'Conservation',
    unlocked: true,
    unlockedAt: '2026-07-18',
    progress: 68,
    maxProgress: 50
  },
  {
    id: 'bdg_6',
    title: 'Recycling Champion',
    description: 'Complete 10 waste sorting and recycling tasks.',
    iconName: 'Recycle',
    category: 'Waste',
    unlocked: false,
    progress: 6,
    maxProgress: 10
  },
  {
    id: 'bdg_7',
    title: 'Eco Warrior',
    description: 'Reach 2,000 Lifetime Green Points.',
    iconName: 'ShieldCheck',
    category: 'Points',
    unlocked: true,
    unlockedAt: '2026-07-10',
    progress: 2450,
    maxProgress: 2000
  },
  {
    id: 'bdg_8',
    title: 'Green Master',
    description: 'Reach Level 10 and complete 50 verified eco habits.',
    iconName: 'Award',
    category: 'Mastery',
    unlocked: false,
    progress: 28,
    maxProgress: 50
  }
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'assistant',
    text: "Hello Alex! I'm your AI Sustainability Advisor 🌱. I can suggest custom habits, calculate carbon savings, guide recycling, or check your 8-day streak progress! What would you like to explore today?",
    timestamp: 'Just now',
    suggestedQuestions: [
      'How do I reduce my household electricity bill?',
      'Suggest an eco habit based on my preferences',
      'What are the best recycling practices for plastics?',
      'How does my 8-day streak impact my Green Points?'
    ]
  }
];
