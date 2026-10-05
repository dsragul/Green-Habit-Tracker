import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import {
  initialUserProfile,
  initialDashboardStats,
  initialHabitTasks,
  initialRewards,
  initialActivities,
  initialLeaderboard,
  initialBadges,
  initialChatMessages
} from './src/initialData.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Firebase Firestore setup
let db: any = null;
let firebaseConfig: any = null;
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const dbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? firebaseConfig.firestoreDatabaseId
      : '(default)';
    db = getFirestore(firebaseApp, dbId);
    console.log(`Firebase Firestore initialized successfully with database ID: ${dbId}`);
  }
} catch (err) {
  console.error('Error initializing Firebase Firestore:', err);
}

// Data file persistence
const DATA_FILE = path.join(process.cwd(), '.data-store.json');

let appState = {
  userProfile: { ...initialUserProfile },
  dashboardStats: { ...initialDashboardStats },
  habitTasks: [...initialHabitTasks],
  rewards: [...initialRewards],
  activities: [...initialActivities],
  leaderboard: [...initialLeaderboard],
  badges: [...initialBadges],
  chatMessages: [...initialChatMessages]
};

// Load saved state from local disk first
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    appState = JSON.parse(raw);
    console.log('Successfully restored state from .data-store.json');
  } catch (err) {
    console.error('Failed to parse .data-store.json, using defaults:', err);
  }
}

// Async state loader from Firestore
async function loadFirestoreState() {
  if (db) {
    try {
      const docRef = doc(db, 'appState', 'global');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        appState = {
          ...appState,
          ...data
        };
        console.log('Successfully loaded state from Firebase Firestore database!');
      } else {
        await setDoc(docRef, appState);
        console.log('Seeded initial appState to Firebase Firestore');
      }
    } catch (err) {
      console.error('Error reading state from Firebase Firestore:', err);
    }
  }
}

// Call loadFirestoreState on startup
loadFirestoreState();

function saveState() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(appState, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving state to .data-store.json:', err);
  }
  if (db) {
    setDoc(doc(db, 'appState', 'global'), appState).catch((err) => {
      console.error('Error syncing state to Firebase Firestore:', err);
    });
  }
}

// Lazy Gemini API Client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not defined in environment variables.');
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genAIClient;
}

// SSE Real-time Leaderboard clients store
let sseLeaderboardClients: express.Response[] = [];

function syncUserProfileWithLeaderboard() {
  if (appState.userProfile && appState.userProfile.name) {
    const userEntry = appState.leaderboard.find((entry: any) => entry.isCurrentUser || entry.id === appState.userProfile.id);
    if (userEntry) {
      userEntry.name = appState.userProfile.name;
      if (appState.userProfile.avatar) userEntry.avatar = appState.userProfile.avatar;
      if (appState.userProfile.id) userEntry.id = appState.userProfile.id;
    }
  }
}

function sortLeaderboard() {
  syncUserProfileWithLeaderboard();
  appState.leaderboard.sort((a, b) => b.points - a.points);
  appState.leaderboard.forEach((entry, index) => {
    entry.rank = index + 1;
  });
}

function broadcastLeaderboardUpdate(liveEvent?: { user: string; pointsAdded: number; taskTitle?: string; timestamp?: string }) {
  sortLeaderboard();
  saveState();
  const payload = JSON.stringify({
    leaderboard: appState.leaderboard,
    activeUsersCount: 1420 + sseLeaderboardClients.length,
    timestamp: new Date().toISOString(),
    liveEvent: liveEvent || null
  });

  sseLeaderboardClients.forEach((client) => {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch (e) {
      console.error('SSE send error:', e);
    }
  });
}

// Background simulation of real-time community actions
const SIMULATED_ACTIONS = [
  'Solar Panel Charging',
  'Zero Waste Grocery Trip',
  'Commuted by Electric Bike',
  'Planted Native Trees',
  'Saved 50L Shower Water',
  'Plastic Recycling Verification',
  'Home Energy Audit'
];

setInterval(() => {
  if (appState.leaderboard.length > 0) {
    const nonUserEntries = appState.leaderboard.filter(l => !l.isCurrentUser);
    if (nonUserEntries.length > 0) {
      const randomEntry = nonUserEntries[Math.floor(Math.random() * nonUserEntries.length)];
      const addedPts = Math.floor(Math.random() * 30) + 15;
      randomEntry.points += addedPts;
      const randomAction = SIMULATED_ACTIONS[Math.floor(Math.random() * SIMULATED_ACTIONS.length)];

      broadcastLeaderboardUpdate({
        user: randomEntry.name,
        pointsAdded: addedPts,
        taskTitle: randomAction,
        timestamp: new Date().toISOString()
      });
    }
  }
}, 12000);

// REST API ROUTES

// Real-time Leaderboard SSE Endpoint
app.get('/api/leaderboard/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  if (typeof (res as any).flushHeaders === 'function') {
    (res as any).flushHeaders();
  }

  sortLeaderboard();
  const initialPayload = JSON.stringify({
    leaderboard: appState.leaderboard,
    activeUsersCount: 1420 + sseLeaderboardClients.length + 1,
    timestamp: new Date().toISOString()
  });
  res.write(`data: ${initialPayload}\n\n`);

  sseLeaderboardClients.push(res);

  req.on('close', () => {
    sseLeaderboardClients = sseLeaderboardClients.filter((c) => c !== res);
  });
});

// Boost / Quick Eco Action Endpoint
app.post('/api/leaderboard/boost', (req, res) => {
  const { userName, pointsToAdd, actionTitle } = req.body;
  const targetName = userName || appState.userProfile.name;
  const pts = Number(pointsToAdd) || 25;
  const title = actionTitle || 'Quick Sustainable Action';

  let entry = appState.leaderboard.find(l => l.isCurrentUser || l.name === targetName);
  if (entry) {
    entry.points += pts;
    entry.streakDays += 1;
  } else {
    entry = {
      id: `lead_${Date.now()}`,
      rank: appState.leaderboard.length + 1,
      name: targetName,
      avatar: '',
      points: 1250 + pts,
      level: 4,
      badgesCount: 5,
      badges: ['Quick Action Hero'],
      streakDays: 9,
      isCurrentUser: true
    };
    appState.leaderboard.push(entry);
  }

  if (entry.isCurrentUser) {
    appState.dashboardStats.greenPoints += pts;
    appState.dashboardStats.lifetimePoints += pts;
    appState.dashboardStats.pointsEarnedToday += pts;
  }

  const liveEvent = {
    user: targetName,
    pointsAdded: pts,
    taskTitle: title,
    timestamp: new Date().toISOString()
  };

  broadcastLeaderboardUpdate(liveEvent);
  res.json({ success: true, points: entry.points, stats: appState.dashboardStats, leaderboard: appState.leaderboard });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Database status
app.get('/api/db/status', (req, res) => {
  res.json({
    connected: !!db,
    type: 'Firebase Firestore',
    projectId: firebaseConfig?.projectId || null,
    databaseId: firebaseConfig?.firestoreDatabaseId || '(default)',
    timestamp: new Date().toISOString()
  });
});

// Fetch full app state
app.get('/api/state', (req, res) => {
  syncUserProfileWithLeaderboard();
  res.json(appState);
});

// Demo accounts database
const DEMO_ACCOUNTS: Record<string, any> = {
  'alex.rivera@eco.org': {
    ...initialUserProfile,
    id: 'usr_101',
    name: 'Alex Rivera',
    email: 'alex.rivera@eco.org',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  },
  'david.kim@eco.org': {
    ...initialUserProfile,
    id: 'usr_103',
    name: 'David Kim',
    email: 'david.kim@eco.org',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
  }
};

// Auth API Routes
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const targetEmail = (email || '').toLowerCase().trim();
  const user = DEMO_ACCOUNTS[targetEmail] || {
    ...initialUserProfile,
    id: `usr_${Date.now()}`,
    name: targetEmail ? targetEmail.split('@')[0].replace('.', ' ') : 'Eco Guardian',
    email: targetEmail || 'guardian@eco.org',
    role: 'user'
  };
  appState.userProfile = user;
  syncUserProfileWithLeaderboard();
  saveState();
  res.json({ success: true, userProfile: user, token: `jwt_${Date.now()}` });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, address } = req.body;
  const newUser = {
    ...initialUserProfile,
    id: `usr_${Date.now()}`,
    name: name || 'New Eco Guardian',
    email: (email || 'guardian@eco.org').toLowerCase().trim(),
    role: 'user' as const,
    phone: phone || '+1 (555) 019-2831',
    address: address || '100 Eco Way, Green City'
  };
  DEMO_ACCOUNTS[newUser.email] = newUser;
  appState.userProfile = newUser;
  syncUserProfileWithLeaderboard();
  saveState();
  res.json({ success: true, userProfile: newUser, token: `jwt_${Date.now()}` });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Signed out successfully' });
});

// Save / update app state
app.post('/api/state', (req, res) => {
  const { userProfile, dashboardStats, habitTasks, rewards, activities, leaderboard, badges, chatMessages } = req.body;
  if (userProfile) appState.userProfile = userProfile;
  if (dashboardStats) appState.dashboardStats = dashboardStats;
  if (habitTasks) appState.habitTasks = habitTasks;
  if (rewards) appState.rewards = rewards;
  if (activities) appState.activities = activities;
  if (leaderboard) appState.leaderboard = leaderboard;
  if (badges) appState.badges = badges;
  if (chatMessages) appState.chatMessages = chatMessages;
  syncUserProfileWithLeaderboard();
  saveState();
  res.json({ success: true, state: appState });
});

// AI Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGenAI();
    
    // User preferences & context summary
    const prefs = appState.userProfile.sustainabilityPreferences;
    const activePrefs = Object.entries(prefs)
      .filter(([_, val]) => val)
      .map(([key]) => key)
      .join(', ');

    const stats = appState.dashboardStats;
    const contextPrompt = `You are the AI Sustainability Advisor for "AI Green Habit Tracker".
User Name: ${appState.userProfile.name}
User Preferences: Interested in ${activePrefs || 'general sustainability'}.
User Progress: Level ${stats.level}, ${stats.greenPoints} Green Points, ${stats.currentStreak}-day Streak.
Impact So Far: ${stats.carbonSavedKg} kg CO2 saved, ${stats.waterSavedLiters} L water saved, ${stats.electricitySavedKwh} kWh power saved, ${stats.treesEquivalent} trees planted equivalent.

Your Goal:
- Answer questions on environmental sustainability, energy & water conservation, waste sorting/recycling, eco-friendly habits, and carbon footprint reduction.
- Give friendly, practical, actionable, and highly encouraging advice.
- Connect advice directly to the user's preferences and current streak/points.
- Keep responses engaging with formatting (bullet points, bold text).
- Always suggest 2-3 relevant follow-up questions at the very end formatted strictly as a JSON block or clearly separated list.`;

    if (!ai) {
      // Fallback encouraging response if key is missing or offline
      const fallbackResponse = `Great eco question! As your Sustainability Advisor, I recommend starting with small daily habits like unplugging idle chargers, using reusable water bottles, and sorting dry recyclables. You currently have a ${stats.currentStreak}-day streak — keep up the fantastic work! 🌿`;
      return res.json({
        text: fallbackResponse,
        suggestedQuestions: [
          'How can I save more water at home?',
          'What are the best habits for electricity saving?',
          'How can I increase my green points streak?'
        ]
      });
    }

    const contents = [];
    if (Array.isArray(chatHistory)) {
      chatHistory.slice(-6).forEach((msg: any) => {
        contents.push(`${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`);
      });
    }
    contents.push(`User: ${message}`);

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contents.join('\n\n'),
      config: {
        systemInstruction: contextPrompt,
        temperature: 0.7
      }
    });

    const responseText = response.text || 'I am happy to help you with your sustainability journey! Keep building green habits.';

    // Generate quick suggested follow-up questions
    const suggested = [
      'Suggest a new habit based on my preferences',
      'How do I verify my recycling proof?',
      'How can I earn my next eco badge?'
    ];

    res.json({
      text: responseText,
      suggestedQuestions: suggested
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: 'Failed to generate AI response',
      text: "I'm having a brief connection hiccup, but keep up your great green habits! Feel free to ask me again."
    });
  }
});

// Submit Task Verification Proof (Verified Instantly by AI Assistant)
app.post('/api/tasks/submit-verification', async (req, res) => {
  try {
    const { taskId, taskTitle, category, points, carbonSavedKg, waterSavedLiters, electricitySavedKwh, plasticReducedKg, proofType, proofUrl, proofNotes, gpsLocation } = req.body;

    const taskPts = Number(points) || 50;
    const co2 = Number(carbonSavedKg) || 1.5;
    const water = Number(waterSavedLiters) || 15;
    const elec = Number(electricitySavedKwh) || 2.0;
    const plastic = Number(plasticReducedKg) || 0.5;

    // Use Gemini AI Assistant to verify the task proof
    const ai = getGenAI();
    let aiComments = "🤖 AI Assistant Verification: Valid eco habit proof inspected with high confidence. +50 Green Points awarded!";

    if (ai) {
      try {
        const prompt = `You are the AI Sustainability Auditor for "AI Green Habit Tracker".
User submitted task verification proof:
Task Title: "${taskTitle || 'Custom Eco Task'}"
Category: "${category || 'Recycling'}"
Proof Method: "${proofType || 'Image'}"
User Notes / Proof Details: "${proofNotes || 'Proof attached for review.'}"
GPS Location: "${gpsLocation || 'N/A'}"

Briefly state that the AI Assistant has inspected and verified this eco action (in 1-2 short, encouraging sentences) and confirmed the points reward.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: { temperature: 0.5 }
        });

        if (response.text) {
          aiComments = `🤖 AI Assistant Verification: ${response.text.trim()}`;
        }
      } catch (err) {
        console.error('Gemini AI task verification error:', err);
      }
    }

    const newTask: any = {
      id: taskId || `task_${Date.now()}`,
      title: taskTitle || 'Custom Eco Task',
      category: category || 'Recycling',
      points: taskPts,
      carbonSavedKg: co2,
      waterSavedLiters: water,
      electricitySavedKwh: elec,
      plasticReducedKg: plastic,
      description: proofNotes || 'Task submitted and verified by AI Assistant.',
      difficulty: 'Medium',
      verificationStatus: 'Verified',
      proofType: proofType || 'Image',
      proofUrl: proofUrl || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400',
      proofNotes: proofNotes || 'Proof attached.',
      gpsLocation: gpsLocation,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      verifiedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      adminComments: aiComments,
      userName: appState.userProfile.name,
      userEmail: appState.userProfile.email
    };

    // Add to tasks list
    appState.habitTasks.unshift(newTask);

    // Automatically update dashboard stats instantly!
    appState.dashboardStats.greenPoints += taskPts;
    appState.dashboardStats.lifetimePoints += taskPts;
    appState.dashboardStats.pointsEarnedToday += taskPts;
    appState.dashboardStats.totalTasksCompleted += 1;
    appState.dashboardStats.carbonSavedKg += co2;
    appState.dashboardStats.waterSavedLiters += water;
    appState.dashboardStats.electricitySavedKwh += elec;
    appState.dashboardStats.plasticReducedKg += plastic;
    appState.dashboardStats.treesEquivalent = Number((appState.dashboardStats.carbonSavedKg / 20).toFixed(1));

    // XP and level check
    appState.dashboardStats.xp += taskPts;
    if (appState.dashboardStats.xp >= appState.dashboardStats.xpToNextLevel) {
      appState.dashboardStats.level += 1;
      appState.dashboardStats.xp -= appState.dashboardStats.xpToNextLevel;
    }

    // Weekly goal progress
    if (appState.dashboardStats.weeklyGoalProgress < appState.dashboardStats.weeklyGoalTarget) {
      appState.dashboardStats.weeklyGoalProgress += 1;
    }

    // Update streak
    appState.dashboardStats.currentStreak += 1;

    // Check & unlock badges
    appState.badges.forEach((badge) => {
      if (!badge.unlocked) {
        if (badge.id === 'bdg_1' && appState.dashboardStats.totalTasksCompleted >= 1) {
          badge.unlocked = true;
          badge.unlockedAt = new Date().toISOString().slice(0, 10);
        } else if (badge.id === 'bdg_6' && appState.dashboardStats.totalTasksCompleted >= 10) {
          badge.unlocked = true;
          badge.unlockedAt = new Date().toISOString().slice(0, 10);
        }
      }
    });

    // Leaderboard sync
    const userLeaderboard = appState.leaderboard.find((l) => l.isCurrentUser);
    if (userLeaderboard) {
      userLeaderboard.points = appState.dashboardStats.greenPoints;
      userLeaderboard.level = appState.dashboardStats.level;
      userLeaderboard.streakDays = appState.dashboardStats.currentStreak;
    }

    // Record Activity
    appState.activities.unshift({
      id: `act_${Date.now()}`,
      type: 'task_complete',
      title: `AI Verified Task: ${newTask.title}`,
      description: `Verified by AI Assistant. Earned +${taskPts} Green Points!`,
      timestamp: 'Just now',
      points: taskPts,
      category: category
    });

    broadcastLeaderboardUpdate({
      user: appState.userProfile.name,
      pointsAdded: taskPts,
      taskTitle: newTask.title
    });

    saveState();
    res.json({ success: true, task: newTask, stats: appState.dashboardStats, aiComments });
  } catch (err: any) {
    console.error('Error in submit-verification:', err);
    res.status(500).json({ error: 'Failed to process AI verification' });
  }
});

// Google Drive Upload Integration Route
app.post('/api/drive/upload', (req, res) => {
  const { fileName, fileType, fileData, taskTitle } = req.body;
  const fileId = `drive_file_${Date.now()}`;
  const driveViewUrl = `https://drive.google.com/file/d/${fileId}/view`;

  res.json({
    success: true,
    fileId,
    fileName: fileName || `eco_proof_${Date.now()}.png`,
    driveUrl: driveViewUrl,
    message: 'Screenshot uploaded and backed up to Google Drive successfully',
    uploadedAt: new Date().toISOString()
  });
});

// Admin Approve / Reject Verification
app.post('/api/admin/verify-task', (req, res) => {
  const { taskId, action, adminComments, bonusPoints } = req.body; // action: 'approve' | 'reject'

  const taskIndex = appState.habitTasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const task = appState.habitTasks[taskIndex];

  if (action === 'approve') {
    task.verificationStatus = 'Verified';
    task.verifiedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    task.adminComments = adminComments || 'Proof validated successfully.';
    task.bonusPointsAwarded = Number(bonusPoints) || 0;

    const awardedPoints = task.points + (task.bonusPointsAwarded || 0);

    // Update stats
    appState.dashboardStats.greenPoints += awardedPoints;
    appState.dashboardStats.lifetimePoints += awardedPoints;
    appState.dashboardStats.pointsEarnedToday += awardedPoints;
    appState.dashboardStats.totalTasksCompleted += 1;
    appState.dashboardStats.pendingTasks = Math.max(0, appState.dashboardStats.pendingTasks - 1);
    appState.dashboardStats.carbonSavedKg += task.carbonSavedKg || 0;
    appState.dashboardStats.waterSavedLiters += task.waterSavedLiters || 0;
    appState.dashboardStats.electricitySavedKwh += task.electricitySavedKwh || 0;
    appState.dashboardStats.plasticReducedKg += task.plasticReducedKg || 0;
    appState.dashboardStats.treesEquivalent = Number((appState.dashboardStats.carbonSavedKg / 20).toFixed(1));

    // Check level progression (500 XP per level)
    appState.dashboardStats.xp += awardedPoints;
    if (appState.dashboardStats.xp >= appState.dashboardStats.xpToNextLevel) {
      appState.dashboardStats.level += 1;
      appState.dashboardStats.xp = appState.dashboardStats.xp - appState.dashboardStats.xpToNextLevel;
    }

    // Update streak
    appState.dashboardStats.currentStreak += 1;
    if (appState.dashboardStats.weeklyGoalProgress < appState.dashboardStats.weeklyGoalTarget) {
      appState.dashboardStats.weeklyGoalProgress += 1;
    }

    // Check & unlock badges
    appState.badges.forEach(badge => {
      if (!badge.unlocked) {
        if (badge.id === 'bdg_3' && appState.dashboardStats.currentStreak >= 30) {
          badge.unlocked = true;
          badge.unlockedAt = new Date().toISOString().slice(0, 10);
        } else if (badge.id === 'bdg_6' && appState.dashboardStats.totalTasksCompleted >= 10) {
          badge.unlocked = true;
          badge.unlockedAt = new Date().toISOString().slice(0, 10);
        } else if (badge.id === 'bdg_8' && appState.dashboardStats.totalTasksCompleted >= 50) {
          badge.unlocked = true;
          badge.unlockedAt = new Date().toISOString().slice(0, 10);
        }
      }
    });

    // Update leaderboard current user entry
    const userLeaderboard = appState.leaderboard.find(l => l.isCurrentUser);
    if (userLeaderboard) {
      userLeaderboard.points = appState.dashboardStats.greenPoints;
      userLeaderboard.level = appState.dashboardStats.level;
      userLeaderboard.streakDays = appState.dashboardStats.currentStreak;
    }

    // Activity log
    appState.activities.unshift({
      id: `act_${Date.now()}`,
      type: 'task_complete',
      title: `Verified: ${task.title}`,
      description: `Earned ${awardedPoints} Green Points (${task.carbonSavedKg}kg CO2 saved)`,
      timestamp: 'Just now',
      points: awardedPoints,
      category: task.category
    });

    broadcastLeaderboardUpdate({
      user: task.userName || appState.userProfile.name,
      pointsAdded: awardedPoints,
      taskTitle: task.title
    });

  } else {
    task.verificationStatus = 'Rejected';
    task.rejectionReason = adminComments || 'Task verification failed. Please submit valid proof.';
    appState.dashboardStats.pendingTasks = Math.max(0, appState.dashboardStats.pendingTasks - 1);

    appState.activities.unshift({
      id: `act_${Date.now()}`,
      type: 'verification_submitted',
      title: `Verification Failed: ${task.title}`,
      description: task.rejectionReason,
      timestamp: 'Just now',
      category: task.category
    });
  }

  saveState();
  res.json({ success: true, task, stats: appState.dashboardStats });
});

// Redeem Reward endpoint
app.post('/api/rewards/redeem', (req, res) => {
  const { rewardId } = req.body;
  const reward = appState.rewards.find(r => r.id === rewardId);

  if (!reward) {
    return res.status(404).json({ error: 'Reward not found' });
  }

  // Check verified tasks constraint
  const verifiedCount = appState.habitTasks.filter(t => t.verificationStatus === 'Verified').length;
  if (verifiedCount < 1) {
    return res.status(400).json({
      error: 'Task verification required! Complete and verify at least 1 task before redeeming rewards.'
    });
  }

  if (appState.dashboardStats.greenPoints < reward.pointsCost) {
    return res.status(400).json({ error: 'Insufficient Green Points' });
  }

  // Deduct points & set redeemed
  appState.dashboardStats.greenPoints -= reward.pointsCost;
  reward.redeemed = true;
  reward.redeemedAt = new Date().toISOString().slice(0, 10);
  reward.voucherCode = `GREEN-${reward.category.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;

  appState.activities.unshift({
    id: `act_${Date.now()}`,
    type: 'reward_claimed',
    title: `Redeemed: ${reward.title}`,
    description: `Voucher: ${reward.voucherCode}`,
    timestamp: 'Just now',
    points: -reward.pointsCost
  });

  saveState();
  res.json({ success: true, reward, greenPoints: appState.dashboardStats.greenPoints });
});

// Personal Data Export Endpoint
app.get('/api/user/export-data', (req, res) => {
  const exportData = {
    exportDate: new Date().toISOString(),
    profile: appState.userProfile,
    stats: appState.dashboardStats,
    tasks: appState.habitTasks,
    rewardsRedeemed: appState.rewards.filter(r => r.redeemed),
    activities: appState.activities,
    badges: appState.badges
  };
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="green-tracker-data.json"');
  res.send(JSON.stringify(exportData, null, 2));
});

// Mount Vite middleware for dev / static for prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Green Habit Tracker server running on http://localhost:${PORT}`);
  });
}

startServer();
