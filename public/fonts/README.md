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

⚠️ **IMPORTANT**: The `@font-face` declaration is currently **commented out** in `src/app/globals.css` to prevent 404 errors until the font files are added.

Once you add the font files to this directory, uncomment the `@font-face` declaration:

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

### Steps to Enable the Font

1. **Add font files** to this directory (`/public/fonts/`):
   - `SparklingMellowDemo.woff2`
   - `SparklingMellowDemo.woff`
   - `SparklingMellowDemo.ttf`

2. **Uncomment the `@font-face` declaration** in `src/app/globals.css`:
   - Remove the `/*` and `*/` around the `@font-face` block
   - Update the CSS variable `--font-sparkling-mellow` back to `'Sparkling Mellow Demo'`

3. **Restart your development server**:
   ```bash
   npm run dev
   ```

4. **Clear browser cache** and reload the page

5. **Verify in DevTools**:
   - Open Network tab → Filter by "Font"
   - All three font files should load with status 200 (not 404)
   - The splash screen should display text in **Sparkling Mellow Demo** font

