import React from 'react';
import { Link } from 'react-router-dom';

export function Features() {
    const features = [
        {
            icon: 'photo_camera_front',
            title: 'Scanner Pintar AI',
            desc: 'Deteksi potensi masalah kesehatan lebih dini hanya dengan mengambil foto. AI kami menganalisis mata, bulu, dan postur.',
            linkText: 'Coba Scanner',
            linkTo: '/scanner',
            colorClass: 'text-primary'
        },
        {
            icon: 'pets',
            title: 'Profil Kucing',
            desc: 'Kelola profil kucing Anda dengan mudah. Simpan informasi penting dan pantau kesehatan mereka.',
            linkText: 'Lihat Profil',
            linkTo: '/my-pets',
            colorClass: 'text-primary'
        },
        {
            icon: 'folder_special',
            title: 'Catatan Kesehatan Digital',
            desc: 'Simpan log berat badan dan riwayat medis secara terorganisir di satu tempat yang aman. Bagikan secara instan.',
            linkText: 'Lihat Demo',
            linkTo: '/history',
            colorClass: 'text-primary'
        },
        {
            icon: 'location_on',
            title: 'Pencari Vet Pintar',
            desc: 'Temukan klinik dengan rating terbaik dan spesialis kucing di area lokal Anda dengan cepat.',
            linkText: null, // Custom content
            colorClass: 'text-primary'
        }
    ];

    return (
        <section id="features" className="w-full bg-white dark:bg-surface-dark py-20 lg:py-32 rounded-t-[3rem] lg:rounded-t-[4rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex flex-col items-center">
                <div className="flex flex-col items-center gap-4 text-center mb-16 max-w-[800px]">
                    <h2 className="text-primary font-bold tracking-widest uppercase text-sm">Fitur Luar Biasa</h2>
                    <h1 className="text-3xl lg:text-5xl font-black text-text-main dark:text-white leading-tight">
                        Semua yang Anda butuhkan untuk kucing <br className="hidden sm:block" />yang sehat dan bahagia.
                    </h1>
                    <p className="text-lg text-text-secondary dark:text-text-muted max-w-[600px] mt-2">
                        Teknologi kesehatan canggih yang dirancang agar ramah dan penting bagi kesejahteraan kucing Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {features.map((feature, idx) => (
                        <div key={idx} className="group relative flex flex-col gap-6 rounded-3xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-8 lg:p-10 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150 pointer-events-none"></div>

                            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-surface-dark shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                            </div>

                            <div className="relative flex flex-col gap-3">
                                <h3 className="text-2xl font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">{feature.title}</h3>
                                <p className="text-text-secondary dark:text-text-muted text-base leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>

                            {feature.linkText ? (
                                <Link to={feature.linkTo} className="relative mt-auto pt-4 flex items-center text-primary font-bold text-sm group/link">
                                    <span>{feature.linkText}</span>
                                    <span className="material-symbols-outlined ml-1 text-lg transition-transform group-hover/link:translate-x-1">arrow_forward</span>
                                </Link>
                            ) : (
                                <div className="relative mt-auto pt-4">
                                    <div className="w-full h-32 rounded-xl bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCeN16KCsPb-3zwPYfYfcHPdfzIbow55RdCF0diQiSm1HZY3FcjmAhL354t865JHkMmMk-U0zMnBwTYoZizGhMg4nL3Zcfk_OVE5UN_DXGsmzJW5Woyvh_e40ru3jLGMz-ChSsc9MnY7oOQ5_iHl3X0Yl5FwsAjOJQ8QmxI0QptAhuGsIq0Hw0WP2yiwk6DAGgOAF_rYE2EMG5dP6y-DxfSfiatjaDPrh0sLlVBhLAMqm5tl_15zwjxMUQHjx61UBqy5Qf6cHS50rLM')" }}></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <button className="bg-white/90 dark:bg-black/80 px-4 py-2 rounded-lg text-xs font-bold shadow-sm backdrop-blur-sm text-text-main dark:text-white hover:scale-105 transition-transform">
                                                Cari di Sekitar Saya
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
