import { copy } from './content.js'
import { languagePaths } from './i18n.js'

export const siteUrl = 'https://sergeyvalikov.com/'

export function pageMetadata(language) {
  const t = copy[language]
  const canonical = new URL(languagePaths[language], siteUrl).href
  const image = new URL('/portraits/sergey-valikov-hero.jpg', siteUrl).href

  return {
    title: t.pageTitle,
    canonical,
    alternates: { ru: siteUrl, en: new URL('/en/', siteUrl).href, 'x-default': siteUrl },
    meta: [
      ['name', 'robots', 'index, follow, max-image-preview:large'],
      ['name', 'description', t.pageDescription],
      ['property', 'og:type', 'website'],
      ['property', 'og:url', canonical],
      ['property', 'og:site_name', 'Сергей Валиков / Sergey Valikov'],
      ['property', 'og:locale', language === 'en' ? 'en_US' : 'ru_RU'],
      ['property', 'og:locale:alternate', language === 'en' ? 'ru_RU' : 'en_US'],
      ['property', 'og:title', t.pageTitle],
      ['property', 'og:description', t.pageDescription],
      ['property', 'og:image', image],
      ['property', 'og:image:type', 'image/jpeg'],
      ['property', 'og:image:width', '1200'],
      ['property', 'og:image:height', '1211'],
      ['property', 'og:image:alt', t.portraitAlt],
      ['name', 'twitter:card', 'summary'],
      ['name', 'twitter:title', t.pageTitle],
      ['name', 'twitter:description', t.pageDescription],
      ['name', 'twitter:image', image],
      ['name', 'twitter:image:alt', t.portraitAlt],
    ],
    person: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${siteUrl}#person`,
      name: t.footerName,
      alternateName: ['Сергей Сергеевич Валиков', language === 'en' ? 'Сергей Валиков' : 'Sergey Valikov'],
      url: canonical,
      image,
      jobTitle: t.role,
      description: t.aboutParagraphs.slice(0, 2).join(' '),
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: language === 'en' ? 'Boris Shchukin Theatre Institute' : 'Театральный институт имени Бориса Щукина',
      },
      sameAs: ['https://t.me/sergeyvalikov'],
    },
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character])
}

export function renderSeoHead(language) {
  const { title, canonical, alternates, meta, person } = pageMetadata(language)

  return [
    `<title>${escapeHtml(title)}</title>`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    ...Object.entries(alternates).map(([locale, url]) => (
      `<link rel="alternate" hreflang="${locale}" href="${escapeHtml(url)}" />`
    )),
    ...meta.map(([attribute, key, content]) => (
      `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`
    )),
    `<script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ')
}

export function applyPageMetadata(language) {
  const { title, canonical, alternates, meta, person } = pageMetadata(language)
  document.documentElement.lang = language
  document.title = title

  const setElement = (selector, tag, attributes) => {
    let element = document.head.querySelector(selector)
    if (!element) {
      element = document.createElement(tag)
      document.head.appendChild(element)
    }
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value))
    return element
  }

  setElement('link[rel="canonical"]', 'link', { rel: 'canonical', href: canonical })
  Object.entries(alternates).forEach(([locale, href]) => {
    setElement(`link[rel="alternate"][hreflang="${locale}"]`, 'link', {
      rel: 'alternate', hreflang: locale, href,
    })
  })
  meta.forEach(([attribute, key, content]) => {
    setElement(`meta[${attribute}="${key}"]`, 'meta', { [attribute]: key, content })
  })
  const schema = setElement('script[type="application/ld+json"]', 'script', { type: 'application/ld+json' })
  schema.textContent = JSON.stringify(person).replace(/</g, '\\u003c')
}
