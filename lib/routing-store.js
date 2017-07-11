import Reflux from 'reflux';
import RoutingActions from './routing-actions';

class Store extends Reflux.Store {
	constructor() {
		super();
		this.listenables = [RoutingActions];
	}

	onRouteUpdated (obj) {
		let newRouteState = {};
		newRouteState[obj.key] = obj.state;
		
		this.setState(newRouteState);
		console.log("State", this.state);
	}
}

export default Store;