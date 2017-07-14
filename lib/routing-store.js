import Reflux from 'reflux';
import RoutingActions from './routing-actions';

class Store extends Reflux.Store {
  constructor() {
    super();

    this.listenables = [RoutingActions];
    this.state = {
      hash: '',
      routes: {},
    };

    this.setStateFromHash(location.hash);
  }

  onHashUpdated(newHash) {
    this.setStateFromHash(newHash);
  }

  onRouteUpdated(key, state) {
    const newState = {};
    const route = this.state.routes[key];

    if (typeof (state) !== 'object') {
      console.warn(`Route update must provide a state and i must be an object (${key})`); // eslint-disable-line no-console
      return;
    }

    if (!route) {
      console.warn(`Triggered state update for unknown route ${key}`); // eslint-disable-line no-console
      return;
    }

    newState[key] = state;

    this.setState(newState);
  }

  onRouteDefined(key, route) {
    const allRoutes = this.state.routes || {};
    allRoutes[key] = route;

    const newState = {
      routes: allRoutes,
    };
    newState[key] = route.state(this.state.hash);

    this.setState(newState);
  }

  setStateFromHash(newHash) {
    const matchedRoutes = this.matched(newHash);
    const newRouteState = { hash: newHash };

    matchedRoutes.forEach((route) => {
      newRouteState[route.key] = route.state(newHash);
    });

    this.setState(newRouteState);
  }

  matched(url) {
    const matchedRoutes =
      Object.keys(this.state.routes)
      .filter(route => this.state.routes[route].matches(url))
      .map(route => this.state.routes[route]);
    return matchedRoutes;
  }
}

export default Store;
