import React from 'react';

interface GoldPriceCardProps {
  title: string;
  buyPrice: string;
  sellPrice: string;
}

const GoldPriceCard: React.FC<GoldPriceCardProps> = ({ title, buyPrice, sellPrice }) => {
  const isGoldBar = title === 'ทองคำแท่ง 96.5%';

  return (
    <div className="glass p-5 md:p-6 xl:p-5 2xl:p-6 rounded-2xl md:rounded-3xl transition-all duration-300 shadow-2xl border border-primary/10 flex flex-col justify-center">
      {/* Title */}
      <h2 className="text-xl md:text-2xl xl:text-[1.65rem] 2xl:text-[2.15rem] font-bold text-white tracking-wide mb-3 xl:mb-2 2xl:mb-4 border-l-4 border-secondary pl-3">
        {title}
      </h2>

      <div className="flex flex-col justify-center gap-2 xl:gap-1 2xl:gap-2">
        {/* Sell Row (Only for Gold Bar) */}
        {isGoldBar && (
          <div className="flex items-center justify-between w-full">
            <span className="text-lg md:text-2xl xl:text-xl 2xl:text-[80px] font-black text-slate-300">
              ขายออก
            </span>
            <span className="text-5xl md:text-7xl xl:text-[4rem] 2xl:text-[5.5rem] font-black gold-gradient-text tracking-tighter leading-none tabular-nums">
              {sellPrice}
            </span>
          </div>
        )}

        {/* Dynamic Divider (Only for Gold Bar) */}
        {isGoldBar && (
          <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent my-2 xl:my-1.5 2xl:my-2.5" />
        )}

        {/* Buy Row */}
        <div className="flex items-center justify-between w-full">
          <span className="text-lg md:text-2xl xl:text-xl 2xl:text-[80px] font-black text-card-label">
            ซื้อเข้า
          </span>
          <span className="text-5xl md:text-7xl xl:text-[4rem] 2xl:text-[5.5rem] font-black gold-gradient-text tracking-tighter leading-none tabular-nums">
            {buyPrice}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GoldPriceCard;
