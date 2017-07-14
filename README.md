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
## Setting options
You can define a default value for all route parameters or specify that a value is required for the route to be matched:
```
Routing.define('UsersKey', '/user/:userId/:component', {
  userId: { required: true }
  component: { defaultValue: profile }
});
```




