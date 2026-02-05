import React from 'react';
import { Outlet, NavLink, Navigate, useLocation } from 'react-router-dom';
import { authClient } from '../../lib/auth-client';

export function OnboardingLayout() {
    const { data: session, isPending, error } = authClient.useSession();
    const location = useLocation();

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!session?.user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
            <header className="flex items-center justify-between px-6 py-4 bg-white/50 dark:bg-background-dark/50 backdrop-blur-sm sticky top-0 z-50 border-b border-border-light dark:border-border-dark">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-xl">pets</span>
                    </div>
                    <span className="text-lg font-bold text-text-main dark:text-white">Smiling Cat</span>
                </div>
                <NavLink to="/dashboard" className="text-sm font-semibold text-text-muted hover:text-primary transition-colors">
                    Skip for now
                </NavLink>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6">
                <Outlet />
            </main>
        </div>
    );
}
