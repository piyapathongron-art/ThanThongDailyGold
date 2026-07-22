import { createHash, timingSafeEqual } from "crypto";

// Everything reaches the database through the app's own routes with the service
// key, so the browser never holds a Supabase credential and the table can keep RLS
// on with no policies at all.
const TABLE_URL = () => `${process.env.SUPABASE_URL}/rest/v1/display_settings?id=eq.1`;

export const authHeaders = () => ({
    apikey: process.env.SUPABASE_SERVICE_KEY,
    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
});

export const isPasswordValid = (given) => {
    const expected = process.env.EDIT_PASSWORD;
    if (!expected || typeof given !== "string") return false;
    // Hashing first gives both sides equal length, which timingSafeEqual requires,
    // and keeps the comparison from leaking the password's length.
    const a = createHash("sha256").update(given).digest();
    const b = createHash("sha256").update(expected).digest();
    return timingSafeEqual(a, b);
};

export const toClient = (row) => ({
    goldBarMode: row.gold_bar_mode,
    goldBarBuy: row.gold_bar_buy,
    goldBarSell: row.gold_bar_sell,
    goldBuy: row.gold_buy,
    goldSell: row.gold_sell,
    promoImages: row.promo_images,
    pollSeconds: row.poll_seconds,
    updatedAt: row.updated_at,
});

export async function readSettings() {
    const res = await fetch(`${TABLE_URL()}&select=*`, {
        headers: authHeaders(),
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`settings read failed with ${res.status}`);

    const [row] = await res.json();
    if (!row) throw new Error("settings row is missing");
    return row;
}

export async function patchSettings(row) {
    const res = await fetch(TABLE_URL(), {
        method: "PATCH",
        headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
            Prefer: "return=representation",
        },
        body: JSON.stringify({ ...row, updated_at: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error(`settings write failed with ${res.status}`);

    const [updated] = await res.json();
    return updated;
}
