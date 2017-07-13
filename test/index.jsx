import Reflux from 'reflux';
import React from 'react';
import ReactDOM from 'react-dom';
import { Routing, RoutingStore } from '../lib/main';

Routing.define('PRODUCT', '/products/:p_id/:component', {component: { defaultValue: 'MyDefaultComponent' }});

Routing.define('CUSTOMER', '/customer/:customer_id');
Routing.define('CUSTOMER', '/customer/:customer_id/profile/:profile_id');

class ProductComponent extends Reflux.Component {

  constructor(props) {
    super(props);
    this.state = {
      PRODUCT: {},
    };
    this.stores = [RoutingStore];
    this.storeKeys = ['PRODUCT'];
  }

  render() {
    console.log("Product state", this.state);
    return (
      <div>
        <h1>Product</h1>
        <h2>ID: {this.state.PRODUCT.p_id}{this.state.PRODUCT.component}</h2>
        <a href="#!/products/99">Product</a><br/>
        <a href="#!/products/42/details">Details</a><br/>
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
        <a href="#!/customer/99">Customer</a><br/>
        <a href="#!/customer/98/profile">Profile</a><br/>
      </div>
    );
  }
}


ReactDOM.render(React.createElement(ProductComponent), document.getElementById('product'));

ReactDOM.render(React.createElement(CustomerComponent), document.getElementById('customer'));
