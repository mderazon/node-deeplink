# node-deeplink [![Build Status](https://travis-ci.org/mderazon/node-deeplink.svg?branch=master)](https://travis-ci.org/mderazon/node-deeplink) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Easily create express endpoint to handle mobile deeplinks in your web server

Takes away the pain of forwarding users to the right app store / mobile app depending on their platform.

## Important update

In ios >= 9, Apple has made it impossible to provide a smooth user experience to redirect user to app / fallback to app store from javascript. Their clear direction is pushing towards using Universal Links instead.

For more details, see [issue #9](https://github.com/mderazon/node-deeplink/issues/9) and [this blog post](http://email.branch.io/ios-9.2-release-important-announcement).

To get the best user experience, it's probably better to look at Universal Links for [ios](https://developer.apple.com/library/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html#//apple_ref/doc/uid/TP40016308-CH12) and App Links for [Android](http://developer.android.com/training/app-links/index.html).

If you already started using Universal Links, you can still use this module as a fallback mechanism for older ios versions.

## Use case

Suppose you have a custom url scheme `app://` handled by your mobile apps. You want to create a universal "smart" link that will know where to send the user:

- If the user has the app installed, open the app with the deeplink.
- If the user doesn't have the app installed, send to the app store to download the app (google play / itunes).
- If the user doesn't have a supported phone, send to a fallback url.

## Usage

### Example:

```js
var express = require('express');
var deeplink = require('node-deeplink');

var app = express();

app.get(
  '/deeplink',
  deeplink({
    fallback: 'https://cupsapp.com',
    android_package_name: 'com.citylifeapps.cups',
    ios_store_link:
      'https://itunes.apple.com/us/app/cups-unlimited-coffee/id556462755?mt=8&uo=4',
  })
);
```

This example creates an endpoint `GET /deeplink` in your web server.

Assuming your server address is `https://acme.org`, you can use the link `https://acme.org/deeplink?url=app://account` so when users will open it the app will open with `app://account` deeplink or the users will be redirected to download the app in case they don't have it.

**Note on url encoding:** to avoid problems with url parsing libraries, the deep link (`app://...` part) has to be url encoded. _node-deeplink_ will decode the url correctly. So, in the above example, the link is actually `https://acme.org/deeplink?url=app%3A%2F%2Faccount`. [Here's](http://meyerweb.com/eric/tools/dencoder/) an example of url encoder/decoder.

### Available options

_node-deeplink_ currently only supports Android and ios.

Options to pass on to _node-deeplink_ are:

- `url`: **mandatory**. The deeplink url you want the user to be directed to e.g. `app://account`.
- `fallback`: **mandatory**. A fallback url in case the user is opening the link via an unsupported platform like desktop / windows phone etc. In such case, the fallback url will be opened in the user's browser like a normal link.
- `android_package_name`: **optional**. In case you want to support Android deep links, pass your app's package name.
- `ios_store_link`: **optional**. In case you want to support ios deep links, pass your app's itunes url. You can get it [here](https://linkmaker.itunes.apple.com/us/).
- `title`: **optional**. Title for the intermediate html page. Defaults to an empty string.

### Query params

When a request comes in, the following query params are checked:

- `url`: **optional**. If available, will prefer this deeplink url over the one from the options.
- `fallback`: **optional**. If available, will prefer this fallback address over the one from the options.

### Behaviour

_node-deeplink_ works by first sending the user to an html page with a user-agent sniffing script. After figuring out the user's device, it redirects them to the predefined deeplink. In practice, after clicking the link, the browser will be opened for a very short moment and then the redirect will happen.

### TODO

- Better user-agent discovery.
- Enable non-express use.
