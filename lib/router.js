import Utils from './utils';
import RouterActions from './routing-actions';

const routes = {};

// const escapeRegExp = str => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

function matched(url) {
  return Object.keys(routes)
  .filter(route => routes[route].matches(url))
  .map(route => routes[route]);
}

function state(routeKey, hash) {
  return routes[routeKey].state(hash);
}

function getParamsFromRoute(route) {
  const rx = /:([^/]+)/gi;
  let match;
  const params = [];
  while (match = rx.exec(route)) { // eslint-disable-line no-cond-assign
    params.push(match[1]);
  }
  return params;
}

function parseRoute(key, route) {
  const definedRoute = {
    key,
    params: getParamsFromRoute(route),
    matches: null,
    route,
  };

  const strRxMatch =
    `${route.replace(/:[^/]+/gi, '([^/]+)') // Build a regular expression from the route to test if a url matches
    .replace(/\/$/, '') // Remove a trailing slash from the end as this is considered optional
    .replace(/\//g, '\\/') // Escape forward slashes in the regex TODO: Full escape using 'escapeRegExp'
    }\\/?$`; // Allow optional slash at the end of the url

  const matchRx = new RegExp(strRxMatch, 'i');

  definedRoute.matches = hash =>
    // Test if a given url matches the route
    matchRx.exec(hash.replace(/^#!/, ''));

  definedRoute.state = (hash) => {
    const match = matchRx.exec(hash.replace(/^#!/, ''));
    return Utils.zipObject(definedRoute.params, match.slice(1));
  };

  return definedRoute;
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

function define(key, route) {
  if (routes[key]) {
    console.warn('Overriding an existing route with key ', key, 'Use redefine instead'); // eslint-disable-line no-console
  }
  routes[key] = parseRoute(key, route);
  if (routes[key].matches(location.hash)) {
    updateRoutes(location.hash);
  }
}

function redefine(key, route) {
  if (!routes[key]) {
    console.warn('Redefining route with ', key, ', but an existing route was not found.'); // eslint-disable-line no-console
  }
  routes[key] = parseRoute(key, route);
  if (routes[key].matches(location.hash)) {
    updateRoutes(location.hash);
  }
}

export default {
  define,
  redefine,
  matched,
  state,
  updateRoutes,
};
