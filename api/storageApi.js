// API for managing local storage of favorites and profile settings
// storageApi.js
// Location: src/api/storageApi.js
import { mockFavorites } from "../data/mockFavorites";

// Keys for saving data
const FAVORITES_KEY = "uniway_favorite_routes";
const PROFILE_KEY = "uniway_profile_settings";

// Backup storage if localStorage is not available
const memoryStorage = {};

function hasLocalStorage() {
  return typeof localStorage !== "undefined";
}

// Reads value from localStorage or memory backup
function getItem(key) {
  if (hasLocalStorage()) {
    return localStorage.getItem(key);
  }

  return memoryStorage[key] || null;
}

// Saves value to localStorage or memory backup
function setItem(key, value) {
  if (hasLocalStorage()) {
    localStorage.setItem(key, value);
    return;
  }

  memoryStorage[key] = value;
}

// Default profile settings
const defaultSettings = {
  name: "UniWay User",
  defaultLocation: "Wien",
  locationEnabled: false,
  pushEnabled: false,
  currency: "EUR",
  standardBudget: 100,
  defaultFuelPrice: 1.9,
  preferredTransports: ["bus", "train"],
};

// Gets saved favorite routes
export function getFavoriteRoutes() {
  const storedFavorites = getItem(FAVORITES_KEY);

  if (!storedFavorites) {
    return mockFavorites;
  }

  try {
    return JSON.parse(storedFavorites);
  } catch (error) {
    return mockFavorites;
  }
}

// Saves all favorite routes
export function saveFavoriteRoutes(routes) {
  setItem(FAVORITES_KEY, JSON.stringify(routes));
}

// Adds one route to favorites
export function saveFavoriteRoute(route) {
  const favorites = getFavoriteRoutes();
  const alreadyExists = favorites.some((item) => item.id === route.id);

  if (alreadyExists) {
    return favorites;
  }

  const updatedFavorites = [...favorites, route];
  saveFavoriteRoutes(updatedFavorites);

  return updatedFavorites;
}

// Deletes one favorite route
export function deleteFavoriteRoute(routeId) {
  const favorites = getFavoriteRoutes();

  const updatedFavorites = favorites.filter((route) => route.id !== routeId);

  saveFavoriteRoutes(updatedFavorites);

  return updatedFavorites;
}

// Deletes all expired favorite routes
export function deleteExpiredFavoriteRoutes(isExpiredFn) {
  const favorites = getFavoriteRoutes();

  const updatedFavorites = favorites.filter((route) => !isExpiredFn(route));

  saveFavoriteRoutes(updatedFavorites);

  return updatedFavorites;
}

// Gets saved profile settings
export function getProfileSettings() {
  const storedSettings = getItem(PROFILE_KEY);

  if (!storedSettings) {
    return defaultSettings;
  }

  try {
    return {
      ...defaultSettings,
      ...JSON.parse(storedSettings),
    };
  } catch (error) {
    return defaultSettings;
  }
}

// Saves profile settings
export function saveProfileSettings(settings) {
  setItem(PROFILE_KEY, JSON.stringify(settings));
}
