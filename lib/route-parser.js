import Utils from './utils';

function getParamsFromRoute(route, options) {
  const rx = /:([^/]+)/gi;
  let match;
  const params = [];

  while (match = rx.exec(route)) { // eslint-disable-line no-cond-assign
    const param = match[1];
    const paramOptions = options[param] || {};

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

function buildMatcher(route, params) {
  return (hash) => {
    const routeTokens = Utils.tokenize(route);
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
}

function buildState(route, params) {
  return (hash) => {
    const routeTokens = Utils.tokenize(route);
    const hashTokens =
      Utils.tokenize(hash.replace(/^#!/, ''))
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
  };
}

function parseRoute(key, route, options) {
  const params = getParamsFromRoute(route, options);
  const matches = buildMatcher(route, params);
  const state = buildState(route, params);

  return {
    key,
    params,
    route,
    options,
    matches,
    state,
  };
}


export default {
  parseRoute,
};
