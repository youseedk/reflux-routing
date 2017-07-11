import Utils from './utils';
import RouterActions from './routing-actions';

const routes = {};

const escapeRegExp = (str) => {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

function getParamsFromRoute(route) {
	const rx = /:([^/]+)/gi;
	let match;
	let params = [];
	while (match = rx.exec(route)) {
		params.push(match[1]);
	}
	return params;
}

const parseRoute = (key, route) => {
	let definedRoute = {
		key: key,
		params: getParamsFromRoute(route),
		matches: null,
		route: route
	};

	const strRxMatch =
		route.replace(/:[^/]+/gi, '([^/]+)') //Build a regular expression from the route to test if a url matches
		.replace(/\/$/, '') //Remove a trailing slash from the end as this is considered optional 
		.replace(/\//g, '\\/') //Escape forward slashes in the regex TODO: Full escape using 'escapeRegExp'
		+ '\\/?$'; //Allow optional slash at the end of the url
	
	let matchRx = new RegExp(strRxMatch, 'i');

	definedRoute.matches = (hash) => {
		//Test if a given url matches the route
		return matchRx.exec(hash.replace(/^#!/, ''));
	};

	definedRoute.state = (hash) => {
		let match = matchRx.exec(hash.replace(/^#!/, ''));
		return Utils.zipObject(definedRoute.params, match.slice(1));
	};

	return definedRoute;
};

function updateRoutes (hash) {
	let matchedRoutes = Routing.matched(hash);
	
	matchedRoutes.forEach(route => {
		RouterActions.routeUpdated({
			key: route.key,
			state: Routing.state(route.key, hash)
		});
	});
}

const Routing = {
	define(key, route) {
		if (routes[key]) {
			console.warn('Overriding an existing route with key ', key, 'Use redefine instead');
		}
		routes[key] = parseRoute(key, route);
		if (routes[key].matches(location.hash)) {
			updateRoutes(location.hash);
		}
	},

	redefine(key, route) {
		if (!routes[key]) {
			console.warn('Redefining route with ', key, ', but an existing route was not found.');
		}
		routes[key] = parseRoute(key, route);
		if (routes[key].matches(location.hash)) {
			updateRoutes(location.hash);
		}
	},

	matched(url) {
		return Object.keys(routes).filter(route => {
			return routes[route].matches(url);
		}).map(route => routes[route]);
	},

	state(routeKey, hash) {
		return routes[routeKey].state(hash);
	},

	updateRoutes: updateRoutes
};

export default Routing;