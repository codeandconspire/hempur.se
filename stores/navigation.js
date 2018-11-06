module.exports = navigation

function navigation (state, emitter) {
  var loading = 0
  var hasNavigated = false

  emitter.on('pushState', function () {
    hasNavigated = true
    scrollToTop()
  })

  emitter.on('DOMContentLoaded', function () {
    emitter.on('choo-lazy-view:fetch', function () {
      loading++
    })
    emitter.on('choo-lazy-view:done', function () {
      loading--
      if (loading === 0 && hasNavigated) {
        emitter.once('render', scrollToTop)
      }
    })

    window.addEventListener('click', function (event) {
      var link = event.target
      while (link && link.localName !== 'a') {
        link = link.parentNode
      }
      if (link && link.href === window.location.href) {
        document.body.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, true)
  })

  function scrollToTop () {
    window.requestAnimationFrame(function () {
      if (loading === 0) window.scrollTo(0, 0)
    })
  }
}
