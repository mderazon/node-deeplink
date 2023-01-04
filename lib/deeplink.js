const fs = require('fs');
const stream = require('stream');
const path = require('path');
const { Transform} = require('stream');
const {inlineSource} = require('inline-source');

module.exports = function (options) {
  options = options || {};
  if (!options.fallback) {
    throw new Error('Error (deeplink): options.fallback cannot be null');
  }
  options.android_package_name = options.android_package_name || '';
  options.ios_store_link = options.ios_store_link || '';
  options.title = options.title || '';

  //html-inline replacement. It returns a writable stream with a transform function that inlines the html file
  function inlineHtmlStream({basedir}) {
    async function inlineHtml(chunk, basedir) {
      try {
        return await inlineSource(chunk.toString(),{
          rootpath: basedir
        });
      } catch (err) {
        throw err;
      }
    }
    return new Transform({
      async transform(chunk, encoding, callback) {
        try {
          const html = await inlineHtml(chunk, basedir);
          this.push(html);
          callback();
        } catch (err) {
          callback(err);
        }
      }
    });
  }

  const deeplink = function (req, res, next) {
    const opts = {};
    Object.keys(options).forEach(function (k) {
      opts[k] = options[k];
    });

    if (req.query.url) {
      opts.url = req.query.url;
    }

    // bail out if we didn't get url
    if (!opts.url) {
      return next();
    }

    if (req.query.fallback) {
      opts.fallback = req.query.fallback;
    }

    // read template file
    const file = fs.createReadStream(
      path.join(__dirname, '/public/index.html')
    );

    // replace all template tokens with values from options
    const detoken = new stream.Transform({ objectMode: true });
    detoken._transform = function (chunk, encoding, done) {
      let data = chunk.toString();
      Object.keys(opts).forEach(function (key) {
        data = data.replace('{{' + key + '}}', opts[key]);
      });

      this.push(data);
      done();
    };

    // inline template js with html
    const inline = inlineHtmlStream({ basedir: path.join(__dirname, '/public') });

    // make sure the page is being sent as html
    res.set('Content-Type', 'text/html;charset=utf-8');

    // read file --> detokenize --> inline js --> send out
    file.pipe(detoken).pipe(inline).pipe(res);
  };

  return deeplink;
};