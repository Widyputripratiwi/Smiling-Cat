import { api } from '../lib/api';

export const scanService = {
    findAllByPetId: async (petId) => {
        const response = await api.get(`/scans/pet/${petId}`);
        return response.data.data;
    },

    findById: async (id) => {
        const response = await api.get(`/scans/${id}`);
        return response.data.data;
    },

    create: async (petId, image) => {
        const formData = new FormData();
        formData.append('petId', petId);
        formData.append('image', image);

        const response = await api.post('/scans', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    async getAll() {
        const response = await api.get('/scans');
        return response.data.data;
    },

    getRecentScans: async () => {
        const response = await api.get('/scans');
        // We can slice here if we want or the API could handle it
        return response.data.data;
    },
};
