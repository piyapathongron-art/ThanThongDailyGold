"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getGoldPriceApi } from "@/api/mainApi";
import { toast } from "sonner";
import { useGoldStore } from '@/store/useGoldStore';

export default function EditPage() {
    const { 
        goldBarMode, 
        goldOrnamentMode, 
        manualData, 
        apiData,
        apiStatus,
        setGoldBarMode, 
        setGoldOrnamentMode, 
        setManualData, 
        setApiData,
        setApiStatus,
        syncApiToManual
    } = useGoldStore();

    const [loading, setLoading] = useState(!apiData);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
        const fetchData = async () => {
            setApiStatus('loading');
            try {
                const res = await getGoldPriceApi();
                if (res.data && res.data.response) {
                    setApiData(res.data.response);
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
    }, []);

    const handleSave = () => {
        toast.success("บันทึกการตั้งค่าเรียบร้อยแล้ว!");
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
        <main className="relative min-h-screen w-full bg-[#0f172a] overflow-x-hidden flex flex-col font-sans-thai p-4 sm:p-6 lg:p-12">
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
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                        apiStatus === 'online' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                        apiStatus === 'loading' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 
                        'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                        <div className={`w-2 h-2 rounded-full ${
                            apiStatus === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        <span className="text-sm font-bold">ดึงราคา API ใส่ Manual</span>
                    </button>
                </div>

                {/* Reference API Data Card */}
                <div className="glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl border-amber-500/20 bg-amber-500/5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                        <h2 className="text-lg sm:text-xl font-bold text-amber-500 uppercase tracking-widest">ราคาตลาดปัจจุบัน (API Reference)</h2>
                        <p className="text-slate-500 text-sm sm:text-xl sm:ml-auto">
                            อัปเดตล่าสุด: {apiData?.update_date || '...'} {apiData?.update_time || ''}
                        </p>
                    </div>
                    {loading && !apiData ? (
                        <p className="text-slate-500 animate-pulse text-lg sm:text-xl">กำลังดึงข้อมูลราคาล่าสุด...</p>
                    ) : apiData ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col items-start p-4 gap-2 sm:gap-3 bg-slate-900/40 rounded-2xl border border-white/5">
                                <div className="text-slate-400 font-bold text-sm sm:text-base">ทองคำแท่ง:</div>
                                <div className="text-xl sm:text-2xl font-black text-white leading-tight">
                                    ซื้อ: <span className="text-amber-500">{apiData.price?.gold_bar?.buy}</span> <br /> 
                                    ขาย: <span className="text-amber-500">{apiData.price?.gold_bar?.sell}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-start p-4 gap-2 sm:gap-3 bg-slate-900/40 rounded-2xl border border-white/5">
                                <div className="text-slate-400 font-bold text-sm sm:text-base">ทองรูปพรรณ:</div>
                                <div className="text-xl sm:text-2xl font-black text-white leading-tight">
                                    ซื้อ: <span className="text-amber-500">{apiData.price?.gold?.buy}</span> <br /> 
                                    ขาย: <span className="text-amber-500">{apiData.price?.gold?.sell}</span>
                                </div>
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
                            <div className="flex p-1 bg-slate-900/50 rounded-xl border border-white/5">
                                <button onClick={() => setGoldOrnamentMode('api')} className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${goldOrnamentMode === 'api' ? 'bg-amber-500 text-slate-900' : 'text-slate-500'}`}>API</button>
                                <button onClick={() => setGoldOrnamentMode('manual')} className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${goldOrnamentMode === 'manual' ? 'bg-amber-500 text-slate-900' : 'text-slate-500'}`}>Manual</button>
                            </div>
                        </div>

                        <div className={`space-y-4 transition-all duration-300 ${goldOrnamentMode === 'api' ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
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
