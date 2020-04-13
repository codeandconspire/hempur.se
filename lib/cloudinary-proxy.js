var https = require('https')
var { get } = require('koa-route')
var cloudinary = require('cloudinary')

cloudinary.config({
  secure: true,
  cloud_name: 'dykmd8idd',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

module.exports = get('/media/:type/:transform/:uri(.+)', middleware)

async function middleware (ctx, type, transform, uri) {
  if (type === 'fetch' && !/^https?/.test(uri)) {
    uri = `https://hempur.cdn.prismic.io/hempur/${uri}`
  }

  var res = await new Promise(function (resolve, reject) {
    var opts = { type: type, sign_url: true }
    if (transform) opts.raw_transformation = transform
    var url = cloudinary.url(uri, opts)

    var req = https.get(url, function onresponse (res) {
      if (res.statusCode >= 400) {
        var err = new Error(res.statusMessage)
        err.status = res.statusCode
        return reject(err)
      }
      resolve(res)
    })
    req.on('error', reject)
    req.end()
  })

  var headers = ['etag', 'last-modified', 'content-length', 'content-type']
  headers.forEach((header) => ctx.set(header, res.headers[header]))
  ctx.set('Cache-Control', `public, max-age=${60 * 60 * 24 * 365}`)
  ctx.body = res
}
