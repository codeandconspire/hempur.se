var html = require('choo/html')
var { srcset } = require('../base')

module.exports = instagram

function instagram (props) {
  return html`
    <div class="Instagram">
      <h2 class="Instagram-heading">${props.title}</h2>
      <ol class="Instagram-feed">
        ${props.images.map((image) => html`
          <li>
            <img alt="${image.alt || ''}" sizes="(min-width: 1000px) 300px, 50vw" srcset="${srcset(image.url, [200, 400, 600], { aspect: 1, transform: 'c_thumb' })}" src="/media/fetch/w_400,h_400,c_thumb/${image.url}">
          </li>
        `)}
      </ol>
    </div>
  `
}
