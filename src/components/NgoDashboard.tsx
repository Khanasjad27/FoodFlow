import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Listing, Claim, ImpactStats } from '../types';
import { calculateMatchScore, calculateNgoImpact } from '../lib/store';
import { ImpactCharts } from './ImpactCharts';
import { ListingCardSkeleton } from './SkeletonLoaders';
import { NgoListingsMap } from './NgoListingsMap';
import { DonorTierBadge } from './DonorTierBadge';
import { MilestonesSection } from './MilestonesSection';
import { AchievementsSection } from './AchievementsSection';
import { ListingCard } from './ListingCard';
import {
  HeartHandshake,
  Clock,
  MapPin,
  CheckCircle2,
  Award,
  Zap,
  Building,
  Phone,
  Mail,
  Utensils,
  Leaf,
  Sparkles,
  QrCode,
  ShieldCheck,
  AlertCircle,
  Compass,
  Search,
  X,
} from 'lucide-react';

interface NgoDashboardProps {
  user: UserProfile;
  listings: Listing[];
  claims: Claim[];
  onClaimListing: (listingId: string) => void;
  onConfirmPickup: (listingId: string) => void;
  onOpenQr: (listing: Listing, claim: Claim) => void;
}

export const NgoDashboard: React.FC<NgoDashboardProps> = ({
  user,
  listings,
  claims,
  onClaimListing,
  onConfirmPickup,
  onOpenQr,
}) => {
  const [activeTab, setActiveTab] = useState<'available' | 'map' | 'my_claims' | 'history'>('available');
  const [searchTerm, setSearchTerm] = useState('');

  const ngoReliabilityScore = user.reliabilityScore ?? 80;

  // Compute match score for all pending listings and sort by match score descending
  const pendingListingsWithScores = listings
    .filter((l) => l.status === 'pending')
    .map((l) => {
      const scores = calculateMatchScore(l.expiryTime, ngoReliabilityScore);
      return {
        ...l,
        ...scores,
      };
    })
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  // Filter pending listings by search term (restaurant name, location, or food type)
  const filteredPendingListings = pendingListingsWithScores.filter((listing) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase().trim();
    const restaurant = (listing.restaurantName || '').toLowerCase();
    const location = (listing.pickupLocation || '').toLowerCase();
    const food = (listing.foodType || '').toLowerCase();
    return restaurant.includes(query) || location.includes(query) || food.includes(query);
  });

  // Find claims belonging to this NGO
  const myClaims = claims.filter((c) => c.ngoId === user.id || c.ngoName === user.name);

  // Filter listings claimed by this NGO that are currently status = 'claimed'
  const myClaimedListings = listings.filter((l) => {
    const claim = myClaims.find((c) => c.listingId === l.id);
    return claim && l.status === 'claimed';
  });

  // Filter listings picked up by this NGO
  const myCompletedListings = listings.filter((l) => {
    const claim = myClaims.find((c) => c.listingId === l.id);
    return claim && l.status === 'picked_up';
  });

  // Calculate NGO Impact Stats
  const impact: ImpactStats = calculateNgoImpact(user.id, listings, claims);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#f5f7f4] text-[#1e2e25]">
      {/* Header Banner */}
      <div className="bg-white border border-[#d8e2d8] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-[#fdf3ee] border border-[#f5d5c8] px-3 py-1 rounded-full text-[#b04d2e] text-xs font-semibold">
            <HeartHandshake className="w-3.5 h-3.5 text-[#d97757] animate-pulse" />
            <span>NGO Partner Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1e2e25]">{user.name}</h1>
          <p className="text-[#556b5e] text-sm flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#3e7053]" />
            <span>{user.location}</span>
          </p>
        </div>

        {/* Reliability Score Badge & Compact Tier Pill */}
        <div className="flex flex-wrap items-center gap-4">
          <DonorTierBadge impact={impact} role="NGO" compact />
          <div className="group bg-[#f8faf8] hover:bg-[#f0f4f0] rounded-2xl p-4 border border-[#e2e9e2] flex items-center space-x-4 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#e8f1ec] text-[#3e7053] flex items-center justify-center font-black text-xl shadow-2xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-7 h-7 text-[#3e7053] transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#3e7053]">{ngoReliabilityScore}/100</div>
              <div className="text-xs text-[#556b5e] font-medium">Reliability Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Recognition & Tier Progress Panel */}
      <DonorTierBadge impact={impact} role="NGO" />

      {/* Dedicated Sustainability Achievements Section */}
      <AchievementsSection impact={impact} role="NGO" userName={user.name} />

      {/* Donor Milestones & Celebratory Trophies */}
      <MilestonesSection impact={impact} role="NGO" entityName={user.name} />

      {/* Impact Stats & Recharts Visualizations */}
      <ImpactCharts
        role="NGO"
        impact={impact}
        listings={listings}
        claims={myClaims}
        userName={user.name}
      />

      {/* Search Bar Control Header */}
      <div className="bg-white p-4 rounded-2xl border border-[#d8e2d8] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80 md:w-96">
          <Search className="w-4 h-4 text-[#889b8e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by restaurant name or pickup location..."
            className="w-full pl-10 pr-9 py-2 bg-[#f8faf8] border border-[#d8e2d8] rounded-xl text-xs font-medium text-[#1e2e25] placeholder-[#889b8e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3e7053] focus:border-transparent transition-all shadow-2xs"
            id="input-ngo-search"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#889b8e] hover:text-[#1e2e25] p-0.5 rounded-md hover:bg-[#f0f4f1] transition-colors"
              id="btn-clear-search"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-[#556b5e] self-end sm:self-center">
          {searchTerm ? (
            <span className="bg-[#e8f1ec] text-[#245237] px-3 py-1 rounded-full border border-[#c3dccf]">
              Found {filteredPendingListings.length} of {pendingListingsWithScores.length} listings
            </span>
          ) : (
            <span className="text-[#889b8e]">
              Search by restaurant, location, or food type
            </span>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-[#e2e9e2] flex flex-wrap gap-4 sm:gap-8">
        <button
          onClick={() => setActiveTab('available')}
          className={`group py-3 text-sm font-bold border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'available'
              ? 'border-[#3e7053] text-[#3e7053]'
              : 'border-transparent text-[#556b5e] hover:text-[#1e2e25]'
          }`}
          id="tab-available-feed"
        >
          <Zap className="w-4 h-4 text-[#d97757] animate-pulse group-hover:rotate-12 transition-transform" />
          <span>Live Available Feed ({filteredPendingListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`group py-3 text-sm font-bold border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'map'
              ? 'border-[#3e7053] text-[#3e7053]'
              : 'border-transparent text-[#556b5e] hover:text-[#1e2e25]'
          }`}
          id="tab-map-radar"
        >
          <Compass className="w-4 h-4 text-[#3e7053] group-hover:rotate-45 transition-transform duration-300" />
          <span>Pickup Map Radar</span>
        </button>

        <button
          onClick={() => setActiveTab('my_claims')}
          className={`group py-3 text-sm font-bold border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'my_claims'
              ? 'border-[#3e7053] text-[#3e7053]'
              : 'border-transparent text-[#556b5e] hover:text-[#1e2e25]'
          }`}
          id="tab-my-claims"
        >
          <Clock className="w-4 h-4 text-[#3a6578] group-hover:rotate-45 transition-transform duration-300" />
          <span>My Claimed Pickups ({myClaimedListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`group py-3 text-sm font-bold border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'history'
              ? 'border-[#3e7053] text-[#3e7053]'
              : 'border-transparent text-[#556b5e] hover:text-[#1e2e25]'
          }`}
          id="tab-history"
        >
          <CheckCircle2 className="w-4 h-4 text-[#3e7053] group-hover:scale-110 transition-transform" />
          <span>Completed History ({myCompletedListings.length})</span>
        </button>
      </div>

      {/* TAB: MAP RADAR VIEW */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          <NgoListingsMap
            listings={filteredPendingListings}
            ngoLocation={user.location}
            onClaimListing={onClaimListing}
          />
        </div>
      )}

      {/* TAB 1: AVAILABLE FEED */}
      {activeTab === 'available' && (
        <div className="space-y-6">
          {/* Integrated Map View in Feed */}
          <NgoListingsMap
            listings={filteredPendingListings}
            ngoLocation={user.location}
            onClaimListing={onClaimListing}
          />
          <div className="bg-white border border-[#d8e2d8] p-4 rounded-xl flex items-center justify-between text-xs text-[#556b5e] shadow-2xs">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-[#d97757] flex-shrink-0 animate-bounce" />
              <span>
                Listings are ranked using our AI Match Score formula: <strong>Urgency (up to 40pts) + Capacity (30pts) + Reliability (up to 30pts)</strong>.
              </span>
            </div>
          </div>

          {filteredPendingListings.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-[#d8e2d8]">
              <Utensils className="w-10 h-10 text-[#889b8e] mx-auto mb-3" />
              <h3 className="font-bold text-[#1e2e25] text-sm">
                {searchTerm
                  ? `No listings match "${searchTerm}"`
                  : 'No pending surplus listings available right now'}
              </h3>
              <p className="text-xs text-[#556b5e] mt-1">
                {searchTerm
                  ? 'Try adjusting your search query or clearing the filter.'
                  : 'Check back soon or ask your local restaurants to post their surplus meals.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-3 py-1.5 rounded-xl bg-[#3e7053] text-white font-bold text-xs shadow-2xs hover:bg-[#325b43] transition-colors"
                  id="btn-reset-search"
                >
                  Clear Search Filter
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPendingListings.map((listing, idx) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  role="NGO"
                  index={idx}
                  onClaimListing={onClaimListing}
                  onOpenQr={onOpenQr}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY CLAIMED PICKUPS */}
      {activeTab === 'my_claims' && (
        <div className="space-y-6">
          {myClaimedListings.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-[#d8e2d8]">
              <Clock className="w-10 h-10 text-[#889b8e] mx-auto mb-3" />
              <h3 className="font-bold text-[#1e2e25] text-sm">No active claimed pickups</h3>
              <p className="text-xs text-[#556b5e] mt-1">
                Claim an available listing from the Live Feed to start a pickup.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myClaimedListings.map((listing, idx) => {
                const claim = myClaims.find((c) => c.listingId === listing.id);
                return (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    claim={claim}
                    role="NGO"
                    index={idx}
                    onConfirmPickup={onConfirmPickup}
                    onOpenQr={onOpenQr}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COMPLETED HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {myCompletedListings.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-[#d8e2d8]">
              <CheckCircle2 className="w-10 h-10 text-[#889b8e] mx-auto mb-3" />
              <h3 className="font-bold text-[#1e2e25] text-sm">No completed pickups yet</h3>
              <p className="text-xs text-[#556b5e] mt-1">
                Your completed food distributions will be logged here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCompletedListings.map((listing, idx) => {
                const claim = myClaims.find((c) => c.listingId === listing.id);
                return (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    claim={claim}
                    role="NGO"
                    index={idx}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
