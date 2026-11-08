import { build } from 'vite'
import { mkdtemp, readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { languagePaths } from '../src/i18n.js'
import { renderSeoHead } from '../src/seo.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const dist = join(root, 'dist')
const temporaryDirectory = await mkdtemp(join(root, 'node_modules/.ssg-'))

try {
  await build({ root })
  const template = await readFile(join(dist, 'index.html'), 'utf8')

  await build({
    root,
    build: {
      ssr: join(root, 'src/entry-server.jsx'),
      outDir: temporaryDirectory,
      emptyOutDir: true,
      copyPublicDir: false,
      rolldownOptions: { output: { entryFileNames: 'entry-server.mjs' } },
    },
  })

  const { render } = await import(pathToFileURL(join(temporaryDirectory, 'entry-server.mjs')).href)
  const headPattern = /<!--seo-head:start-->[\s\S]*?<!--seo-head:end-->/
  if (!headPattern.test(template) || !template.includes('<div id="root"></div>')) {
    throw new Error('The HTML template is missing its SEO or app insertion point.')
  }

  for (const [language, pathname] of Object.entries(languagePaths)) {
    const html = template
      .replace('<html lang="ru">', `<html lang="${language}">`)
      .replace(headPattern, () => renderSeoHead(language))
      .replace('<div id="root"></div>', () => `<div id="root" data-prerendered="true">${render(language)}</div>`)
    const directory = join(dist, pathname.slice(1))
    await mkdir(directory, { recursive: true })
    await writeFile(join(directory, 'index.html'), html)
    console.info(`SSG: ${pathname} → ${join(pathname, 'index.html')}`)
  }
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true })
}
