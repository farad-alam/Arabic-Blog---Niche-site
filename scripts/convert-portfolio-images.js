// scripts/convert-portfolio-images.js
// Converts all PNG portfolio thumbnails to compressed WebP
// Run with: node scripts/convert-portfolio-images.js

const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const INPUT_DIR = path.join(__dirname, '../public/images/portfolio')
const OUTPUT_DIR = path.join(__dirname, '../public/images/portfolio')

// WebP quality: 82 is the sweet spot — visually identical, ~80% smaller than PNG
const WEBP_QUALITY = 82

async function convertImages() {
  const files = fs.readdirSync(INPUT_DIR).filter(f => /\.(png|jpg|jpeg)$/i.test(f))

  console.log(`\nFound ${files.length} images to convert:\n`)

  let totalOriginal = 0
  let totalConverted = 0

  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file)
    const outputName = file.replace(/\.(png|jpg|jpeg)$/i, '.webp')
    const outputPath = path.join(OUTPUT_DIR, outputName)

    const originalSize = fs.statSync(inputPath).size

    await sharp(inputPath)
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .toFile(outputPath)

    const convertedSize = fs.statSync(outputPath).size
    const savings = (((originalSize - convertedSize) / originalSize) * 100).toFixed(1)

    totalOriginal += originalSize
    totalConverted += convertedSize

    console.log(
      `  ✅  ${file.padEnd(35)} ${(originalSize / 1024).toFixed(0).padStart(6)}KB  →  ${(convertedSize / 1024).toFixed(0).padStart(5)}KB  (saved ${savings}%)`
    )
  }

  const totalSavings = (((totalOriginal - totalConverted) / totalOriginal) * 100).toFixed(1)
  console.log(`\n${'─'.repeat(70)}`)
  console.log(
    `  📦  Total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB  →  ${(totalConverted / 1024 / 1024).toFixed(2)} MB  (saved ${totalSavings}%)\n`
  )
  console.log('✨  All images converted to WebP successfully!\n')
  console.log('Next step: Update your data/portfolio.ts image paths to use .webp extensions.\n')
}

convertImages().catch(console.error)
