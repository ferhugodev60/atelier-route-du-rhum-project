import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error("L'élément root n'a pas été trouvé. Vérifiez votre index.html");
}

createRoot(rootElement).render(
    <StrictMode>
        <App />
    </StrictMode>,
)