var fs = require('fs');
var ejs = require('ejs');
var url = require('url');

module.exports = function(options) {
  options = options || {};
  if (!options.fallback) { throw new Error('Error (deeplink): options.fallback cannot be null'); }

  options.android_package_name = options.android_package_name || '';
  options.ios_store_link = options.ios_store_link || '';

  var deeplink = function(req, res, next) {
    if (!req.query.url) {
      return next();
    }
    var purl = url.parse(req.query.url);
    options.url = purl;

    fs.readFile(__dirname + '/page/index.ejs', 'utf-8', function(err, data) {
      if (err) {
        return next(err);
      }

      res.send(ejs.render(data, options));
    });

  };

  return deeplink;
};
