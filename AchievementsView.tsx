import React, { useState } from 'react';
import {
  Award,
  Sprout,
  Zap,
  Flame,
  Droplets,
  Lightbulb,
  Recycle,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ChevronRight,
  Filter,
  TrendingUp,
  Share2
} from 'lucide-react';
import { BadgeItem } from '../types';

interface AchievementsViewProps {
  badges: BadgeItem[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ badges }) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'in_progress' | 'near_unlock'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sprout': return Sprout;
      case 'Zap': return Zap;
      case 'Flame': return Flame;
      case 'Droplets': return Droplets;
      case 'Lightbulb': return Lightbulb;
      case 'Recycle': return Recycle;
      case 'ShieldCheck': return ShieldCheck;
      default: return Award;
    }
  };

  const getTierInfo = (pct: number) => {
    if (pct >= 100) {
      return {
        currentTier: 'Master Tier',
        nextTier: 'Max Tier Achieved',
        tierLevel: 4,
        tierIcon: '💎',
        tierLabel: 'Diamond Master',
        badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/30'
      };
    } else if (pct >= 75) {
      return {
        currentTier: 'Tier 3',
        nextTier: 'Master Tier (100%)',
        tierLevel: 3,
        tierIcon: '🥇',
        tierLabel: 'Gold Tier',
        badgeColor: 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      };
    } else if (pct >= 50) {
      return {
        currentTier: 'Tier 2',
        nextTier: 'Gold Tier (75%)',
        tierLevel: 2,
        tierIcon: '🥈',
        tierLabel: 'Silver Tier',
        badgeColor: 'text-slate-600 dark:text-slate-300 bg-slate-500/10 border-slate-500/30'
      };
    } else if (pct >= 25) {
      return {
        currentTier: 'Tier 1',
        nextTier: 'Silver Tier (50%)',
        tierLevel: 1,
        tierIcon: '🥉',
        tierLabel: 'Bronze Tier',
        badgeColor: 'text-amber-800 dark:text-amber-400 bg-amber-700/10 border-amber-700/30'
      };
    } else {
      return {
        currentTier: 'Starter',
        nextTier: 'Bronze Tier (25%)',
        tierLevel: 0,
        tierIcon: '🌱',
        tierLabel: 'Novice Eco',
        badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      };
    }
  };

  const getNextTierDetails = (progress: number, maxProgress: number) => {
    const pct = Math.min(100, Math.round((progress / maxProgress) * 100));
    let targetProgress = maxProgress;
    let nextTierName = 'Master Tier';

    if (pct < 25) {
      targetProgress = Math.ceil(maxProgress * 0.25);
      nextTierName = 'Bronze Tier';
    } else if (pct < 50) {
      targetProgress = Math.ceil(maxProgress * 0.50);
      nextTierName = 'Silver Tier';
    } else if (pct < 75) {
      targetProgress = Math.ceil(maxProgress * 0.75);
      nextTierName = 'Gold Tier';
    } else if (pct < 100) {
      targetProgress = maxProgress;
      nextTierName = 'Master Tier';
    } else {
      return { remaining: 0, nextTierName: 'Master Tier', targetProgress: maxProgress, isMax: true };
    }

    const remaining = Math.max(0, targetProgress - progress);
    return { remaining, nextTierName, targetProgress, isMax: false };
  };

  const categories = ['All', ...Array.from(new Set(badges.map(b => b.category)))];

  const filteredBadges = badges.filter(badge => {
    const pct = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));

    if (selectedCategory !== 'All' && badge.category !== selectedCategory) {
      return false;
    }

    if (filter === 'unlocked') return badge.unlocked;
    if (filter === 'in_progress') return !badge.unlocked && pct < 100;
    if (filter === 'near_unlock') return !badge.unlocked && pct >= 50;

    return true;
  });

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const masterTiersCount = badges.filter(b => Math.round((b.progress / b.maxProgress) * 100) >= 100).length;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Bento Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 p-6 sm:p-8 rounded-3xl border border-purple-500/20 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
            <Award className="w-3.5 h-3.5 text-amber-400" /> Tiered Eco Badges & Milestone Tracker
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Automated Achievement & Tier Showcase
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Monitor real-time tier progression (Bronze, Silver, Gold, Master) for every eco habit. Verified task submissions advance your badge tiers automatically.
          </p>
        </div>

        {/* Quick Tier Stats Bento Pill */}
        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-center min-w-[100px]">
            <span className="block text-[10px] text-slate-400 uppercase font-bold">Badges Unlocked</span>
            <span className="text-2xl font-black text-purple-400">
              {unlockedCount} / {badges.length}
            </span>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-center min-w-[100px]">
            <span className="block text-[10px] text-slate-400 uppercase font-bold">Master Tiers</span>
            <span className="text-2xl font-black text-amber-400">
              {masterTiersCount} 💎
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Category Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 dark:bg-slate-900/90 p-4 rounded-3xl border border-slate-200/90 dark:border-slate-800/80 shadow-xs">
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Badges' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'near_unlock', label: 'Near Unlock (≥50%)' },
            { id: 'unlocked', label: 'Unlocked' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                filter === tab.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBadges.map((badge) => {
          const Icon = getBadgeIcon(badge.iconName);
          const pct = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));
          const tierInfo = getTierInfo(pct);
          const nextTier = getNextTierDetails(badge.progress, badge.maxProgress);

          return (
            <div
              key={badge.id}
              className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-lg ${
                badge.unlocked
                  ? 'bg-white/90 dark:bg-slate-900/90 border-emerald-500/40 hover:border-emerald-500/60'
                  : 'bg-white/90 dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800/80 hover:border-purple-500/40'
              }`}
            >
              <div>
                {/* Top Badge Card Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 ${
                      badge.unlocked
                        ? 'bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400'
                        : 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                          {badge.category}
                        </span>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${tierInfo.badgeColor}`}>
                          {tierInfo.tierIcon} {tierInfo.tierLabel}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-1 leading-snug">
                        {badge.title}
                      </h3>
                    </div>
                  </div>

                  {/* Lock/Unlock Pill */}
                  {badge.unlocked ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-800 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Unlocked
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center gap-1 border border-slate-200 dark:border-slate-700 shrink-0">
                      <Lock className="w-3 h-3 text-amber-500" /> In Progress
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* PROGRESS BAR VISUALIZATION SECTION */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                
                {/* Header Progress Numerical readout */}
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
                    <span>Tier Progress</span>
                    <span className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                      {pct}%
                    </span>
                  </div>

                  <span className={badge.unlocked ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-600 dark:text-slate-400'}>
                    {badge.progress} / {badge.maxProgress}
                  </span>
                </div>

                {/* Progress Bar Container with Milestone Ticks */}
                <div className="relative pt-1 pb-1">
                  {/* Outer Bar Track */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200/80 dark:border-slate-700/60 relative">
                    {/* Animated Filled Progress Indicator */}
                    <div
                      className={`h-full rounded-full transition-all duration-700 relative shadow-sm ${
                        pct >= 100
                          ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 animate-pulse'
                          : pct >= 50
                          ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-emerald-400'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    >
                      {pct > 15 && (
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-black text-white px-1 leading-none drop-shadow-xs">
                          {pct}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Milestone Tiers Ticks (25% Bronze, 50% Silver, 75% Gold, 100% Diamond) */}
                  <div className="relative w-full flex justify-between items-center mt-1 px-1 text-[9px] font-bold text-slate-400">
                    
                    {/* 25% Bronze */}
                    <div className="flex flex-col items-center gap-0.5">
                      <div className={`w-2 h-2 rounded-full border ${pct >= 25 ? 'bg-amber-600 border-amber-400 ring-2 ring-amber-500/20' : 'bg-slate-300 dark:bg-slate-700 border-transparent'}`} />
                      <span className={pct >= 25 ? 'text-amber-700 dark:text-amber-400 font-extrabold' : ''}>25% 🥉</span>
                    </div>

                    {/* 50% Silver */}
                    <div className="flex flex-col items-center gap-0.5">
                      <div className={`w-2 h-2 rounded-full border ${pct >= 50 ? 'bg-slate-400 border-slate-200 ring-2 ring-slate-400/20' : 'bg-slate-300 dark:bg-slate-700 border-transparent'}`} />
                      <span className={pct >= 50 ? 'text-slate-800 dark:text-slate-200 font-extrabold' : ''}>50% 🥈</span>
                    </div>

                    {/* 75% Gold */}
                    <div className="flex flex-col items-center gap-0.5">
                      <div className={`w-2 h-2 rounded-full border ${pct >= 75 ? 'bg-yellow-500 border-yellow-300 ring-2 ring-yellow-500/20' : 'bg-slate-300 dark:bg-slate-700 border-transparent'}`} />
                      <span className={pct >= 75 ? 'text-yellow-600 dark:text-yellow-400 font-extrabold' : ''}>75% 🥇</span>
                    </div>

                    {/* 100% Diamond */}
                    <div className="flex flex-col items-center gap-0.5">
                      <div className={`w-2 h-2 rounded-full border ${pct >= 100 ? 'bg-emerald-500 border-emerald-300 ring-2 ring-emerald-500/20' : 'bg-slate-300 dark:bg-slate-700 border-transparent'}`} />
                      <span className={pct >= 100 ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : ''}>100% 💎</span>
                    </div>

                  </div>
                </div>

                {/* Next Tier Action Requirement Banner */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  {nextTier.isMax ? (
                    <div className="w-full text-center py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px] flex items-center justify-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>Diamond Master Tier Unlocked!</span>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-between py-1.5 px-3 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/50 text-[11px]">
                      <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
                        <ChevronRight className="w-3 h-3 text-purple-500" /> Next: <strong className="font-extrabold text-purple-700 dark:text-purple-300">{nextTier.nextTierName}</strong>
                      </span>

                      <span className="font-extrabold text-purple-700 dark:text-purple-300">
                        Need {nextTier.remaining} more
                      </span>
                    </div>
                  )}
                </div>

                {/* Unlock Timestamp if unlocked */}
                {badge.unlocked && badge.unlockedAt && (
                  <p className="text-[10px] text-slate-400 italic text-right font-medium">
                    Unlocked on {badge.unlockedAt}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

