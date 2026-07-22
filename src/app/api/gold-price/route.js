import { NextResponse } from "next/server";

const PRIMARY_URL = "https://api.chnwt.dev/thai-gold-api/latest";
// Classic site still renders prices server-side in plain HTML, unlike the
// new goldtraders.or.th which fetches prices client-side after hydration.
const FALLBACK_URL = "https://classic.goldtraders.or.th/default.aspx";

const isValidPrice = (data) =>
    Boolean(data?.price?.gold_bar?.buy && data?.price?.gold?.buy);

// Both sources fail in ways that look identical from the outside — a blocked
// request and a changed page both end as "no prices". The board runs unattended,
// so the response has to name which one broke.
class SourceError extends Error {
    constructor(code, message) {
        super(message);
        this.name = "SourceError";
        this.code = code;
    }
}

async function fetchPrimary() {
    const res = await fetch(PRIMARY_URL, { cache: "no-store" });
    if (!res.ok) {
        throw new SourceError(`primary_http_${res.status}`, "primary source rejected the request");
    }
    const json = await res.json();
    return json?.response;
}

async function fetchFallback() {
    // Cloudflare fronts this site and rejects requests that don't look like a
    // browser. A bare "Mozilla/5.0" is not enough; it needs the full header set.
    const res = await fetch(FALLBACK_URL, {
        cache: "no-store",
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "th,en-US;q=0.9",
        },
    });
    if (!res.ok) {
        throw new SourceError(`fallback_http_${res.status}`, "fallback source rejected the request");
    }
    const html = await res.text();

    // Font colour tracks price direction (Red down, Green up), so it must not be
    // part of the match or parsing breaks on every up day.
    // Satang are dropped to match the primary API's whole-baht format, which the
    // display board is laid out for.
    const extract = (id) =>
        html
            .match(new RegExp(`${id}"><b><font[^>]*>([\\d,.]+)`))?.[1]
            .replace(/\.\d+$/, "");

    const goldBarSell = extract("lblBLSell");
    const goldBarBuy = extract("lblBLBuy");
    const goldSell = extract("lblOMSell");
    const goldBuy = extract("lblOMBuy");

    if (!goldBarBuy || !goldBarSell || !goldBuy || !goldSell) {
        throw new SourceError(
            "fallback_parse_failed",
            `fallback page did not contain prices (${html.length} bytes)`
        );
    }

    const asTime = html.match(/lblAsTime"><b><font size="3">([^<]+)</)?.[1] || "";
    const [, update_date = "", update_time = ""] =
        asTime.match(/^(\d{2}\/\d{2}\/\d{4}) เวลา (\d{2}:\d{2})/) || [];

    return {
        update_date,
        update_time,
        price: {
            gold: { buy: goldBuy, sell: goldSell },
            gold_bar: { buy: goldBarBuy, sell: goldBarSell },
        },
    };
}

const failureCode = (error, fallbackCode) =>
    error.code ?? error.cause?.code ?? fallbackCode;

export async function GET() {
    let primaryFailure;
    try {
        const primary = await fetchPrimary();
        if (isValidPrice(primary)) {
            return NextResponse.json({ status: "success", response: primary });
        }
        // Answers 200 with every price field empty rather than erroring.
        primaryFailure = "primary_blank";
    } catch (error) {
        primaryFailure = failureCode(error, "primary_unreachable");
        console.error("Primary gold price source failed:", error);
    }

    try {
        const fallback = await fetchFallback();
        return NextResponse.json({ status: "success", response: fallback });
    } catch (error) {
        console.error("Fallback gold price source failed:", error);
        return NextResponse.json(
            {
                status: "error",
                response: null,
                error: {
                    code: failureCode(error, "fallback_unreachable"),
                    message: `${error.message} (primary: ${primaryFailure})`,
                },
            },
            { status: 502 }
        );
    }
}
