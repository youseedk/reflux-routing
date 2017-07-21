global.location = {hash: ''};

var assert = require('assert');
var Router = require('../lib/router').default;
var RoutingStore = require('../lib/routing-store').default;
var RoutingActions = require('../lib/routing-actions').default;

describe('Router', function() {
  it('Should be able to define multiple routes', function() {
    Router.define('TestKey', '/x/:x_id');
    Router.define('TestKey', '/y/:y_id');

    RoutingActions.hashUpdated("#!/y/99");
    RoutingActions.hashUpdated("#!/x/98");

    assert.notEqual(RoutingStore.state.TestKey.y_id, "99");
    assert.equal(RoutingStore.state.TestKey.x_id, "98");
  });
});
