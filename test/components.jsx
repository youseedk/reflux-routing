import React from 'react';
import Reflux from 'reflux';
import { Routing, RoutingStore } from '../lib/main';

Routing.define('PRODUCT', '/products/:p_id/:component', {component: { defaultValue: 'MyDefaultComponent' }});

Routing.define('CUSTOMER', '/customer/:customer_id');
Routing.define('CUSTOMER', '/customer/:customer_id/profile/:profile_id');

class ProductComponent extends Reflux.Component {

  constructor(props) {
    super(props);
    this.stores = [RoutingStore];
    this.storeKeys = ['PRODUCT'];
  }

  render() {
    console.log("Product state", this.state);
    return (
      <div>
        <h1>Product22</h1>
        <h2>ID: {this.state.PRODUCT.p_id}{this.state.PRODUCT.component}</h2>
        <a href={Routing.link('PRODUCT', { p_id: 99 } )}>Product</a><br/>
        <a href={Routing.link('PRODUCT', { p_id: 42, component: 'details' } )}>Details</a><br/>
      </div>
    );
  }
}


class CustomerComponent extends Reflux.Component {

  constructor(props) {
    super(props);
    this.stores = [RoutingStore];
    this.storeKeys = ['CUSTOMER'];
  }

  render() {
    console.log("Customer state", this.state);
    return (
      <div>
        <h1>Customer</h1>
        <a href={Routing.link('PRODUCT', { customer_id: 99 } )}>Customer</a><br/>
        <a href={Routing.link('PRODUCT', { customer_id: 98, profile_id: 'xx' } )}>Profile</a><br/>
      </div>
    );
  }
}

export {
  ProductComponent,
  CustomerComponent
};