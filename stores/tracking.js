/* global gtag */

module.exports = tracking

function tracking (state, emitter) {
  emitter.on('navigate', function () {
    if (typeof window.gtag === 'function') {
      gtag('config', 'UA-125816005-1', {
        'page_path': window.location.pathname,
        'page_location': window.location.href
      })
    }
  })
}
