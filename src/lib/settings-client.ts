export interface DisplaySettings {
  goldBarMode: 'api' | 'manual';
  goldBarBuy: string;
  goldBarSell: string;
  goldBuy: string;
  goldSell: string;
  promoImages: string[];
  pollSeconds: number;
  slideSeconds: number;
  updatedAt: string;
}

const messageFrom = async (res: Response, fallback: string) => {
  const body = await res.json().catch(() => null);
  return body?.error?.message ?? fallback;
};

export async function fetchSettings(): Promise<DisplaySettings> {
  const res = await fetch('/api/settings', { cache: 'no-store' });
  if (!res.ok) throw new Error(await messageFrom(res, 'อ่านการตั้งค่าไม่สำเร็จ'));
  return res.json();
}

export async function saveSettings(
  password: string,
  settings: Partial<DisplaySettings>,
): Promise<DisplaySettings> {
  const res = await fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, settings }),
  });
  if (!res.ok) throw new Error(await messageFrom(res, 'บันทึกไม่สำเร็จ'));
  return res.json();
}

export async function uploadPromoImage(password: string, file: File): Promise<DisplaySettings> {
  const form = new FormData();
  form.append('password', password);
  form.append('file', file);

  const res = await fetch('/api/settings/promo', { method: 'POST', body: form });
  if (!res.ok) throw new Error(await messageFrom(res, 'อัปโหลดรูปไม่สำเร็จ'));
  return res.json();
}
