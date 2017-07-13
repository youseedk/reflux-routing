import Reflux from 'reflux';
import React from 'react';
import ReactDOM from 'react-dom';
import { Routing, RoutingStore } from '../lib/main';
import { ProductComponent, CustomerComponent } from './components.jsx'

Routing.define('Tabs', ':selected_tab', { selected_tab: { defaultValue: 'Tab1' } });

class TabBar extends Reflux.Component {

  constructor(props) {
    super(props);
    this.stores = [RoutingStore];
    this.storeKeys = ['Tabs'];
  }

  render() {
    return (
      <ul>
        <li><a href={Routing.link('Tabs', { selected_tab: 'Tab1' })}>Tab 1</a></li>
        <li><a href={Routing.link('Tabs', { selected_tab: 'Tab2' })}>Tab 2</a></li>
        <li><a href={Routing.link('Tabs', { selected_tab: 'Tab3' })}>Tab 3</a></li>
      </ul>
    );
  }
}

class Tab extends Reflux.Component {

  constructor(props) {
    super(props);
    this.stores = [RoutingStore];
    this.storeKeys = ['Tabs'];
  }

  render() {
    console.log("Render!", this.state);
    if (this.state.Tabs.selected_tab !== this.props.tabId) return null;

    return (
      <div>This is { this.props.tabId }</div>
    );
  }
}




ReactDOM.render(React.createElement(ProductComponent), document.getElementById('product'));
ReactDOM.render(React.createElement(CustomerComponent), document.getElementById('customer'));
ReactDOM.render(React.createElement(TabBar), document.getElementById('tabbar'));
ReactDOM.render(React.createElement(Tab, { tabId: 'Tab1' } ), document.getElementById('tab1'));
ReactDOM.render(React.createElement(Tab, { tabId: 'Tab2' } ), document.getElementById('tab2'));
ReactDOM.render(React.createElement(Tab, { tabId: 'Tab3' } ), document.getElementById('tab3'));
