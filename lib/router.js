import Reflux from 'reflux';
import RouteParser from './route-parser';
import RoutingActions from './routing-actions';
import RoutingStore from './routing-store';

const store = Reflux.initStore(RoutingStore);

function define(key, route, options) {
  RoutingActions.routeDefined(key, RouteParser.parseRoute(key, route, options || {}));
}

function link(key, state) {
  const route = store.state.routes[key];

  if (route == null) {
    console.warn(`Could not create link. Route ${key} not found`); // eslint-disable-line no-console
    return '';
  }

  const allLinks = Object.keys(store.state.routes)
  .filter(k => store.state[k])
  .map((k) => {
    if (k === key) {
      return route.link(state);
    }

    // Add existing state to the hash link
    return store.state.routes[k].link(store.state[k]);
  });

  return `#!${allLinks.join(',')}`;
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
