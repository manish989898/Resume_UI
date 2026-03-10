import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { store } from './reduxToolkit/store.js'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'

// In dev, recover from Vite 504 "Outdated Request" (stale HMR) by reloading the page
if (import.meta.env.DEV) {
  const reloadOnStale = () => { window.location.reload() }
  // Script/module load failure (e.g. main.jsx or chunk returns 504)
  window.addEventListener('error', (e) => {
    const msg = (e.message || '').toLowerCase()
    const isLoadFailure = (e.target && (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')) &&
      (msg.includes('loading') && msg.includes('failed') || msg.includes('importing a module script failed') || !msg)
    if (isLoadFailure) reloadOnStale()
  })
  // Dynamic import / fetch failed (e.g. 504)
  window.addEventListener('unhandledrejection', (e) => {
    const msg = String((e.reason && (e.reason.message || e.reason)) || '').toLowerCase()
    if (msg.includes('failed to fetch') || msg.includes('504') || msg.includes('outdated')) reloadOnStale()
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </StrictMode>,
)
