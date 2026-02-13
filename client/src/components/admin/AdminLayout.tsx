// client/src/components/admin/AdminLayout.tsx
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Sidebar from './Sidebar';

export default function AdminLayout() {
    const { user } = useAuthStore();

    if (!user || user.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex min-h-screen bg-[#07130e]">
            <Sidebar />
            <main className="flex-1 p-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}