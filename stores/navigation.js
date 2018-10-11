module.exports = navigation

function navigation (state, emitter) {

  emitter.on('pushState', function () {
    window.requestAnimationFrame(function () {
      window.scrollTo(0, 0)
    })
  })

  emitter.on('DOMContentLoaded', function () {
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
}
