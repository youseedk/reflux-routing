import RoutingStore from './routing-store';
import Routing from './router';

Routing.updateRoutes();
window.addEventListener('hashchange', () => {
  Routing.updateRoutes(location.hash);
}, false);

export { Routing, RoutingStore };
