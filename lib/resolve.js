module.exports = resolve

// resolve document url
// obj -> str
function resolve (doc) {
  switch (doc.type) {
    case 'homepage': return '/'
    case 'page': return `/${doc.uid}`
    case 'product': return `/produkter/${doc.uid}`
    case 'Web':
    case 'Media': return doc.url
    default: {
      // handle links to web and media
      let type = doc.link_type
      if (type === 'Web' || type === 'Media' || type === 'Any') return doc.url
      throw new Error('Document not recognized')
    }
  }
}
