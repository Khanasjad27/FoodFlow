import React from 'react';
import { Award, ShieldCheck, Trophy, Sparkles, Star, ChevronRight, Lock, CheckCircle2 } from 'lucide-react';
import { ImpactStats, Role } from '../types';

export interface TierInfo {
  tier: 'Bronze' | 'Silver' | 'Gold';
  name: string;
  badgeEmoji: string;
  iconColor: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  minMeals: number;
  maxMeals: number;
  perks: string[];
}

export const TIERS: Record<'Bronze' | 'Silver' | 'Gold', TierInfo> = {
  Bronze: {
    tier: 'Bronze',
    name: 'Bronze Impact Partner',
    badgeEmoji: '🥉',
    iconColor: '#b46a36',
    bgClass: 'bg-[#faf4f0]',
    borderClass: 'border-[#e8ccb8]',
    textClass: 'text-[#8c4b1d]',
    minMeals: 0,
    maxMeals: 100,
    perks: ['Verified Partner Badge', 'Standard Radar Listing', 'Impact Report Download'],
  },
  Silver: {
    tier: 'Silver',
    name: 'Silver Impact Leader',
    badgeEmoji: '🥈',
    iconColor: '#475569',
    bgClass: 'bg-[#f1f5f9]',
    borderClass: 'border-[#cbd5e1]',
    textClass: 'text-[#334155]',
    minMeals: 100,
    maxMeals: 500,
    perks: ['Priority Radar Highlight', '1.2x Match Preference', 'Silver Hero Badge'],
  },
  Gold: {
    tier: 'Gold',
    name: 'Gold Impact Champion',
    badgeEmoji: '🥇',
    iconColor: '#d97706',
    bgClass: 'bg-[#fefce8]',
    borderClass: 'border-[#fef08a]',
    textClass: 'text-[#854d0e]',
    minMeals: 500,
    maxMeals: Infinity,
    perks: ['Top Priority Match Priority', 'Featured Partner Spotlight', 'Gold Champion Trophy Badge'],
  },
};

export function getTierForMeals(totalMeals: number): TierInfo {
  if (totalMeals >= 500) return TIERS.Gold;
  if (totalMeals >= 100) return TIERS.Silver;
  return TIERS.Bronze;
}

interface DonorTierBadgeProps {
  impact: ImpactStats;
  role: Role;
  compact?: boolean;
}

export const DonorTierBadge: React.FC<DonorTierBadgeProps> = ({ impact, role, compact = false }) => {
  const currentTier = getTierForMeals(impact.totalMeals);
  const isGold = currentTier.tier === 'Gold';
  const isSilver = currentTier.tier === 'Silver';

  // Calculate progress percentage to next tier
  let progressPct = 100;
  let nextTierMeals = currentTier.maxMeals;
  let mealsNeeded = 0;

  if (!isGold) {
    const range = currentTier.maxMeals - currentTier.minMeals;
    const progressInTier = impact.totalMeals - currentTier.minMeals;
    progressPct = Math.min(100, Math.max(0, Math.round((progressInTier / range) * 100)));
    mealsNeeded = currentTier.maxMeals - impact.totalMeals;
  }

  if (compact) {
    return (
      <div
        className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-bold shadow-2xs ${currentTier.bgClass} ${currentTier.borderClass} ${currentTier.textClass}`}
        id="badge-donor-tier-compact"
      >
        <span className="text-sm">{currentTier.badgeEmoji}</span>
        <span>{currentTier.name}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#d8e2d8] shadow-xs space-y-5">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2e9e2] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#3e7053] uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-[#d97757]" />
            <span>Partner Recognition & Impact Tiers</span>
          </div>
          <h3 className="text-xl font-extrabold text-[#1e2e25] flex items-center gap-2">
            <span>{role === 'Restaurant' ? 'Donor Tier Status' : 'NGO Rescue Tier Status'}</span>
            <span
              className={`text-xs px-3 py-1 rounded-full border font-bold flex items-center space-x-1 ${currentTier.bgClass} ${currentTier.borderClass} ${currentTier.textClass}`}
            >
              <span>{currentTier.badgeEmoji}</span>
              <span>{currentTier.tier} Tier</span>
            </span>
          </h3>
        </div>

        {/* Current Level Pill */}
        <div className="flex items-center space-x-3 bg-[#f8faf8] p-3 rounded-2xl border border-[#e2e9e2]">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-2xs border ${currentTier.bgClass} ${currentTier.borderClass}`}
          >
            {currentTier.badgeEmoji}
          </div>
          <div>
            <div className={`text-xs font-black uppercase ${currentTier.textClass}`}>
              {currentTier.name}
            </div>
            <div className="text-[11px] text-[#556b5e] font-medium">
              {impact.totalMeals.toLocaleString()} Total Meals Rescued
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar towards next tier */}
      {!isGold && (
        <div className="space-y-2 bg-[#f8faf8] p-4 rounded-2xl border border-[#e2e9e2]">
          <div className="flex items-center justify-between text-xs font-bold text-[#1e2e25]">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-[#3e7053]" />
              <span>Next Tier Unlock: {isSilver ? 'Gold Champion' : 'Silver Leader'}</span>
            </span>
            <span className="text-[#3e7053]">{mealsNeeded} more meals needed</span>
          </div>

          <div className="w-full bg-[#e2e9e2] h-3 rounded-full overflow-hidden p-0.5 border border-[#d2dfd5]">
            <div
              className="bg-gradient-to-r from-[#3e7053] via-[#528365] to-[#d97757] h-full rounded-full transition-all duration-700 shadow-2xs"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-[#556b5e] font-semibold pt-0.5">
            <span>{currentTier.minMeals} meals</span>
            <span className="font-bold text-[#1e2e25]">{progressPct}% Complete</span>
            <span>{nextTierMeals} meals</span>
          </div>
        </div>
      )}

      {/* Badge Unlock Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(['Bronze', 'Silver', 'Gold'] as const).map((tierKey) => {
          const tier = TIERS[tierKey];
          const isUnlocked =
            (tierKey === 'Bronze' && impact.totalMeals >= 0) ||
            (tierKey === 'Silver' && impact.totalMeals >= 100) ||
            (tierKey === 'Gold' && impact.totalMeals >= 500);

          const isCurrent = currentTier.tier === tierKey;

          return (
            <div
              key={tierKey}
              className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between space-y-3 ${
                isUnlocked
                  ? `${tier.bgClass} ${tier.borderClass} shadow-2xs`
                  : 'bg-gray-50 border-gray-200 opacity-60'
              } ${isCurrent ? 'ring-2 ring-[#3e7053]' : ''}`}
            >
              {/* Top Header */}
              <div className="flex items-center justify-between">
                <span className="text-2xl">{tier.badgeEmoji}</span>
                {isUnlocked ? (
                  <span className="bg-[#e8f1ec] text-[#245237] text-[10px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1 border border-[#c3dccf]">
                    <CheckCircle2 className="w-3 h-3 text-[#3e7053]" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <div>
                <h4 className="font-extrabold text-sm text-[#1e2e25]">{tier.name}</h4>
                <p className="text-[11px] text-[#556b5e] font-medium">
                  {tier.minMeals === 0
                    ? 'Default Entry Level'
                    : `${tier.minMeals}+ Meals Rescued`}
                </p>
              </div>

              {/* Perks list */}
              <ul className="space-y-1 pt-1 border-t border-black/5 text-[10px] font-semibold text-[#556b5e]">
                {tier.perks.map((perk, i) => (
                  <li key={i} className="flex items-center space-x-1.5">
                    <Star className="w-2.5 h-2.5 text-[#3e7053] flex-shrink-0" />
                    <span className="truncate">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};
