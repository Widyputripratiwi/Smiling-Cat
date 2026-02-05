import React from 'react';
import { Link } from 'react-router-dom';
import { usePets } from '../hooks/usePets';

export default function MyPets() {
    const { data: pets = [], isLoading } = usePets();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-text-main dark:text-white tracking-tight leading-tight">Kucing Saya</h1>
                    <p className="text-text-muted mt-2">Ringkasan kesehatan dan profil kucing-kucing Anda</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {pets.map((pet) => (
                    <Link key={pet.id} to={`/my-pets/${pet.id}`} className="group relative bg-white dark:bg-card-dark rounded-3xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center cursor-pointer border border-transparent hover:border-primary/20">
                        <div className="relative mb-5">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#fcfaf8] dark:border-[#2a2622] shadow-inner bg-background-light dark:bg-background-dark flex items-center justify-center">
                                {pet.imageUrl ? (
                                    <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('${pet.imageUrl}')` }}></div>
                                ) : (
                                    <span className="material-symbols-outlined text-text-muted text-5xl">pets</span>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-1 bg-white dark:bg-card-dark p-1.5 rounded-full shadow-sm">
                                <span className="material-symbols-outlined text-primary text-xl">pets</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-text-main dark:text-white mb-1">{pet.name}</h3>
                        <p className="text-text-muted text-sm font-medium mb-4">{pet.breed} • {pet.age}</p>

                        <div className="mt-auto w-full">
                            {pet.status === 'healthy' ? (
                                <div className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full text-sm font-bold border border-green-100 dark:border-green-800/30">
                                    <span className="material-symbols-outlined text-base">check_circle</span>
                                    Sehat
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-bold border border-primary/20 animate-pulse">
                                    <span className="material-symbols-outlined text-base">warning</span>
                                    {pet.status === 'sick' ? 'SAKIT' : 'PERLU PERHATIAN'}
                                </div>
                            )}
                        </div>

                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-text-muted">
                            <span className="material-symbols-outlined">arrow_outward</span>
                        </div>
                    </Link>
                ))}

                {/* Add New Cat Card */}
                <Link to="/add-pet" className="group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border-light dark:border-border-dark bg-transparent min-h-[300px] p-6 transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer">
                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white shadow-sm">
                        <span className="material-symbols-outlined text-4xl">add</span>
                    </div>
                    <h3 className="text-lg font-bold text-text-main dark:text-white mb-2 group-hover:text-primary transition-colors">Tambah Kucing Baru</h3>
                    <p className="text-sm text-text-muted">Buat profil kesehatan baru</p>
                </Link>
            </div>
        </div>
    );
}
