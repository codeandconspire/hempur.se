var choo = require('choo')
var View = require('./components/view')

var REPOSITORY = 'https://hempur.cdn.prismic.io/api/v2'
var app = choo({ hash: false })

app.use(require('./stores/reset'))
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  app.use(require('choo-devtools')())
  app.use(require('choo-service-worker/clear')())
}
app.use(require('choo-service-worker')('/sw.js'))
app.use(require('./stores/navigation'))
app.use(require('./stores/prismic')({
  repository: REPOSITORY,
  middleware: require('./lib/prismic-middleware'),
  resolve: require('./lib/resolve')
}))
app.use(require('./stores/meta'))

app.route('/', View.create(() => import('./views/home')))
app.route('/produkter/:uid', View.create(() => import('./views/product')))
app.route('/:uid', View.create(() => import('./views/page')))

if (process.env.NODE_ENV === 'development') {
  app.route('/playground', View.create(() => import('./views/playground')))
}

try {
  module.exports = View.mount(app, 'body')
} catch (err) {
  if (typeof window !== 'undefined') {
    document.documentElement.removeAttribute('scripting-enabled')
    document.documentElement.setAttribute('scripting-initial-only', '')
  }
}
