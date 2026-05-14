# Modern Luxury Gold Shop Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the DailyGold dashboard to a "Modern Luxury" gold shop theme (Red & Gold) with a focus on readability and premium aesthetics.

**Architecture:** Update global CSS variables, refine glassmorphism effects, and adjust component-level styling to use a deep red and gold palette.

**Tech Stack:** Next.js, Tailwind CSS v4, IBM Plex Sans Thai.

---

### Task 1: Update Global Styles

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update CSS Variables and Theme**
Update `:root` variables and `@theme` to use the new red and gold palette.

```css
:root {
  --background: #2d0505;
  --foreground: #ffffff;
  --primary: #d4af37;
  --secondary: #ffd700;
  --accent-red: #4a0404;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --color-accent-red: var(--accent-red);
}
```

- [ ] **Step 2: Refine Glass and Gradient Utilities**
Update `.glass` and `.gold-gradient-text` classes.

```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.gold-gradient-text {
  background: linear-gradient(135deg, #ffd700 0%, #d4af37 50%, #b8860b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

- [ ] **Step 3: Commit**
```bash
git add src/app/globals.css
git commit -m "style: update global red and gold theme variables"
```

---

### Task 2: Update Header Component

**Files:**
- Modify: `src/components/Header.tsx`

- [ ] **Step 1: Adjust Header Text Colors**
Ensure "ThanThong" and date/time labels are clearly visible on the new red background.

```tsx
// Change text-slate-400 to text-slate-300 or white for better contrast
<div className="flex flex-col items-center gap-1 md:gap-2 xl:gap-4 text-slate-300">
  <span className="flex items-center gap-2 text-lg md:text-xl xl:text-2xl 2xl:text-4xl">
    {/* SVG icon */}
    {today}
  </span>
  <span className="flex items-center gap-2 text-lg md:text-xl xl:text-2xl 2xl:text-4xl font-medium text-secondary/90">
    {/* SVG icon */}
    อัปเดต {now} น.
  </span>
</div>
```

- [ ] **Step 2: Commit**
```bash
git add src/components/Header.tsx
git commit -m "style: update header text colors for red theme"
```

---

### Task 3: Update Gold Price Cards

**Files:**
- Modify: `src/components/GoldPriceCard.tsx`

- [ ] **Step 1: Improve Label Readability**
Change "รับซื้อ" and "ขายออก" labels to a brighter color.

```tsx
// Change text-slate-500 to text-slate-300
<p className="text-sm md:text-xl xl:text-2xl 2xl:text-4xl uppercase tracking-[0.2em] text-slate-300 font-bold">รับซื้อ</p>
<p className="text-base md:text-2xl xl:text-3xl 2xl:text-5xl text-slate-300 font-bold">บาทละ</p>
```

- [ ] **Step 2: Update Separator Contrast**
```tsx
// Change bg-slate-800/50 to bg-white/10 or gold/20
<div className="h-px bg-white/10"></div>
```

- [ ] **Step 3: Commit**
```bash
git add src/components/GoldPriceCard.tsx
git commit -m "style: improve gold price card readability"
```

---

### Task 4: Update Promo Slider Placeholders

**Files:**
- Modify: `src/components/PromoSlider.tsx`

- [ ] **Step 1: Update Placeholder Background and Colors**
```tsx
// Change from-slate-800 to-slate-900 to from-accent-red to-background
<div className="absolute inset-0 bg-gradient-to-br from-accent-red to-background flex flex-col items-center justify-center p-6 md:p-12 text-center space-y-4 md:space-y-6">
  {/* Update icon and text colors */}
  <div className="w-16 h-16 md:w-24 md:h-24 2xl:w-40 2xl:h-40 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-12 md:h-12 2xl:w-20 2xl:h-20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
  </div>
  <p className="text-base md:text-xl 2xl:text-4xl text-slate-300">กรุณาวางไฟล์รูปภาพชื่อ <span className="text-primary font-mono">public{src}</span> เพื่อแสดงผล</p>
</div>
```

- [ ] **Step 2: Update Indicators**
```tsx
<div
  key={index}
  className={`h-1.5 md:h-2 transition-all duration-300 rounded-full ${
    index === activeIndex ? 'w-8 md:w-12 bg-primary' : 'w-1.5 md:w-2 bg-white/20'
  }`}
/>
```

- [ ] **Step 3: Commit**
```bash
git add src/components/PromoSlider.tsx
git commit -m "style: update promo slider theme"
```

---

### Task 5: Final Layout & Marquee Refinement

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update Background Orbs**
```tsx
<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
<div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />
```

- [ ] **Step 2: Update Marquee Styles**
```tsx
<div className="h-14 md:h-20 lg:h-24 2xl:h-32 bg-accent-red/30 border-t border-primary/20 flex items-center overflow-hidden whitespace-nowrap sticky bottom-0 z-50 backdrop-blur-md">
  <div className="animate-marquee py-2">
    <span className="text-xl md:text-2xl lg:text-4xl 2xl:text-6xl font-bold text-primary mx-8 md:mx-12 uppercase tracking-widest">
      {/* text */}
    </span>
  </div>
</div>
```

- [ ] **Step 3: Commit**
```bash
git add src/app/page.tsx
git commit -m "style: final layout and marquee refinements"
```
