# node-deeplink
[![NPM](https://nodei.co/npm/node-deeplink.png?downloads=true)](https://nodei.co/npm/node-deeplink/)

[![Build Status](https://drone.io/github.com/mderazon/node-deeplink/status.png)](https://drone.io/github.com/mderazon/node-deeplink/latest)

Easily create express endpoint to handle mobile deeplinks in your web server.

Takes away the pain of forwarding users to the right app store / mobile app depending on their platform.

## Use case

Suppose you have a custom url scheme `app://` handled by your mobile apps. You want to create a universal "smart" link that will know where to send the user:
- If the user has the app installed, open the app with the deeplink.
- If the user doesn't have the app installed, send to the app store to download the app (google play / itunes).
- If the user doesn't have a supported phone, send to a fallback url.


## Usage

### Example:
```js
var express = require('express');
var deeplink = require('node-deeplink')

var app = express();

app.get('/deeplink', deeplink({ 
    fallback: 'https://cupsapp.com',
    android_package_name: 'com.citylifeapps.cups', 
    ios_store_link: 'https://itunes.apple.com/us/app/cups-unlimited-coffee/id556462755?mt=8&uo=4',
}));

```
This example creates an endpoint `GET /deeplink` in your web server.

Assuming your server address is `https://acme.org`, you can use the link `https://acme.org/deeplink?url=app://account` so when users will open it the app will open with `app://account` deeplink or the users will be redirected to download the app in case they don't have it.

**Note on url encoding:** to avoid problems with url parsing libraries, the deep link (`app://...` part) has to be url encoded. *node-deeplink* will decode the url correctly. So, in the above example, the link is actually `https://acme.org/deeplink?url=app%3A%2F%2Faccount`. [Here's](http://meyerweb.com/eric/tools/dencoder/) an example of url encoder/decoder.


### Available options
*node-deeplink* currently only supports Android and IOS.

Options to pass on to *node-deeplink* are:
- `fallback`: **mandatory**. A fallback url in case the user is opening the link via an unsupported platform like desktop / windows phone etc. In such case, the fallback url will be opened in the user's browser like a normal link.
- `android_package_name`: **optional**. In case you want to support Android deep links, pass your app's package name.
- `ios_store_link`: **optional**. In case you want to support IOS deep links, pass your app's itunes url. You can get it [here](from https://linkmaker.itunes.apple.com/us/).


### Query params
When a request comes in, the following query params a re checked:
- `url`: **mandatory**. The deeplink url you want the user to be directed to e.g. `app://account`.
- `fallback`: **optional**. If available, will prefer this fallback address over the one from the options.

### Behaviour
*node-deeplink* expects the request to contain a query param `url=...` so that the deeplink mechanism will work. If no such query is present then *node-deeplink* ignores the request and calls `next()` so the request will be handled by the next middleware.

*node-deeplink* works by first sending the user to an html page with a user-agent sniffing script. After figuring out the user's device, it redirects the to the predefined deeplink. In practice, after clicking the link, the browser will be opened for a very short moment and then the redirect will happen.

### TODO
- Better user-agent discovery.
- Enable non-express use.

### Changelog
`v0.1.0`:
-  Added support for fallback url as a query param.
-  Removed some unnecessary dependencies.