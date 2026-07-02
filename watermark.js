const Jimp = require('jimp');
const path = require('path');

const images = [
  'still-coat',
  'rehab-tee',
  'stage-trousers',
  'healing-hoodie',
  'quiet-shirt',
  'rehab-jacket',
  'still-shorts',
  'rehab-cap',
  'stage-tote'
];

async function addWatermark(filename) {
  try {
    const inputPath = path.join(__dirname, `${filename}.png`);
    const outputPath = path.join(__dirname, `${filename}.png`);

    const image = await Jimp.read(inputPath);
    const width = image.getWidth();
    const height = image.getHeight();

    // Watermark text settings
    const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
    const fontSmall = await Jimp.loadFont(Jimp.FONT_SANS_8_WHITE);

    // Create watermark overlay
    const watermark = new Jimp(220, 40, 0x00000000);

    // Print brand name
    watermark.print(font, 0, 0, 'RehabChild');
    watermark.print(fontSmall, 2, 22, 'The Healing Stage  ·  SS26');

    // Set opacity of watermark
    watermark.opacity(0.18);

    // Position bottom-right with padding
    const x = width - 230;
    const y = height - 55;

    image.composite(watermark, x, y, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 1,
      opacityDest: 1
    });

    await image.writeAsync(outputPath);
    console.log(`✓ Watermarked: ${filename}.png`);
  } catch (err) {
    console.error(`✗ Error on ${filename}:`, err.message);
  }
}

async function run() {
  console.log('Adding RehabChild watermarks...\n');
  for (const img of images) {
    await addWatermark(img);
  }
  console.log('\n✓ All done! Images updated in your rehabchild folder.');
}

run();