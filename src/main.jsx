import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MinecraftItemBuilder from './MinecraftItemBuilder'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MinecraftItemBuilder />
  </StrictMode>,
)
