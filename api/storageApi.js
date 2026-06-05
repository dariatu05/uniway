import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "uniway_favorite_routes";
const PROFILE_KEY = "uniway_profile_settings";

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

export async function getFavoriteRoutes() {
  const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);

  if (!storedFavorites) {
    return [];
  }

  return JSON.parse(storedFavorites);
}

export async function saveFavoriteRoutes(routes) {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(routes));
}

export async function saveFavoriteRoute(route) {
  const favorites = await getFavoriteRoutes();

  const alreadyExists = favorites.some((item) => item.id === route.id);

  if (alreadyExists) {
    return favorites;
  }

  const updatedFavorites = [...favorites, route];
  await saveFavoriteRoutes(updatedFavorites);

  return updatedFavorites;
}

export async function deleteFavoriteRoute(routeId) {
  const favorites = await getFavoriteRoutes();

  const updatedFavorites = favorites.filter((route) => route.id !== routeId);

  await saveFavoriteRoutes(updatedFavorites);

  return updatedFavorites;
}

export async function clearExpiredRoutes() {
  const favorites = await getFavoriteRoutes();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const updatedFavorites = favorites.filter((route) => {
    const routeDate = new Date(route.date);
    routeDate.setHours(0, 0, 0, 0);

    return routeDate >= today;
  });

  await saveFavoriteRoutes(updatedFavorites);

  return updatedFavorites;
}

export async function getExpiredRoutes() {
  const favorites = await getFavoriteRoutes();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return favorites.filter((route) => {
    const routeDate = new Date(route.date);
    routeDate.setHours(0, 0, 0, 0);

    return routeDate < today;
  });
}

export async function getProfileSettings() {
  const storedSettings = await AsyncStorage.getItem(PROFILE_KEY);

  if (!storedSettings) {
    return defaultSettings;
  }

  return {
    ...defaultSettings,
    ...JSON.parse(storedSettings),
  };
}

export async function saveProfileSettings(settings) {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(settings));
}
