var view = require('../components/view')

module.exports = view(notFound)

function notFound (state, emit) {
  var err = new Error('Page not found')
  err.status = 404
  if (state.prefetch) {
    state.prefetch.push(Promise.reject(err))
  }
  throw err
}
