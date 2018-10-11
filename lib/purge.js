var cccpurge = require('cccpurge')
var Prismic = require('prismic-javascript')

var REPOSITORY = 'https://hempur.cdn.prismic.io/api/v2'

module.exports = purge

function purge (urls, callback = Function.prototype) {
  if (typeof urls === 'function') {
    callback = urls
    urls = []
  }

  cccpurge(require('../index'), {
    urls: urls,
    root: 'https://www.hempur.se',
    zone: process.env.CLOUDFLARE_HEMPUR_ZONE,
    email: process.env.CLOUDFLARE_CODEANDCONSPIRE_EMAIL,
    key: process.env.CLOUDFLARE_CODEANDCONSPIRE_KEY
  }, callback)
}
