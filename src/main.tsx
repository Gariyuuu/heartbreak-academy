import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if (import.meta.env.DEV) {
  import('./game/debug/debugApi').then(({ debugApi }) => {
    ;(window as unknown as { __HBA_DEBUG__: typeof debugApi }).__HBA_DEBUG__ = debugApi
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
