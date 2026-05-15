import { mockFavorites } from "../data/mockFavorites";

const FAVORITES_KEY = "uniway_favorite_routes";
const PROFILE_KEY = "uniway_profile_settings";

const memoryStorage = {};

function hasLocalStorage() {
  return typeof localStorage !== "undefined";
}

function getItem(key) {
  if (hasLocalStorage()) {
    return localStorage.getItem(key);
  }

  return memoryStorage[key] || null;
}

function setItem(key, value) {
  if (hasLocalStorage()) {
    localStorage.setItem(key, value);
    return;
  }

  memoryStorage[key] = value;
}

const defaultSettings = {
  name: "UniWay User",
  defaultLocation: "Wien",
  locationEnabled: false,
  pushEnabled: false,
  currency: "EUR",
  standardBudget: 100,
  preferredTransports: ["bus", "train"],
};

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

export function saveFavoriteRoutes(routes) {
  setItem(FAVORITES_KEY, JSON.stringify(routes));
}

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

export function deleteFavoriteRoute(routeId) {
  const favorites = getFavoriteRoutes();

  const updatedFavorites = favorites.filter((route) => route.id !== routeId);

  saveFavoriteRoutes(updatedFavorites);

  return updatedFavorites;
}

export function deleteExpiredFavoriteRoutes(isExpiredFn) {
  const favorites = getFavoriteRoutes();

  const updatedFavorites = favorites.filter((route) => !isExpiredFn(route));

  saveFavoriteRoutes(updatedFavorites);

  return updatedFavorites;
}

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

export function saveProfileSettings(settings) {
  setItem(PROFILE_KEY, JSON.stringify(settings));
}
