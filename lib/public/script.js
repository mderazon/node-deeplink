function deep_link (options) {
  var fallback = options.fallback || ''
  var url = options.url || ''
  var ios_store_link = options.ios_store_link
  var android_package_name = options.android_package_name
  var play_store_url = 'http://market.android.com/details?id=' + android_package_name

  if (options.referrer) {
    play_store_url += '&referrer=' + encodeURIComponent(options.referrer)
  }

  // split the first :// from the url string
  var split = url.split(/:\/\/(.+)/)
  var scheme = split[0]
  var path = split[1]

  var urls = {
    ios_deep_link: url,
    ios_store_link: ios_store_link,
    android_intent: 'intent://' + path + '#Intent;scheme=' + scheme + ';package=' + android_package_name + ';end;',
    fallback: fallback
  }

  var is_mobile = {
    android: function () {
      return /Android/i.test(window.navigator.userAgent)
    },
    blackberry: function () {
      return /BlackBerry/i.test(window.navigator.userAgent)
    },
    ios: function () {
      return /iPhone|iPad|iPod/i.test(window.navigator.userAgent)
    },
    windows: function () {
      return /IEMobile/i.test(window.navigator.userAgent)
    },
    any: function () {
      return (is_mobile.android() || is_mobile.blackberry() || is_mobile.ios() || is_mobile.windows())
    }
  }

  // fallback to the application store on mobile devices
  if (is_mobile.ios() && urls.ios_deep_link && urls.ios_store_link) {
    ios_launch()
  } else if (is_mobile.android() && android_package_name) {
    android_launch()
  } else {
    window.location = urls.fallback
  }

  function ios_launch () {
    var iframe = document.createElement('iframe')
    iframe.style.border = 'none'
    iframe.style.width = '1px'
    iframe.style.height = '1px'
    iframe.onload = function () {
      document.location = urls.fallback
    }
    iframe.src = urls.ios_deep_link

    window.onload = function () {
      document.body.appendChild(iframe)

      setTimeout(function () {
        window.location = urls.ios_store_link || urls.fallback
      }, 25)
    }
  }

  function android_launch () {
    function launch_iframe_approach (url, alt) {
      var iframe = document.createElement('iframe')
      iframe.style.border = 'none'
      iframe.style.width = '1px'
      iframe.style.height = '1px'
      iframe.onload = function () {
        document.location = alt
      }
      document.body.appendChild(iframe)
    }

    function launch_webkit_approach (url, alt) {
      document.location = url
      setTimeout(function () {
        document.location = alt
      }, 2500)
    }

    if (navigator.userAgent.match(/Chrome/)) {
      document.location = urls.android_intent
    } else if (navigator.userAgent.match(/Firefox/)) {
      launch_webkit_approach(url, play_store_url)
      setTimeout(function () {
        launch_iframe_approach(url, play_store_url)
      }, 1500)
    } else {
      launch_iframe_approach(url, play_store_url)
    }

  }
}

// expose module so it can be required later in tests
if (typeof module !== 'undefined') {
  module.exports = deep_link
}
