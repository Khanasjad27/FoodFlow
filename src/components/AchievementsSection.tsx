import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImpactStats, Role } from '../types';
import { useLanguage } from '../lib/i18n';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  Leaf,
  Globe,
  Trees,
  Zap,
  ShieldAlert,
  ChevronRight,
  Share2,
  X,
  TrendingUp,
} from 'lucide-react';

export interface SustainabilityBadge {
  id: string;
  title: string;
  thresholdKg: number;
  iconEmoji: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  description: string;
  environmentalBenefit: string;
  co2Equivalent: string;
}

export const SUSTAINABILITY_BADGES: SustainabilityBadge[] = [
  {
    id: 'badge_10kg',
    title: 'Seedling Saver',
    thresholdKg: 10,
    iconEmoji: '🌱',
    color: '#3e7053',
    bgGradient: 'from-[#e8f1ec] to-[#f0f7f2]',
    borderColor: '#c3dccf',
    description: 'Rescued 10 kg of surplus food from local landfills.',
    environmentalBenefit: 'Prevented ~22 kg of greenhouse gas emissions.',
    co2Equivalent: '22 kg CO₂',
  },
  {
    id: 'badge_50kg',
    title: 'Eco Defender',
    thresholdKg: 50,
    iconEmoji: '🍃',
    color: '#2d5e43',
    bgGradient: 'from-[#dcf0e3] to-[#e8f5ec]',
    borderColor: '#a8d3b8',
    description: 'Saved 50 kg of wholesome food, providing ~125 meals to neighbors.',
    environmentalBenefit: 'Conserved over 12,000 liters of freshwater used in agricultural production.',
    co2Equivalent: '110 kg CO₂',
  },
  {
    id: 'badge_100kg',
    title: 'Forest Guardian',
    thresholdKg: 100,
    iconEmoji: '🌲',
    color: '#1b4d32',
    bgGradient: 'from-[#cdebd8] to-[#e2f4ea]',
    borderColor: '#8ecba3',
    description: 'Prevented 100 kg of food waste from decomposing into methane.',
    environmentalBenefit: 'Equivalent to planting 4 urban trees that grow for 10 years.',
    co2Equivalent: '220 kg CO₂',
  },
  {
    id: 'badge_250kg',
    title: 'Planet Champion',
    thresholdKg: 250,
    iconEmoji: '🌍',
    color: '#3a6578',
    bgGradient: 'from-[#ebf3f7] to-[#f2f8fa]',
    borderColor: '#c5ddf0',
    description: 'Redistributed 250 kg of organic produce & warm meals.',
    environmentalBenefit: 'Prevented ~550 kg CO₂ emissions — equal to driving 1,400 km in a gas car.',
    co2Equivalent: '550 kg CO₂',
  },
  {
    id: 'badge_500kg',
    title: 'Climate Hero',
    thresholdKg: 500,
    iconEmoji: '⚡',
    color: '#d97757',
    bgGradient: 'from-[#fdf3ee] to-[#fcf7f4]',
    borderColor: '#f5d5c8',
    description: 'Rescued 500 kg of food surplus, empowering community food security.',
    environmentalBenefit: 'Saved over 1.1 metric tons of carbon emissions and 120,000 L of water.',
    co2Equivalent: '1,100 kg CO₂',
  },
  {
    id: 'badge_1000kg',
    title: 'Sustainability Titan',
    thresholdKg: 1000,
    iconEmoji: '👑',
    color: '#b04d2e',
    bgGradient: 'from-[#faede8] to-[#fbf4f1]',
    borderColor: '#f3c7b7',
    description: 'Saved 1 full metric ton of food! Recognized as a top-tier zero-waste leader.',
    environmentalBenefit: 'Diverted 2.2 metric tons of CO₂ and fed over 2,500 vulnerable families.',
    co2Equivalent: '2,200 kg CO₂',
  },
];

interface AchievementsSectionProps {
  impact: ImpactStats;
  role: Role;
  userName: string;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  impact,
  role,
  userName,
}) => {
  const { t } = useLanguage();
  const [selectedBadge, setSelectedBadge] = useState<SustainabilityBadge | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const totalKg = impact.kgSaved || 0;

  // Unlocked badges
  const unlockedBadges = SUSTAINABILITY_BADGES.filter((b) => totalKg >= b.thresholdKg);
  const nextBadge = SUSTAINABILITY_BADGES.find((b) => totalKg < b.thresholdKg) || null;

  // Overall percentage to highest 1000kg badge
  const overallProgressPct = Math.min(100, Math.round((totalKg / 1000) * 100));

  const handleShareBadge = (badge: SustainabilityBadge) => {
    const text = `🏆 ${userName} unlocked the "${badge.title}" Sustainability Badge on FoodFlow AI! Rescued ${totalKg} kg of food! #ZeroWaste #FoodFlow`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d8e2d8] shadow-xs space-y-6 relative overflow-hidden">
      {/* Background Subtle Gradient Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#e8f1ec]/60 to-transparent rounded-bl-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#e2e9e2] pb-6 relative">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#3e7053] uppercase tracking-wider bg-[#e8f1ec] px-3 py-1 rounded-full border border-[#c3dccf]">
            <Award className="w-4 h-4 text-[#3e7053]" />
            <span>{t('dashboard.sustainabilityBadges', 'Sustainability Badges')}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#1e2e25] flex items-center gap-2">
            <span>{t('achievements.title', 'Eco Impact Progress')}</span>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#1e2e25] text-white">
              {unlockedBadges.length} / {SUSTAINABILITY_BADGES.length} {t('achievements.unlocked', 'Badges Unlocked')}
            </span>
          </h2>
          <p className="text-xs text-[#556b5e] max-w-xl">
            {t('achievements.subtitle', 'Earn official zero-waste badges based on total kilograms of food saved from landfills.')}
          </p>
        </div>

        {/* Level Overview Pill Card */}
        <div className="bg-[#f8faf8] border border-[#d8e2d8] p-4 rounded-2xl flex items-center space-x-4 min-w-[280px]">
          <div className="w-12 h-12 rounded-xl bg-[#3e7053] text-white flex items-center justify-center text-2xl font-black shadow-2xs">
            {unlockedBadges.length > 0 ? unlockedBadges[unlockedBadges.length - 1].iconEmoji : '🌱'}
          </div>
          <div className="flex-1 space-y-1">
            <div className="text-xs text-[#556b5e] font-semibold">Total Food Rescued</div>
            <div className="text-xl font-black text-[#1e2e25] flex items-center space-x-1">
              <span>{totalKg} kg</span>
              <span className="text-xs text-[#3e7053] font-extrabold font-mono">
                (~{Math.round(totalKg * 2.2)} kg CO₂)
              </span>
            </div>
            {nextBadge ? (
              <div className="text-[10px] text-[#2d5e43] font-bold">
                Next: {nextBadge.title} ({nextBadge.thresholdKg - totalKg} kg left)
              </div>
            ) : (
              <div className="text-[10px] text-[#3e7053] font-extrabold">
                🎉 Maximum Badge Tier Reached!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Sustainability Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative">
        {SUSTAINABILITY_BADGES.map((badge, index) => {
          const isUnlocked = totalKg >= badge.thresholdKg;
          const progressPct = Math.min(100, Math.round((totalKg / badge.thresholdKg) * 100));

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              onClick={() => setSelectedBadge(badge)}
              className={`group cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                isUnlocked
                  ? `bg-gradient-to-br ${badge.bgGradient} border-[#3e7053]/40 hover:border-[#3e7053] hover:shadow-md`
                  : 'bg-[#fafbfa] border-[#e2e9e2] opacity-85 hover:opacity-100 hover:border-[#b8ccb8]'
              }`}
              id={`card-badge-${badge.id}`}
            >
              {/* Badge Top Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-2xs border transition-transform duration-300 group-hover:scale-110 ${
                      isUnlocked
                        ? 'bg-white border-[#c3dccf]'
                        : 'bg-[#f0f4f1] border-[#e2e9e2] grayscale opacity-70'
                    }`}
                  >
                    <span>{badge.iconEmoji}</span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-[#1e2e25] group-hover:text-[#3e7053] transition-colors">
                      {badge.title}
                    </h3>
                    <span className="text-[10px] font-bold text-[#556b5e]">
                      Target: {badge.thresholdKg} kg
                    </span>
                  </div>
                </div>

                {/* Status Indicator */}
                {isUnlocked ? (
                  <span className="bg-[#e8f1ec] text-[#245237] text-[10px] font-black px-2.5 py-1 rounded-full border border-[#c3dccf] flex items-center space-x-1 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3e7053]" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="bg-[#f0f4f1] text-[#556b5e] text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 border border-[#e2e9e2]">
                    <Lock className="w-3 h-3 text-[#889b8e]" />
                    <span>{progressPct}%</span>
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-[#556b5e] leading-snug">{badge.description}</p>

              {/* Environmental Callout */}
              <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-[#e2e9e2] text-[11px] text-[#245237] flex items-center space-x-2">
                <Leaf className="w-3.5 h-3.5 text-[#3e7053] flex-shrink-0" />
                <span className="font-semibold truncate">{badge.environmentalBenefit}</span>
              </div>

              {/* Animated Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[10px] font-bold text-[#1e2e25]">
                  <span>
                    {totalKg} / {badge.thresholdKg} kg
                  </span>
                  <span className={isUnlocked ? 'text-[#3e7053]' : 'text-[#889b8e]'}>
                    {isUnlocked ? 'Goal Reached!' : `${progressPct}% complete`}
                  </span>
                </div>

                <div className="w-full bg-[#e2e9e2] h-2.5 rounded-full overflow-hidden p-0.5 relative">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.08 }}
                    className={`h-full rounded-full ${
                      isUnlocked
                        ? 'bg-[#3e7053]'
                        : 'bg-gradient-to-r from-[#889b8e] to-[#3e7053]'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#d8e2d8] space-y-6 relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#f0f4f1] hover:bg-[#e2e9e2] text-[#1e2e25] transition-colors"
                id="btn-close-badge-modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Visual Content */}
              <div className="text-center space-y-3">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#e8f1ec] to-[#f0f7f2] border-2 border-[#3e7053] flex items-center justify-center text-5xl shadow-md">
                  {selectedBadge.iconEmoji}
                </div>

                <div>
                  <span className="text-xs font-bold text-[#3e7053] uppercase tracking-wider">
                    Sustainability Badge
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#1e2e25]">{selectedBadge.title}</h3>
                </div>

                <p className="text-xs text-[#556b5e] leading-relaxed">
                  {selectedBadge.description}
                </p>
              </div>

              {/* Progress Detail Box */}
              <div className="bg-[#f8faf8] p-4 rounded-2xl border border-[#e2e9e2] space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-[#556b5e]">Threshold Required:</span>
                  <span className="text-[#1e2e25] font-black">{selectedBadge.thresholdKg} kg</span>
                </div>

                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-[#556b5e]">Your Current Progress:</span>
                  <span className="text-[#3e7053] font-black">{totalKg} kg</span>
                </div>

                <div className="w-full bg-[#e2e9e2] h-3 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-[#3e7053] transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.round((totalKg / selectedBadge.thresholdKg) * 100))}%`,
                    }}
                  />
                </div>

                <div className="pt-2 border-t border-[#e2e9e2] text-xs text-[#245237] space-y-1 font-medium">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <Globe className="w-4 h-4 text-[#3e7053]" />
                    <span>Environmental Benefit:</span>
                  </div>
                  <p className="text-[11px] text-[#556b5e]">{selectedBadge.environmentalBenefit}</p>
                </div>
              </div>

              {/* Share & Close Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleShareBadge(selectedBadge)}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#3e7053] hover:bg-[#325b43] text-white font-bold text-xs shadow-2xs transition-all flex items-center justify-center space-x-2"
                  id="btn-share-badge"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedShare ? 'Copied to Clipboard! ✨' : 'Share Achievement'}</span>
                </button>
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="py-3 px-4 rounded-xl bg-[#f0f4f1] hover:bg-[#e2e9e2] text-[#1e2e25] font-bold text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
