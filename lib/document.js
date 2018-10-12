var dedent = require('dedent')
var hyperstream = require('hstream')

module.exports = document

function document () {
  return hyperstream({
    'meta[name="viewport"]': {
      content: 'width=device-width, initial-scale=1, viewport-fit=cover'
    },
    'meta[name="theme-color"]': {
      content: '#faf5f3'
    },
    head: {
      _appendHtml: dedent`
        <meta property="og:site_name" content="Hempur">
        <link rel="dns-prefetch" href="https://cdn.polyfill.io">
        <link rel="dns-prefetch" href="https://hempur.cdn.prismic.io">
        <link rel="dns-prefetch" href="https://player.vimeo.com">
        <script>document.documentElement.setAttribute('scripting-enabled', '')</script>
        <link rel="shortcut icon" href="/favicon.ico">
        <link rel="apple-touch-icon" href="/icon.png">
      `
    }
  })
}
