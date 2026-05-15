// favoritesStore.js
// Location: src/utils/favoritesStore.js
// Simple in-memory favorites store for UniWay.

let savedRoutes = []; // in-memory list of liked routes
const listeners = new Set(); // subscribers for reactive updates

/**
 * Returns a copy of the current favorites list.
 */
export function getFavorites() {
    return [...savedRoutes];
}

/**
 * Returns true if the route with this id is saved.
 */
export function isFavorite(routeId) {
    return savedRoutes.some(r => r.id === routeId);
}

/**
 * Adds a route to favorites. Ignores duplicates.
 */
export function addFavorite(route) {
    if (!isFavorite(route.id)) {
        savedRoutes = [...savedRoutes, route];
        notifyListeners();
    }
}

/**
 * Removes a route from favorites by id.
 */
export function removeFavorite(routeId) {
    savedRoutes = savedRoutes.filter(r => r.id !== routeId);
    notifyListeners();
}

/**
 * Toggles a route in/out of favorites.
 * Returns true if route is now a favorite, false if removed.
 */
export function toggleFavorite(route) {
    if (isFavorite(route.id)) {
        removeFavorite(route.id);
        return false;
    } else {
        addFavorite(route);
        return true;
    }
}

/**
 * Subscribe to favorites changes.
 * @param {Function} listener - called whenever favorites change
 * @returns {Function} unsubscribe function
 */
export function subscribeFavorites(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function notifyListeners() {
    listeners.forEach(fn => fn([...savedRoutes]));
}
