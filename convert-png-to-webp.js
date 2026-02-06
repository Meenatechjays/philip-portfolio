const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Get all PNG files in the public directory
const pngFiles = fs.readdirSync(publicDir).filter(file => file.toLowerCase().endsWith('.png'));

console.log(`Found ${pngFiles.length} PNG files to convert:`);
pngFiles.forEach(file => console.log(`  - ${file}`));

async function convertPngToWebp() {
  const conversions = [];
  
  for (const pngFile of pngFiles) {
    const pngPath = path.join(publicDir, pngFile);
    const webpFile = pngFile.replace(/\.png$/i, '.webp');
    const webpPath = path.join(publicDir, webpFile);
    
    try {
      await sharp(pngPath)
        .webp({ quality: 90 })
        .toFile(webpPath);
      
      const originalSize = fs.statSync(pngPath).size;
      const newSize = fs.statSync(webpPath).size;
      const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
      
      console.log(`✓ Converted: ${pngFile} → ${webpFile} (${savings}% smaller)`);
      conversions.push({ pngFile, webpFile });
    } catch (error) {
      console.error(`✗ Error converting ${pngFile}:`, error.message);
    }
  }
  
  console.log(`\nConversion complete! ${conversions.length} files converted.`);
  return conversions;
}

convertPngToWebp().catch(console.error);






