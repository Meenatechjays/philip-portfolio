# Splash Screen Implementation

## Overview
A production-grade splash screen with multi-language greetings that displays before the main content loads.

## Architecture

### Component Structure
```
src/
├── components/
│   └── ui/
│       └── SplashScreen.jsx    # Standalone, reusable splash screen component
├── app/
│   ├── page.jsx                # Main page with splash screen integration
│   └── globals.css             # Global styles with fade-in animation
```

## Features

### 1. Multi-Language Greetings
- **Languages**: English, French, German, Tamil, Spanish
- **Cycle Time**: 300ms per greeting (1.5s total)
- **Smooth Transitions**: CSS fade-in animation

### 2. Visual Design
- **Background**: Banner Blue.png (as requested)
- **Typography**: Responsive text sizing
  - Mobile: `text-4xl` (36px)
  - Tablet: `text-6xl` (60px)
  - Desktop: `text-8xl` (96px)
- **Font Weight**: Light (300) for elegance
- **Color**: White text for contrast

### 3. Technical Implementation

#### State Management
- Uses React `useState` to manage splash screen visibility
- Clean state transition from splash to main content

#### Performance Optimizations
- **Memory Leak Prevention**: Properly cleans up intervals and timeouts
- **Priority Loading**: Banner Blue background loads with `priority` flag
- **Image Optimization**: Next.js Image component for automatic optimization

#### Accessibility
- Semantic HTML with proper ARIA labels
- `role="dialog"` for screen readers
- `aria-live="polite"` for greeting updates

## Code Flow

```
1. Page loads → showSplash = true
2. SplashScreen component mounts
3. Greeting cycle starts (5 greetings × 300ms)
4. After 1.5s → onComplete callback
5. setShowSplash(false)
6. Main content fades in with opacity transition
```

## Key Design Decisions

### Why Separate Component?
- **Reusability**: Can be used on other pages if needed
- **Separation of Concerns**: Splash logic isolated from page logic
- **Testability**: Easier to unit test in isolation
- **Maintainability**: Single responsibility principle

### Why Client Component?
- Requires React hooks (`useState`, `useEffect`)
- Needs browser APIs (intervals, timeouts)
- Interactive animations

### Why This Animation Approach?
- **CSS Animations**: Hardware-accelerated, performant
- **React State**: Predictable state management
- **No External Libraries**: Keeps bundle size small

## Customization

### Modify Greeting Duration
```javascript
// In SplashScreen.jsx
const greetingInterval = setInterval(() => {
  setCurrentGreeting((prev) => (prev + 1) % greetings.length);
}, 300); // Change this value (in milliseconds)

const loaderTimeout = setTimeout(() => {
  if (onComplete) {
    onComplete();
  }
}, 1500); // Total duration (should be greetingInterval × greetings.length)
```

### Add More Languages
```javascript
const greetings = [
  "Hello",      // English
  "Bonjour",    // French
  "Hallo",      // German
  "வணக்கம்",    // Tamil
  "Hola",       // Spanish
  "こんにちは",   // Japanese (example)
  "안녕하세요"    // Korean (example)
];
```

### Change Background
```javascript
// In SplashScreen.jsx
<Image
  src="/your-background.png"  // Change this
  alt="Background"
  fill
  className="object-cover"
  priority
  quality={90}
/>
```

## Performance Metrics

- **First Contentful Paint**: Optimized with Next.js Image component
- **Total Blocking Time**: Minimal (only 1.5s splash duration)
- **Cumulative Layout Shift**: Zero (fixed positioning)
- **Memory Usage**: Clean (all intervals/timeouts properly cleared)

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

1. **Preferences Storage**: Remember if user has seen splash (localStorage)
2. **Skip Button**: Allow users to skip the animation
3. **Sound Effects**: Add subtle audio cues (optional)
4. **Reduced Motion**: Respect `prefers-reduced-motion` media query
5. **Loading Progress**: Show loading progress for slow connections

## Standards Followed

- ✅ **SOLID Principles**: Single responsibility, Open/Closed
- ✅ **DRY**: No code duplication
- ✅ **KISS**: Simple, straightforward implementation
- ✅ **Accessibility**: WCAG 2.1 compliant
- ✅ **Performance**: Optimized rendering
- ✅ **Maintainability**: Well-documented, clean code

