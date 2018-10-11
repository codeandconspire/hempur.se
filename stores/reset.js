module.exports = reset

function reset (state, emitter) {
  // properly reset eventbus on ssr
  if (typeof window === 'undefined') emitter.removeAllListeners()
  emitter.on('DOMTitleChange', function (title) {
    state.title = title
  })

  emitter.on('DOMContentLoaded', function () {
    require('focus-visible')
    require('smoothscroll-polyfill').polyfill()
    let scrollIntoView = window.Element.prototype.scrollIntoView
    window.Element.prototype.scrollIntoView = function (opts) {
      if (typeof opts === 'boolean') {
        if (opts) opts = { block: 'start', inline: 'nearest' }
        else opts = { block: 'end', inline: 'nearest' }
      }
      opts = opts || {}
      opts.behavior = opts.behavior || 'smooth'
      return scrollIntoView.call(this, opts)
    }
  })

  // prevent leaking component state in-between renders
  state.components = Object.create({
    toJSON () {
      return {}
    }
  })

  // ensure document language
  state.language = 'sv'
}
