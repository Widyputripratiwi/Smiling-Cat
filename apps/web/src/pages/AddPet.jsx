import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatePet } from '../hooks/usePets';
import { BasicInfoForm } from '../components/onboarding/BasicInfoForm';

export default function AddPet() {
    const [petData, setPetData] = useState({});
    const navigate = useNavigate();
    const createPet = useCreatePet();

    const handleNext = async (data) => {
        const updatedData = { ...petData, ...data };
        setPetData(updatedData);

        try {
            const newPet = await createPet.mutateAsync(updatedData);
            if (newPet && newPet.id) {
                navigate('/my-pets');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Failed to create pet:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
            alert('Gagal membuat profil hewan. Silakan coba lagi. (' + errorMessage + ')');
        }
    };

    const handleCancel = () => navigate('/dashboard');

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full flex justify-center animate-[fadeIn_0.5s_ease-out]">
                <BasicInfoForm
                    onNext={(data) => handleNext(data)}
                    onCancel={handleCancel}
                    isLoading={createPet.isPending}
                    submitLabel="Simpan Hewan"
                />
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
