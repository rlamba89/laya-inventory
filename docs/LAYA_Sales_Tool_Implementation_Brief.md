# LAYA RESIDENCES — INTERACTIVE SALES TOOL
# Complete Implementation Brief

> **Purpose of this document:** This is a comprehensive brief for Claude to build a standalone interactive sales tool for LAYA Residences. It contains everything needed — brand identity, design tokens, complete data for all 88 townhouses, siteplan layout, floor plan types, feature specifications, and implementation instructions. Feed this entire document into a new Claude conversation along with the siteplan and floor plan images to build the tool.

---

## 1. PROJECT CONTEXT

**Product:** LAYA Residences — 88 Mediterranean-inspired luxury townhouses at Beams Road, Taigum, Brisbane QLD.

**Developer:** TRK Property Group (boutique luxury developer, Brisbane-based, $1.5B+ pipeline)

**Architect:** MAS Architects

**Tool purpose:** A standalone HTML/CSS/JS sales application used by TRK sales agents on a tablet or laptop during face-to-face client meetings. NOT a public website. NOT connected to any backend/CRM.

**Key constraints:**
- Single HTML file (all CSS and JS inline)
- No backend, no API calls, no Pipedrive
- No localStorage (in-memory state only)
- All data hardcoded in the file
- Must work offline once loaded
- Only external dependency: Google Fonts CDN
- Images embedded as base64 or referenced as relative paths

---

## 2. BRAND IDENTITY — Extracted from layaresidences.com.au

### 2.1 Website Analysis

The LAYA Residences website (layaresidences.com.au) is a Next.js pre-launch teaser site. It is minimal, warm, and luxurious with a Mediterranean-inspired aesthetic. Key observations:

- **Overall tone:** Warm, understated luxury. Not flashy or tech-forward — it feels like an Italian villa brochure.
- **Layout:** Full-bleed hero images, generous white space, minimal navigation (just "Register" and social links).
- **Sections:** "Welcome to LAYA – Your Sanctuary in Taigum", "Unrivalled Lifestyle and Amenity", "Design-led Living", "About TRK".
- **Imagery:** Warm architectural renders of Mediterranean-style villas with terracotta/earth tones, lush landscaping, arched doorways.
- **Logo treatment:** "LAYA" is displayed in uppercase with wide letter-spacing. "Residences" in a lighter weight or italic serif.
- **TRK logo:** The letters T, R, K are displayed individually with very wide letter-spacing (like `T   R   K`), all uppercase, clean sans-serif.
- **Footer:** Minimal — links to Main Site, Privacy Policy, About, Instagram (@laya.residences).

### 2.2 Typography

**Headlines / Display:**
- Serif font — elegant, editorial, Mediterranean feel
- **Use: `Playfair Display`** from Google Fonts (400, 500, 600, 700 weights + italic)
- Applied to: Page titles, section headings, townhouse numbers in cards, modal headings

**Body / UI:**
- Clean geometric sans-serif
- **Use: `DM Sans`** from Google Fonts (300, 400, 500, 600, 700 weights)
- Applied to: Body text, labels, buttons, filter chips, data values, nav items

**Styling patterns from the website:**
- Section labels: ALL CAPS, wide letter-spacing (3-5px), small font size (10-12px), muted colour
- Headlines: Mixed case with italic emphasis on key words (e.g. "LAYA *Residences*")
- Body: Regular weight, comfortable line-height (1.5-1.6)
- Price/data values: Bold weight, slightly larger size

### 2.3 Colour Palette

```css
/* ═══ PRIMARY ═══ */
--charcoal: #1E1E1E;           /* Nav bar, primary text, dark backgrounds */
--charcoal-mid: #3A3A3A;       /* Secondary text */
--charcoal-light: #5C5C5C;    /* Tertiary text, descriptions */
--warm-white: #FFFDF8;         /* Page body background */
--ivory: #FAF7F2;              /* Alternate section backgrounds */
--sand: #E8DFD0;               /* Borders, dividers, inactive states */
--sand-light: #F0EBE2;         /* Card backgrounds, subtle fills */
--stone: #C5B9A8;              /* Muted labels, placeholders */

/* ═══ ACCENT ═══ */
--terracotta: #C2694A;          /* Primary CTA, active tab, hero accents */
--terracotta-deep: #A85A3E;     /* Button hover states */
--terracotta-glow: #D47B5A;     /* Lighter terracotta for subtle uses */
--gold: #B8975A;                /* Premium highlights, selected states, compare borders */
--gold-light: #D4B87A;          /* Secondary accents, stat numbers */
--olive: #6B7F5E;               /* Mediterranean green, nature accents */
--olive-soft: #8FA47F;          /* Softer green for backgrounds */
--navy: #2B3A4E;                /* Internal mode banner, deep accents */

/* ═══ STATUS INDICATORS ═══ */
--available-green: #5C7A4E;     /* Available status */
--available-bg: #EEF4EB;        /* Available chip/badge background */
--sold-red: #A04040;            /* Sold status */
--sold-bg: #F8EDED;             /* Sold chip/badge background */
--negotiation-amber: #B8862E;   /* Under Negotiation status */
--negotiation-bg: #FBF4E6;      /* Negotiation chip/badge background */
--hold-blue: #4A6E8F;           /* On Hold status */
--hold-bg: #EBF1F6;             /* Hold chip/badge background */

/* ═══ UTILITY ═══ */
--radius: 12px;                 /* Default border radius for cards/modals */
--shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
--shadow-md: 0 4px 20px rgba(0,0,0,0.08);
--shadow-lg: 0 12px 40px rgba(0,0,0,0.12);
--shadow-xl: 0 20px 60px rgba(0,0,0,0.16);
```

### 2.4 Design Principles

1. **Mediterranean warmth** — NOT corporate/tech/SaaS. Think Italian villa, terracotta, olive groves, warm stone.
2. **Generous white space** — content breathes, nothing feels cramped.
3. **Subtle texture** — dark hero sections should have a faint grain/noise overlay for depth.
4. **Smooth motion** — transitions at 0.3s with `cubic-bezier(0.4, 0, 0.2, 1)`. Staggered card animations on load.
5. **Refined minimalism** — every element serves a purpose. No decorative clutter.
6. **No emojis in the production UI** — use minimal SVG icons or text symbols.
7. **Status colours are muted/earthy** — not harsh traffic-light colours. They should feel part of the palette.

### 2.5 TRK Parent Brand

- TRK branding: Letters `T  R  K` with very wide letter-spacing, sans-serif, clean
- TRK tagline: "The Pursuit of Smarter Living"
- Arpan Kohli is the Managing Director
- Address: Level 13, 145 Eagle Street, Brisbane QLD 4000
- Website: trk.com.au
- This tool is for internal TRK use only, so TRK branding is subtle (footer or internal mode)

### 2.6 LAYA Marketing Copy

Use these phrases in the UI where appropriate:
- "Your Sanctuary in Taigum"
- "Mediterranean-Inspired Luxury"
- "Design-led Living"
- "Beams Road, Taigum — Brisbane"
- "Designed by MAS Architects"
- "88 Luxury Townhouses · 3 Stages"
- All 2-storey, all include 2-car garage, study, courtyard/patio
- Amenities: Pool, recreation zone, swim school, landscaped communal spaces, internal roads
- Price range: $1.60M to $1.90M (Stage 3 Reserve Outlook & Eastern Side are the premium tier)

---

## 3. TWO VIEW MODES

### 3A. Client View (Default)

The default view when the app loads. This is what the buyer sees on the agent's screen.

**Visible elements:**
- Hero section with siteplan image and live stats
- Filter bar (Status / Bedrooms / Stage)
- Card grid grouped by Stage → Area
- Townhouse cards with: TH number, bed/bath/car config, total area, lot size, status badge
- Pricing is HIDDEN by default (agent toggles on/off via nav button)
- Hover tooltips with quick details
- Click-to-open detail modal with area breakdown chart and floorplan
- Comparison mode (select up to 3 townhouses)
- Sold townhouses appear dimmed (opacity 0.55)

### 3B. Internal View

Toggle via top navigation. For agent/director eyes only.

**Additional elements visible in Internal mode:**
- Navy banner across the top showing KPIs: Est. GRV, Sold Value, Sold Rate %, 3-Bed count, 4-Bed count
- Pricing always visible on all cards (regardless of toggle state)
- Cards could show additional notes field (optional)

---

## 4. FEATURE SPECIFICATIONS

### 4A. Navigation Bar

```
┌─────────────────────────────────────────────────────────────────┐
│ LAYA Residences    [Client View] [Internal]     ◉ Pricing  ↓ ⎙ │
└─────────────────────────────────────────────────────────────────┘
```

- Fixed to top, dark charcoal background
- Left: Brand name "LAYA *Residences*" (Playfair Display)
- Center: View toggle tabs (Client / Internal) — active tab has terracotta background
- Right: Pricing toggle button + Export CSV icon + Print icon
- Height: 60px

### 4B. Hero / Siteplan Section

- Full-width dark section below nav
- Contains the architect siteplan image as the main visual
- Dark overlay background with subtle grain texture
- Top-left: Large "LAYA *Residences*" heading + "Mediterranean-Inspired Luxury · Taigum, Brisbane" subtitle
- Top-right: Live stats cards (Available count, Sold count, Negotiating count, Total)
- The siteplan should be zoomable/pannable (CSS transform) for tablet use
- Clickable hotspot overlays on each townhouse (see Section 8 for positions)

### 4C. Filter Bar

```
┌──────────────────────────────────────────────────────────────────┐
│ STATUS  [All] [Available] [Sold] [Under Negotiation] [On Hold]  │
│         ──── BEDS [All] [3 Bed] [4 Bed] ──── STAGE [All] [1] [2] [3] │
└──────────────────────────────────────────────────────────────────┘
```

- White background bar below hero
- Pill/chip-style filter buttons
- Active filter: charcoal background + white text
- All filters combine with AND logic
- Empty area/stage sections auto-hide when all their cards are filtered out

### 4D. Card Grid

- Grouped by **Stage (1, 2, 3)** → then by **Area** (Streetside, Shopside, Inner Circle, Reserve Outlook, Eastern Side)
- Stage header: Playfair Display serif, with badge showing townhouse count
- Area header: Small uppercase terracotta text with a dot bullet
- Cards use CSS Grid: `grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))`, gap 14px
- Cards have a thin colour strip at the top matching their status colour
- Card animation: Staggered `fadeUp` on initial render

**Card contents:**
```
┌───────────────────────┐
│ ▬▬▬▬▬▬▬ (status bar) │ ← 3.5px coloured strip
│             [✓]       │ ← Compare checkbox (top-right)
│  TH 14                │ ← Playfair Display, 20px
│  D - 4 Bed, 2.5 Bath │ ← Description, 10.5px
│                       │
│  [4 Bed] [202m²]     │ ← Pill tags
│  [184m² lot]          │
│                       │
│  AVAILABLE            │ ← Status text, uppercase, status colour
│  $1.65M – $1.68M     │ ← Price (hidden unless toggled on)
└───────────────────────┘
```

### 4E. Agent Price Toggle

- Nav bar button: "○ Pricing" (off) / "◉ Pricing" (on, gold background)
- When ON: Price text appears on cards, in tooltips, in modals, and in comparison tables
- When OFF: No pricing visible anywhere in client view
- Default state: OFF
- Should be discreet — a small button, not a prominent toggle

### 4F. Hover Tooltips

- Appear on card hover (desktop)
- Positioned near cursor, clamped to viewport edges
- Dark charcoal background, rounded corners
- Content: TH number, Area, Stage, Config, Total Area, Lot Size, Price (if toggle on), Status badge
- Smooth fade in/out (0.12s transition)

### 4G. Detail Modal

Opens when a card is clicked. Full-screen overlay with centred modal panel.

**Modal layout:**
```
┌──────────────────────────────────┐
│ [×]                              │
│ Townhouse 14                     │ ← h2, Playfair Display
│ SHOPSIDE · STAGE 1               │ ← Area label, terracotta
│ [AVAILABLE]                      │ ← Status badge
│──────────────────────────────────│
│ Bedrooms: 4    Bathrooms: 2.5   │
│ Car Spaces: 2  Total Area: 202m²│ ← 3-column grid of stats
│ Lot Size: 184m² Patio: 10m²    │
│                                  │
│ $1.65M – $1.68M                 │ ← Price (if toggle on)
│                                  │
│ ╔══ Area Breakdown ═════════════╗│
│ ║ Ground Living  ███████ 56m²   ║│ ← Animated horizontal bars
│ ║ Upper Living   █████████ 90m² ║│
│ ║ Garage         █████ 38m²     ║│
│ ║ Outdoor        █████████ 82m² ║│
│ ╚═══════════════════════════════╝│
│                                  │
│ ┌──────────────────────────────┐ │
│ │     📐 Floorplan Preview     │ │ ← Shows floor plan image by type
│ │   (Ground Level + Level 01)  │ │    or placeholder if no image
│ └──────────────────────────────┘ │
│                                  │
│ [＋ Add to Compare]              │
└──────────────────────────────────┘
```

**Area breakdown chart:**
- Horizontal bar chart with 4 bars
- Ground Living (terracotta), Upper Living (olive), Garage (navy), Outdoor total (gold)
- Bars animate from 0 to final width when modal opens
- Each bar shows the m² value as white text inside the bar
- Scale is relative to the largest value in that specific townhouse

### 4H. Comparison Mode

**Selection:**
- Double-click a card OR shift-click to toggle compare selection
- Maximum 3 selections
- Selected cards get a gold border + gold checkbox visible

**Floating bar:**
- Slides up from bottom of screen when 1+ cards selected
- Dark charcoal, rounded top corners
- Contents: "Compare" label | chip for each selected TH (with × remove button) | "Compare Now" button | "Clear" link

**Comparison table modal:**
- Opens on "Compare Now" (minimum 2 selections required)
- Side-by-side table comparing all attributes
- Rows: Area, Stage, Config, Total Area, Lot Size, Ground Living, Upper Living, Balcony, Patio, Front Yard, Back Yard, Garage, Price (if toggle on), Status
- Best value per row highlighted in bold terracotta (e.g. largest lot size)

### 4I. Floorplan Preview

Each townhouse has a type letter (A, B, C, D, E, F, G, H, J) that maps to an architect floor plan. The detail modal should show the corresponding floor plan image.

**Implementation approach:**
- Floor plan images will be provided as separate PNG files
- Embed them as base64 data URIs in the HTML, or reference as relative paths
- Map each type letter to its image
- Show a placeholder with text "Floorplan will appear here" if no image available
- The floorplan image should be clickable to view full-size in a lightbox overlay

### 4J. Siteplan Hotspots (Interactive Map)

The hero section displays the architect's siteplan with clickable overlays on each townhouse.

**Implementation:**
- The siteplan image is the background of the hero section
- On top of the image, position absolute `<div>` hotspots for each townhouse
- Each hotspot is a small rounded pill showing "TH ##"
- Hotspots are colour-coded by status (using the status colours)
- Hover shows tooltip
- Click opens detail modal
- The image container should support pinch-to-zoom on tablets

### 4K. CSV Export

- Button in nav bar (download icon)
- Exports all 88 townhouses as CSV with columns: TH, Stage, Area, Description, Type, Beds, Baths, Cars, Total m², Lot m², Ground Internal, Upper Internal, Balcony, Patio, Front Yard, Back Yard, Price, Status
- File named `LAYA_Residences_88_Townhouses.csv`

### 4L. Print Styles

```css
@media print {
  .topnav, .filters, .compare-bar, .hero { display: none !important; }
  .grid-container { padding-top: 0; }
  .card { break-inside: avoid; }
}
```

---

## 5. COMPLETE DATA — 88 Townhouses

### 5.1 Data Structure

```javascript
{
  id: Number,           // Townhouse number (1-88)
  stg: Number,          // Stage: 1, 2, or 3
  area: String,         // "Streetside" | "Shopside" | "Inner Circle" | "Reserve Outlook" | "Eastern Side"
  desc: String,         // Description e.g. "B - 3 Bed, 2.5 Bath, 2 Car"
  type: String,         // Floor plan type: "A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"J"|"Cust"|""
  beds: Number,         // 3 or 4
  baths: Number,        // 2.5 (all units)
  cars: Number,         // 2 (all units)
  gI: Number,           // Ground Internal area (m²)
  gG: Number,           // Garage area (m²)
  uI: Number,           // Upper Internal area (m²)
  uB: Number,           // Upper Balcony area (m²)
  pat: Number,          // Patio area (m²)
  tot: Number,          // Total built area (m²) = gI + gG + uI + uB + pat
  eF: Number,           // Exclusive Use Front Yard (m²)
  eB: Number,           // Exclusive Use Back Yard (m²)
  lot: Number,          // Lot Size (m²) — total land area of the townhouse
  price: String,        // Display price e.g. "$1.65M – $1.68M" or "Custom"
  pMin: Number,         // Min price in dollars (0 if Custom)
  pMax: Number,         // Max price in dollars (0 if Custom)
  status: String        // "available" | "sold" | "negotiation" | "hold"
}
```

### 5.2 Complete Dataset (JavaScript Array)

Copy this directly into the HTML file:

```javascript
const TH = [
  {id:1,stg:3,area:"Streetside",type:"B",desc:"B - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:89,uB:8,pat:10,tot:201,eF:18,eB:36,lot:158,price:"$1.60M",pMin:1600000,pMax:1600000,status:"available"},
  {id:2,stg:3,area:"Streetside",type:"B",desc:"B - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:89,uB:8,pat:10,tot:201,eF:9,eB:18,lot:131,price:"$1.60M – $1.62M",pMin:1600000,pMax:1620000,status:"available"},
  {id:3,stg:3,area:"Streetside",type:"B",desc:"B - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:89,uB:8,pat:10,tot:201,eF:9,eB:18,lot:131,price:"$1.60M",pMin:1600000,pMax:1600000,status:"available"},
  {id:4,stg:1,area:"Streetside",type:"B",desc:"B - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:89,uB:8,pat:10,tot:201,eF:17,eB:42,lot:163,price:"$1.60M – $1.65M",pMin:1600000,pMax:1650000,status:"available"},
  {id:5,stg:1,area:"Streetside",type:"B",desc:"B - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:89,uB:8,pat:10,tot:201,eF:14,eB:29,lot:147,price:"$1.60M – $1.62M",pMin:1600000,pMax:1620000,status:"available"},
  {id:6,stg:1,area:"Streetside",type:"B",desc:"B - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:89,uB:8,pat:10,tot:201,eF:14,eB:29,lot:147,price:"$1.60M – $1.62M",pMin:1600000,pMax:1620000,status:"available"},
  {id:7,stg:1,area:"Streetside",type:"B",desc:"B - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:89,uB:8,pat:10,tot:201,eF:9,eB:18,lot:131,price:"$1.60M – $1.62M",pMin:1600000,pMax:1620000,status:"available"},
  {id:8,stg:1,area:"Streetside",type:"B",desc:"B - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:89,uB:8,pat:10,tot:201,eF:14,eB:29,lot:147,price:"$1.60M – $1.62M",pMin:1600000,pMax:1620000,status:"available"},
  {id:9,stg:1,area:"Streetside",type:"B",desc:"B - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:89,uB:8,pat:10,tot:201,eF:45,eB:29,lot:178,price:"$1.60M – $1.62M",pMin:1600000,pMax:1620000,status:"available"},
  {id:10,stg:1,area:"Streetside",type:"B",desc:"B - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:89,uB:8,pat:10,tot:201,eF:14,eB:25,lot:143,price:"$1.65M",pMin:1650000,pMax:1650000,status:"available"},
  {id:11,stg:1,area:"Shopside",type:"D",desc:"D - 4 Bed, 2.5 Bath, 2 Car",beds:4,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:44,eB:12,lot:160,price:"$1.63M – $1.67M",pMin:1630000,pMax:1670000,status:"available"},
  {id:12,stg:1,area:"Shopside",type:"A",desc:"A - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:91,uB:10,pat:10,tot:205,eF:44,eB:12,lot:160,price:"$1.60M – $1.62M",pMin:1600000,pMax:1620000,status:"available"},
  {id:13,stg:1,area:"Shopside",type:"A",desc:"A - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:91,uB:10,pat:10,tot:205,eF:52,eB:25,lot:181,price:"$1.60M – $1.62M",pMin:1600000,pMax:1620000,status:"available"},
  {id:14,stg:1,area:"Shopside",type:"D",desc:"D - 4 Bed, 2.5 Bath, 2 Car",beds:4,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:54,eB:26,lot:184,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:15,stg:1,area:"Shopside",type:"A",desc:"A - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:91,uB:10,pat:10,tot:205,eF:44,eB:13,lot:161,price:"$1.60M – $1.62M",pMin:1600000,pMax:1620000,status:"available"},
  {id:16,stg:1,area:"Shopside",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:88,uB:10,pat:10,tot:202,eF:44,eB:13,lot:161,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:17,stg:1,area:"Shopside",type:"D",desc:"D - 4 Bed, 2.5 Bath, 2 Car",beds:4,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:52,eB:26,lot:182,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:18,stg:1,area:"Shopside",type:"D",desc:"D - 4 Bed, 2.5 Bath, 2 Car",beds:4,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:54,eB:27,lot:185,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:19,stg:1,area:"Shopside",type:"A",desc:"A - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:91,uB:10,pat:10,tot:205,eF:44,eB:14,lot:162,price:"$1.60M – $1.62M",pMin:1600000,pMax:1620000,status:"available"},
  {id:20,stg:1,area:"Shopside",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:88,uB:10,pat:10,tot:202,eF:44,eB:14,lot:162,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:21,stg:1,area:"Shopside",type:"D",desc:"D - 4 Bed, 2.5 Bath, 2 Car",beds:4,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:44,eB:15,lot:163,price:"$1.70M – $1.73M",pMin:1700000,pMax:1730000,status:"available"},
  {id:22,stg:1,area:"Inner Circle",type:"D",desc:"D - 4 Bed, 2.5 Bath, 2 Car",beds:4,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:43,eB:12,lot:159,price:"$1.675M",pMin:1675000,pMax:1675000,status:"available"},
  {id:23,stg:1,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:88,uB:10,pat:10,tot:202,eF:44,eB:13,lot:161,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:24,stg:1,area:"Inner Circle",type:"A",desc:"A - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:91,uB:10,pat:10,tot:205,eF:44,eB:13,lot:161,price:"$1.625M",pMin:1625000,pMax:1625000,status:"available"},
  {id:25,stg:1,area:"Inner Circle",type:"D",desc:"D - 4 Bed, 2.5 Bath, 2 Car",beds:4,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:53,eB:26,lot:183,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:26,stg:1,area:"Inner Circle",type:"D",desc:"D - 4 Bed, 2.5 Bath, 2 Car",beds:4,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:53,eB:26,lot:183,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:27,stg:1,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:88,uB:10,pat:10,tot:202,eF:44,eB:13,lot:161,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:28,stg:1,area:"Inner Circle",type:"A",desc:"A - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:91,uB:10,pat:10,tot:205,eF:44,eB:13,lot:161,price:"$1.625M",pMin:1625000,pMax:1625000,status:"available"},
  {id:29,stg:1,area:"Inner Circle",type:"D",desc:"D - 4 Bed, 2.5 Bath, 2 Car",beds:4,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:53,eB:26,lot:183,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:30,stg:1,area:"Inner Circle",type:"A",desc:"A - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:91,uB:10,pat:10,tot:205,eF:53,eB:26,lot:183,price:"$1.625M",pMin:1625000,pMax:1625000,status:"available"},
  {id:31,stg:1,area:"Inner Circle",type:"A",desc:"A - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:91,uB:10,pat:10,tot:205,eF:44,eB:13,lot:161,price:"$1.625M",pMin:1625000,pMax:1625000,status:"available"},
  {id:32,stg:1,area:"Inner Circle",type:"D",desc:"D - 4 Bed, 2.5 Bath, 2 Car",beds:4,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:43,eB:13,lot:160,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:33,stg:2,area:"Inner Circle",type:"D",desc:"D - 4 Bed, 2.5 Bath, 2 Car",beds:4,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:44,eB:13,lot:161,price:"$1.60M – $1.64M",pMin:1600000,pMax:1640000,status:"available"},
  {id:34,stg:2,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:91,uB:10,pat:10,tot:205,eF:44,eB:13,lot:161,price:"$1.625M",pMin:1625000,pMax:1625000,status:"available"},
  {id:35,stg:2,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:91,uB:10,pat:10,tot:205,eF:53,eB:26,lot:183,price:"$1.625M",pMin:1625000,pMax:1625000,status:"available"},
  {id:36,stg:2,area:"Inner Circle",type:"D",desc:"D - 4 Bed, 2.5 Bath, 2 Car",beds:4,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:53,eB:26,lot:183,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:37,stg:2,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:91,uB:10,pat:10,tot:205,eF:44,eB:13,lot:161,price:"$1.625M",pMin:1625000,pMax:1625000,status:"available"},
  {id:38,stg:2,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:88,uB:10,pat:10,tot:202,eF:44,eB:13,lot:161,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:39,stg:2,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:53,eB:26,lot:183,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:40,stg:2,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:53,eB:26,lot:183,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:41,stg:2,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:91,uB:10,pat:10,tot:205,eF:44,eB:13,lot:161,price:"$1.625M",pMin:1625000,pMax:1625000,status:"available"},
  {id:42,stg:2,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:88,uB:10,pat:10,tot:202,eF:44,eB:13,lot:161,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:43,stg:2,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:43,eB:12,lot:159,price:"$1.675M",pMin:1675000,pMax:1675000,status:"available"},
  {id:44,stg:2,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:44,eB:12,lot:160,price:"$1.675M",pMin:1675000,pMax:1675000,status:"available"},
  {id:45,stg:2,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:88,uB:10,pat:10,tot:202,eF:44,eB:13,lot:161,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:46,stg:2,area:"Inner Circle",type:"A",desc:"A - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:91,uB:10,pat:10,tot:205,eF:44,eB:13,lot:161,price:"$1.625M",pMin:1625000,pMax:1625000,status:"available"},
  {id:47,stg:2,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:53,eB:26,lot:183,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:48,stg:2,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:53,eB:26,lot:183,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:49,stg:2,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:88,uB:10,pat:10,tot:202,eF:44,eB:13,lot:161,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:50,stg:2,area:"Inner Circle",type:"A",desc:"A - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:91,uB:10,pat:10,tot:205,eF:44,eB:13,lot:161,price:"$1.65M",pMin:1650000,pMax:1650000,status:"available"},
  {id:51,stg:2,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:53,eB:26,lot:183,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:52,stg:2,area:"Inner Circle",type:"A",desc:"A - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:91,uB:10,pat:10,tot:205,eF:53,eB:26,lot:183,price:"$1.65M",pMin:1650000,pMax:1650000,status:"available"},
  {id:53,stg:2,area:"Inner Circle",type:"A",desc:"A - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:91,uB:10,pat:10,tot:205,eF:44,eB:13,lot:161,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:54,stg:2,area:"Inner Circle",type:"Cust",desc:"Custom - 4 Bed, 2.5 Bath, 2 Car",beds:4,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:45,eB:13,lot:162,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:55,stg:3,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:43,eB:13,lot:160,price:"$1.64M – $1.68M",pMin:1640000,pMax:1680000,status:"available"},
  {id:56,stg:3,area:"Inner Circle",type:"A",desc:"A - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:91,uB:10,pat:10,tot:205,eF:44,eB:13,lot:161,price:"$1.65M",pMin:1650000,pMax:1650000,status:"available"},
  {id:57,stg:3,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:88,uB:10,pat:10,tot:202,eF:44,eB:13,lot:161,price:"$1.65M",pMin:1650000,pMax:1650000,status:"available"},
  {id:58,stg:3,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:53,eB:26,lot:183,price:"$1.65M – $1.68M",pMin:1650000,pMax:1680000,status:"available"},
  {id:59,stg:3,area:"Inner Circle",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:90,uB:8,pat:10,tot:202,eF:50,eB:26,lot:180,price:"$1.65M",pMin:1650000,pMax:1650000,status:"available"},
  {id:60,stg:3,area:"Inner Circle",type:"A",desc:"A - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:91,uB:10,pat:10,tot:205,eF:31,eB:13,lot:148,price:"$1.65M",pMin:1650000,pMax:1650000,status:"available"},
  {id:61,stg:3,area:"Inner Circle",type:"A",desc:"A - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:91,uB:10,pat:10,tot:205,eF:20,eB:13,lot:137,price:"$1.65M",pMin:1650000,pMax:1650000,status:"available"},
  {id:62,stg:3,area:"Inner Circle",type:"Cust",desc:"Custom",beds:3,baths:2.5,cars:2,gI:56,gG:38,uI:86,uB:10,pat:10,tot:200,eF:13,eB:26,lot:143,price:"Custom",pMin:0,pMax:0,status:"available"},
  {id:63,stg:3,area:"Inner Circle",type:"Cust",desc:"Custom",beds:3,baths:2.5,cars:2,gI:60,gG:37,uI:90,uB:10,pat:10,tot:207,eF:22,eB:32,lot:161,price:"Custom",pMin:0,pMax:0,status:"available"},
  {id:64,stg:3,area:"Inner Circle",type:"Cust",desc:"Custom - 3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:68,gG:37,uI:97,uB:11,pat:10,tot:223,eF:32,eB:19,lot:166,price:"Custom",pMin:0,pMax:0,status:"available"},
  {id:65,stg:3,area:"Reserve Outlook",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:53,eB:27,lot:183,price:"$1.875M",pMin:1875000,pMax:1875000,status:"available"},
  {id:66,stg:3,area:"Reserve Outlook",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:53,eB:27,lot:183,price:"$1.85M – $1.90M",pMin:1850000,pMax:1900000,status:"available"},
  {id:67,stg:3,area:"Reserve Outlook",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:53,eB:27,lot:183,price:"$1.85M – $1.90M",pMin:1850000,pMax:1900000,status:"available"},
  {id:68,stg:3,area:"Reserve Outlook",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:53,eB:27,lot:183,price:"$1.85M – $1.90M",pMin:1850000,pMax:1900000,status:"available"},
  {id:69,stg:3,area:"Reserve Outlook",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:53,eB:27,lot:183,price:"$1.85M – $1.90M",pMin:1850000,pMax:1900000,status:"available"},
  {id:70,stg:3,area:"Reserve Outlook",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:53,eB:27,lot:183,price:"$1.85M – $1.90M",pMin:1850000,pMax:1900000,status:"available"},
  {id:71,stg:3,area:"Reserve Outlook",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:53,eB:27,lot:183,price:"$1.85M – $1.90M",pMin:1850000,pMax:1900000,status:"available"},
  {id:72,stg:3,area:"Reserve Outlook",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:53,eB:27,lot:183,price:"$1.85M – $1.90M",pMin:1850000,pMax:1900000,status:"available"},
  {id:73,stg:3,area:"Reserve Outlook",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:53,eB:27,lot:183,price:"$1.85M – $1.90M",pMin:1850000,pMax:1900000,status:"available"},
  {id:74,stg:3,area:"Reserve Outlook",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:53,eB:27,lot:183,price:"$1.85M – $1.90M",pMin:1850000,pMax:1900000,status:"available"},
  {id:75,stg:3,area:"Reserve Outlook",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:53,eB:27,lot:183,price:"$1.85M – $1.90M",pMin:1850000,pMax:1900000,status:"available"},
  {id:76,stg:3,area:"Reserve Outlook",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:53,eB:27,lot:183,price:"$1.85M – $1.90M",pMin:1850000,pMax:1900000,status:"available"},
  {id:77,stg:3,area:"Reserve Outlook",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:53,eB:27,lot:183,price:"$1.85M – $1.90M",pMin:1850000,pMax:1900000,status:"available"},
  {id:78,stg:3,area:"Reserve Outlook",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:53,eB:27,lot:183,price:"$1.85M – $1.90M",pMin:1850000,pMax:1900000,status:"available"},
  {id:79,stg:3,area:"Eastern Side",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:20,eB:81,lot:204,price:"$1.85M",pMin:1850000,pMax:1850000,status:"available"},
  {id:80,stg:3,area:"Eastern Side",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:47,eB:11,lot:161,price:"$1.825M – $1.850M",pMin:1825000,pMax:1850000,status:"available"},
  {id:81,stg:3,area:"Eastern Side",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:54,eB:24,lot:181,price:"$1.825M – $1.850M",pMin:1825000,pMax:1850000,status:"available"},
  {id:82,stg:3,area:"Eastern Side",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:53,eB:24,lot:180,price:"$1.825M – $1.850M",pMin:1825000,pMax:1850000,status:"available"},
  {id:83,stg:3,area:"Eastern Side",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:53,eB:24,lot:180,price:"$1.825M – $1.850M",pMin:1825000,pMax:1850000,status:"available"},
  {id:84,stg:3,area:"Eastern Side",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:53,eB:25,lot:181,price:"$1.825M – $1.850M",pMin:1825000,pMax:1850000,status:"available"},
  {id:85,stg:3,area:"Eastern Side",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:53,eB:24,lot:180,price:"$1.825M – $1.850M",pMin:1825000,pMax:1850000,status:"available"},
  {id:86,stg:3,area:"Eastern Side",type:"Cust",desc:"Custom",beds:3,baths:2.5,cars:2,gI:66,gG:37,uI:107,uB:9,pat:14,tot:233,eF:53,eB:44,lot:214,price:"$1.825M – $1.850M",pMin:1825000,pMax:1850000,status:"available"},
  {id:87,stg:3,area:"Eastern Side",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:45,eB:30,lot:178,price:"$1.825M – $1.850M",pMin:1825000,pMax:1850000,status:"available"},
  {id:88,stg:3,area:"Eastern Side",type:"",desc:"3 Bed, 2.5 Bath, 2 Car",beds:3,baths:2.5,cars:2,gI:55,gG:38,uI:95,uB:10,pat:10,tot:208,eF:55,eB:64,lot:222,price:"$1.8M",pMin:1800000,pMax:1800000,status:"available"},
];
```

**Note:** All 88 townhouses are set to `status:"available"`. The sales agent manually updates status in the code as sales progress.

---

## 6. FLOOR PLAN TYPES

Nine floor plan types. Each townhouse's `type` field maps to one of these.

| Type | Config | Ground Int | Garage | Upper Int | Total | Description |
|------|--------|------------|--------|-----------|-------|-------------|
| A | 3 Bed + Study, 2.5 Bath | 58.0m² | 38.7m² | 97.5m² | 194.2m² | Standard 3-bed, courtyard entry |
| B | 3 Bed + Study, 2.5 Bath | 58.0m² | 38.7m² | 96.4m² | 193.1m² | Streetside variant, similar to A |
| C | 4 Bed + Study, 2.5 Bath | 57.4m² | 38.7m² | 101.6m² | 197.8m² | 4-bed with study, corner config |
| D | 3 Bed (labelled 4 Bed), 2.5 Bath | 58.0m² | 38.7m² | 97.2m² | 193.9m² | Flexible 3/4 bed depending on use |
| E | 4 Bed + Study, 2.5 Bath | 70.2m² | 38.5m² | 109.9m² | 218.6m² | Large premium 4-bed |
| F | 4 Bed + Study, 2.5 Bath | 62.0m² | 37.9m² | 100.8m² | 200.7m² | Mid-size 4-bed with courtyard |
| G | 3 Bed + Study, 2.5 Bath | 58.0m² | 38.7m² | 92.9m² | 189.5m² | Courtyard-focused layout |
| H | 3 Bed + Study, 2.5 Bath | 69.3m² | 38.2m² | 116.9m² | 224.4m² | Premium large format |
| J | 3 Bed + Study, 2.5 Bath | 58.0m² | 38.0m² | 94.4m² | 191.1m² | End-of-row townhouse |
| Cust | Varies | Varies | Varies | Varies | Varies | Custom layout (TH 54, 62, 63, 64, 86) |

**Floor plan image files** (upload these alongside this document):
- Type A → `Screenshot_2026-03-02_at_9_54_43_am.png`
- Type B → `Screenshot_2026-03-02_at_9_54_54_am.png`
- Type C → `Screenshot_2026-03-02_at_9_55_01_am.png`
- Type D → `Screenshot_2026-03-02_at_9_55_09_am.png`
- Type E → `Screenshot_2026-03-02_at_9_55_18_am.png`
- Type F → `Screenshot_2026-03-02_at_9_55_28_am.png`
- Type G → `Screenshot_2026-03-02_at_9_55_34_am.png`
- Type H → `Screenshot_2026-03-02_at_9_55_39_am.png`
- Type J → `Screenshot_2026-03-02_at_9_55_47_am.png`

---

## 7. SITEPLAN IMAGES & LAYOUT

### 7.1 Available Siteplan Images

Upload all four alongside this document:

1. **"Setbacks, Roads & Refuse" (Page 14)** → `Screenshot_2026-03-02_at_9_53_37_am.png`
   **USE THIS AS THE PRIMARY INTERACTIVE SITEPLAN** — it has the clearest townhouse numbering with unit numbers and type codes visible on each footprint.

2. **"Landscaping & Deep Planting"** → `Screenshot_2026-03-02_at_9_53_44_am.png`
   Shows the Mediterranean garden setting with deep planting zones.

3. **"Private Open Space & Communal" (Page 16)** → `Screenshot_2026-03-02_at_9_53_55_am.png`
   Shows balconies (pink), courtyards (green), communal spaces. Has TH numbers visible.

4. **"Staging Plan" (Page 17)** → `Screenshot_2026-03-02_at_9_54_00_am.png`
   Shows Stage 1 (blue), Stage 2 (cream), Stage 3 (green) boundaries.

### 7.2 Site Layout Description

The site is roughly rectangular/trapezoidal:
- **South edge (bottom):** Beams Road — the main street frontage
- **West edge (left):** Taigum Square Shopping Centre
- **North edge (top):** Residential dwelling
- **East edge (right):** Residential dwelling / Hol shed, angled boundary

**Zone layout (from the staging plan):**
- **Stage 1 (western third):** TH 4-32 — Streetside (north-facing row), Shopside (western side near shops), Inner Circle (central internal rows)
- **Stage 2 (central third + some north):** TH 33-54 — all Inner Circle
- **Stage 3 (eastern portion, split into two sub-blocks + Beams Road frontage):** TH 1-3 (Streetside), TH 55-64 (Inner Circle), TH 65-78 (Reserve Outlook — premium backing onto nature reserve), TH 79-88 (Eastern Side — Beams Road frontage row along the south)

**Key site features:**
- Internal road system running east-west through the centre
- Pool + recreation area in the south-central part of the site
- Swim school near the south-east
- Temporary sales office near the south entrance
- Communal landscaping throughout
- Wall-mounted bicycle racks in all garages
- Two parking types: Visitor (red on plan) and Resident (orange)

---

## 8. IMPLEMENTATION STEPS

Build in this order:

1. **HTML scaffold** — Single file, inline CSS + JS, Google Fonts import
2. **CSS variables & base styles** — All design tokens from Section 2.3
3. **Navigation bar** — Brand, view toggle, price toggle, export, print
4. **Hero section** — Siteplan image with dark overlay, stats badges, grain texture
5. **Filter bar** — Status / Bedrooms / Stage chip filters
6. **Card grid** — Render all 88 TH grouped by Stage → Area, with proper formatting
7. **Status management** — Colour coding, sold dimming, filter AND logic
8. **Hover tooltips** — Positioned near cursor, dark charcoal
9. **Detail modal** — Full info, area breakdown bars with animation, floorplan slot
10. **Comparison mode** — Selection state, floating bar, comparison table modal
11. **Internal view** — Navy KPI banner, price override
12. **Floorplan images** — Embed or reference images in modal by type
13. **Siteplan hotspots** — Clickable overlays on the siteplan image
14. **Export & print** — CSV download, print stylesheet
15. **Polish** — Animations, responsive (tablet + laptop), keyboard shortcuts (Escape)

---

## 9. KEYBOARD & INTERACTION SHORTCUTS

- `Escape` — Close any open modal
- `Shift + Click` on card — Toggle compare selection
- `Double-click` on card — Toggle compare selection (alternate method)
- `Click` on card — Open detail modal

---

## 10. RESPONSIVE TARGETS

- **Primary:** iPad landscape (1024×768) and laptops (1280×800+)
- **Secondary:** iPad portrait (768×1024)
- **Not required:** Mobile phones
- **Print:** Hide interactive elements, cards break-inside avoid

---

*End of implementation brief. Upload this document + all 13 images (4 siteplans + 9 floor plans) into a new Claude conversation and ask it to build the tool step by step.*
