import React from 'react';

interface GoldPriceCardProps {
  buyPrice: string;
  sellPrice: string;
}

const GoldPriceCard: React.FC<GoldPriceCardProps> = ({ buyPrice, sellPrice }) => {
  return (
    <div className="glass p-5 md:p-8 2xl:p-12 rounded-[1.5rem] md:rounded-[2.5rem] transition-all duration-300 shadow-xl border-white/5">
      <div className="space-y-6 md:space-y-12 2xl:space-y-16">
        <div className="space-y-2 md:space-y-4">
          <div className="flex justify-between items-baseline">
            <p className="text-sm md:text-xl xl:text-2xl 2xl:text-4xl uppercase tracking-[0.2em] text-card-label font-bold">รับซื้อ</p>
            <p className="text-base md:text-2xl xl:text-3xl 2xl:text-5xl text-card-label font-bold">บาทละ</p>
          </div>
          <div className="flex items-baseline justify-end gap-2 md:gap-4">
            <span className="text-5xl md:text-7xl xl:text-8xl 2xl:text-[12rem] leading-none font-black gold-gradient-text tracking-tighter">{buyPrice}</span>
          </div>
        </div>

        <div className="h-px bg-card-separator"></div>

        <div className="space-y-2 md:space-y-4">
          <div className="flex justify-between items-baseline">
            <p className="text-sm md:text-xl xl:text-2xl 2xl:text-4xl uppercase tracking-[0.2em] text-card-label font-bold">ขายออก</p>
            <p className="text-base md:text-2xl xl:text-3xl 2xl:text-5xl text-card-label font-bold">บาทละ</p>
          </div>
          <div className="flex items-baseline justify-end gap-2 md:gap-4">
            <span className="text-5xl md:text-7xl xl:text-8xl 2xl:text-[12rem] leading-none font-black gold-gradient-text tracking-tighter">{sellPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldPriceCard;
