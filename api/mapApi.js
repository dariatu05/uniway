import { mockCoordinates } from "../data/mockCoordinates";

export function getMockCoordinates(city) {
  const coordinates = mockCoordinates[city];

  if (!coordinates) {
    throw new Error(`Keine Koordinaten für ${city} gefunden.`);
  }

  return {
    name: city,
    lat: coordinates.lat,
    lon: coordinates.lon,
  };
}

export function getCoordinatesForRoute(routeCities) {
  return routeCities.map((city) => getMockCoordinates(city));
}

export function createPolyline(points) {
  return points.map((point) => [point.lat, point.lon]);
}

export function getRouteCenter(points) {
  if (!points || points.length === 0) {
    return [48.2082, 16.3738];
  }

  const avgLat =
    points.reduce((sum, point) => sum + point.lat, 0) / points.length;

  const avgLon =
    points.reduce((sum, point) => sum + point.lon, 0) / points.length;

  return [avgLat, avgLon];
}
