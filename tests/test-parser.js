global.location = {hash: ''};

var assert = require('assert');
var RouteParser = require('../lib/route-parser').default;

describe('Parser', function() {
  describe('state', function() {
    it('Should extract state from a url', function() {
      var route = RouteParser.parseRoute('testRoute', '/test/:param1/:param2', {});
      assert.deepEqual(
        route.state('#!/test/999/888'),
        {
          param1: 999,
          param2: 888
        }
      );
    });

    it('Should use default state when provided', function() {
      var route = RouteParser.parseRoute('testRoute', '/test/:param1/:param2', {
        param2: {
          defaultValue: 'MyDefault'
        }
      });
      assert.deepEqual(
        route.state('#!/test/999'),
        {
          param1: 999,
          param2: 'MyDefault'
        }
      );
    });

    it('Should not use default state if state is set explicitly', function() {
      var route = RouteParser.parseRoute('testRoute', '/test/:param1/:param2', {
        param2: {
          defaultValue: 'MyDefault'
        }
      });
      assert.deepEqual(
        route.state('#!/test/999/notDefault'),
        {
          param1: 999,
          param2: 'notDefault'
        }
      );
    });
  });

  describe('matcher', function() {
    it('Should allow optional prefixed slash', function() {
      var route_no_slash = RouteParser.parseRoute('testRoute_slash', '/test/:param1/:param2', {});
      var route_slash = RouteParser.parseRoute('testRoute_no_slash', 'test/:param1/:param2', {});

      assert(route_no_slash.matches('#!/test/aaa/bbb/'));
      assert(route_slash.matches('#!test/aaa/bbb/'));

    });

    it('Should match partial routes without required fields', function() {
      var route = RouteParser.parseRoute('testRoute', '/test/:param1/:param2', {
        param2: { required: false }
      });

      assert(route.matches('#!/test/aaa')); //Partial match
      assert(route.matches('#!/test/999/888')); //Full match
    });

    it('Should not match urls that are too long', function() {
      var route = RouteParser.parseRoute('testRoute', '/test/x');

      assert(!route.matches('#!/test/x/y')); //Hash has extra token
    });

    it('Should not match partial routes with required field', function() {
      var route = RouteParser.parseRoute('testRoute', '/test/:param1/:param2', {
        param2: { required: true }
      });

      assert(!route.matches('#!/test/aaa')); //Partial match
      assert(route.matches('#!/test/999/888')); //Full match
    });

    it('Should not match incorrect routes', function() {
      var route = RouteParser.parseRoute('testRoute', '/test/:param1/:param2', {});

      assert(!route.matches('#!/not_test/aaa/bbb'));
    });

    it('Should resolve an emty hash to default routes', function() {
      var route = RouteParser.parseRoute('testRoute', ':param1', { param1: { defaultValue: 'TestDefault' } });

      assert(route.matches(''));
      assert.deepEqual(route.state(''), { param1: 'TestDefault' });

    });
  });

  describe('route', function() {

    it('Should store the key', function() {
      var route = RouteParser.parseRoute('testRoute', '/test/:param1/:param2', {});
      assert.equal(route.key, 'testRoute');
    });

    it('Should extract parameters', function() {
      var route = RouteParser.parseRoute('testRoute', '/test/:param1/:param2', {});
      assert.deepEqual(route.params.map(r => r.name), ['param1', 'param2']);
    });

    it('Should allow optional trailing slash', function() {
      var route = RouteParser.parseRoute('testRoute', '/test/:param1/:param2', {});

      assert(route.matches('#!/test/aaa/bbb/')); //With slash
      assert(route.matches('#!/test/999/888')); //Without slash
    });

  });
});
