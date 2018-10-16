var cccpurge = require('cccpurge')
var Prismic = require('prismic-javascript')

var REPOSITORY = 'https://hempur.cdn.prismic.io/api/v2'

module.exports = purge

async function purge (urls, callback = Function.prototype) {
  if (typeof urls === 'function') {
    callback = urls
    urls = []
  }

  var app = await Promise.resolve(require('../index'))

  return new Promise(function (resolve, reject) {
    cccpurge(app, {
      urls: urls,
      resolve: resolveRoute,
      root: `https://${process.env.npm_package_now_alias}`,
      zone: process.env.CLOUDFLARE_HEMPUR_ZONE,
      email: process.env.CLOUDFLARE_CODEANDCONSPIRE_EMAIL,
      key: process.env.CLOUDFLARE_CODEANDCONSPIRE_KEY
    }, function (err) {
      if (err) return reject(err)
      resolve()
    })
  })
}

function resolveRoute (route, done) {
  switch (route) {
    case '/produkter/:uid': {
      return Prismic.api(REPOSITORY).then(function (api) {
        return api.query(
          Prismic.Predicates.at('document.type', 'product')
        ).then(function (response) {
          done(null, response.results.map((doc) => `/produkter/${doc.uid}`))
        })
      }).catch(done)
    }
    case '/:uid': {
      return Prismic.api(REPOSITORY).then(function (api) {
        return api.query(
          Prismic.Predicates.at('document.type', 'page')
        ).then(function (response) {
          done(null, response.results.map((doc) => `/${doc.uid}`))
        })
      }).catch(done)
    }
    default: done(null)
  }
}
