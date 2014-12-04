var express = require('express');
var deeplink = require('../..');
var Browser = require('zombie');

module.exports = function(options) {
  options = options || {};
  var app = express();
  
  app.get('/', deeplink(options));
  app.port = 6000;
  app.instance = app.listen(app.port); // assign to instance so we can call close() later
  app.req = mkdevice(app.port);

  return app;
};


function mkdevice(port) {
  return function req(deeplink, device_type, callback) {
    Browser.localhost('test', port);
    var ua = null;
    
    switch (device_type) {
      case 'android':
        ua = 'Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/_BuildID_) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36';
        break;
      case 'ios': 
        ua = 'Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543 Safari/419.3';
        break;
    }

    var browser = Browser.create();
    browser.userAgent = ua;

    // browser.on('redirect', function(request, response, redirectRequest) {
    //   console.log(request);
    //   console.log(response);
    //   console.log(redirectRequest);
    //   callback(null, request);
    // });

    // browser.on('event', function(event, target) {
    //   console.log('`event` was emitted');
    //   console.log(browser.location.toString());

    // });
    
    // browser.on('evaluated', function(code, result, filename) {
    //   console.log('`evaluated` was emitted');
    //   console.log(code, result, filename);
    // });

    // browser.on('request', function(request) {
    //   console.log('`request` was emitted');
    //   console.log(request);
    // });

    // browser.on('response', function(request, response) {
    //   console.log('`response` was emitted');
    //   console.log(request, response);
    // });

    // browser.on('link', function(url, target) {
    //   console.log('`link` was emitted');
    //   console.log(url, target);
    // });

    browser.visit('/?url=' + deeplink, function(err, browser) {
      
    });
  };
}
