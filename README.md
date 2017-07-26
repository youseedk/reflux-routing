# New reflux router [![Build Status](https://travis-ci.org/youseedk/reflux-routing.svg?branch=master)](https://travis-ci.org/youseedk/reflux-routing)
This router is aming to solve two problems that were not otherwise addressed by other routers:

1. Using RefluxJs to handle all application state and changes
2. Allow multiple independent components in a page that can all update the URL hash without overwriting echothers state

## Defining routes

Defining a simple route:

```
import Routing from 'reflux-routing';

Routing.define('MyComponentKey', '/some-resource/:resourceId');
```

## Create a reflux component that renders based on the current route

```
import Reflux from 'reflux';
import { Routing, RoutingStore } from 'reflux-routing';

class MyComponent extends Reflux.Component {
  constructor(props) {
    super(props);
    this.stores = [RoutingStore]; // Attach to the routing store
    this.storeKeys = ['MyComponentKey']; // We're only listening to the state related to routes defined with "MyComponentKey"
  }
  
  render () {
    <div>My selected resource: {this.state.MyComponentKey.resourceId}</div>
  }
}

```
## Building links
When making routed links, you should always construct them usink the link method, as this will ensure that we don't mess up other component's state.
```
...
  render () {
    <a href={Routing.link('MyComponentKey', { resourceId: 1 })}>Resource 1</a>
    <a href={Routing.link('MyComponentKey', { resourceId: 2 })}>Resource 2</a>
    <a href={Routing.link('MyComponentKey', { resourceId: 3 })}>Resource 3</a>
    <div>My selected resource: {this.state.MyComponentKey.resourceId}</div>
  }
...
```
## Scripted navigation
There is a shorthand for setting the location hash:
```
import { Routing } from 'reflux-routing';

//Define some route
Routing.define('MyComponentKey', '/some-resource/:resourceId');

//Now navigate to that route (directly updating the URI)
Routing.navigate('MyComponentKey', {resourceId: '999'});

```
This will trigger a hashUpdated action. This is just a shorthand for:
```
window.location.hash = Routing.link(key, state);
```

## Setting options
You can define a default value for all route parameters or specify that a value is required for the route to be matched:
```
Routing.define('UsersKey', '/user/:userId/:component', {
  userId: { required: true }
  component: { defaultValue: profile }
});
```

## Routing actions
The router exposes a number of actions you can listen to instead of binding to the store:

### hashUpdated(newHash)
This triggers everytime the hash is updated in the URL. Similar to listening on window.hashChange.
When the page loads, the initial hash is loaded from the URL, but a hashUpdated action is NOT triggered (this may change).

### routeUpdated(key, newState)
This action is triggered everytime a route state changes. This is also triggered on page load if the initial hash is different from the default state.
This action triggers for every route key.

### routeDefined
This action triggers whenever a new route is defined.

## Using route actions to update stores
```
import { RoutingActions, Routing } from 'reflux-routing'

Routing.define('Cutomer', 'customer/:cutomer_id');

class Store extends Reflux.Store {
  constructor() {
    super();

    this.listenables = [RoutingActions];

    this.setStateFromHash(location.hash);
  }

  onRouteUpdated(key, newState) {
    if (key === 'Customer') {
      //Do some fetching based on customer state, i.e.:
      //fetch('/api/customer/' + newState.Customer.customer_id)....
      //  then(customer => this.setState({cusomer: customer}))
    }
  }
}
```

