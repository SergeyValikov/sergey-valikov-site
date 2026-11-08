export const languagePaths = { ru: '/', en: '/en/' }

export function languageFromPath(pathname) {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'ru'
}

export function legacyLanguageTarget({ search, hash }) {
  const parameters = new URLSearchParams(search)
  const requestedLanguage = parameters.get('lang')
  if (requestedLanguage !== 'ru' && requestedLanguage !== 'en') return null

  parameters.delete('lang')
  const query = parameters.toString()
  return `${languagePaths[requestedLanguage]}${query ? `?${query}` : ''}${hash}`
}
