/**
 * Portfolio Thumbnail Downloader
 * Run once from the MotionBite project root:
 *   node scripts/download-thumbnails.js
 *
 * Downloads hero images from each live client site and saves them
 * to public/images/portfolio/ as JPG thumbnails.
 */

const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'portfolio')

const images = [
  {
    filename: 'papa-roma.jpg',
    url: 'https://papa-roma-smoke-house.vercel.app/images/hero-brisket.png',
  },
  {
    filename: 'baitullah-musafir.jpg',
    url: 'https://baitullah-musafir.vercel.app/images/hero/kaaba.png',
  },
  {
    filename: 'bismillah-auto.jpg',
    url: 'https://bismillah-auto.netlify.app/og-image.jpg',
  },
  {
    filename: 'fitlife-bd.jpg',
    url: 'https://fitlife-bd-41b3.vercel.app/images/hero-bg.png',
  },
  {
    filename: 'reach-logic.jpg',
    url: 'https://www.reachlogic.net/og-image.png',
  },
  {
    filename: 'saudi-garej.jpg',
    url: 'https://vehicle-repair-shop-sar.vercel.app/hero-slider/img1.jpg',
  },
  {
    filename: 'omatic-social.jpg',
    url: 'https://www.omaticsocial.com/og-image.png',
  },
  {
    filename: 'muscle-flex.jpg',
    url: 'https://muscle-flex-fitness.vercel.app/hero23.png',
  },
  {
    filename: 'pethygene-lab.jpg',
    url: 'https://www.pethygienelab.com/images/hero-dog.png',
  },
  {
    filename: 'smart-advertising.jpg',
    url: 'https://smart-advertising-and-wrapping-duba.vercel.app/_next/static/media/kitchen.cceb961a.jpg',
  },
  {
    filename: 'autotent.jpg',
    url: 'https://autotent.vercel.app/og-image.png',
  },
]

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath)
    const client = url.startsWith('https') ? https : http

    const request = (targetUrl) => {
      client.get(targetUrl, (res) => {
        // Follow redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close()
          const redirectUrl = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, targetUrl).href
          const redirectClient = redirectUrl.startsWith('https') ? https : http
          redirectClient.get(redirectUrl, (res2) => {
            if (res2.statusCode !== 200) {
              reject(new Error(`HTTP ${res2.statusCode}`))
              return
            }
            res2.pipe(file)
            file.on('finish', () => file.close(resolve))
            file.on('error', reject)
          }).on('error', reject)
          return
        }

        if (res.statusCode !== 200) {
          file.close()
          fs.unlink(destPath, () => {})
          reject(new Error(`HTTP ${res.statusCode}`))
          return
        }

        res.pipe(file)
        file.on('finish', () => file.close(resolve))
        file.on('error', reject)
      }).on('error', (err) => {
        file.close()
        fs.unlink(destPath, () => {})
        reject(err)
      })
    }

    request(url)
  })
}

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    console.log(`Created directory: ${OUTPUT_DIR}`)
  }

  console.log(`\nDownloading ${images.length} portfolio thumbnails...\n`)

  for (const img of images) {
    const dest = path.join(OUTPUT_DIR, img.filename)
    process.stdout.write(`  ${img.filename.padEnd(28)} ← ${img.url.slice(0, 60)}...`)
    try {
      await download(img.url, dest)
      const size = Math.round(fs.statSync(dest).size / 1024)
      console.log(` ✓  (${size} KB)`)
    } catch (err) {
      console.log(` ✗  ${err.message}`)
    }
  }

  console.log('\nDone. Check public/images/portfolio/ for results.')
  console.log('For any ✗ failures, manually save a screenshot of that site\'s hero section.\n')
}

run()
