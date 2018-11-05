var https = require('https')
var { parse } = require('url')
var body = require('koa-body')
var { post } = require('koa-route')
var compose = require('koa-compose')
var querystring = require('querystring')

var URL = 'https://hempur.us17.list-manage.com/subscribe/post?u=f370c1cff5e90925d5bbd63fe&id=d0c441a83e'

module.exports = compose([
  store,
  post('/subscribe', compose([body(), middleware]))
])

// expose mailchimp endpoint url on state
// (obj, fn) -> Promise
function store (ctx, next) {
  ctx.state.mailchimp = URL
  return next()
}

// proxy requests through mailchimp endpoint
// (obj, fn) -> Promise
async function middleware (ctx, next) {
  var res = await new Promise(function (resolve, reject) {
    var data = querystring.stringify(ctx.request.body)
    var opts = Object.assign(parse(URL), {
      method: 'POST',
      headers: {
        'Content-Length': Buffer.byteLength(data),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    var req = https.request(opts, function onresponse (res) {
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
  }).catch(err => {
    console.log(err)
    throw err
  })

  ctx.set('Cache-Control', 'private, no-cache')
  ctx.body = res
}
