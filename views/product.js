var html = require('choo/html')
var asElement = require('prismic-element')
var { asText } = require('prismic-richtext')
var hero = require('../components/hero')
var float = require('../components/float')
var embed = require('../components/embed')
var button = require('../components/button')
var inventory = require('../components/inventory')
var { i18n, srcset } = require('../components/base')

var text = i18n()

module.exports = product

function product (state, emit) {
  return state.prismic.getByUID('product', state.params.uid, function (err, doc) {
    if (err) throw err
    if (!doc) {
      return html`
        <main class="View-main View-main--stack">
          ${hero.loading()}
          <div class="u-nbfc">
            <div class="u-bgWhite u-bgCurrent" style="height: 100vh;">
            </div>
          </div>
        </main>
      `
    }

    var image = 'v1539262386/hempur/toapapper-rulle_ih9ndb.png'
    var attrs = {
      width: 1018,
      height: 1244,
      sizes: '(min-width: 1000px) 563px, 266px',
      srcset: srcset(image, [300, 500, 900, [1200, 'q_50']], { type: 'upload' }),
      src: `/media/upload/q_auto,w_266/${image}`,
      alt: text`Picture of Hempur toilet roll`
    }

    var title = asText(doc.data.title)
    emit('meta', {
      title: `${title} | Hempur`,
      description: asText(doc.data.description),
      'og:image': doc.data.share_image.url || doc.data.image.url
    })

    return html`
      <main class="View-main View-main--stack">
        ${hero({ subheading: text`Product`, heading: title, image: doc.data.image })}
        <div class="u-nbfc">
          <div class="u-bgWhite u-bgCurrent u-nbfc">
            <div class="u-container u-spaceV8">
              ${inventory(doc.data.attributes)}
            </div>
          </div>
          <div class="u-container u-spaceT3">
            ${float(attrs)}
            <div class="Text Text--center u-spaceV8">
              ${asElement(doc.data.body)}
            </div>
          </div>
          ${doc.data.slices.map(fromSlice)}
          ${doc.data.follow_up_link_text ? html`
            <div class="u-spaceT4 u-nbfc u-bgPaper u-colorPaperLight u-bgGradient">
              <div class="u-spaceV6 u-colorDefault">
                <div class="u-container u-textCenter ">
                  <div class="Text u-sizeFull u-spaceB6">
                    <strong class="Text-label">${doc.data.follow_up_subheading}</strong>
                    <h2 class="Text-h1 u-spaceT2">${asText(doc.data.follow_up_heading)}</h2>
                  </div>
                  ${button({ href: state.prismic.resolve(doc.data.follow_up_link), text: doc.data.follow_up_link_text })}
                </div>
              </div>
            </div>
          ` : null}
        </div>
      </main>
    `
  })

  function fromSlice (slice) {
    switch (slice.slice_type) {
      case 'text': return html`
        <div class="u-container u-spaceV8">
          <div class="Text Text--center">
            ${asElement(slice.primary.text)}
          </div>
        </div>
      `
      case 'image': return html`
        <div class="u-container u-spaceV8">
          <div class="Text u-sizeFull">
            <img width="${slice.primary.image.width}" height="${slice.primary.image.height}" sizes="(min-width: 1800px) 1800px, 100vw" srcset="${srcset(slice.primary.image.url, [400, 600, 1000, 1800, [2800, 'q_25'], [3600, 'q_25']])}" src="${slice.primary.image.url}" alt="${slice.primary.image.alt || ''}">
          </div>
        </div>
      `
      case 'video': return embed({
        url: slice.primary.embed.embed_url,
        title: slice.primary.embed.title
      })
      default: return null
    }
  }
}
