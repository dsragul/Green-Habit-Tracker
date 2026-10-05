import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Sun,
  Moon,
  Lock,
  Download,
  Trash2,
  LogOut,
  LogIn,
  UserPlus,
  Sparkles,
  Check,
  Save,
  Key,
  Globe,
  Leaf,
  Sliders,
  Smartphone,
  Eye,
  Cookie,
  RefreshCw,
  UserCheck,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Users
} from 'lucide-react';
import { UserProfile, SustainabilityPreferences } from '../types';

interface SettingsPageProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onExportData: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
  isAuthenticated?: boolean;
  onSignIn?: (user: UserProfile) => void;
  onSignOut?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  onUpdateUser,
  isDarkMode,
  toggleDarkMode,
  onExportData,
  onShowToast,
  isAuthenticated = true,
  onSignIn,
  onSignOut
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'personal' | 'account' | 'notifications' | 'theme' | 'privacy' | 'preferences'>('personal');

  // Form states initialized with current user profile
  const [formData, setFormData] = useState<UserProfile>({ ...user });
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Authentication Modal & Form States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'user_login' | 'demo' | 'register'>('user_login');
  const [loginEmail, setLoginEmail] = useState('alex.rivera@eco.org');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Demo Accounts for Quick Switching
  const DEMO_PROFILES: UserProfile[] = [
    {
      ...user,
      id: 'usr_101',
      name: 'Alex Rivera',
      email: 'alex.rivera@eco.org',
      role: 'user',
      avatar: ''
    },
    {
      ...user,
      id: 'usr_103',
      name: 'David Kim',
      email: 'david.kim@eco.org',
      role: 'user',
      avatar: ''
    }
  ];

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationToggle = (field: keyof UserProfile['notificationSettings']) => {
    setFormData(prev => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        [field]: !prev.notificationSettings[field]
      }
    }));
  };

  const handlePrivacyToggle = (field: keyof UserProfile['privacySettings']) => {
    setFormData(prev => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        [field]: !prev.privacySettings[field]
      }
    }));
  };

  const handlePreferenceToggle = (field: keyof SustainabilityPreferences) => {
    setFormData(prev => ({
      ...prev,
      sustainabilityPreferences: {
        ...prev.sustainabilityPreferences,
        [field]: !prev.sustainabilityPreferences[field]
      }
    }));
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    onShowToast('Settings Saved', 'Your profile, notifications, and sustainability preferences were updated!', 'success');
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      onShowToast('Invalid Password', 'Password must be at least 6 characters long.', 'error');
      return;
    }
    setPasswordModalOpen(false);
    setNewPassword('');
    onShowToast('Password Updated', 'Your security credentials have been refreshed.', 'success');
  };

  // Handle User Login Form Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      onShowToast('Email Required', 'Please enter your user account email address.', 'error');
      return;
    }

    setIsAuthLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (data.success && data.userProfile) {
        setFormData(data.userProfile);
        if (onSignIn) onSignIn(data.userProfile);
        setAuthModalOpen(false);
        onShowToast('User Signed In', `Welcome back, ${data.userProfile.name}!`, 'success');
      } else {
        onShowToast('Login Failed', data.error || 'Check your credentials and try again.', 'error');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Fallback client sign in
      const matchedDemo = DEMO_PROFILES.find(p => p.email.toLowerCase() === loginEmail.toLowerCase() && p.role === 'user');
      const signedUser: UserProfile = matchedDemo || {
        ...user,
        name: loginEmail.split('@')[0].replace('.', ' '),
        email: loginEmail,
        role: 'user'
      };
      setFormData(signedUser);
      if (onSignIn) onSignIn(signedUser);
      setAuthModalOpen(false);
      onShowToast('User Signed In', `Welcome back, ${signedUser.name}!`, 'success');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Handle Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) {
      onShowToast('Fields Required', 'Please enter your name and email address.', 'error');
      return;
    }

    setIsAuthLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          role: 'user'
        })
      });
      const data = await res.json();
      if (data.success && data.userProfile) {
        setFormData(data.userProfile);
        if (onSignIn) onSignIn(data.userProfile);
        setAuthModalOpen(false);
        onShowToast('Account Created', `Welcome aboard, ${data.userProfile.name}!`, 'success');
      }
    } catch (err) {
      const newUser: UserProfile = {
        ...user,
        id: `usr_${Date.now()}`,
        name: regName,
        email: regEmail,
        role: 'user'
      };
      setFormData(newUser);
      if (onSignIn) onSignIn(newUser);
      setAuthModalOpen(false);
      onShowToast('Account Created', `Welcome aboard, ${newUser.name}!`, 'success');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Handle Demo Quick Login
  const handleDemoLogin = (profile: UserProfile) => {
    setFormData(profile);
    if (onSignIn) onSignIn(profile);
    setAuthModalOpen(false);
    onShowToast('Switched Account', `Logged in as ${profile.name} (${profile.role})`, 'success');
  };

  // Handle Sign Out Action
  const handleSignOutAction = () => {
    if (confirm('Are you sure you want to sign out of your account session?')) {
      if (onSignOut) onSignOut();
      onShowToast('Signed Out', 'You have been safely logged out of your session.', 'info');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Settings Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-emerald-500" /> Account & Profile Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal profile, security credentials, notification alerts, and sign in/out options.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated ? (
            <button
              onClick={handleSignOutAction}
              className="px-4 py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900 font-bold text-xs transition flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthTab('signin');
                setAuthModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
          )}

          <button
            onClick={handleSaveAll}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center gap-2 shrink-0"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Settings Navigation Sidebar */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 h-fit space-y-1 text-xs">
          {[
            { id: 'personal', label: 'Personal Information', icon: User },
            { id: 'account', label: 'Account & Security', icon: Shield },
            { id: 'notifications', label: 'Notification Settings', icon: Bell },
            { id: 'theme', label: 'Theme Settings', icon: Sun },
            { id: 'privacy', label: 'Privacy & Data', icon: Lock },
            { id: 'preferences', label: 'Sustainability Preferences', icon: Leaf },
          ].map((item) => {
            const Icon = item.icon;
            const isSel = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition text-left ${
                  isSel
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panels */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          
          {/* 1. Personal Information */}
          {activeSubTab === 'personal' && (
            <div className="space-y-6 text-xs">
              <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Personal Information
              </h2>

              {/* User Initials & Role Badge Display */}
              <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-500 shadow-sm flex items-center justify-center font-black text-xl text-emerald-700 dark:text-emerald-300 shrink-0">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{formData.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      formData.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {formData.role}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{formData.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Preferred Language</label>
                  <select
                    value={formData.preferredLanguage}
                    onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 2. Account Settings */}
          {activeSubTab === 'account' && (
            <div className="space-y-6 text-xs">
              <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Account & Security Settings
              </h2>

              {/* USER AUTHENTICATION & SESSION CONTROLS */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 to-purple-950 text-white border border-purple-500/30 space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-950 border-2 border-emerald-400 shrink-0 flex items-center justify-center font-black text-xl text-emerald-300">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-white">{formData.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          formData.role === 'admin' ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40' : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {formData.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">{formData.email}</p>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isAuthenticated
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isAuthenticated ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                          {isAuthenticated ? 'Authenticated Session' : 'Signed Out / Guest'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Auth Actions */}
                  <div className="flex items-center gap-2">
                    {isAuthenticated ? (
                      <>
                        <button
                          onClick={() => {
                            setAuthTab('demo');
                            setAuthModalOpen(true);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-purple-400" /> Switch Account
                        </button>
                        <button
                          onClick={handleSignOutAction}
                          className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md shadow-rose-600/20 transition flex items-center gap-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Sign Out
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setAuthTab('signin');
                          setAuthModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5"
                      >
                        <LogIn className="w-4 h-4" /> Sign In / Register
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Account Switcher Shortcuts */}
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="text-slate-400 font-medium">Quick Switch Demo Accounts:</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {DEMO_PROFILES.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleDemoLogin(p)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition flex items-center gap-1.5 ${
                          formData.email === p.email
                            ? 'bg-purple-600/80 border-purple-400 text-white shadow-xs'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <UserCheck className="w-3 h-3 text-emerald-400" />
                        <span>{p.name.split(' ')[0]} ({p.role})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Password & 2FA */}

              {/* Password & 2FA */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Account Password</h3>
                    <p className="text-slate-500">Last changed on {formData.accountSettings.lastPasswordChange}</p>
                  </div>
                  <button
                    onClick={() => setPasswordModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold transition"
                  >
                    Change Password
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Two-Factor Authentication (2FA)</h3>
                    <p className="text-slate-500">Require authenticator app code on new logins</p>
                  </div>
                  <button
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        accountSettings: {
                          ...prev.accountSettings,
                          twoFactorEnabled: !prev.accountSettings.twoFactorEnabled
                        }
                      }));
                      onShowToast('2FA Updated', 'Two-Factor Authentication status saved.', 'info');
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold transition ${
                      formData.accountSettings.twoFactorEnabled
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {formData.accountSettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              {/* Active Sessions */}
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Active Session Management</h3>
                <div className="space-y-2">
                  {formData.accountSettings.activeSessions.map((sess) => (
                    <div key={sess.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="w-4 h-4 text-emerald-500" />
                        <div>
                          <strong className="block text-slate-900 dark:text-white">{sess.device}</strong>
                          <span className="text-[11px] text-slate-400">{sess.location} • {sess.ip} • {sess.lastActive}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onShowToast('Session Ended', 'Logged out from target device.', 'info')}
                        className="text-rose-500 font-bold hover:underline"
                      >
                        End Session
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-3">
                <h3 className="font-bold text-rose-900 dark:text-rose-300 text-sm">Danger Zone</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => onShowToast('Logout All Devices', 'Logged out from all active browser sessions.', 'info')}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout All Devices
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to permanently delete your account and eco stats?')) {
                        onShowToast('Account Deleted', 'User account has been purged.', 'error');
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Account
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* 3. Notification Settings */}
          {activeSubTab === 'notifications' && (
            <div className="space-y-6 text-xs">
              <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Notification & Reminder Preferences
              </h2>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { key: 'email', title: 'Email Notifications', desc: 'Receive weekly eco digests and verification updates via email' },
                  { key: 'push', title: 'Push Notifications', desc: 'Real-time browser notifications for streak reminders' },
                  { key: 'dailyReminder', title: 'Daily Habit Reminder', desc: 'Prompt at 08:00 AM to log your green habit' },
                  { key: 'weeklyReport', title: 'Weekly Progress Report', desc: 'Summary of carbon saved and leaderboard standing' },
                  { key: 'monthlyReport', title: 'Monthly Impact Report', desc: 'Deep dive into total water, power, and CO2 stats' },
                  { key: 'challengeAlerts', title: 'Challenge Alerts', desc: 'Be notified when new community challenges go live' },
                  { key: 'rewardAlerts', title: 'Reward & Voucher Alerts', desc: 'Alerts when points qualify for organic vouchers' },
                ].map((item) => {
                  const isChecked = formData.notificationSettings[item.key as keyof UserProfile['notificationSettings']];
                  return (
                    <div key={item.key} className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <strong className="block text-slate-900 dark:text-white text-sm">{item.title}</strong>
                        <span className="text-slate-500">{item.desc}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleNotificationToggle(item.key as any)}
                        className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                          isChecked ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`block w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                          isChecked ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Theme Settings */}
          {activeSubTab === 'theme' && (
            <div className="space-y-6 text-xs">
              <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Appearance & Theme Mode
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'light', label: 'Light Theme', icon: Sun, desc: 'Clean high-contrast light design' },
                  { id: 'dark', label: 'Dark Theme', icon: Moon, desc: 'Eye-safe twilight dark design' },
                  { id: 'system', label: 'System Default', icon: Sliders, desc: 'Sync with OS color theme' },
                ].map((t) => {
                  const Icon = t.icon;
                  const isSel = (t.id === 'dark' && isDarkMode) || (t.id === 'light' && !isDarkMode);

                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        if ((t.id === 'dark' && !isDarkMode) || (t.id === 'light' && isDarkMode)) {
                          toggleDarkMode();
                        }
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                        isSel
                          ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-emerald-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Icon className="w-5 h-5 text-emerald-500" />
                        {isSel && <Check className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <div>
                        <strong className="block text-sm text-slate-900 dark:text-white">{t.label}</strong>
                        <p className="text-[11px] text-slate-500 mt-1">{t.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Privacy & Data Settings */}
          {activeSubTab === 'privacy' && (
            <div className="space-y-6 text-xs">
              <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Privacy, Cloud Database & Data Export
              </h2>

              {/* Database Storage Information Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 dark:text-white text-sm">Cloud Database Storage</strong>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        Connected
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
                      Your habits, verified tasks, rewards, and leaderboard scores are stored securely in <strong>Firebase Firestore</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div>
                    <strong className="block text-slate-900 dark:text-white text-sm">Download Personal Data (JSON)</strong>
                    <span className="text-slate-500">Export complete verified task history, points, and account settings</span>
                  </div>
                  <button
                    onClick={onExportData}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Data
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <strong className="block text-slate-900 dark:text-white">Public Profile Visibility</strong>
                      <span className="text-slate-500">Allow other eco guardians to see your name on Leaderboard</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePrivacyToggle('publicProfile')}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        formData.privacySettings.publicProfile ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span className={`block w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        formData.privacySettings.publicProfile ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <strong className="block text-slate-900 dark:text-white">Show Achievements Publicly</strong>
                      <span className="text-slate-500">Display unlocked badges on global user list</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePrivacyToggle('showAchievements')}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        formData.privacySettings.showAchievements ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span className={`block w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        formData.privacySettings.showAchievements ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. Sustainability Preferences */}
          {activeSubTab === 'preferences' && (
            <div className="space-y-6 text-xs">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Sustainability Preferences & Focus Areas
                </h2>
                <p className="text-slate-500 mt-1">
                  The AI Sustainability Advisor uses these selected interests to tailor eco habit recommendations and chatbot answers specifically for you!
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: 'recycling', label: 'Recycling' },
                  { key: 'waterSaving', label: 'Water Saving' },
                  { key: 'electricitySaving', label: 'Electricity Saving' },
                  { key: 'publicTransport', label: 'Public Transport' },
                  { key: 'cycling', label: 'Cycling' },
                  { key: 'solarEnergy', label: 'Solar Energy' },
                  { key: 'treePlantation', label: 'Tree Plantation' },
                  { key: 'wasteManagement', label: 'Waste Management' },
                ].map((item) => {
                  const isChecked = formData.sustainabilityPreferences[item.key as keyof SustainabilityPreferences];
                  return (
                    <button
                      type="button"
                      key={item.key}
                      onClick={() => handlePreferenceToggle(item.key as any)}
                      className={`p-3 rounded-2xl border font-bold flex items-center justify-between transition ${
                        isChecked
                          ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isChecked && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* PASSWORD CHANGE MODAL */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-500" /> Change Account Password
            </h3>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Enter at least 6 characters..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER AUTHENTICATION MODAL (Sign In, Demo Switch, Register) */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative my-8">
            
            {/* Modal Title & Close */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Account Sign In & Authentication
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sign in or register to synchronize your verified green habits
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAuthModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Auth Modal Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[11px] font-bold">
              <button
                onClick={() => setAuthTab('user_login')}
                className={`py-2 px-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  authTab === 'user_login'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5 text-emerald-500" /> User Login
              </button>
              <button
                onClick={() => setAuthTab('demo')}
                className={`py-2 px-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  authTab === 'demo'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> Quick Demo
              </button>
              <button
                onClick={() => setAuthTab('register')}
                className={`py-2 px-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  authTab === 'register'
                    ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Register
              </button>
            </div>

            {/* TAB 1: USER SIGN IN FORM */}
            {authTab === 'user_login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                  <User className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Eco Guardian Portal — User Account Access</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">User Email Address</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    placeholder="e.g. alex.rivera@eco.org"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    placeholder="••••••••••••"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                    <span>Keep user session active</span>
                  </label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); onShowToast('Password Reset', 'User password reset link sent to email.', 'info'); }} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  {isAuthLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                  <span>Sign In as Eco Guardian (User)</span>
                </button>
              </form>
            )}

            {/* TAB 2: DEMO ACCOUNTS QUICK SWITCH */}
            {authTab === 'demo' && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Select a user account below to switch profiles:
                </p>

                <div className="space-y-2">
                  {DEMO_PROFILES.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleDemoLogin(p)}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-300 dark:hover:border-emerald-800 cursor-pointer transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl font-black text-sm shrink-0 flex items-center justify-center bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <strong className="block text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{p.name}</strong>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{p.email}</p>
                        </div>
                      </div>

                      <button className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition text-[11px]">
                        Select Account
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: REGISTER NEW ACCOUNT */}
            {authTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="e.g. Maya Lin"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="e.g. maya.lin@eco.org"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="At least 6 characters..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  {isAuthLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  <span>Create Account & Sign In</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
