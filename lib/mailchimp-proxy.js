var https = require('https')
var body = require('koa-body')
var { post } = require('koa-route')
var compose = require('koa-compose')
var querystring = require('querystring')

var URL = 'https://codeandconspire.us16.list-manage.com/subscribe/post?u=7d6667fe63e208708b9f6ee8f&id=64b0fb1755'

module.exports = post('/subscribe', compose([body(), middleware]))

async function middleware (ctx) {
  var res = await new Promise(function (resolve, reject) {
    var data = querystring.stringify(ctx.request.body)
    var opts = {
      method: 'POST',
      headers: {
        'Content-Length': Buffer.byteLength(data),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    var req = https.request(URL, opts, function onresponse (res) {
      if (res.statusCode >= 400) {
        var err = new Error(res.statusMessage)
        err.status = res.statusCode
        return reject(err)
      }
      resolve(res)
    })
    req.on('error', reject)
    req.write(data)
    req.end()
  })

  ctx.set('Cache-Control', 'private, no-cache')
  ctx.body = res
}
