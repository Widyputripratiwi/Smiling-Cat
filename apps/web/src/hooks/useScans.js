import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scanService } from '../services/scanService';

export const usePetScans = (petId) => {
    return useQuery({
        queryKey: ['scans', 'pet', petId],
        queryFn: () => scanService.findAllByPetId(petId),
        enabled: !!petId,
    });
};

export const useScan = (id) => {
    return useQuery({
        queryKey: ['scans', id],
        queryFn: () => scanService.findById(id),
        enabled: !!id,
    });
};

export const useCreateScan = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ petId, image }) => scanService.create(petId, image),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['scans', 'pet', variables.petId] });
            queryClient.invalidateQueries({ queryKey: ['scans', 'recent'] });
            queryClient.invalidateQueries({ queryKey: ['pets'] }); // Scan might update pet status
        },
    });
};

export const useRecentScans = () => {
    return useQuery({
        queryKey: ['scans', 'recent'],
        queryFn: () => scanService.getRecentScans(),
    });
};

export const useAllScans = () => {
    return useQuery({
        queryKey: ['scans', 'all'],
        queryFn: () => scanService.getAll(),
    });
};
