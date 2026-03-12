/**
 * VitaFlow App Icon Generator
 *
 * Generates app icons using canvas.
 * Run: node scripts/generate-icons.js
 *
 * Requires: npm install canvas (dev dependency)
 */
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'images');

function drawVitaFlowLogo(ctx, size, options = {}) {
  const { background = true, foregroundOnly = false, monochrome = false } = options;

  // Background
  if (background && !foregroundOnly) {
    // Gradient blue to purple
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#2563EB');
    gradient.addColorStop(1, '#7C3AED');
    ctx.fillStyle = gradient;

    // Rounded rect for icon
    const radius = size * 0.2;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();
  }

  // V letter with flow lines
  const color = monochrome ? '#000000' : '#FFFFFF';
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  const cx = size / 2;
  const cy = size / 2;
  const s = size * 0.3; // scale factor

  // Draw "V" shape
  ctx.lineWidth = size * 0.06;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.8, cy - s * 0.7);
  ctx.lineTo(cx, cy + s * 0.7);
  ctx.lineTo(cx + s * 0.8, cy - s * 0.7);
  ctx.stroke();

  // Flow line under V
  ctx.lineWidth = size * 0.035;
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.5, cy + s * 0.95);
  ctx.quadraticCurveTo(cx, cy + s * 1.2, cx + s * 0.5, cy + s * 0.95);
  ctx.stroke();
}

// Main icon (1024x1024)
function generateIcon() {
  const size = 1024;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  drawVitaFlowLogo(ctx, size);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(ASSETS_DIR, 'icon.png'), buffer);
  console.log('Generated: icon.png (1024x1024)');
}

// Android adaptive icon foreground (1024x1024 with padding)
function generateAdaptiveForeground() {
  const size = 1024;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  // Transparent background, only logo
  drawVitaFlowLogo(ctx, size, { background: false, foregroundOnly: true });
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(ASSETS_DIR, 'android-icon-foreground.png'), buffer);
  console.log('Generated: android-icon-foreground.png');
}

// Android adaptive icon background
function generateAdaptiveBackground() {
  const size = 1024;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#2563EB');
  gradient.addColorStop(1, '#7C3AED');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(ASSETS_DIR, 'android-icon-background.png'), buffer);
  console.log('Generated: android-icon-background.png');
}

// Monochrome icon
function generateMonochrome() {
  const size = 1024;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  drawVitaFlowLogo(ctx, size, { background: false, monochrome: true });
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(ASSETS_DIR, 'android-icon-monochrome.png'), buffer);
  console.log('Generated: android-icon-monochrome.png');
}

// Splash icon (288x288) — colored V on transparent bg
function generateSplashIcon() {
  const size = 288;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  const cx = size / 2;
  const cy = size / 2;
  const s = size * 0.3;

  // V in gradient blue-purple
  const gradient = ctx.createLinearGradient(cx - s, cy - s, cx + s, cy + s);
  gradient.addColorStop(0, '#2563EB');
  gradient.addColorStop(1, '#7C3AED');
  ctx.strokeStyle = gradient;
  ctx.lineWidth = size * 0.06;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.8, cy - s * 0.7);
  ctx.lineTo(cx, cy + s * 0.7);
  ctx.lineTo(cx + s * 0.8, cy - s * 0.7);
  ctx.stroke();

  // Flow line
  ctx.lineWidth = size * 0.035;
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.5, cy + s * 0.95);
  ctx.quadraticCurveTo(cx, cy + s * 1.2, cx + s * 0.5, cy + s * 0.95);
  ctx.stroke();

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(ASSETS_DIR, 'splash-icon.png'), buffer);
  console.log('Generated: splash-icon.png (288x288)');
}

// Favicon (48x48)
function generateFavicon() {
  const size = 48;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  drawVitaFlowLogo(ctx, size);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(ASSETS_DIR, 'favicon.png'), buffer);
  console.log('Generated: favicon.png (48x48)');
}

try {
  generateIcon();
  generateAdaptiveForeground();
  generateAdaptiveBackground();
  generateMonochrome();
  generateSplashIcon();
  generateFavicon();
  console.log('\nAll icons generated successfully!');
} catch (err) {
  console.error('Error generating icons:', err.message);
  console.log('\nTo use this script, install canvas:');
  console.log('  npm install --save-dev canvas');
  console.log('\nAlternatively, create icons manually using Figma/Canva with:');
  console.log('  - Colors: #2563EB → #7C3AED gradient');
  console.log('  - Logo: White "V" with flow curve underneath');
  console.log('  - Sizes: icon.png (1024x1024), splash-icon.png (288x288), favicon.png (48x48)');
}
