var view = require('../components/view')

module.exports = view(notFound)

function notFound () {
  var err = new Error('Page not found')
  err.status = 404
  throw err
}
