/**
 * Single source of truth for the site's base URL.
 *
 * Set NEXT_PUBLIC_SITE_URL in .env (see .env.local.example).
 * Every sitemap, robots, JSON-LD, and share link reads from here —
 * there are no other hardcoded domain fallbacks in the codebase.
 */
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'
