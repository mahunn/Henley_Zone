const sharp = require('sharp');
const path = require('path');

async function processLogo() {
  const inputPath = path.join(__dirname, '../public/websy-logo.png');
  const outputPath = path.join(__dirname, '../public/websy-logo-white.png');

  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Detect red dot (Red channel is significantly stronger than Green and Blue)
    const isRed = (r - g > 40) && (r - b > 40);

    if (isRed) {
      // Keep dot vibrant red (#e11d48)
      data[i] = 225;
      data[i + 1] = 29;
      data[i + 2] = 72;
      // Alpha is based on how dark the green/blue channels are (white background has G/B close to 255, red has G/B close to 0)
      const dotLuminance = (g + b) / 2;
      data[i + 3] = Math.max(0, 255 - dotLuminance);
    } else {
      // Convert dark text on white to transparent white text
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = Math.max(0, 255 - gray);
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .trim() // Crop transparent margins for perfect center alignment
    .toFile(outputPath);

  console.log('Successfully generated public/websy-logo-white.png (trimmed)');
}

processLogo().catch(console.error);
