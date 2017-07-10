import Reflux from 'reflux-core';

import RoutingActions from './routing-actions';

export default class RoutingStore extends Reflux.createStore {
  constructor() {
    super();

    this.listenable = RoutingActions
  }

  onRouteUpdated(foo) {
    console.log(foo);
  }
}