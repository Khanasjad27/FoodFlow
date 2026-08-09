import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  Utensils,
  PlusCircle,
  QrCode,
  MapPin,
  Clock,
  ShieldCheck,
  Trophy,
  HeartHandshake,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { Role } from '../types';

export interface WalkthroughStep {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  highlightText: string;
  demoVisual: React.ReactNode;
}

interface OnboardingWalkthroughProps {
  isOpen: boolean;
  role: Role;
  userName: string;
  onClose: () => void;
  onComplete: () => void;
}

export const OnboardingWalkthrough: React.FC<OnboardingWalkthroughProps> = ({
  isOpen,
  role,
  userName,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const isRestaurant = role === 'Restaurant';

  const restaurantSteps: WalkthroughStep[] = [
    {
      title: `Welcome, ${userName}!`,
      subtitle: 'Your Restaurant Surplus Food Command Center',
      description:
        'FoodFlow AI helps your restaurant instantly convert excess unsold meals into certified community donations while tracking your ESG impact and carbon savings.',
      icon: <Utensils className="w-8 h-8 text-[#3e7053]" />,
      highlightText: 'Key Dashboard Metrics & Impact Stats',
      demoVisual: (
        <div className="bg-[#f8faf8] p-4 rounded-2xl border border-[#d8e2d8] space-y-3 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1e2e25]">Live Dashboard Overview</span>
            <span className="bg-[#e8f1ec] text-[#245237] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#c3dccf]">
              Active Partner
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-[#e2e9e2]">
              <div className="text-[10px] text-[#556b5e]">Total Meals Donated</div>
              <div className="text-lg font-black text-[#3e7053]">142 Meals</div>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-[#e2e9e2]">
              <div className="text-[10px] text-[#556b5e]">CO2 Offset</div>
              <div className="text-lg font-black text-[#d97757]">355 kg</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '1. Posting Surplus Meals',
      subtitle: 'Publish surplus inventory in under 30 seconds',
      description:
        'Click "Post Surplus Meal" to create a new donation listing. Specify quantity, dietary type, and pickup deadline. Gemini AI will automatically rate freshness and match with nearby NGOs.',
      icon: <PlusCircle className="w-8 h-8 text-[#3e7053]" />,
      highlightText: 'Automated AI Match Score & Expiry Countdown',
      demoVisual: (
        <div className="bg-white p-4 rounded-2xl border-2 border-[#3e7053] space-y-2 text-left shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#1e2e25]">Surplus Listing Form</span>
            <span className="bg-[#3e7053] text-white text-[9px] font-bold px-2 py-0.5 rounded">
              + Post Meal
            </span>
          </div>
          <div className="space-y-1.5 text-[11px] text-[#556b5e]">
            <div className="bg-[#f0f4f1] p-2 rounded-lg font-mono text-[10px]">
              Type: Fresh Pasta & Bread (15 Servings)
            </div>
            <div className="flex items-center space-x-1.5 text-[#d97757] font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Pickup Window: Next 3 Hours</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '2. Real-Time NGO Claims',
      subtitle: 'Track claims & priority expiry warnings',
      description:
        'Verified local food banks and shelters will claim your surplus in real-time. Listings nearing expiry feature high-visibility warning indicators so you can prioritize urgent items.',
      icon: <Zap className="w-8 h-8 text-[#d97757]" />,
      highlightText: 'Instant Notifications & Claim Statuses',
      demoVisual: (
        <div className="bg-[#fdf3ee] p-4 rounded-2xl border-2 border-[#d97757] space-y-2 text-left shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#b04d2e] flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 fill-[#d97757]" />
              <span>Listing Claimed by Hope Food Bank</span>
            </span>
            <span className="bg-[#d97757] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              Claimed
            </span>
          </div>
          <div className="text-[11px] text-[#556b5e]">
            Volunteer assigned: <strong className="text-[#1e2e25]">Sarah Jenkins</strong> (ETA 25 mins)
          </div>
        </div>
      ),
    },
    {
      title: '3. QR Verification & Pickup',
      subtitle: 'Seamless, tamper-proof food handoffs',
      description:
        'When the NGO volunteer arrives, click "Show QR Code". The volunteer scans the QR or confirms pickup, immediately closing out the donation and updating your impact record.',
      icon: <QrCode className="w-8 h-8 text-[#3e7053]" />,
      highlightText: '1-Scan Handoff & Security',
      demoVisual: (
        <div className="bg-white p-4 rounded-2xl border border-[#d8e2d8] flex items-center space-x-4 text-left shadow-2xs">
          <div className="w-12 h-12 bg-[#1e2e25] rounded-xl flex items-center justify-center text-white flex-shrink-0">
            <QrCode className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-[#1e2e25]">Verification Pass #892</div>
            <div className="text-[10px] text-[#3e7053] font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Ready for Scan</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '4. Donor Tiers & Celebrations',
      subtitle: 'Unlock Bronze, Silver, & Gold Badges',
      description:
        'Earn recognition as you hit food donation milestones! Unlock custom badges, level up your partner tier, and trigger celebratory confetti overlays as you reach 100kg+ saved.',
      icon: <Trophy className="w-8 h-8 text-[#d97706]" />,
      highlightText: 'Silver & Gold Partner Recognition',
      demoVisual: (
        <div className="bg-[#fefce8] p-4 rounded-2xl border border-[#fef08a] flex items-center justify-between text-left shadow-2xs">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🥇</div>
            <div>
              <div className="text-xs font-black text-[#854d0e]">Gold Impact Champion</div>
              <div className="text-[10px] text-[#a16207]">Unlocked at 500+ Meals Donated</div>
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-[#d97706] animate-bounce" />
        </div>
      ),
    },
  ];

  const ngoSteps: WalkthroughStep[] = [
    {
      title: `Welcome, ${userName}!`,
      subtitle: 'Your NGO Food Rescue Operations Center',
      description:
        'FoodFlow AI connects your shelter or food bank directly with local restaurants and caterers offering surplus meals ready for immediate redistribution.',
      icon: <HeartHandshake className="w-8 h-8 text-[#3e7053]" />,
      highlightText: 'Real-Time Food Rescue Network',
      demoVisual: (
        <div className="bg-[#f8faf8] p-4 rounded-2xl border border-[#d8e2d8] space-y-3 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1e2e25]">Rescue Dashboard</span>
            <span className="bg-[#e8f1ec] text-[#245237] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#c3dccf]">
              Reliability Score: 92/100
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-[#e2e9e2]">
              <div className="text-[10px] text-[#556b5e]">Rescued Meals</div>
              <div className="text-lg font-black text-[#3e7053]">210 Meals</div>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-[#e2e9e2]">
              <div className="text-[10px] text-[#556b5e]">Completed Pickups</div>
              <div className="text-lg font-black text-[#d97757]">18 Pickups</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '1. Live Available Feed & Search',
      subtitle: 'Filter nearby food listings in real time',
      description:
        'Explore available surplus items sorted by proximity and AI match score. Use the top search bar to filter by restaurant name, location, or food category.',
      icon: <Zap className="w-8 h-8 text-[#d97757]" />,
      highlightText: 'Search, Filter & Intelligent Matching',
      demoVisual: (
        <div className="bg-white p-4 rounded-2xl border border-[#d8e2d8] space-y-2 text-left shadow-2xs">
          <div className="text-xs font-bold text-[#1e2e25] flex items-center justify-between">
            <span>Search Bar Control</span>
            <span className="bg-[#e8f1ec] text-[#245237] text-[9px] font-bold px-2 py-0.5 rounded">
              Search: "Bistro"
            </span>
          </div>
          <div className="bg-[#f8faf8] p-2 rounded-xl border border-[#e2e9e2] text-[11px] text-[#556b5e]">
            Filtered 3 active listings matching query
          </div>
        </div>
      ),
    },
    {
      title: '2. Interactive GIS Map View',
      subtitle: 'Visualize food donations near your shelter',
      description:
        'Switch to the "Interactive Map" tab to see geographical pins of all active food postings, complete with driving distance and direct pickup route details.',
      icon: <MapPin className="w-8 h-8 text-[#3e7053]" />,
      highlightText: 'Proximity Pins & Distance Estimations',
      demoVisual: (
        <div className="bg-[#e8f1ec] p-4 rounded-2xl border border-[#c3dccf] flex items-center justify-between text-left shadow-2xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#3e7053] rounded-xl flex items-center justify-center text-white font-bold text-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1e2e25]">Green Leaf Bistro</div>
              <div className="text-[10px] text-[#556b5e]">1.2 km away • 15 Meals Available</div>
            </div>
          </div>
          <span className="bg-[#3e7053] text-white text-[9px] font-bold px-2.5 py-1 rounded-xl">
            View Pin
          </span>
        </div>
      ),
    },
    {
      title: '3. Claiming & Confirming Pickups',
      subtitle: 'Reserve meals with a single click',
      description:
        'Click "Claim Food Donation" to reserve the item. Once at the restaurant, click "Confirm Pickup Completed" or present your verification code to complete the log.',
      icon: <CheckCircle2 className="w-8 h-8 text-[#3e7053]" />,
      highlightText: '1-Click Claiming & Verification',
      demoVisual: (
        <div className="bg-white p-4 rounded-2xl border-2 border-[#3e7053] space-y-2 text-left shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#1e2e25]">Claim Reserved #402</span>
            <span className="bg-[#3e7053] text-white text-[9px] font-bold px-2 py-0.5 rounded">
              Confirmed
            </span>
          </div>
          <div className="text-[11px] text-[#556b5e]">
            Status: <strong className="text-[#3e7053]">Pickup Successful</strong> • Updated impact stats
          </div>
        </div>
      ),
    },
    {
      title: '4. Rescue Tiers & Milestones',
      subtitle: 'Earn badges and celebrate milestones',
      description:
        'Track your total kilograms saved and community meals delivered. Unlock rescue badges, advance from Bronze to Gold, and launch milestone celebrations!',
      icon: <Trophy className="w-8 h-8 text-[#d97706]" />,
      highlightText: 'NGO Hero Recognition & Trophies',
      demoVisual: (
        <div className="bg-[#fefce8] p-4 rounded-2xl border border-[#fef08a] flex items-center justify-between text-left shadow-2xs">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🏆</div>
            <div>
              <div className="text-xs font-black text-[#854d0e]">500kg Saved Super Hero</div>
              <div className="text-[10px] text-[#a16207]">Milestone Trophy Unlocked</div>
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-[#d97706] animate-bounce" />
        </div>
      ),
    },
  ];

  const steps = isRestaurant ? restaurantSteps : ngoSteps;
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl bg-white rounded-3xl border-2 border-[#3e7053] shadow-2xl overflow-hidden p-6 text-center space-y-6"
        >
          {/* Close / Skip button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#889b8e] hover:text-[#1e2e25] hover:bg-[#f0f4f1] transition-colors flex items-center space-x-1 text-xs font-bold"
            id="btn-skip-walkthrough"
            title="Skip Walkthrough"
          >
            <span>Skip</span>
            <X className="w-4 h-4" />
          </button>

          {/* Top Progress bar & Step indicator */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#556b5e] px-2">
              <span className="flex items-center space-x-1 text-[#3e7053]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Guided Tour</span>
              </span>
              <span>
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>

            <div className="w-full bg-[#e2e9e2] h-2 rounded-full overflow-hidden p-0.5 border border-[#d2dfd5]">
              <div
                className="bg-gradient-to-r from-[#3e7053] to-[#d97757] h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Main Visual Demo Card */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Icon & Title */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="p-3.5 rounded-2xl bg-[#e8f1ec] border border-[#c3dccf] shadow-2xs">
                {step.icon}
              </div>
              <div>
                <h2 className="text-xl font-black text-[#1e2e25]">{step.title}</h2>
                <div className="text-xs font-bold text-[#3e7053]">{step.subtitle}</div>
              </div>
            </div>

            {/* Step Description */}
            <p className="text-xs text-[#556b5e] font-medium leading-relaxed max-w-md mx-auto">
              {step.description}
            </p>

            {/* Interactive Visual Highlight Box */}
            <div className="pt-2">{step.demoVisual}</div>
          </motion.div>

          {/* Bottom Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#e2e9e2]">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
                currentStep === 0
                  ? 'opacity-40 cursor-not-allowed text-[#889b8e]'
                  : 'bg-[#f0f4f1] text-[#1e2e25] hover:bg-[#e4ece5]'
              }`}
              id="btn-walkthrough-prev"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Step Dots */}
            <div className="flex items-center space-x-1.5">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === currentStep
                      ? 'w-6 bg-[#3e7053]'
                      : 'w-2.5 bg-[#d2dfd5] hover:bg-[#889b8e]'
                  }`}
                  id={`dot-step-${idx}`}
                  title={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-[#3e7053] hover:bg-[#325b43] text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-2xs transition-all active:scale-95"
              id="btn-walkthrough-next"
            >
              <span>{isLastStep ? 'Finish & Explore' : 'Next'}</span>
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
