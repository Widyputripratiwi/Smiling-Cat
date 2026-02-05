import React, { createContext, useState, useContext } from 'react';

const PetContext = createContext();

export const usePets = () => useContext(PetContext);

export const PetProvider = ({ children }) => {
    const [pets, setPets] = useState([
        {
            id: 'mochi',
            name: 'Mochi',
            breed: 'Calico',
            age: '3 Years',
            gender: 'female',
            status: 'Healthy',
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnFVkl5bU6jZe2xWtLF9PY1l7qTuXCoYQ_XhqQPz76HgSuIJYmvX_VtSu3ho2vkFzK-aDaKCT9ybcsAOfAf8U9bpb6b513mgBA3ASwl6po7etPZpF4RaJS0yiAYOUzLJ0OEPOza7DoO7xSdBA_zjCnBmOarzK8nrgIhlM8WrkC9F6WXTmxfL_CkXLpJNwFoXvXsuMDBUkf5isxRUmMo4NtTdjgr-x6yOwm2B1HPGHURrDCj_tYBwTmeBxHB4EI1l_LsENm9O1fFOdC'
        },
        {
            id: 'luna',
            name: 'Luna',
            breed: 'Domestic Shorthair',
            age: '7 Years',
            gender: 'female',
            status: 'Needs Scan',
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO83vN9op84ABw6b_ptZ6MCmFSHvxal9g6lTdmRGlUnzJFGgjUu1RpNsVi604fkOmL_UUAi7RwDMRRTNvYHMyMJUVqZxZ7s9TbC-ejuQgDVJcRCzTWjmrsyRR2j2TuWVGNbFlMEMQOAD-duYuYmzM41ViJM_iuPqXdE6IaN0bh844FW7YyckwvRpnfVhQoI8Xob8ZD4vUWrnfgF6glz0xDIdIPSfOW-8y36L9cMnzRiHpHfXAR0_g_VTuX0XZMP5i0BKJkyXCTDpw4'
        },
        {
            id: 'simba',
            name: 'Simba',
            breed: 'Maine Coon',
            age: '1 Year',
            gender: 'male',
            status: 'Healthy',
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKQ1zb7k3s9VZCNw5OlRXyeS7QvzjomnTjXHpOQTNHrrAozmTw8gRno442dKK_a8CJq-x33-OsSbrtdqCiVbPitEX66Edf9F6UYtWVao8hRipUG2jbM_Tqp3UNi-og4gz0FhUf-JGaMbkotX3WyYseygGICqmYmA_AidKruHXLXvZPvIrFBh0uVMeY5VaOygSqOW0tymaFHcFOLQTAQ2UMMXZPTVBT0fhamsg9UgzYdtlHaqxnWfDvaPZMu8OFnAUkk8FxX-OX1Mk6'
        }
    ]);

    const addPet = (newPet) => {
        setPets([...pets, { ...newPet, id: Date.now().toString(), status: 'Healthy', img: 'https://placedog.net/500/500?id=' + Math.floor(Math.random() * 100) }]); // Placeholder image
    };

    return (
        <PetContext.Provider value={{ pets, addPet }}>
            {children}
        </PetContext.Provider>
    );
};
