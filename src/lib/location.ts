// Helper utility to handle user geolocation and reverse geocoding

export interface UserLocation {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  detectedAt: string;
}

const LOCATION_STORAGE_KEY = 'foodflow_current_user_location';

export async function detectCurrentLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      const fallback: UserLocation = {
        latitude: 37.7749,
        longitude: -122.4194,
        address: 'Downtown Hub',
        city: 'San Francisco',
        detectedAt: new Date().toISOString(),
      };
      saveUserLocationToStorage(fallback);
      resolve(fallback);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        let address = `Current Location (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
        let city = 'Local Area';

        try {
          // Attempt reverse geocoding via OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`,
            { headers: { 'User-Agent': 'FoodFlowApp/1.0' } }
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.address) {
              const road = data.address.road || data.address.suburb || data.address.neighbourhood || '';
              const cityVal = data.address.city || data.address.town || data.address.village || data.address.county || '';
              const state = data.address.state || '';
              
              if (cityVal) city = cityVal;
              if (road && cityVal) {
                address = `${road}, ${cityVal}`;
              } else if (data.display_name) {
                address = data.display_name.split(',').slice(0, 3).join(',');
              }
            }
          }
        } catch (e) {
          console.warn('Reverse geocode lookup failed, using lat/lng string:', e);
        }

        const locationData: UserLocation = {
          latitude: lat,
          longitude: lng,
          address,
          city,
          detectedAt: new Date().toISOString(),
        };

        saveUserLocationToStorage(locationData);
        resolve(locationData);
      },
      (error) => {
        console.warn('Geolocation denied or failed, using fallback:', error.message);
        const fallback: UserLocation = {
          latitude: 37.7749,
          longitude: -122.4194,
          address: 'Downtown Hub',
          city: 'San Francisco',
          detectedAt: new Date().toISOString(),
        };
        saveUserLocationToStorage(fallback);
        resolve(fallback);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  });
}

export function getStoredUserLocation(): UserLocation | null {
  const data = localStorage.getItem(LOCATION_STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as UserLocation;
  } catch {
    return null;
  }
}

export function saveUserLocationToStorage(loc: UserLocation) {
  localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(loc));
}

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of earth in km
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

