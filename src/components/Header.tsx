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
    <header className="flex flex-col items-center text-center space-y-6">
      <div className="flex items-center gap-4">
        {/* <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20"> */}
        <img src="/ThanThong.png" alt="Logo" className="w-40 h-40 rounded-2xl object-cover" />
        {/* </div> */}
        <h1 className="text-5xl font-bold tracking-tight text-white">Than<span className="gold-gradient-text">Thong</span></h1>
      </div>

      <div className="space-y-3">
        <p className="text-6xl font-bold text-white tracking-wide">ราคาทองคำวันนี้</p>
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <span className="flex items-center gap-2 text-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
            {today}
          </span>
          <span className="flex items-center gap-2 text-2xl font-medium text-amber-500/80">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            อัปเดต {now} น.
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
