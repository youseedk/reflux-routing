global.location = {hash: ''};
var assert = require('assert');
var Reflux = require('reflux');
var Routing = require('../lib/router').default;
var RoutingStore = require('../lib/routing-store').default;
var RoutingActions = require('../lib/routing-actions').default;

describe('Router', function() {
  beforeEach(function() {
    Routing.clearState();
  });

  it('Should resolve links', function() {
    Routing.define('Test', '/:p1/xxx/:p2', {});
    const url = Routing.link('Test', {
      p1: 'X',
      p2: 'Y'
    });

    assert.equal(url, '#!X/xxx/Y');
  });

  it('Should resolve links using default values', function () {
    Routing.define('Test', '/:p1/xxx/:p2', {
      p1: {defaultValue: 'default'}
    });

    const url = Routing.link('Test', {
      p2: 'Y'
    });

    assert.equal(url, '#!default/xxx/Y');
  });

  it('Should override default values if an explicit state is specified', function () {
    Routing.define('Test', '/:p1/xxx/:p2', {
      p1: {defaultValue: 'default'}
    });

    const url = Routing.link('Test', {
      p1: 'notDefault',
      p2: 'Y'
    });

    assert.equal(url, '#!notDefault/xxx/Y');
  });

  it('Should handle multiple routes', function () {
    Routing.clearState();

    Routing.define('R1', 'R1/:p1', { p1: {defaultValue: 'default1'} });
    Routing.define('R2', 'R2/:p2', { p2: {defaultValue: 'default2'} });

    RoutingActions.hashUpdated(Routing.link('R1', { p1: 'notDefault1' }));

    const url = Routing.link('R2', { p2: 'notDefault2' });

    assert.equal(url , '#!R1/notDefault1,R2/notDefault2');
  });
});
