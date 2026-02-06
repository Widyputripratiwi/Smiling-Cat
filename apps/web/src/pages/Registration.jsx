import React from 'react';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { authClient } from '../lib/auth-client';
import { useState } from 'react';

export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Kata sandi tidak cocok.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { data, error } = await authClient.signUp.email({
                email,
                password,
                name: name || 'Teman Smiling Cat', // Default name
                callbackURL: '/dashboard'
            });

            if (data) {
                navigate('/dashboard');
            } else if (error) {
                // Handle specific error types
                if (error.message?.toLowerCase().includes('already exists') ||
                    error.message?.toLowerCase().includes('already registered') ||
                    error.code === 'USER_ALREADY_EXISTS') {
                    setError('Email sudah terdaftar. Silakan gunakan email lain atau login.');
                } else {
                    setError(error.message || 'Registrasi gagal. Silakan coba lagi.');
                }
            }
        } catch (err) {
            // Check if it's a network error or API error
            if (err.response?.status === 500) {
                setError('Email sudah terdaftar atau server sedang sibuk. Silakan coba lagi.');
            } else {
                setError('Terjadi kesalahan saat registrasi. Silakan coba lagi.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 lg:gap-16 items-center justify-center z-10">
            <div className="absolute top-0 left-0 p-4 md:p-8 z-50">
                <Link to="/" className="flex items-center gap-2 cursor-pointer">
                    <div className="size-8 text-primary">
                        <span className="material-symbols-outlined text-[32px]">pets</span>
                    </div>
                    <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Smiling Cat</h2>
                </Link>
            </div>

            <div className="hidden md:flex flex-1 flex-col justify-center items-start gap-6 max-w-[500px]">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 flex flex-col justify-end p-8">
                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-lg inline-flex items-center gap-3 w-max mb-2">
                            <span className="material-symbols-outlined text-white">health_and_safety</span>
                            <span className="text-white font-medium text-sm">Scan Kesehatan AI Aktif</span>
                        </div>
                        <h3 className="text-white text-3xl font-bold leading-tight">Jaga teman berbulumu tetap bahagia & sehat.</h3>
                    </div>
                    <div className="w-full h-full bg-gradient-to-br from-primary via-orange-400 to-amber-300"></div>
                </div>
            </div>

            <div className="w-full max-w-[480px] flex-1 bg-white dark:bg-card-dark rounded-xl shadow-card p-8 md:p-10 border border-border-light dark:border-border-dark relative">
                <div className="flex flex-col gap-2 mb-8 text-center">
                    <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                        <span className="material-symbols-outlined">sentiment_satisfied</span>
                    </div>
                    <h1 className="text-text-main dark:text-white tracking-tight text-3xl font-bold">Gabung Keluarga Kami</h1>
                    <p className="text-text-muted text-sm">Buat akun untuk mulai memindai.</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">error</span>
                        {error}
                    </div>
                )}

                <form className="flex flex-col gap-5" onSubmit={handleRegister}>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-text-main dark:text-gray-200 text-sm font-semibold pl-1">Alamat Email</span>
                        <div className="relative">
                            <input
                                className="w-full rounded-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-5 text-base text-text-main dark:text-white placeholder:text-text-muted/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                                placeholder="namaanda@contoh.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-muted/50 text-[20px]">mail</span>
                        </div>
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-text-main dark:text-gray-200 text-sm font-semibold pl-1 flex justify-between">
                            Nama Lengkap
                            <span className="text-text-muted font-normal text-xs">(Opsional)</span>
                        </span>
                        <div className="relative">
                            <input
                                className="w-full rounded-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-5 text-base text-text-main dark:text-white placeholder:text-text-muted/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                                placeholder="Si Belang"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-muted/50 text-[20px]">person</span>
                        </div>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-1.5">
                            <span className="text-text-main dark:text-gray-200 text-sm font-semibold pl-1">Kata Sandi</span>
                            <div className="relative">
                                <input
                                    className="w-full rounded-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-5 text-base text-text-main dark:text-white placeholder:text-text-muted/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                            </div>
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-text-main dark:text-gray-200 text-sm font-semibold pl-1">Konfirmasi Kata Sandi</span>
                            <div className="relative">
                                <input
                                    className="w-full rounded-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-12 px-5 text-base text-text-main dark:text-white placeholder:text-text-muted/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                                    placeholder="••••••••"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                            </div>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-full text-base tracking-wide shadow-lg shadow-primary/25 transition-all text-center flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'MEMBUAT AKUN...' : 'DAFTAR'}
                    </button>
                </form>



                <div className="mt-8 text-center">
                    <p className="text-sm text-text-muted">
                        Sudah punya akun?
                        <Link className="text-primary font-bold hover:underline ml-1" to="/login">Masuk</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
