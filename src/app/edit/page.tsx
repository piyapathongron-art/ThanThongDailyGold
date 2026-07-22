"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from "sonner";

import { getGoldPriceApi } from "@/api/mainApi";
import { fetchSettings, saveSettings, uploadPromoImage, type DisplaySettings } from '@/lib/settings-client';

const MAX_SLIDES = 5;

type EditableFields = Pick<
    DisplaySettings,
    'goldBarMode' | 'goldBarBuy' | 'goldBarSell' | 'goldBuy' | 'goldSell' | 'pollSeconds'
>;

const toEditable = (settings: DisplaySettings): EditableFields => ({
    goldBarMode: settings.goldBarMode,
    goldBarBuy: settings.goldBarBuy,
    goldBarSell: settings.goldBarSell,
    goldBuy: settings.goldBuy,
    goldSell: settings.goldSell,
    pollSeconds: settings.pollSeconds,
});

export default function EditPage() {
    const [settings, setSettings] = useState<DisplaySettings | null>(null);
    const [form, setForm] = useState<EditableFields | null>(null);
    const [password, setPassword] = useState('');
    const [marketPrice, setMarketPrice] = useState<{ buy: string; sell: string } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchSettings()
            .then((loaded) => {
                setSettings(loaded);
                setForm(toEditable(loaded));
            })
            .catch((error: Error) => setLoadError(error.message));

        getGoldPriceApi()
            .then((res) => {
                const bar = res.data?.response?.price?.gold_bar;
                if (bar?.buy && bar?.sell) setMarketPrice(bar);
            })
            .catch(() => setMarketPrice(null));
    }, []);

    const requirePassword = () => {
        if (password) return true;
        toast.error("กรอกรหัสผ่านก่อน");
        return false;
    };

    const applySaved = (saved: DisplaySettings) => {
        setSettings(saved);
        setForm(toEditable(saved));
    };

    const handleSave = async () => {
        if (!form || !requirePassword()) return;
        setIsSaving(true);
        try {
            applySaved(await saveSettings(password, form));
            toast.success("บันทึกแล้ว จอในร้านจะเปลี่ยนตามภายในไม่กี่วินาที");
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpload = async (file: File) => {
        if (!requirePassword()) return;
        setIsSaving(true);
        try {
            applySaved(await uploadPromoImage(password, file));
            toast.success("อัปโหลดรูปแล้ว");
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsSaving(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // ponytail: the file stays in the bucket, only the URL leaves the list. Storage is
    // far cheaper than an orphan-cleanup path nobody will maintain.
    const handleRemoveImage = async (url: string) => {
        if (!settings || !requirePassword()) return;
        setIsSaving(true);
        try {
            const promoImages = settings.promoImages.filter((image) => image !== url);
            applySaved(await saveSettings(password, { promoImages }));
            toast.success("ลบรูปแล้ว");
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSyncMarketPrice = () => {
        if (!marketPrice || !form) {
            toast.error("ไม่มีราคาตลาดให้ดึงในขณะนี้");
            return;
        }
        setForm({ ...form, goldBarBuy: marketPrice.buy, goldBarSell: marketPrice.sell });
        toast.success("ใส่ราคาตลาดในช่องแล้ว กด \"บันทึก\" เพื่อขึ้นจอ");
    };

    if (loadError) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center p-6 font-sans-thai">
                <p className="text-rose-400 text-xl text-center">{loadError}</p>
            </main>
        );
    }

    if (!form || !settings) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center font-sans-thai">
                <p className="text-slate-500 animate-pulse text-xl">กำลังโหลดการตั้งค่า...</p>
            </main>
        );
    }

    const inputClass = "w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 sm:p-4 text-lg sm:text-xl text-white font-bold focus:border-amber-500/50 outline-none";
    const labelClass = "text-slate-500 text-[10px] sm:text-xs font-bold uppercase mb-2 block";

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

                {/* Password */}
                <div className="glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl border-amber-500/20 bg-amber-500/5 space-y-3">
                    <label htmlFor="edit-password" className={labelClass}>รหัสผ่านพนักงาน</label>
                    <input
                        id="edit-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="กรอกก่อนบันทึกหรืออัปโหลดรูป"
                        className={inputClass}
                    />
                </div>

                {/* Market reference */}
                <div className="glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl border-white/5 space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <h2 className="text-lg sm:text-xl font-bold text-amber-500 uppercase tracking-widest">ราคาตลาดปัจจุบัน</h2>
                        <button
                            onClick={handleSyncMarketPrice}
                            disabled={!marketPrice}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-white/5 text-slate-300 hover:text-white hover:bg-slate-700 transition-all disabled:opacity-30 disabled:pointer-events-none sm:ml-auto"
                        >
                            <span className="text-sm font-bold">ใส่ราคาตลาดในช่องทองคำแท่ง</span>
                        </button>
                    </div>
                    {marketPrice ? (
                        <div className="text-xl sm:text-2xl font-black text-white leading-tight">
                            ทองคำแท่ง — ซื้อ: <span className="text-amber-500">{marketPrice.buy}</span> · ขาย: <span className="text-amber-500">{marketPrice.sell}</span>
                        </div>
                    ) : (
                        <p className="text-rose-400">ดึงราคาตลาดไม่ได้ กรอกราคาเองด้านล่าง</p>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Gold Bar */}
                    <div className="glass p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border-white/5 flex flex-col space-y-6 sm:space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl sm:text-2xl font-bold text-white">ทองคำแท่ง 96.5%</h3>
                            <div className="flex p-1 bg-slate-900/50 rounded-xl border border-white/5">
                                {(['api', 'manual'] as const).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setForm({ ...form, goldBarMode: mode })}
                                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${form.goldBarMode === mode ? 'bg-amber-500 text-slate-900' : 'text-slate-500'}`}
                                    >
                                        {mode === 'api' ? 'API' : 'Manual'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={`space-y-4 transition-all duration-300 ${form.goldBarMode === 'api' ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="bar-buy" className={labelClass}>ราคาซื้อ</label>
                                    <input id="bar-buy" type="text" value={form.goldBarBuy} onChange={(e) => setForm({ ...form, goldBarBuy: e.target.value })} className={inputClass} />
                                </div>
                                <div>
                                    <label htmlFor="bar-sell" className={labelClass}>ราคาขาย</label>
                                    <input id="bar-sell" type="text" value={form.goldBarSell} onChange={(e) => setForm({ ...form, goldBarSell: e.target.value })} className={inputClass} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gold Ornament */}
                    <div className="glass p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border-white/5 flex flex-col space-y-6 sm:space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl sm:text-2xl font-bold text-white">ทองรูปพรรณ 96.5%</h3>
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">กรอกเอง</span>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="ornament-buy" className={labelClass}>ราคาซื้อ</label>
                                    <input id="ornament-buy" type="text" value={form.goldBuy} onChange={(e) => setForm({ ...form, goldBuy: e.target.value })} className={inputClass} />
                                </div>
                                <div>
                                    <label htmlFor="ornament-sell" className={labelClass}>ราคาขาย</label>
                                    <input id="ornament-sell" type="text" value={form.goldSell} onChange={(e) => setForm({ ...form, goldSell: e.target.value })} className={inputClass} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Promo images */}
                <div className="glass p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border-white/5 space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-white">รูปโปรโมชั่น</h3>
                        <span className="text-slate-500 text-sm">{settings.promoImages.length}/{MAX_SLIDES} รูป · จอจะวนเฉพาะรูปที่อัปไว้</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {settings.promoImages.map((url, index) => (
                            <div key={url} className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                                <img src={url} alt={`โปรโมชั่นที่ ${index + 1}`} className="w-full h-full object-cover" />
                                <button
                                    onClick={() => handleRemoveImage(url)}
                                    disabled={isSaving}
                                    className="absolute top-2 right-2 px-3 py-1.5 rounded-lg bg-rose-600/90 text-white text-xs font-bold hover:bg-rose-500 disabled:opacity-40"
                                >
                                    ลบ
                                </button>
                            </div>
                        ))}

                        {settings.promoImages.length < MAX_SLIDES && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isSaving}
                                className="aspect-video rounded-2xl border-2 border-dashed border-white/15 text-slate-400 hover:text-white hover:border-amber-500/50 transition-all flex items-center justify-center text-base font-bold disabled:opacity-40"
                            >
                                + เพิ่มรูป
                            </button>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUpload(file);
                        }}
                    />
                </div>

                {/* Poll interval + save */}
                <div className="glass p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border-white/5 flex flex-col sm:flex-row sm:items-end gap-6">
                    <div className="sm:w-64">
                        <label htmlFor="poll-seconds" className={labelClass}>จอเช็คทุกกี่วินาที (5–300)</label>
                        <input
                            id="poll-seconds"
                            type="number"
                            min={5}
                            max={300}
                            value={form.pollSeconds}
                            onChange={(e) => setForm({ ...form, pollSeconds: Number(e.target.value) })}
                            className={inputClass}
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="sm:ml-auto px-8 py-4 rounded-2xl bg-amber-500 text-slate-900 text-lg font-black hover:bg-amber-400 transition-all disabled:opacity-40 disabled:pointer-events-none"
                    >
                        {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
                    </button>
                </div>
            </div>
        </main>
    );
}
