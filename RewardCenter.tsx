import React, { useState } from 'react';
import {
  Gift,
  Sparkles,
  Award,
  Trees,
  ShoppingBag,
  HeartHandshake,
  CheckCircle2,
  Lock,
  Download,
  Share2,
  Clock,
  Ticket
} from 'lucide-react';
import { RewardItem, DashboardStats, HabitTask } from '../types';

interface RewardCenterProps {
  rewards: RewardItem[];
  stats: DashboardStats;
  tasks: HabitTask[];
  onRedeemReward: (rewardId: string) => void;
}

export const RewardCenter: React.FC<RewardCenterProps> = ({
  rewards,
  stats,
  tasks,
  onRedeemReward
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [certificateModalReward, setCertificateModalReward] = useState<RewardItem | null>(null);

  // Check if user has at least 1 verified task
  const verifiedTasksCount = tasks.filter(t => t.verificationStatus === 'Verified').length;
  const isVerificationUnlocked = verifiedTasksCount >= 1;

  const categories = ['All', 'Coupon', 'Gift Card', 'Tree Certificate', 'Donation', 'Eco Badge'];

  const filteredRewards = rewards.filter(r => {
    if (selectedCategory === 'All') return true;
    return r.category === selectedCategory;
  });

  const redeemedHistory = rewards.filter(r => r.redeemed);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-emerald-500/20 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Gift className="w-3.5 h-3.5" /> Eco Rewards Store
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Redeem Points for Real Eco Impact
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Exchange your verified Green Points for organic coupons, gift cards, tree certificates, and charitable donations.
          </p>
        </div>

        {/* Balance Overview Cards */}
        <div className="grid grid-cols-3 gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-center shrink-0">
          <div>
            <span className="block text-[10px] text-slate-400 uppercase font-bold">Current Points</span>
            <span className="text-xl font-black text-amber-400 flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 fill-amber-400" /> {stats.greenPoints.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="block text-[10px] text-slate-400 uppercase font-bold">Earned Today</span>
            <span className="text-xl font-black text-emerald-400">
              +{stats.pointsEarnedToday}
            </span>
          </div>

          <div>
            <span className="block text-[10px] text-slate-400 uppercase font-bold">Lifetime Points</span>
            <span className="text-xl font-black text-purple-400">
              {stats.lifetimePoints.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Task Verification Prerequisite Notice */}
      {!isVerificationUnlocked ? (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-3">
          <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <strong>Task Verification Required Before Claiming Rewards!</strong>
            <p className="mt-0.5 opacity-90">
              You must complete and verify at least 1 eco task before reward redemption unlocks. (Current verified tasks: {verifiedTasksCount})
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Verified Task Criteria Met! Reward claims are active.</span>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-102'
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rewards Grid (Bento Tiles) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map((reward) => {
          const hasEnoughPoints = stats.greenPoints >= reward.pointsCost;
          const canRedeem = isVerificationUnlocked && hasEnoughPoints && !reward.redeemed;

          return (
            <div
              key={reward.id}
              className={`rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 overflow-hidden shadow-xs flex flex-col justify-between transition-all duration-300 ${
                reward.redeemed ? 'opacity-85' : 'hover:shadow-xl hover:border-emerald-500/40 hover:-translate-y-1'
              }`}
            >
              {/* Image & Category Pill */}
              <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img src={reward.image || undefined} alt={reward.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-slate-950/80 text-white backdrop-blur-md border border-white/10">
                  {reward.category}
                </span>

                <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 flex items-center gap-1 shadow-lg shadow-amber-400/20">
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" /> {reward.pointsCost} pts
                </span>
              </div>

              {/* Reward Content */}
              <div className="p-5.5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-bold mb-1">
                    <span>{reward.provider}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{reward.discountOrValue}</span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight">
                    {reward.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {reward.description}
                  </p>
                </div>

                {/* Voucher or Redeem Button */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  {reward.redeemed ? (
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-center text-xs">
                        <span className="text-[10px] uppercase text-emerald-700 dark:text-emerald-400 block font-bold">Claimed Voucher Code</span>
                        <code className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                          {reward.voucherCode || 'GREEN-2026-X81'}
                        </code>
                      </div>

                      {reward.category === 'Tree Certificate' && (
                        <button
                          onClick={() => setCertificateModalReward(reward)}
                          className="w-full py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-extrabold hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                        >
                          <Trees className="w-4 h-4" /> View Tree Certificate
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => onRedeemReward(reward.id)}
                      disabled={!canRedeem}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                        canRedeem
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {!isVerificationUnlocked ? (
                        <>
                          <Lock className="w-4 h-4" /> Verify 1 Task to Unlock
                        </>
                      ) : !hasEnoughPoints ? (
                        <>Need {reward.pointsCost - stats.greenPoints} more pts</>
                      ) : (
                        <>
                          <Gift className="w-4 h-4" /> Redeem Now
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Reward History Log */}
      {redeemedHistory.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-500" /> Reward Redemption History
          </h2>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {redeemedHistory.map((item) => (
              <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <span className="text-[11px] text-slate-400">{item.provider} • Code: {item.voucherCode}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-rose-500">-{item.pointsCost} pts</span>
                  <span className="text-[11px] text-slate-400">{item.redeemedAt || 'Recently'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TREE PLANTATION CERTIFICATE MODAL */}
      {certificateModalReward && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-emerald-950 border-2 border-emerald-500/50 rounded-3xl max-w-lg w-full p-8 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-slate-950 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Trees className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Official Eco Certificate</span>
              <h2 className="text-2xl font-black text-white">Tree Plantation Certificate</h2>
              <p className="text-xs text-emerald-200">Certified by OneTreePlanted Partner</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-800/80 text-xs text-slate-300 space-y-2 text-left">
              <p>This certifies that <strong>Alex Rivera</strong> has funded <strong>5 Native Trees</strong> planted in the Amazon Rainforest through verified green points redemption.</p>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-mono text-[11px] text-emerald-400">
                <span>Voucher: {certificateModalReward.voucherCode}</span>
                <span>Date: {certificateModalReward.redeemedAt || 'Jul 2026'}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setCertificateModalReward(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
              >
                Close
              </button>
              <button
                onClick={() => alert('Certificate downloaded as PDF!')}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" /> Download Certificate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
