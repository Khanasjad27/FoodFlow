import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Listing, Claim } from '../types';
import { X, QrCode, Building, HeartHandshake, MapPin, Mail, ShieldCheck } from 'lucide-react';

interface QrModalProps {
  isOpen: boolean;
  listing: Listing | null;
  claim: Claim | null;
  onClose: () => void;
}

export const QrModal: React.FC<QrModalProps> = ({ isOpen, listing, claim, onClose }) => {
  if (!isOpen || !listing || !claim) return null;

  const qrPayload = JSON.stringify({
    claimId: claim.id,
    listingId: listing.id,
    foodType: listing.foodType,
    quantity: listing.quantity,
    restaurant: listing.restaurantName,
    ngo: claim.ngoName,
    status: claim.status,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e2e25]/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#d8e2d8] relative text-center space-y-5 animate-in fade-in zoom-in-95 duration-200 text-[#1e2e25]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="group absolute top-4 right-4 text-[#889b8e] hover:text-[#1e2e25] p-1.5 rounded-lg hover:bg-[#f0f4f1] transition-all"
          id="btn-close-qr-modal"
        >
          <X className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#e8f1ec] text-[#245237] text-xs font-bold border border-[#c3dccf] shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3e7053] animate-pulse" />
            <span>Verified Pickup Badge</span>
          </div>
          <h3 className="text-xl font-extrabold text-[#1e2e25]">Pickup Verification QR</h3>
          <p className="text-xs text-[#556b5e]">Scan at location to confirm transfer of surplus food</p>
        </div>

        {/* QR Code Canvas */}
        <div className="bg-white p-5 rounded-2xl border border-[#d8e2d8] inline-block shadow-xs">
          <QRCodeSVG
            value={qrPayload}
            size={180}
            level="H"
            marginSize={2}
            bgColor="#ffffff"
            fgColor="#1e2e25"
          />
        </div>

        {/* Claim Info Card */}
        <div className="text-left bg-[#f8faf8] p-4 rounded-xl border border-[#e2e9e2] space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-[#e2e9e2] pb-2">
            <span className="text-[#556b5e]">Claim ID:</span>
            <span className="font-mono font-bold text-[#1e2e25] text-[11px]">{claim.id.slice(0, 18)}...</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#556b5e]">Food Item:</span>
            <span className="font-bold text-[#1e2e25]">{listing.foodType} ({listing.quantity} Servings)</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#556b5e]">Restaurant:</span>
            <span className="font-bold text-[#2d5e43]">{listing.restaurantName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#556b5e]">NGO Partner:</span>
            <span className="font-bold text-[#b04d2e]">{claim.ngoName}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#3e7053] hover:bg-[#325b43] text-white font-bold text-xs transition-colors shadow-2xs"
          id="btn-done-qr"
        >
          Done
        </button>
      </div>
    </div>
  );
};
