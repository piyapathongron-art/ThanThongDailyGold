import React from 'react';

interface GoldPriceCardProps {
  title: string;
  buyPrice: string;
  sellPrice: string;
}

const GoldPriceCard: React.FC<GoldPriceCardProps> = ({ title, buyPrice, sellPrice }) => {
  return (
    <div className="glass p-5 md:p-8 2xl:p-12 rounded-[1.5rem] md:rounded-[2.5rem] transition-all duration-300 shadow-xl border-white/5">
      <p className="text-xs md:text-base 2xl:text-[140px] uppercase  text-white font-bold mb-4 md:mb-6 2xl:mb-8">{title}</p>
      <div className="space-y-6 md:space-y-12 2xl:space-y-16">
        
         <div className="space-y-2 md:space-y-4">
          <div className="flex justify-between items-baseline">
            {/* <p className="text-base md:text-2xl xl:text-3xl 2xl:text-5xl text-white font-bold">บาทละ</p> */}
          </div>

          {title === 'ทองคำแท่ง 96.5%' &&<div className="flex items-baseline justify-between gap-2 md:gap-4">
            <p className="text-sm md:text-xl xl:text-2xl 2xl:text-[180px] text-white font-bold">ขายออก</p>
            <span className="text-5xl md:text-7xl xl:text-8xl 2xl:text-[12rem] leading-none font-black gold-gradient-text tracking-tighter">{sellPrice}</span>
          </div>}
        </div>

        

       
      
      <div className="space-y-2 md:space-y-4">
          <div className="flex justify-between items-baseline">
            {/* <p className="text-base md:text-2xl xl:text-3xl 2xl:text-5xl text-card-label font-bold">บาทละ</p> */}
          </div>
          <div className="flex items-baseline justify-between gap-2 md:gap-4">
            <p className="text-sm md:text-xl xl:text-2xl 2xl:text-[180px] uppercase  text-card-label font-bold">ซื้อเข้า</p>
            <span className="text-5xl md:text-7xl xl:text-8xl 2xl:text-[12rem] leading-none font-black gold-gradient-text tracking-tighter">{buyPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldPriceCard;
