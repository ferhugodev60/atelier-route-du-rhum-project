import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
    const { user, token } = useAuthStore();
    const location = useLocation();

    // 🏺 1. VÉRIFICATION DE L'IDENTITÉ
    // Si aucun jeton ou utilisateur n'est présent, retour à la porte d'accueil.
    if (!token || !user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // 🏺 2. CONTRÔLE DU SAS DE QUALIFICATION
    // On ne redirige vers le sas QUE si le profil est explicitement "false".
    // Si le champ est "undefined" (anciens comptes), on laisse passer pour éviter les blocages.
    if (user.isProfileComplete === false && location.pathname !== '/completer-profil') {
        return <Navigate to="/completer-profil" replace />;
    }

    // 🏺 3. PROTECTION CONTRE LE REFLUX
    // Si le profil est scellé (true) ou legacy (undefined), le sas est interdit.
    if (user.isProfileComplete !== false && location.pathname === '/completer-profil') {
        return <Navigate to="/boutique" replace />;
    }

    // 🛡️ 4. PRIVILÈGES DE DIRECTION (ADMIN)
    if (adminOnly && user.role !== 'ADMIN') {
        return <Navigate to="/mon-compte" replace />;
    }

    // L'accès à la strate demandée est accordé.
    return <>{children}</>;
}