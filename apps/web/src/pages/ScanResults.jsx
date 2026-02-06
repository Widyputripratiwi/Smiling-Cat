import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useScan } from '../hooks/useScans';

export default function ScanResults() {
    const { id } = useParams();
    const { data, isLoading } = useScan(id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[600px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-text-main dark:text-white">Hasil pemindaian tidak ditemukan</h2>
                <Link to="/scanner" className="text-primary hover:underline mt-4 inline-block">Kembali ke Scanner</Link>
            </div>
        );
    }

    const { scan, symptoms = [] } = data;
    const isHealthy = scan.severity === 'none';

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <Link to="/scanner" className="text-sm font-bold text-text-muted hover:text-primary mb-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Kembali ke Scanner
                    </Link>
                    <h1 className="text-3xl font-extrabold text-text-main dark:text-white tracking-tight">Hasil Analisis</h1>
                </div>
                <div className="bg-background-light dark:bg-background-dark px-4 py-2 rounded-lg text-sm font-medium text-text-muted border border-border-light dark:border-border-dark shadow-sm">
                    ID Pemindaian: {scan.scanCode}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Preview */}
                <div className="flex flex-col gap-4">
                    <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black shadow-lg relative group">
                        <img src={scan.imageUrl} className="w-full h-full object-cover" alt="Kucing yang Dipindai" />

                        {/* Render bounding boxes from detected areas */}
                        {!isHealthy && scan.detectedAreas && scan.imageWidth && scan.imageHeight && (
                            scan.detectedAreas.map((area, areaIndex) =>
                                area.predictions.filter(p => p.x && p.y && p.width && p.height).map((pred, predIndex) => {
                                    // Calculate percentage position for responsive display
                                    const left = ((pred.x - pred.width / 2) / scan.imageWidth) * 100;
                                    const top = ((pred.y - pred.height / 2) / scan.imageHeight) * 100;
                                    const width = (pred.width / scan.imageWidth) * 100;
                                    const height = (pred.height / scan.imageHeight) * 100;

                                    return (
                                        <div
                                            key={`${areaIndex}-${predIndex}`}
                                            className="absolute border-3 border-primary/70 bg-primary/10 pointer-events-none"
                                            style={{
                                                left: `${Math.max(0, left)}%`,
                                                top: `${Math.max(0, top)}%`,
                                                width: `${Math.min(100 - left, width)}%`,
                                                height: `${Math.min(100 - top, height)}%`,
                                            }}
                                        >
                                            <div className="absolute -top-7 left-0 bg-primary text-white text-xs px-2 py-1 rounded-md font-bold whitespace-nowrap">
                                                {pred.class.replace(/[-_]/g, ' ')} ({(pred.confidence * 100).toFixed(0)}%)
                                            </div>
                                        </div>
                                    );
                                })
                            )
                        )}

                        {/* Fallback indicator when no bounding box data but issue detected */}
                        {!isHealthy && (!scan.detectedAreas || !scan.imageWidth) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-primary/20 border-2 border-primary/50 rounded-lg px-4 py-2">
                                    <span className="text-white text-sm font-bold">Masalah Terdeteksi</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-background-light dark:bg-background-dark rounded-2xl border border-border-light dark:border-border-dark">
                        <p className="text-xs text-text-muted uppercase font-bold tracking-wider mb-1">Dipindai Pada</p>
                        <p className="text-sm font-bold text-text-main dark:text-white">
                            {new Date(scan.scannedAt).toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>

                {/* Analysis */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-card border border-border-light dark:border-border-dark relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none -mr-8 -mt-8 rotate-12`}>
                            <span className="material-symbols-outlined text-[120px] text-primary">analytics</span>
                        </div>

                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-2xl">analytics</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-text-main dark:text-white">Diagnosis AI</h2>
                                <p className="text-xs text-text-muted">Keyakinan: {(scan.confidence * 100).toFixed(1)}%</p>
                            </div>
                            <div className={`ml-auto px-3 py-1 rounded-full text-xs font-bold border ${isHealthy
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200'
                                : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200'
                                }`}>
                                {isHealthy ? 'Normal' : 'Butuh Perhatian'}
                            </div>
                        </div>

                        {/* Low confidence warning */}
                        {scan.confidence < 0.3 && (
                            <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-xl flex items-start gap-2">
                                <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">warning</span>
                                <div>
                                    <p className="text-sm font-bold text-yellow-700 dark:text-yellow-400">Keyakinan Rendah</p>
                                    <p className="text-xs text-yellow-600 dark:text-yellow-500">Pastikan foto menampilkan kucing dengan jelas. Jika bukan foto kucing, hasil mungkin tidak akurat.</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4 relative z-10">
                            <div className={`p-4 rounded-xl border ${isHealthy
                                ? 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-800/20'
                                : 'bg-primary/5 dark:bg-primary/10 border-primary/10'
                                }`}>
                                <h3 className="font-bold text-text-main dark:text-white text-base mb-1">{scan.diagnosis || 'Analisis Berhasil'}</h3>
                                <p className="text-sm text-text-muted leading-relaxed">
                                    {scan.recommendations || 'Observasi rutin tetap disarankan.'}
                                </p>
                            </div>

                            {symptoms.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-text-main dark:text-white text-sm mb-3">Gejala Terdeteksi:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {symptoms.map((s, idx) => (
                                            <span key={idx} className="px-3 py-1.5 rounded-xl bg-chip-bg dark:bg-background-dark text-xs font-bold text-text-secondary border border-border-light/50">
                                                {s.symptom}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-card border border-border-light dark:border-border-dark">
                        <h2 className="text-lg font-bold text-text-main dark:text-white mb-4">Tindakan Disarankan</h2>
                        <div className="space-y-3">
                            <Link to={`/my-pets/${scan.petId}`} className="w-full flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">pets</span>
                                    <div className="text-left">
                                        <h4 className="font-bold text-text-main dark:text-white text-sm">Lihat Profil Hewan</h4>
                                        <p className="text-xs text-text-muted">Kembali ke riwayat kesehatan kucingmu</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                            <Link to="/scanner" className="w-full flex items-center justify-between p-4 rounded-xl border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors group">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-text-muted">center_focus_strong</span>
                                    <div className="text-left">
                                        <h4 className="font-bold text-text-main dark:text-white text-sm">Scan Lagi</h4>
                                        <p className="text-xs text-text-muted">Lakukan pemindaian baru</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-text-muted group-hover:text-text-main transition-colors">chevron_right</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
