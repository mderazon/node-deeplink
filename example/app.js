var express = require('express');
var deeplink = require('..');
var app = express();

// mount deeplinks middleware
app.get('/deeplink', deeplink({
  fallback: 'http://cupsapp.com',
  android_package_name: 'com.citylifeapps.cups',
  ios_store_link: 'https://itunes.apple.com/us/app/cups-unlimited-coffee/id556462755?mt=8&uo=4',
}));

app.listen(3000);
console.log('deeplink service listening on port 3000');

// now open browser and point it to http://localhost:3000/deeplink?url=cups%3A%2F%2Fmain
// try different browsers (desktop, android, ios)
// remember that the deeplink has to be url encoded