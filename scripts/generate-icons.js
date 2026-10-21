import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgBuffer = fs.readFileSync('public/icon.svg');

async function generate() {
  // 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('public/pwa-192x192.png');
  console.log('Created pwa-192x192.png');

  // 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-512x512.png');
  console.log('Created pwa-512x512.png');

  // 512x512 maskable (with 15% inner padding for Android adaptive icon safe zone)
  const innerSize = Math.floor(512 * 0.8);
  const padding = Math.floor((512 - innerSize) / 2);
  const innerIcon = await sharp(svgBuffer)
    .resize(innerSize, innerSize)
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 2, g: 132, b: 199, alpha: 1 }, // #0284c7 Sky primary
    },
  })
    .composite([{ input: innerIcon, top: padding, left: padding }])
    .png()
    .toFile('public/pwa-maskable-512x512.png');
  console.log('Created pwa-maskable-512x512.png');

  // Apple touch icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('Created apple-touch-icon.png');

  // Favicon (32x32 png / ico)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile('public/favicon.ico');
  console.log('Created favicon.ico');
}

generate().catch(console.error);
