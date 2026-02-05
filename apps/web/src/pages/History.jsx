import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAllScans } from '../hooks/useScans';
import { usePets } from '../hooks/usePets';

export default function History() {
    const navigate = useNavigate();
    const { data: scans = [], isLoading: scansLoading } = useAllScans();
    const { data: pets = [] } = usePets();

    const getPetName = (petId) => {
        const pet = pets.find(p => p.id === petId);
        return pet ? pet.name : 'Kucing Tidak Dikenal';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (scansLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-extrabold text-text-main dark:text-white tracking-tight">Riwayat Kesehatan</h1>
                <div className="text-sm text-text-muted">{scans.length} total catatan</div>
            </div>

            {scans.length === 0 ? (
                <div className="bg-white dark:bg-card-dark rounded-2xl p-12 text-center border border-border-light dark:border-border-dark shadow-card">
                    <span className="material-symbols-outlined text-6xl text-text-muted/20 mb-4">history</span>
                    <h2 className="text-xl font-bold text-text-main dark:text-white">Belum ada riwayat</h2>
                    <p className="text-text-muted mt-2 mb-6">Penilaian kesehatan dan hasil scan kucing Anda akan muncul di sini.</p>
                    <Link to="/scanner" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-hover transition-all">
                        Mulai Scan Pertama
                    </Link>
                </div>
            ) : (
                <div className="relative pl-4 sm:pl-8 space-y-8 before:absolute before:left-0 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-border-light dark:before:bg-border-dark">
                    {scans.map((scan) => (
                        <div key={scan.id} className="relative pl-8 sm:pl-12 group" onClick={() => navigate(`/results/${scan.id}`)}>
                            <div className={`absolute left-[-5px] sm:left-[11px] top-6 size-3 rounded-full border-2 border-white dark:border-background-dark ring-4 ring-background-light dark:ring-background-dark transition-colors ${scan.severity === 'none' ? 'bg-green-500' : 'bg-primary'
                                }`}></div>

                            <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-card border border-border-light dark:border-border-dark hover:shadow-card-hover transition-all cursor-pointer">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                            <img src={scan.imageUrl} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-main dark:text-white text-lg">{scan.diagnosis || 'Diagnosis Berhasil'}</h3>
                                            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">{formatDate(scan.scannedAt)} • {getPetName(scan.petId)}</p>
                                        </div>
                                    </div>
                                    <div className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold border ${scan.severity !== 'none'
                                        ? 'bg-orange-100 text-orange-700 border-orange-200'
                                        : 'bg-green-50 text-green-700 border-green-100'
                                        }`}>
                                        {scan.severity === 'none' ? 'NORMAL' : 'PERHATIAN'}
                                    </div>
                                </div>

                                <div className="bg-background-light dark:bg-background-dark rounded-xl p-4 text-sm text-text-muted leading-relaxed line-clamp-2">
                                    {scan.recommendations || 'Observasi disarankan.'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
