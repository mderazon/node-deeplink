function deep_link(window) {
  return function(options) {
    var fallback = options.fallback || '';
    var url = options.url || '';
    var ios_store_link = options.ios_store_link;
    var android_package_name = options.android_package_name;

    var split = url.split('://');
    var scheme = split[0];
    var path = split[1];

    var urls = {
      ios_deep_link: url,
      ios_store_link: ios_store_link,
      android_intent: 'intent://' + path + '#Intent;scheme=' + scheme + ';package=' + android_package_name + ';end;',
      fallback: fallback,
    };

    var is_mobile = {
      android: function() {
        return /Android/i.test(window.navigator.userAgent);
      },
      blackberry: function() {
        return /BlackBerry/i.test(window.navigator.userAgent);
      },
      ios: function() {
        return /iPhone|iPad|iPod/i.test(window.navigator.userAgent);
      },
      windows: function() {
        return /IEMobile/i.test(window.navigator.userAgent);
      },
      any: function() {
        return (is_mobile.android() || is_mobile.blackberry() || is_mobile.ios() || is_mobile.windows());
      }
    };


    // fallback to the application store on mobile devices
    if (is_mobile.ios() && urls.ios_deep_link) {
      window.location = urls.ios_deep_link;
      setTimeout(function() {
        window.location = urls.ios_store_link || urls.fallback;
      }, 25);
    } else if (is_mobile.android() && android_package_name) {
      window.location = urls.android_intent;
    } else { 
      window.location = urls.fallback;
    }
  };

}

// expose module so it can be required later in tests
module = module || {};
module.exports = deep_link;