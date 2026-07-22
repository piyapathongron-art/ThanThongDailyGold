import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GoldData {
  goldBarBuy: string;
  goldBarSell: string;
  goldBuy: string;
  goldSell: string;
}

// Only gold bar has a machine-readable source. Ornament prices are announced as a
// derivation the shop sets itself, so they are always staff-entered.
interface ApiData {
  price?: {
    gold_bar?: { buy: string; sell: string };
  };
}

interface GoldState {
  goldBarMode: 'api' | 'manual';
  manualData: GoldData;
  apiData: ApiData | null;
  apiStatus: 'online' | 'offline' | 'loading';
  promoImages: string[];
  setGoldBarMode: (mode: 'api' | 'manual') => void;
  setManualData: (data: Partial<GoldData>) => void;
  setApiData: (data: ApiData) => void;
  setApiStatus: (status: 'online' | 'offline' | 'loading') => void;
  syncApiToManual: () => void;
  setPromoImage: (index: number, dataUrl: string) => void;
}

export const useGoldStore = create<GoldState>()(
  persist(
    (set, get) => ({
      goldBarMode: 'api',
      manualData: {
        goldBarBuy: '44,200',
        goldBarSell: '44,300',
        goldBuy: '43,403',
        goldSell: '44,800',
      },
      apiData: null,
      apiStatus: 'loading',
      promoImages: ['', '', ''],
      setGoldBarMode: (mode) => set({ goldBarMode: mode }),
      setManualData: (data) =>
        set((state) => ({
          manualData: { ...state.manualData, ...data },
        })),
      setApiData: (data) => set({ apiData: data, apiStatus: 'online' }),
      setApiStatus: (status) => set({ apiStatus: status }),
      setPromoImage: (index, dataUrl) =>
        set((state) => {
          const updated = [...state.promoImages];
          updated[index] = dataUrl;
          return { promoImages: updated };
        }),
      syncApiToManual: () => {
        const { apiData } = get();
        const bar = apiData?.price?.gold_bar;
        if (bar?.buy && bar?.sell) {
          set((state) => ({
            manualData: { ...state.manualData, goldBarBuy: bar.buy, goldBarSell: bar.sell },
          }));
        }
      }
    }),
    {
      name: 'gold-storage',
    }
  )
);
