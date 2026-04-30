import Header from '@/components/Header';
import GoldPriceCard from '@/components/GoldPriceCard';
import PromoSlider from '@/components/PromoSlider';
import { getGoldPriceApi } from "@/api/mainApi";
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function Home() {
  const cookieStore = await cookies();
  const settingsCookie = cookieStore.get('gold_settings');

  let settings = {
    goldBarMode: 'api',
    goldOrnamentMode: 'api',
    manualData: {
      goldBarBuy: '44,200',
      goldBarSell: '44,300',
      goldBuy: '43,403',
      goldSell: '44,800',
    }
  };

  if (settingsCookie) {
    try {
      settings = JSON.parse(decodeURIComponent(settingsCookie.value));
    } catch (e) {
      console.error("Failed to parse settings cookie", e);
    }
  }

  let goldPrices = [
    {
      title: 'ทองคำแท่ง 96.5%',
      buyPrice: 'รอข้อมูล...',
      sellPrice: 'รอข้อมูล...',
      diff: '0',
      isUp: true,
    },
    {
      title: 'ทองรูปพรรณ 96.5%',
      buyPrice: 'รอข้อมูล...',
      sellPrice: 'รอข้อมูล...',
      diff: '0',
      isUp: true,
    },
  ];

  try {
    // 1. Fetch API Data as base
    const res = await getGoldPriceApi();
    const apiData = res.data.response.price;

    // 2. Set Gold Bar data
    if (settings.goldBarMode === 'manual') {
      goldPrices[0].buyPrice = settings.manualData.goldBarBuy;
      goldPrices[0].sellPrice = settings.manualData.goldBarSell;
      goldPrices[0].diff = 'Manual';
    } else {
      goldPrices[0].buyPrice = apiData.gold_bar.buy;
      goldPrices[0].sellPrice = apiData.gold_bar.sell;
      goldPrices[0].diff = '100';
    }

    // 3. Set Gold Ornament data
    if (settings.goldOrnamentMode === 'manual') {
      goldPrices[1].buyPrice = settings.manualData.goldBuy;
      goldPrices[1].sellPrice = settings.manualData.goldSell;
      goldPrices[1].diff = 'Manual';
    } else {
      goldPrices[1].buyPrice = apiData.gold.buy;
      goldPrices[1].sellPrice = apiData.gold.sell;
      goldPrices[1].diff = '100';
    }

  } catch (error) {
    console.error("Failed to fetch gold prices:", error);
  }
  return (
    <main className="relative min-h-screen w-full bg-[#0f172a] overflow-x-hidden flex flex-col font-sans-thai">
      {/* Settings Button */}
      <Link
        href="/edit"
        className="absolute top-8 right-8 z-50 p-4 glass rounded-2xl text-slate-400 hover:text-white hover:scale-110 transition-all border-white/5"
        title="ตั้งค่า"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
      </Link>

      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      {/* Main Content Area: 30/70 Split */}
      <div className="flex-1 flex flex-col lg:flex-row w-full p-6 lg:p-8 gap-6 lg:gap-8">

        {/* Left Column: 30% on LG screens - Gold Prices */}
        <div className="w-full lg:w-[30%] flex flex-col gap-8">
          <Header />
          <div className="flex flex-col gap-6">
            {goldPrices.map((price, index) => (
              <GoldPriceCard key={index} {...price} />
            ))}
          </div>

          {/* Small Stats */}
          {/* <div className="grid grid-cols-2 gap-4 mt-4 lg:mt-auto">
            <div className="glass p-6 rounded-3xl">
              <p className="text-xl text-slate-500 font-bold mb-1 uppercase tracking-wider">Gold Spot</p>
              <p className="text-3xl font-black text-white">$2,735.40</p>
            </div>
            <div className="glass p-6 rounded-3xl">
              <p className="text-xl text-slate-500 font-bold mb-1 uppercase tracking-wider">THB/USD</p>
              <p className="text-3xl font-black text-white">34.25</p>
            </div>
          </div> */}
        </div>

        {/* Right Column: 70% on LG screens - Promo Slider */}
        <div className="w-full lg:w-[70%] min-h-[500px] lg:h-auto">
          <PromoSlider />
        </div>
      </div>

      {/* Scrolling Footer Marquee */}
      <div className="h-20 lg:h-24 bg-amber-500/10 border-t border-amber-500/20 flex items-center overflow-hidden whitespace-nowrap sticky bottom-0 z-50 backdrop-blur-md">
        <div className="animate-marquee py-2">
          <span className="text-2xl lg:text-4xl font-bold text-amber-500 mx-8 uppercase tracking-widest">
            ยินดีต้อนรับสู่ DailyGold • ราคาทองคำมีการเปลี่ยนแปลงตามกลไกตลาด • ตรวจสอบราคาล่าสุดได้ที่หน้าเคาน์เตอร์ • โปรโมชั่นพิเศษสำหรับสมาชิกใหม่ รับส่วนลดค่ากำเหน็จ 50% • มั่นใจในคุณภาพ ทองคำมาตรฐานสมาคมค้าทองคำ •
          </span>
          <span className="text-2xl lg:text-4xl font-bold text-amber-500 mx-8 uppercase tracking-widest">
            ยินดีต้อนรับสู่ DailyGold • ราคาทองคำมีการเปลี่ยนแปลงตามกลไกตลาด • ตรวจสอบราคาล่าสุดได้ที่หน้าเคาน์เตอร์ • โปรโมชั่นพิเศษสำหรับสมาชิกใหม่ รับส่วนลดค่ากำเหน็จ 50% • มั่นใจในคุณภาพ ทองคำมาตรฐานสมาคมค้าทองคำ •
          </span>
        </div>
      </div>
    </main>
  );
}

