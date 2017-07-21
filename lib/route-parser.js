import Utils from './utils';

function getParamsFromRoute(route, options) {
  const rx = /:([^/]+)/gi;
  let match;
  const params = [];

  while (match = rx.exec(route)) { // eslint-disable-line no-cond-assign
    const param = match[1];
    const paramOptions = (options && options[param]) || {};

    params.push({
      name: match[1],
      defaultValue: paramOptions.defaultValue,
      required: paramOptions.required == null ?
        paramOptions.defaultValue == null
        : paramOptions.required,
    });
  }
  return params;
}

function matches(routeDef, hashList) {
  const params = getParamsFromRoute(routeDef.route, routeDef.options);

  // matcherFn tests for a single route
  const matcherFn = (hash) => {
    const routeTokens = Utils.tokenize(routeDef.route);
    const hashTokens = Utils.tokenize(hash.replace(/^#!/, ''));

    const isMatch = !routeTokens.some((token, i) => {
      if (token[0] === ':' && !Utils.findParam(token, params).required) {
        return false;
      }

      if (hashTokens.length > i && (hashTokens[i] === token || token[0] === ':')) {
        return false;
      }

      return true;
    });

    // If the hash i longer than the route, it's not a match
    if (hashTokens.length > routeTokens.length) return false;

    return isMatch;
  };

  // Adding this to test a string concatenated list of routes
  return (hash => hash.split(',').some(matcherFn))(hashList);
}

function state(routeDef, hash) {
  const params = getParamsFromRoute(routeDef.route, routeDef.options);

  // Find the first matching hash if there's a list
  const matchedHash = hash.split(',').find(h => matches(routeDef, h)) || '';

  const routeTokens = Utils.tokenize(routeDef.route);
  const hashTokens =
    Utils.tokenize(matchedHash.replace(/^#!/, ''))
    .filter((token, i) => routeTokens.length > i && routeTokens[i][0] === ':');

  const match = routeTokens
    .filter(token => token[0] === ':')
    .map((token, i) => {
      const result = hashTokens.length > i ?
        hashTokens[i]
        : Utils.findParam(token, params).defaultValue;
      return result;
    });

  return Utils.zipObject(params.map(p => p.name), match);
}

function link(routeDef, linkState, includeDefaults) {
  const params = getParamsFromRoute(routeDef.route, routeDef.options);

  function resolveToken(token) {
    if (token[0] === ':') {
      const param = Utils.findParam(token, params);
      const stateValue = linkState[param.name] || param.defaultValue;
      return stateValue;
    }
    return token;
  }

  const routeTokens = Utils.tokenize(routeDef.route).map(resolveToken);

  // Check if routeTokens are all defaults
  if (!params.some(p => p.defaultValue !== linkState[p.name] && linkState[p.name] != null)) {
    if (!includeDefaults) { return ''; } // Return empty hash if all values match defaults
  }

  return `${
    routeTokens
    .join('/')}`;
}

function parseRoute(key, route, options) {
  return {
    key,
    route,
    options,
  };
}


export default {
  parseRoute,
  matches,
  state,
  link,
  getParamsFromRoute,
};
