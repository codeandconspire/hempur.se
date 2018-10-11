var FETCH_LINKS = [
  'instagram.link'
]

module.exports = prismicMiddleware

// middleware for prismic requests
// (arr, obj) -> void
function prismicMiddleware (predicates, opts) {
  if (opts.fetchLinks) {
    if (Array.isArray(opts.fetchLinks)) opts.fetchLinks.push(...FETCH_LINKS)
    else opts.fetchLinks = [opts.fetchLinks, ...FETCH_LINKS]
  } else {
    opts.fetchLinks = FETCH_LINKS
  }
}
