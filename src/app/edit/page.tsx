"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getGoldPriceApi } from "@/api/mainApi";
import { toast } from "sonner";

export default function EditPage() {
    const [apiData, setApiData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Separate modes for each gold type
    const [goldBarMode, setGoldBarMode] = useState<'api' | 'manual'>('api');
    const [goldOrnamentMode, setGoldOrnamentMode] = useState<'api' | 'manual'>('api');

    const [manualData, setManualData] = useState({
        goldBarBuy: 'กำหลังโหลดข้อมูล...',
        goldBarSell: 'กำหลังโหลดข้อมูล...',
        goldBuy: 'กำหลังโหลดข้อมูล...',
        goldSell: 'กำหลังโหลดข้อมูล...',
    });

    // Fetch API data for reference and load saved settings
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getGoldPriceApi();
                setApiData(res.data.response);
                setManualData({
                    goldBarBuy: res?.data?.response?.price?.gold_bar?.buy || '0',
                    goldBarSell: res?.data?.response?.price?.gold_bar?.sell || '0',
                    goldBuy: res?.data?.response?.price?.gold?.buy || '0',
                    goldSell: res?.data?.response?.price?.gold?.sell || '0',
                })
            } catch (e) {
                console.error("Failed to fetch reference data", e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Load saved settings from cookies
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);

            if (parts.length === 2) return parts.pop()?.split(';').shift();
        };
        const savedSettings = getCookie('gold_settings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(decodeURIComponent(savedSettings));
                if (parsed.goldBarMode) setGoldBarMode(parsed.goldBarMode);
                if (parsed.goldOrnamentMode) setGoldOrnamentMode(parsed.goldOrnamentMode);
                if (parsed.manualData) setManualData(parsed.manualData);
            } catch (e) {
                console.error("Failed to parse settings", e);
            }
        }
    }, []);

    const handleSave = () => {
        const settings = {
            goldBarMode,
            goldOrnamentMode,
            manualData
        };
        document.cookie = `gold_settings=${encodeURIComponent(JSON.stringify(settings))}; path=/; max-age=${60 * 60 * 24 * 7}`;
        toast.success("บันทึกการตั้งค่าแยกส่วนเรียบร้อยแล้ว!");
    };

    return (
        <main className="relative min-h-screen w-full bg-[#0f172a] overflow-x-hidden flex flex-col font-sans-thai p-6 lg:p-12">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

            <div className="max-w-5xl mx-auto w-full space-y-10 z-10">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group text-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
                        กลับหน้าหลัก
                    </Link>
                    <h1 className="text-4xl font-black text-white">Dashboard <span className="gold-gradient-text">Settings</span></h1>
                </div>

                {/* Reference API Data Card */}
                <div className="glass p-8 rounded-3xl border-amber-500/20 bg-amber-500/5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                        <h2 className="text-xl font-bold text-amber-500 uppercase tracking-widest">ราคาตลาดปัจจุบัน (API Reference)</h2>
                        <p className="text-slate-500 animate-pulse text-xl">อัปเดตล่าสุด: {apiData?.update_date || 'กำลังโหลดข้อมูล...'} {apiData?.update_time || ''}</p>
                    </div>
                    {loading ? (
                        <p className="text-slate-500 animate-pulse text-xl">กำลังดึงข้อมูลราคาล่าสุด...</p>
                    ) : apiData ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col items-start p-4 gap-3  bg-slate-900/40 rounded-2xl">
                                <div className="text-slate-400 font-bold">ทองคำแท่ง:</div>
                                <div className="text-2xl font-black text-white">ซื้อ: {apiData.price?.gold_bar?.buy} <br /> ขาย: {apiData.price?.gold_bar?.sell}</div>
                            </div>
                            <div className="flex flex-col items-start p-4 gap-3 bg-slate-900/40 rounded-2xl">
                                <div className="text-slate-400 font-bold">ทองรูปพรรณ:</div>
                                <div className="text-2xl font-black text-white">ซื้อ: {apiData.price?.gold?.buy} <br /> ขาย: {apiData.price?.gold?.sell}</div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-rose-400">ไม่สามารถดึงข้อมูลอ้างอิงได้</p>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Gold Bar Settings */}
                    <div className="glass p-8 rounded-[2.5rem] border-white/5 flex flex-col space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-white">ทองคำแท่ง 96.5%</h3>
                            <div className="flex p-1 bg-slate-900/50 rounded-xl border border-white/5">
                                <button onClick={() => setGoldBarMode('api')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${goldBarMode === 'api' ? 'bg-amber-500 text-slate-900' : 'text-slate-500'}`}>API</button>
                                <button onClick={() => setGoldBarMode('manual')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${goldBarMode === 'manual' ? 'bg-amber-500 text-slate-900' : 'text-slate-500'}`}>Manual</button>
                            </div>
                        </div>

                        <div className={`space-y-4 transition-all duration-300 ${goldBarMode === 'api' ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">ราคาซื้อ</label>
                                    <input type="text" value={manualData.goldBarBuy} onChange={(e) => setManualData({ ...manualData, goldBarBuy: e.target.value })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 text-xl text-white font-bold focus:border-amber-500/50 outline-none" />
                                </div>
                                <div>
                                    <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">ราคาขาย</label>
                                    <input type="text" value={manualData.goldBarSell} onChange={(e) => setManualData({ ...manualData, goldBarSell: e.target.value })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 text-xl text-white font-bold focus:border-amber-500/50 outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gold Ornament Settings */}
                    <div className="glass p-8 rounded-[2.5rem] border-white/5 flex flex-col space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-white">ทองรูปพรรณ 96.5%</h3>
                            <div className="flex p-1 bg-slate-900/50 rounded-xl border border-white/5">
                                <button onClick={() => setGoldOrnamentMode('api')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${goldOrnamentMode === 'api' ? 'bg-amber-500 text-slate-900' : 'text-slate-500'}`}>API</button>
                                <button onClick={() => setGoldOrnamentMode('manual')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${goldOrnamentMode === 'manual' ? 'bg-amber-500 text-slate-900' : 'text-slate-500'}`}>Manual</button>
                            </div>
                        </div>

                        <div className={`space-y-4 transition-all duration-300 ${goldOrnamentMode === 'api' ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">ราคาซื้อ</label>
                                    <input type="text" value={manualData.goldBuy} onChange={(e) => setManualData({ ...manualData, goldBuy: e.target.value })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 text-xl text-white font-bold focus:border-amber-500/50 outline-none" />
                                </div>
                                <div>
                                    <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">ราคาขาย</label>
                                    <input type="text" value={manualData.goldSell} onChange={(e) => setManualData({ ...manualData, goldSell: e.target.value })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 text-xl text-white font-bold focus:border-amber-500/50 outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full bg-gradient-to-r from-amber-400 to-amber-600 p-6 rounded-3xl text-[#0f172a] text-2xl font-black shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                    บันทึกการตั้งค่าทั้งหมด
                </button>
            </div>
        </main>
    );
}
