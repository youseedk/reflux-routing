import Reflux from 'reflux';
import RouteParser from './route-parser';
import RoutingActions from './routing-actions';
import RoutingStore from './routing-store';
import Utils from './utils';

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

  function resolveToken(token) {
    if (token[0] === ':') {
      const param = Utils.findParam(token, route.params);
      const stateValue = state[param.name] || param.defaultValue;
      return stateValue;
    }
    return token;
  }

  return `#!/${
    Utils.tokenize(route.route)
    .map(resolveToken)
    .join('/')}`;
}

export default {
  define,
  link,
};
