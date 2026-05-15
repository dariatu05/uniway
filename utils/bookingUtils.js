// bookingUtils.js
// Location: src/utils/bookingUtils.js
//
// Opens external booking websites for routes and segments.
// Uses React Native's Linking API (no external packages needed).

import { Linking } from 'react-native';

/** Fallback URLs when a segment / route has no specific bookingUrl */
const DEFAULT_URLS = {
    bus:   'https://www.flixbus.com',
    train: 'https://www.oebb.at',
    plane: 'https://www.skyscanner.com',
    car:   'https://www.blablacar.com',
};

/**
 * Opens the booking page for a full route.
 * Prefers route.bookingUrl, falls back to transport type default.
 * @param {Object} route
 */
export async function openBookingForRoute(route) {
    const url = route.bookingUrl || DEFAULT_URLS[route.type] || DEFAULT_URLS[route.mainTransport] || 'https://www.google.com';
    await _open(url);
}

/**
 * Opens the booking page for a single route segment.
 * @param {Object} segment
 */
export async function openBookingForSegment(segment) {
    const url = segment.bookingUrl || DEFAULT_URLS[segment.type] || 'https://www.google.com';
    await _open(url);
}

async function _open(url) {
    try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            console.warn('[bookingUtils] Cannot open URL:', url);
        }
    } catch (err) {
        console.error('[bookingUtils] Error:', err);
    }
}

/** Display name for a transport type's default operator */
export function getOperatorName(type) {
    switch (type) {
        case 'bus':   return 'FlixBus';
        case 'train': return 'ÖBB';
        case 'plane': return 'Skyscanner';
        case 'car':   return 'BlaBlaCar';
        default:      return 'Book Now';
    }
}