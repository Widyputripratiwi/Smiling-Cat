import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authClient } from '../../lib/auth-client';

export function Sidebar() {
    const navigate = useNavigate();
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => navigate('/login')
            }
        });
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { name: 'Hewan Peliharaan', path: '/my-pets', icon: 'pets' },
        { name: 'Smart Scanner', path: '/scanner', icon: 'photo_camera_front' },
        { name: 'Riwayat Kesehatan', path: '/history', icon: 'medical_services' },
        { name: 'Pengaturan', path: '/settings', icon: 'settings' },
    ];

    return (
        <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-white dark:bg-background-dark border-r border-border-light dark:border-border-dark flex-shrink-0 transition-colors duration-300 z-40">
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-2xl">pets</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-text-main dark:text-white">Smiling Cat</h1>
                </div>
            </div>
            <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200 group ${isActive
                                ? 'bg-primary text-white shadow-soft font-bold'
                                : 'text-text-muted hover:bg-primary/5 hover:text-primary font-medium'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm">{item.name}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-border-light dark:border-border-dark">
                <div className="bg-background-light dark:bg-card-dark p-4 rounded-2xl flex items-center gap-3 border border-transparent hover:border-primary/20 transition-colors cursor-pointer group">
                    <div className="size-10 rounded-full bg-cover bg-center border-2 border-white dark:border-border-dark group-hover:border-primary transition-colors bg-gray-100 dark:bg-gray-800 flex items-center justify-center" style={{ backgroundImage: user?.image ? `url('${user.image}')` : 'none' }}>
                        {!user?.image && <span className="material-symbols-outlined text-text-muted">person</span>}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <p className="text-sm font-bold text-text-main dark:text-white truncate">{user?.name || 'Pengguna'}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="ml-auto text-text-muted hover:text-primary transition-colors"
                        title="Keluar"
                    >
                        <span className="material-symbols-outlined text-xl">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
