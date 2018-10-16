var html = require('choo/html')
var asElement = require('prismic-element')
var { asText } = require('prismic-richtext')
var embed = require('../components/embed')
var button = require('../components/button')
var { input } = require('../components/form')
var welcome = require('../components/welcome')
var notice = require('../components/notice')
var features = require('../components/features')
var instagram = require('../components/instagram')
var { i18n, srcset } = require('../components/base')

var text = i18n()

module.exports = home

function home (state, emit) {
  return state.prismic.getSingle('homepage', function (err, doc) {
    if (err) throw err
    if (!doc) {
      return html`
        <main class="View-main View-main--stack">
          ${welcome.loading()}
        </main>
      `
    }

    var heading = asText(doc.data.title)
    var subheading = asText(doc.data.subheading)
    var link = {
      text: doc.data.product_link_text,
      href: state.prismic.resolve(doc.data.product_link)
    }

    return html`
      <main class="View-main View-main--stack">
        ${welcome({ heading, subheading, link })}
        ${notice({ text: text`Hitta återförsäljare`, link: '/#' })}
        ${doc.data.slices.map(fromSlice)}
      </main>
    `

    function fromSlice (slice) {
      switch (slice.slice_type) {
        case 'features': return html`
          <div class="u-spaceT4">
            ${features(slice.items.map((item) => html`
              <div class="Text u-textCenter u-spaceT6 u-spaceH4">
                <img width="150" height="83" sizes="150px" srcset="${srcset(item.image.url, [150, 300], { aspect: 83 / 150 })}" src="/media/fetch/q_auto,w_150,h_83,c_fill/${item.image.url}" alt="${item.image.alt || asText(item.heading)}">
                <h2 class="Text-h3 u-spaceA0">${asText(item.heading)}</h2>
                ${asElement(item.text)}
              </div>
            `))}
            <div class="u-textCenter u-spaceV8">
              ${button({ class: 'Button--invert', href: state.prismic.resolve(slice.primary.link), text: slice.primary.link_text })}
            </div>
          </div>
        `
        case 'partners': {
          let items = slice.items.map(function (item) {
            var image = html`<img class="u-inlineBlock u-spaceV3 u-spaceH2" width="45" height="45" sizes="45px" srcset="${srcset(item.image.url, [50, 100])}" src="/media/fetch/q_auto,w_45,c_fill/${item.image.url}" alt="${item.image.alt || ''}">`

            if (!item.link.url) return image

            var attrs = { href: state.prismic.resolve(item.link) }
            if (item.link.target) attrs.target = item.link.target
            if (item.link.target === '_blank') attrs.rel = 'noopener noreferrer'
            return html`<a ${attrs}>${image}</a>`
          })
          return html`
            <div class="u-nbfc u-textCenter u-bgCurrent u-bgWhite">
              ${items}
            </div>
          `
        }
        case 'video': return embed({
          url: slice.primary.embed.embed_url,
          title: slice.primary.embed.title
        })
        case 'statement': return html`
          <div class="u-spaceV8">
            <div class="u-container">
              <div class="Text u-spaceB6">
                <strong class="Text-label">${slice.primary.label}</strong>
                <h2 class="Text-h1 u-spaceT2">${asText(slice.primary.text)}</h2>
              </div>
              ${button({ class: 'Button--invert', href: state.prismic.resolve(slice.primary.link), text: slice.primary.link_text })}
            </div>
          </div>
        `
        case 'instagram': {
          let items = slice.items.map(function (item) {
            return {
              alt: item.embed.title,
              href: item.embed.embed_url,
              url: item.embed.thumbnail_url
            }
          })

          return html`
            <div class="u-nbfc u-spaceV8">
              <div class="u-container u-spaceV6">
                ${instagram({ title: asText(slice.primary.heading), href: 'https://www.instagram.com/hempurofficial', images: items })}
              </div>
            </div>
          `
        }
        case 'newsletter': {
          return html`
            <div class="u-spaceV8">
              <div class="u-container">
                <div class="u-center">
                  <div class="Text u-textCenter u-spaceB4">
                    <h2 class="Text-h3">${asText(slice.primary.heading)}</h2>
                    ${asElement(slice.primary.text)}
                  </div>
                </div>
                <form method="POST" action="https://codeandconspire.us16.list-manage.com/subscribe/post?u=7d6667fe63e208708b9f6ee8f&id=64b0fb1755" class="Form" onsubmit=${onsubmit}>
                  ${slice.primary.ref ? html`<input type="hidden" name="REF" value="${slice.primary.ref}">` : null}
                  <label class="u-block u-spaceB2">
                    <span class="u-hiddenVisually">${text`Enter your e-mail address`}</span>
                    ${input({ class: 'js-input', name: 'EMAIL', type: 'email', value: '', placeholder: text`Enter your e-mail address` })}
                  </label>
                  ${button({ type: 'submit', class: 'Button--invert js-submit', text: text`Send` })}
                </form>
              </div>
            </div>
          `
        }
        default: return null
      }
    }

    function onsubmit (event) {
      var button = this.querySelector('.js-submit')
      var input = this.querySelector('.js-submit')
      button.disabled = true
      input.disabled = true
      emit('subscribe', new window.FormData(this), this.action)
      event.preventDefault()
    }
  })
}
