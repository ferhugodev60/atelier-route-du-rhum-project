import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
    const { user, token } = useAuthStore();
    const location = useLocation();

    // 🏺 Si pas de token ou d'utilisateur, redirection vers l'accueil
    if (!token || !user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // 🛡️ Si route admin et utilisateur simple, redirection vers le dashboard standard
    if (adminOnly && user.role !== 'ADMIN') {
        return <Navigate to="/mon-compte" replace />;
    }

    return <>{children}</>;
}