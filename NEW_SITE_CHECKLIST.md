# New niche site checklist

This repo is the template. Everything below is what you change per site — nothing else should need editing.

| What | Where |
|---|---|
| Domain | `NEXT_PUBLIC_SITE_URL` env var (use the exact canonical host, e.g. `https://www.example.com`) |
| Sanity project | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN`, `SANITY_WEBHOOK_SECRET` |
| Colors | `:root` block at the top of `styles/globals.css` (space-separated RGB triplets) |
| Fonts | `lib/fonts.ts` (keep the three exported names and CSS variable names) |
| Site name, hero, SEO title/description, logo, favicon, OG image | Studio → Site Settings |
| Homepage section order / visibility | Studio → Site Settings → Homepage → *Homepage Sections* |
| GA4, Clarity, AdSense, GSC/Bing verification, Amazon tag | Studio → Site Settings → Analytics & Tools |
| Which category pages Google may index | Studio → Category → *Let Google index this category page* |
| Extra image hosts (if you hotlink from a new CDN) | `images.remotePatterns` in `next.config.ts` |
| Amazon store country | `lib/affiliates.ts` (currently amazon.sa) |

After deploy: add the Sanity webhook → `/api/revalidate`, submit `/sitemap.xml` in GSC and Bing, and confirm `robots.txt`, one article's canonical/hreflang, and `/ar` → 200.
