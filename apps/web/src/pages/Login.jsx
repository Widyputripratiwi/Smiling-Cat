import React from 'react';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { authClient } from '../lib/auth-client';
import { useState } from 'react';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Use manual auth endpoint (emergency bypass)
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const response = await fetch(`${apiUrl}/manual-auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store token in localStorage
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/dashboard');
            } else {
                setError(data.error || 'Login gagal. Periksa kembali email dan password Anda.');
            }
        } catch (err) {
            setError('Terjadi kesalahan. Silakan coba lagi.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        try {
            await authClient.signIn.social({
                provider: provider,
                callbackURL: '/dashboard'
            });
        } catch (err) {
            console.error('Social login failed:', err);
        }
    };
    return (
        <div className="w-full max-w-[480px] bg-white dark:bg-card-dark shadow-xl rounded-xl overflow-hidden border border-border-light dark:border-border-dark relative z-10">
            <div className="absolute top-0 right-0 p-4">
                <Link to="/" className="text-text-muted hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">close</span>
                </Link>
            </div>

            <div className="flex flex-col items-center pt-10 pb-6 px-8">
                <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                    <span className="material-symbols-outlined text-[40px]">pets</span>
                </div>
                <h1 className="text-text-main dark:text-white text-3xl font-bold mb-2">Selamat Datang Kembali</h1>
                <p className="text-text-secondary dark:text-text-muted text-center text-sm">Masukkan detail Anda untuk memantau kesehatan kucing kesayangan Anda.</p>
            </div>

            <div className="px-8 pb-10">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">error</span>
                        {error}
                    </div>
                )}

                <form className="flex flex-col gap-5" onSubmit={handleLogin}>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-text-main dark:text-white text-sm font-bold">Alamat Email</span>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted material-symbols-outlined text-[20px]">mail</span>
                            <input
                                className="w-full h-12 pl-11 pr-4 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-main dark:text-white placeholder:text-text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm font-medium"
                                placeholder="nama@contoh.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                            <span className="text-text-main dark:text-white text-sm font-bold">Kata Sandi</span>
                            <a className="text-primary hover:text-primary-hover text-xs font-bold transition-colors" href="#">Lupa Kata Sandi?</a>
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted material-symbols-outlined text-[20px]">lock</span>
                            <input
                                className="w-full h-12 pl-11 pr-4 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-main dark:text-white placeholder:text-text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm font-medium"
                                placeholder="Masukkan kata sandi Anda"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </label>
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'MEMPROSES...' : 'MASUK'}
                        {!loading && <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                    </button>
                </form>



                <div className="text-center">
                    <p className="text-text-muted text-sm">
                        Belum punya akun?
                        <Link to="/register" className="text-primary hover:text-primary-hover font-bold transition-colors ml-1">Daftar</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
