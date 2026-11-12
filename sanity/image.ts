import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client'

const builder = createImageUrlBuilder(client)

export function urlFor(source: { asset: { _ref: string } }) {
  return builder.image(source)
}

/**
 * Any image shape that can come out of Sanity for a post:
 *  - `externalUrl`: plain URL (bulk import, Unsplash, ...)
 *  - `asset.secure_url`: object stored by sanity-plugin-cloudinary (`cloudinary.asset`)
 *  - `asset._ref`: a regular Sanity image reference
 */
export type AnyImage = {
  externalUrl?: string
  asset?: { _ref?: string; secure_url?: string; url?: string }
} | null | undefined

/** Insert Cloudinary transformations into an `/upload/` delivery URL. */
function cloudinaryTransform(url: string, width?: number, height?: number): string {
  const parts = ['f_auto', 'q_auto']
  if (width) parts.push(`w_${width}`)
  if (height) parts.push(`h_${height}`)
  if (width && height) parts.push('c_fill')
  return url.replace('/upload/', `/upload/${parts.join(',')}/`)
}

/**
 * Resolve a displayable URL for any supported image shape.
 * Returns `undefined` when there is no usable image (never throws).
 *
 * Pass `crop: true` together with width+height to get an exact-size crop
 * (required for og:image — without it Sanity fit=clip serves a smaller,
 * differently-proportioned file than the declared dimensions).
 */
export function getImageUrl(
  image: AnyImage,
  opts: { width?: number; height?: number; crop?: boolean } = {},
): string | undefined {
  if (!image) return undefined
  if (image.externalUrl) return image.externalUrl

  const asset = image.asset
  if (!asset) return undefined

  // Prefer the Sanity builder when a _ref exists so width/height/crop
  // transforms actually apply (raw asset.url cannot be transformed).
  // Sanity asset reference IDs look like "image-<hash>-<w>x<h>-<ext>"
  if (asset._ref && /^image-[^-]+-\d+x\d+-\w+$/.test(asset._ref)) {
    let b = urlFor({ asset: { _ref: asset._ref } })
    if (opts.width) b = b.width(opts.width)
    if (opts.height) b = b.height(opts.height)
    if (opts.crop && opts.width && opts.height) b = b.fit('crop')
    return b.format('webp').url()
  }

  const cloudUrl = asset.secure_url ?? asset.url
  if (cloudUrl) {
    const https = cloudUrl.replace(/^http:\/\//, 'https://')
    return https.includes('res.cloudinary.com')
      ? cloudinaryTransform(https, opts.width, opts.height)
      : https
  }

  return undefined
}

/**
 * Resize/convert an image that is already a plain Sanity CDN URL (e.g. the
 * `asset->{ url }` we fetch for the site logo). Without this the browser
 * downloads the full-size original (a logo shown at 40px can weigh 500KB+).
 *
 * - Non-Sanity URLs and SVGs are returned unchanged (SVG is already tiny and
 *   must not be rasterised).
 * - Pass the CSS size you display at; we request 2x for retina screens.
 */
export function getSanityCdnUrl(url: string | undefined | null, displayPx: number): string | undefined {
  if (!url) return undefined
  if (!url.includes('cdn.sanity.io') || /\.svg(\?|$)/i.test(url)) return url
  const u = new URL(url)
  const px = Math.round(displayPx * 2)
  u.searchParams.set('w', String(px))
  u.searchParams.set('h', String(px))
  u.searchParams.set('fit', 'max')
  u.searchParams.set('fm', 'webp')
  return u.toString()
}

/**
 * Read the intrinsic width/height from a Sanity image reference
 * ("image-<hash>-1600x1067-jpg"). Lets us put width/height on <img> so the
 * browser reserves space before the image loads (no layout shift).
 * When the image is resized to `maxWidth`, the height is scaled to match.
 */
export function getSanityImageSize(
  ref: string | undefined,
  maxWidth?: number,
): { width: number; height: number } | undefined {
  const m = ref?.match(/^image-[^-]+-(\d+)x(\d+)-\w+$/)
  if (!m) return undefined
  let width = Number(m[1])
  let height = Number(m[2])
  if (maxWidth && width > maxWidth) {
    height = Math.round((height * maxWidth) / width)
    width = maxWidth
  }
  return { width, height }
}
