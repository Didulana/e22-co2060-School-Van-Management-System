import axios from "axios";

interface CacheEntry {
  city: string;
  timestamp: number;
}

// In-memory cache for reverse geocoded coordinates (~100m grid precision)
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache

/**
 * Calculates Euclidean distance squared between two coordinates.
 */
function getDistanceSq(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = lat1 - lat2;
  const dLon = lon1 - lon2;
  return dLat * dLat + dLon * dLon;
}

/**
 * Reverse geocodes latitude and longitude into a human-readable city/town name.
 * Uses Nominatim with in-memory caching and fallback to nearest route stop.
 */
export async function getCityFromCoordinates(
  latitude: number,
  longitude: number,
  routeStops: Array<{ name: string; latitude: number; longitude: number }> = []
): Promise<string> {
  if (latitude === undefined || longitude === undefined || isNaN(latitude) || isNaN(longitude)) {
    return "Unknown Location";
  }

  // Create cache key based on 3 decimal places (~110 meters)
  const cacheKey = `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);

  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.city;
  }

  // Fallback function using route stops
  const getNearestStopCity = (): string => {
    if (routeStops.length > 0) {
      let nearestStop = routeStops[0];
      let minDistance = getDistanceSq(latitude, longitude, Number(nearestStop.latitude), Number(nearestStop.longitude));

      for (let i = 1; i < routeStops.length; i++) {
        const stop = routeStops[i];
        const dist = getDistanceSq(latitude, longitude, Number(stop.latitude), Number(stop.longitude));
        if (dist < minDistance) {
          minDistance = dist;
          nearestStop = stop;
        }
      }
      return `Near ${nearestStop.name}`;
    }
    return "En Route";
  };

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const response = await axios.get(url, {
      timeout: 2500,
      headers: {
        "User-Agent": "SchoolVanManagementSystem/1.0 (schoolvan-app)"
      }
    });

    const address = response.data?.address;
    if (address) {
      const city =
        address.city ||
        address.town ||
        address.suburb ||
        address.village ||
        address.municipality ||
        address.county ||
        address.city_district ||
        address.state_district;

      if (city) {
        cache.set(cacheKey, { city, timestamp: now });
        return city;
      }
    }
  } catch (error) {
    // Fail silently and use nearest stop fallback
  }

  const fallbackCity = getNearestStopCity();
  cache.set(cacheKey, { city: fallbackCity, timestamp: now });
  return fallbackCity;
}
