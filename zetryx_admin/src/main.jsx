import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Painelprincipal from "./componentes/app"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Painelprincipal />
  </StrictMode>,
)
