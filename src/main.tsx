import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ImitacaoPage } from './screens/ImitacaoPage.tsx'

function Root() {
  const path = window.location.pathname
  const match = path.match(/^\/imitacao\/(menino|menina)\/([1-6])$/)

  if (match) {
    const team = match[1] as 'menino' | 'menina'
    const numero = parseInt(match[2])
    return <ImitacaoPage team={team} numero={numero} />
  }

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
