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

  setStateFromHash(newHash) {
    const matchedRoutes = this.matched(newHash);
    const newRouteState = { hash: newHash };

    matchedRoutes.forEach((route) => {
      newRouteState[route.key] = route.state(newHash);
    });

    this.setState(newRouteState);
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

  matched(url) {
    const matchedRoutes =
      Object.keys(this.state.routes)
      .filter(route => this.state.routes[route].matches(url))
      .map(route => this.state.routes[route]);
    return matchedRoutes;
  }
}

export default Store;
