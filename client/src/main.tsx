import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google'; // 🏺 Nouveau : Le sceau Google
import './styles/index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root');

// 🏺 Récupération de l'ID Client depuis le Registre d'Environnement (.env)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!rootElement) {
    throw new Error("L'élément root n'a pas été trouvé. Vérifiez votre index.html");
}

createRoot(rootElement).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <HelmetProvider>
                <App />
            </HelmetProvider>
        </GoogleOAuthProvider>
    </StrictMode>,
)