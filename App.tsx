import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UserDashboard } from './components/UserDashboard';
import { TaskVerificationFlow } from './components/TaskVerificationFlow';
import { RewardCenter } from './components/RewardCenter';
import { LeaderboardView } from './components/LeaderboardView';
import { AchievementsView } from './components/AchievementsView';
import { SettingsPage } from './components/SettingsPage';
import { AIChatbot } from './components/AIChatbot';
import { ToastContainer, ToastMessage } from './components/Toast';
import { GmailShareModal } from './components/GmailShareModal';

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

import {
  initialUserProfile,
  initialDashboardStats,
  initialHabitTasks,
  initialRewards,
  initialActivities,
  initialLeaderboard,
  initialBadges,
  initialChatMessages
} from './initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Application State
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(initialDashboardStats);
  const [habitTasks, setHabitTasks] = useState<HabitTask[]>(initialHabitTasks);
  const [rewards, setRewards] = useState<RewardItem[]>(initialRewards);
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard);
  const [badges, setBadges] = useState<BadgeItem[]>(initialBadges);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [isGmailModalOpen, setIsGmailModalOpen] = useState<boolean>(false);

  // Sync state from server on mount
  useEffect(() => {
    fetch('/api/state')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.userProfile) {
          setUserProfile(data.userProfile);
          setDashboardStats(data.dashboardStats);
          setHabitTasks(data.habitTasks);
          setRewards(data.rewards);
          setActivities(data.activities);
          setLeaderboard(data.leaderboard);
          setBadges(data.badges);
          setChatMessages(data.chatMessages);

          if (data.userProfile.themeSettings === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
          }
        }
      })
      .catch((err) => console.log('Using initial client data state:', err));
  }, []);

  // Sync user profile name and avatar into current user's leaderboard entry
  useEffect(() => {
    if (userProfile && userProfile.name) {
      setLeaderboard((prevLeaderboard) =>
        prevLeaderboard.map((entry) => {
          if (entry.isCurrentUser || entry.id === userProfile.id) {
            return {
              ...entry,
              id: userProfile.id || entry.id,
              name: userProfile.name,
              avatar: userProfile.avatar || entry.avatar
            };
          }
          return entry;
        })
      );
    }
  }, [userProfile]);

  // Sync dark mode class with DOM root
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const showToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSignIn = (newUserProfile: UserProfile) => {
    setUserProfile(newUserProfile);
    setIsAuthenticated(true);
    saveStateToBackend({ userProfile: newUserProfile });
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    showToast('Signed Out', 'You have been safely logged out of your session.', 'info');
  };

  // Save state to backend
  const saveStateToBackend = (updatedState: Partial<any>) => {
    fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userProfile,
        dashboardStats,
        habitTasks,
        rewards,
        activities,
        leaderboard,
        badges,
        chatMessages,
        ...updatedState
      })
    }).catch((err) => console.error('Failed to sync backend state:', err));
  };

  // Submit Task Verification Proof (Verified Instantly by AI Assistant)
  const handleSubmitProof = (proofData: any) => {
    fetch('/api/tasks/submit-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proofData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHabitTasks((prev) => [data.task, ...prev]);
          if (data.stats) {
            setDashboardStats(data.stats);
          }
          setActivities((prev) => [
            {
              id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              type: 'task_complete',
              title: `AI Verified Task: ${data.task.title}`,
              description: data.aiComments || 'Verified by AI Assistant',
              timestamp: 'Just now',
              points: data.task.points,
              category: data.task.category
            },
            ...prev
          ]);
          showToast(
            'Task Verified by AI Assistant! 🌟',
            data.aiComments || `Awarded +${data.task.points} Green Points!`,
            'success'
          );
        }
      })
      .catch((err) => {
        console.error('Submit task proof error:', err);
        showToast('Error Submitting Task', 'Failed to reach backend service.', 'error');
      });
  };

  // Redeem Reward
  const handleRedeemReward = (rewardId: string) => {
    fetch('/api/rewards/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rewardId })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRewards((prev) =>
            prev.map((r) => (r.id === rewardId ? data.reward : r))
          );
          setDashboardStats((prev) => ({
            ...prev,
            greenPoints: data.greenPoints
          }));
          showToast(
            'Reward Claimed Successfully! 🎉',
            `Voucher Code: ${data.reward.voucherCode}`,
            'success'
          );
        } else {
          showToast('Reward Claim Failed', data.error || 'Verification task criteria not met.', 'error');
        }
      })
      .catch((err) => {
        console.error('Redeem reward error:', err);
        showToast('Claim Error', 'Could not process reward claim.', 'error');
      });
  };

  // Send AI Chat Message
  const handleSendChatMessage = async (messageText: string) => {
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender: 'user',
      text: messageText,
      timestamp: 'Just now'
    };

    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          chatHistory: chatMessages
        })
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        sender: 'assistant',
        text: data.text || 'I am happy to assist with your sustainability goals!',
        timestamp: 'Just now',
        suggestedQuestions: data.suggestedQuestions
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
      saveStateToBackend({ chatMessages: [...chatMessages, userMsg, assistantMsg] });
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        sender: 'assistant',
        text: 'Keep building green habits! Let me know if you need recycling or energy tips.',
        timestamp: 'Just now'
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleClearChat = () => {
    const defaultMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender: 'assistant',
      text: "Chat cleared! How can I assist your green habit journey today? 🌱",
      timestamp: 'Just now',
      suggestedQuestions: [
        'How can I save more water at home?',
        'What are the best habits for electricity saving?',
        'Suggest a new habit based on my preferences'
      ]
    };
    setChatMessages([defaultMsg]);
    saveStateToBackend({ chatMessages: [defaultMsg] });
    showToast('Chat History Cleared', 'Start a fresh conversation with your AI Advisor.', 'info');
  };

  const handleExportData = () => {
    window.open('/api/user/export-data', '_blank');
    showToast('Export Initiated', 'Downloading your personal eco data file.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-emerald-500 selection:text-white font-sans antialiased relative overflow-x-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-slate-50 to-slate-100 dark:from-emerald-950/30 dark:via-slate-950 dark:to-slate-950">
      
      {/* Background Subtle Ambient Glowing Orbs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Primary Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={dashboardStats}
        user={userProfile}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isAuthenticated={isAuthenticated}
        onSignOut={handleSignOut}
      />

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <UserDashboard
            stats={dashboardStats}
            activities={activities}
            user={userProfile}
            onNavigate={setActiveTab}
            onOpenGmailModal={() => setIsGmailModalOpen(true)}
          />
        )}

        {activeTab === 'verify' && (
          <TaskVerificationFlow
            tasks={habitTasks}
            onSubmitProof={handleSubmitProof}
          />
        )}

        {activeTab === 'rewards' && (
          <RewardCenter
            rewards={rewards}
            stats={dashboardStats}
            tasks={habitTasks}
            onRedeemReward={handleRedeemReward}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            leaderboard={leaderboard}
          />
        )}

        {activeTab === 'achievements' && (
          <AchievementsView
            badges={badges}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPage
            user={userProfile}
            onUpdateUser={(updated) => {
              setUserProfile(updated);
              saveStateToBackend({ userProfile: updated });
            }}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            onExportData={handleExportData}
            onShowToast={showToast}
            isAuthenticated={isAuthenticated}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
          />
        )}
      </main>

      {/* AI Sustainability Chatbot (Floating Everywhere) */}
      <AIChatbot
        chatMessages={chatMessages}
        onSendMessage={handleSendChatMessage}
        onClearChat={handleClearChat}
        user={userProfile}
        stats={dashboardStats}
      />

      {/* Gmail Impact Share Modal */}
      <GmailShareModal
        isOpen={isGmailModalOpen}
        onClose={() => setIsGmailModalOpen(false)}
        user={userProfile}
        stats={dashboardStats}
        onShowToast={showToast}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 AI Green Habit Tracker • Powered by Google Gemini AI</span>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setActiveTab('settings')} className="hover:underline">Privacy Policy</button>
            <button onClick={() => setActiveTab('settings')} className="hover:underline">GDPR Data Export</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
