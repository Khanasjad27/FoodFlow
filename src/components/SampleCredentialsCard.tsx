import React from 'react';
import { UserProfile } from '../types';
import { Store, HeartHandshake, KeyRound, ArrowRight, ShieldCheck, CheckCircle2, Copy, Check } from 'lucide-react';

interface SampleCredentialsCardProps {
  onSelectUser: (user: UserProfile) => void;
  compact?: boolean;
}

export const SAMPLE_ACCOUNTS = {
  restaurants: [
    {
      id: 'a1111111-1111-1111-1111-111111111111',
      name: 'Green Leaf Bistro',
      email: 'bistro@greenleaf.com',
      password: 'password123',
      role: 'Restaurant' as const,
      location: '124 Market St, Downtown',
      tag: '4 Active Surplus Listings',
    },
    {
      id: 'a2222222-2222-2222-2222-222222222222',
      name: 'Harvest Table Cafe',
      email: 'contact@harvesttable.org',
      password: 'password123',
      role: 'Restaurant' as const,
      location: '580 Grand Ave, West End',
      tag: 'Claimed Pickup Pending',
    },
  ],
  ngos: [
    {
      id: 'b1111111-1111-1111-1111-111111111111',
      name: 'Hope Food Bank',
      email: 'contact@hopefoodbank.org',
      password: 'password123',
      role: 'NGO' as const,
      location: '45 Community Way, Sector 4',
      reliabilityScore: 92,
      tag: 'Reliability Score: 92/100',
    },
    {
      id: 'b4444444-4444-4444-4444-444444444444',
      name: 'Meals for All Foundation',
      email: 'hello@mealsforall.org',
      password: 'password123',
      role: 'NGO' as const,
      location: '90 Care Drive, Southside',
      reliabilityScore: 95,
      tag: 'Reliability Score: 95/100',
    },
  ],
};

export const SampleCredentialsCard: React.FC<SampleCredentialsCardProps> = ({
  onSelectUser,
  compact = false,
}) => {
  const [copiedEmail, setCopiedEmail] = React.useState<string | null>(null);

  const handleCopy = (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div
      className={`bg-white border border-[#d8e2d8] rounded-2xl shadow-xs overflow-hidden ${
        compact ? 'p-4' : 'p-6 sm:p-8'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e2e9e2] pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#e8f1ec] border border-[#c3dccf] text-[#245237] flex items-center justify-center font-bold">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1e2e25] flex items-center space-x-2">
              <span>Sample Demo Accounts & Credentials</span>
              <span className="bg-[#e8f1ec] text-[#245237] text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border border-[#c3dccf]">
                Password: password123
              </span>
            </h3>
            <p className="text-xs text-[#556b5e] mt-0.5">
              Click any account below for instant 1-tap login to explore either portal mode.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Restaurant Sample Accounts */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#3e7053]">
            <Store className="w-4 h-4" />
            <span>Sample Restaurant Portals</span>
          </div>

          <div className="space-y-2.5">
            {SAMPLE_ACCOUNTS.restaurants.map((acc) => (
              <div
                key={acc.id}
                onClick={() =>
                  onSelectUser({
                    id: acc.id,
                    name: acc.name,
                    email: acc.email,
                    role: acc.role,
                    location: acc.location,
                    createdAt: new Date().toISOString(),
                  })
                }
                className="group p-3.5 bg-[#f8faf8] hover:bg-[#f0f4f0] border border-[#e2e9e2] hover:border-[#3e7053]/40 rounded-xl cursor-pointer transition-all flex items-center justify-between shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-[#1e2e25] group-hover:text-[#2d5e43] transition-colors">
                      {acc.name}
                    </span>
                    <span className="text-[10px] bg-[#e8f1ec] text-[#245237] px-2 py-0.5 rounded-full font-semibold">
                      {acc.tag}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#556b5e] flex items-center space-x-2">
                    <span>{acc.email}</span>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(acc.email, e)}
                      className="text-[#889b8e] hover:text-[#3e7053] p-0.5"
                      title="Copy email"
                    >
                      {copiedEmail === acc.email ? (
                        <Check className="w-3 h-3 text-[#3e7053]" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-[#3e7053] group-hover:bg-[#325b43] text-white font-semibold text-xs transition-colors flex items-center space-x-1 shadow-2xs"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* NGO Sample Accounts */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#d97757]">
            <HeartHandshake className="w-4 h-4" />
            <span>Sample NGO Partner Portals</span>
          </div>

          <div className="space-y-2.5">
            {SAMPLE_ACCOUNTS.ngos.map((acc) => (
              <div
                key={acc.id}
                onClick={() =>
                  onSelectUser({
                    id: acc.id,
                    name: acc.name,
                    email: acc.email,
                    role: acc.role,
                    location: acc.location,
                    reliabilityScore: acc.reliabilityScore,
                    createdAt: new Date().toISOString(),
                  })
                }
                className="group p-3.5 bg-[#f8faf8] hover:bg-[#fff7f4] border border-[#e2e9e2] hover:border-[#d97757]/40 rounded-xl cursor-pointer transition-all flex items-center justify-between shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-[#1e2e25] group-hover:text-[#b04d2e] transition-colors">
                      {acc.name}
                    </span>
                    <span className="text-[10px] bg-[#fdf3ee] text-[#b04d2e] border border-[#f5d5c8] px-2 py-0.5 rounded-full font-mono font-semibold">
                      Score: {acc.reliabilityScore}/100
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#556b5e] flex items-center space-x-2">
                    <span>{acc.email}</span>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(acc.email, e)}
                      className="text-[#889b8e] hover:text-[#d97757] p-0.5"
                      title="Copy email"
                    >
                      {copiedEmail === acc.email ? (
                        <Check className="w-3 h-3 text-[#d97757]" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-[#d97757] group-hover:bg-[#c66848] text-white font-semibold text-xs transition-colors flex items-center space-x-1 shadow-2xs"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
