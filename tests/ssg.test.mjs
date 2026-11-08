import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { copy } from '../src/content.js'
import { languageFromPath, legacyLanguageTarget } from '../src/i18n.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const dist = join(root, 'dist')
const decode = (text) => text.replace(/&(?:amp|lt|gt|quot|#39|#x27);/g, (entity) => ({
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&#x27;': "'",
})[entity])

test('the pathname determines the language independently of remembered preferences', () => {
  assert.equal(languageFromPath('/'), 'ru')
  assert.equal(languageFromPath('/index.html'), 'ru')
  assert.equal(languageFromPath('/en/'), 'en')
  assert.equal(languageFromPath('/en'), 'en')
  assert.equal(languageFromPath('/en/index.html'), 'en')
})

test('legacy language links migrate once, retain other parameters and reject invalid values', () => {
  assert.equal(legacyLanguageTarget(new URL('https://sergeyvalikov.com/?lang=en')), '/en/')
  assert.equal(legacyLanguageTarget(new URL('https://sergeyvalikov.com/en/?lang=ru')), '/')
  assert.equal(legacyLanguageTarget(new URL('https://sergeyvalikov.com/?debug=1&lang=en#works')), '/en/?debug=1#works')
  for (const query of ['', '?lang=de', '?lang=constructor', '?lang=__proto__']) {
    assert.equal(legacyLanguageTarget(new URL(`https://sergeyvalikov.com/en/${query}`)), null)
  }
})

for (const language of ['ru', 'en']) {
  const pathname = language === 'ru' ? '/' : '/en/'
  const canonical = `https://sergeyvalikov.com${pathname}`

  test(`${pathname} contains the complete biography and all work categories without executing JS`, async () => {
    const html = await readFile(join(dist, language === 'ru' ? 'index.html' : 'en/index.html'), 'utf8')
    assert.ok(html.includes(`<html lang="${language}">`))
    assert.ok(html.includes('data-prerendered="true"'))
    const biography = html.match(/<div class="about-text">([\s\S]*?)<\/div>/)?.[1]
    assert.ok(biography, 'biography must be rendered as page content')
    const paragraphs = [...biography.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((match) => decode(match[1]))
    assert.deepEqual(paragraphs, copy[language].aboutParagraphs)

    const headings = [...html.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/g)]
      .map((match) => decode(match[1].replace(/<[^>]*>/g, '')))
    const works = language === 'ru'
      ? ['CONDUCTOR', '13:7', 'СТЕКЛЯННЫЙ ЗВЕРИНЕЦ', 'ЧУДО СВЯТОГО АНТОНИЯ']
      : ['CONDUCTOR', '13:7', 'THE GLASS MENAGERIE', 'THE MIRACLE OF SAINT ANTHONY']
    for (const title of [...works, copy[language].televisionGalleryLabel, copy[language].mediaTitle]) {
      assert.ok(headings.includes(title), `missing heading: ${title}`)
    }
    const media = html.match(/<section class="media-section"[\s\S]*?<\/section>/)?.[0]
    assert.equal([...media.matchAll(/<h3>/g)].length, 3, 'all three interview headings must be present')
    assert.equal([...html.matchAll(/role="tabpanel"/g)].length, 3)
    for (const category of ['cinema', 'theatre', 'television']) {
      assert.ok(html.includes(`aria-controls="works-panel-${category}"`))
      const panel = html.match(new RegExp(`<div class="works-panel works-panel--${category}"[^>]*>`))?.[0]
      assert.ok(panel)
      assert.equal(panel.includes('hidden=""'), category !== 'cinema')
    }
  })

  test(`${pathname} has its own canonical, metadata, Person and reciprocal language alternatives`, async () => {
    const html = await readFile(join(dist, language === 'ru' ? 'index.html' : 'en/index.html'), 'utf8')
    assert.equal([...html.matchAll(/rel="canonical"/g)].length, 1)
    assert.ok(html.includes(`<link rel="canonical" href="${canonical}"`))
    for (const [locale, href] of [['ru', 'https://sergeyvalikov.com/'], ['en', 'https://sergeyvalikov.com/en/'], ['x-default', 'https://sergeyvalikov.com/']]) {
      assert.ok(html.includes(`<link rel="alternate" hreflang="${locale}" href="${href}"`))
    }
    assert.equal(decode(html.match(/<title>(.*?)<\/title>/)?.[1]), copy[language].pageTitle)
    assert.equal(decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1]), copy[language].pageDescription)
    assert.ok(html.includes(`<meta property="og:url" content="${canonical}"`))
    assert.ok(html.includes(`<meta property="og:locale" content="${language === 'ru' ? 'ru_RU' : 'en_US'}"`))
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1])
    assert.equal(schema['@type'], 'Person')
    assert.equal(schema['@id'], 'https://sergeyvalikov.com/#person')
    assert.equal(schema.url, canonical)
    assert.equal(schema.name, copy[language].footerName)
    assert.equal(schema.description, copy[language].aboutParagraphs.slice(0, 2).join(' '))
    assert.deepEqual(schema.sameAs, ['https://t.me/sergeyvalikov'])
    assert.equal(schema.award, undefined)
    assert.equal(schema.birthDate, undefined)
    assert.equal(schema.nationality, undefined)
    for (const path of [...html.matchAll(/(?:src|href|poster)="(\/[^"?#]*)"/g)].map((match) => match[1])) {
      if (path === '/' || path === '/en/') continue
      await access(join(dist, path.slice(1)))
    }
  })
}

test('sitemap lists only the two actual pages, and robots permits crawling them and their assets', async () => {
  const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8')
  assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]), [
    'https://sergeyvalikov.com/', 'https://sergeyvalikov.com/en/',
  ])
  const robots = await readFile(join(dist, 'robots.txt'), 'utf8')
  assert.ok(robots.includes('Allow: /'))
  assert.ok(robots.includes('Sitemap: https://sergeyvalikov.com/sitemap.xml'))
  assert.ok(!robots.includes('Disallow: /'))
})
