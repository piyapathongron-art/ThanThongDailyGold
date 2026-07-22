"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import GoldPriceCard from '@/components/GoldPriceCard';
import PromoSlider from '@/components/PromoSlider';
import { getGoldPriceApi } from "@/api/mainApi";
import Link from 'next/link';
import { useGoldStore } from '@/store/useGoldStore';

export default function Home() {
  const {
    goldBarMode,
    manualData,
    apiData,
    apiStatus,
    setApiData,
    setApiStatus
  } = useGoldStore();

  const [isHydrated, setIsHydrated] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const savedRotation = Number(localStorage.getItem('gold-rotation')) || 0;
    setRotation(savedRotation);
    setTimeout(() => setIsHydrated(true), 0);
    const fetchData = async () => {
      setApiStatus('loading');
      try {
        const res = await getGoldPriceApi();
        if (res.data && res.data.response && res.data.response.price) {
          setApiData(res.data.response);
        } else {
          setApiStatus('offline');
        }
      } catch (error) {
        console.error("Failed to fetch gold prices:", error);
        setApiStatus('offline');
      }
    };

    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [setApiData, setApiStatus]);

  console.log(apiData);

  if (!isHydrated) {
    return <div className="min-h-screen bg-background" />; // Simple placeholder during hydration
  }

  // Determine display modes with automatic fallback
  const effectiveBarMode = apiStatus === 'offline' ? 'manual' : goldBarMode;

  // Prepare price data for display
  const displayGoldPrices = [
    {
      title: 'ทองคำแท่ง 96.5%',
      buyPrice: effectiveBarMode === 'manual' ? manualData.goldBarBuy : (apiData?.price?.gold_bar?.buy || 'รอข้อมูล...'),
      sellPrice: effectiveBarMode === 'manual' ? manualData.goldBarSell : (apiData?.price?.gold_bar?.sell || 'รอข้อมูล...'),
    },
    {
      title: 'ทองรูปพรรณ 96.5%',
      buyPrice: manualData.goldBuy,
      sellPrice: manualData.goldSell,
    },
  ];

  // 90/270 swap width and height to fill the physical screen; 180 stays landscape, just flipped.
  const isPortrait = rotation === 90 || rotation === 270;
  const rotationStyle = rotation === 0 ? undefined : {
    transform: `rotate(${rotation}deg)`,
    transformOrigin: 'center center',
    position: 'fixed' as const,
    ...(isPortrait ? {
      width: '100vh',
      height: '100vw',
      top: '50%',
      left: '50%',
      marginTop: '-50vw',
      marginLeft: '-50vh',
    } : {
      width: '100vw',
      height: '100vh',
      top: '50%',
      left: '50%',
      marginTop: '-50vh',
      marginLeft: '-50vw',
    }),
  };

  return (
    <main
      className="relative min-h-screen xl:h-screen xl:overflow-hidden w-full bg-background overflow-x-hidden flex flex-col font-sans-thai"
      style={rotationStyle}
    >
      {/* Settings Button & API Status */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50 flex items-center gap-3">
        <button
          onClick={() => {
            const next = ((rotation + 90) % 360) as 0 | 90 | 180 | 270;
            setRotation(next);
            localStorage.setItem('gold-rotation', String(next));
          }}
          className="p-2 sm:p-4 glass rounded-xl sm:rounded-2xl text-slate-400 hover:text-white hover:scale-110 transition-all border-white/5"
          title={`หมุนจอ (${rotation}°)`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6" /><path d="M2.5 22v-6h6" /><path d="M2 11.5a10 10 0 0 1 18.8-4.3" /><path d="M22 12.5a10 10 0 0 1-18.8 4.2" /></svg>
        </button>

        {/* <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border glass ${apiStatus === 'online' ? 'border-emerald-500/20 text-emerald-400' :
            apiStatus === 'loading' ? 'border-amber-500/20 text-amber-400' :
              'border-rose-500/20 text-rose-400'
          }`}>
          <div className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
              apiStatus === 'loading' ? 'bg-amber-500 animate-pulse' :
                'bg-rose-500'
            }`} />
          <span className="text-[10px] font-black uppercase tracking-tighter">
            {apiStatus === 'online' ? 'API Online' : apiStatus === 'loading' ? 'Connecting' : 'Offline Mode'}
          </span>
        </div> */}

        <Link
          href="/edit"
          className="p-2 sm:p-4 glass rounded-xl sm:rounded-2xl text-slate-400 hover:text-white hover:scale-110 transition-all border-white/5"
          title="ตั้งค่า"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
        </Link>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-accent-red/5 blur-[100px] pointer-events-none" />

      {/* Main Content Area */}
      <div className={`flex-1 flex w-full p-4 md:p-6 lg:p-8 xl:p-8 2xl:p-10 gap-6 md:gap-8 xl:gap-8 2xl:gap-10 ${isPortrait ? 'flex-col h-[calc(100vh-2rem)] overflow-hidden' : 'flex-col xl:flex-row xl:h-[calc(100vh-6rem)] 2xl:h-[calc(100vh-8rem)] xl:overflow-hidden'}`}>

        {/* Gold Prices */}
        <div className={`w-full flex flex-col gap-6 md:gap-8 ${isPortrait ? '' : 'xl:w-[45%] 2xl:w-[42%] xl:h-full xl:justify-between xl:gap-6'}`}>
          <Header />
          <div className={`flex flex-col gap-4 md:gap-6 mt-2 xl:mt-0 ${isPortrait ? '' : 'xl:flex-1 xl:justify-center xl:gap-4 2xl:gap-6'}`}>
            {displayGoldPrices.map((price, index) => (
              <GoldPriceCard key={index} {...price} />
            ))}
          </div>
        </div>

        {/* Promo Slider */}
        <div className={`w-full border-8 rounded-4xl border-primary ${isPortrait ? 'flex-1 min-h-0' : 'xl:flex-1 min-h-[300px] sm:min-h-[400px] md:min-h-[500px] xl:h-full xl:min-h-0'}`}>
          <PromoSlider />
        </div>
      </div>

      {/* Scrolling Footer Marquee */}
      {/* <div className="h-14 md:h-20 lg:h-24 2xl:h-32 bg-accent-red/30 border-t border-primary/20 flex items-center overflow-hidden whitespace-nowrap sticky bottom-0 z-50 backdrop-blur-md">
        <div className="animate-marquee py-2">
          <span className="text-xl md:text-2xl lg:text-4xl 2xl:text-6xl font-bold text-primary mx-8 md:mx-12 uppercase tracking-widest">
            ยินดีต้อนรับสู่ DailyGold • ราคาทองคำมีการเปลี่ยนแปลงตามกลไกตลาด • ตรวจสอบราคาล่าสุดได้ที่หน้าเคาน์เตอร์ • โปรโมชั่นพิเศษสำหรับสมาชิกใหม่ รับส่วนลดค่ากำเหน็จ 50% • มั่นใจในคุณภาพ ทองคำมาตรฐานสมาคมค้าทองคำ •
          </span>
          <span className="text-xl md:text-2xl lg:text-4xl 2xl:text-6xl font-bold text-primary mx-8 md:mx-12 uppercase tracking-widest">
            ยินดีต้อนรับสู่ DailyGold • ราคาทองคำมีการเปลี่ยนแปลงตามกลไกตลาด • ตรวจสอบราคาล่าสุดได้ที่หน้าเคาน์เตอร์ • โปรโมชั่นพิเศษสำหรับสมาชิกใหม่ รับส่วนลดค่ากำเหน็จ 50% • มั่นใจในคุณภาพ ทองคำมาตรฐานสมาคมค้าทองคำ •
          </span>
        </div>
      </div> */}
    </main>
  );
}

