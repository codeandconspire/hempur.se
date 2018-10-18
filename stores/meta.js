module.exports = meta

function meta (state, emitter) {
  state.meta = state.meta ? state.meta : { 'og:url': state.origin }

  emitter.on('meta', function (next) {
    if (next.title !== state.title) emitter.emit('DOMTitleChange', next.title)

    var url = state.origin + state.href
    var tags = Object.assign({ 'og:url': url }, next)
    if (next.title && !next['og:title']) tags['og:title'] = next.title
    delete tags.goal

    if (!tags['og:image']) {
      tags['og:image'] = state.prismic.getSingle('webpage', function (err, doc) {
        if (err) throw err
        return doc.data.share_image.url
      })
    }

    Object.keys(tags).forEach(function (key) {
      if (typeof tags[key] !== 'string') return
      state.meta[key] = tags[key].replace(/^\//, state.origin + '/')
      if (typeof window === 'undefined') return
      var attribute = key.substr(0, 3) === 'og:' ? 'property' : 'name'
      var el = document.head.querySelector(`meta[${attribute}="${key}"]`)
      if (el) el.setAttribute('content', state.meta[key])
    })
  })
}
