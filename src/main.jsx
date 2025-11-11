import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

// function DarkModeProvider({ children }) {
//   useEffect(() => {
//     const dark = localStorage.getItem('darkMode') === 'true'
//     document.documentElement.classList.toggle('dark', dark)
//   }, [])

//   return children
// }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
  </StrictMode>,
)
