import React from 'react';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../hooks/useNotifications';

export default function Notifications() {
    const { data: notifications = [], isLoading } = useNotifications();
    const markAsRead = useMarkAsRead();
    const markAllAsRead = useMarkAllAsRead();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

        if (diffInHours < 24) {
            return diffInHours === 0 ? 'Baru saja' : `${diffInHours}j yang lalu`;
        }
        return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead.mutate();
    };

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead.mutate(notification.id);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto flex flex-col gap-8 h-full">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-extrabold text-text-main dark:text-white tracking-tight">Notifikasi</h1>
                <button
                    onClick={handleMarkAllAsRead}
                    disabled={notifications.every(n => n.isRead)}
                    className="text-sm font-bold text-primary hover:underline disabled:opacity-50 disabled:no-underline"
                >
                    Tandai semua sudah dibaca
                </button>
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="bg-white dark:bg-card-dark rounded-2xl p-12 text-center border border-border-light dark:border-border-dark shadow-card">
                        <span className="material-symbols-outlined text-6xl text-text-muted/20 mb-4">notifications_off</span>
                        <h2 className="text-xl font-bold text-text-main dark:text-white">Semua sudah beres!</h2>
                        <p className="text-text-muted mt-2">Anda tidak memiliki notifikasi saat ini.</p>
                    </div>
                ) : (
                    notifications.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleNotificationClick(item)}
                            className={`flex gap-4 p-4 rounded-2xl border transition-all hover:shadow-md cursor-pointer ${!item.isRead
                                ? 'bg-white dark:bg-card-dark border-primary/20 shadow-sm'
                                : 'bg-background-light dark:bg-background-dark border-transparent opacity-70'
                                }`}
                        >
                            <div className={`size-12 shrink-0 rounded-full flex items-center justify-center ${item.type === 'scan_result' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                }`}>
                                <span className="material-symbols-outlined">
                                    {item.type === 'scan_result' ? 'check_circle' : 'notification_important'}
                                </span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className={`text-sm font-bold ${!item.isRead ? 'text-text-main dark:text-white' : 'text-text-muted'}`}>
                                        {item.title}
                                    </h4>
                                    <span className="text-xs text-text-muted">{formatDate(item.createdAt)}</span>
                                </div>
                                <p className="text-sm text-text-secondary mt-1">{item.message}</p>
                            </div>
                            {!item.isRead && <div className="size-2 rounded-full bg-primary mt-2"></div>}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
