import {
  UserProfile,
  Restaurant,
  NGO,
  Listing,
  Claim,
  ImpactStats,
  Role,
} from '../types';
import {
  INITIAL_RESTAURANTS,
  INITIAL_NGOS,
  INITIAL_LISTINGS,
  INITIAL_CLAIMS,
} from '../data/seedData';

const STORAGE_KEY_USER = 'foodflow_user_profile';
const STORAGE_KEY_LISTINGS = 'foodflow_listings';
const STORAGE_KEY_CLAIMS = 'foodflow_claims';
const STORAGE_KEY_RESTAURANTS = 'foodflow_restaurants';
const STORAGE_KEY_NGOS = 'foodflow_ngos';

// Helper to calculate Match Score for a listing given an NGO's reliability score
export function calculateMatchScore(
  expiryTimeIso: string,
  ngoReliabilityScore: number = 80
): { matchScore: number; urgencyScore: number; capacityScore: number; reliabilityScore: number } {
  const expiryDate = new Date(expiryTimeIso).getTime();
  const now = Date.now();
  const diffHours = (expiryDate - now) / (1000 * 60 * 60);

  let urgencyScore = 5;
  if (diffHours <= 2) {
    urgencyScore = 40;
  } else if (diffHours <= 4) {
    urgencyScore = 35;
  } else if (diffHours <= 6) {
    urgencyScore = 30;
  } else if (diffHours <= 12) {
    urgencyScore = 20;
  } else if (diffHours <= 24) {
    urgencyScore = 10;
  }

  const capacityScore = 30; // Fixed 30 points
  const reliabilityScore = Math.round((ngoReliabilityScore / 100) * 30); // Max 30 points

  const total = Math.min(100, Math.max(0, urgencyScore + capacityScore + reliabilityScore));

  return {
    matchScore: total,
    urgencyScore,
    capacityScore,
    reliabilityScore,
  };
}

// Local storage helpers
export function loadStoredData() {
  const storedUser = localStorage.getItem(STORAGE_KEY_USER);
  const storedListings = localStorage.getItem(STORAGE_KEY_LISTINGS);
  const storedClaims = localStorage.getItem(STORAGE_KEY_CLAIMS);
  const storedRestaurants = localStorage.getItem(STORAGE_KEY_RESTAURANTS);
  const storedNgos = localStorage.getItem(STORAGE_KEY_NGOS);

  // If storedListings has fewer items than initial seed data, default to initial seed data to ensure fresh rich data
  let listings = storedListings ? (JSON.parse(storedListings) as Listing[]) : INITIAL_LISTINGS;
  if (listings.length < INITIAL_LISTINGS.length) {
    listings = INITIAL_LISTINGS;
  }

  let claims = storedClaims ? (JSON.parse(storedClaims) as Claim[]) : INITIAL_CLAIMS;
  if (claims.length < INITIAL_CLAIMS.length) {
    claims = INITIAL_CLAIMS;
  }

  return {
    currentUser: storedUser ? (JSON.parse(storedUser) as UserProfile) : null,
    listings,
    claims,
    restaurants: storedRestaurants ? (JSON.parse(storedRestaurants) as Restaurant[]) : INITIAL_RESTAURANTS,
    ngos: storedNgos ? (JSON.parse(storedNgos) as NGO[]) : INITIAL_NGOS,
  };
}

export function resetToSeedData() {
  localStorage.removeItem(STORAGE_KEY_LISTINGS);
  localStorage.removeItem(STORAGE_KEY_CLAIMS);
  localStorage.removeItem(STORAGE_KEY_RESTAURANTS);
  localStorage.removeItem(STORAGE_KEY_NGOS);
  return {
    listings: INITIAL_LISTINGS,
    claims: INITIAL_CLAIMS,
    restaurants: INITIAL_RESTAURANTS,
    ngos: INITIAL_NGOS,
  };
}

export function saveUserToStorage(user: UserProfile | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY_USER);
  }
}

export function saveListingsToStorage(listings: Listing[]) {
  localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(listings));
}

export function saveClaimsToStorage(claims: Claim[]) {
  localStorage.setItem(STORAGE_KEY_CLAIMS, JSON.stringify(claims));
}

export function saveRestaurantsToStorage(restaurants: Restaurant[]) {
  localStorage.setItem(STORAGE_KEY_RESTAURANTS, JSON.stringify(restaurants));
}

export function saveNgosToStorage(ngos: NGO[]) {
  localStorage.setItem(STORAGE_KEY_NGOS, JSON.stringify(ngos));
}

// Compute impact stats for restaurant or NGO
export function calculateRestaurantImpact(
  restaurantId: string,
  listings: Listing[]
): ImpactStats {
  const myDoneListings = listings.filter(
    (l) => l.restaurantId === restaurantId && l.status === 'picked_up'
  );
  const myActiveListings = listings.filter(
    (l) => l.restaurantId === restaurantId && l.status !== 'picked_up'
  );

  const totalQuantity = myDoneListings.reduce((sum, l) => sum + l.quantity, 0);
  const totalMeals = totalQuantity * 10;
  const kgSaved = Math.round(totalQuantity * 0.4 * 10) / 10;
  const co2Avoided = Math.round(kgSaved * 2.5 * 10) / 10;

  return {
    totalMeals,
    kgSaved,
    co2Avoided,
    activeListingsCount: myActiveListings.length,
    completedListingsCount: myDoneListings.length,
  };
}

export function calculateNgoImpact(ngoId: string, listings: Listing[], claims: Claim[]): ImpactStats {
  const ngoClaimListingIds = claims
    .filter((c) => c.ngoId === ngoId && c.status === 'picked_up')
    .map((c) => c.listingId);

  const myDoneListings = listings.filter((l) => ngoClaimListingIds.includes(l.id));
  const myActiveClaims = claims.filter((c) => c.ngoId === ngoId && c.status === 'claimed');

  const totalQuantity = myDoneListings.reduce((sum, l) => sum + l.quantity, 0);
  const totalMeals = totalQuantity * 10;
  const kgSaved = Math.round(totalQuantity * 0.4 * 10) / 10;
  const co2Avoided = Math.round(kgSaved * 2.5 * 10) / 10;

  return {
    totalMeals,
    kgSaved,
    co2Avoided,
    activeListingsCount: myActiveClaims.length,
    completedListingsCount: myDoneListings.length,
  };
}
