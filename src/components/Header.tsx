import React from 'react';

const Header = () => {
  const today = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const now = new Date().toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header className="flex flex-col items-center text-center space-y-4 md:space-y-6 xl:space-y-8">
      <div className="flex items-center gap-3 md:gap-4 xl:gap-6">
        <img 
          src="/ThanThong.png" 
          alt="Logo" 
          className="w-20 h-20 md:w-32 md:h-32 xl:w-40 xl:h-40 2xl:w-56 2xl:h-56 rounded-2xl md:rounded-3xl object-cover shadow-2xl" 
        />
        <h1 className="text-3xl md:text-5xl xl:text-6xl 2xl:text-8xl font-bold tracking-tight text-white">
          Than<span className="gold-gradient-text">Thong</span>
        </h1>
      </div>

      <div className="space-y-2 md:space-y-3 xl:space-y-5">
        <p className="text-3xl md:text-5xl xl:text-6xl 2xl:text-8xl font-bold text-white tracking-wide">
          ราคาทองคำวันนี้
        </p>
        <div className="flex flex-col items-center gap-1 md:gap-2 xl:gap-4 text-slate-400">
          <span className="flex items-center gap-2 text-lg md:text-xl xl:text-2xl 2xl:text-4xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6 xl:w-7 xl:h-7 2xl:w-10 2xl:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
            {today}
          </span>
          <span className="flex items-center gap-2 text-lg md:text-xl xl:text-2xl 2xl:text-4xl font-medium text-amber-500/80">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6 xl:w-7 xl:h-7 2xl:w-10 2xl:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            อัปเดต {now} น.
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
