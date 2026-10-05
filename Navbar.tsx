import React from 'react';
import {
  Leaf,
  LayoutDashboard,
  CheckSquare,
  Gift,
  Trophy,
  Award,
  Settings,
  ShieldAlert,
  Flame,
  Sparkles,
  UserCheck,
  Moon,
  Sun,
  LogIn,
  LogOut
} from 'lucide-react';
import { DashboardStats, UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: DashboardStats;
  user: UserProfile;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isAuthenticated?: boolean;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  user,
  isDarkMode,
  toggleDarkMode,
  isAuthenticated = true,
  onSignOut
}) => {
  const navItems: Array<{ id: string; label: string; icon: any; badge?: number }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'verify', label: 'Verify Tasks', icon: CheckSquare },
    { id: 'rewards', label: 'Reward Center', icon: Gift },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-lg shadow-emerald-950/5 dark:shadow-none p-2 sm:px-4 transition-all">
        <div className="flex items-center justify-between h-12 gap-2 sm:gap-4">
          
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                  AI Green
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-300 dark:border dark:border-emerald-700/50">
                  Tracker
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                Sustainable Habit Network
              </p>
            </div>
          </div>

          {/* Desktop Navigation Bento Pill Bar */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 text-[9px] font-extrabold rounded-full bg-amber-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Metrics & Quick Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Green Points Badge */}
            <div
              onClick={() => setActiveTab('rewards')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold cursor-pointer hover:bg-emerald-100/80 dark:hover:bg-emerald-900/80 transition shadow-xs"
              title="Green Points Balance"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{stats.greenPoints.toLocaleString()}</span>
              <span className="hidden sm:inline text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">pts</span>
            </div>

            {/* Daily Streak */}
            <div
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/70 text-amber-800 dark:text-amber-300 text-xs font-bold cursor-pointer hover:bg-amber-100/80 dark:hover:bg-amber-900/60 transition shadow-xs"
              title={`${stats.currentStreak} Day Eco Streak!`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{stats.currentStreak}d</span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* User Avatar or Sign In button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <div
                  onClick={() => setActiveTab('settings')}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-500/60 cursor-pointer hover:scale-105 transition shadow-xs flex items-center justify-center font-black text-xs text-emerald-700 dark:text-emerald-300 relative"
                  title={`${user.name} (${user.role.toUpperCase()} • Level ${stats.level})`}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
                </div>
                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="p-2 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('settings')}
                className="px-3 py-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1"
                title="Sign In to Account"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center justify-between overflow-x-auto pt-2 pb-1 gap-1 border-t border-slate-200/60 dark:border-slate-800 text-xs no-scrollbar mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition text-xs font-semibold ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded-full bg-amber-400 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
