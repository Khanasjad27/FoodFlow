import React, { useState } from 'react';
import { UserProfile, Listing, Claim, ImpactStats } from '../types';
import { calculateMatchScore, calculateNgoImpact } from '../lib/store';
import { ImpactCharts } from './ImpactCharts';
import { ListingCardSkeleton } from './SkeletonLoaders';
import { NgoListingsMap } from './NgoListingsMap';
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

        {/* Reliability Score Badge */}
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
              {filteredPendingListings.map((listing) => (
                <div
                  key={listing.id}
                  className="group/card bg-white rounded-2xl p-5 border border-[#d8e2d8] shadow-2xs flex flex-col justify-between space-y-4 hover:border-[#b8ccb8] hover:shadow-xs transition-all relative overflow-hidden"
                >
                  {/* Top Header with Match Score Badge */}
                  <div className="flex items-start justify-between border-b border-[#e2e9e2] pb-3">
                    <div>
                      <span className="font-bold text-base text-[#1e2e25] block">{listing.foodType}</span>
                      <span className="text-xs text-[#2d5e43] font-semibold">{listing.restaurantName}</span>
                    </div>

                    {/* Match Score % Pill */}
                    <div className="flex flex-col items-end">
                      <span className="bg-[#3e7053] text-white font-black text-xs px-2.5 py-1 rounded-full shadow-2xs flex items-center space-x-1 group-hover/card:scale-105 transition-transform">
                        <Zap className="w-3 h-3 text-[#ffdd85] fill-[#ffdd85] animate-pulse" />
                        <span>{listing.matchScore}% Match</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="space-y-2 text-xs text-[#556b5e]">
                    <div className="flex items-center justify-between bg-[#f8faf8] p-2.5 rounded-xl font-semibold border border-[#e2e9e2]">
                      <span>Quantity:</span>
                      <span className="text-[#1e2e25] font-black text-sm">{listing.quantity} Servings</span>
                    </div>

                    <div className="flex items-center space-x-2 text-[#556b5e]">
                      <Clock className="w-3.5 h-3.5 text-[#d97757] flex-shrink-0 transition-transform duration-300 group-hover/card:rotate-12" />
                      <span>
                        Expiry Window: <strong className="text-[#1e2e25]">{new Date(listing.expiryTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</strong>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-[#556b5e]">
                      <MapPin className="w-3.5 h-3.5 text-[#889b8e] flex-shrink-0 transition-transform duration-300 group-hover/card:scale-110" />
                      <span className="truncate">{listing.pickupLocation}</span>
                    </div>
                  </div>

                  {/* Score Breakdown Pills */}
                  <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center bg-[#f8faf8] p-2 rounded-xl border border-[#e2e9e2]">
                    <div className="text-[#556b5e]">
                      <div className="font-bold text-[#d97757]">{listing.urgencyScore}/40</div>
                      <div>Urgency</div>
                    </div>
                    <div className="text-[#556b5e] border-x border-[#e2e9e2]">
                      <div className="font-bold text-[#3e7053]">{listing.capacityScore}/30</div>
                      <div>Capacity</div>
                    </div>
                    <div className="text-[#556b5e]">
                      <div className="font-bold text-[#3a6578]">{listing.reliabilityScore}/30</div>
                      <div>Reliability</div>
                    </div>
                  </div>

                  {/* Claim Button */}
                  <button
                    onClick={() => onClaimListing(listing.id)}
                    className="group/btn w-full py-3 px-4 rounded-xl bg-[#d97757] hover:bg-[#c66848] text-white font-bold text-xs shadow-2xs hover:shadow-xs transition-all duration-300 flex items-center justify-center space-x-2"
                    id={`btn-claim-${listing.id}`}
                  >
                    <HeartHandshake className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-125 group-hover/btn:-rotate-12" />
                    <span>Claim Listing</span>
                  </button>
                </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myClaimedListings.map((listing) => {
                const claim = myClaims.find((c) => c.listingId === listing.id);

                return (
                  <div
                    key={listing.id}
                    className="group/claimed bg-white rounded-2xl p-6 border border-[#c5ddf0] shadow-2xs space-y-4 relative hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center justify-between border-b border-[#e2e9e2] pb-3">
                      <div>
                        <span className="font-bold text-base text-[#1e2e25] block">{listing.foodType}</span>
                        <span className="text-xs text-[#3a6578] font-semibold">{listing.restaurantName}</span>
                      </div>
                      <span className="bg-[#ebf3f7] text-[#224859] text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-[#c5ddf0] flex items-center space-x-1 shadow-2xs">
                        <AlertCircle className="w-3.5 h-3.5 text-[#3a6578] animate-pulse" />
                        <span>Ready for Pickup</span>
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-[#556b5e] bg-[#f8faf8] p-3 rounded-xl border border-[#e2e9e2]">
                      <div className="flex items-center justify-between font-bold">
                        <span>Quantity:</span>
                        <span className="text-[#1e2e25]">{listing.quantity} Servings</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-[#3a6578] flex-shrink-0" />
                        <span>Pickup: <strong>{listing.pickupLocation}</strong></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-[#3a6578] flex-shrink-0" />
                        <span>Contact: <strong>{listing.restaurantEmail || 'restaurant@foodflow.org'}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {claim && (
                        <button
                          onClick={() => onOpenQr(listing, claim)}
                          className="group/qr flex-1 py-2.5 px-3 rounded-xl border border-[#c5ddf0] text-[#224859] font-bold text-xs bg-[#ebf3f7] hover:bg-[#dcebf3] transition-all flex items-center justify-center space-x-1.5 shadow-2xs"
                          id={`btn-view-qr-ngo-${listing.id}`}
                        >
                          <QrCode className="w-4 h-4 transition-transform duration-300 group-hover/qr:scale-125 group-hover/qr:rotate-6" />
                          <span>Show QR Code</span>
                        </button>
                      )}

                      <button
                        onClick={() => onConfirmPickup(listing.id)}
                        className="group/confirm flex-1 py-2.5 px-3 rounded-xl bg-[#3e7053] hover:bg-[#325b43] text-white font-bold text-xs shadow-2xs hover:shadow-xs transition-all flex items-center justify-center space-x-1.5"
                        id={`btn-confirm-pickup-${listing.id}`}
                      >
                        <CheckCircle2 className="w-4 h-4 transition-transform duration-300 group-hover/confirm:scale-125 group-hover/confirm:rotate-12" />
                        <span>Confirm Pickup</span>
                      </button>
                    </div>
                  </div>
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
              {myCompletedListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-2xl p-5 border border-[#c3dccf] shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#e2e9e2] pb-2">
                    <span className="font-bold text-sm text-[#1e2e25]">{listing.foodType}</span>
                    <span className="bg-[#e8f1ec] text-[#245237] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center space-x-1 border border-[#c3dccf]">
                      <CheckCircle2 className="w-3 h-3 text-[#3e7053] animate-pulse" />
                      <span>Picked Up</span>
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-[#556b5e]">
                    <div>Restaurant: <strong className="text-[#1e2e25]">{listing.restaurantName}</strong></div>
                    <div>Quantity Collected: <strong className="text-[#1e2e25]">{listing.quantity} Servings ({listing.quantity * 10} meals)</strong></div>
                    <div>Location: {listing.pickupLocation}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
