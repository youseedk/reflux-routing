import RouteParser from './route-parser';
import RouterActions from './routing-actions';

const routes = {};

function matched(url) {
  return Object.keys(routes)
  .filter(route => routes[route].matches(url))
  .map(route => routes[route]);
}

function state(routeKey, hash) {
  return routes[routeKey].state(hash);
}

function updateRoutes(hash) {
  const matchedRoutes = matched(hash);

  matchedRoutes.forEach((route) => {
    RouterActions.routeUpdated({
      key: route.key,
      state: state(route.key, hash),
    });
  });
}

function define(key, route, options) {
  if (routes[key]) {
    console.warn('Overriding an existing route with key ', key); // eslint-disable-line no-console
  }

  routes[key] = RouteParser.parseRoute(key, route, options || {});

  if (routes[key].matches(location.hash)) {
    // If the added route is already in the url, make sure to signal an update
    updateRoutes(location.hash);
  }
}

export default {
  define,
  matched,
  state,
  updateRoutes,
};
