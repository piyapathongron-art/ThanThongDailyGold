import Header from '@/components/Header';
import GoldPriceCard from '@/components/GoldPriceCard';
import PromoSlider from '@/components/PromoSlider';

export default function Home() {
  const goldPrices = [
    {
      title: 'ทองคำแท่ง 96.5%',
      buyPrice: '44,200',
      sellPrice: '44,300',
      diff: '100',
      isUp: true,
    },
    {
      title: 'ทองรูปพรรณ 96.5%',
      buyPrice: '43,403',
      sellPrice: '44,800',
      diff: '100',
      isUp: true,
    },
  ];

  return (
    <main className="relative min-h-screen w-full bg-[#0f172a] overflow-x-hidden flex flex-col font-sans-thai">
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
          <div className="grid grid-cols-2 gap-4 mt-4 lg:mt-auto">
            <div className="glass p-6 rounded-3xl">
              <p className="text-xl text-slate-500 font-bold mb-1 uppercase tracking-wider">Gold Spot</p>
              <p className="text-3xl font-black text-white">$2,735.40</p>
            </div>
            <div className="glass p-6 rounded-3xl">
              <p className="text-xl text-slate-500 font-bold mb-1 uppercase tracking-wider">THB/USD</p>
              <p className="text-3xl font-black text-white">34.25</p>
            </div>
          </div>
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

