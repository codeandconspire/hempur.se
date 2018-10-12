var html = require('choo/html')

module.exports = playground

function playground (state, emit) {
  return html`
    <main class="View-main">
      <article class="u-container">
        <div class="Text Text--center">
          <h5>Playground</h5>
          <h1 class="Text-h2">Where is all happens </h1>
          <p>This is the playground page where we can try stuff out. Like <a href="http://blip.nu/">perhaps an inline link</a>, or <strong>strong text</strong>.</p>
          <p>Seems to work just fine ✅ right.</p>
          <p><br/>Kontakta oss här</p>
          <h4>hej@hempur.se <br>+46 701 234 567</h4>
          <h3>Vanliga frågor</h3>
          <details>
            <summary>Känns det som vanligt papper?</summary>
            A keyboard.
          </details>
          <details>
            <summary>Absorberar det bra?</summary>
            A keyboard.
          </details>
          <details>
            <summary>Hur många bambuträd går åt?</summary>
            A keyboard.
          </details>
          <details>
            <summary>Hur kan ni vara säkra på att det är bättre med bambu än träd?</summary>
            A keyboard.
          </details>

          <h3>Om bambu</h3>
          <details>
            <summary>Är det verkligen hållbart?</summary>
            A keyboard.
          </details>
          <details>
            <summary>Hur kan ni vara säkra på att det är bättre med bambu än träd?</summary>
            A keyboard.
          </details>
          <details>
            <summary>Vad är grejen med bambu?</summary>
            A keyboard.
          </details>
        </div>
      </article>
    </main>
  `
}
