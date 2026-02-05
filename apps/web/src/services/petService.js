import { api } from '../lib/api';

export const petService = {
    getAll: async () => {
        const response = await api.get('/pets');
        return response.data?.data || [];
    },

    getById: async (id) => {
        const response = await api.get(`/pets/${id}`);
        return response.data?.data;
    },

    create: async (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) {
                if (key === 'lifestyle' || key === 'conditions') {
                    formData.append(key, JSON.stringify(data[key]));
                } else if (key === 'image') {
                    formData.append('image', data[key]);
                } else {
                    formData.append(key, data[key]);
                }
            }
        });

        const response = await api.post('/pets', formData, {
            headers: { 'Content-Type': undefined }
        });
        return response.data?.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/pets/${id}`, data);
        return response.data?.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/pets/${id}`);
        return response.data;
    }
};
