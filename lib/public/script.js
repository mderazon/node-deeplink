
function deep_link (options) {
  var fallback = options.fallback || ''
  var url = options.url || ''
  var ios_store_link = options.ios_store_link
  var android_package_name = options.android_package_name
  var play_store_link = 'https://market.android.com/details?id=' + android_package_name

  // split the first :// from the url string
  var split = url.split(/:\/\/(.+)/)
  var scheme = split[0]
  var path = split[1]

  var urls = {
    deep_link: url,
    ios_store_link: ios_store_link,
    android_intent: 'intent://' + path + '#Intent;scheme=' + scheme + ';package=' + android_package_name + ';end;',
    play_store_link: play_store_link,
    fallback: fallback
  }

  var is_mobile = {
    android: function () {
      return /Android/i.test(window.navigator.userAgent)
    },
    ios: function () {
      return /iPhone|iPad|iPod/i.test(window.navigator.userAgent)
    }
  }

  // fallback to the application store on mobile devices
  if (is_mobile.ios() && urls.deep_link && urls.ios_store_link) {
    ios_launch()
  } else if (is_mobile.android() && android_package_name) {
    android_launch()
  } else {
    window.location = urls.fallback
  }

  function launch_webkit_approach (url, fallback) {
    document.location = url
    setTimeout(function () {
      document.location = fallback
    }, 250)
  }

  function launch_iframe_approach (url, fallback) {
    var iframe = document.createElement('iframe')
    iframe.style.border = 'none'
    iframe.style.width = '1px'
    iframe.style.height = '1px'
    iframe.onload = function () {
      document.location = url
    }
    iframe.src = url

    window.onload = function () {
      document.body.appendChild(iframe)

      setTimeout(function () {
        window.location = fallback
      }, 25)
    }
  }

  function ios_launch () {
    // Chrome doesn't allow the iframe approach
    if (navigator.userAgent.match(/CriOS/)) {
      launch_webkit_approach(urls.deep_link, urls.ios_store_link || urls.fallback)
    } else {
      launch_iframe_approach(urls.deep_link, urls.ios_store_link || urls.fallback)
    }
  }

  function android_launch () {
    if (navigator.userAgent.match(/Chrome/)) {
      document.location = urls.android_intent
    } else if (navigator.userAgent.match(/Firefox/)) {
      launch_webkit_approach(urls.deep_link, urls.play_store_link || urls.fallback)
    } else {
      launch_iframe_approach(url, urls.play_store_link || urls.fallback)
    }
  }
}

// expose module so it can be required later in tests
if (typeof module !== 'undefined') {
  module.exports = deep_link
}
