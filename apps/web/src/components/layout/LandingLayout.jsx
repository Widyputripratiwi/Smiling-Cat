import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export function LandingLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display overflow-x-hidden">
            <header className="sticky top-0 z-50 w-full border-b border-border-light dark:border-border-dark bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                            <span className="material-symbols-outlined text-2xl">pets</span>
                        </div>
                        <h2 className="text-xl font-bold leading-tight tracking-tight text-text-main dark:text-white">Smiling Cat</h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-bold text-text-main dark:text-white hover:text-primary transition-colors">Masuk</Link>
                        <Link to="/register" className="hidden sm:flex items-center justify-center h-10 px-5 bg-primary hover:bg-primary-hover transition-colors text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20">
                            Mulai Sekarang
                        </Link>
                    </div>
                </div>
            </header>
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="w-full bg-white dark:bg-card-dark border-t border-border-light dark:border-border-dark py-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-text-muted text-sm">© 2024 Smiling Cat Health. Hak cipta dilindungi undang-undang.</p>
                </div>
            </footer>
        </div>
    );
}
