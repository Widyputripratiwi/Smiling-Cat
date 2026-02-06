import React, { useState, useEffect } from 'react';

export default function Settings() {
    const [user, setUser] = useState(null);

    // Local state for form management
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Load user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setFormData({
                name: parsedUser.name || '',
                email: parsedUser.email || '',
            });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setIsDirty(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // TODO: Implement actual update API call here
            // await authClient.updateUser(formData); 
            // For now, simulate success
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsDirty(false);
            // Optionally reload session or show toast
        } catch (error) {
            console.error("Gagal menyimpan profil:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDiscard = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
        });
        setIsDirty(false);
    };

    return (
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-text-main dark:text-white tracking-tight">Pengaturan</h1>
                    <p className="text-text-muted mt-2">Kelola preferensi akun dan aplikasi Anda.</p>
                </div>
                {isDirty && (
                    <div className="flex gap-2 animate-in fade-in slide-in-from-bottom-2">
                        <button
                            onClick={handleDiscard}
                            disabled={isSaving}
                            className="px-4 py-2 rounded-lg text-text-muted hover:bg-background-light dark:hover:bg-background-dark font-bold text-sm transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-6 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                        >
                            {isSaving ? (
                                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <span className="material-symbols-outlined text-lg">save</span>
                            )}
                            Simpan
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {/* Profile Section */}
                <section className="bg-white dark:bg-card-dark rounded-2xl shadow-card border border-border-light dark:border-border-dark overflow-hidden">
                    <div className="p-6 border-b border-border-light dark:border-border-dark">
                        <h2 className="text-lg font-bold text-text-main dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">person</span>
                            Profil
                        </h2>
                    </div>
                    <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative group cursor-pointer">
                            <div className="size-24 rounded-full bg-cover bg-center bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                {user?.image ? (
                                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${user.image}')` }}></div>
                                ) : (
                                    <span className="material-symbols-outlined text-text-muted text-4xl">person</span>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-white">edit</span>
                            </div>
                        </div>
                        <div className="flex-1 w-full space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className="space-y-1">
                                    <span className="text-xs font-bold text-text-muted uppercase">Nama Lengkap</span>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-background-light dark:bg-background-dark border-transparent rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/50 text-text-main dark:text-white"
                                    />
                                </label>
                                <label className="space-y-1">
                                    <span className="text-xs font-bold text-text-muted uppercase">Email</span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-background-light dark:bg-background-dark border-transparent rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/50 text-text-main dark:text-white"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Notifications Section */}
                <section className="bg-white dark:bg-card-dark rounded-2xl shadow-card border border-border-light dark:border-border-dark overflow-hidden">
                    <div className="p-6 border-b border-border-light dark:border-border-dark">
                        <h2 className="text-lg font-bold text-text-main dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">notifications</span>
                            Notifikasi
                        </h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            'Tips Kesehatan Harian', 'Hasil Scan Terbaru', 'Pembaruan Aplikasi'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                                <span className="font-medium text-text-main dark:text-white">{item}</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked={i < 3} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
