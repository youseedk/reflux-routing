import { Routing, RoutingStore} from './main';
import Reflux from 'reflux';

Routing.define('PRODUCT', '/customer/:customer_id/products/:p_id/');

Routing.define('CUSTOMER', '/customer/:customer_id/');

var storeSingleton = Reflux.initStore(RoutingStore);

