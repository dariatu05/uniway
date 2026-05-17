// routeRanking.js
// Location: src/utils/routeRanking.js
//
// Assigns labels (cheapest / fastest / best) to a list of routes.
// Called by ResultsPage before rendering RouteCard list.

import { COLORS } from "../styles/colors";

export function rankRoutes(routes) {
    if (!routes || routes.length === 0) return [];

    const ranked = routes.map(r => ({ ...r, label: null }));

    // --- Cheapest: lowest price ---
    let cheapestIdx = 0;
    routes.forEach((r, i) => {
        if (r.price < routes[cheapestIdx].price) cheapestIdx = i;
    });

    // --- Fastest: lowest durationMinutes ---
    let fastestIdx = 0;
    routes.forEach((r, i) => {
        if (r.durationMinutes < routes[fastestIdx].durationMinutes) fastestIdx = i;
    });

    // --- Best: weighted score (price 50%, duration 35%, transfers 15%) ---
    const prices = routes.map(r => r.price);
    const durations = routes.map(r => r.durationMinutes);
    const transfers = routes.map(r => r.transfers ?? 0);

    const norm = (v, min, max) => (max === min ? 0 : (v - min) / (max - min));

    const minP = Math.min(...prices), maxP = Math.max(...prices);
    const minD = Math.min(...durations), maxD = Math.max(...durations);
    const minT = Math.min(...transfers), maxT = Math.max(...transfers);

    let bestScore = Infinity;
    let bestIdx = 0;
    routes.forEach((r, i) => {
        const score =
            0.50 * norm(r.price, minP, maxP) +
            0.35 * norm(r.durationMinutes, minD, maxD) +
            0.15 * norm(r.transfers ?? 0, minT, maxT);
        if (score < bestScore) { bestScore = score; bestIdx = i; }
    });

    ranked[bestIdx].label = 'best';
    ranked[fastestIdx].label = 'fastest';
    ranked[cheapestIdx].label = 'cheapest';
    return ranked;
}

/**labels text*/
export function getLabelText(label) {
    switch (label) {
        case 'cheapest': return ' Cheapest';
        case 'fastest': return ' Fastest';
        case 'best': return ' Best';
        default: return null;
    }
}


/** Badge background color per label */
export function getLabelColor(label) {
    switch (label) {
        case 'cheapest': return {
            backgroundColor: COLORS.secondary,
            iconName: 'tag',
            iconColor: COLORS.primary
        }
        case 'fastest': return {
            backgroundColor: COLORS.primary,
            iconName: 'flash',
            iconColor: COLORS.secondary
        }
        case 'best': return {
            backgroundColor: COLORS.secondary,
            borderColor: COLORS.primary,
            iconName: 'crown',
            iconColor: COLORS.primary
        };
        default: return COLORS.text;
    }
}