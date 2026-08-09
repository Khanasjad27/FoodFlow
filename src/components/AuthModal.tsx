import React, { useState } from 'react';
import { Role, UserProfile } from '../types';
import { SAMPLE_ACCOUNTS } from './SampleCredentialsCard';
import { X, Utensils, HeartHandshake, ArrowRight, Lock, Mail, MapPin, Building, KeyRound, Check, Navigation, Loader2 } from 'lucide-react';
import { detectCurrentLocation } from '../lib/location';

interface AuthModalProps {
  isOpen: boolean;
  initialRole?: Role;
  initialMode?: 'login' | 'signup';
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialRole = 'Restaurant',
  initialMode = 'signup',
  onClose,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [role, setRole] = useState<Role>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [isDetectingLoc, setIsDetectingLoc] = useState(false);
  const [error, setError] = useState('');

  const handleDetectLocation = async () => {
    setIsDetectingLoc(true);
    try {
      const detected = await detectCurrentLocation();
      setLocation(detected.address);
    } catch {
      // fallback
    } finally {
      setIsDetectingLoc(false);
    }
  };

  if (!isOpen) return null;

  const handleSelectSample = (sample: typeof SAMPLE_ACCOUNTS.restaurants[0] | typeof SAMPLE_ACCOUNTS.ngos[0]) => {
    setEmail(sample.email);
    setPassword(sample.password);
    setRole(sample.role);
    setName(sample.name);
    setLocation(sample.location);

    const userObj: UserProfile = {
      id: sample.id,
      name: sample.name,
      email: sample.email,
      role: sample.role,
      location: sample.location,
      reliabilityScore: 'reliabilityScore' in sample ? sample.reliabilityScore : undefined,
      createdAt: new Date().toISOString(),
    };

    onAuthSuccess(userObj);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    if (mode === 'signup' && (!name || !location)) {
      setError('Please provide your organization name and location.');
      return;
    }

    // Check if this matches a known sample credential
    const matchedSample = [...SAMPLE_ACCOUNTS.restaurants, ...SAMPLE_ACCOUNTS.ngos].find(
      (s) => s.email.toLowerCase() === email.toLowerCase()
    );

    const createdUser: UserProfile = {
      id: matchedSample ? matchedSample.id : 'usr_' + Math.random().toString(36).substring(2, 9),
      name: mode === 'signup' ? name : (matchedSample ? matchedSample.name : (role === 'Restaurant' ? 'Green Leaf Bistro' : 'Hope Food Bank')),
      email,
      role: matchedSample ? matchedSample.role : role,
      location: mode === 'signup' ? location : (matchedSample ? matchedSample.location : (role === 'Restaurant' ? '124 Market St, Downtown' : '45 Community Way')),
      reliabilityScore: role === 'NGO' ? (matchedSample && 'reliabilityScore' in matchedSample ? matchedSample.reliabilityScore : 88) : undefined,
      createdAt: new Date().toISOString(),
    };

    onAuthSuccess(createdUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e2e25]/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#d8e2d8] relative text-[#1e2e25] max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#889b8e] hover:text-[#1e2e25] p-1.5 rounded-lg hover:bg-[#f0f4f1] transition-colors"
          id="btn-close-auth-modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Quick Sample Credentials Autofill Banner */}
        <div className="bg-[#f8faf8] border border-[#e2e9e2] rounded-xl p-3.5 mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#d97757]">
            <div className="flex items-center space-x-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#d97757]" />
              <span>Sample Credentials (1-Tap Login)</span>
            </div>
            <span className="text-[10px] text-[#556b5e] font-mono">Password: password123</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleSelectSample(SAMPLE_ACCOUNTS.restaurants[0])}
              className="p-2 bg-white hover:bg-[#e8f1ec] border border-[#c3dccf] rounded-lg text-left text-[#245237] font-semibold transition-colors flex items-center justify-between shadow-2xs"
            >
              <span className="truncate">Green Leaf Bistro</span>
              <ArrowRight className="w-3 h-3 text-[#3e7053] flex-shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => handleSelectSample(SAMPLE_ACCOUNTS.ngos[0])}
              className="p-2 bg-white hover:bg-[#fdf3ee] border border-[#f5d5c8] rounded-lg text-left text-[#b04d2e] font-semibold transition-colors flex items-center justify-between shadow-2xs"
            >
              <span className="truncate">Hope Food Bank</span>
              <ArrowRight className="w-3 h-3 text-[#d97757] flex-shrink-0" />
            </button>
          </div>
        </div>

        {/* Header Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-[#e2e9e2] mb-4">
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2 text-center text-sm font-bold border-b-2 transition-colors ${
                mode === 'signup'
                  ? 'border-[#3e7053] text-[#3e7053]'
                  : 'border-transparent text-[#556b5e] hover:text-[#1e2e25]'
              }`}
              id="tab-auth-signup"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 text-center text-sm font-bold border-b-2 transition-colors ${
                mode === 'login'
                  ? 'border-[#3e7053] text-[#3e7053]'
                  : 'border-transparent text-[#556b5e] hover:text-[#1e2e25]'
              }`}
              id="tab-auth-login"
            >
              Log In
            </button>
          </div>

          <p className="text-xs text-[#556b5e] text-center">
            {mode === 'signup'
              ? 'Create a FoodFlow AI account to connect surplus food to NGOs.'
              : 'Sign in to access your FoodFlow AI dashboard.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#556b5e] mb-1.5 uppercase tracking-wider">
              Account Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('Restaurant')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                  role === 'Restaurant'
                    ? 'border-[#3e7053] bg-[#e8f1ec] text-[#245237] font-bold ring-1 ring-[#3e7053]/30'
                    : 'border-[#e2e9e2] text-[#556b5e] hover:border-[#b8ccb8]'
                }`}
                id="btn-role-restaurant"
              >
                <Utensils className="w-5 h-5 text-[#3e7053]" />
                <span className="text-xs">Restaurant</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('NGO')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                  role === 'NGO'
                    ? 'border-[#d97757] bg-[#fdf3ee] text-[#b04d2e] font-bold ring-1 ring-[#d97757]/30'
                    : 'border-[#e2e9e2] text-[#556b5e] hover:border-[#f5d5c8]'
                }`}
                id="btn-role-ngo"
              >
                <HeartHandshake className="w-5 h-5 text-[#d97757]" />
                <span className="text-xs">NGO Partner</span>
              </button>
            </div>
          </div>

          {/* Signup Fields */}
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#1e2e25] mb-1">
                  Organization / Business Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#889b8e] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'Restaurant' ? 'e.g. Green Leaf Bistro' : 'e.g. Hope Food Bank'}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[#f8faf8] border border-[#d2dfd5] rounded-lg text-[#1e2e25] placeholder-[#889b8e] focus:outline-hidden focus:ring-2 focus:ring-[#3e7053]"
                    id="input-org-name"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#1e2e25]">
                    Location / Address
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isDetectingLoc}
                    className="text-[11px] font-bold text-[#3e7053] hover:text-[#284a37] flex items-center space-x-1"
                    id="btn-detect-auth-location"
                  >
                    {isDetectingLoc ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Navigation className="w-3 h-3 text-[#3e7053]" />
                    )}
                    <span>{isDetectingLoc ? 'Detecting...' : 'Use Current Location'}</span>
                  </button>
                </div>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#889b8e] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. 124 Market St, Downtown"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[#f8faf8] border border-[#d2dfd5] rounded-lg text-[#1e2e25] placeholder-[#889b8e] focus:outline-hidden focus:ring-2 focus:ring-[#3e7053]"
                    id="input-location"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-[#1e2e25] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#889b8e] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="bistro@greenleaf.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#f8faf8] border border-[#d2dfd5] rounded-lg text-[#1e2e25] placeholder-[#889b8e] focus:outline-hidden focus:ring-2 focus:ring-[#3e7053]"
                id="input-email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-[#1e2e25] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#889b8e] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#f8faf8] border border-[#d2dfd5] rounded-lg text-[#1e2e25] placeholder-[#889b8e] focus:outline-hidden focus:ring-2 focus:ring-[#3e7053]"
                id="input-password"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-200">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#3e7053] hover:bg-[#325b43] shadow-md transition-colors flex items-center justify-center space-x-2"
            id="btn-auth-submit"
          >
            <span>{mode === 'signup' ? `Complete ${role} Signup` : `Sign In as ${role}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
