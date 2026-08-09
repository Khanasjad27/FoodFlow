import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Listing, Claim } from '../types';
import { useLanguage } from '../lib/i18n';
import {
  Zap,
  Clock,
  MapPin,
  HeartHandshake,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Thermometer,
  QrCode,
  Building,
  CheckCircle2,
  AlertCircle,
  Flame,
  Leaf,
  Info,
} from 'lucide-react';

interface ListingCardProps {
  listing: Listing & {
    matchScore?: number;
    urgencyScore?: number;
    capacityScore?: number;
    reliabilityScore?: number;
    distanceKm?: number;
  };
  claim?: Claim;
  role: 'NGO' | 'Restaurant';
  index?: number;
  onClaimListing?: (listingId: string) => void;
  onConfirmPickup?: (listingId: string) => void;
  onOpenQr?: (listing: Listing, claim: Claim) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  claim,
  role,
  index = 0,
  onClaimListing,
  onConfirmPickup,
  onOpenQr,
}) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  // Expiry calculation
  const getExpiryDetails = () => {
    if (listing.status === 'picked_up') return null;
    const expiry = new Date(listing.expiryTime).getTime();
    const now = Date.now();
    const diffMs = expiry - now;
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;

    if (diffMinutes <= 0) {
      return {
        isExpired: true,
        isUrgent: true,
        label: 'Expired Window',
        detailText: 'Passed pickup deadline',
        badgeClass: 'bg-red-50 text-red-700 border-red-200 ring-2 ring-red-400/20',
      };
    } else if (diffMinutes <= 120) {
      return {
        isExpired: false,
        isUrgent: true,
        label: `Expiring Soon (${diffMinutes < 60 ? `${diffMinutes}m left` : `${diffHours}h left`})`,
        detailText: 'High Priority Pickup',
        badgeClass: 'bg-[#fdf3ee] text-[#b04d2e] border-2 border-[#d97757] ring-2 ring-[#d97757]/20 font-extrabold',
      };
    } else if (diffMinutes <= 240) {
      return {
        isExpired: false,
        isUrgent: false,
        isWarning: true,
        label: `Expires in ${diffHours}h`,
        detailText: 'Pickup window active',
        badgeClass: 'bg-amber-50 text-amber-800 border border-amber-200 font-bold',
      };
    }
    return null;
  };

  const expiryInfo = getExpiryDetails();

  // ESG estimated metrics for this single listing
  const estimatedKg = Math.round(listing.quantity * 0.4 * 10) / 10;
  const estimatedCo2 = Math.round(listing.quantity * 0.9 * 10) / 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: Math.min(index * 0.05, 0.3) }}
      className={`group/card bg-white rounded-2xl p-5 border shadow-2xs flex flex-col justify-between space-y-4 hover:border-[#3e7053]/40 hover:shadow-md transition-all relative overflow-hidden ${
        expiryInfo?.isUrgent
          ? 'border-[#d97757] ring-2 ring-[#d97757]/20'
          : 'border-[#d8e2d8]'
      }`}
    >
      {/* Visual Urgency Banner */}
      {expiryInfo && (
        <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${expiryInfo.badgeClass}`}>
          <div className="flex items-center space-x-1.5 font-bold">
            <Flame className={`w-4 h-4 ${expiryInfo.isUrgent ? 'text-[#d97757] animate-bounce' : 'text-amber-600'}`} />
            <span>{expiryInfo.label}</span>
          </div>
          <span className="text-[10px] font-medium opacity-90">{expiryInfo.detailText}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-start justify-between border-b border-[#e2e9e2] pb-3">
        <div>
          <span className="font-bold text-base text-[#1e2e25] block">{listing.foodType}</span>
          <span className="text-xs text-[#2d5e43] font-semibold flex items-center space-x-1 mt-0.5">
            <Building className="w-3 h-3 text-[#3e7053]" />
            <span>{listing.restaurantName}</span>
          </span>
        </div>

        {/* Role Specific Status or Match Pill */}
        <div className="flex flex-col items-end">
          {role === 'NGO' && listing.status === 'pending' && listing.matchScore !== undefined && (
            <span className="bg-[#3e7053] text-white font-black text-xs px-2.5 py-1 rounded-full shadow-2xs flex items-center space-x-1 group-hover/card:scale-105 transition-transform">
              <Zap className="w-3 h-3 text-[#ffdd85] fill-[#ffdd85] animate-pulse" />
              <span>{listing.matchScore}% Match</span>
            </span>
          )}

          {listing.status !== 'pending' && (
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-2xs ${
                listing.status === 'claimed'
                  ? 'bg-[#ebf3f7] text-[#224859] border border-[#c5ddf0]'
                  : 'bg-[#e8f1ec] text-[#245237] border border-[#c3dccf]'
              }`}
            >
              {listing.status === 'claimed' && <AlertCircle className="w-3.5 h-3.5 mr-1 text-[#3a6578] animate-pulse" />}
              {listing.status === 'picked_up' && <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#3e7053]" />}
              <span>{listing.status.replace('_', ' ')}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Attributes */}
      <div className="space-y-2 text-xs text-[#556b5e]">
        <div className="flex items-center justify-between bg-[#f8faf8] p-2.5 rounded-xl font-semibold border border-[#e2e9e2]">
          <span>Quantity:</span>
          <span className="text-[#1e2e25] font-black text-sm">{listing.quantity} Servings</span>
        </div>

        <div className="flex items-center space-x-2 text-[#556b5e]">
          <Clock className="w-3.5 h-3.5 text-[#d97757] flex-shrink-0" />
          <span>
            Expiry: <strong className="text-[#1e2e25]">{new Date(listing.expiryTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</strong>
          </span>
        </div>

        <div className="flex items-center space-x-2 text-[#556b5e]">
          <MapPin className="w-3.5 h-3.5 text-[#889b8e] flex-shrink-0" />
          <span className="truncate">{listing.pickupLocation}</span>
          {listing.distanceKm !== undefined && (
            <span className="bg-[#e8f1ec] text-[#245237] text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border border-[#c3dccf] flex-shrink-0">
              {listing.distanceKm} km
            </span>
          )}
        </div>
      </div>

      {/* Score Breakdown Pills if available */}
      {role === 'NGO' && listing.status === 'pending' && listing.urgencyScore !== undefined && (
        <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center bg-[#f8faf8] p-2 rounded-xl border border-[#e2e9e2]">
          <div>
            <div className="font-bold text-[#d97757]">{listing.urgencyScore}/40</div>
            <div className="text-[#556b5e]">Urgency</div>
          </div>
          <div className="border-x border-[#e2e9e2]">
            <div className="font-bold text-[#3e7053]">{listing.capacityScore}/30</div>
            <div className="text-[#556b5e]">Capacity</div>
          </div>
          <div>
            <div className="font-bold text-[#3a6578]">{listing.reliabilityScore}/30</div>
            <div className="text-[#556b5e]">Reliability</div>
          </div>
        </div>
      )}

      {/* Expandable Toggle Control */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-[11px] font-bold text-[#3e7053] hover:text-[#245237] flex items-center justify-center space-x-1 py-1.5 bg-[#f0f4f1] hover:bg-[#e2e9e2] rounded-xl transition-all border border-[#d2dfd5]"
        id={`btn-expand-listing-${listing.id}`}
      >
        <span>{isExpanded ? 'Hide Food Details & Safety' : 'View Food Details & Guidelines'}</span>
        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {/* Smooth Height Transition with Framer Motion */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden space-y-3 pt-2 text-xs border-t border-[#e2e9e2]"
          >
            {/* Address & Specific Pickup Instructions */}
            <div className="bg-[#f8faf8] p-3 rounded-xl border border-[#e2e9e2] space-y-1">
              <div className="font-extrabold text-[#1e2e25] flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#3e7053]" />
                <span>Pickup Address & Instructions</span>
              </div>
              <p className="text-[11px] text-[#556b5e] leading-snug">{listing.pickupLocation}</p>
            </div>

            {/* Food Safety & Handling Guidelines */}
            <div className="bg-[#e8f1ec]/60 p-3 rounded-xl border border-[#c3dccf] space-y-1.5 text-[11px]">
              <div className="font-extrabold text-[#245237] flex items-center space-x-1.5">
                <Thermometer className="w-3.5 h-3.5 text-[#3e7053]" />
                <span>Food Safety & Prep Standards</span>
              </div>
              <ul className="space-y-1 text-[#2d5e43] list-disc list-inside">
                <li>Hot foods kept &gt; 140°F (60°C) • Cold &lt; 40°F (4°C)</li>
                <li>Packaged in wholesome, food-grade containers</li>
                <li>Prepared in clean commercial facility</li>
              </ul>
            </div>

            {/* ESG Impact Projection */}
            <div className="bg-[#fdf3ee] p-2.5 rounded-xl border border-[#f5d5c8] flex items-center justify-between text-[11px] text-[#b04d2e]">
              <div className="flex items-center space-x-1.5 font-bold">
                <Leaf className="w-3.5 h-3.5 text-[#d97757]" />
                <span>Estimated ESG Impact</span>
              </div>
              <div className="space-x-2 font-black">
                <span>~{estimatedKg} kg rescued</span>
                <span>• ~{estimatedCo2} kg CO₂</span>
              </div>
            </div>

            {/* NGO Claimed Details if claimed */}
            {claim && (
              <div className="bg-[#ebf3f7] p-3 rounded-xl border border-[#c5ddf0] text-[11px] space-y-1 text-[#224859]">
                <div className="font-extrabold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3a6578]" />
                  <span>Claimed by: {claim.ngoName}</span>
                </div>
                <div className="text-[10px]">Claim Date: {new Date(claim.claimedAt).toLocaleString()}</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="pt-1">
        {role === 'NGO' && listing.status === 'pending' && onClaimListing && (
          <button
            onClick={() => onClaimListing(listing.id)}
            className="group/btn w-full py-3 px-4 rounded-xl bg-[#d97757] hover:bg-[#c66848] text-white font-bold text-xs shadow-2xs hover:shadow-xs transition-all duration-300 flex items-center justify-center space-x-2"
            id={`btn-claim-${listing.id}`}
          >
            <HeartHandshake className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-125 group-hover/btn:-rotate-12" />
            <span>{t('dashboard.claimListing', 'Claim Listing')}</span>
          </button>
        )}

        {role === 'NGO' && listing.status === 'claimed' && claim && (
          <div className="grid grid-cols-2 gap-2">
            {onOpenQr && (
              <button
                onClick={() => onOpenQr(listing, claim)}
                className="py-2.5 px-3 rounded-xl bg-[#1e2e25] hover:bg-[#2d4235] text-white font-bold text-xs shadow-2xs transition-colors flex items-center justify-center space-x-1.5"
                id={`btn-qr-${listing.id}`}
              >
                <QrCode className="w-4 h-4 text-[#a8d3b8]" />
                <span>{t('dashboard.showQr', 'QR Code')}</span>
              </button>
            )}
            {onConfirmPickup && (
              <button
                onClick={() => onConfirmPickup(listing.id)}
                className="py-2.5 px-3 rounded-xl bg-[#3e7053] hover:bg-[#325b43] text-white font-bold text-xs shadow-2xs transition-colors flex items-center justify-center space-x-1.5"
                id={`btn-confirm-${listing.id}`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('dashboard.confirmPickup', 'Confirm Pickup')}</span>
              </button>
            )}
          </div>
        )}

        {role === 'Restaurant' && listing.status === 'claimed' && claim && onOpenQr && (
          <button
            onClick={() => onOpenQr(listing, claim)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1e2e25] hover:bg-[#2d4235] text-white font-bold text-xs shadow-2xs transition-colors flex items-center justify-center space-x-2"
            id={`btn-restaurant-qr-${listing.id}`}
          >
            <QrCode className="w-4 h-4 text-[#a8d3b8]" />
            <span>Verify Pickup Code ({claim.pickupCode})</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
