import React, { useState, useEffect } from 'react';
import { UserProfile, Listing, Claim, Role } from './types';
import {
  loadStoredData,
  resetToSeedData,
  saveUserToStorage,
  saveListingsToStorage,
  saveClaimsToStorage,
} from './lib/store';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { RestaurantDashboard } from './components/RestaurantDashboard';
import { NgoDashboard } from './components/NgoDashboard';
import { AuthModal } from './components/AuthModal';
import { QrModal } from './components/QrModal';
import { ChatAssistant } from './components/ChatAssistant';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [ngos, setNgos] = useState<any[]>([]);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<Role>('Restaurant');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrListing, setQrListing] = useState<Listing | null>(null);
  const [qrClaim, setQrClaim] = useState<Claim | null>(null);

  // Load stored data on mount
  useEffect(() => {
    const data = loadStoredData();
    setUser(data.currentUser);
    setListings(data.listings);
    setClaims(data.claims);
    setRestaurants(data.restaurants);
    setNgos(data.ngos);
  }, []);

  // Save changes to local storage when state updates
  useEffect(() => {
    saveListingsToStorage(listings);
  }, [listings]);

  useEffect(() => {
    saveClaimsToStorage(claims);
  }, [claims]);

  useEffect(() => {
    saveUserToStorage(user);
  }, [user]);

  // Handle resetting data
  const handleResetSeedData = () => {
    const seed = resetToSeedData();
    setListings(seed.listings);
    setClaims(seed.claims);
    setRestaurants(seed.restaurants);
    setNgos(seed.ngos);
  };

  // Auth Modal trigger helper
  const handleOpenAuth = (role: Role = 'Restaurant', mode: 'login' | 'signup' = 'signup') => {
    setAuthModalRole(role);
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Auth Success Handler
  const handleAuthSuccess = (loggedUser: UserProfile) => {
    setUser(loggedUser);
    setIsAuthModalOpen(false);
  };

  // Demo Login Handler
  const handleDemoLogin = (role: Role) => {
    if (role === 'Restaurant') {
      const demoRest: UserProfile = {
        id: 'a1111111-1111-1111-1111-111111111111',
        name: 'Green Leaf Bistro',
        email: 'bistro@greenleaf.com',
        role: 'Restaurant',
        location: '124 Market St, Downtown',
        createdAt: new Date().toISOString(),
      };
      setUser(demoRest);
    } else {
      const demoNgo: UserProfile = {
        id: 'b1111111-1111-1111-1111-111111111111',
        name: 'Hope Food Bank',
        email: 'contact@hopefoodbank.org',
        role: 'NGO',
        location: '45 Community Way, Sector 4',
        reliabilityScore: 92,
        createdAt: new Date().toISOString(),
      };
      setUser(demoNgo);
    }
  };

  const handleLogout = () => {
    setUser(null);
    saveUserToStorage(null);
  };

  // Post Listing
  const handleAddListing = (newListingData: Omit<Listing, 'id' | 'status' | 'createdAt'>) => {
    const newListing: Listing = {
      ...newListingData,
      id: 'c_' + Math.random().toString(36).substring(2, 10),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setListings((prev) => [newListing, ...prev]);
  };

  // Claim Listing (by NGO)
  const handleClaimListing = (listingId: string) => {
    if (!user || user.role !== 'NGO') return;

    const targetListing = listings.find((l) => l.id === listingId);
    if (!targetListing) return;

    // Update listing status
    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, status: 'claimed' } : l))
    );

    // Create new Claim
    const newClaim: Claim = {
      id: 'd_' + Math.random().toString(36).substring(2, 10),
      listingId,
      ngoId: user.id,
      ngoName: user.name,
      ngoEmail: user.email,
      ngoLocation: user.location,
      status: 'claimed',
      claimedAt: new Date().toISOString(),
    };

    setClaims((prev) => [newClaim, ...prev]);
  };

  // Confirm Pickup (by NGO or Restaurant)
  const handleConfirmPickup = (listingId: string) => {
    const nowIso = new Date().toISOString();

    // Update listing status to picked_up
    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, status: 'picked_up' } : l))
    );

    // Update claim pickedUpAt
    setClaims((prev) =>
      prev.map((c) =>
        c.listingId === listingId
          ? { ...c, status: 'picked_up', pickedUpAt: nowIso }
          : c
      )
    );
  };

  // Open QR modal
  const handleOpenQr = (listing: Listing, claim: Claim) => {
    setQrListing(listing);
    setQrClaim(claim);
    setIsQrModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f7f4] font-sans text-[#1e2e25] flex flex-col justify-between selection:bg-[#3e7053] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        user={user}
        onOpenAuth={(role) => handleOpenAuth(role, 'login')}
        onLogout={handleLogout}
        onNavigateHome={() => setUser(null)}
        onSelectSampleUser={(sampleUser) => setUser(sampleUser)}
        onResetSeedData={handleResetSeedData}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {!user ? (
          <LandingPage
            onOpenAuth={(role, mode) => handleOpenAuth(role, mode)}
            onDemoLogin={handleDemoLogin}
            onSelectSampleUser={(sampleUser) => setUser(sampleUser)}
          />
        ) : user.role === 'Restaurant' ? (
          <RestaurantDashboard
            user={user}
            listings={listings}
            claims={claims}
            onAddListing={handleAddListing}
            onOpenQr={handleOpenQr}
          />
        ) : (
          <NgoDashboard
            user={user}
            listings={listings}
            claims={claims}
            onClaimListing={handleClaimListing}
            onConfirmPickup={handleConfirmPickup}
            onOpenQr={handleOpenQr}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#ebefeb] border-t border-[#d8e2d8] py-6 text-center text-xs text-[#556b5e]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} FoodFlow AI. Real-time surplus food redistribution engine.</p>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleResetSeedData}
              className="text-[#2d5e43] hover:underline font-semibold"
            >
              Reset Sample Demo Data
            </button>
            <span>•</span>
            <span className="text-[#6c8273]">Verified NGO Partnerships</span>
          </div>
        </div>
      </footer>

      {/* Floating Gemini AI Chat Assistant */}
      <ChatAssistant />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialRole={authModalRole}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <QrModal
        isOpen={isQrModalOpen}
        listing={qrListing}
        claim={qrClaim}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
}
