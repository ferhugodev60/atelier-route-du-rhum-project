import { Navigate } from 'react-router-dom';
import {JSX} from "react";

interface ProtectedRouteProps {
    user: { name: string } | null;
    children: JSX.Element;
}

export default function ProtectedRoute({ user, children }: ProtectedRouteProps) {
    // Si l'utilisateur n'est pas connecté, on le redirige vers l'accueil
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Sinon, on affiche le composant enfant (le Dashboard)
    return children;
}