import React from 'react';
import { Link } from 'react-router-dom';

export function CTA() {
    return (
        <section className="w-full px-6 lg:px-10 py-20 bg-background-light dark:bg-background-dark">
            <div className="max-w-[1280px] mx-auto rounded-[3rem] bg-primary text-text-main overflow-hidden relative shadow-2xl shadow-primary/20">
                {/* Decorative Circles */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-black/5 rounded-full blur-3xl"></div>

                <div className="flex flex-col lg:flex-row items-center relative z-10 p-10 lg:p-20 gap-10 lg:gap-20">
                    <div className="flex flex-col gap-6 text-center lg:text-left flex-1">
                        <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight">
                            Start your cat's health journey today
                        </h2>
                        <p className="text-white/90 text-lg lg:text-xl font-medium max-w-[500px] mx-auto lg:mx-0">
                            Join thousands of happy cat owners giving their pets the best care possible.
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                            <Link to="/register" className="flex items-center gap-2 bg-white text-primary px-6 py-3.5 rounded-xl font-bold hover:bg-orange-50 transition-colors shadow-lg">
                                <span className="material-symbols-outlined">download</span>
                                Download App
                            </Link>
                            <button className="flex items-center gap-2 bg-black/20 text-white border border-white/20 px-6 py-3.5 rounded-xl font-bold hover:bg-black/30 transition-colors">
                                View Pricing
                            </button>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/3 flex justify-center">
                        <div className="relative w-64 h-64 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                            <div className="w-48 h-48 bg-white/30 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-8xl text-white">pets</span>
                            </div>
                            <div className="absolute top-0 right-0 bg-white text-primary px-4 py-2 rounded-lg shadow-lg font-bold transform translate-x-4 -translate-y-4 rotate-12">
                                It's free!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
