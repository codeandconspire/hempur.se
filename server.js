if (!process.env.HEROKU) require('dotenv/config')

var url = require('url')
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
app.use(require('./lib/cloudinary-proxy'))

// proxy mailchimp subscriptions
app.use(require('./lib/mailchimp-proxy'))

// disallow robots anywhere but live URL
app.use(get('/robots.txt', function (ctx, next) {
  ctx.type = 'text/plain'
  ctx.body = dedent`
    User-agent: *
    Disallow: ${app.env === 'production' ? '' : '/'}
  `
}))

// redirect non-exiting product listing page
app.use(get('/produkter', function (ctx, next) {
  ctx.status = 302
  ctx.redirect('/')
}))

// add webhook for prismic updates
app.use(post('/prismic-hook', compose([body(), async function (ctx) {
  var secret = ctx.request.body && ctx.request.body.secret
  ctx.assert(secret === process.env.PRISMIC_SECRET, 403, 'Secret mismatch')
  await purge()
  ctx.type = 'application/json'
  ctx.body = {}
}])))

// set preview cookie
app.use(get('/prismic-preview', async function (ctx) {
  var host = process.env.HOST && url.parse(process.env.HOST).host
  if (host && ctx.host !== host) {
    return ctx.redirect(url.resolve(process.env.HOST, ctx.url))
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

if (process.env.HEROKU && app.env === 'production') {
  app.once('bundle:script', function () {
    purge(['/sw.js']).then(start)
  })
} else {
  start()
}

// start server
// () -> void
function start () {
  app.listen(process.env.PORT || 8080)
}
