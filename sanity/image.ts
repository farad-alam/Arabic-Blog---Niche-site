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
 */
export function getImageUrl(
  image: AnyImage,
  opts: { width?: number; height?: number } = {},
): string | undefined {
  if (!image) return undefined
  if (image.externalUrl) return image.externalUrl

  const asset = image.asset
  if (!asset) return undefined

  const cloudUrl = asset.secure_url ?? asset.url
  if (cloudUrl) {
    const https = cloudUrl.replace(/^http:\/\//, 'https://')
    return https.includes('res.cloudinary.com')
      ? cloudinaryTransform(https, opts.width, opts.height)
      : https
  }

  // Sanity asset reference IDs look like "image-<hash>-<w>x<h>-<ext>"
  if (asset._ref && /^image-[^-]+-\d+x\d+-\w+$/.test(asset._ref)) {
    let b = urlFor({ asset: { _ref: asset._ref } })
    if (opts.width) b = b.width(opts.width)
    if (opts.height) b = b.height(opts.height)
    return b.format('webp').url()
  }

  return undefined
}
