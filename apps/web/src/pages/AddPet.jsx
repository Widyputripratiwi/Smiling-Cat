import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatePet } from '../hooks/usePets';
import { StepIndicator } from '../components/onboarding/StepIndicator';
import { BasicInfoForm } from '../components/onboarding/BasicInfoForm';
import { HealthBackgroundForm } from '../components/onboarding/HealthBackgroundForm';

export default function AddPet() {
    const [step, setStep] = useState(1);
    const [petData, setPetData] = useState({});
    const navigate = useNavigate();
    const createPet = useCreatePet();

    const handleNext = async (data) => {
        const updatedData = { ...petData, ...data };
        setPetData(updatedData);

        // If on step 2, create the pet and finish
        if (step === 2) {
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
        } else {
            setStep(step + 1);
        }
    };

    const handleBack = () => setStep(step - 1);
    const handleCancel = () => navigate('/dashboard');

    const stepLabels = {
        1: 'Info Dasar',
        2: 'Riwayat Kesehatan'
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* Step Indicator */}
            <StepIndicator
                currentStep={step}
                totalSteps={2}
                label={stepLabels[step]}
            />

            {/* Step Content */}
            <div className="w-full flex justify-center animate-[fadeIn_0.5s_ease-out]">
                {step === 1 && (
                    <BasicInfoForm
                        onNext={(data) => handleNext(data)}
                        onCancel={handleCancel}
                    />
                )}
                {step === 2 && (
                    <HealthBackgroundForm
                        onNext={(data) => handleNext(data)}
                        onBack={handleBack}
                        isLoading={createPet.isPending}
                    />
                )}
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
