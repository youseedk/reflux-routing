import RoutingStore from './routing-store';
import Routing from './router';

Routing.updateRoutes(location.hash);
window.addEventListener('hashchange', () => {
  Routing.updateRoutes(location.hash);
}, false);

export { Routing, RoutingStore };
