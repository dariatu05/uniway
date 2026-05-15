const FAVORITES_KEY = "uniway_favorite_routes";
const PROFILE_KEY = "uniway_profile_settings";

export function getFavoriteRoutes() {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Fehler beim Laden der Favoriten:", error);
    return [];
  }
}

export function saveFavoriteRoute(route) {
  const favorites = getFavoriteRoutes();

  const alreadyExists = favorites.some((item) => item.id === route.id);

  if (alreadyExists) {
    return favorites;
  }

  const updatedFavorites = [...favorites, route];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));

  return updatedFavorites;
}

export function deleteFavoriteRoute(routeId) {
  const favorites = getFavoriteRoutes();

  const updatedFavorites = favorites.filter((route) => route.id !== routeId);

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));

  return updatedFavorites;
}

export function isRouteSaved(routeId) {
  const favorites = getFavoriteRoutes();
  return favorites.some((route) => route.id === routeId);
}

export function clearExpiredRoutes() {
  const favorites = getFavoriteRoutes();
  const today = new Date();

  const activeRoutes = favorites.filter((route) => {
    const routeDate = new Date(route.date);
    return routeDate >= today;
  });

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(activeRoutes));

  return activeRoutes;
}

export function getExpiredRoutes() {
  const favorites = getFavoriteRoutes();
  const today = new Date();

  return favorites.filter((route) => {
    const routeDate = new Date(route.date);
    return routeDate < today;
  });
}

export function getProfileSettings() {
  try {
    const data = localStorage.getItem(PROFILE_KEY);

    if (!data) {
      return {
        name: "",
        studentStatus: true,
        defaultBudget: 100,
        currency: "EUR",
        language: "Deutsch",
        defaultLocation: "Wien",
        locationEnabled: false,
        pushPriceDrop: true,
        pushLastMinute: true,
        studentDiscounts: true,
        cheapestRouteFirst: true,
        preferredTransports: {
          car: false,
          train: true,
          bus: true,
          plane: false,
        },
      };
    }

    return JSON.parse(data);
  } catch (error) {
    console.error("Fehler beim Laden der Profileinstellungen:", error);
    return {};
  }
}

export function saveProfileSettings(settings) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(settings));
  return settings;
}
