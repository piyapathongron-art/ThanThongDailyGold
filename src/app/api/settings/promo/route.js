import { NextResponse } from "next/server";

import { authHeaders, isPasswordValid, patchSettings, readSettings, toClient } from "@/lib/display-settings";

const MAX_SLIDES = 5;
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

export async function POST(request) {
    const form = await request.formData();

    if (!isPasswordValid(form.get("password"))) {
        return NextResponse.json(
            { error: { code: "unauthorized", message: "รหัสผ่านไม่ถูกต้อง" } },
            { status: 401 }
        );
    }

    const file = form.get("file");
    if (!file || typeof file === "string") {
        return NextResponse.json(
            { error: { code: "invalid_body", message: "expected an image file" } },
            { status: 400 }
        );
    }

    const extension = ALLOWED_TYPES[file.type];
    if (!extension) {
        return NextResponse.json(
            { error: { code: "unsupported_type", message: "รองรับเฉพาะ JPG, PNG และ WebP" } },
            { status: 400 }
        );
    }
    if (file.size > MAX_BYTES) {
        return NextResponse.json(
            { error: { code: "file_too_large", message: "ไฟล์ต้องไม่เกิน 5 MB" } },
            { status: 400 }
        );
    }

    try {
        const current = await readSettings();
        if (current.promo_images.length >= MAX_SLIDES) {
            return NextResponse.json(
                { error: { code: "too_many_slides", message: `อัปโหลดได้สูงสุด ${MAX_SLIDES} รูป` } },
                { status: 400 }
            );
        }

        // A fresh name per upload means the CDN and the TV's browser cache never serve
        // a previous image under a reused URL.
        const name = `${Date.now()}.${extension}`;
        const upload = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/promo/${name}`, {
            method: "POST",
            headers: { ...authHeaders(), "Content-Type": file.type },
            body: await file.arrayBuffer(),
        });
        if (!upload.ok) throw new Error(`promo upload failed with ${upload.status}`);

        const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/promo/${name}`;
        const updated = await patchSettings({ promo_images: [...current.promo_images, url] });

        return NextResponse.json(toClient(updated));
    } catch (error) {
        console.error("Promo upload failed:", error);
        return NextResponse.json(
            { error: { code: "promo_upload_failed", message: "อัปโหลดรูปไม่สำเร็จ" } },
            { status: 502 }
        );
    }
}
