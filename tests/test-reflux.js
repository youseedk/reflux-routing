global.location = {hash: ''};

var assert = require('assert');
var Reflux = require('reflux');
var RouteParser = require('../lib/route-parser').default;
var RouteStore = require('../lib/routing-store').default;
var RoutingActions = require('../lib/routing-actions').default;
var Routing = require('../lib/router').default;

describe('Reflux', function() {
  describe('store', function() {

    it('The state should reflect the URL', function() {
      return new Promise((resolve, reject) => {
        Routing.define('testRoute', '/test/:param1/:param2', {});

        RoutingActions.hashUpdated('#!/test/aaa/bbb/');

        Reflux.initStore(RouteStore);

        setTimeout(() => {
          assert.deepEqual(RouteStore.state.testRoute, { param1: 'aaa', param2: 'bbb' } );
          RoutingActions.hashUpdated('#!/test/111/222/');

          setTimeout(() => {
            assert.deepEqual(RouteStore.state.testRoute, { param1: '111', param2: '222' } );
            resolve();
          });

        });

      });
    });

  });

  describe('actions', function() {

  });
});
