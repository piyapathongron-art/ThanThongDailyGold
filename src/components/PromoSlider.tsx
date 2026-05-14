'use client';

import React, { useState, useEffect } from 'react';

const PromoSlider = () => {
  // จำลองรายการรูปโปรโมชั่น (ผู้ใช้สามารถเพิ่มไฟล์ลงใน public/ และอัปเดตชื่อไฟล์ที่นี่)
  const promoImages = [
    '/promo1.jpg',
    '/promo2.jpg',
    '/promo3.jpg',
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (promoImages.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % promoImages.length);
    }, 5000); // เปลี่ยนรูปทุกๆ 5 วินาที

    return () => clearInterval(interval);
  }, [promoImages.length]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl md:rounded-3xl glass shadow-2xl">
      {promoImages.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* กรณีที่ยังไม่มีรูปจริง จะแสดงเป็นพื้นหลังสีๆ พร้อมข้อความบอกตำแหน่ง */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-red to-background flex flex-col items-center justify-center p-6 md:p-12 text-center space-y-4 md:space-y-6">
            <div className="w-16 h-16 md:w-24 md:h-24 2xl:w-40 2xl:h-40 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-12 md:h-12 2xl:w-20 2xl:h-20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
            <div className="space-y-1 md:space-y-2">
              <h2 className="text-2xl md:text-4xl 2xl:text-7xl font-bold text-white uppercase tracking-widest">Promotion {index + 1}</h2>
              <p className="text-base md:text-xl 2xl:text-4xl text-slate-300">กรุณาวางไฟล์รูปภาพชื่อ <span className="text-primary font-mono">public{src}</span> เพื่อแสดงผล</p>
            </div>
            
            {/* เลเยอร์รูปจริง (จะซ้อนทับถ้ามีไฟล์อยู่) */}
            <img 
              src={src} 
              alt={`Promotion ${index + 1}`} 
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                // ถ้าโหลดรูปไม่ขึ้น (ไม่มีไฟล์) ให้ซ่อนตัว img
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      ))}
      
      {/* Slide Indicators */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3">
        {promoImages.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 md:h-2 transition-all duration-300 rounded-full ${
              index === activeIndex ? 'w-8 md:w-12 bg-primary' : 'w-1.5 md:w-2 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoSlider;
