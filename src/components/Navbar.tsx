import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { useLanguage, LANGUAGE_OPTIONS, Language } from '../lib/i18n';
import {
  UtensilsCrossed,
  LogOut,
  HeartHandshake,
  Store,
  KeyRound,
  RefreshCw,
  UserCheck,
  ChevronDown,
  Sparkles,
  Settings,
  Contrast,
  X,
  Compass,
  Globe,
} from 'lucide-react';
import { SAMPLE_ACCOUNTS } from './SampleCredentialsCard';

interface NavbarProps {
  user: UserProfile | null;
  onOpenAuth: (role?: 'Restaurant' | 'NGO') => void;
  onLogout: () => void;
  onNavigateHome: () => void;
  onSelectSampleUser?: (user: UserProfile) => void;
  onResetSeedData?: () => void;
  onOpenWalkthrough?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onLogout,
  onNavigateHome,
  onSelectSampleUser,
  onResetSeedData,
  onOpenWalkthrough,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isSwitchMenuOpen, setIsSwitchMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [resetToast, setResetToast] = useState(false);

  const currentLangObj = LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0];

  // High Contrast Accessibility state persisted in localStorage
  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('foodflow_high_contrast') === 'true';
  });

  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
      localStorage.setItem('foodflow_high_contrast', 'true');
    } else {
      document.documentElement.classList.remove('high-contrast');
      localStorage.setItem('foodflow_high_contrast', 'false');
    }
  }, [isHighContrast]);

  const handleResetData = () => {
    if (onResetSeedData) {
      onResetSeedData();
      setResetToast(true);
      setTimeout(() => setResetToast(false), 3000);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e2e9e2] shadow-xs">
      {resetToast && (
        <div className="bg-[#3e7053] text-white text-xs font-bold text-center py-1 px-4 animate-in fade-in flex items-center justify-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Sample Data & Listings Reset to Initial Seed State!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={onNavigateHome}
          className="flex items-center space-x-3 group focus:outline-hidden text-left"
          id="nav-brand-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#417a59] to-[#2d5842] flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300">
            <UtensilsCrossed className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black text-[#1e2e25] tracking-tight group-hover:text-[#3e7053] transition-colors">
                FoodFlow
              </span>
              <span className="bg-[#e8f1ec] text-[#245237] border border-[#c3dccf] text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded-md flex items-center space-x-1 shadow-2xs">
                <Sparkles className="w-2.5 h-2.5 text-[#3e7053] animate-pulse" />
                <span>AI Match</span>
              </span>
            </div>
            <span className="block text-[10px] tracking-wider uppercase font-semibold text-[#556b5e]">
              Surplus Food Engine
            </span>
          </div>
        </button>

        {/* Right Nav Options */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                if (isSwitchMenuOpen) setIsSwitchMenuOpen(false);
                if (isSettingsOpen) setIsSettingsOpen(false);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[#f0f4f1] hover:bg-[#e4ece5] border border-[#d2dfd5] text-xs font-bold text-[#22382c] flex items-center space-x-1.5 transition-all shadow-2xs hover:shadow-xs"
              id="btn-language-selector"
              title="Select Language / Seleccionar Idioma / Choisir la Langue"
            >
              <Globe className="w-3.5 h-3.5 text-[#3e7053]" />
              <span className="text-sm">{currentLangObj.flag}</span>
              <span className="hidden md:inline font-bold">{currentLangObj.code.toUpperCase()}</span>
              <ChevronDown className={`w-3 h-3 text-[#6c8273] transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#d2dfd5] rounded-2xl shadow-xl p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-2">
                <div className="text-[10px] font-bold text-[#556b5e] uppercase tracking-wider px-2 py-1">
                  {t('nav.selectLanguage', 'Select Language')}
                </div>
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      setLanguage(opt.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      language === opt.code
                        ? 'bg-[#e8f1ec] text-[#245237] border border-[#c3dccf]'
                        : 'hover:bg-[#f0f4f1] text-[#1e2e25]'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span className="text-base">{opt.flag}</span>
                      <span>{opt.name}</span>
                    </span>
                    {language === opt.code && <span className="text-[10px] bg-[#3e7053] text-white px-1.5 py-0.5 rounded font-mono">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Demo Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSwitchMenuOpen(!isSwitchMenuOpen);
                if (isLangOpen) setIsLangOpen(false);
                if (isSettingsOpen) setIsSettingsOpen(false);
              }}
              className="group px-3 py-1.5 rounded-xl bg-[#f0f4f1] hover:bg-[#e4ece5] border border-[#d2dfd5] text-xs font-bold text-[#22382c] flex items-center space-x-2 transition-all shadow-2xs hover:shadow-xs"
              id="btn-demo-account-switcher"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#d97757] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <span className="hidden sm:inline">{t('nav.switchDemo', 'Switch Demo Account')}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#6c8273] transition-transform duration-300 ${isSwitchMenuOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
            </button>

            {isSwitchMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[#d2dfd5] rounded-2xl shadow-xl p-3 z-50 space-y-3 animate-in fade-in slide-in-from-top-2">
                <div className="text-[11px] font-bold text-[#556b5e] uppercase tracking-wider px-2 flex items-center justify-between">
                  <span>Select Sample Portal</span>
                  <button
                    onClick={handleResetData}
                    className="group/reset text-[#3e7053] hover:underline flex items-center space-x-1"
                    title="Reset all listings to initial seed state"
                  >
                    <RefreshCw className="w-3 h-3 transition-transform duration-500 group-hover/reset:rotate-180" />
                    <span>{t('nav.resetData', 'Reset Data')}</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-[#3e7053] uppercase px-2 py-0.5 flex items-center space-x-1">
                    <Store className="w-3 h-3 text-[#3e7053]" />
                    <span>Restaurants</span>
                  </div>
                  {SAMPLE_ACCOUNTS.restaurants.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => {
                        setIsSwitchMenuOpen(false);
                        if (onSelectSampleUser) {
                          onSelectSampleUser({
                            id: acc.id,
                            name: acc.name,
                            email: acc.email,
                            role: acc.role,
                            location: acc.location,
                            createdAt: new Date().toISOString(),
                          });
                        }
                      }}
                      className="group/item w-full text-left p-2 rounded-lg hover:bg-[#f0f4f1] text-xs text-[#1e2e25] flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <Store className="w-3.5 h-3.5 text-[#3e7053] flex-shrink-0 transition-transform duration-200 group-hover/item:scale-115 group-hover/item:rotate-6" />
                        <span className="font-semibold truncate">{acc.name}</span>
                      </div>
                      <span className="text-[10px] bg-[#e8f1ec] text-[#245237] px-1.5 py-0.5 rounded font-semibold flex items-center space-x-1 group-hover/item:bg-[#3e7053] group-hover/item:text-white transition-colors">
                        <UserCheck className="w-2.5 h-2.5" />
                        <span>LogIn</span>
                      </span>
                    </button>
                  ))}
                </div>

                <div className="space-y-1 border-t border-[#e2e9e2] pt-2">
                  <div className="text-[10px] font-bold text-[#d97757] uppercase px-2 py-0.5 flex items-center space-x-1">
                    <HeartHandshake className="w-3 h-3 text-[#d97757]" />
                    <span>NGO Partners</span>
                  </div>
                  {SAMPLE_ACCOUNTS.ngos.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => {
                        setIsSwitchMenuOpen(false);
                        if (onSelectSampleUser) {
                          onSelectSampleUser({
                            id: acc.id,
                            name: acc.name,
                            email: acc.email,
                            role: acc.role,
                            location: acc.location,
                            reliabilityScore: acc.reliabilityScore,
                            createdAt: new Date().toISOString(),
                          });
                        }
                      }}
                      className="group/item w-full text-left p-2 rounded-lg hover:bg-[#f0f4f1] text-xs text-[#1e2e25] flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <HeartHandshake className="w-3.5 h-3.5 text-[#d97757] flex-shrink-0 transition-transform duration-200 group-hover/item:scale-115 group-hover/item:-rotate-6" />
                        <span className="font-semibold truncate">{acc.name}</span>
                      </div>
                      <span className="text-[10px] bg-[#fdf3ee] text-[#b04d2e] px-1.5 py-0.5 rounded font-semibold flex items-center space-x-1 group-hover/item:bg-[#d97757] group-hover/item:text-white transition-colors">
                        <UserCheck className="w-2.5 h-2.5" />
                        <span>LogIn</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Settings Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSettingsOpen(!isSettingsOpen);
                if (isSwitchMenuOpen) setIsSwitchMenuOpen(false);
                if (isLangOpen) setIsLangOpen(false);
              }}
              className={`group px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-2 transition-all shadow-2xs hover:shadow-xs ${
                isHighContrast
                  ? 'bg-[#1e2e25] text-white border-black ring-2 ring-black'
                  : 'bg-[#f0f4f1] hover:bg-[#e4ece5] border-[#d2dfd5] text-[#22382c]'
              }`}
              id="btn-user-settings-dropdown"
              title="User & Accessibility Settings"
            >
              <Settings className="w-3.5 h-3.5 text-[#3e7053] group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden sm:inline">{t('nav.settings', 'Settings')}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#6c8273] transition-transform duration-300 ${isSettingsOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#d2dfd5] rounded-2xl shadow-xl p-4 z-50 space-y-4 animate-in fade-in slide-in-from-top-2">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#e2e9e2] pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-[#3e7053]" />
                    <span className="text-xs font-black text-[#1e2e25] uppercase tracking-wider">
                      {t('nav.userSettings', 'User Settings')}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="p-1 rounded-md text-[#889b8e] hover:text-[#1e2e25] hover:bg-[#f0f4f1] transition-colors"
                    id="btn-close-user-settings"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* User Info Card if logged in */}
                {user && (
                  <div className="bg-[#f8faf8] p-3 rounded-xl border border-[#e2e9e2] space-y-1 text-xs">
                    <div className="font-extrabold text-[#1e2e25] truncate">{user.name}</div>
                    <div className="text-[11px] text-[#556b5e] truncate">{user.email}</div>
                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className="font-bold text-[#3e7053] bg-[#e8f1ec] px-2 py-0.5 rounded-full border border-[#c3dccf]">
                        {user.role} Portal
                      </span>
                      <span className="text-[#6c8273] font-mono truncate max-w-[140px]">{user.location}</span>
                    </div>
                  </div>
                )}

                {/* Language Switcher inside settings */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-[#556b5e] uppercase tracking-wider flex items-center space-x-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#3e7053]" />
                    <span>{t('nav.selectLanguage', 'Platform Language')}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 bg-[#f0f4f1] p-1.5 rounded-xl border border-[#d2dfd5]">
                    {LANGUAGE_OPTIONS.map((opt) => (
                      <button
                        key={opt.code}
                        onClick={() => setLanguage(opt.code)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 transition-all ${
                          language === opt.code
                            ? 'bg-[#3e7053] text-white shadow-2xs'
                            : 'hover:bg-white/60 text-[#1e2e25]'
                        }`}
                      >
                        <span>{opt.flag}</span>
                        <span>{opt.code.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accessibility Options Section */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-[#556b5e] uppercase tracking-wider flex items-center space-x-1.5">
                    <Contrast className="w-3.5 h-3.5 text-[#3e7053]" />
                    <span>Visual Accessibility</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#f0f4f1] border border-[#d2dfd5]">
                    <div className="space-y-0.5 pr-2">
                      <div className="text-xs font-bold text-[#1e2e25] flex items-center space-x-1.5">
                        <span>{t('nav.highContrast', 'High-Contrast Mode')}</span>
                        {isHighContrast && (
                          <span className="bg-[#3e7053] text-white text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#556b5e] leading-snug">
                        Maximizes contrast and border visibility for visual impairments.
                      </p>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => setIsHighContrast(!isHighContrast)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#3e7053] ${
                        isHighContrast ? 'bg-[#3e7053]' : 'bg-[#c3dccf]'
                      }`}
                      role="switch"
                      aria-checked={isHighContrast}
                      id="toggle-high-contrast"
                      title="Toggle High-Contrast Mode"
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          isHighContrast ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* System Actions */}
                <div className="border-t border-[#e2e9e2] pt-3 space-y-2">
                  {user && onOpenWalkthrough && (
                    <button
                      onClick={() => {
                        onOpenWalkthrough();
                        setIsSettingsOpen(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[#e8f1ec] hover:bg-[#d8e8dd] text-[#245237] border border-[#c3dccf] font-bold text-xs flex items-center justify-between transition-colors shadow-2xs"
                      id="btn-settings-replay-walkthrough"
                    >
                      <span className="flex items-center space-x-2">
                        <Compass className="w-3.5 h-3.5 text-[#3e7053] animate-spin" />
                        <span>{t('nav.guidedTour', 'Replay Guided Tour')}</span>
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      handleResetData();
                      setIsSettingsOpen(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#f8faf8] hover:bg-[#e8f1ec] text-[#2d5e43] border border-[#d2dfd5] font-bold text-xs flex items-center justify-between transition-colors"
                    id="btn-settings-reset-data"
                  >
                    <span className="flex items-center space-x-2">
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{t('nav.resetData', 'Reset Sample Seed Data')}</span>
                    </span>
                  </button>

                  {user && (
                    <button
                      onClick={() => {
                        onLogout();
                        setIsSettingsOpen(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[#fdf3ee] hover:bg-[#f5d5c8] text-[#b04d2e] border border-[#f5d5c8] font-bold text-xs flex items-center justify-between transition-colors"
                      id="btn-settings-logout"
                    >
                      <span className="flex items-center space-x-2">
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('nav.signOut', 'Sign Out Account')}</span>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center space-x-2">
              {/* Guided Tour Quick Button */}
              {onOpenWalkthrough && (
                <button
                  onClick={onOpenWalkthrough}
                  className="px-3 py-1.5 rounded-full bg-[#e8f1ec] hover:bg-[#d8e8dd] text-[#245237] border border-[#c3dccf] font-bold text-xs flex items-center space-x-1.5 transition-all shadow-2xs hover:shadow-xs active:scale-95"
                  id="btn-nav-guided-tour"
                  title="Launch Interactive Dashboard Tour"
                >
                  <Compass className="w-3.5 h-3.5 text-[#3e7053]" />
                  <span className="hidden sm:inline">{t('nav.guidedTour', 'Guided Tour')}</span>
                </button>
              )}

              {/* Role badge */}
              <div className="hidden md:flex items-center space-x-2 bg-[#f0f4f1] border border-[#d2dfd5] rounded-full px-3 py-1 shadow-2xs group hover:bg-[#e4ece5] transition-colors">
                {user.role === 'Restaurant' ? (
                  <Store className="w-3.5 h-3.5 text-[#3e7053] transition-transform duration-300 group-hover:scale-115 group-hover:rotate-6" />
                ) : (
                  <HeartHandshake className="w-3.5 h-3.5 text-[#d97757] transition-transform duration-300 group-hover:scale-115 group-hover:-rotate-6" />
                )}
                <span className="text-xs font-semibold text-[#1e2e25]">
                  {user.name}
                </span>
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold flex items-center space-x-1 ${
                    user.role === 'Restaurant'
                      ? 'bg-[#3e7053] text-white'
                      : 'bg-[#d97757] text-white'
                  }`}
                >
                  <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                  <span>{user.role}</span>
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="group inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-[#384d41] hover:text-[#1e2e25] bg-[#f0f4f1] hover:bg-[#e2e8e3] rounded-xl transition-all border border-[#d2dfd5] hover:shadow-xs"
                id="btn-logout"
              >
                <LogOut className="w-3.5 h-3.5 text-[#6c8273] transition-transform duration-200 group-hover:-translate-x-0.5" />
                <span className="hidden sm:inline">{t('nav.signOut', 'Sign Out')}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenAuth('Restaurant')}
                className="group px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#245237] bg-[#e8f1ec] hover:bg-[#d9ebd0] border border-[#c3dccf] rounded-xl transition-all flex items-center space-x-1.5 hover:shadow-xs"
                id="btn-login-restaurant"
              >
                <Store className="w-3.5 h-3.5 text-[#3e7053] transition-transform duration-300 group-hover:scale-115 group-hover:rotate-6" />
                <span>{t('nav.restaurantPortal', 'Restaurant Portal')}</span>
              </button>
              <button
                onClick={() => onOpenAuth('NGO')}
                className="group px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white bg-[#d97757] hover:bg-[#c66848] rounded-xl transition-all shadow-2xs hover:shadow-xs flex items-center space-x-1.5"
                id="btn-login-ngo"
              >
                <HeartHandshake className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-115 group-hover:-rotate-6" />
                <span>{t('nav.ngoPortal', 'NGO Partner Portal')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

