import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Temporarily commented out to debug white screen
// import { Amplify } from 'aws-amplify'
// import awsConfig from './aws-exports'

// Configure Amplify (v6 syntax)
// try {
//   Amplify.configure(awsConfig)
// } catch (error) {
//   console.error("Amplify configuration error:", error)
// }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
