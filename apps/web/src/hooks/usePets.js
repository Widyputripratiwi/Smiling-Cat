import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petService } from '../services/petService';

export const usePets = () => {
    return useQuery({
        queryKey: ['pets'],
        queryFn: petService.getAll,
    });
};

export const usePet = (id) => {
    return useQuery({
        queryKey: ['pets', id],
        queryFn: () => petService.getById(id),
        enabled: !!id,
    });
};

export const useCreatePet = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: petService.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['pets']);
        },
    });
};

export const useUpdatePet = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => petService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['pets']);
            queryClient.invalidateQueries(['pets', variables.id]);
        },
    });
};

export const useDeletePet = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: petService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['pets']);
        },
    });
};
