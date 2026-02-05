import React, { useState } from 'react';

export function HealthBackgroundForm({ onNext, onBack, isLoading }) {
    const [notes, setNotes] = useState('');
    const [lifestyle, setLifestyle] = useState(['Hanya Di Dalam Rumah']);
    const [conditions, setConditions] = useState(['Tidak Ada / Sehat']);

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext({ notes, lifestyle, conditions });
    };

    const toggleItem = (item, currentList, setList) => {
        if (currentList.includes(item)) {
            setList(currentList.filter(i => i !== item));
        } else {
            setList([...currentList, item]);
        }
    };

    return (
        <div className="w-full max-w-[800px] flex flex-col gap-6">
            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-soft p-6 md:p-10 lg:p-12 border border-border-light dark:border-border-dark relative overflow-hidden">
                <div className="absolute -top-20 -right-20 size-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col gap-2 mb-10 text-center md:text-left">
                    <h1 className="text-text-main dark:text-white text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
                        Riwayat Kesehatan
                    </h1>
                    <p className="text-text-muted text-lg font-medium max-w-2xl">
                        Bantu kami memahami gaya hidup dan riwayat medis <span className="text-primary font-bold">hewan peliharaanmu</span> untuk analisis AI yang lebih baik.
                    </p>
                </div>

                <form className="flex flex-col gap-10 relative z-10" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-2xl">eco</span>
                            <h2 className="text-text-main dark:text-white text-xl font-bold">Gaya Hidup & Vitalitas</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {['Hanya Di Dalam Rumah', 'Akses Luar Ruangan', 'Sudah Steril', 'Sudah Microchipped'].map((label, i) => (
                                <label key={i} className="cursor-pointer group relative">
                                    <input
                                        type="checkbox"
                                        className="peer sr-only"
                                        checked={lifestyle.includes(label)}
                                        onChange={() => toggleItem(label, lifestyle, setLifestyle)}
                                    />
                                    <div className="select-none transition-all duration-300 bg-chip-bg dark:bg-background-dark border border-transparent peer-checked:bg-primary peer-checked:text-white peer-checked:shadow-lg peer-checked:shadow-primary/30 hover:border-primary/30 text-text-main dark:text-white font-bold px-6 py-3 rounded-full flex items-center gap-2">
                                        <span className="material-symbols-outlined w-0 overflow-hidden opacity-0 peer-checked:w-5 peer-checked:opacity-100 transition-all">check</span>
                                        {label}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="h-px w-full bg-border-light dark:bg-border-dark"></div>

                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-2xl">medical_services</span>
                            <h2 className="text-text-main dark:text-white text-xl font-bold">Kondisi yang Diketahui</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {['Tidak Ada / Sehat', 'Alergi', 'Masalah Ginjal', 'Diabetes'].map((label, i) => (
                                <label key={i} className="cursor-pointer group relative">
                                    <input
                                        type="checkbox"
                                        className="peer sr-only"
                                        checked={conditions.includes(label)}
                                        onChange={() => toggleItem(label, conditions, setConditions)}
                                    />
                                    <div className="select-none transition-all duration-300 bg-chip-bg dark:bg-background-dark border border-transparent peer-checked:bg-primary peer-checked:text-white peer-checked:shadow-lg peer-checked:shadow-primary/30 hover:border-primary/30 text-text-main dark:text-white font-bold px-6 py-3 rounded-full flex items-center gap-2">
                                        <span className="material-symbols-outlined w-0 overflow-hidden opacity-0 peer-checked:w-5 peer-checked:opacity-100 transition-all">check</span>
                                        {label}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <label htmlFor="notes" className="text-text-main dark:text-white text-lg font-bold flex items-center gap-2">
                            Catatan Tambahan
                            <span className="text-xs font-normal text-text-muted bg-chip-bg dark:bg-background-dark px-2 py-0.5 rounded-full">Opsional</span>
                        </label>
                        <div className="relative group">
                            <textarea
                                id="notes"
                                rows="4"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full bg-chip-bg dark:bg-background-dark border-0 rounded-2xl p-5 text-text-main dark:text-white placeholder:text-text-muted/60 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-background-dark transition-all duration-300 resize-none shadow-inner"
                                placeholder="Punya kebutuhan diet khusus, operasi sebelumnya, atau kebiasaan perilaku yang perlu kami ketahui?"
                            ></textarea>
                            <div className="absolute bottom-4 right-4 text-text-muted/40 text-xs pointer-events-none">{notes.length}/500</div>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 mt-4 pt-4">
                        <button type="button" onClick={onBack} disabled={isLoading} className="w-full md:w-auto px-8 py-4 rounded-full text-text-muted hover:text-text-main dark:hover:text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 group disabled:opacity-50">
                            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                            Langkah Sebelumnya
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full md:w-auto min-w-[200px] px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-full font-bold text-base shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? 'Sedang Membuat...' : 'Selesai'}
                            {!isLoading && <span className="material-symbols-outlined text-xl">check</span>}
                        </button>
                    </div>
                </form>
            </div>
            <div className="flex justify-center items-center gap-2 text-text-muted/60 text-xs mt-2">
                <span className="material-symbols-outlined text-sm">lock</span>
                <p>Data kesehatan hewan peliharaan Anda terenkripsi dan bersifat pribadi.</p>
            </div>
        </div>
    );
}
