import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Sidebar from './Sidebar';

export default function AdminLayout() {
    const { user } = useAuthStore();

    // 🛡️ Protection du Registre : accès strictement réservé à la direction
    if (!user || user.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return (
        /* 🏺 Fond slate-50 pour un contraste doux avec les cartes blanches */
        <div className="flex min-h-screen bg-slate-50 font-sans">
            <Sidebar />
            <main className="flex-1 h-screen overflow-y-auto p-6 md:p-12">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}