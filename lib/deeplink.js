var fs = require('fs');
var ejs = require('ejs');
var url = require('url');
var inliner = require('html-inline');
var concat = require('concat-stream');

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
    options.url = purl.href;

    var inline = inliner({ basedir: __dirname + '/public' });
    var r = fs.createReadStream(__dirname + '/public/index.ejs');
    r.pipe(inline).pipe(concat(function (body) {
      var page = body.toString('utf8');
      res.send(ejs.render(page, options));
    }));
    
  };

  return deeplink;
};
