var html = require('choo/html')
var asElement = require('prismic-element')
var { asText } = require('prismic-richtext')

module.exports = page

function page (state, emit) {
  return state.prismic.getByUID('page', state.params.uid, function (err, doc) {
    if (err) throw err
    return html`
      <main class="View-main">
        <div class="u-container">
          <div class="Text">
            <h1 class="Text-label u-spaceB4">${asText(doc.data.title)}</h1>
            <small class="Text-h1">${asText(doc.data.heading)}</small>
            <p>${asElement(doc.data.description, state.prismic.resolve)}</p>
          </div>
        </div>
        ${doc.data.slices.map(fromSlice)}
      </main>
    `
  })

  // render slice
  // obj -> Element
  function fromSlice (slice) {
    switch (slice.slice_type) {
      case 'text': return html`
        <div class="Text">
          ${asElement(slice.primary.text, state.prismic.resolve)}
        </div>
      `
      default: return null
    }
  }
}
