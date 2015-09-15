var Browser = require('zombie')
var express = require('express')
var deeplink = require('../..')

var noop = function () {}

module.exports = function (ua) {
  var obj = {}
  Browser.localhost('localhost', 3000)
  var browser = new Browser()
  browser.userAgent = ua
  var app = express()
  var server

  obj.go = function (url, opts, callback) {
    app.get('/', deeplink(opts))

    server = app.listen(3000)

    var loc = 0
    browser.on('event', function (e, target) {
      if (target.location && e.type === 'load') {
        if (loc === 1) {
          callback(target.location.href)
        }
        loc++
      }
    })

    browser.visit('/?url=' + url, noop)
  }

  obj.close = function () {
    server.close()
  }

  return obj
}
