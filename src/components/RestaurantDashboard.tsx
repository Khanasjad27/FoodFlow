import React, { useState } from 'react';
import { UserProfile, Listing, Claim, ImpactStats } from '../types';
import { calculateRestaurantImpact } from '../lib/store';
import { ImpactCharts } from './ImpactCharts';
import { DonorTierBadge } from './DonorTierBadge';
import { MilestonesSection } from './MilestonesSection';
import { AchievementsSection } from './AchievementsSection';
import { ListingCard } from './ListingCard';
import { detectCurrentLocation } from '../lib/location';
import {
  Utensils,
  PlusCircle,
  Clock,
  MapPin,
  QrCode,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Flame,
  Sparkles,
  Award,
  Leaf,
  Calendar,
  Building,
  Phone,
  Mail,
  ChevronRight,
  Navigation,
  Loader2,
} from 'lucide-react';

interface RestaurantDashboardProps {
  user: UserProfile;
  listings: Listing[];
  claims: Claim[];
  onAddListing: (newListing: Omit<Listing, 'id' | 'status' | 'createdAt'>) => void;
  onOpenQr: (listing: Listing, claim: Claim) => void;
}

const FOOD_TYPES = [
  'Prepared Meals',
  'Bakery & Bread',
  'Fresh Produce & Fruit',
  'Dairy & Packaged Goods',
  'Sandwiches & Salads',
  'Soups & Stews',
];

export const RestaurantDashboard: React.FC<RestaurantDashboardProps> = ({
  user,
  listings,
  claims,
  onAddListing,
  onOpenQr,
}) => {
  // Form State
  const [foodType, setFoodType] = useState(FOOD_TYPES[0]);
  const [quantity, setQuantity] = useState<number>(25);
  const [pickupLocation, setPickupLocation] = useState(user.location || '124 Market St, Back Bay');
  const [isDetectingLoc, setIsDetectingLoc] = useState(false);

  const handleDetectPickupLocation = async () => {
    setIsDetectingLoc(true);
    try {
      const loc = await detectCurrentLocation();
      setPickupLocation(loc.address);
    } catch {
      // fallback
    } finally {
      setIsDetectingLoc(false);
    }
  };

  // Default expiry 4 hours from now
  const getDefaultExpiryIso = (offsetHours: number = 4) => {
    const d = new Date();
    d.setHours(d.getHours() + offsetHours);
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const [expiryInput, setExpiryInput] = useState(getDefaultExpiryIso(4));
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Filter listings belonging to this restaurant
  const restaurantListings = listings.filter((l) => l.restaurantId === user.id || l.restaurantName === user.name);

  // Calculate Impact Stats
  const impact: ImpactStats = calculateRestaurantImpact(user.id, restaurantListings);

  const handleSubmitListing = (e: React.FormEvent) => {
    e.preventDefault();

    const expiryIso = new Date(expiryInput).toISOString();

    onAddListing({
      restaurantId: user.id,
      restaurantName: user.name,
      restaurantEmail: user.email,
      restaurantLocation: user.location,
      foodType,
      quantity: Number(quantity),
      expiryTime: expiryIso,
      pickupLocation,
    });

    // Reset form & trigger toast
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  // Quick preset helper
  const applyExpiryPreset = (hours: number) => {
    setExpiryInput(getDefaultExpiryIso(hours));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#f5f7f4] text-[#1e2e25]">
      {/* Header Banner */}
      <div className="bg-white border border-[#d8e2d8] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-[#e8f1ec] border border-[#c3dccf] px-3 py-1 rounded-full text-[#245237] text-xs font-semibold">
            <Building className="w-3.5 h-3.5 text-[#d97757]" />
            <span>Restaurant Partner Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1e2e25]">{user.name}</h1>
          <p className="text-[#556b5e] text-sm flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#3e7053]" />
            <span>{user.location}</span>
          </p>
        </div>

        {/* Quick summary pill with Donor Tier Badge */}
        <div className="flex flex-wrap items-center gap-4">
          <DonorTierBadge impact={impact} role="Restaurant" compact />
          <div className="bg-[#f8faf8] rounded-2xl p-4 border border-[#e2e9e2] flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-[#fdf3ee] flex items-center justify-center text-[#d97757]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#d97757]">{impact.totalMeals}</div>
              <div className="text-xs text-[#556b5e] font-medium">Total Meals Donated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Donor Tier Recognition & Progress Panel */}
      <DonorTierBadge impact={impact} role="Restaurant" />

      {/* Dedicated Sustainability Achievements Section */}
      <AchievementsSection impact={impact} role="Restaurant" userName={user.name} />

      {/* Donor Milestones & Celebratory Trophies */}
      <MilestonesSection impact={impact} role="Restaurant" entityName={user.name} />

      {/* Impact Stats & Recharts Visualizations */}
      <ImpactCharts
        role="Restaurant"
        impact={impact}
        listings={restaurantListings}
        claims={claims}
        userName={user.name}
      />

      {/* Post New Listing Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#d8e2d8] shadow-xs relative">
        <div className="flex items-center space-x-2 mb-6 border-b border-[#e2e9e2] pb-4">
          <PlusCircle className="w-6 h-6 text-[#3e7053] transition-transform duration-300 hover:rotate-90" />
          <h2 className="text-xl font-bold text-[#1e2e25]">Post Surplus Food Listing</h2>
        </div>

        {showSuccessToast && (
          <div className="mb-6 bg-[#e8f1ec] border border-[#c3dccf] text-[#245237] p-4 rounded-xl flex items-center space-x-3 text-sm animate-in fade-in shadow-2xs">
            <CheckCircle2 className="w-5 h-5 text-[#3e7053] flex-shrink-0 animate-bounce" />
            <span>Surplus food listing published successfully! Local NGOs have been notified.</span>
          </div>
        )}

        <form onSubmit={handleSubmitListing} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Food Type */}
          <div>
            <label className="block text-xs font-bold text-[#556b5e] uppercase tracking-wider mb-2">
              Food Type / Category
            </label>
            <select
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              className="w-full p-3 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-sm font-semibold text-[#1e2e25] focus:outline-hidden focus:ring-2 focus:ring-[#3e7053]"
              id="select-food-type"
            >
              {FOOD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-bold text-[#556b5e] uppercase tracking-wider mb-2">
              Quantity (Portions / Servings)
            </label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full p-3 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-sm font-semibold text-[#1e2e25] focus:outline-hidden focus:ring-2 focus:ring-[#3e7053]"
              id="input-quantity"
            />
          </div>

          {/* Expiry Time Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-[#556b5e] uppercase tracking-wider">
                Expiry Time (Pickup Window)
              </label>
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => applyExpiryPreset(2)}
                  className="text-[11px] font-semibold bg-[#f0f4f1] hover:bg-[#e4ece5] text-[#22382c] px-2 py-0.5 rounded-md hover:scale-105 transition-transform"
                >
                  +2h
                </button>
                <button
                  type="button"
                  onClick={() => applyExpiryPreset(4)}
                  className="text-[11px] font-semibold bg-[#f0f4f1] hover:bg-[#e4ece5] text-[#22382c] px-2 py-0.5 rounded-md hover:scale-105 transition-transform"
                >
                  +4h
                </button>
                <button
                  type="button"
                  onClick={() => applyExpiryPreset(8)}
                  className="text-[11px] font-semibold bg-[#f0f4f1] hover:bg-[#e4ece5] text-[#22382c] px-2 py-0.5 rounded-md hover:scale-105 transition-transform"
                >
                  +8h
                </button>
              </div>
            </div>
            <input
              type="datetime-local"
              required
              value={expiryInput}
              onChange={(e) => setExpiryInput(e.target.value)}
              className="w-full p-3 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-sm font-semibold text-[#1e2e25] focus:outline-hidden focus:ring-2 focus:ring-[#3e7053]"
              id="input-expiry-time"
            />
          </div>

          {/* Pickup Location */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-[#556b5e] uppercase tracking-wider">
                Specific Pickup Instructions / Location
              </label>
              <button
                type="button"
                onClick={handleDetectPickupLocation}
                disabled={isDetectingLoc}
                className="text-[11px] font-bold text-[#3e7053] hover:text-[#2a4d39] flex items-center space-x-1"
                id="btn-detect-pickup-location"
              >
                {isDetectingLoc ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Navigation className="w-3 h-3 text-[#3e7053]" />
                )}
                <span>{isDetectingLoc ? 'Detecting...' : 'Use Current Location'}</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="e.g. Back entrance loading dock"
              className="w-full p-3 bg-[#f8faf8] border border-[#d2dfd5] rounded-xl text-sm font-semibold text-[#1e2e25] focus:outline-hidden focus:ring-2 focus:ring-[#3e7053]"
              id="input-pickup-location"
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              className="group w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-[#3e7053] hover:bg-[#325b43] shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center space-x-2"
              id="btn-submit-listing"
            >
              <PlusCircle className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
              <span>Publish Surplus Food Listing</span>
            </button>
          </div>
        </form>
      </div>

      {/* Active & Past Listings */}
      <div className="space-y-4">
        {(() => {
          const urgentCount = restaurantListings.filter((l) => {
            if (l.status === 'picked_up') return false;
            const diffMs = new Date(l.expiryTime).getTime() - Date.now();
            return diffMs <= 2 * 60 * 60 * 1000;
          }).length;

          return (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-[#1e2e25]">Your Posted Listings</h2>
                  {urgentCount > 0 && (
                    <span className="bg-[#fdf3ee] text-[#b04d2e] border border-[#f5d5c8] text-xs font-black px-2.5 py-0.5 rounded-full flex items-center space-x-1 animate-pulse">
                      <Flame className="w-3.5 h-3.5 text-[#d97757]" />
                      <span>{urgentCount} Expiring Soon</span>
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#556b5e] font-semibold">
                  {restaurantListings.length} total listings
                </span>
              </div>

              {/* Priority Expiry Warning Banner */}
              {urgentCount > 0 && (
                <div className="bg-[#fdf3ee] border-2 border-[#d97757] p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-bold text-[#b04d2e] shadow-2xs">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-[#f5d5c8] text-[#b04d2e] flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-[#d97757] animate-bounce" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-[#1e2e25] flex items-center space-x-2">
                        <span>Priority Action Needed: {urgentCount} Item{urgentCount > 1 ? 's' : ''} Nearing Expiry Window</span>
                      </div>
                      <div className="text-[11px] text-[#556b5e] font-medium mt-0.5">
                        Items expiring within 2 hours are flagged with visual warning indicators to help prioritize pickup coordination.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          );
        })()}

        {restaurantListings.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-[#d8e2d8]">
            <Utensils className="w-10 h-10 text-[#889b8e] mx-auto mb-3" />
            <h3 className="font-bold text-[#1e2e25] text-sm">No listings posted yet</h3>
            <p className="text-xs text-[#556b5e] mt-1">
              Use the form above to post your first surplus food batch.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurantListings.map((listing, idx) => {
              const matchingClaim = claims.find((c) => c.listingId === listing.id);

              return (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  claim={matchingClaim}
                  role="Restaurant"
                  index={idx}
                  onOpenQr={onOpenQr}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
