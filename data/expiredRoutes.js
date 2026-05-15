export function isRouteExpired(route) {
  if (!route?.date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const routeDate = new Date(route.date);
  routeDate.setHours(0, 0, 0, 0);

  return routeDate < today;
}

export function getExpiredRoutes(routes) {
  return routes.filter((route) => isRouteExpired(route));
}

export function getActiveRoutes(routes) {
  return routes.filter((route) => !isRouteExpired(route));
}

export function removeExpiredRoutes(routes) {
  return routes.filter((route) => !isRouteExpired(route));
}
