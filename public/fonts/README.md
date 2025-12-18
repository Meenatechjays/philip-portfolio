# Custom Fonts Directory

## Google Fonts - Automatically Loaded

The splash screen now uses **Google Fonts** which are automatically loaded by Next.js:

### Fonts Used:
- **Cormorant Garamond** (primary)
- **Playfair Display** (secondary)
- **Serif** (fallback)

### No Manual Installation Required ✅

These fonts are loaded via Next.js font optimization system and don't require manual font file installation.

### File Naming Convention

Ensure the font files are named exactly as shown above, or update the `@font-face` declaration in `src/app/globals.css` to match your font file names.

### Where to Get the Font

1. If you have the font files, copy them to this directory
2. Ensure the font license allows web usage
3. Convert font files to web formats if needed using tools like:
   - [Font Squirrel Webfont Generator](https://www.fontsquirrel.com/tools/webfont-generator)
   - [Transfonter](https://transfonter.org/)

### Current Fallback

The splash screen will use the following fallback fonts if "Sparkling Mellow Demo" is not found:
- Geist (Next.js default)
- System fonts (-apple-system, BlinkMacSystemFont, Segoe UI)
- Generic sans-serif

### CSS Configuration

The font is already configured in `src/app/globals.css`:

```css
@font-face {
  font-family: 'Sparkling Mellow Demo';
  src: url('/fonts/SparklingMellowDemo.woff2') format('woff2'),
       url('/fonts/SparklingMellowDemo.woff') format('woff'),
       url('/fonts/SparklingMellowDemo.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

### Testing

After adding the font files:
1. Clear your browser cache
2. Restart the development server: `npm run dev`
3. Visit http://localhost:3000
4. The splash screen should display all text in **Sparkling Mellow Demo** font:
   - Greeting text (Hello, Bonjour, Hallo, வணக்கம், Hola)
   - "Sky is the Limit" text

