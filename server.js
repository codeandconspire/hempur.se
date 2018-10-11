var url = require('url')
var https = require('https')
var jalla = require('jalla')
var dedent = require('dedent')
var body = require('koa-body')
var compose = require('koa-compose')
var { get, post } = require('koa-route')
var Prismic = require('prismic-javascript')
var purge = require('./lib/purge')
var resolve = require('./lib/resolve')

var REPOSITORY = 'https://hempur.cdn.prismic.io/api/v2'

var app = jalla('index.js', { sw: 'sw.js' })

// proxy cloudinary on-demand-transform API
app.use(get('/media/:type/:transform/:uri(.+)', async function (ctx, type, transform, uri) {
  if (type === 'fetch' && !/^(?:https?:)?\/\//.test(uri)) {
    uri = `https://verdensmaalene.cdn.prismic.io/verdensmaalene/${uri}`
  }

  var res = await new Promise(function (resolve, reject) {
    var url = `https://res.cloudinary.com/dykmd8idd/image/${type}`
    if (transform) url += `/${transform}`
    url += `/${uri}`

    https.get(url, function onresponse (res) {
      if (res.statusCode >= 400) {
        var err = new Error(res.statusMessage)
        err.status = res.statusCode
        return reject(err)
      }
      resolve(res)
    })
  })

  var headers = ['etag', 'last-modified', 'content-length', 'content-type']
  headers.forEach((header) => ctx.set(header, res.headers[header]))
  ctx.set('Cache-Control', `public, max-age=${60 * 60 * 24 * 365}`)
  ctx.body = res
}))

// disallow robots anywhere but live URL
app.use(get('/robots.txt', function (ctx, next) {
  // if (ctx.host === 'dk.globalgoals.org') return next()
  ctx.type = 'text/plain'
  ctx.body = dedent`
    User-agent: *
    Disallow: /
  `
}))

// add webhook for prismic updates
app.use(post('/prismic-hook', compose([body(), function (ctx) {
  var secret = ctx.request.body && ctx.request.body.secret
  ctx.assert(secret === process.env.PRISMIC_VERDENSMAALENE_SECRET, 403, 'Secret mismatch')
  return new Promise(function (resolve, reject) {
    purge(function (err, response) {
      if (err) return reject(err)
      ctx.type = 'application/json'
      ctx.body = {}
      resolve()
    })
  })
}])))

// set preview cookie
app.use(get('/prismic-preview', async function (ctx) {
  var host = process.env.NOW_URL && url.parse(process.env.NOW_URL).host
  if (host && ctx.host !== host) {
    return ctx.redirect(url.resolve(process.env.NOW_URL, ctx.url))
  }

  var token = ctx.query.token
  var api = await Prismic.api(REPOSITORY, { req: ctx.req })
  var href = await api.previewSession(token, resolve, '/')
  var expires = app.env === 'development'
    ? new Date(Date.now() + (1000 * 60 * 60 * 12))
    : new Date(Date.now() + (1000 * 60 * 30))

  ctx.set('Cache-Control', 'max-age=0')
  ctx.cookies.set(Prismic.previewCookie, token, { expires: expires, path: '/' })
  ctx.redirect(href)
}))

// expose origin on state
app.use(function (ctx, next) {
  ctx.state.origin = app.env === 'development'
    ? `http://localhost:${process.env.PORT || 8080}`
    : 'https://www.hempur.se'
  return next()
})

// set cache headers
app.use(function (ctx, next) {
  if (!ctx.accepts('html')) return next()
  var previewCookie = ctx.cookies.get(Prismic.previewCookie)
  if (previewCookie) {
    ctx.state.ref = previewCookie
    ctx.set('Cache-Control', 'max-age=0')
  } else {
    ctx.state.ref = null
  }
  var allowCache = app.env !== 'development'
  if (!previewCookie && allowCache && ctx.path !== '/prismic-preview') {
    ctx.set('Cache-Control', `s-maxage=${60 * 60 * 12}, max-age=${60}`)
  }
  return next()
})

if (process.env.NOW && app.env === 'production') {
  purge(['/sw.js'], function (err) {
    if (err) throw err
    start()
  })
} else {
  start()
}

// start server
// () -> void
function start () {
  app.listen(process.env.PORT || 8080)
}
