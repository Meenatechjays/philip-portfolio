# Project Structure Documentation

## Overview

This is a **single-page portfolio application** built with Next.js App Router. The project uses static content and focuses on clean, maintainable component architecture.

## Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.jsx         # Root layout (HTML shell, global providers)
│   ├── page.jsx           # Home page (single-page application)
│   ├── globals.css        # Global styles
│   └── favicon.ico
│
├── components/            # React components
│   ├── ui/               # Reusable UI components (used in 2+ places)
│   │   ├── Button.jsxZ
│   │   ├── HighlightsCard.jsx
│   │   ├── InputFields.jsx
│   │   ├── InvestmentCard.jsx
│   │   ├── ServiceCard.jsx
│   │   ├── TimeLineCard.jsx
│   │   └── ToggleButton.jsx
│   │
│   ├── about/            # About section components
│   ├── contact/          # Contact section components
│   ├── header/           # Header components
│   ├── investors/        # Investors section components
│   ├── pressAndHighlights/ # Press & highlights components
│   ├── Services/         # Services section components
│   └── timeLine/         # Timeline section components
│
└── sections/             # Page sections (main content blocks)
    # Each section imports from components/ and content/
```

## Component Organization Principles

### 1. Reusable Components (`components/ui/`)

**Rule**: If a component is used in **2 or more places**, it belongs in `components/ui/`.

**Examples**:
- `Button.jsx` - Used across multiple sections
- `ServiceCard.jsx` - Used in Services section, potentially elsewhere
- `InvestmentCard.jsx` - Used in Investors section, potentially elsewhere
- `TimeLineCard.jsx` - Used in Timeline section, potentially elsewhere
- `HighlightsCard.jsx` - Used in Press & Highlights section
- `InputFields.jsx` - Used in Contact form
- `ToggleButton.jsx` - Used for theme/state toggles

**Import Pattern**:
```jsx
import { Button } from '@/components/ui/Button';
import { ServiceCard } from '@/components/ui/ServiceCard';
```

### 2. Feature-Specific Components

**Rule**: If a component is **only used in one section**, keep it in that feature folder.

**Examples**:
- `components/about/AboutBio.jsx` - Only used in About section
- `components/contact/ContactForm.jsx` - Only used in Contact section

**Import Pattern**:
```jsx
import { AboutBio } from '@/components/about/AboutBio';
```

## Content Organization (Recommended)

For static content, consider creating a `content/` directory:

```
src/
└── content/
    ├── nav.ts            # Navigation links
    ├── socials.ts        # Social media links
    ├── projects.ts       # Project data
    ├── timeline.ts       # Timeline entries
    ├── services.ts       # Services data
    └── meta.ts           # SEO metadata
```

## Development Guidelines

### Component Creation Checklist

1. **Is it reusable?**
   - ✅ Used in 2+ places → `components/ui/`
   - ❌ Used in 1 place → Feature folder

2. **Naming Convention**
   - Use PascalCase: `Button.jsx`, `ServiceCard.jsx`
   - Be descriptive: `TimeLineCard.jsx` not `Card.jsx`

3. **File Structure**
   ```jsx
   // components/ui/Button.jsx
   export default function Button({ children, variant, ...props }) {
     return (
       <button className={styles.button} {...props}>
         {children}
       </button>
     );
   }
   ```

### Import Paths

Use the `@/` alias (configured in Next.js) for clean imports:

```jsx
// ✅ Good
import { Button } from '@/components/ui/Button';
import { AboutBio } from '@/components/about/AboutBio';

// ❌ Avoid relative paths
import { Button } from '../../../components/ui/Button';
```

## Static Content Strategy

Since this is a static portfolio:

1. **External Links**: All external redirects should use proper attributes:
   ```jsx
   <a href="https://example.com" target="_blank" rel="noopener noreferrer">
     Link Text
   </a>
   ```

2. **Images**: Store in `public/` directory
   - `public/images/` - Photos, screenshots
   - `public/icons/` - SVG icons

3. **Data**: Consider TypeScript/JSON files in `content/` for easy updates

## Next Steps

- [ ] Create `content/` directory for static data
- [ ] Implement reusable components in `components/ui/`
- [ ] Build page sections in `sections/`
- [ ] Wire everything together in `app/page.jsx`

## Resources

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Figma Design](https://www.figma.com/proto/Zcxf6VN0PpMzufsoGAKd5n/Phil-s-Portfolio--Final)

