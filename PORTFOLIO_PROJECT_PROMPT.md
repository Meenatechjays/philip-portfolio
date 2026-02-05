# Complete Portfolio Project Specification

## PROJECT OVERVIEW

This is a **single-page portfolio application** for Philip Samuelraj built with Next.js 16 (App Router), React 19, Framer Motion, and Tailwind CSS 4. The portfolio features a sophisticated scroll-snap system, custom scroll hijacking, and complex animations across multiple sections.

### Tech Stack
- **Framework**: Next.js 16.0.10 (App Router)
- **React**: 19.2.1
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion 12.23.26
- **Lottie Animations**: @lottiefiles/dotlottie-react 0.17.10, lottie-react 2.4.1
- **Icons**: lucide-react 0.561.0
- **Fonts**: Custom fonts (Sparkling Mellow Demo, Satoshi) + Geist Sans/Mono from Next.js

---

## PAGE STRUCTURE & SECTIONS

The application is a **single-page portfolio** with the following sections in order:

1. **Splash Screen** (Initial Load)
2. **About Section** (Hero/Introduction)
3. **Timeline Section**
4. **Around The World Section**
5. **Press & Highlights Section**
6. **Investors Section**
7. **Contact Section**

All sections except Contact use `100dvh` (dynamic viewport height) for full-screen display. Contact section uses natural height.

---

## SCROLL BEHAVIOR & SNAP CONFIGURATION

### Global Scroll Snap Setup

**CSS Configuration** (`globals.css`):
- `html`: `scroll-snap-type: y mandatory` (or `proximity` initially)
- `body`: `scroll-snap-type: y mandatory`, `scroll-behavior: smooth`
- Custom scrollbar: 6px width, thin, semi-transparent
- Scroll-snap is **disabled during initial load** and re-enabled after splash screen completes

**Scroll Snap Classes**:
- `.snap-section`: Full-height sections (`height: 100dvh`, `scroll-snap-align: start`, `scroll-snap-stop: always`)
- `.snap-section-start`: Variable-height sections (Contact) with `scroll-snap-align: start`

**Critical Scroll Management**:
- Scroll-snap is disabled during splash screen and main content transition (2000ms)
- Scroll position is reset to 0 multiple times during initialization
- Fonts must load before enabling scroll-snap (`document.fonts.ready`)
- Main element has 2000ms transition from splash to visible

### Section-Specific Scroll Behaviors

#### 1. Splash Screen
- **Scroll**: Completely locked (`body.splash-active` class prevents all scrolling)
- **Duration**: 7.1 seconds total
- **Behavior**: Blocks all user interaction until complete

#### 2. About Section
- **Scroll Hijacking**: Active when section is in view (70% threshold)
- **Behavior**: Vertical scroll (wheel) cycles through 3 content items (Innovator, Leader, Investor)
- **Scroll Threshold**: 50px accumulated scroll before switching items
- **Direction-Aware Animations**: Content slides in from direction of scroll (up/down)
- **Boundary Behavior**: 
  - At first item scrolling up → allows scroll to previous section
  - At last item scrolling down → 3.5 second delay before allowing scroll to next section
- **Animation**: Framer Motion with direction-aware variants (slides from top or bottom)

#### 3. Timeline Section
- **Phase 1 - Intro Animation**: 
  - Auto-scrolls timeline from right to left (2000 → 2014 years)
  - Duration: 3 seconds
  - Timeline line and markers animate horizontally
  - Starts when section enters viewport
- **Phase 2 - Scroll Hijacking**:
  - Vertical scroll navigates between timeline cards (4 cards total)
  - Horizontal scroll also works (deltaX)
  - Cards snap to center position
  - Scroll threshold: 800ms throttle between card switches
- **Phase 3 - Carousel Mode** (after reaching last card):
  - Scroll hijacking disabled
  - Horizontal scroll (wheel deltaX) navigates cards
  - Cards still snap to center
  - Vertical scroll allowed to next section
- **Skip Button**: Appears when not on last card, allows jumping to last card
- **Boundary Behavior**: 3 second delay at last card before allowing scroll to next section

#### 4. Around The World Section
- **Scroll**: Normal scroll-snap behavior (no hijacking)
- **Interactive Stacks**: Clickable vertical stacks on the right side
- **Content Panels**: Slide horizontally when stack is clicked
- **Synchronized Animation**: Stacks and content panels move together (2000ms ease-in-out)

#### 5. Press & Highlights Section
- **Scroll**: Normal scroll-snap behavior
- **Animations**: Cards fade in with stagger (1s delay between each)
- **Floating Animation**: After all cards enter, continuous floating animation (2s duration, infinite repeat, -12px distance)

#### 6. Investors Section
- **Scroll**: Normal scroll-snap behavior
- **Animations**: Cards slide in from right (800px) with stagger (0.4s delay)
- **Horizontal Scroll**: Cards in horizontal scrollable container

#### 7. Contact Section
- **Scroll**: Normal scroll-snap behavior (variable height)
- **Social Icons Animation**: Quarter-arc orbit animation on section enter (one-time)
- **Form Submission**: Web3Forms API integration

---

## ANIMATIONS & INTERACTIONS

### Splash Screen Animations

**Timing Sequence**:
1. **Greetings Phase** (0-3.6s):
   - Cycles through 6 greetings: "Hey", "Hello", "Bonjour", "Hallo", "வணக்கம்", "Hola"
   - Each greeting displays for 600ms
   - Fade-in animation (0.3s ease-out)
   - Font: Sparkling Mellow Demo, responsive sizes (48px mobile → 80px desktop)

2. **Sky Phase** (4.1-7.1s):
   - Sky image slides up from bottom (1500ms ease-out)
   - "SKY IS THE LIMIT" text slides up simultaneously
   - Background: Banner Blue.png
   - Sky image: Sky.png (positioned at 30vh from top, 65vh max height)

**Background**: Radial gradient `#FFFFFF` to `#B1D6EC` during resource loading, then `#1a3a52` solid color

### About Section Animations

**Mount Sequence**:
- Left content (logo + heading): Fades in at 100ms delay
- Center image: Always visible (no animation)
- Right content: Fades in at 2000ms delay

**Content Switching**:
- Direction-aware slide animations:
  - Scrolling down: Content slides up from bottom (100vh)
  - Scrolling up: Content slides down from top (-100vh)
- Duration: 1s ease-in-out
- Uses Framer Motion `AnimatePresence` with `mode="wait"`

**Background Elements**:
- Banner Blue.png (full background)
- Sky.png (bottom overlay)
- font.svg (centered overlay, 90vw max-width, 1350px max-width)

### Timeline Section Animations

**Intro Animation** (Phase 1):
- Timeline line starts off-screen right (window.innerWidth)
- Animates to left (-3000px) over 3 seconds (linear)
- Year labels (2000-2014) animate with timeline
- Vertical markers animate with timeline

**Card Navigation**:
- Cards snap to center of viewport
- Smooth scroll animation (500ms) during hijacking
- Instant snap (auto) after timeline complete

**Skip Animation Button**:
- Appears when `currentCardIndex < lastCardIndex` and `!timelineComplete`
- Position: Bottom-right (bottom-10, right-8)
- Background: `rgba(167,185,255,0.2)`
- Hover: `rgba(167,185,255,0.3)`

### Around The World Section Animations

**World Panel** (Panel 1):
- **Map Animation Sequence**:
  1. Logo scrolls left-to-right across map center (4s, linear, fades out at 85%)
  2. Map scrolls right-to-left (marquee style) and returns to original (4s + 1.6s fade)
  3. Final logo appears after map animation (0.8s fade + scale)
- **Stats Display**: Appears with final logo (7+ Countries, 150+ Projects, 170+ People)
- **Trigger**: Starts 200ms after section enters viewport (10% threshold)

**Stack Navigation**:
- Stacks slide horizontally (2000ms ease-in-out)
- Content panels slide horizontally synchronized (2000ms ease-in-out)
- Left margin of content adjusts based on active stack count
- Stack widths: 80px (base), 90px (sm), 100px (md), 110px (lg)

**Services Panel** (Panel 2):
- Static grid layout (1-3 columns responsive)
- Service cards with hover effects

**Clients Panel** (Panel 3):
- Static grid layout (1-3 columns responsive)
- Client logos with hover scale (1.1x)

### Press & Highlights Animations

**Card Entrance**:
- Initial: `y: 100px, opacity: 0`
- Animate: `y: 0, opacity: 1`
- Duration: 1s per card
- Stagger: 1s delay between cards
- Ease: ease-out

**Floating Animation**:
- Starts after all cards have entered (total delay: entranceDuration + (cards.length - 1) * staggerDelay)
- Continuous: `y: [0, -12px, 0]`
- Duration: 2s
- Repeat: Infinite
- Ease: ease-in-out

**Toggle Button**:
- Smooth slide animation between "Media Mentions" and "Podcasts"
- Background: White with rounded-full (30px)

### Investors Section Animations

**Card Entrance**:
- Initial: `x: 800px, opacity: 0`
- Animate: `x: 0, opacity: 1`
- Duration: 1.2s
- Stagger: 0.4s delay between cards
- Ease: `[0.25, 0.1, 0.25, 1]` (custom cubic-bezier)
- Container delay: 1.5s before first card

**Horizontal Scroll**:
- Cards in horizontal scrollable container
- Hidden scrollbar (custom CSS)

### Contact Section Animations

**Social Icons Orbit Animation**:
- **Trigger**: Section enters viewport (35% threshold, -10% rootMargin bottom)
- **Type**: One-time quarter-arc animation
- **Path**: 90-degree arc starting at 222° (left side)
- **Configuration**:
  - Center: (260px, 260px)
  - Radius: 255px
  - Icon size: 80px
  - Duration: 1400ms per icon
  - Stagger: 120ms between icons
  - Travel: 30° along arc
  - Spread: 60° total (icons distributed)
  - Stop offset: -15° (final position moved down arc)
- **Opacity**: Fades in during first 30% of animation
- **Icons**: Twitter, LinkedIn, Instagram

**SVG Arc Animation**:
- Curved line behind person image
- Gradient animation (6s infinite, translate)
- Stroke: 2.5px, white with 0.95 opacity

**Button Sheen Animation**:
- Shimmer effect on hover/active
- Duration: 2.2s linear infinite
- Gradient: White with varying opacity

---

## COMPONENT DETAILS

### 1. SplashScreen Component

**Location**: `src/components/ui/SplashScreen.jsx`

**Props**:
- `onComplete`: Callback when animation finishes

**Features**:
- Multi-language greeting cycle
- Sky phase transition
- Resource preloading (fonts, images)
- Scroll locking during display

**Greetings Array**:
```javascript
["Hey", "Hello", "Bonjour", "Hallo", "வணக்கம்", "Hola"]
```

**Timing**:
- Greetings: 600ms each (3.6s total)
- Sky phase start: 4.1s
- Complete: 7.1s

### 2. About Component (PortfolioHero)

**Location**: `src/components/about/About.jsx`

**Props**:
- `isVisible`: Boolean to trigger mount animations

**Content Items**:
1. **Innovator**: Description about strategic insight and execution
2. **Leader**: Description about leadership style
3. **Investor**: Description about investment philosophy

**Layout**:
- 3-column grid (responsive to 1 column on mobile)
- Left: Heading + intro text
- Center: Person image (header-img.svg)
- Right: Rotating content items

**Scroll Hijacking Logic**:
- Accumulates scroll deltaY
- Threshold: 50px
- Direction tracking for animation direction

### 3. Timeline Component

**Location**: `src/components/timeLine/Timeline.jsx`

**Timeline Cards** (4 total):
1. 2015 - Early Beginnings
2. 2016 - Growth Phase
3. 2017 - Innovation Phase
4. 2018 - Expansion Phase

**Timeline Configuration**:
- Pre-scroll years: 2000-2014 (15 years)
- Pre-scroll width: 3000px
- Year spacing: Equal distribution
- Timeline line starts at: 600px (TIMELINE_LINE_START)
- Padding before first card: 2000px
- Padding after last card: 2000px
- Card width: 810px

**Card Positions**:
- Card 1: 2000px (after padding)
- Card 2: 3700px
- Card 3: 5200px
- Card 4: 6700px

**Background**: timeline.svg (full cover)

### 4. AroundTheWorld Component

**Location**: `src/components/aroundTheWorld/AroundTheWorld.jsx`

**Structure**:
- Left: Sliding content panels
- Right: Vertical stack navigation

**Stacks Configuration** (`stack.config.js`):
1. **World** (01): "Around the World with AI"
2. **Services** (02): "Our Services"
3. **Clients** (03): "Our Clients"

**Panel Components**:
- `World.jsx`: Map animation, stats, logo
- `Services.jsx`: Service cards grid
- `Clients.jsx`: Client logos grid

**Stack Behavior**:
- Clicking stack changes active panel
- Stacks move to left side when active
- Content panels slide horizontally
- Synchronized 2000ms transitions

### 5. Highlights Component

**Location**: `src/components/pressAndHighlights/Highlights.jsx`

**Toggle Options**:
- "Media Mentions" (default)
- "Podcasts"

**Cards Data** (4 cards):
- Each card has: image, title, description, readMoreLink
- Custom className for vertical offset (floating effect)

**Background**: media mentions.png (full cover)

### 6. Investors Component

**Location**: `src/components/investors/Investors.jsx`

**Investment Cards** (4 total):
1. Pepcare - HIPAA-compliant dental platform
2. Belongly - AI therapist matching
3. Decerna - Emission calculation tool
4. Ameya - Healthcare application

**Background**: Light gray (`#F7F7F7`, `rgb(247, 247, 247)`)
- Forced light background even in dark mode

### 7. Contact Component

**Location**: `src/components/contact/Contact.jsx`

**Form Fields**:
- Name (text input)
- Email (text input with validation)
- Message (textarea)

**Email Validation**:
- Must contain "@" symbol
- Error message displays on blur if invalid

**Form Submission**:
- API: Web3Forms
- Access Key: `13458513-e2b5-40d3-b075-ebaf25b3552f`
- Success/Error messages displayed

**Layout**:
- Left: Contact form
- Right: Person image + SVG arc + Social icons

**Background**: Linear gradient `#89BBDD` to `#FFFFFF`

---

## STYLING & DESIGN SYSTEM

### Custom Fonts

**Sparkling Mellow Demo**:
- File: `/fonts/SparklingMellowDemo-Regular.otf`
- Usage: Splash screen greetings, "Sky is the Limit" text
- Font-display: block

**Satoshi**:
- File: `/fonts/Satoshi-Regular.woff2`
- Usage: Body text, headings, UI elements
- Font-display: swap

**Geist Sans/Mono**:
- From Next.js Google Fonts
- Fallback fonts

### Color Palette

**Primary Colors**:
- `--text-primary`: `#1F2024` (Headings, dark text)
- `--text-secondary`: `#454654` (Body text, descriptions)
- `--background`: `#FFFFFF` (Light mode), `#0a0a0a` (Dark mode)
- `--foreground`: `#171717` (Light mode), `#ededed` (Dark mode)
- `--investment-bg`: `#F7F7F7` (Investors section background)

**Accent Colors**:
- Blue tones: `#112643`, `#1a3a52`, `#89BBDD`, `#B1D6EC`, `#DBECF6`, `#93CDEB`
- Button background: `#112643`
- Button hover: `brightness-110`

### Typography Scale

**Headings**:
- `.section-heading`: `clamp(32px, 3.2vw, 44px)`, weight 600, line-height 1.2
- `.heading-h2`: `clamp(28px, 4vw, 44px)`, weight 700, line-height 1.2

**Body Text**:
- `.section-body`: `clamp(16px, 1.3vw, 20px)`, weight 400, line-height 1.5

**Splash Screen**:
- Greeting text: `48px` (mobile) → `64px` (tablet) → `80px` (desktop)
- Sky text: `32px` (mobile) → `48px` (tablet) → `64px` (md) → `80px` (lg)

### Spacing & Layout

**Container Max Widths**:
- Content sections: `max-w-[671px]` for headers
- Cards: `max-w-[300px]` (Highlights), `min-width: 360px` (Investors)

**Padding**:
- Section padding: `px-4 sm:px-6 md:px-8 lg:px-[76px]`
- Card padding: Responsive (`p-4 sm:p-5 md:p-6 lg:p-7`)

**Gaps**:
- Card gaps: `gap-6 md:gap-8 lg:gap-10` (Investors)
- Grid gaps: `gap-2 sm:gap-3 md:gap-5 lg:gap-4` (Services)

### Responsive Breakpoints

- **Base**: < 640px (mobile)
- **sm**: >= 640px (tablet)
- **md**: >= 768px (small desktop)
- **lg**: >= 1024px (desktop)
- **xl**: >= 1200px (large desktop)

### Custom Animations (CSS)

**Ripple Animation**:
```css
@keyframes ripple {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2.4); opacity: 0; }
}
```
- Duration: 2.1s
- Delays: 0ms, 700ms, 1400ms

**Fade-in Animation**:
```css
@keyframes fade-in {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
```
- Duration: 0.3s

**Logo Fade-in**:
```css
@keyframes logoFadeIn {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}
```
- Duration: 0.8s

**Slide-up Animation**:
```css
@keyframes slide-up {
  0% { opacity: 0; transform: translateY(64px); }
  100% { opacity: 1; transform: translateY(0); }
}
```
- Duration: 2s

**Slide-in-from-right**:
```css
@keyframes slide-in-from-right {
  0% { transform: translateX(100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}
```
- Duration: 2s

**Sheen Animation** (Button):
```css
@keyframes sheen {
  0% { transform: translateX(-150%) rotate(20deg); }
  100% { transform: translateX(150%) rotate(20deg); }
}
```
- Duration: 2.2s, infinite

---

## TECHNICAL IMPLEMENTATION DETAILS

### Scroll Management

**Initial Load Sequence**:
1. Splash screen shows (scroll locked)
2. After 7.1s, splash completes
3. Main content fades in (2000ms transition)
4. Scroll remains locked during transition (2000ms)
5. Wait for fonts to load (`document.fonts.ready`)
6. Wait additional 2100ms (transition + buffer)
7. Force reflow (read layout properties)
8. Reset scroll to 0 (multiple methods)
9. Re-enable scroll-snap
10. Final scroll reset after scroll-snap enabled

**Scroll Reset Methods**:
- `window.scrollTo({ top: 0, behavior: 'instant' })`
- `document.documentElement.scrollTop = 0`
- `document.body.scrollTop = 0`

### Intersection Observer Usage

**About Section**:
- Threshold: 0.7 (70% visible)
- Activates scroll hijacking when in view

**Timeline Section**:
- Threshold: [0, 0.3, 0.5, 0.8, 1.0]
- Triggers intro animation at 0.8 (80% visible)
- Resets state when leaving viewport

**Highlights Section**:
- Threshold: 0.5 (50% visible)
- Triggers card entrance animations

**Investors Section**:
- Threshold: 0.1 (10% visible), `once: true`
- Triggers card slide-in animations

**Contact Section**:
- Threshold: 0.35 (35% visible), rootMargin: `0px 0px -10% 0px`
- Triggers social icons orbit animation

### Performance Optimizations

**Image Optimization**:
- Next.js Image component with `priority` for above-fold images
- WebP conversion for better performance
- `quality={90}` for high-quality images

**Animation Performance**:
- `will-change` properties set for animated elements
- `backfaceVisibility: hidden` for 3D transforms
- `transform: translateZ(0)` for GPU acceleration
- RequestAnimationFrame for smooth animations

**Font Loading**:
- `font-display: block` for critical fonts (prevents layout shift)
- `font-display: swap` for body fonts
- Wait for `document.fonts.ready` before enabling scroll-snap

### State Management

**Scroll Hijacking States**:
- `scrollHijackActive`: Boolean for active hijacking
- `isScrolling`: Ref to prevent multiple simultaneous scrolls
- `scrollAccumulator`: Ref to accumulate scroll delta
- `scrollDirection`: Ref to track scroll direction

**Animation States**:
- `isVisible`: Component visibility (Intersection Observer)
- `currentIndex`: Current card/item index
- `timelineComplete`: Timeline animation completion
- `hasAnimated`: One-time animation triggers

### Error Handling

**Form Validation**:
- Email validation with "@" symbol check
- Error messages displayed inline
- Form submission error handling

**Resource Loading**:
- Image preloading with error handling
- Fallback timeout if resources fail to load
- Console warnings for missing resources

---

## FILE STRUCTURE

```
src/
├── app/
│   ├── layout.jsx          # Root layout with fonts
│   ├── page.jsx            # Main page (sections container)
│   ├── globals.css         # Global styles, animations, scroll-snap
│   └── api/
│       └── contact/
│           └── route.js    # Contact form API (Web3Forms)
│
├── components/
│   ├── ui/                 # Reusable components
│   │   ├── SplashScreen.jsx
│   │   ├── Button.jsx
│   │   ├── HighlightsCard.jsx
│   │   ├── InputFields.jsx
│   │   ├── InvestmentCard.jsx
│   │   ├── ServiceCard.jsx
│   │   ├── TimeLineCard.jsx
│   │   └── ToggleButton.jsx
│   │
│   ├── about/
│   │   └── About.jsx       # Hero/About section
│   │
│   ├── timeLine/
│   │   └── Timeline.jsx    # Timeline section
│   │
│   ├── aroundTheWorld/
│   │   ├── AroundTheWorld.jsx
│   │   └── panels/
│   │       ├── SlidingPanels.jsx
│   │       ├── RightStacks.jsx
│   │       ├── World.jsx
│   │       ├── Services.jsx
│   │       ├── Clients.jsx
│   │       └── stack.config.js
│   │
│   ├── pressAndHighlights/
│   │   └── Highlights.jsx
│   │
│   ├── investors/
│   │   └── Investors.jsx
│   │
│   └── contact/
│       └── Contact.jsx
│
└── public/                 # Static assets
    ├── fonts/              # Custom fonts
    ├── *.svg               # SVG icons and graphics
    ├── *.png, *.webp       # Images
    └── *.lottie            # Lottie animations
```

---

## CRITICAL IMPLEMENTATION NOTES

### 1. Scroll Snap Timing
- **CRITICAL**: Scroll-snap must be disabled during initial load and re-enabled only after:
  - Splash screen completes (7.1s)
  - Main element transition completes (2000ms)
  - Fonts are loaded
  - Layout is stable (reflow forced)
  - Scroll is reset to 0

### 2. Scroll Hijacking Boundaries
- About section: 3.5s delay at last item before allowing scroll to next section
- Timeline section: 3s delay at last card before allowing scroll to next section
- Both sections allow scroll to previous section when at first item/card

### 3. Animation Synchronization
- Around The World stacks and content panels must transition together (2000ms)
- Timeline intro animation must complete before scroll hijacking activates
- Contact social icons animation is one-time only (doesn't re-trigger)

### 4. Responsive Behavior
- All sections must work on mobile (< 640px)
- Stack widths in Around The World are responsive (80px → 110px)
- Content margins adjust based on active stack count
- Images use responsive sizing with `clamp()` where appropriate

### 5. Dark Mode Handling
- Investment section background is forced to light (`#F7F7F7`) even in dark mode
- Other sections respect system dark mode preference

### 6. Performance Considerations
- Use `will-change` for animated properties
- Use `backfaceVisibility: hidden` for 3D transforms
- Throttle scroll events (800ms for Timeline, 300ms for carousel)
- Use `requestAnimationFrame` for smooth animations
- Lazy load Lottie animations (dynamic import with SSR disabled)

### 7. Accessibility
- Proper ARIA labels on splash screen
- Semantic HTML structure
- Keyboard navigation support (where applicable)
- Focus states on interactive elements

---

## DEPENDENCIES & CONFIGURATION

### package.json Scripts
```json
{
  "dev": "next dev",
  "build": "cross-env NODE_OPTIONS=--max-old-space-size=4096 next build",
  "start": "next start",
  "lint": "eslint"
}
```

### Environment Variables
- None required (Web3Forms access key is hardcoded in Contact component)

### Build Configuration
- Next.js 16 App Router
- Tailwind CSS 4 with PostCSS
- ESLint with Next.js config
- React Compiler plugin (babel-plugin-react-compiler)

---

## ASSETS REQUIREMENTS

### Required Images
- `/Banner Blue.png` - Background for splash and about sections
- `/Sky.png` - Sky overlay for splash and about sections
- `/header-img.svg` - Person image for about section
- `/font.svg` - Decorative overlay for about section
- `/timeline.svg` - Background for timeline section
- `/media mentions.png` - Background for highlights section
- `/Phil contact fr.png` - Person image for contact section
- Timeline card images: `/time-line-2016.jpg`, `/timeLine-2017.jpg`, `/time-line-2018.jpg`, `/philip-footer-img.png`
- Highlight card images: `/pressOneImg.jpg`, `/press-two.jpg`, `/philip-header.png`
- Investment card images: `/pepcare.png`, `/belongy.png`, `/decerna.png`, `/ameya.png`
- Client logos: Multiple SVG files in `/public`

### Required Lottie Files
- `/World_map.lottie` - World map animation
- `/Location.lottie` - (Optional, not currently used)
- `/Map.lottie` - (Optional, not currently used)
- `/Rotating star.lottie` - (Optional, not currently used)

### Required Fonts
- `/fonts/SparklingMellowDemo-Regular.otf`
- `/fonts/Satoshi-Regular.woff2`

### Required Icons (SVG)
- `/skip.svg` - Skip animation button
- `/twitter.svg`, `/linkedin.svg`, `/instagram.svg` - Social icons
- `/techjays-logo.svg` - Techjays logo
- Various client logos and decorative SVGs

---

## TESTING CHECKLIST

When recreating this project, verify:

1. ✅ Splash screen displays for exactly 7.1 seconds
2. ✅ Scroll is locked during splash screen
3. ✅ Main content fades in smoothly after splash
4. ✅ Scroll-snap works correctly after initialization
5. ✅ About section scroll hijacking cycles through 3 items
6. ✅ Timeline intro animation plays on section enter
7. ✅ Timeline cards snap to center when scrolling
8. ✅ Skip button appears and works correctly
9. ✅ Around The World stacks and panels synchronize
10. ✅ Highlights cards float after entrance
11. ✅ Investors cards slide in from right
12. ✅ Contact form validates email correctly
13. ✅ Social icons orbit animation plays once on enter
14. ✅ All sections are responsive (mobile to desktop)
15. ✅ Images load correctly with proper sizing
16. ✅ Fonts load before scroll-snap activates
17. ✅ No layout shifts during page load
18. ✅ Smooth scroll behavior throughout
19. ✅ Dark mode works (except investment section)
20. ✅ Form submission works with Web3Forms

---

## FINAL NOTES

This portfolio is a **highly polished, animation-rich single-page application** with sophisticated scroll management and custom interactions. Every animation timing, scroll threshold, and transition duration has been carefully tuned for a specific user experience.

**Key Principles**:
- Smooth, intentional animations
- Scroll-snap for section navigation
- Custom scroll hijacking for interactive sections
- Performance-optimized with GPU acceleration
- Fully responsive design
- Accessibility considerations

When recreating, pay close attention to:
- Exact timing values (milliseconds matter)
- Scroll position management (multiple resets needed)
- Animation synchronization
- State management for scroll hijacking
- Intersection Observer thresholds
- Responsive breakpoints and sizing

This prompt should provide everything needed to recreate the project exactly as it exists.


