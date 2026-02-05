import React, { useState, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { usePets } from '../hooks/usePets';
import { useCreateScan } from '../hooks/useScans';

export default function Scanner() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialPetId = searchParams.get('petId') || '';
    const [selectedPetId, setSelectedPetId] = useState(initialPetId);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const fileInputRef = useRef();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const { data: pets = [] } = usePets();
    const createScan = useCreateScan();

    React.useEffect(() => {
        if (searchParams.get('autoStart') === 'true') {
            startCamera();
        }
        return () => stopCamera();
    }, [searchParams]);

    const startCamera = async () => {
        try {
            setPreviewUrl(null);
            setFile(null);
            setIsCameraOpen(true);
            // Small delay to ensure ref is mounted
            setTimeout(async () => {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 100);
        } catch (err) {
            console.error("Error accessing camera", err);
            setIsCameraOpen(false);
            alert("Tidak dapat mengakses kamera. Pastikan izin telah diberikan.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                const capturedFile = new File([blob], "capture.jpg", { type: "image/jpeg" });
                setFile(capturedFile);
                setPreviewUrl(URL.createObjectURL(capturedFile));
                stopCamera();
            }, 'image/jpeg');
        }
    };

    const resetScanner = () => {
        stopCamera();
        setFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setIsCameraOpen(false);
        }
    };

    const handleUpload = async () => {
        if (!selectedPetId) {
            alert('Silakan pilih kucing terlebih dahulu.');
            return;
        }
        if (!file) {
            alert('Silakan ambil foto atau unggah gambar terlebih dahulu.');
            return;
        }

        try {
            const scan = await createScan.mutateAsync({
                petId: selectedPetId,
                image: file
            });
            navigate(`/results/${scan.id}`);
        } catch (error) {
            console.error('Scan gagal:', error);
            alert('Gagal melakukan pemindaian. Silakan coba lagi.');
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-text-main dark:text-white tracking-tight">AI Health Scanner</h1>
                    <p className="text-text-muted mt-2">Arahkan kamera ke kucing Anda untuk mendeteksi potensi masalah kesehatan.</p>
                </div>

                {/* Pet Selector */}
                <div className="w-full sm:w-64">
                    <select
                        value={selectedPetId}
                        onChange={(e) => setSelectedPetId(e.target.value)}
                        className="w-full bg-white dark:bg-card-dark border-border-light dark:border-border-dark rounded-xl px-4 py-3 font-bold text-text-main dark:text-white shadow-soft focus:ring-2 focus:ring-primary outline-none transition-all"
                    >
                        <option value="" disabled>Pilih kucing...</option>
                        {pets.map(pet => (
                            <option key={pet.id} value={pet.id}>{pet.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
                {/* Viewfinder */}
                <div className="flex-1 bg-black rounded-3xl relative overflow-hidden shadow-2xl flex items-center justify-center group">
                    {previewUrl ? (
                        <img src={previewUrl} className="w-full h-full object-contain" alt="Preview" />
                    ) : (
                        <>
                            <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${isCameraOpen ? 'block' : 'hidden'}`}></video>
                            {!isCameraOpen && (
                                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1327&q=80')" }}>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <button onClick={startCamera} className="bg-primary/20 hover:bg-primary/30 text-white px-6 py-3 rounded-full font-bold backdrop-blur-md transition-all flex items-center gap-2">
                                            <span className="material-symbols-outlined">videocam</span>
                                            Buka Kamera
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <canvas ref={canvasRef} className="hidden"></canvas>

                    {/* Scanning Frame (Only show when loading) */}
                    {createScan.isPending && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                            <div className="w-64 h-64 border-4 border-primary rounded-3xl shadow-[0_0_100px_rgba(244,140,37,0.5)] flex flex-col items-center justify-center">
                                <div className="w-full h-1 bg-primary/20 relative overflow-hidden rounded-full mb-4 max-w-[80%]">
                                    <div className="absolute inset-0 bg-primary animate-[scan_2s_infinite]"></div>
                                </div>
                                <span className="text-white font-bold text-sm tracking-widest uppercase">Menganalisis...</span>
                            </div>
                        </div>
                    )}

                    {/* Camera Controls */}
                    <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-8 z-10">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all"
                            title="Unggah dari Galeri"
                        >
                            <span className="material-symbols-outlined text-2xl">photo_library</span>
                        </button>

                        <button
                            onClick={isCameraOpen && !previewUrl ? capturePhoto : handleUpload}
                            disabled={(!selectedPetId && !previewUrl) || (isCameraOpen && !videoRef.current) || createScan.isPending}
                            className={`size-20 rounded-full border-4 border-white flex items-center justify-center ${createScan.isPending ? 'opacity-50 cursor-not-allowed' : 'bg-white/20 hover:scale-105'} backdrop-blur-sm transition-all cursor-pointer relative overflow-hidden`}
                        >
                            <div className={`size-16 rounded-full flex items-center justify-center ${createScan.isPending ? 'bg-primary animate-pulse' : 'bg-white'}`}>
                                {isCameraOpen && !previewUrl ? (
                                    <span className="material-symbols-outlined text-black text-3xl">camera</span>
                                ) : previewUrl ? (
                                    <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
                                ) : null}
                            </div>
                        </button>

                        <button
                            onClick={previewUrl ? resetScanner : startCamera}
                            className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all"
                            title={previewUrl ? "Ulangi" : "Ganti Kamera"}
                        >
                            <span className="material-symbols-outlined text-2xl">{previewUrl ? 'replay' : 'cameraswitch'}</span>
                        </button>
                    </div>
                </div>

                {/* Sidebar / Tips */}
                <div className="w-full lg:w-80 flex flex-col gap-4">
                    <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-border-light dark:border-border-dark flex-1">
                        <h3 className="font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">lightbulb</span>
                            Tips Memindai
                        </h3>
                        <ul className="space-y-4">
                            {[
                                { title: 'Pencahayaan Baik', desc: 'Pastikan kucing cukup terang, lebih baik dengan cahaya alami.', icon: 'wb_sunny' },
                                { title: 'Tangan Stabil', desc: 'Pegang kamera dengan stabil untuk menghindari hasil kabur.', icon: 'center_focus_weak' },
                                { title: 'Seluruh Tubuh', desc: 'Cobalah menangkap seluruh bagian kucing atau area yang dikhawatirkan.', icon: 'crop_free' }
                            ].map((tip, i) => (
                                <li key={i} className="flex gap-4 p-3 rounded-xl bg-background-light dark:bg-background-dark">
                                    <span className="material-symbols-outlined text-text-muted">{tip.icon}</span>
                                    <div>
                                        <h4 className="font-bold text-text-main dark:text-white text-sm">{tip.title}</h4>
                                        <p className="text-xs text-text-muted leading-snug">{tip.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scan {
                    0% { transform: translateY(-32px); }
                    50% { transform: translateY(32px); }
                    100% { transform: translateY(-32px); }
                }
            `}</style>
        </div>
    );
}
