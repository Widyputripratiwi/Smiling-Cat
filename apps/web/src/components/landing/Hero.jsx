import React from 'react';
import { Link } from 'react-router-dom';

export function Hero() {
    return (
        <section className="w-full max-w-[1280px] px-6 lg:px-10 py-12 lg:py-20 mx-auto">
            <div className="@container">
                <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-16 items-center">
                    {/* Text Content */}
                    <div className="flex flex-col gap-6 flex-1 text-center lg:text-left items-center lg:items-start">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wide">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            Versi Baru 3.0
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black leading-[1.1] tracking-[-0.033em] text-text-main dark:text-white max-w-[600px]">
                            Jaga kucingmu tetap <span className="text-primary">tersenyum</span>.
                        </h1>
                        <h2 className="text-lg text-text-secondary dark:text-text-muted font-medium leading-relaxed max-w-[540px]">
                            Pendamping kesehatan all-in-one untuk pemilik kucing modern. Pantau kesehatan dengan AI scanner dan lacak riwayat dengan mudah.
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                            <Link to="/register" className="flex h-12 w-full sm:w-auto min-w-[160px] cursor-pointer items-center justify-center rounded-xl bg-primary hover:bg-primary-hover transition-colors text-white text-base font-bold shadow-lg shadow-primary/20">
                                Mulai Gratis
                            </Link>
                            <button className="flex h-12 w-full sm:w-auto min-w-[160px] cursor-pointer items-center justify-center rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-primary/50 text-text-main dark:text-white text-base font-bold transition-all">
                                <span className="material-symbols-outlined mr-2 text-primary">play_circle</span>
                                Lihat Cara Kerjanya
                            </button>
                        </div>
                    </div>
                    {/* Hero Image */}
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-[560px] aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-border-light dark:bg-card-dark">
                            <div className="absolute inset-0 bg-center bg-cover transition-transform duration-700 hover:scale-105" data-alt="A close-up of a happy orange tabby cat looking directly at the camera with soft lighting" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDayK4szKxaYtkf2QDpLXhYCqXy3k3Ju8LVqhOENEuwQ3VLGxTqYeSDKMdGOBJQ2tXO_qOyagz7nvsqo71SZmELLdQD_Q96A-NlmJ7m-OrZ0SCzVihkI2NznEYl3D5YFH-QO5GQsqoGbihKFStcrapviVv0pWgHZ3RGyd1PF0ruX1_FPh0TherTAq5q0isOBTWsl99_Rtk8SivqWfvOJNJezOdVr665tgqEpxoqEiVH43beNLLKbqQlPuQpVk1Y63MBuV-DQM7L1ZhZ')" }}>
                            </div>
                            {/* Floating Badge */}
                            <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:w-auto bg-white/90 dark:bg-background-dark/90 backdrop-blur-md rounded-2xl p-4 shadow-lg flex items-center gap-4 border border-white/20">
                                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400">
                                    <span className="material-symbols-outlined">check_circle</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Status Harian</p>
                                    <p className="text-sm font-bold text-text-main dark:text-white">Semua vital normal</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
