import Reflux from 'reflux';
import RoutingActions from './routing-actions';

class Store extends Reflux.Store {
  constructor() {
    super();
    this.listenables = [RoutingActions];
  }

  onRouteUpdated(obj) {
    const newRouteState = {};
    newRouteState[obj.key] = obj.state;

    this.setState(newRouteState);
  }
}

export default Store;
