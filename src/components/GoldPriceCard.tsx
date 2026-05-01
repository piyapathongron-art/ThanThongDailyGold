import React from 'react';

interface GoldPriceCardProps {
  title: string;
  buyPrice: string;
  sellPrice: string;
  diff?: string;
  isUp?: boolean;
}

const GoldPriceCard: React.FC<GoldPriceCardProps> = ({ title, buyPrice, sellPrice, diff, isUp }) => {
  return (
    <div className="glass p-5 md:p-8 2xl:p-12 rounded-[1.5rem] md:rounded-[2.5rem] transition-all duration-300 shadow-xl border-white/5">
      {/* <div className="flex justify-between items-center mb-6 md:mb-10">
        <h3 className="text-xl md:text-3xl xl:text-4xl 2xl:text-6xl font-bold text-slate-100">{title}</h3>
        {diff && (
          <div className={`flex items-center gap-1 md:gap-2 px-3 py-1 md:px-5 md:py-2 rounded-full text-lg md:text-2xl 2xl:text-4xl font-bold ${isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {isUp ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-7 md:h-7 2xl:w-10 2xl:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-7 md:h-7 2xl:w-10 2xl:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>
            )}
            {diff}
          </div>
        )}
      </div> */}

      <div className="space-y-6 md:space-y-12 2xl:space-y-16">
        <div className="space-y-2 md:space-y-4">
          <div className="flex justify-between items-baseline">
            <p className="text-sm md:text-xl xl:text-2xl 2xl:text-4xl uppercase tracking-[0.2em] text-slate-500 font-bold">รับซื้อ</p>
            <p className="text-base md:text-2xl xl:text-3xl 2xl:text-5xl text-slate-500 font-bold">บาทละ</p>
          </div>
          <div className="flex items-baseline justify-end gap-2 md:gap-4">
            <span className="text-5xl md:text-7xl xl:text-8xl 2xl:text-[12rem] leading-none font-black gold-gradient-text tracking-tighter">{buyPrice}</span>
          </div>
        </div>

        <div className="h-px bg-slate-800/50"></div>

        <div className="space-y-2 md:space-y-4">
          <div className="flex justify-between items-baseline">
            <p className="text-sm md:text-xl xl:text-2xl 2xl:text-4xl uppercase tracking-[0.2em] text-slate-500 font-bold">ขายออก</p>
            <p className="text-base md:text-2xl xl:text-3xl 2xl:text-5xl text-slate-500 font-bold">บาทละ</p>
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
