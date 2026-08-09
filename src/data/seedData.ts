import { Restaurant, NGO, Listing, Claim } from '../types';

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Green Leaf Bistro',
    email: 'bistro@greenleaf.com',
    location: '124 Market St, Downtown',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    name: 'Harvest Table Cafe',
    email: 'contact@harvesttable.org',
    location: '580 Grand Ave, West End',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    name: 'Fresh Choice Deli',
    email: 'hello@freshchoicedeli.com',
    location: '89 Oak Street, Midtown',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    name: 'Artisan Bakery Royale',
    email: 'pastry@bakeryroyale.com',
    location: '312 Pine Plaza, East District',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a5555555-5555-5555-5555-555555555555',
    name: 'Urban Kitchen Express',
    email: 'info@urbankitchen.com',
    location: '705 University Ave, Northside',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_NGOS: NGO[] = [
  {
    id: 'b1111111-1111-1111-1111-111111111111',
    name: 'Hope Food Bank',
    email: 'contact@hopefoodbank.org',
    location: '45 Community Way, Sector 4',
    reliabilityScore: 92,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    name: 'Community Table Network',
    email: 'info@communitytable.org',
    location: '110 Shelter Boulevard',
    reliabilityScore: 88,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b3333333-3333-3333-3333-333333333333',
    name: 'Shelter Services Coalition',
    email: 'support@shelterservices.org',
    location: '302 Mission Street',
    reliabilityScore: 85,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b4444444-4444-4444-4444-444444444444',
    name: 'Meals for All Foundation',
    email: 'hello@mealsforall.org',
    location: '90 Care Drive, Southside',
    reliabilityScore: 95,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b5555555-5555-5555-5555-555555555555',
    name: 'City Rescue Mission',
    email: 'dispatch@cityrescuemission.org',
    location: '512 Harbor View Road',
    reliabilityScore: 80,
    createdAt: new Date().toISOString(),
  },
];

// Generate ISO string offset helper
function getOffsetHoursIso(hoursOffset: number): string {
  const d = new Date();
  d.setHours(d.getHours() + hoursOffset);
  return d.toISOString();
}

export const INITIAL_LISTINGS: Listing[] = [
  // Green Leaf Bistro (Restaurant Sample #1)
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    restaurantId: 'a1111111-1111-1111-1111-111111111111',
    restaurantName: 'Green Leaf Bistro',
    restaurantEmail: 'bistro@greenleaf.com',
    restaurantLocation: '124 Market St, Downtown',
    foodType: 'Prepared Meals',
    quantity: 45,
    expiryTime: getOffsetHoursIso(3),
    pickupLocation: '124 Market St (Back Entrance Loading Bay)',
    status: 'pending',
    createdAt: getOffsetHoursIso(-1),
  },
  {
    id: 'c1111111-2222-2222-2222-222222222222',
    restaurantId: 'a1111111-1111-1111-1111-111111111111',
    restaurantName: 'Green Leaf Bistro',
    restaurantEmail: 'bistro@greenleaf.com',
    restaurantLocation: '124 Market St, Downtown',
    foodType: 'Soups & Stews',
    quantity: 30,
    expiryTime: getOffsetHoursIso(5),
    pickupLocation: '124 Market St (Kitchen Door)',
    status: 'pending',
    createdAt: getOffsetHoursIso(-0.5),
  },
  {
    id: 'c1111111-3333-3333-3333-333333333333',
    restaurantId: 'a1111111-1111-1111-1111-111111111111',
    restaurantName: 'Green Leaf Bistro',
    restaurantEmail: 'bistro@greenleaf.com',
    restaurantLocation: '124 Market St, Downtown',
    foodType: 'Sandwiches & Salads',
    quantity: 35,
    expiryTime: getOffsetHoursIso(2),
    pickupLocation: '124 Market St (Side Dock)',
    status: 'claimed',
    createdAt: getOffsetHoursIso(-2),
  },
  {
    id: 'c1111111-4444-4444-4444-444444444444',
    restaurantId: 'a1111111-1111-1111-1111-111111111111',
    restaurantName: 'Green Leaf Bistro',
    restaurantEmail: 'bistro@greenleaf.com',
    restaurantLocation: '124 Market St, Downtown',
    foodType: 'Bakery & Bread',
    quantity: 50,
    expiryTime: getOffsetHoursIso(-4),
    pickupLocation: '124 Market St',
    status: 'picked_up',
    createdAt: getOffsetHoursIso(-12),
  },

  // Harvest Table Cafe (Restaurant Sample #2)
  {
    id: 'c2222222-1111-1111-1111-111111111111',
    restaurantId: 'a2222222-2222-2222-2222-222222222222',
    restaurantName: 'Harvest Table Cafe',
    restaurantEmail: 'contact@harvesttable.org',
    restaurantLocation: '580 Grand Ave, West End',
    foodType: 'Prepared Meals',
    quantity: 40,
    expiryTime: getOffsetHoursIso(4),
    pickupLocation: '580 Grand Ave (Side Gate)',
    status: 'pending',
    createdAt: getOffsetHoursIso(-1),
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    restaurantId: 'a2222222-2222-2222-2222-222222222222',
    restaurantName: 'Harvest Table Cafe',
    restaurantEmail: 'contact@harvesttable.org',
    restaurantLocation: '580 Grand Ave, West End',
    foodType: 'Dairy & Packaged Goods',
    quantity: 50,
    expiryTime: getOffsetHoursIso(8),
    pickupLocation: '580 Grand Ave (Side Gate)',
    status: 'claimed',
    createdAt: getOffsetHoursIso(-3),
  },
  {
    id: 'c2222222-3333-3333-3333-333333333333',
    restaurantId: 'a2222222-2222-2222-2222-222222222222',
    restaurantName: 'Harvest Table Cafe',
    restaurantEmail: 'contact@harvesttable.org',
    restaurantLocation: '580 Grand Ave, West End',
    foodType: 'Fresh Produce & Fruit',
    quantity: 65,
    expiryTime: getOffsetHoursIso(-6),
    pickupLocation: '580 Grand Ave',
    status: 'picked_up',
    createdAt: getOffsetHoursIso(-18),
  },

  // Artisan Bakery Royale
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    restaurantId: 'a4444444-4444-4444-4444-444444444444',
    restaurantName: 'Artisan Bakery Royale',
    restaurantEmail: 'pastry@bakeryroyale.com',
    restaurantLocation: '312 Pine Plaza, East District',
    foodType: 'Bakery & Bread',
    quantity: 30,
    expiryTime: getOffsetHoursIso(6),
    pickupLocation: '312 Pine Plaza (Front Counter)',
    status: 'pending',
    createdAt: getOffsetHoursIso(-2),
  },

  // Fresh Choice Deli
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    restaurantId: 'a3333333-3333-3333-3333-333333333333',
    restaurantName: 'Fresh Choice Deli',
    restaurantEmail: 'hello@freshchoicedeli.com',
    restaurantLocation: '89 Oak Street, Midtown',
    foodType: 'Sandwiches & Salads',
    quantity: 20,
    expiryTime: getOffsetHoursIso(4),
    pickupLocation: '89 Oak Street (Kitchen Alley Door)',
    status: 'pending',
    createdAt: getOffsetHoursIso(-1.5),
  },

  // Urban Kitchen Express
  {
    id: 'c5555555-5555-5555-5555-555555555555',
    restaurantId: 'a5555555-5555-5555-5555-555555555555',
    restaurantName: 'Urban Kitchen Express',
    restaurantEmail: 'info@urbankitchen.com',
    restaurantLocation: '705 University Ave, Northside',
    foodType: 'Fresh Produce & Fruit',
    quantity: 60,
    expiryTime: getOffsetHoursIso(-2),
    pickupLocation: '705 University Ave',
    status: 'picked_up',
    createdAt: getOffsetHoursIso(-10),
  },
];

export const INITIAL_CLAIMS: Claim[] = [
  // Hope Food Bank Claims
  {
    id: 'd1111111-3333-3333-3333-333333333333',
    listingId: 'c1111111-3333-3333-3333-333333333333', // Green Leaf Bistro Sandwiches
    ngoId: 'b1111111-1111-1111-1111-111111111111',
    ngoName: 'Hope Food Bank',
    ngoEmail: 'contact@hopefoodbank.org',
    ngoLocation: '45 Community Way, Sector 4',
    status: 'claimed',
    claimedAt: getOffsetHoursIso(-0.5),
    pickedUpAt: null,
  },
  {
    id: 'd4444444-4444-4444-4444-444444444444',
    listingId: 'c4444444-4444-4444-4444-444444444444', // Harvest Table Cafe Dairy
    ngoId: 'b1111111-1111-1111-1111-111111111111',
    ngoName: 'Hope Food Bank',
    ngoEmail: 'contact@hopefoodbank.org',
    ngoLocation: '45 Community Way, Sector 4',
    status: 'claimed',
    claimedAt: getOffsetHoursIso(-1),
    pickedUpAt: null,
  },
  {
    id: 'd1111111-4444-4444-4444-444444444444',
    listingId: 'c1111111-4444-4444-4444-444444444444', // Green Leaf Bistro Bakery
    ngoId: 'b1111111-1111-1111-1111-111111111111',
    ngoName: 'Hope Food Bank',
    ngoEmail: 'contact@hopefoodbank.org',
    ngoLocation: '45 Community Way, Sector 4',
    status: 'picked_up',
    claimedAt: getOffsetHoursIso(-10),
    pickedUpAt: getOffsetHoursIso(-4),
  },

  // Meals for All Foundation Claims
  {
    id: 'd5555555-5555-5555-5555-555555555555',
    listingId: 'c5555555-5555-5555-5555-555555555555',
    ngoId: 'b4444444-4444-4444-4444-444444444444',
    ngoName: 'Meals for All Foundation',
    ngoEmail: 'hello@mealsforall.org',
    ngoLocation: '90 Care Drive, Southside',
    status: 'picked_up',
    claimedAt: getOffsetHoursIso(-8),
    pickedUpAt: getOffsetHoursIso(-2),
  },

  // Community Table Network Claims
  {
    id: 'd2222222-3333-3333-3333-333333333333',
    listingId: 'c2222222-3333-3333-3333-333333333333',
    ngoId: 'b2222222-2222-2222-2222-222222222222',
    ngoName: 'Community Table Network',
    ngoEmail: 'info@communitytable.org',
    ngoLocation: '110 Shelter Boulevard',
    status: 'picked_up',
    claimedAt: getOffsetHoursIso(-16),
    pickedUpAt: getOffsetHoursIso(-6),
  },
];
