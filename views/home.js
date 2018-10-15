var html = require('choo/html')
var asElement = require('prismic-element')
var { asText } = require('prismic-richtext')
var embed = require('../components/embed')
var button = require('../components/button')
var { input } = require('../components/form')
var welcome = require('../components/welcome')
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
        ${doc.data.slices.map(asSlice)}
      </main>
    `

    function asSlice (slice) {
      switch (slice.slice_type) {
        case 'features': return html`
          <div class="u-spaceT6">
            ${slice.items.map((item) => html`
              <div class="Text u-textCenter u-spaceV4 u-spaceH4">
                <img width="135" height="76" sizes="135px" srcset="${srcset(item.image.url, [150, 300], { aspect: 76 / 135 })}" src="/media/fetch/q_auto,w_135,h_76,c_fill/${item.image.url}" alt="${item.image.alt || asText(item.heading)}">
                <h2 class="Text-h3 u-spaceT0">${asText(item.heading)}</h2>
                ${asElement(item.text)}
              </div>
            `)}
            <div class="u-textCenter u-spaceV6">
              ${button({ class: 'Button--invert', href: state.prismic.resolve(slice.primary.link), text: slice.primary.link_text })}
            </div>
          </div>
        `
        case 'partners': {
          var items = slice.items.map(function (item) {
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
                <h2 class="Text-h1 u-spaceT3">${asText(slice.primary.text)}</h2>
              </div>
              ${button({ class: 'Button--invert', href: state.prismic.resolve(slice.primary.link), text: slice.primary.link_text })}
            </div>
          </div>
        `
        default: return null
      }
    }
  })
  //  return html`
  //   <main class="View-main View-main--stack">
  //     ${welcome()}
  //     <!-- slice -->
  //     <div class="Text u-textCenter u-spaceT6">
  //       <div class="u-spaceV4 u-spaceH4">
  //         <img width="135" height="76" src="https://via.placeholder.com/135x76" alt="">
  //         <h2 class="Text-h3 u-spaceT0">Universums mjukaste</h2>
  //         <p>Visste du att bambuträd kan växa upp till en meter om dagen och är en av världens mest förnybara växter?</p>
  //       </div>
  //       <div class="u-spaceV4 u-spaceH4">
  //         <img width="135" height="76" src="https://via.placeholder.com/135x76" alt="">
  //         <h2 class="Text-h3 u-spaceT0">Universums mjukaste</h2>
  //         <p>Visste du att bambuträd kan växa upp till en meter om dagen och är en av världens mest förnybara växter?</p>
  //       </div>
  //       <div class="u-spaceV4 u-spaceH4">
  //         <img width="135" height="76" src="https://via.placeholder.com/135x76" alt="">
  //         <h2 class="Text-h3 u-spaceT0">Universums mjukaste</h2>
  //         <p>Visste du att bambuträd kan växa upp till en meter om dagen och är en av världens mest förnybara växter?</p>
  //       </div>
  //     </div>
  //     <div class="u-textCenter u-spaceV6">
  //       ${button({ class: 'Button--invert', href: '/produkter/toa-6-pack', text: 'All nördig info' })}
  //     </div>
  //     <!-- /slice -->
  //     <!-- slice -->
  //     <div class="u-nbfc u-textCenter u-bgCurrent u-bgWhite">
  //       <img class="u-inlineBlock u-spaceV3 u-spaceH2" width="45" height="45" src="https://via.placeholder.com/45x45" alt="">
  //       <img class="u-inlineBlock u-spaceV3 u-spaceH2" width="45" height="45" src="https://via.placeholder.com/45x45" alt="">
  //       <img class="u-inlineBlock u-spaceV3 u-spaceH2" width="45" height="45" src="https://via.placeholder.com/45x45" alt="">
  //       <img class="u-inlineBlock u-spaceV3 u-spaceH2" width="45" height="45" src="https://via.placeholder.com/45x45" alt="">
  //     </div>
  //     <!-- /slice -->
  //     <!-- slice -->
  //     ${embed({ url: 'https://vimeo.com/85390732', title: 'Fantastiska bambuskogar' })}
  //     <!-- /slice -->
  //     <!-- slice -->
  //     <div class="u-spaceV8">
  //       <div class="u-container">
  //         <div class="Text u-spaceB6">
  //           <strong class="Text-label">Hur allt började</strong>
  //           <h2 class="Text-h1 u-spaceT3">Vi är ett gäng som bryr oss på riktigt</h2>
  //         </div>
  //         ${button({ class: 'Button--invert', href: '/om-hempur', text: 'Läs mer om Hempur' })}
  //       </div>
  //     </div>
  //     <!-- /slice -->
  //     <!-- slice -->
  //     ${embed({ url: 'https://vimeo.com/184953766', title: 'En oförglömlig resa' })}
  //     <!-- /slice -->
  //     <!-- slice -->
  //     <div class="u-spaceV8">
  //       <div class="u-container">
  //         <div class="Text u-textCenter u-spaceB4">
  //           <h2 class="Text-h3">Tävla om en resa med Hempurballongen</h2>
  //           <p>Vill du hänga med på en exklusiv resa med vår ballong? Eller vill du ba ha håll koll på vad vi gör? :)</p>
  //         </div>
  //         <form method="POST" action="/subscribe" class="Form">
  //           <label class="u-block u-spaceB1">
  //             <span class="u-hiddenVisually">${text`Enter your e-mail address`}</span>
  //             ${input({ type: 'email', placeholder: text`Enter your e-mail address` })}
  //           </label>
  //           <br>
  //           ${button({ type: 'submit', class: 'Button--invert', text: text`Send` })}
  //         </form>
  //       </div>
  //     </div>
  //     <!-- /slice -->
  //     <!-- slice -->
  //     <div class="u-nbfc">
  //       <div class="u-container u-spaceV8">
  //         ${/* eslint-disable indent */
  //           instagram({
  //             title: 'skitnajs',
  //             href: 'https://www.instagram.com/hempurofficial',
  //             images: [{
  //               href: 'https://www.instagram.com',
  //               alt: 'Ha en gudomlig dag allihopa önskar vi från Hempur. ❤️🧘🏼‍♂️🌏🎋',
  //               url: 'https://scontent-ort2-1.cdninstagram.com/vp/f30d4ca0c3609d1244e1141aeca6e453/5C462433/t51.2885-15/sh0.08/e35/p640x640/42004132_333072920608887_6477531592628633600_n.jpg'
  //             }, {
  //               href: 'https://www.instagram.com',
  //               alt: 'Ha en gudomlig dag allihopa önskar vi från Hempur. ❤️🧘🏼‍♂️🌏🎋',
  //               url: 'https://scontent-ort2-1.cdninstagram.com/vp/f30d4ca0c3609d1244e1141aeca6e453/5C462433/t51.2885-15/sh0.08/e35/p640x640/42004132_333072920608887_6477531592628633600_n.jpg'
  //             }, {
  //               href: 'https://www.instagram.com',
  //               alt: 'Ha en gudomlig dag allihopa önskar vi från Hempur. ❤️🧘🏼‍♂️🌏🎋',
  //               url: 'https://scontent-ort2-1.cdninstagram.com/vp/f30d4ca0c3609d1244e1141aeca6e453/5C462433/t51.2885-15/sh0.08/e35/p640x640/42004132_333072920608887_6477531592628633600_n.jpg'
  //             }]
  //           })
  //         /* eslint-enable indent */}
  //       </div>
  //     </div>
  //     <!-- /slice -->
  //   </main>
  // `
}
