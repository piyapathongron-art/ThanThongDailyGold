import { NextResponse } from "next/server";

// goldtraders.or.th is fronted by Cloudflare, which answers 403 to datacenter IPs
// — verified from both iad1 and sin1. api.chnwt.dev scrapes that same page, so it
// now returns 200 with every price field empty rather than failing. Both routes to
// the association's page are closed to a serverless function.
//
// This feed is published for programmatic use and carries the association's own
// numbers: its "สมาคมฯ" row matched goldtraders exactly on 2026-07-22.
const SOURCE_URL = "https://thaigold.info/RealTimeDataV2/gtdata_.txt";
const GOLD_BAR_ROW = "สมาคมฯ";

class SourceError extends Error {
    constructor(code, message) {
        super(message);
        this.name = "SourceError";
        this.code = code;
    }
}

// The feed types some values as strings and others as numbers, and quotes satang
// the board has no room for.
const toBaht = (value) => {
    const amount = Number(String(value).replace(/,/g, ""));
    if (!Number.isFinite(amount) || amount <= 0) return null;
    return Math.trunc(amount).toLocaleString("en-US");
};

export async function GET() {
    try {
        const res = await fetch(SOURCE_URL, { cache: "no-store" });
        if (!res.ok) {
            throw new SourceError(
                `source_http_${res.status}`,
                "gold price source rejected the request"
            );
        }

        const rows = await res.json();
        const bar = rows.find((row) => row.name === GOLD_BAR_ROW);
        const buy = toBaht(bar?.bid);
        const sell = toBaht(bar?.ask);

        if (!buy || !sell) {
            throw new SourceError(
                "source_missing_gold_bar",
                `feed had no usable "${GOLD_BAR_ROW}" row (${rows.length} rows)`
            );
        }

        // The feed carries no announcement time for this row — only its own refresh
        // clock, which would read as the price time on the board. Better to send
        // nothing and let the board omit it.
        return NextResponse.json({
            status: "success",
            response: { price: { gold_bar: { buy, sell } } },
        });
    } catch (error) {
        console.error("Gold price source failed:", error);
        return NextResponse.json(
            {
                status: "error",
                response: null,
                error: {
                    code: error.code ?? error.cause?.code ?? "source_unreachable",
                    message: error.message,
                },
            },
            { status: 502 }
        );
    }
}
