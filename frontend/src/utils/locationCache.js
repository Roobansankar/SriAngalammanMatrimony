import axios from "axios";

const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";

// Cache keys
export const LOCATION_CACHE_KEYS = {
  COUNTRIES: "location_cache_countries",
  STATES: "location_cache_states",
  CITIES: "location_cache_cities",
  VERSION: "location_cache_version",
};

const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours cache expiry

/**
 * Get cached data from localStorage
 * @param {string} key - Cache key
 * @returns {Object|null} - Cached data or null if not found/expired
 */
export const getCachedData = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    
    // Check if cache is expired
    if (Date.now() - timestamp > CACHE_EXPIRY_MS) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Cache read error:", err);
    return null;
  }
};

/**
 * Save data to localStorage cache
 * @param {string} key - Cache key
 * @param {*} data - Data to cache
 */
export const setCachedData = (key, data) => {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheEntry));
  } catch (err) {
    console.error("Cache write error:", err);
    // If localStorage is full, clear old caches
    if (err.name === 'QuotaExceededError') {
      clearLocationCache();
    }
  }
};

/**
 * Invalidate a specific cache key
 * @param {string} key - Cache key to invalidate
 */
export const invalidateCache = (key) => {
  try {
    localStorage.removeItem(key);
    // Update version to notify other components
    const currentVersion = parseInt(localStorage.getItem(LOCATION_CACHE_KEYS.VERSION) || "0", 10);
    localStorage.setItem(LOCATION_CACHE_KEYS.VERSION, String(currentVersion + 1));
  } catch (err) {
    console.error("Cache invalidation error:", err);
  }
};

/**
 * Clear all location caches
 */
export const clearLocationCache = () => {
  Object.values(LOCATION_CACHE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

/**
 * Get the current cache version
 * @returns {number} - Current cache version
 */
export const getCacheVersion = () => {
  return parseInt(localStorage.getItem(LOCATION_CACHE_KEYS.VERSION) || "0", 10);
};

/**
 * Fetch countries with caching
 * @param {boolean} forceRefresh - Force refresh from API
 * @returns {Promise<Array>} - Array of countries
 */
export const fetchCountriesWithCache = async (forceRefresh = false) => {
  try {
    // Check cache first
    if (!forceRefresh) {
      const cachedCountries = getCachedData(LOCATION_CACHE_KEYS.COUNTRIES);
      if (cachedCountries) {
        return { data: cachedCountries, fromCache: true };
      }
    }

    // Fetch from API
    const res = await axios.get(`${API}/api/admin/master/countries`);
    if (res.data.success) {
      setCachedData(LOCATION_CACHE_KEYS.COUNTRIES, res.data.data);
      return { data: res.data.data, fromCache: false };
    }
    return { data: [], fromCache: false };
  } catch (err) {
    console.error("Error fetching countries:", err);
    // Fallback to cache
    const cachedCountries = getCachedData(LOCATION_CACHE_KEYS.COUNTRIES);
    return { data: cachedCountries || [], fromCache: true };
  }
};

/**
 * Fetch states with caching
 * @param {string} countryId - Filter by country ID (optional)
 * @param {boolean} forceRefresh - Force refresh from API
 * @returns {Promise<Array>} - Array of states
 */
export const fetchStatesWithCache = async (countryId = "", forceRefresh = false) => {
  try {
    // Check cache first
    if (!forceRefresh) {
      const cachedStates = getCachedData(LOCATION_CACHE_KEYS.STATES);
      if (cachedStates) {
        const filtered = countryId
          ? cachedStates.filter(s => String(s.cid) === String(countryId))
          : cachedStates;
        return { data: filtered, fromCache: true };
      }
    }

    // Fetch all from API
    const res = await axios.get(`${API}/api/admin/master/states`);
    if (res.data.success) {
      setCachedData(LOCATION_CACHE_KEYS.STATES, res.data.data);
      const filtered = countryId
        ? res.data.data.filter(s => String(s.cid) === String(countryId))
        : res.data.data;
      return { data: filtered, fromCache: false };
    }
    return { data: [], fromCache: false };
  } catch (err) {
    console.error("Error fetching states:", err);
    // Fallback to cache
    const cachedStates = getCachedData(LOCATION_CACHE_KEYS.STATES);
    if (cachedStates) {
      const filtered = countryId
        ? cachedStates.filter(s => String(s.cid) === String(countryId))
        : cachedStates;
      return { data: filtered, fromCache: true };
    }
    return { data: [], fromCache: false };
  }
};

/**
 * Fetch cities with caching
 * @param {string} stateId - Filter by state ID (optional)
 * @param {boolean} forceRefresh - Force refresh from API
 * @returns {Promise<Array>} - Array of cities
 */
export const fetchCitiesWithCache = async (stateId = "", forceRefresh = false) => {
  try {
    // Check cache first
    if (!forceRefresh) {
      const cachedCities = getCachedData(LOCATION_CACHE_KEYS.CITIES);
      if (cachedCities) {
        const filtered = stateId
          ? cachedCities.filter(c => String(c.sid2) === String(stateId))
          : cachedCities;
        return { data: filtered, fromCache: true };
      }
    }

    // Fetch all from API
    const res = await axios.get(`${API}/api/admin/master/cities`);
    if (res.data.success) {
      setCachedData(LOCATION_CACHE_KEYS.CITIES, res.data.data);
      const filtered = stateId
        ? res.data.data.filter(c => String(c.sid2) === String(stateId))
        : res.data.data;
      return { data: filtered, fromCache: false };
    }
    return { data: [], fromCache: false };
  } catch (err) {
    console.error("Error fetching cities:", err);
    // Fallback to cache
    const cachedCities = getCachedData(LOCATION_CACHE_KEYS.CITIES);
    if (cachedCities) {
      const filtered = stateId
        ? cachedCities.filter(c => String(c.sid2) === String(stateId))
        : cachedCities;
      return { data: filtered, fromCache: true };
    }
    return { data: [], fromCache: false };
  }
};

/**
 * Preload all location data into cache
 * Call this on app startup to ensure data is cached
 */
export const preloadLocationCache = async () => {
  await Promise.all([
    fetchCountriesWithCache(true),
    fetchStatesWithCache("", true),
    fetchCitiesWithCache("", true),
  ]);
};
