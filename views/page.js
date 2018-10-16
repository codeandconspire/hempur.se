var html = require('choo/html')
var asElement = require('prismic-element')
var { asText } = require('prismic-richtext')
var { srcset, i18n } = require('../components/base')

var text = i18n()

module.exports = page

function page (state, emit) {
  return state.prismic.getByUID('page', state.params.uid, function (err, doc) {
    if (err) throw err
    if (!doc) {
      return html`
        <main class="View-main u-spaceB4">
          <div class="u-container u-spaceB8">
            <div class="Text Text--center">
              <h1 class="Text-label u-spaceB4"><span class="u-loading">${text`Loading`}</span></h1>
              <strong class="Text-h1"><span class="u-loading">${text`Fetching content`}</span></strong>
              <p class="u-spaceT8"><span class="u-loading">${text`This part of the website is being fetched from the internet. If it takes too long – make sure you are connected to the internet.`}</span></p>
            </div>
          </div>
        </main>
      `
    }

    var title = asText(doc.data.title)

    emit('meta', {
      title: `${title} | Hempur`,
      description: asText(doc.data.description),
      'og:image': doc.data.share_image.url
    })

    return html`
      <main class="View-main u-spaceB6">
        <div class="u-container">
          <div class="Text Text--center">
            <h1 class="Text-label u-spaceB4">${title}</h1>
            <strong class="Text-h1">${asText(doc.data.heading)}</strong>
            <p class="u-spaceT8">${asElement(doc.data.description, state.prismic.resolve)}</p>
          </div>
        </div>
        ${doc.data.slices.map(fromSlice)}
      </main>
    `
  })

  // render slice
  // obj -> Element
  function fromSlice (slice, index) {
    switch (slice.slice_type) {
      case 'text': return html`
        <div class="u-container u-spaceV6">
          <div class="Text Text--center">
            ${asElement(slice.primary.text, state.prismic.resolve)}
          </div>
        </div>
      `
      case 'accordion': return html`
        <div class="u-container u-spaceV6">
          <div class="Text Text--center">
            <h2>${asText(slice.primary.heading)}</h2>
            ${slice.items.map((item) => html`
              <details>
                <summary>${asText(item.heading)}</summary>
                <div class="Text Text--muted">
                  ${asElement(item.body)}
                </div>
              </details>
            `)}
          </div>
        </div>
      `
      case 'image': {
        let image = slice.primary.image
        if (!image.url) return null
        return html`
          <div class="u-container u-spaceV8">
            <div class="Text u-sizeFull">
              <img width="${image.width}" height="${image.height}" sizes="(min-width: 1800px) 1800px, 100vw" srcset="${srcset(image.url, [400, 600, 1000, 1800, [2800, 'q_25'], [3600, 'q_25']])}" src="${image.url}" alt="${image.alt || ''}">
            </div>
          </div>
        `
      }
      case 'statement': return html`
        <div class="u-container u-spaceV6">
          <div class="Text Text--center u-textCenter">
            <blockquote>
              ${asText(slice.primary.text)}
            </blockquote>
          </div>
        </div>
      `
      default: return null
    }
  }
}
