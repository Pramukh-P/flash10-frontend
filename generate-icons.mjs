// Run this once to generate PWA icons: node generate-icons.mjs
// It creates a simple Flash10 branded icon if you don't have one
// If you have your own logo PNG, just manually resize it to 192x192 and 512x512
// and save as public/icons/icon-192.png and public/icons/icon-512.png

import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#3b82f6');
  grad.addColorStop(1, '#9333ea');
  ctx.fillStyle = grad;

  // Rounded rect
  const r = size * 0.22;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, size - r);
  ctx.quadraticCurveTo(size, size, size - r, size);
  ctx.lineTo(r, size);
  ctx.quadraticCurveTo(0, size, 0, size - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fill();

  // "F" text
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.55}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('F', size / 2, size / 2 + size * 0.03);

  return canvas.toBuffer('image/png');
}

mkdirSync('public/icons', { recursive: true });
writeFileSync('public/icons/icon-192.png', generateIcon(192));
writeFileSync('public/icons/icon-512.png', generateIcon(512));
console.log('✅ Icons generated: public/icons/icon-192.png and icon-512.png');
