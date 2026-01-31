import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface Props {
    children: React.ReactNode;
    adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: Props) {
    const { user, token } = useAuthStore();
    const location = useLocation();

    if (!token || !user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (adminOnly && user.role !== 'ADMIN') {
        return <Navigate to="/mon-compte" replace />;
    }

    return <>{children}</>;
}