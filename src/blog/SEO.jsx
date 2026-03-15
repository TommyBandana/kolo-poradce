import { useEffect } from 'react'

export function SEO({ title, description, canonical }) {
  useEffect(() => {
    // Title
    document.title = title || 'Průvodce výběrem kola'

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', description || '')

    // Canonical
    let link = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', canonical)
    } else if (link) {
      link.remove()
    }

    // Open Graph
    setMeta('og:title', title)
    setMeta('og:description', description)
    setMeta('og:type', 'article')

    return () => {
      document.title = 'Průvodce výběrem kola'
    }
  }, [title, description, canonical])

  return null
}

function setMeta(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`)
  if (content) {
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute('property', property)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  } else if (el) {
    el.remove()
  }
}
