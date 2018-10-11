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
          <p class="Text-large">Large paragraph! Should blend in above 1000px viewport width.</p>
          <h1>Title 1 with a <br />line break</h1>
          <p>Regular paragraph.</p>
          <h2>Title 2 with a <br />line break</h2>
          <p>Regular paragraph.</p>
          <h3>Title 3 with a <br />line break</h3>
          <p>Regular paragraph.</p>
          <h4>Title 4 with a <br />line break</h4>
          <p>Regular paragraph.</p>
          <h5>Title 5, also known as "label", with a <br />line break</h5>
          <p>Regular paragraph.</p>
          <ul>
            <li>Unordered list item</li>
            <li>Unordered list item</li>
          </ul>
          <p>Regular paragraph.</p>
          <ol>
            <li>Ordered list item</li>
            <li>Ordered list item</li>
          </ol>
        </div>
      </article>
    </main>
  `
}
