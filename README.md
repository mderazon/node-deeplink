# node-deeplink
[![Build Status](https://drone.io/github.com/mderazon/node-deeplink/status.png)](https://drone.io/github.com/mderazon/node-deeplink/latest)

Easily create express endpoint to handle mobile deeplinks in your web server.

Takes away the pain of forwarding users to the right app store / mobile app depending on their platform.

## Use case

Suppose you have a custom url scheme `app://` handled by your mobile apps. You want to create a universal "smart" link that will know where to send the user:
- If the user has the app installed, open the app.
- If the user doesn't have the app installed, send him to the correct app store to download the app (google play / itunes).
- If the user doesn't have a supported phone, send him to a fallback url.


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

Assuming your server address is `https://cupsapp.com`, you can use the link `https://cupsapp.com/deeplink?url=app://account` so when users will open it the app will open with `app://account` deeplink or the users will be redirected to download the app in case they don't have it.

**Note on url encoding:** to avoid problems with url parsing libraries, the deep link (`app://...` part) has to be url encoded. *node-deeplink* will decode the url correctly. So, in the above example, the link is actually `https://cupsapp.com/deeplink?url=app%3A%2F%2Faccount`

### Available options:
*node-deeplink* currently supports Android and IOS only.

Options to pass on to *node-deeplink* are:
- `fallback`: **mandatory**. A fallback url in case the user is opening the link via an unsupported platform like desktop / windows phone etc.
- `android_package_name`: **optional**. In case you want to support Android deep links, pass your app's package name.
- `ios_store_link`: **optional**. In case you want to support IOS deep links, pass your app's itunes url. You can get it [here](from https://linkmaker.itunes.apple.com/us/).


### Behaviour
*node-deeplink* expects the request to contain a query param `url=...` so that the deeplink mechanism will work. If no such query is present then *node-deeplink* ignores the request and calls `next()` so the request will be handled by the next middleware.


### TODO
- Add more robust user-agent discovery.
- Maybe expose rendered html page in api instead of http sending it back to the user.
