import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Award, Sparkles, CheckCircle2, Share2, X, Star, HeartHandshake, Flame, ShieldCheck } from 'lucide-react';
import { Role } from '../types';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  thresholdValue: number;
  type: 'kgSaved' | 'completedPickups' | 'totalMeals';
  iconEmoji: string;
  badgeColor: string;
  gradientBg: string;
}

export const MILESTONES_LIST: Milestone[] = [
  {
    id: 'first_pickup',
    title: 'First Rescue Milestone',
    description: 'Completed 1 successful food rescue pickup!',
    thresholdValue: 1,
    type: 'completedPickups',
    iconEmoji: '🌱',
    badgeColor: '#3e7053',
    gradientBg: 'from-[#3e7053] to-[#528365]',
  },
  {
    id: 'meals_100',
    title: '100 Meals Served',
    description: 'Provided over 100 warm meals to local community shelters.',
    thresholdValue: 100,
    type: 'totalMeals',
    iconEmoji: '🍲',
    badgeColor: '#d97757',
    gradientBg: 'from-[#d97757] to-[#e69378]',
  },
  {
    id: 'kg_50',
    title: '50kg Food Saved',
    description: 'Diverted 50 kilograms of edible surplus food from landfills.',
    thresholdValue: 50,
    type: 'kgSaved',
    iconEmoji: '⚖️',
    badgeColor: '#2b5840',
    gradientBg: 'from-[#2b5840] to-[#3e7053]',
  },
  {
    id: 'pickups_10',
    title: '10th Pickup Milestone',
    description: 'Successfully coordinated and completed 10 food distribution pickups.',
    thresholdValue: 10,
    type: 'completedPickups',
    iconEmoji: '🚚',
    badgeColor: '#3a6578',
    gradientBg: 'from-[#3a6578] to-[#518196]',
  },
  {
    id: 'kg_250',
    title: '250kg Saved Champion',
    description: 'Saved 250kg of food, cutting carbon emissions dramatically.',
    thresholdValue: 250,
    type: 'kgSaved',
    iconEmoji: '🌿',
    badgeColor: '#3e7053',
    gradientBg: 'from-[#3e7053] to-[#245237]',
  },
  {
    id: 'kg_500',
    title: '500kg Saved Super Hero',
    description: 'Reached half a metric ton (500kg) of rescued food!',
    thresholdValue: 500,
    type: 'kgSaved',
    iconEmoji: '🏆',
    badgeColor: '#d97757',
    gradientBg: 'from-[#d97757] to-[#b04d2e]',
  },
  {
    id: 'pickups_100',
    title: '100th Pickup Milestone',
    description: 'Achieved 100 completed pickups! A true community anchor.',
    thresholdValue: 100,
    type: 'completedPickups',
    iconEmoji: '💯',
    badgeColor: '#854d0e',
    gradientBg: 'from-[#ca8a04] to-[#854d0e]',
  },
  {
    id: 'meals_1000',
    title: '1,000 Meals Distributed',
    description: 'Milestone reached: 1,000 meals delivered to families in need.',
    thresholdValue: 1000,
    type: 'totalMeals',
    iconEmoji: '🌟',
    badgeColor: '#b45309',
    gradientBg: 'from-[#f59e0b] to-[#b45309]',
  },
];

interface MilestoneCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: Milestone;
  role: Role;
  entityName: string;
}

export const MilestoneCelebrationModal: React.FC<MilestoneCelebrationModalProps> = ({
  isOpen,
  onClose,
  milestone,
  role,
  entityName,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger burst of multi-stage celebratory confetti
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#3e7053', '#d97757', '#ffffff'],
      });
      fire(0.2, {
        spread: 60,
        colors: ['#3e7053', '#fef08a', '#245237'],
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        colors: ['#d97757', '#e8f1ec', '#ffffff'],
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        colors: ['#3e7053', '#d97757'],
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });

      // Continuous subtle side cannons
      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          zIndex: 9999,
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          zIndex: 9999,
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-3xl border-2 border-[#3e7053] shadow-2xl overflow-hidden p-6 text-center space-y-6"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#889b8e] hover:text-[#1e2e25] hover:bg-[#f0f4f1] transition-colors"
            id="btn-close-milestone-modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Sparkling Badge */}
          <div className="flex justify-center">
            <motion.div
              initial={{ rotate: -10, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className={`w-24 h-24 rounded-3xl bg-gradient-to-tr ${milestone.gradientBg} shadow-xl flex items-center justify-center text-5xl relative border-4 border-white`}
            >
              <span>{milestone.iconEmoji}</span>
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-950 p-1.5 rounded-full shadow-md animate-bounce">
                <Sparkles className="w-4 h-4" />
              </div>
            </motion.div>
          </div>

          {/* Header Texts */}
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#e8f1ec] text-[#245237] border border-[#c3dccf] inline-flex items-center space-x-1 uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-[#3e7053]" />
              <span>Milestone Achievement Unlocked!</span>
            </span>

            <h2 className="text-2xl font-black text-[#1e2e25]">{milestone.title}</h2>

            <p className="text-xs text-[#556b5e] font-semibold max-w-sm mx-auto leading-relaxed">
              Congratulations <strong className="text-[#1e2e25] font-extrabold">{entityName}</strong>! {milestone.description}
            </p>
          </div>

          {/* Impact Certificate Card */}
          <div className="bg-[#f8faf8] border border-[#d8e2d8] rounded-2xl p-4 text-left space-y-3 shadow-2xs relative">
            <div className="flex items-center justify-between border-b border-[#e2e9e2] pb-2">
              <span className="text-[11px] font-bold text-[#3e7053] uppercase tracking-wider flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-[#3e7053]" />
                <span>Official FoodFlow Impact Certificate</span>
              </span>
              <span className="text-[10px] text-[#889b8e] font-mono">{new Date().toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-[#1e2e25]">
              <span>Issued To:</span>
              <span className="text-[#3e7053] font-black">{entityName} ({role})</span>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-[#1e2e25]">
              <span>Threshold Reached:</span>
              <span className="text-[#d97757] font-black">
                {milestone.thresholdValue}{' '}
                {milestone.type === 'kgSaved'
                  ? 'kg Saved'
                  : milestone.type === 'totalMeals'
                  ? 'Meals'
                  : 'Pickups'}
              </span>
            </div>

            <div className="pt-2 border-t border-[#e2e9e2] flex items-center space-x-2 text-[11px] text-[#556b5e] font-medium">
              <HeartHandshake className="w-4 h-4 text-[#3e7053] flex-shrink-0" />
              <span>Verified through FoodFlow community redistribution ledger.</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                // Trigger another confetti burst on click!
                confetti({
                  particleCount: 120,
                  spread: 70,
                  origin: { y: 0.6 },
                  zIndex: 9999,
                });
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#e8f1ec] hover:bg-[#d8e8dd] text-[#245237] border border-[#c3dccf] font-bold text-xs transition-all shadow-2xs flex items-center justify-center space-x-2 active:scale-95"
              id="btn-retrigger-confetti"
            >
              <Sparkles className="w-4 h-4 text-[#3e7053]" />
              <span>Celebrate Again! 🎉</span>
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#3e7053] hover:bg-[#325b43] text-white font-extrabold text-xs transition-all shadow-2xs active:scale-95"
              id="btn-claim-milestone"
            >
              Continue Impact
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
