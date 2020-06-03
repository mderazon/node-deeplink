const Browser = require('zombie');
const express = require('express');
const deeplink = require('../..');

const noop = () => {};

module.exports = function (ua) {
  const obj = {};
  Browser.localhost('localhost', 3000);
  const browser = new Browser();
  browser.userAgent = ua;
  const app = express();
  let server;

  obj.go = (url, opts, callback) => {
    app.get('/', deeplink(opts));

    server = app.listen(3000);

    let loc = 0;
    browser.on('event', (e, target) => {
      if (target.location && e.type === 'load') {
        if (loc === 1) {
          callback(target.location.href);
        }
        loc++;
      }
    });

    browser.visit(url ? `/?url=${url}` : '/', noop);
  };

  obj.close = () => {
    server.close();
  };

  return obj;
};
