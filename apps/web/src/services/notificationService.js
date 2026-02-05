import { api } from '../lib/api';

export const notificationService = {
    getAll: async () => {
        const response = await api.get('/notifications');
        return response.data.data;
    },

    getUnreadCount: async () => {
        const response = await api.get('/notifications/unread-count');
        return response.data.data;
    },

    markAsRead: async (id) => {
        const response = await api.put(`/notifications/${id}/read`);
        return response.data.data;
    },

    markAllAsRead: async () => {
        const response = await api.put('/notifications/read-all');
        return response.data.data;
    },

    delete: async (id) => {
        await api.delete(`/notifications/${id}`);
    },
};
