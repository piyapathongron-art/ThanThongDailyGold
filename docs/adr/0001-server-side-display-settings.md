# 1. ย้าย Display Settings จาก localStorage ไปไว้ฝั่ง server (Supabase)

Date: 2026-07-22

## Status

Accepted

## Context

Display Settings ถูก persist ด้วย Zustand `persist` ลง `localStorage` (key `gold-storage`)
`localStorage` ผูกกับ origin **ต่อเบราว์เซอร์** ไม่ใช่ต่อ URL

ผลคือคอมในร้านกับทีวีเปิด URL เดียวกันแต่เห็นคนละ state พนักงานแก้ราคาบนคอมแล้วจอทีวีไม่เปลี่ยน
ตั้งแต่แรก — ไม่ใช่ bug ที่ค่อยๆ เกิด แต่เป็นผลตรงของการเลือก storage

ทางเลือกที่พิจารณา:

- **Vercel Blob + KV** — อยู่ใน platform ที่ deploy อยู่แล้ว ไม่เพิ่ม vendor แต่ต้องตั้งค่าเองใน
  dashboard และไม่มี realtime
- **Supabase (เลือกอันนี้)** — ได้ Postgres + object storage ในที่เดียว provision ผ่าน MCP ได้
  ทันที region ap-southeast-1 ใกล้ไทย

## Decision

เก็บ Display Settings เป็นแถวเดียวใน Postgres บน Supabase รูปโปรโมชั่นขึ้น Supabase Storage
แล้วเก็บแค่ URL ในแถวนั้น

Display Board **poll** แถวนี้ทุก `poll_seconds` (ค่าเริ่มต้น 20) แทนการ subscribe realtime

Rotation ไม่ย้ายขึ้น server — คงเป็น per-device ใน `localStorage`

`/edit` ป้องกันด้วยรหัสผ่านตัวเดียวใน env var ตรวจฝั่ง server ก่อนเขียน DB

## Consequences

**Polling แทน realtime** — จอทีวีเปิดค้างเป็นสัปดาห์ websocket จะหลุดตอน wifi กระตุกแล้วเงียบไป
โดยไม่มีใครรู้ จอค้างแสดงราคาเมื่อวาน polling ฟื้นตัวเองทุกรอบ แลกกับ latency ไม่เกิน 20 วินาที
ซึ่งพนักงานที่เดินจากคอมไปดูจอไม่ทันสังเกต

**`poll_seconds` อยู่ใน DB ไม่ใช่ env var** — `NEXT_PUBLIC_*` ถูกฝังตอน build การแก้ต้อง redeploy
ทั้งเว็บ เก็บใน DB แล้วแก้จากหน้า Dashboard ได้เลย

**ช่องโหว่ที่เพิ่งเกิดความหมาย** — เดิม `/edit` เปิดโล่งแต่ไม่เจ็บ เพราะแก้ได้แค่ localStorage
ของเครื่องตัวเอง พอ state อยู่ฝั่ง server คนแปลกหน้าที่รู้ URL จะแก้ราคาบนจอในร้านได้จริง
รหัสผ่านจึงเป็นเงื่อนไขของการย้าย ไม่ใช่ของแถม

**รูปโปรโมชั่นเปลี่ยนสัญญา** — เดิมเป็น base64 data URL ใน array ความยาวคงที่ 3 ช่อง
ต่อไปเป็น array ความยาวผันแปร 0–5 ที่เก็บ URL ของ Storage ความยาว array คือจำนวนสไลด์
ไม่มีค่า "จำนวนช่อง" แยกต่างหาก จึงไม่มีทางเกิดช่องเปล่าบนจอ
รูปที่พนักงานเคยอัปโหลดไว้บนเครื่องเดิมจะหายไป ต้องอัปใหม่ครั้งเดียว

**เพิ่ม dependency ที่ถอนยาก** — เดิมเว็บนี้ deploy ได้โดยไม่มี env var เลย ต่อไปถ้า Supabase ล่ม
Dashboard แก้ราคาไม่ได้ จอยังฉายค่าล่าสุดที่ fetch ไว้ได้ แต่แก้ไม่ได้จนกว่าจะกลับมา
