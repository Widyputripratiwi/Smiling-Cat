import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePet } from '../hooks/usePets';
import { usePetScans } from '../hooks/useScans';

export default function PetProfile() {
    const { id } = useParams();

    const { data: pet, isLoading: petLoading } = usePet(id);
    const { data: scans = [], isLoading: scansLoading } = usePetScans(id);

    const isLoading = petLoading || scansLoading;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[600px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!pet) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-text-main dark:text-white">Hewan tidak ditemukan</h2>
                <Link to="/my-pets" className="text-primary hover:underline mt-4 inline-block">Kembali ke Kucing Saya</Link>
            </div>
        );
    }



    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            month: date.toLocaleString('id-ID', { month: 'short' }),
            day: date.getDate(),
            full: date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: date.toLocaleTimeString('id-ID', { hour: 'numeric', minute: '2-digit' })
        };
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-text-muted">
                <Link to="/my-pets" className="hover:text-primary transition-colors">Kucing Saya</Link>
                <span className="material-symbols-outlined text-base">chevron_right</span>
                <span className="font-medium text-text-main dark:text-white">{pet.name}</span>
            </nav>

            {/* Profile Header */}
            <div className="bg-white dark:bg-card-dark rounded-[2rem] p-6 lg:p-8 shadow-card border border-border-light dark:border-border-dark">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="w-full lg:w-auto flex justify-center lg:justify-start">
                        <div className="relative">
                            <div className="size-32 sm:size-40 rounded-full overflow-hidden border-4 border-[#fcfaf8] dark:border-background-dark shadow-inner bg-background-light dark:bg-background-dark flex items-center justify-center">
                                {pet.imageUrl ? (
                                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${pet.imageUrl}')` }}></div>
                                ) : (
                                    <span className="material-symbols-outlined text-text-muted text-5xl">pets</span>
                                )}
                            </div>
                            <div className={`absolute bottom-2 right-2 p-1.5 rounded-full border-4 border-white dark:border-card-dark ${pet.status === 'healthy' ? 'bg-green-500' : 'bg-primary'} text-white`}>
                                <span className="material-symbols-outlined text-sm font-bold">
                                    {pet.status === 'healthy' ? 'check' : 'warning'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 text-center lg:text-left">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main dark:text-white tracking-tight mb-2">{pet.name}</h1>
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-text-muted mb-6">
                            <span className="flex items-center gap-1.5 font-medium">
                                <span className="material-symbols-outlined text-primary text-xl">category</span>
                                {pet.breed}
                            </span>
                            <span className="size-1.5 rounded-full bg-current opacity-30"></span>
                            <span className="flex items-center gap-1.5 font-medium">
                                <span className="material-symbols-outlined text-primary text-xl">cake</span>
                                {pet.age}
                            </span>
                            <span className="size-1.5 rounded-full bg-current opacity-30"></span>
                            <span className="flex items-center gap-1.5 font-medium capitalize">
                                <span className="material-symbols-outlined text-primary text-xl">
                                    {pet.gender === 'male' ? 'male' : 'female'}
                                </span>
                                {pet.gender === 'male' ? 'Jantan' : 'Betina'}
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to={`/scanner?petId=${pet.id}`} className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                <span className="material-symbols-outlined">center_focus_strong</span>
                                Mulai Scan AI
                            </Link>
                            <Link to="/history" className="flex items-center justify-center gap-2 bg-white dark:bg-card-dark text-primary border-2 border-primary/20 hover:border-primary hover:bg-primary/5 px-6 py-3 rounded-xl font-bold transition-all">
                                <span className="material-symbols-outlined">history</span>
                                Lihat Riwayat
                            </Link>
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <div className={`px-4 py-2 rounded-xl text-sm font-bold border flex items-center gap-2 ${pet.status === 'healthy'
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/30'
                            : 'bg-primary/10 text-primary border-primary/20'
                            }`}>
                            <span className="material-symbols-outlined">{pet.status === 'healthy' ? 'verified' : 'report'}</span>
                            Status: <span className="capitalize">{pet.status === 'healthy' ? 'Sehat' : 'Perlu Perhatian'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Recent Scans Widget */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-text-main dark:text-white">Hasil Scan Kesehatan Terbaru</h2>
                            <Link to="/results" className="text-sm font-bold text-primary hover:underline">Lihat Semua</Link>
                        </div>
                        <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-card border border-border-light dark:border-border-dark">
                            {scans.length > 0 ? (
                                <div className="relative pl-8 border-l-2 border-border-light dark:border-border-dark space-y-8">
                                    {scans.slice(0, 3).map((scan) => {
                                        const dt = formatDate(scan.scannedAt);
                                        const isHealty = scan.severity === 'normal';
                                        return (
                                            <div key={scan.id} className="relative group">
                                                <div className={`absolute -left-[39px] top-1.5 size-5 rounded-full border-4 border-white dark:border-card-dark ${isHealty ? 'bg-green-500' : 'bg-primary'} shadow-sm z-10`}></div>
                                                <Link to={`/results/${scan.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background-light dark:bg-background-dark p-4 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer border border-transparent hover:border-primary/20">
                                                    <div>
                                                        <p className="text-sm text-text-muted mb-1 font-medium">{dt.full}, {dt.time}</p>
                                                        <h3 className="font-bold text-text-main dark:text-white text-lg">{scan.diagnosis || 'Diagnosis Berhasil'}</h3>
                                                        <p className={`text-sm font-bold mt-1 flex items-center gap-1 ${isHealty ? 'text-green-600 dark:text-green-400' : 'text-primary'}`}>
                                                            <span className="material-symbols-outlined text-sm">{isHealty ? 'check_circle' : 'warning'}</span>
                                                            {isHealty ? 'Tidak ada masalah terdeteksi' : 'Perlu Perhatian'}
                                                        </p>
                                                    </div>
                                                    <span className="material-symbols-outlined text-border-light dark:text-border-dark group-hover:text-primary transition-colors">chevron_right</span>
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <div className="bg-background-light dark:bg-background-dark size-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-text-muted text-3xl">center_focus_strong</span>
                                    </div>
                                    <p className="text-text-muted font-medium">Belum ada hasil scan. Mulai scan kesehatan pertamamu!</p>
                                    <Link to={`/scanner?petId=${pet.id}`} className="text-primary font-bold hover:underline mt-2 inline-block">Ke Scanner</Link>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Daily Care Tips */}
                    <section>
                        <h2 className="text-xl font-bold text-text-main dark:text-white mb-4">Tips Perawatan Harian untuk {pet.name}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-primary/5 dark:bg-primary/10 p-5 rounded-2xl border border-primary/10 hover:border-primary/30 transition-colors">
                                <div className="bg-white dark:bg-card-dark size-10 rounded-full flex items-center justify-center text-primary mb-3 shadow-sm">
                                    <span className="material-symbols-outlined">water_drop</span>
                                </div>
                                <h3 className="font-bold text-text-main dark:text-white mb-1">Hidrasi</h3>
                                <p className="text-sm text-text-muted">Pastikan air bersih selalu tersedia. {pet.name} harus tetap terhidrasi dengan baik.</p>
                            </div>
                            <div className="bg-background-light dark:bg-background-dark p-5 rounded-2xl border border-border-light dark:border-border-dark hover:border-primary/30 transition-colors">
                                <div className="bg-white dark:bg-card-dark size-10 rounded-full flex items-center justify-center text-primary mb-3 shadow-sm">
                                    <span className="material-symbols-outlined">sports_esports</span>
                                </div>
                                <h3 className="font-bold text-text-main dark:text-white mb-1">Waktu Bermain</h3>
                                <p className="text-sm text-text-muted">Bermain interaktif membantu {pet.name} tetap aktif dan sehat.</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column */}
                <div className="space-y-8">

                    {/* Weight Widget */}
                    <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-card border border-border-light dark:border-border-dark">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-text-main dark:text-white">Berat</h2>
                            <span className="text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-md">Ideal</span>
                        </div>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-3xl font-black text-text-main dark:text-white">{pet.weight || '0'}</span>
                            <span className="text-sm font-bold text-text-muted mb-1.5">kg</span>
                        </div>
                        {pet.updatedAt && (
                            <p className="text-xs text-text-muted mb-4">Terakhir diperbarui: {new Date(pet.updatedAt).toLocaleDateString('id-ID')}</p>
                        )}
                        <div className="h-2 w-full bg-background-light dark:bg-background-dark rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[70%] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
