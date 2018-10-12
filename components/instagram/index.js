var html = require('choo/html')
var { i18n, srcset } = require('../base')

var text = i18n()

module.exports = instagram

function instagram (props) {
  return html`
    <div class="Instagram">
      <h2 class="Instagram-heading">${props.title}</h2>
      <ol class="Instagram-feed">
        ${props.images.map((image, index, list) => html`
          <li class="Instagram-item" style="z-index: ${list.length - index};">
            <a href="${image.href}" target="_blank" rel="noopener noreferrer">
              <img class="Instagram-image" alt="${image.alt || ''}" sizes="(min-width: 1000px) 300px, 50vw" srcset="${srcset(image.url, [200, 400, 600], { aspect: 1, transform: 'c_thumb' })}" src="/media/fetch/w_400,h_400,c_thumb/${image.url}">
            </a>
          </li>
        `)}
      </ol>
      <a href="${props.href}" target="_blank" rel="noopener noreferrer" class="Instagram-footer">
        <svg class="Instagram-icon" width="21" height="21" viewBox="0 0 21 21">
          <g fill="#0A0B09" fill-rule="evenodd">
            <path fill-rule="nonzero" d="M10.5 0C7.65 0 7.29.03 6.17.08a7.7 7.7 0 0 0-2.55.49c-.69.27-1.27.62-1.86 1.2a5.15 5.15 0 0 0-1.2 1.87 7.7 7.7 0 0 0-.5 2.55A74.46 74.46 0 0 0 0 10.5c0 2.85.01 3.21.06 4.33a7.7 7.7 0 0 0 .5 2.55c.26.69.62 1.27 1.2 1.86.59.58 1.17.94 1.86 1.2a7.7 7.7 0 0 0 2.55.5c1.12.05 1.48.06 4.33.06s3.2-.01 4.32-.06a7.7 7.7 0 0 0 2.55-.5 5.15 5.15 0 0 0 1.86-1.2c.59-.59.94-1.17 1.21-1.86a7.7 7.7 0 0 0 .49-2.55c.05-1.12.06-1.48.06-4.33s0-3.2-.06-4.32a7.7 7.7 0 0 0-.49-2.55 5.15 5.15 0 0 0-1.2-1.86A5.15 5.15 0 0 0 17.36.56a7.7 7.7 0 0 0-2.55-.49A74.46 74.46 0 0 0 10.5.01zm0 1.9c2.8 0 3.13 0 4.24.06a5.8 5.8 0 0 1 1.95.36c.49.2.84.42 1.2.79.37.36.6.71.79 1.2.14.37.31.93.36 1.95.05 1.1.06 1.44.06 4.24 0 2.8 0 3.14-.06 4.24a5.8 5.8 0 0 1-.36 1.95c-.2.5-.42.84-.79 1.21-.36.37-.71.6-1.2.79a5.8 5.8 0 0 1-1.95.36c-1.1.05-1.44.06-4.24.06-2.8 0-3.14-.01-4.24-.06a5.8 5.8 0 0 1-1.95-.36 3.25 3.25 0 0 1-1.21-.79c-.37-.37-.6-.72-.79-1.2a5.8 5.8 0 0 1-.36-1.96c-.05-1.1-.06-1.43-.06-4.24 0-2.8.01-3.13.06-4.24a5.8 5.8 0 0 1 .36-1.95c.2-.49.42-.84.79-1.2.37-.37.72-.6 1.2-.79a5.8 5.8 0 0 1 1.96-.36c1.1-.05 1.43-.06 4.24-.06z"/>
            <path fill-rule="nonzero" d="M10.5 14.07a3.57 3.57 0 1 1 0-7.14 3.57 3.57 0 0 1 0 7.14zm0-9.07a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z"/>
            <path d="M17 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
          </g>
        </svg>
        ${text`Follow us`}
      </a>
    </div>
  `
}
