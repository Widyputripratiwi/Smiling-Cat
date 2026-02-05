import React from 'react';
import { Link } from 'react-router-dom';
import { useUnreadCount } from '../../hooks/useNotifications';

export function Header() {
    const { data } = useUnreadCount();
    const unreadCount = data?.count || 0;

    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    return (
        <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-border-light dark:border-border-dark">
            <div className="flex items-center gap-4 lg:hidden">
                <span className="material-symbols-outlined text-2xl text-text-main dark:text-white cursor-pointer hover:text-primary transition-colors">menu</span>
                <span className="font-bold text-lg text-text-main dark:text-white">Smiling Cat</span>
            </div>

            <div className="hidden lg:block">
                {/* Search or breadcrumbs could go here */}
            </div>

            <div className="flex items-center gap-4 ml-auto">
                <button
                    onClick={toggleTheme}
                    className="size-10 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark flex items-center justify-center text-text-muted hover:text-primary transition-all hover:shadow-sm"
                >
                    <span className="material-symbols-outlined dark:hidden">dark_mode</span>
                    <span className="material-symbols-outlined hidden dark:block text-yellow-500">light_mode</span>
                </button>

                <Link
                    to="/notifications"
                    className="size-10 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark flex items-center justify-center text-text-muted hover:text-primary transition-all relative hover:shadow-sm"
                >
                    <span className="material-symbols-outlined">notifications</span>
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 size-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-card-dark">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    );
}
