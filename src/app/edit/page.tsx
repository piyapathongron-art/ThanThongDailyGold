"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getGoldPriceApi } from "@/api/mainApi";
import { toast } from "sonner";
import { useGoldStore } from '@/store/useGoldStore';

export default function EditPage() {
    const {
        goldBarMode,
        manualData,
        apiData,
        apiStatus,
        promoImages,
        setGoldBarMode,
        setManualData,
        setApiData,
        setApiStatus,
        syncApiToManual,
        setPromoImage,
    } = useGoldStore();

    const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    const [loading, setLoading] = useState(!apiData);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsHydrated(true), 0);
        const fetchData = async () => {
            setApiStatus('loading');
            try {
                const res = await getGoldPriceApi();
                if (res.data && res.data.response && res.data.response.price) {
                    setApiData(res.data.response);
                    setApiStatus('online');
                } else {
                    setApiStatus('offline');
                }
            } catch (e) {
                console.error("Failed to fetch reference data", e);
                setApiStatus('offline');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [setApiData, setApiStatus]);

    const handleSave = () => {
        toast.success("บันทึกการตั้งค่าเรียบร้อยแล้ว!");
    };

    const handleImageUpload = (index: number, file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            setPromoImage(index, dataUrl);
            toast.success(`อัปโหลดรูปโปรโมชั่น ${index + 1} เรียบร้อยแล้ว`);
        };
        reader.readAsDataURL(file);
    };

    const handleClearImage = (index: number) => {
        setPromoImage(index, '');
        if (fileInputRefs[index].current) fileInputRefs[index].current.value = '';
        toast.success(`ลบรูปโปรโมชั่น ${index + 1} แล้ว`);
    };

    const handleSync = () => {
        if (!apiData) {
            toast.error("ไม่มีข้อมูล API ให้ดึงในขณะนี้");
            return;
        }
        syncApiToManual();
        toast.success("ดึงราคาล่าสุดจาก API เข้าช่อง Manual แล้ว");
    };

    if (!isHydrated) return null;

    return (
        <main className="relative min-h-screen w-full bg-background overflow-x-hidden flex flex-col font-sans-thai p-4 sm:p-6 lg:p-12">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

            <div className="max-w-5xl mx-auto w-full space-y-6 sm:space-y-10 z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group text-lg sm:text-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
                        กลับหน้าหลัก
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-black text-white">Dashboard <span className="gold-gradient-text">Settings</span></h1>
                </div>

                {/* API Status & Controls */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${apiStatus === 'online' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        apiStatus === 'loading' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                            'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                            apiStatus === 'loading' ? 'bg-amber-500 animate-pulse' :
                                'bg-rose-500'
                            }`} />
                        <span className="text-sm font-bold uppercase tracking-wider">
                            API: {apiStatus === 'online' ? 'เชื่อมต่อแล้ว' : apiStatus === 'loading' ? 'กำลังเชื่อมต่อ...' : 'เชื่อมต่อไม่ได้'}
                        </span>
                    </div>

                    <button
                        onClick={handleSync}
                        disabled={apiStatus !== 'online'}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-white/5 text-slate-300 hover:text-white hover:bg-slate-700 transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                        <span className="text-sm font-bold">ดึงราคา API ใส่ Manual</span>
                    </button>
                </div>

                {/* Reference API Data Card */}
                <div className="glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl border-amber-500/20 bg-amber-500/5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                        <h2 className="text-lg sm:text-xl font-bold text-amber-500 uppercase tracking-widest">ราคาตลาดปัจจุบัน (API Reference)</h2>
                    </div>
                    {loading && !apiData ? (
                        <p className="text-slate-500 animate-pulse text-lg sm:text-xl">กำลังดึงข้อมูลราคาล่าสุด...</p>
                    ) : apiData ? (
                        <div className="flex flex-col items-start p-4 gap-2 sm:gap-3 bg-slate-900/40 rounded-2xl border border-white/5">
                            <div className="text-slate-400 font-bold text-sm sm:text-base">ทองคำแท่ง:</div>
                            <div className="text-xl sm:text-2xl font-black text-white leading-tight">
                                ซื้อ: <span className="text-amber-500">{apiData.price?.gold_bar?.buy}</span> <br />
                                ขาย: <span className="text-amber-500">{apiData.price?.gold_bar?.sell}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-rose-400">ไม่สามารถดึงข้อมูลอ้างอิงได้</p>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Gold Bar Settings */}
                    <div className="glass p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border-white/5 flex flex-col space-y-6 sm:space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl sm:text-2xl font-bold text-white">ทองคำแท่ง 96.5%</h3>
                            <div className="flex p-1 bg-slate-900/50 rounded-xl border border-white/5">
                                <button onClick={() => setGoldBarMode('api')} className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${goldBarMode === 'api' ? 'bg-amber-500 text-slate-900' : 'text-slate-500'}`}>API</button>
                                <button onClick={() => setGoldBarMode('manual')} className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${goldBarMode === 'manual' ? 'bg-amber-500 text-slate-900' : 'text-slate-500'}`}>Manual</button>
                            </div>
                        </div>

                        <div className={`space-y-4 transition-all duration-300 ${goldBarMode === 'api' ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase mb-2 block">ราคาซื้อ</label>
                                    <input
                                        type="text"
                                        value={manualData.goldBarBuy}
                                        onChange={(e) => setManualData({ goldBarBuy: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 sm:p-4 text-lg sm:text-xl text-white font-bold focus:border-amber-500/50 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase mb-2 block">ราคาขาย</label>
                                    <input
                                        type="text"
                                        value={manualData.goldBarSell}
                                        onChange={(e) => setManualData({ goldBarSell: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 sm:p-4 text-lg sm:text-xl text-white font-bold focus:border-amber-500/50 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gold Ornament Settings */}
                    <div className="glass p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border-white/5 flex flex-col space-y-6 sm:space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl sm:text-2xl font-bold text-white">ทองรูปพรรณ 96.5%</h3>
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">กรอกเอง</span>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase mb-2 block">ราคาซื้อ</label>
                                    <input
                                        type="text"
                                        value={manualData.goldBuy}
                                        onChange={(e) => setManualData({ goldBuy: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 sm:p-4 text-lg sm:text-xl text-white font-bold focus:border-amber-500/50 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase mb-2 block">ราคาขาย</label>
                                    <input
                                        type="text"
                                        value={manualData.goldSell}
                                        onChange={(e) => setManualData({ goldSell: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 sm:p-4 text-lg sm:text-xl text-white font-bold focus:border-amber-500/50 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Promo Image Upload */}
                <div className="glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl border-white/5">
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-6">รูปโปรโมชั่น</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[0, 1, 2].map((index) => (
                            <div key={index} className="flex flex-col gap-3">
                                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800/50 border border-white/10 flex items-center justify-center">
                                    {promoImages[index] ? (
                                        <>
                                            <img
                                                src={promoImages[index]}
                                                alt={`Promotion ${index + 1}`}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                            <button
                                                onClick={() => handleClearImage(index)}
                                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-500/80 hover:bg-rose-500 flex items-center justify-center transition-colors z-10"
                                                aria-label="ลบรูป"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-slate-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                                            <span className="text-xs">ยังไม่มีรูป</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-slate-400 text-sm font-bold text-center">โปรโมชั่น {index + 1}</p>
                                <input
                                    ref={fileInputRefs[index]}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleImageUpload(index, file);
                                    }}
                                />
                                <button
                                    onClick={() => fileInputRefs[index].current?.click()}
                                    className="w-full py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-700 transition-all text-sm font-bold flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                                    {promoImages[index] ? 'เปลี่ยนรูป' : 'อัปโหลดรูป'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full bg-gradient-to-r from-amber-400 to-amber-600 p-5 sm:p-6 rounded-2xl sm:rounded-3xl text-[#0f172a] text-xl sm:text-2xl font-black shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                    บันทึกการตั้งค่าทั้งหมด
                </button>
            </div>
        </main>
    );
}
