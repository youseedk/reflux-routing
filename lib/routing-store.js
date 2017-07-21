import Reflux from 'reflux';
import RoutingActions from './routing-actions';
import RouteParser from './route-parser';

// Array.prototype.flatMap = Array.prototype.flatMap ||

function flatMap(arr, lambda) {
  return Array.prototype.concat.apply([], arr.map(lambda));
}

function routeConflicts(newRoute) {
  return (route) => {
    const x = newRoute.route.replace(/:[^/]*/gi, '___');
    const y = route.route.replace(/:[^/]*/gi, '___');

    return x === y;
  };
}

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

    allRoutes[route.key] = allRoutes[route.key] || [];

    const conflictingRoute = allRoutes[route.key].find(routeConflicts(route));

    if (!conflictingRoute) {
      allRoutes[route.key].push(route);
    } else {
      allRoutes[route.key][allRoutes[route.key].indexOf(conflictingRoute)] = route;
      console.warn(`WARNING: New route '${route.route}' is conflicting with existing route '${conflictingRoute.route}'. Existing route will be overwritten `); // eslint-disable-line no-console
    }

    this.setState({
      routes: allRoutes,
    });

    const newRouteState = RouteParser.state(route, this.state.hash);
    if (!this.stateEquals(route.key, newRouteState)) {
      RoutingActions.routeUpdated(route.key, newRouteState);
    }
  }

  setStateFromHash(newHash) {
    const matchedRoutes = this.matched(newHash).filter(r => r);

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
      flatMap(Object.keys(this.state.routes), routeKey => this.state.routes[routeKey])
      .filter(route => RouteParser.matches(route, url));
    return matchedRoutes;
  }
}

export default Store;
