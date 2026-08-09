import React from 'react';
import { UserProfile } from '../types';
import { SampleCredentialsCard } from './SampleCredentialsCard';
import {
  Utensils,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Zap,
  QrCode,
  Sparkles,
  Building2,
  Users2,
  Leaf,
  Clock,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Layers,
  Award,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (role: 'Restaurant' | 'NGO', mode?: 'login' | 'signup') => void;
  onDemoLogin: (role: 'Restaurant' | 'NGO') => void;
  onSelectSampleUser?: (user: UserProfile) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onDemoLogin,
  onSelectSampleUser,
}) => {
  return (
    <div className="space-y-16 pb-20 bg-[#f5f7f4] text-[#1e2e25]">
      {/* Hero Section with 3D Perspective Graphic Card */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-[#e2e9e2] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(62,112,83,0.12),rgba(255,255,255,0))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="group inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#e8f1ec] border border-[#c3dccf] text-[#245237] text-xs font-semibold tracking-wide shadow-2xs hover:shadow-xs transition-all">
                <Sparkles className="w-3.5 h-3.5 text-[#3e7053] animate-pulse group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300" />
                <span>AI-Powered Surplus Food Redistribution Engine</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1e2e25] tracking-tight leading-[1.1]">
                Eliminate Food Waste. <br />
                <span className="text-[#3e7053]">Power Local Communities.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#556b5e] leading-relaxed max-w-2xl">
                FoodFlow AI connects commercial kitchens & restaurants directly with verified local NGOs in real time. Our matching engine prioritizes food shelf-life, distribution capacity, and route proximity.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => onOpenAuth('Restaurant', 'signup')}
                  className="group w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#3e7053] hover:bg-[#325b43] text-white font-bold text-sm shadow-md shadow-emerald-900/10 flex items-center justify-center space-x-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  id="btn-hero-signup-restaurant"
                >
                  <Utensils className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  <span>Restaurant Registration</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => onOpenAuth('NGO', 'signup')}
                  className="group w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#d97757] hover:bg-[#c66848] text-white font-bold text-sm shadow-md shadow-amber-900/10 flex items-center justify-center space-x-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  id="btn-hero-signup-ngo"
                >
                  <HeartHandshake className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
                  <span>NGO Partner Application</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex items-center space-x-6 text-xs text-[#556b5e]">
                <div className="group flex items-center space-x-1.5 cursor-pointer">
                  <ShieldCheck className="w-4 h-4 text-[#3e7053] transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6" />
                  <span className="group-hover:text-[#1e2e25] transition-colors">Verified NGO Credentials</span>
                </div>
                <div className="group flex items-center space-x-1.5 cursor-pointer">
                  <QrCode className="w-4 h-4 text-[#d97757] transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6" />
                  <span className="group-hover:text-[#1e2e25] transition-colors">QR Pickup Code Scan</span>
                </div>
              </div>
            </div>

            {/* 3D Render Perspective Graphic Element */}
            <div className="lg:col-span-5 relative perspective-1000">
              <div className="group relative transform-gpu lg:rotate-y-6 lg:-rotate-x-6 hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-500 ease-out bg-white rounded-3xl p-6 border border-[#d8e2d8] shadow-xl space-y-4">
                {/* Simulated 3D Card Header */}
                <div className="flex items-center justify-between border-b border-[#e2e9e2] pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs font-mono text-[#556b5e] ml-2">Live AI Matcher</span>
                  </div>
                  <span className="bg-[#e8f1ec] text-[#245237] text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-[#c3dccf] flex items-center space-x-1 shadow-2xs">
                    <Zap className="w-3 h-3 text-[#3e7053] animate-bounce" />
                    <span>94% High Urgency Match</span>
                  </span>
                </div>

                {/* 3D Visual Card Content */}
                <div className="bg-[#f8faf8] rounded-2xl p-4 border border-[#e2e9e2] space-y-3 transition-colors group-hover:bg-[#f0f4f0]">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-black text-[#1e2e25]">45 Prepared Fresh Meals</div>
                      <div className="text-xs text-[#2d5e43] font-semibold">Green Leaf Bistro • Downtown</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[#e8f1ec] text-[#3e7053] flex items-center justify-center font-black shadow-2xs group-hover:scale-110 transition-transform">
                      <Zap className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                    </div>
                  </div>

                  {/* Expiry Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#556b5e]">Expiry Window: 3 Hours</span>
                      <span className="text-[#d97757] font-bold">Urgency: 40/40 pts</span>
                    </div>
                    <div className="w-full bg-[#e2e9e2] h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#3e7053] to-[#d97757] h-full w-[85%]" />
                    </div>
                  </div>
                </div>

                {/* Floating Micro Badge */}
                <div className="bg-[#f8faf8] rounded-xl p-3 border border-[#e2e9e2] flex items-center justify-between transition-colors group-hover:bg-[#f0f4f0]">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#fdf3ee] text-[#d97757] flex items-center justify-center">
                      <HeartHandshake className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1e2e25]">Hope Food Bank</div>
                      <div className="text-[10px] text-[#556b5e]">Reliability Score: 92%</div>
                    </div>
                  </div>
                  <span className="bg-[#3e7053] text-white font-bold text-[11px] px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-2xs">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                    <span>Claimed</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLE CREDENTIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SampleCredentialsCard
          onSelectUser={(user) => {
            if (onSelectSampleUser) {
              onSelectSampleUser(user);
            } else {
              onDemoLogin(user.role);
            }
          }}
        />
      </section>

      {/* Real-time Metric Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#d8e2d8] rounded-2xl p-8 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-[#e2e9e2]">
            <div className="p-2">
              <div className="text-3xl sm:text-4xl font-black text-[#d97757]">2,500+</div>
              <div className="text-xs font-bold text-[#556b5e] mt-1 uppercase tracking-wider">Meals Redirected</div>
            </div>
            <div className="p-2">
              <div className="text-3xl sm:text-4xl font-black text-[#3e7053]">100+</div>
              <div className="text-xs font-bold text-[#556b5e] mt-1 uppercase tracking-wider">Commercial Kitchens</div>
            </div>
            <div className="p-2">
              <div className="text-3xl sm:text-4xl font-black text-[#3a6578]">45+</div>
              <div className="text-xs font-bold text-[#556b5e] mt-1 uppercase tracking-wider">Verified NGOs</div>
            </div>
            <div className="p-2">
              <div className="text-3xl sm:text-4xl font-black text-[#2e684a]">2.5 Tons</div>
              <div className="text-xs font-bold text-[#556b5e] mt-1 uppercase tracking-wider">CO2 Emissions Prevented</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-[#1e2e25]">How FoodFlow AI Works</h2>
          <p className="text-[#556b5e] text-sm">
            Automating surplus food logistics from commercial kitchens to food banks in 3 instant steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-[#d8e2d8] hover:border-[#b8ccb8] transition-all space-y-4 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#e8f1ec] text-[#245237] border border-[#c3dccf] flex items-center justify-center font-mono font-bold text-base">
              01
            </div>
            <div className="flex items-center space-x-2">
              <Utensils className="w-5 h-5 text-[#3e7053]" />
              <h3 className="font-bold text-[#1e2e25] text-base">1. Post Surplus Food</h3>
            </div>
            <p className="text-[#556b5e] text-xs leading-relaxed">
              Restaurants list excess prepared meals or fresh ingredients with item quantity, pickup location, and expiry window.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-[#d8e2d8] hover:border-[#b8ccb8] transition-all space-y-4 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#fdf3ee] text-[#b04d2e] border border-[#f5d5c8] flex items-center justify-center font-mono font-bold text-base">
              02
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-[#d97757]" />
              <h3 className="font-bold text-[#1e2e25] text-base">2. Smart AI Match</h3>
            </div>
            <p className="text-[#556b5e] text-xs leading-relaxed">
              Our algorithm ranks listings based on meal urgency score, NGO capacity, and historical pickup reliability score.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-[#d8e2d8] hover:border-[#b8ccb8] transition-all space-y-4 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#ebf3f7] text-[#224859] border border-[#c5ddf0] flex items-center justify-center font-mono font-bold text-base">
              03
            </div>
            <div className="flex items-center space-x-2">
              <QrCode className="w-5 h-5 text-[#3a6578]" />
              <h3 className="font-bold text-[#1e2e25] text-base">3. Claim & QR Verification</h3>
            </div>
            <p className="text-[#556b5e] text-xs leading-relaxed">
              NGOs claim listings with one tap, present a digital QR badge at the door, and update impact stats instantly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
