import React, { useState } from 'react';

export function BasicInfoForm({ onNext, onCancel }) {
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext({ name, breed, age, gender, image });
    };

    return (
        <div className="w-full max-w-[640px] bg-white dark:bg-surface-dark rounded-[32px] shadow-soft p-8 sm:p-10 border border-white dark:border-border-dark transition-colors duration-300 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col gap-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-text-main dark:text-white mb-2">Mari bertemu kucingmu</h2>
                    <p className="text-text-muted">Beri tahu kami sedikit tentang teman berbulumu untuk memulai.</p>
                </div>

                <div className="flex justify-center">
                    <div className="group relative size-32 sm:size-40 rounded-full border-4 border-dashed border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary bg-background-light dark:bg-background-dark flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:bg-primary/5 overflow-hidden">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            aria-label="Unggah foto hewan peliharaan"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setPreviewUrl(URL.createObjectURL(file));
                                    setImage(file);
                                }
                            }}
                        />
                        {previewUrl ? (
                            <img src={previewUrl} alt="Pratinjau Hewan" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-primary text-3xl">add_a_photo</span>
                                </div>
                                <span className="text-xs font-bold text-primary uppercase tracking-wide">Unggah</span>
                            </>
                        )}
                    </div>
                </div>

                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label htmlFor="petName" className="text-text-main dark:text-white text-sm font-bold ml-1">Nama Hewan</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="petName"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-xl px-5 py-4 text-text-main dark:text-white placeholder:text-text-muted font-medium transition-all shadow-inner focus:bg-white dark:focus:bg-[#332d26]"
                                placeholder="misal: Si Belang"
                            />
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">edit</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="breed" className="text-text-main dark:text-white text-sm font-bold ml-1">Ras</label>
                        <div className="relative group">
                            <select
                                id="breed"
                                required
                                value={breed}
                                onChange={(e) => setBreed(e.target.value)}
                                className="w-full appearance-none bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-xl px-5 py-4 text-text-main dark:text-white font-medium transition-all shadow-inner focus:bg-white dark:focus:bg-[#332d26] cursor-pointer"
                            >
                                <option value="" disabled>Pilih ras...</option>
                                <option value="Mixed Breed / Moggy">Campuran / Kampung</option>
                                <option value="Siamese">Siamese</option>
                                <option value="Persian">Persia</option>
                                <option value="Maine Coon">Maine Coon</option>
                                <option value="Ragdoll">Ragdoll</option>
                                <option value="Bengal">Bengal</option>
                                <option value="Sphynx">Sphynx</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none group-hover:text-primary transition-colors">keyboard_arrow_down</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1 space-y-2">
                            <label htmlFor="age" className="text-text-main dark:text-white text-sm font-bold ml-1">Usia (Tahun)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="age"
                                    min="0"
                                    max="30"
                                    step="1"
                                    placeholder="0"
                                    required
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    className="w-full bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-xl px-5 py-4 text-text-main dark:text-white placeholder:text-text-muted font-medium transition-all shadow-inner focus:bg-white dark:focus:bg-[#332d26]"
                                />
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">cake</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-2">
                            <label className="text-text-main dark:text-white text-sm font-bold ml-1">Jenis Kelamin</label>
                            <div className="flex bg-background-light dark:bg-background-dark p-1.5 rounded-xl h-[58px]">
                                <label className="flex-1 cursor-pointer relative">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        className="peer sr-only"
                                        checked={gender === 'male'}
                                        onChange={() => setGender('male')}
                                    />
                                    <div className="w-full h-full flex items-center justify-center gap-2 rounded-[10px] text-text-muted font-semibold transition-all peer-checked:bg-white dark:peer-checked:bg-card-dark peer-checked:text-primary peer-checked:shadow-sm hover:text-text-main dark:hover:text-white">
                                        <span className="material-symbols-outlined text-[20px]">male</span>
                                        <span>Jantan</span>
                                    </div>
                                </label>
                                <label className="flex-1 cursor-pointer relative">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        className="peer sr-only"
                                        checked={gender === 'female'}
                                        onChange={() => setGender('female')}
                                    />
                                    <div className="w-full h-full flex items-center justify-center gap-2 rounded-[10px] text-text-muted font-semibold transition-all peer-checked:bg-white dark:peer-checked:bg-card-dark peer-checked:text-primary peer-checked:shadow-sm hover:text-text-main dark:hover:text-white">
                                        <span className="material-symbols-outlined text-[20px]">female</span>
                                        <span>Betina</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="h-px w-full bg-border-light dark:bg-border-dark my-2"></div>

                    <button type="submit" className="group w-full bg-primary hover:bg-primary-hover text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]">
                        <span>Lanjut: Detail Kesehatan</span>
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                    <div className="text-center">
                        <button type="button" onClick={onCancel} className="text-sm font-semibold text-text-muted hover:text-text-main dark:hover:text-white transition-colors">
                            Batal dan kembali
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
