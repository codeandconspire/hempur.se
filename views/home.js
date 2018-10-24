var html = require('choo/html')
var asElement = require('prismic-element')
var { asText } = require('prismic-richtext')
var Embed = require('../components/embed')
var Button = require('../components/button')
var { input } = require('../components/form')
var Welcome = require('../components/welcome')
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
          ${Welcome.loading()}
        </main>
      `
    }

    var heading = asText(doc.data.title)
    var subheading = asText(doc.data.subheading)
    var link = {
      text: doc.data.product_link_text,
      href: state.prismic.resolve(doc.data.product_link)
    }

    var noticeLink = {
      text: doc.data.notice_link_text,
      href: state.prismic.resolve(doc.data.notice_link)
    }

    emit('meta', {
      title: 'Hempur',
      description: asText(doc.data.description),
      'og:image': doc.data.share_image.url
    })

    return html`
      <main class="View-main View-main--stack">
        ${state.cache(Welcome, 'homepage-welcome').render({ heading, subheading, link })}
        ${doc.data.slices.map(fromSlice)}
        ${notice(noticeLink)}
      </main>
    `

    function fromSlice (slice, index) {
      switch (slice.slice_type) {
        case 'features': {
          return html`
            <div class="u-container u-spaceT4">
              ${(slice.primary.features_title && slice.primary.text) ? html`
                <div class="Text Text--center u-spaceT12">
                  <h3 class="u-spaceT8">${asText(slice.primary.features_title)}</h3>
                  ${asElement(slice.primary.text)}
                </div>
              ` : null}
              
              ${features(slice.items.map((item) => html`
                <div class="Text u-textCenter">
                  <img width="150" sizes="150px" srcset="${srcset(item.image.url, [150, 300], { aspect: 150 / 200 })}" src="/media/fetch/q_auto,w_300,h_150,c_fill,g_north/${item.image.url}" alt="${item.image.alt}">
                  ${asElement(item.text)}
                </div>
              `))}
              <div class="u-textCenter u-spaceB8">
                ${new Button(`features-button-${index}`).render({ class: 'Button--invert', href: state.prismic.resolve(slice.primary.link), text: slice.primary.link_text })}
              </div>
            </div>
          `
        }
        case 'partners': {
          let items = slice.items.map(function (item) {
            var image = html`<img class="Notice-icon" width="58" height="58" sizes="58px" srcset="${srcset(item.image.url, [50, 100])}" src="/media/fetch/q_auto,w_58,c_fill/${item.image.url}" alt="${item.image.alt || ''}">`

            if (!item.link.url) return image

            var attrs = {
              href: state.prismic.resolve(item.link),
              class: 'Notice-blockLink'
            }
            if (item.link.target) attrs.target = item.link.target
            if (item.link.target === '_blank') attrs.rel = 'noopener noreferrer'
            return html`<a ${attrs}>${image}</a>`
          })
          return html`
            <div class="Notice Notice--white">
              ${items}
            </div>
          `
        }
        case 'video': return state.cache(Embed, `home-video-${index}`).render({
          url: slice.primary.embed.embed_url,
          title: slice.primary.embed.title
        })
        case 'statement': {
          return html`
            <div class="u-spaceV8">
              <div class="u-container">
                <div class="Text Text--center u-spaceB6">
                  <strong class="Text-label">${slice.primary.label}</strong>
                  <h2 class="Text-h1 u-spaceT2">${asText(slice.primary.text)}</h2>
                  ${new Button(`statement-button-${index}`).render({ class: 'Text-ignore Button--invert', href: state.prismic.resolve(slice.primary.link), text: slice.primary.link_text })}
                </div>
              </div>
            </div>
          `
        }
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
                <form method="POST" action="${state.mailchimp}" class="Form" onsubmit=${onsubmit} target="_blank">
                  <fieldset class="js-fieldset">
                    ${slice.primary.ref ? html`<input type="hidden" name="REF" value="${slice.primary.ref}">` : null}
                    <label class="u-block u-spaceB2">
                      <span class="u-hiddenVisually">${text`Enter your e-mail address`}</span>
                      ${input({ class: 'js-input', name: 'EMAIL', type: 'email', value: '', placeholder: text`Enter your e-mail address` })}
                    </label>
                    ${new Button(`newsletter-button-${index}`).render({ type: 'submit', class: 'Button--invert', text: text`Send` })}
                  </fieldset>
                </form>
              </div>
            </div>
          `
        }
        default: return null
      }
    }

    function onsubmit (event) {
      var data = new window.FormData(this)
      var fieldset = this.querySelector('.js-fieldset')
      fieldset.disabled = true
      emit('subscribe', data)
      event.preventDefault()
    }
  })
}
