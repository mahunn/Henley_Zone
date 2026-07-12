const sharp = require('sharp');
const path = require('path');

async function processLogo() {
  const inputPath = path.join(__dirname, '../public/websy-logo.png');
  const outputPath = path.join(__dirname, '../public/websy-logo-white.png');

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    // Detect red-ish pixels (red dot)
    const isRed = (r > 150) && (r - g > 50) && (r - b > 50);

    if (isRed) {
      // Make the dot a vibrant pure red
      data[i] = 225;
      data[i + 1] = 29;
      data[i + 2] = 72;
      data[i + 3] = 255; // fully opaque
    } else if (gray > 200) {
      // Background / near-white pixels → fully transparent
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    } else {
      // Dark text → convert to white, alpha based on darkness
      const alpha = Math.min(255, Math.round((255 - gray) * 1.5));
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = alpha;
    }
  }

  await sharp(data, { raw: { width, height, channels: 4 } })
    .png()
    .trim()
    .toFile(outputPath);

  console.log('Successfully generated public/websy-logo-white.png (clean transparency)');
}

processLogo().catch(console.error);
