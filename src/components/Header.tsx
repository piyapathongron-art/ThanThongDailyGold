import React from 'react';

const Header = () => {
  const today = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <header className="flex flex-col items-center text-center space-y-3 md:space-y-4 xl:space-y-3 2xl:space-y-4 w-full">
      <div className="flex items-center gap-3 md:gap-4 xl:gap-4 2xl:gap-6">
        <img 
          src="/ThanThong.png" 
          alt="Logo" 
          className="w-14 h-14 md:w-20 md:h-20 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 rounded-xl md:rounded-2xl object-cover shadow-2xl border border-primary/20" 
        />
        <h1 className="text-3xl md:text-5xl xl:text-4xl 2xl:text-5xl font-extrabold tracking-tight text-white whitespace-nowrap">
          ห้างทอง<span className="gold-gradient-text">ธารทอง</span>
        </h1>
      </div>

      <div className="space-y-1.5 md:space-y-2 xl:space-y-1.5 2xl:space-y-2">
        <p className="text-2xl md:text-4xl xl:text-3xl 2xl:text-4xl font-bold text-white tracking-wide whitespace-nowrap">
          ราคาทองคำวันนี้
        </p>
        <div className="flex flex-col sm:flex-row xl:flex-row items-center justify-center gap-2 md:gap-4 xl:gap-4 2xl:gap-6 text-slate-300">
          <span className="flex items-center gap-1.5 text-base md:text-lg xl:text-base 2xl:text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
            {today}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
