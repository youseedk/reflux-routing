global.location = {hash: ''};
var assert = require('assert');
var Reflux = require('reflux');
var Routing = require('../lib/router').default;

describe('Router', function() {
  it('Should resolve links', function() {
    Routing.define('Test', '/:p1/xxx/:p2', {});
    const url = Routing.link('Test', {
      p1: 'X',
      p2: 'Y'
    });

    assert.equal(url, '#!/X/xxx/Y');
  });

  it('Should resolve links using default values', function () {
    Routing.define('Test', '/:p1/xxx/:p2', {
      p1: {defaultValue: 'default'}
    });

    const url = Routing.link('Test', {
      p2: 'Y'
    });

    assert.equal(url, '#!/default/xxx/Y');
  });

});
