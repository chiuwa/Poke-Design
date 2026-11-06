import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.css'
import './index.css'
import App from './App.tsx'
import { registerWebMcpTools } from './lib/webmcp.ts'

// Register WebMCP tools as early as possible so MCP clients see them
registerWebMcpTools().catch((err) =>
  console.warn('[WebMCP] registration failed:', err)
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
