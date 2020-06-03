var express = require('express');
var deeplink = require('..');
var app = express();

// mount deeplink middleware
app.get(
  '/deeplink',
  deeplink({
    fallback: 'http://cupsapp.com',
    android_package_name: 'com.citylifeapps.cups',
    ios_store_link:
      'https://itunes.apple.com/us/app/cups-unlimited-coffee/id556462755?mt=8&uo=4',
  })
);

app.use(express.static('public'));

app.listen(3000);
console.log('deeplink service listening on port 3000');
