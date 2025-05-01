
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// For client-side routing on Netlify, ensure the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found");
    return;
  }

  createRoot(rootElement).render(<App />);
  
  // Debug info for Netlify deployment
  console.log("App mounted successfully");
  console.log("Current path:", window.location.pathname);
});
