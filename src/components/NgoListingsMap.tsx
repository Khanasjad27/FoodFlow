import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { Listing } from '../types';
import { detectCurrentLocation, getStoredUserLocation } from '../lib/location';
import {
  MapPin,
  Navigation,
  Utensils,
  Clock,
  Sparkles,
  ShieldCheck,
  Compass,
  Filter,
  CheckCircle2,
} from 'lucide-react';

interface NgoListingsMapProps {
  listings: Listing[];
  ngoLocation?: string;
  onClaimListing?: (listingId: string) => void;
  selectedListingId?: string | null;
  onSelectListing?: (listingId: string) => void;
}

// Coordinate mapping helper for locations in seed data & dynamic addresses
const LOCATION_COORDINATES: Record<string, [number, number]> = {
  '124 Market St, Downtown': [37.7895, -122.4014],
  '580 Grand Ave, West End': [37.7833, -122.428],
  '89 Oak Street, Midtown': [37.7695, -122.41],
  '312 Pine Plaza, East District': [37.791, -122.395],
  '705 University Ave, Northside': [37.798, -122.418],
  '45 Community Way, Sector 4': [37.77, -122.43],
  '110 Shelter Boulevard': [37.78, -122.412],
};

// Generates deterministic lat/lng from location string relative to base coordinates
function getCoordinatesForLocation(locationStr: string, index: number, baseCoords: [number, number]): [number, number] {
  if (LOCATION_COORDINATES[locationStr]) {
    return LOCATION_COORDINATES[locationStr];
  }

  // Hash the string deterministically around the user's current detected base location
  let hash = 0;
  for (let i = 0; i < locationStr.length; i++) {
    hash = locationStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const latOffset = ((hash % 100) / 2500) + (index * 0.003);
  const lngOffset = (((hash >> 2) % 100) / 2500) - (index * 0.002);

  return [baseCoords[0] + latOffset, baseCoords[1] + lngOffset];
}

// Calculate distance in km between two lat/lng points (Haversine formula)
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const NgoListingsMap: React.FC<NgoListingsMapProps> = ({
  listings,
  ngoLocation = 'NGO Headquarters',
  onClaimListing,
  selectedListingId,
  onSelectListing,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Default location: San Francisco Community Hub
  // Default location from cache or SF
  const initialLoc = getStoredUserLocation();
  const [userCoords, setUserCoords] = useState<[number, number]>(
    initialLoc ? [initialLoc.latitude, initialLoc.longitude] : [37.7749, -122.4194]
  );
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [maxDistanceFilter, setMaxDistanceFilter] = useState<number>(10); // in km (10km default)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Get user geolocation on initial load
  useEffect(() => {
    detectCurrentLocation().then((loc) => {
      setUserCoords([loc.latitude, loc.longitude]);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([loc.latitude, loc.longitude], 13);
      }
    });
  }, []);

  // Compute listings with distance and coordinates
  const listingsWithCoords = useMemo(() => {
    return listings.map((l, index) => {
      const coords = getCoordinatesForLocation(l.pickupLocation, index, userCoords);
      const dist = calculateDistanceKm(userCoords[0], userCoords[1], coords[0], coords[1]);
      return {
        ...l,
        coords,
        distanceKm: dist,
      };
    });
  }, [listings, userCoords]);

  // Filter listings by max distance
  const filteredListings = useMemo(() => {
    return listingsWithCoords.filter((l) => l.distanceKm <= maxDistanceFilter);
  }, [listingsWithCoords, maxDistanceFilter]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center: userCoords,
      zoom: 13,
      zoomControl: false,
    });

    // Add CartoDB Positron clean map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Add zoom control to top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Create layer group for markers
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map markers when listings or user position change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // 1. Add User / NGO Headquarters Marker with pulsing accuracy radius
    const userMarkerIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3e7053] opacity-40"></span>
          <div class="relative w-7 h-7 rounded-full bg-[#3e7053] border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-xs">
            🏠
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const userMarker = L.marker(userCoords, { icon: userMarkerIcon }).addTo(markersLayer);
    userMarker.bindPopup(`
      <div class="p-1 space-y-1 font-sans text-xs">
        <div class="font-bold text-[#1e2e25] flex items-center space-x-1">
          <span>📍 Your Headquarters Location</span>
        </div>
        <p class="text-[#556b5e] font-medium">${ngoLocation}</p>
        <p class="text-[10px] text-[#3e7053] font-bold">Base for pickup distance estimates</p>
      </div>
    `);

    // Add coverage radius circle
    L.circle(userCoords, {
      radius: maxDistanceFilter * 1000, // in meters
      color: '#3e7053',
      fillColor: '#3e7053',
      fillOpacity: 0.05,
      weight: 1.5,
      dashArray: '4, 6',
    }).addTo(markersLayer);

    // 2. Add Listing Markers
    filteredListings.forEach((item) => {
      const matchScore = item.matchScore ?? 85;
      const isSelected = selectedListingId === item.id;

      // Color scheme based on match score / urgency
      const markerColor =
        matchScore >= 80 ? '#3e7053' : matchScore >= 60 ? '#d97757' : '#3a6578';

      const iconHtml = `
        <div class="group relative flex items-center justify-center">
          <div class="w-9 h-9 rounded-2xl bg-white border-2 shadow-md flex flex-col items-center justify-center transition-all duration-200 transform hover:scale-110 ${
            isSelected ? 'scale-125 border-[#3e7053] ring-4 ring-[#3e7053]/20 z-50' : ''
          }" style="border-color: ${markerColor}">
            <span class="text-xs font-black" style="color: ${markerColor}">
              ${item.quantity}
            </span>
            <span class="text-[8px] font-bold uppercase text-[#556b5e] -mt-1">
              pts
            </span>
          </div>
          ${
            matchScore >= 85
              ? `<span class="absolute -top-1 -right-1 w-3 h-3 bg-[#3e7053] border border-white rounded-full flex items-center justify-center text-[7px] text-white font-black">★</span>`
              : ''
          }
        </div>
      `;

      const listingIcon = L.divIcon({
        className: 'custom-listing-marker',
        html: iconHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker(item.coords, { icon: listingIcon }).addTo(markersLayer);

      // Custom Popup HTML
      const popupContent = document.createElement('div');
      popupContent.className = 'p-2 space-y-2 font-sans max-w-[220px] text-xs';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between border-b border-gray-100 pb-1.5">
          <span class="font-extrabold text-[#1e2e25] text-sm">${item.foodType}</span>
          <span class="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#e8f1ec] text-[#245237]">
            ${matchScore}% Match
          </span>
        </div>
        <div class="space-y-1 text-[#556b5e]">
          <p class="font-semibold text-[#1e2e25]">🏢 ${item.restaurantName || 'Partner Kitchen'}</p>
          <p class="text-[11px]">📍 ${item.pickupLocation} (${item.distanceKm} km away)</p>
          <p class="text-[11px] font-medium text-[#d97757]">⏳ Expires in ${new Date(item.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      `;

      // Add claim button inside popup if pending
      if (item.status === 'pending' && onClaimListing) {
        const claimBtn = document.createElement('button');
        claimBtn.className =
          'w-full mt-2 py-1.5 px-3 rounded-lg bg-[#3e7053] hover:bg-[#325b43] text-white font-bold text-xs transition-colors shadow-2xs flex items-center justify-center space-x-1';
        claimBtn.innerHTML = `<span>Claim ${item.quantity} Portions</span>`;
        claimBtn.onclick = () => {
          onClaimListing(item.id);
          map.closePopup();
        };
        popupContent.appendChild(claimBtn);
      }

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        setSelectedListing(item);
        if (onSelectListing) onSelectListing(item.id);
      });
    });
  }, [filteredListings, userCoords, maxDistanceFilter, selectedListingId, ngoLocation, onClaimListing, onSelectListing]);

  // Center map on user location trigger
  const handleLocateMe = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserCoords(coords);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo(coords, 14, { duration: 1.2 });
          }
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#d8e2d8] shadow-xs space-y-4">
      {/* Top Map Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e2e9e2] pb-4">
        <div className="space-y-0.5">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#3e7053] uppercase tracking-wider">
            <Compass className="w-4 h-4 text-[#3e7053]" />
            <span>Interactive Pickup Radar Map</span>
          </div>
          <h3 className="text-lg font-extrabold text-[#1e2e25] flex items-center gap-2">
            <span>Surplus Food Distribution Map</span>
            <span className="text-xs bg-[#e8f1ec] text-[#245237] px-2 py-0.5 rounded-full border border-[#c3dccf]">
              {filteredListings.length} Nearby Opportunities
            </span>
          </h3>
        </div>

        {/* Map Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Distance Filter */}
          <div className="flex items-center space-x-1.5 bg-[#f0f4f1] p-1 rounded-xl border border-[#d2dfd5] text-xs font-bold text-[#1e2e25]">
            <Filter className="w-3.5 h-3.5 text-[#3e7053] ml-1.5" />
            <span className="text-[11px] text-[#556b5e]">Radius:</span>
            {[3, 5, 10, 25].map((km) => (
              <button
                key={km}
                onClick={() => setMaxDistanceFilter(km)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  maxDistanceFilter === km
                    ? 'bg-[#3e7053] text-white shadow-2xs'
                    : 'text-[#556b5e] hover:text-[#1e2e25]'
                }`}
                id={`btn-radius-${km}km`}
              >
                {km}km
              </button>
            ))}
          </div>

          {/* Locate Me Button */}
          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#e8f1ec] hover:bg-[#d8e8dd] text-[#245237] border border-[#c3dccf] text-xs font-bold transition-all shadow-2xs active:scale-95 disabled:opacity-50"
            id="btn-locate-me"
          >
            <Navigation className={`w-3.5 h-3.5 text-[#3e7053] ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Locate Me'}</span>
          </button>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-[#d8e2d8] shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Quick Summary Legend */}
        <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-[#d8e2d8] shadow-md text-xs space-y-1.5 max-w-[200px]">
          <div className="font-extrabold text-[#1e2e25] flex items-center justify-between border-b border-gray-100 pb-1">
            <span>Map Legend</span>
            <Sparkles className="w-3 h-3 text-[#3e7053]" />
          </div>
          <div className="flex items-center space-x-2 text-[#556b5e]">
            <span className="w-3 h-3 rounded-full bg-[#3e7053] border border-white shadow-2xs inline-block" />
            <span>High Match (&gt;80%)</span>
          </div>
          <div className="flex items-center space-x-2 text-[#556b5e]">
            <span className="w-3 h-3 rounded-full bg-[#d97757] border border-white shadow-2xs inline-block" />
            <span>Moderate Match</span>
          </div>
          <div className="flex items-center space-x-2 text-[#556b5e]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3e7053] inline-block" />
            <span>📍 NGO Headquarters</span>
          </div>
        </div>
      </div>
    </div>
  );
};
