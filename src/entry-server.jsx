import { renderToString } from 'react-dom/server'
import App from './App.jsx'

export function render(language) {
  return renderToString(<App language={language} />)
}
