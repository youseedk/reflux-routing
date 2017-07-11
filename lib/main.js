import RouterActions from './routing-actions';
import RoutingStore from './routing-store';
import Routing from './router';

Routing.updateRoutes();
window.addEventListener('hashchange', (ev) => {
	Routing.updateRoutes(location.hash);	
}, false);

export { Routing, RoutingStore};