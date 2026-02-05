import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';

export const useNotifications = () => {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: notificationService.getAll,
    });
};

export const useUnreadCount = () => {
    return useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: notificationService.getUnreadCount,
        refetchInterval: 30000, // Refetch every 30 seconds
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: notificationService.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};

export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: notificationService.markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};
