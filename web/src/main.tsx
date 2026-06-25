import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Preloader from './components/Preloader.tsx'
import './styles.css'

function Root() {
  const [loading, setLoading] = useState(true)
  return (
    <>
      {loading && <Preloader onDone={() => setLoading(false)} />}
      <App />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
