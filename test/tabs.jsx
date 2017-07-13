import Reflux from 'reflux';
import React from 'react';
import ReactDOM from 'react-dom';
import { Routing, RoutingStore } from '../lib/main';

Routing.define('Tabs', ':selected_tab', { selected_tab: { defaultValue: 'Tab1' } });

class TabBar extends Reflux.Component {

  constructor(props) {
    super(props);
    this.state = {
      Tabs: {},
    };
    this.stores = [RoutingStore];
    this.storeKeys = ['Tabs'];
  }

  render() {
    console.log(this.state.Tabs)
    return (
      <ul>
        <li><a href="#!/Tab1">Tab 1</a></li>
        <li><a href="#!/Tab2">Tab 2</a></li>
        <li><a href="#!/Tab3">Tab 3</a></li>
      </ul>
    );
  }
}

class Tab extends Reflux.Component {

  constructor(props) {
    super(props);
    this.stores = [RoutingStore];
    this.state = {
      Tabs: {},
    };
    this.storeKeys = ['Tabs'];
  }

  render() {
    if (this.state.Tabs.selected_tab !== this.props.tabId) return null;

    return (
      <div>This is { this.props.tabId }</div>
    );
  }
}


ReactDOM.render(React.createElement(TabBar), document.getElementById('tabbar'));
ReactDOM.render(React.createElement(Tab, { tabId: 'Tab1' } ), document.getElementById('tab1'));
ReactDOM.render(React.createElement(Tab, { tabId: 'Tab2' } ), document.getElementById('tab2'));
ReactDOM.render(React.createElement(Tab, { tabId: 'Tab3' } ), document.getElementById('tab3'));
