import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-amber-300/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-orange-200/30 to-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center shadow-lg shadow-primary/30">
                        <span className="text-2xl">🐱</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Smiling Cat</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">AI Health Scanner</p>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center px-6 py-12 min-h-[calc(100vh-120px)]">
                <div className="text-center max-w-2xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">AI-Powered Detection</span>
                    </div>

                    {/* Main Heading */}
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-6">
                        Deteksi Kesehatan<br />
                        <span className="bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
                            Kucing Anda
                        </span>
                    </h2>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed">
                        Gunakan AI canggih untuk mendeteksi potensi masalah kesehatan kucing hanya dengan satu foto.
                    </p>

                    {/* CTA Button */}
                    <Link
                        to="/scanner"
                        className="group inline-flex items-center gap-3 bg-gradient-to-r from-primary to-amber-500 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300"
                    >
                        <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">center_focus_strong</span>
                        <span>Mulai Scan Sekarang</span>
                        <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>

                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">Gratis • Tanpa Login • Hasil Instan</p>
                </div>

                {/* How It Works */}
                <div className="mt-20 w-full max-w-4xl mx-auto">
                    <h3 className="text-center text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-10">
                        Cara Kerja
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: 'photo_camera',
                                title: 'Ambil Foto',
                                desc: 'Foto kucing Anda dengan kamera atau upload dari galeri',
                                color: 'from-blue-500 to-cyan-400'
                            },
                            {
                                icon: 'psychology',
                                title: 'AI Analisis',
                                desc: 'AI kami menganalisis gambar untuk mendeteksi masalah kesehatan',
                                color: 'from-purple-500 to-pink-400'
                            },
                            {
                                icon: 'analytics',
                                title: 'Lihat Hasil',
                                desc: 'Dapatkan diagnosis dan rekomendasi dalam hitungan detik',
                                color: 'from-primary to-amber-400'
                            }
                        ].map((step, i) => (
                            <div key={i} className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                                <div className={`size-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <span className="material-symbols-outlined text-white text-2xl">{step.icon}</span>
                                </div>
                                <div className="text-xs font-bold text-gray-400 mb-2">LANGKAH {i + 1}</div>
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-500">
                    © 2026 Smiling Cat • AI untuk Kesehatan Kucing
                </p>
            </footer>
        </div>
    );
}
