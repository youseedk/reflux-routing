import Reflux from 'reflux';
import { Routing, RoutingStore } from './main';

Routing.define('PRODUCT', '/customer/:customer_id/products/:p_id/');

Routing.define('CUSTOMER', '/customer/:customer_id/');

Reflux.initStore(RoutingStore);

