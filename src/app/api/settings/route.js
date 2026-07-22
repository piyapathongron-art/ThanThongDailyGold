import { NextResponse } from "next/server";

import { isPasswordValid, patchSettings, readSettings, toClient } from "@/lib/display-settings";

const PRICE_FIELDS = {
    goldBarBuy: "gold_bar_buy",
    goldBarSell: "gold_bar_sell",
    goldBuy: "gold_buy",
    goldSell: "gold_sell",
};

// The staff type these, so they are validated here rather than trusted. The column
// checks in Postgres are the backstop, not the first line.
const toRow = (input) => {
    const row = {};

    if (input.goldBarMode !== undefined) {
        if (input.goldBarMode !== "api" && input.goldBarMode !== "manual") {
            throw new Error("goldBarMode must be 'api' or 'manual'");
        }
        row.gold_bar_mode = input.goldBarMode;
    }

    for (const [key, column] of Object.entries(PRICE_FIELDS)) {
        if (input[key] === undefined) continue;
        if (typeof input[key] !== "string" || input[key].length > 20) {
            throw new Error(`${key} must be a string of at most 20 characters`);
        }
        row[column] = input[key];
    }

    if (input.promoImages !== undefined) {
        const images = input.promoImages;
        const isOwnStorageUrl = (url) =>
            typeof url === "string" && url.startsWith(`${process.env.SUPABASE_URL}/storage/v1/object/public/promo/`);

        if (!Array.isArray(images) || images.length > 5 || !images.every(isOwnStorageUrl)) {
            throw new Error("promoImages must be at most 5 URLs from this project's promo bucket");
        }
        row.promo_images = images;
    }

    if (input.pollSeconds !== undefined) {
        const seconds = Number(input.pollSeconds);
        if (!Number.isInteger(seconds) || seconds < 5 || seconds > 300) {
            throw new Error("pollSeconds must be a whole number between 5 and 300");
        }
        row.poll_seconds = seconds;
    }

    return row;
};

export async function GET() {
    try {
        return NextResponse.json(toClient(await readSettings()));
    } catch (error) {
        console.error("Settings read failed:", error);
        return NextResponse.json(
            { error: { code: "settings_unavailable", message: "could not read display settings" } },
            { status: 502 }
        );
    }
}

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: { code: "invalid_body", message: "expected JSON" } },
            { status: 400 }
        );
    }

    if (!isPasswordValid(body.password)) {
        return NextResponse.json(
            { error: { code: "unauthorized", message: "รหัสผ่านไม่ถูกต้อง" } },
            { status: 401 }
        );
    }

    let row;
    try {
        row = toRow(body.settings ?? {});
    } catch (error) {
        return NextResponse.json(
            { error: { code: "invalid_settings", message: error.message } },
            { status: 400 }
        );
    }

    if (Object.keys(row).length === 0) {
        return NextResponse.json(
            { error: { code: "invalid_settings", message: "nothing to update" } },
            { status: 400 }
        );
    }

    try {
        return NextResponse.json(toClient(await patchSettings(row)));
    } catch (error) {
        console.error("Settings write failed:", error);
        return NextResponse.json(
            { error: { code: "settings_write_failed", message: "could not save display settings" } },
            { status: 502 }
        );
    }
}
