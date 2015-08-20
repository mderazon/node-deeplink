var fs = require('fs')
var inliner = require('html-inline')
var stream = require('stream')

module.exports = function (options) {
  options = options || {}
  if (!options.fallback) { throw new Error('Error (deeplink): options.fallback cannot be null') }
  options.android_package_name = options.android_package_name || ''
  options.ios_store_link = options.ios_store_link || ''
  options.title = options.title || ''
  options.ga = options.ga || ''
  options.referrer = options.referrer || ''

  var deeplink = function (req, res, next) {
    var opts = {}
    Object.keys(options).forEach(function (k) { opts[k] = options[k]})

    // bail out if we didn't get url
    if (!req.query.url) {
      return next()
    }
    opts.url = req.query.url

    if (req.query.fallback) {
      opts.fallback = req.query.fallback
    }

    opts._script = [
      'var options = {',
      "fallback: '", opts.fallback, "',",
      "url: '", opts.url, "',",
      "ios_store_link: '", opts.ios_store_link, "',",
      "android_package_name: '", opts.android_package_name, "',",
      "referrer: '", opts.referrer, "'",
      '};',
      'deep_link(options);'
    ].join('')

    if (opts.ga) {
      opts._script = [
        "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){",
        '(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),',
        'm=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)',
        "})(window,document,'script','//www.google-analytics.com/analytics.js','ga');",
        "ga('create', '", opts.ga, "', 'auto');",
        'ga(function (tracker) {',
        "var originalSendHitTask = tracker.get('sendHitTask');",
        "tracker.set('sendHitTask', function(model) {",
        'originalSendHitTask(model);',
        opts._script,
        '});',
        '});',
        "ga('send', 'pageview');"
      ].join('')
    }

    // read template file
    var file = fs.createReadStream(__dirname + '/public/index.html')

    // replace all template tokens with values from options
    var detoken = new stream.Transform({ objectMode: true })
    detoken._transform = function (chunk, encoding, done) {
      var data = chunk.toString()
      Object.keys(opts).forEach(function (key) {
        data = data.replace('{{' + key + '}}', opts[key])
      })

      this.push(data)
      done()
    }

    // inline template js with html
    var inline = inliner({ basedir: __dirname + '/public' })

    // read file --> detokenize --> inline js --> send out
    file.pipe(detoken).pipe(inline).pipe(res)
  }

  return deeplink
}
