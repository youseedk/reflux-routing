import Utils from './utils';

// const escapeRegExp = str => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

function tokenize(input) {
  return input.replace(/^\/?/, '').replace(/\/?$/, '').split('/');
}

function findParam(token, params) {
  return params.find(p => p.name === token.substring(1));
}

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

function parseRoute(key, route, options) {
  const definedRoute = {
    key,
    params: getParamsFromRoute(route, options),
    matches: null,
    route,
    options,
  };

  definedRoute.matches = (hash) => {
    // Test if a given url matches the route
    // return matchRx.exec(hash.replace(/^#!\/?/, ''));

    const routeTokens = tokenize(route);
    const hashTokens = tokenize(hash.replace(/^#!/, ''));

    return !routeTokens.some((token, i) => {
      if (token[0] === ':' && !findParam(token, definedRoute.params).required) {
        return false;
      }

      if (hashTokens.length > i && (hashTokens[i] === token || token[0] === ':')) {
        return false;
      }

      return true;
    });
  };

  definedRoute.state = (hash) => {
    const routeTokens = tokenize(route);
    const hashTokens = tokenize(hash.replace(/^#!/, ''))
    .filter((token, i) => routeTokens[i][0] === ':');

    const match = routeTokens
    .filter(token => token[0] === ':')
    .map((token, i) => {
      const result = hashTokens.length > i ?
        hashTokens[i]
        : findParam(token, definedRoute.params).defaultValue;
      return result;
    });

    return Utils.zipObject(definedRoute.params.map(p => p.name), match);
  };

  return definedRoute;
}


export default {
  parseRoute,
};
