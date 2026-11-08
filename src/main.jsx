import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { languageFromPath, legacyLanguageTarget } from './i18n.js'

const legacyTarget = legacyLanguageTarget(window.location)
const targetLanguage = legacyTarget && languageFromPath(new URL(legacyTarget, window.location.origin).pathname)
const language = languageFromPath(window.location.pathname)

if (legacyTarget && targetLanguage !== language) {
  window.location.replace(legacyTarget)
} else {
  if (legacyTarget) window.history.replaceState(window.history.state, '', legacyTarget)

  const container = document.getElementById('root')
  const app = <StrictMode><App language={language} /></StrictMode>

  if (container.dataset.prerendered === 'true') {
    hydrateRoot(container, app)
  } else {
    createRoot(container).render(app)
  }
}
