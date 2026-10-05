import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  CloudRain,
  Droplet,
  Zap,
  Trash2,
  Trees,
  Flame,
  Target,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Filter,
  CheckSquare,
  Gift,
  Bot,
  Calendar,
  Mail
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { DashboardStats, ActivityItem, UserProfile } from '../types';

interface UserDashboardProps {
  stats: DashboardStats;
  activities: ActivityItem[];
  user: UserProfile;
  onNavigate: (tab: string) => void;
  onOpenGmailModal?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  stats,
  activities,
  user,
  onNavigate,
  onOpenGmailModal
}) => {
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [chartTimeframe, setChartTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  // Chart Data Sets
  const dailyHabitData = [
    { day: 'Mon', completed: 3, goal: 4, points: 140 },
    { day: 'Tue', completed: 4, goal: 4, points: 180 },
    { day: 'Wed', completed: 5, goal: 4, points: 210 },
    { day: 'Thu', completed: 2, goal: 4, points: 90 },
    { day: 'Fri', completed: 4, goal: 4, points: 160 },
    { day: 'Sat', completed: 6, goal: 4, points: 280 },
    { day: 'Sun', completed: 4, goal: 4, points: 190 },
  ];

  const weeklyTrendData = [
    { week: 'Wk 1', carbonSaved: 8.5, waterSaved: 60, points: 310 },
    { week: 'Wk 2', carbonSaved: 12.0, waterSaved: 95, points: 450 },
    { week: 'Wk 3', carbonSaved: 15.2, waterSaved: 110, points: 580 },
    { week: 'Wk 4', carbonSaved: 22.8, waterSaved: 160, points: 890 },
    { week: 'Wk 5', carbonSaved: 31.4, waterSaved: 240, points: 1120 },
    { week: 'Wk 6', carbonSaved: stats.carbonSavedKg, waterSaved: stats.waterSavedLiters, points: stats.greenPoints },
  ];

  const categoryPieData = [
    { name: 'Recycling', value: 30, color: '#10b981' },
    { name: 'Water Saving', value: 25, color: '#06b6d4' },
    { name: 'Electricity', value: 20, color: '#f59e0b' },
    { name: 'Transport', value: 15, color: '#8b5cf6' },
    { name: 'Trees & Waste', value: 10, color: '#ec4899' },
  ];

  const sustainabilityScoreData = [
    { name: 'Score', value: 88, fill: '#10b981' }
  ];

  const filteredActivities = activities.filter(act => {
    if (activityFilter === 'all') return true;
    if (activityFilter === 'tasks') return act.type === 'task_complete' || act.type === 'verification_submitted';
    if (activityFilter === 'badges') return act.type === 'badge_earned';
    if (activityFilter === 'rewards') return act.type === 'reward_claimed';
    if (activityFilter === 'ai') return act.type === 'ai_suggestion';
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome Banner Bento Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-emerald-500/30 group hover:border-emerald-400/50 transition-all">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Eco Guardian Level {stats.level}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user.name}! 🌿
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Your sustainable habits have saved <span className="text-emerald-400 font-bold">{stats.carbonSavedKg} kg CO₂</span> and equivalent to <span className="text-emerald-400 font-bold">{stats.treesEquivalent} planted trees</span>. Keep up your {stats.currentStreak}-day streak!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('verify')}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Verify New Task</span>
            </button>
            <button
              onClick={onOpenGmailModal}
              className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-rose-600/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-white" />
              <span>Email Report via Gmail</span>
            </button>
            <button
              onClick={() => onNavigate('rewards')}
              className="px-5 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-white border border-slate-700 font-bold text-xs sm:text-sm hover:border-emerald-500/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Gift className="w-4 h-4 text-emerald-400" />
              <span>Redeem Points</span>
            </button>
          </div>
        </div>
      </div>

      {/* OVERVIEW CARDS (Bento Tile Grid) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" /> Key Sustainability Bento Overview
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Updated live from verified proofs</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5 sm:gap-4">
          
          {/* 1. Green Points */}
          <div className="p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:shadow-lg hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Green Points</span>
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stats.greenPoints.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
              +{stats.pointsEarnedToday} pts today
            </p>
          </div>

          {/* 2. Level & XP Progress */}
          <div className="p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:shadow-lg hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Level & XP</span>
              <Award className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Lvl {stats.level}
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(stats.xp / stats.xpToNextLevel) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {stats.xp}/{stats.xpToNextLevel} XP
            </p>
          </div>

          {/* 3. Total Tasks Completed */}
          <div className="p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:shadow-lg hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Tasks Logged</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stats.totalTasksCompleted}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Verified actions
            </p>
          </div>

          {/* 4. Pending Tasks */}
          <div className="p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:shadow-lg hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Pending</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stats.pendingTasks}
            </div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-1">
              Awaiting review
            </p>
          </div>

          {/* 5. Carbon Emissions Saved */}
          <div className="p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:shadow-lg hover:border-teal-500/40 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">CO₂ Saved</span>
              <CloudRain className="w-4 h-4 text-teal-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stats.carbonSavedKg} <span className="text-xs font-normal">kg</span>
            </div>
            <p className="text-[11px] text-teal-600 dark:text-teal-400 font-bold mt-1">
              Emissions reduced
            </p>
          </div>

          {/* 6. Water Saved */}
          <div className="p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:shadow-lg hover:border-cyan-500/40 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Water Saved</span>
              <Droplet className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stats.waterSavedLiters} <span className="text-xs font-normal">L</span>
            </div>
            <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-bold mt-1">
              Freshwater saved
            </p>
          </div>

          {/* 7. Electricity Saved */}
          <div className="p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:shadow-lg hover:border-amber-500/40 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Power Saved</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stats.electricitySavedKwh} <span className="text-xs font-normal">kWh</span>
            </div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-1">
              Grid power saved
            </p>
          </div>

          {/* 8. Trees Equivalent Saved */}
          <div className="p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:shadow-lg hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Trees Equiv.</span>
              <Trees className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stats.treesEquivalent}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
              Absorption equiv.
            </p>
          </div>

          {/* 10. Current Streak */}
          <div className="p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:shadow-lg hover:border-amber-500/40 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Streak</span>
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stats.currentStreak} <span className="text-xs font-normal">days</span>
            </div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-1">
              Active eco streak
            </p>
          </div>

          {/* 11. Weekly Goal Progress */}
          <div className="p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:shadow-lg hover:border-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 col-span-2 sm:col-span-1 lg:col-span-2 xl:col-span-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Weekly Target Goal</span>
              <Target className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {stats.weeklyGoalProgress} / {stats.weeklyGoalTarget}
              </span>
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                {Math.round((stats.weeklyGoalProgress / stats.weeklyGoalTarget) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (stats.weeklyGoalProgress / stats.weeklyGoalTarget) * 100)}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* PROGRESS CHARTS SECTION */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" /> Interactive Progress Analytics
          </h2>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
            <button
              onClick={() => setChartTimeframe('weekly')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                chartTimeframe === 'weekly'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setChartTimeframe('monthly')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                chartTimeframe === 'monthly'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Daily Habit Completion Bento Tile */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:border-emerald-500/40 transition-all">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 mb-1">
              Daily Habit Completion
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Number of completed habits logged per day vs weekly target
            </p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyHabitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} name="Completed Habits" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Carbon Reduction & Water Saved Trend Bento Tile */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:border-teal-500/40 transition-all">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 mb-1">
              Carbon Reduction & Resource Savings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Cumulative CO₂ emissions saved (kg) over recent weeks
            </p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" stroke="#888888" fontSize={12} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="carbonSaved" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorCarbon)" name="Carbon Saved (kg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Habit Categories Breakdown Bento Tile */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:border-emerald-500/40 transition-all">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 mb-1">
              Habit Categories Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Breakdown of verified actions across sustainability areas
            </p>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Overall Sustainability Score Bento Tile */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:border-purple-500/40 transition-all flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 mb-1">
                Sustainability Score Gauge
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Algorithmic score based on consistency, verification proof, and savings
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-4 my-2">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={12} data={sustainabilityScoreData} startAngle={180} endAngle={0}>
                    <RadialBar background={{ fill: '#e2e8f0' }} dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">88</span>
                  <span className="text-xs text-slate-500 block font-bold">/ 100</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300">Habit Consistency: <strong>92%</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300">Proof Verification: <strong>95%</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300">Peer Ranking Top: <strong>8%</strong></span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 text-center italic font-medium">
              "Your verified habits place you in the Top 10 Eco Guardians!"
            </p>
          </div>

        </div>
      </div>

      {/* ACTIVITY TIMELINE SECTION (Bento Box Layout) */}
      <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-500" /> Activity & Milestones Timeline
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              History of completed tasks, earned badges, redeemed rewards, and AI suggestions
            </p>
          </div>

          {/* Activity Filters */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-2xl text-xs border border-slate-200/80 dark:border-slate-700/60">
            {[
              { id: 'all', label: 'All' },
              { id: 'tasks', label: 'Tasks' },
              { id: 'badges', label: 'Badges' },
              { id: 'rewards', label: 'Rewards' },
              { id: 'ai', label: 'AI Tips' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActivityFilter(f.id)}
                className={`px-3 py-1 rounded-xl font-semibold transition ${
                  activityFilter === f.id
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Items */}
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {filteredActivities.map((item) => (
            <div key={item.id} className="relative group">
              
              {/* Node Icon */}
              <div className={`absolute -left-6 top-1 w-6 h-6 rounded-full flex items-center justify-center text-white ring-4 ring-white dark:ring-slate-900 shadow-xs ${
                item.type === 'task_complete' ? 'bg-emerald-500' :
                item.type === 'badge_earned' ? 'bg-amber-500' :
                item.type === 'reward_claimed' ? 'bg-purple-500' :
                item.type === 'ai_suggestion' ? 'bg-blue-500' : 'bg-teal-500'
              }`}>
                {item.type === 'task_complete' && <CheckSquare className="w-3.5 h-3.5" />}
                {item.type === 'badge_earned' && <Award className="w-3.5 h-3.5" />}
                {item.type === 'reward_claimed' && <Gift className="w-3.5 h-3.5" />}
                {item.type === 'ai_suggestion' && <Bot className="w-3.5 h-3.5" />}
                {item.type === 'verification_submitted' && <Clock className="w-3.5 h-3.5" />}
              </div>

              <div className="bg-slate-50/80 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    {item.title}
                    {item.category && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-800/50">
                        {item.category}
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {item.points && (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                      item.points > 0
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-800'
                        : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                    }`}>
                      {item.points > 0 ? `+${item.points}` : item.points} pts
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 font-medium">
                    {item.timestamp}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
