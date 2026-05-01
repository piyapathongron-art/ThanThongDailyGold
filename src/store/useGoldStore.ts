import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GoldData {
  goldBarBuy: string;
  goldBarSell: string;
  goldBuy: string;
  goldSell: string;
}

interface ApiData {
  price?: {
    gold_bar?: { buy: string; sell: string };
    gold?: { buy: string; sell: string };
  };
  update_date?: string;
  update_time?: string;
}

interface GoldState {
  goldBarMode: 'api' | 'manual';
  goldOrnamentMode: 'api' | 'manual';
  manualData: GoldData;
  apiData: ApiData | null;
  apiStatus: 'online' | 'offline' | 'loading';
  setGoldBarMode: (mode: 'api' | 'manual') => void;
  setGoldOrnamentMode: (mode: 'api' | 'manual') => void;
  setManualData: (data: Partial<GoldData>) => void;
  setApiData: (data: ApiData) => void;
  setApiStatus: (status: 'online' | 'offline' | 'loading') => void;
  syncApiToManual: () => void;
}

export const useGoldStore = create<GoldState>()(
  persist(
    (set, get) => ({
      goldBarMode: 'api',
      goldOrnamentMode: 'api',
      manualData: {
        goldBarBuy: '44,200',
        goldBarSell: '44,300',
        goldBuy: '43,403',
        goldSell: '44,800',
      },
      apiData: null,
      apiStatus: 'loading',
      setGoldBarMode: (mode) => set({ goldBarMode: mode }),
      setGoldOrnamentMode: (mode) => set({ goldOrnamentMode: mode }),
      setManualData: (data) =>
        set((state) => ({
          manualData: { ...state.manualData, ...data },
        })),
      setApiData: (data) => set({ apiData: data, apiStatus: 'online' }),
      setApiStatus: (status) => set({ apiStatus: status }),
      syncApiToManual: () => {
        const { apiData } = get();
        if (apiData?.price) {
          set({
            manualData: {
              goldBarBuy: apiData.price.gold_bar?.buy || '0',
              goldBarSell: apiData.price.gold_bar?.sell || '0',
              goldBuy: apiData.price.gold?.buy || '0',
              goldSell: apiData.price.gold?.sell || '0',
            }
          });
        }
      }
    }),
    {
      name: 'gold-storage',
    }
  )
);
