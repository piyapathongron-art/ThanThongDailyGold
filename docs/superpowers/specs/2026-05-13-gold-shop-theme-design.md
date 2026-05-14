# Design Spec: Modern Luxury Gold Shop Theme (Red & Gold)

**Date:** 2026-05-13
**Status:** Draft
**Topic:** Rebranding the DailyGold dashboard to a "Modern Luxury" gold shop aesthetic.

## 1. Vision & Goals
Transform the current blue-toned dashboard into a professional, high-end gold shop interface using a Red and Gold palette. The design must feel "alive," luxurious, and ensure maximum readability for gold prices.

## 2. Visual Design (Modern Luxury - Elegant Gradient Glass)

### 2.1 Color Palette
*   **Primary Background:** Deep Maroon Gradient (#2d0505 to #4a0404).
*   **Accent Color (Gold):** Metallic Gold (#d4af37) and Bright Gold (#ffd700).
*   **Foreground (Text):** 
    *   Primary: White (#ffffff) for maximum contrast.
    *   Secondary: Light Gray (#cbd5e1) for labels.
    *   Prices: Gold Gradient (Bright Gold to Metallic Gold).
*   **Surface (Cards):** Glassmorphism style (Transparent White rgba(255,255,255,0.05)) with a subtle Gold border.

### 2.2 Typography
*   **Font:** Continue using IBM Plex Sans Thai (User's choice, ensures clarity).
*   **Price Display:** Extra bold/black weight, tracking-tighter for impact.
*   **Labels:** Bold, uppercase, with slight letter spacing for a premium feel.

## 3. Component Updates

### 3.1 Global Styles (globals.css)
*   Update CSS variables for background, primary, and secondary colors.
*   Refine .glass class to have a more subtle background and a gold-tinted border.
*   Update .gold-gradient-text to use a more metallic, premium color ramp.

### 3.2 Header (Header.tsx)
*   Ensure the logo and "ThanThong" text pop against the red background.
*   Date and Time labels should be white or light gold.

### 3.3 Gold Price Card (GoldPriceCard.tsx)
*   Change "รับซื้อ" and "ขายออก" labels to a clearer color (Light Gray/White).
*   Ensure the price gradient is vibrant and easily readable.
*   Increase the contrast of the horizontal separator.

### 3.4 Promo Slider (PromoSlider.tsx)
*   Update placeholder colors to match the new red/gold theme.
*   Adjust slide indicators to use gold for the active state.

### 3.5 Layout & Footer (page.tsx)
*   Change the background orbs (glow effects) to Red and Amber/Gold.
*   Update the scrolling footer (Marquee) to have a Deep Red background and Gold text.

## 4. Technical Implementation
*   Use Tailwind CSS v4 variables for theme consistency.
*   Ensure accessibility (A11y) by checking color contrast ratios for white text on red backgrounds.
*   Maintain responsive design across all screen sizes.

## 5. Success Criteria
*   The dashboard looks like a high-end gold shop.
*   Gold prices are the most prominent element on the page.
*   The overall aesthetic is "Modern Luxury" as per the user's choice.
