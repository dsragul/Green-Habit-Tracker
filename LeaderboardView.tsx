import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  Flame,
  Sparkles,
  Users,
  Globe,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface LeaderboardViewProps {
  leaderboard: LeaderboardEntry[];
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ leaderboard: initialLeaderboard }) => {
  const [timeframe, setTimeframe] = useState<'global' | 'friends' | 'weekly' | 'monthly'>('global');
  const [currentLeaderboard, setCurrentLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard);

  // Sync initial prop if changed
  useEffect(() => {
    if (initialLeaderboard && initialLeaderboard.length > 0) {
      setCurrentLeaderboard(initialLeaderboard);
    }
  }, [initialLeaderboard]);

  // Connect to SSE Real-Time Stream for live score updates without feed or boost button
  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource('/api/leaderboard/stream');

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.leaderboard) {
            setCurrentLeaderboard(data.leaderboard);
          }
        } catch (e) {
          console.error('Error parsing SSE leaderboard payload:', e);
        }
      };
    } catch (e) {
      console.error('SSE initialization error:', e);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" /> Eco Guardian Real-Time Leaderboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Live global rankings updated continuously as green habits are verified.
          </p>
        </div>

        {/* Timeframe Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-semibold">
          {[
            { id: 'global', label: 'Global', icon: Globe },
            { id: 'friends', label: 'Friends', icon: Users },
            { id: 'weekly', label: 'Weekly', icon: Calendar },
            { id: 'monthly', label: 'Monthly', icon: Calendar }
          ].map((t) => {
            const Icon = t.icon;
            const isSel = timeframe === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTimeframe(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                  isSel
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FULL LEADERBOARD TABLE */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500" /> Complete Live Rankings & Badges
          </h2>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
            Auto-Syncing Live
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Rank</th>
                <th className="p-3.5">Eco Guardian</th>
                <th className="p-3.5">Level</th>
                <th className="p-3.5">Green Points</th>
                <th className="p-3.5">Badges</th>
                <th className="p-3.5 rounded-r-xl">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentLeaderboard.map((user) => (
                <tr
                  key={user.id}
                  className={`transition-all duration-300 ${
                    user.isCurrentUser
                      ? 'bg-emerald-50/90 dark:bg-emerald-950/60 font-bold border-l-4 border-l-emerald-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <td className="p-3.5 font-black text-sm text-slate-900 dark:text-white">
                    <span>#{user.rank}</span>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl text-xs font-bold shrink-0 flex items-center justify-center ${
                          user.isCurrentUser
                            ? 'bg-emerald-600 text-white font-black'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <strong className="block text-slate-900 dark:text-white text-sm">
                          {user.name}
                        </strong>
                        {user.isCurrentUser && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Your Standing
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 font-bold">Lvl {user.level}</td>

                  <td className="p-3.5 font-black text-amber-600 dark:text-amber-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {user.points.toLocaleString()} pts
                    </span>
                  </td>

                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1">
                      {user.badges.slice(0, 3).map((b, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {b}
                        </span>
                      ))}
                      {user.badges.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-bold">+{user.badges.length - 3}</span>
                      )}
                    </div>
                  </td>

                  <td className="p-3.5 font-bold text-amber-600 dark:text-amber-400">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {user.streakDays}d
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
