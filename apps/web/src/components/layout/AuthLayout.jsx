import React from 'react';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-200/20 rounded-full blur-[100px]"></div>
            </div>

            <Outlet />
        </div>
    );
}
