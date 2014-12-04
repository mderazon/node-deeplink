var create_test_server = require('./lib/test-server');
var assert = require('chai').assert;

test('android device should return play store url', function(done) {
  var server = create_test_server({ 
    fallback: 'https://google.com',
    android_package_name: 'com.citylifeapps.cups', 
    ios_store_link: 'https://itunes.apple.com/us/app/cups-unlimited-coffee/id556462755?mt=8&uo=4',
  });
  
  server.req('cups://invite', 'android', function(err, response) {
    
    done();
  });
});