import React from 'react';
import { Link } from 'react-router-dom';
import { usePets } from '../hooks/usePets';
import { useRecentScans } from '../hooks/useScans';
import { authClient } from '../lib/auth-client';

export default function Home() {
    const { data: user } = authClient.useSession();
    const { data: pets = [], isLoading: petsLoading } = usePets();
    const { data: scans = [], isLoading: scansLoading } = useRecentScans();

    const firstName = user?.user?.name?.split(' ')[0] || 'Sobat';

    const activePetsCount = pets.length;
    const attentionNeededPets = pets.filter(p => p.status !== 'healthy').length;
    const latestScan = scans[0];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ', ' +
            date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-main dark:text-white tracking-tight">Selamat {new Date().getHours() < 12 ? 'Pagi' : new Date().getHours() < 18 ? 'Siang' : 'Malam'}, {firstName}! 👋</h1>
                    <p className="text-text-muted mt-1">Berikut adalah kabar terbaru dari keluarga berbulumu hari ini.</p>
                </div>
                <Link to="/scanner" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined">center_focus_strong</span>
                    <span>Scan Sekarang</span>
                </Link>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-card border border-border-light dark:border-border-dark flex items-center gap-4">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-2xl">pets</span>
                    </div>
                    <div>
                        <p className="text-text-muted text-xs font-bold uppercase tracking-wider">Hewan Aktif</p>
                        <p className="text-2xl font-black text-text-main dark:text-white">{activePetsCount}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-card border border-border-light dark:border-border-dark flex items-center gap-4">
                    <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                        <span className="material-symbols-outlined text-2xl">health_and_safety</span>
                    </div>
                    <div>
                        <p className="text-text-muted text-xs font-bold uppercase tracking-wider">Status Kesehatan</p>
                        <p className="text-2xl font-black text-text-main dark:text-white">{attentionNeededPets === 0 ? 'Optimal' : `${attentionNeededPets} Peringatan`}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-card border border-border-light dark:border-border-dark flex items-center gap-4">
                    <div className="size-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <span className="material-symbols-outlined text-2xl">calendar_month</span>
                    </div>
                    <div>
                        <p className="text-text-muted text-xs font-bold uppercase tracking-wider">Scan Terakhir</p>
                        <p className="text-2xl font-black text-text-main dark:text-white truncate max-w-[120px]">
                            {latestScan ? new Date(latestScan.scannedAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }) : 'Tidak ada'}
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-card border border-border-light dark:border-border-dark flex items-center gap-4">
                    <div className="size-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <span className="material-symbols-outlined text-2xl">notifications</span>
                    </div>
                    <div>
                        <p className="text-text-muted text-xs font-bold uppercase tracking-wider">Total Scan</p>
                        <p className="text-2xl font-black text-text-main dark:text-white">{scans.length}</p>
                    </div>
                </div>
            </div>

            {/* Main Grid: My Pets + Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: My Pets (Wide) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-text-main dark:text-white">Kucing Saya</h2>
                        <Link to="/my-pets" className="text-primary font-bold text-sm hover:underline">Lihat Semua</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {petsLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="bg-white dark:bg-card-dark p-4 rounded-2xl border border-border-light dark:border-border-dark animate-pulse min-h-[180px]"></div>
                            ))
                        ) : pets.length > 0 ? (
                            pets.slice(0, 3).map((pet) => (
                                <Link key={pet.id} to={`/my-pets/${pet.id}`} className="group bg-white dark:bg-card-dark p-4 rounded-2xl border border-border-light dark:border-border-dark hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                                    <div className="relative mb-4">
                                        <div className="aspect-[4/3] rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                                            {pet.imageUrl ? (
                                                <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('${pet.imageUrl}')` }}></div>
                                            ) : (
                                                <span className="material-symbols-outlined text-text-muted text-4xl">pets</span>
                                            )}
                                        </div>
                                        <div className={`absolute top-2 right-2 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm ${pet.status === 'healthy' ? 'bg-green-500' : 'bg-primary'
                                            }`}>
                                            {pet.status === 'healthy' ? 'SEHAT' : 'BUTUH PERHATIAN'}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg text-text-main dark:text-white">{pet.name}</h3>
                                    <p className="text-sm text-text-muted">{pet.breed} • {pet.age}</p>
                                </Link>
                            ))
                        ) : (
                            <Link to="/add-pet" className="col-span-full bg-background-light dark:bg-background-dark border-2 border-dashed border-border-light dark:border-border-dark p-8 rounded-2xl flex flex-col items-center justify-center group hover:border-primary hover:bg-primary/5 transition-all">
                                <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl">add</span>
                                </div>
                                <h3 className="font-bold text-text-main dark:text-white">Tambah Kucing Pertama Anda</h3>
                                <p className="text-sm text-text-muted mt-1 text-center">Mulai perjalanan kesehatan kucing Anda dengan Smiling Cat</p>
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <h2 className="text-xl font-bold text-text-main dark:text-white">Scan Terbaru</h2>
                        <Link to="/history" className="text-primary font-bold text-sm hover:underline">Lihat Riwayat</Link>
                    </div>

                    <div className="bg-white dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark overflow-hidden">
                        {scansLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="p-4 h-20 bg-white dark:bg-card-dark animate-pulse"></div>
                            ))
                        ) : scans.length > 0 ? (
                            scans.slice(0, 5).map((scan) => (
                                <Link key={scan.id} to={`/results/${scan.id}`} className="p-4 flex items-center justify-between hover:bg-background-light dark:hover:bg-background-dark transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                            <img src={scan.imageUrl} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-text-main dark:text-white">{scan.diagnosis || 'Diagnosis Berhasil'}</h4>
                                            <p className="text-xs text-text-muted">{formatDate(scan.scannedAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold border ${scan.severity === 'none'
                                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/30'
                                            : 'bg-primary/10 text-primary border-primary/20'
                                            }`}>
                                            {scan.severity === 'none' ? 'Normal' : 'Perhatian'}
                                        </span>
                                        <span className="material-symbols-outlined text-text-muted group-hover:text-primary transition-colors">chevron_right</span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="p-8 text-center text-text-muted">
                                <span className="material-symbols-outlined text-4xl mb-2">history</span>
                                <p>Belum ada riwayat scan.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Placeholder for future widgets like Tips or Shortcuts */}
                </div>
            </div>
        </div>
    );
}
