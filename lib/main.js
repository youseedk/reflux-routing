import RoutingStore from './routing-store';
import RoutingActions from './routing-actions';
import Routing from './router';

window.addEventListener('hashchange', () => {
  RoutingActions.hashUpdated(location.hash);
}, false);

export { Routing, RoutingStore };
