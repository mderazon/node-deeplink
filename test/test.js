/*
  global describe: true
  global it: true
  global beforeEach: true
  global afterEach: true
*/

var assert = require('chai').assert
var device = require('./lib/device')
var Browser = require('./lib/browser')

var url = 'app://test'
var fallback = 'https://vandelay.com/'
var androidPackageName = 'ind.vandelay.art'
var iosStoreLink = 'https://itunes.apple.com/us/app/art-vandelay/id556462755?mt=8&uo=4'

describe('android', function () {
  var browser

  beforeEach(function () {
    browser = Browser(device.android)
  })

  afterEach(function () {
    browser.close()
  })

  it('should return intent on android device', function (done) {
    browser.go(url, {
      fallback: fallback,
      android_package_name: androidPackageName
    }, function (res) {
      assert.equal(res, 'intent://test#Intent;scheme=app;package=ind.vandelay.art;end;')
      done()
    })
  })

  it('should return the fallback url when no package name defined in android', function (done) {
    browser.go(url, {
      fallback: fallback
    }, function (res) {
      assert.equal(res, fallback)
      done()
    })
  })
})

describe('ios', function () {
  var browser

  beforeEach(function () {
    browser = Browser(device.ios)
  })

  afterEach(function () {
    browser.close()
  })

  it('should return deeplink url on ios device', function (done) {
    browser.go(url, {
      fallback: fallback,
      ios_store_link: iosStoreLink
    }, function (res) {
      assert.equal(res, url)
      done()
    })
  })

  it('should return the fallback url when no ios store link defined in ios', function (done) {
    browser.go(url, {
      fallback: fallback
    }, function (res) {
      assert.equal(res, fallback)
      done()
    })
  })
})

describe('general', function () {
  var browser

  beforeEach(function () {
    browser = Browser()
  })

  afterEach(function () {
    browser.close()
  })

  it('should go to fallback url on an unsupported device', function (done) {
    browser.go(url, {
      fallback: fallback,
      ios_store_link: iosStoreLink,
      android_package_name: androidPackageName
    }, function (res) {
      assert.equal(res, fallback)
      done()
    })
  })
})
