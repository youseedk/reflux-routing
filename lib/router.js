import Reflux from 'reflux';
import RouteParser from './route-parser';
import RoutingActions from './routing-actions';
import RoutingStore from './routing-store';

const store = Reflux.initStore(RoutingStore);

function define(key, route, options) {
  RoutingActions.routeDefined({ key, route, options });
}

function link(key, state) {
  const routes = store.state.routes[key];

  if (routes == null) {
    console.warn(`Could not create link. Route ${key} not found`); // eslint-disable-line no-console
    return '';
  }


  const allLinks = Object.keys(store.state.routes)
  .filter(k => store.state[k])
  .map((k) => {
    if (k === key) {
      const route = RouteParser.bestMatch(routes, state);
      return RouteParser.link(route.routeDef, state, true);
    }

    // Add existing state to the hash link
    const bestMatched = RouteParser.bestMatch(store.state.routes[k], store.state[k]);

    return RouteParser.link(bestMatched.routeDef, store.state[k]);
  });

  return `#!${allLinks.filter(l => l).join(',')}`;
}

function clearState() {
  Object.keys(store.state.routes).forEach((key) => {
    RoutingActions.routeUpdated(key, null);
  });
}

export default {
  define,
  link,
  clearState,
};
