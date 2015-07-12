/*
  global suite: true
  global test: true
*/

var assert = require('chai').assert
var device = require('./lib/device')
var deeplink = require(__dirname + '/../lib/public/script.js')

var url = 'app://test'
var fallback = 'https://vandelay.com'
var android_package_name = 'ind.vandelay.art'
var ios_store_link = 'https://itunes.apple.com/us/app/art-vandelay/id556462755?mt=8&uo=4'

// mock DOM window
function mock_window (ua) {
  return {
    navigator: {
      userAgent: ua
    },
    location: ''
  }
}

suite('android', function () {
  test('android device should return intent', function (done) {
    var window = mock_window(device.android)
    var deep = deeplink(window)
    deep({
      url: url,
      fallback: fallback,
      android_package_name: android_package_name
    })

    assert.equal(window.location, 'intent://test#Intent;scheme=app;package=ind.vandelay.art;end;')
    done()
  })

  test('android device with no package name defined should return fallback', function (done) {
    var window = mock_window(device.android)
    var deep = deeplink(window)
    deep({
      url: url,
      fallback: fallback
    })

    assert.equal(window.location, fallback)
    done()
  })

})

suite('ios', function () {
  test('ios device should return deep link', function (done) {
    var window = mock_window(device.ios)
    var deep = deeplink(window)
    deep({
      url: url,
      fallback: fallback,
      ios_store_link: ios_store_link
    })

    assert.equal(window.location, url)
    done()
  })

  test('ios device with no deeplink url defined should return fallback', function (done) {
    var window = mock_window(device.ios)
    var deep = deeplink(window)
    deep({
      fallback: fallback,
      ios_store_link: ios_store_link
    })

    assert.equal(window.location, 'https://vandelay.com')
    done()
  })

  test('ios device with deeplink but no app installed should go to app store', function (done) {
    var window = mock_window(device.ios)
    var deep = deeplink(window)
    deep({
      url: url,
      fallback: fallback,
      ios_store_link: ios_store_link
    })

    setTimeout(function () {
      assert.equal(window.location, ios_store_link)
      done()
    }, 30)
  })

})

suite('others', function () {
  test('unsupported device should go to fallback', function (done) {
    var window = mock_window('desktop useragent')
    var deep = deeplink(window)
    deep({
      url: url,
      fallback: fallback
    })

    assert.equal(window.location, fallback)
    done()
  })

})
