var html = require('choo/html')

module.exports = playground

function playground (state, emit) {
  return html`
    <main class="View-main">
      <article class="u-container">
        <div class="Text">
          <h1>Playground</h1>
          <p>This is the playground page where we can try stuff out. Like <a href="http://blip.nu/">perhaps an inline link</a>, or <strong>strong text</strong>.</p>
          <p>Seems to work just fine ✅ right.</p>
        </div>
      </article>
    </main>
  `
}
