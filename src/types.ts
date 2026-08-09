export type Role = 'Restaurant' | 'NGO';

export interface UserProfile {
  id: string;
  userId?: string;
  name: string;
  email: string;
  role: Role;
  location: string;
  reliabilityScore?: number; // for NGOs (0 - 100)
  createdAt: string;
}

export interface Restaurant {
  id: string;
  userId?: string;
  name: string;
  email: string;
  location: string;
  createdAt: string;
}

export interface NGO {
  id: string;
  userId?: string;
  name: string;
  email: string;
  location: string;
  reliabilityScore: number;
  createdAt: string;
}

export type ListingStatus = 'pending' | 'claimed' | 'picked_up';

export interface Listing {
  id: string;
  restaurantId: string;
  restaurantName?: string;
  restaurantEmail?: string;
  restaurantLocation?: string;
  foodType: string;
  quantity: number; // e.g. number of meal portions
  expiryTime: string; // ISO date string
  pickupLocation: string;
  status: ListingStatus;
  createdAt: string;
  // Computed property for UI matching
  matchScore?: number;
  urgencyScore?: number;
  capacityScore?: number;
  reliabilityScore?: number;
}

export interface Claim {
  id: string;
  listingId: string;
  ngoId: string;
  ngoName?: string;
  ngoEmail?: string;
  ngoLocation?: string;
  status: 'claimed' | 'picked_up';
  claimedAt: string;
  pickedUpAt?: string | null;
}

export interface ImpactStats {
  totalMeals: number;
  kgSaved: number;
  co2Avoided: number;
  activeListingsCount: number;
  completedListingsCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
