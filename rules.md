# Project Rules & Guidelines

## Critical Rules

### File Size Limit
- **STRICTLY ENFORCED**: Each file must not exceed 150 lines
- Split large files into smaller, focused modules
- Extract reusable logic into separate utilities
- Break down complex components into smaller sub-components

### Code Quality & Maintainability
- Follow SOLID principles (Single Responsibility, Open/Closed, etc.)
- Apply DRY (Don't Repeat Yourself) - extract common patterns
- Use TypeScript for type safety (when applicable)
- Write self-documenting code with clear naming
- One component per file with clear, descriptive names

## Styling Standards

### No Inline Styles (STRICTLY PROHIBITED)
- **NEVER** use `style={{ }}` or `style="..."` attributes
- Use Tailwind CSS utility classes exclusively
- For complex styles, use CSS modules or `globals.css`
- Use Tailwind's arbitrary values when needed: `className="w-[671px]"`

## Performance Optimization

### Component Rendering
- **Lazy load** components below the fold using `React.lazy()` and `Suspense`
- Use `React.memo()` to prevent unnecessary re-renders
- Implement viewport-based rendering (only render visible components)
- Split routes and heavy components using Next.js dynamic imports
- Avoid rendering all components at once - load on demand

### Code Splitting Strategy
```jsx
// ✅ Good: Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false // Only if not needed for SEO
});

// ✅ Good: Conditional rendering
{isVisible && <Component />}
```

### Animation Performance
- **Limit animations** to prevent overload and jank
- Use CSS `transform` and `opacity` only (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left` (causes layout reflow)
- Debounce/throttle scroll/resize handlers
- Use `will-change` sparingly
- Prefer CSS animations over JavaScript when possible
- Limit concurrent animations (max 2-3 per viewport)

### Image Optimization
- Always use Next.js `Image` component
- Set `priority` only for above-the-fold images
- Provide descriptive `alt` attributes for SEO
- Use appropriate formats (WebP preferred)

## SEO & Loading Performance

### Fast Loading Requirements
- Minimize JavaScript bundle size
- Use Next.js automatic code splitting
- Load critical CSS inline
- Defer non-critical JavaScript
- Optimize Core Web Vitals:
  - **LCP** (Largest Contentful Paint) < 2.5s
  - **FID** (First Input Delay) < 100ms
  - **CLS** (Cumulative Layout Shift) < 0.1

### SEO Best Practices
- Implement proper meta tags in `layout.jsx`
- Use semantic HTML (`<nav>`, `<main>`, `<section>`)
- Proper heading hierarchy (h1 → h2 → h3)
- Descriptive alt text for all images
- Use structured data when applicable

## React Best Practices

### Component Structure
- Hooks at the top
- Effects after state
- Event handlers before render
- Keep components under 150 lines

### State Management
- Keep state local when possible
- Use `useCallback` for event handlers passed as props
- Use `useMemo` for expensive calculations
- Avoid prop drilling (use Context if needed)

### Rendering Optimization
```jsx
// ✅ Good: Memoized component
export default React.memo(function MyComponent({ data }) {
  // Component logic
});

// ✅ Good: Memoized expensive calculation
const expensiveValue = useMemo(() => compute(data), [data]);
```

## File Organization

### Component Architecture
- One component per file (default export)
- Keep files under 150 lines
- Feature-based folder structure
- Reusable components in `components/ui/`
- Section-specific components in feature folders

### Import Organization
```jsx
// 1. React/Next.js
import { useState } from 'react';
import Image from 'next/image';

// 2. Third-party
import { motion } from 'framer-motion';

// 3. Local components
import { Button } from '@/components/ui/Button';

// 4. Utilities
import { formatDate } from '@/utils/helpers';
```

## Quick Reference Checklist

### ✅ DO
- Keep files under 150 lines
- Use Tailwind classes (no inline styles)
- Lazy load below-the-fold components
- Use `React.memo()` for expensive components
- Optimize animations (transform/opacity only)
- Code split routes and heavy dependencies
- Use Next.js Image component
- Write semantic HTML for SEO

### ❌ DON'T
- Use inline styles
- Create files over 150 lines
- Render all components at once
- Use heavy animations causing jank
- Skip image optimization
- Ignore Core Web Vitals
- Import unused dependencies

## Performance Monitoring

Before deploying, verify:
- [ ] No files exceed 150 lines
- [ ] No inline styles used
- [ ] Components lazy-loaded appropriately
- [ ] Animations are performant (transform/opacity)
- [ ] Images optimized with Next.js Image
- [ ] Bundle size optimized
- [ ] Core Web Vitals within targets
- [ ] SEO meta tags implemented

---

**Priority**: Performance, maintainability, and SEO are non-negotiable. Every change must consider its impact on load time and user experience.
