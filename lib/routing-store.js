import Reflux from 'reflux';
import RoutingActions from './routing-actions';
import RouteParser from './route-parser';

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
    if (typeof (state) !== 'object') {
      console.warn(`Route update must provide a state and i must be an object (${key})`); // eslint-disable-line no-console
      return;
    }

    this.setState({ [key]: state });

    // To support multiple routes, we should trigger a state change for all route states as some
    // components won't be triggered otherwise
    Object.keys(this.state.routes).forEach((route) => {
      this.setState({
        [route]: this.state[route],
      });
    });
  }

  onRouteDefined(route) {
    const allRoutes = this.state.routes || {};
    allRoutes[route.key] = route;

    this.setState({
      routes: allRoutes,
    });

    const newRouteState = RouteParser.state(route, this.state.hash);
    if (!this.stateEquals(route.key, newRouteState)) {
      RoutingActions.routeUpdated(route.key, RouteParser.state(route, this.state.hash));
    }
  }

  setStateFromHash(newHash) {
    const matchedRoutes = this.matched(newHash);

    this.setState({ hash: newHash });

    matchedRoutes.forEach((route) => {
      const newState = RouteParser.state(route, newHash);
      if (!this.stateEquals(route.key, newState)) {
        RoutingActions.routeUpdated(route.key, newState);
      }
    });
  }

  stateEquals(key, newState) {
    return JSON.stringify(this.state[key]) === JSON.stringify(newState);
  }

  matched(url) {
    const matchedRoutes =
      Object.keys(this.state.routes)
      .filter(route => RouteParser.matches(this.state.routes[route], url))
      .map(route => this.state.routes[route]);
    return matchedRoutes;
  }
}

export default Store;
