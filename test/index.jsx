import Reflux from 'reflux';
import React from 'react';
import ReactDOM from 'react-dom';
import { Routing, RoutingStore } from '../lib/main';

Routing.define('PRODUCT', '/customer/:customer_id/products/:p_id/');
Routing.define('CUSTOMER', '/customer/:customer_id/');

class TestComponent extends Reflux.Component {

  constructor(props) {
    super(props);
    this.stores = [RoutingStore];
  }

  render() {
    console.log("STATE", this.state);
    return (
      <div>
        <a href="#!/customer/99/products/42/">Product</a><br/>
        <a href="#!/customer/49">Customer</a> <br/>
        <a href="#Else">Else</a><br/>
        <a href="#!/customer/99/products/43/">Product 43</a><br/>
        <a href="#Other">Other</a><br/>
      </div>
    );
  }
}


ReactDOM.render(React.createElement(TestComponent), document.getElementById('root'));
