import { defineField, defineType } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'identity',  title: '🏷️ Site Identity'     },
    { name: 'seo',       title: '🔍 SEO'                },
    { name: 'analytics', title: '📊 Analytics & Tools'  },
    { name: 'social',    title: '🔗 Social Links'       },
  ],
  fields: [
    // ── Site Name ──────────────────────────────────────────────────────────────
    defineField({
      name: 'siteNameAr',
      title: 'Site Name (Arabic)',
      type: 'string',
      group: 'identity',
      description: 'e.g. موقع المنزل والمطبخ',
    }),
    defineField({
      name: 'siteNameEn',
      title: 'Site Name (English)',
      type: 'string',
      group: 'identity',
      description: 'e.g. Home & Kitchen Guide',
    }),

    // ── SEO — Arabic ─────────────────────────────────────────────────────────
    defineField({
      name: 'seoTitleAr',
      title: 'SEO Title (Arabic)',
      type: 'string',
      group: 'seo',
      description: 'Homepage meta title for Arabic. Max 60 chars.',
      validation: (Rule) => Rule.max(60).warning('Longer titles may be truncated by Google'),
    }),
    defineField({
      name: 'seoDescriptionAr',
      title: 'SEO Description (Arabic)',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Homepage meta description for Arabic. Max 160 chars.',
      validation: (Rule) => Rule.max(160).warning('Longer descriptions may be truncated by Google'),
    }),

    // ── SEO — English ─────────────────────────────────────────────────────────
    defineField({
      name: 'seoTitleEn',
      title: 'SEO Title (English)',
      type: 'string',
      group: 'seo',
      description: 'Homepage meta title for English. Max 60 chars.',
      validation: (Rule) => Rule.max(60).warning('Longer titles may be truncated by Google'),
    }),
    defineField({
      name: 'seoDescriptionEn',
      title: 'SEO Description (English)',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Homepage meta description for English. Max 160 chars.',
      validation: (Rule) => Rule.max(160).warning('Longer descriptions may be truncated by Google'),
    }),

    // ── Social / OG Image ─────────────────────────────────────────────────────
    defineField({
      name: 'seoImage',
      title: 'Default OG / Social Share Image',
      type: 'image',
      group: 'seo',
      description: 'Fallback image used when sharing on social media. 1200×630px recommended.',
      options: { hotspot: true },
    }),

    // ── Analytics & Verification ───────────────────────────────────────────────
    // All fields below are optional. Only fill in the ones you actually use.
    // When you save here, the site automatically updates via webhook — no redeploy needed.
    defineField({
      name: 'gaId',
      title: 'Google Analytics 4 — Measurement ID',
      type: 'string',
      group: 'analytics',
      description: 'Starts with "G-". e.g. G-XXXXXXXXXX. Leave blank if not using GA4.',
      placeholder: 'G-XXXXXXXXXX',
    }),
    defineField({
      name: 'gscVerification',
      title: 'Google Search Console — Verification Code',
      type: 'string',
      group: 'analytics',
      description: 'Only the code value, not the full tag. In GSC → Settings → Ownership Verification → HTML Tag, copy only the content="..." value.',
      placeholder: 'abc123xyz',
    }),
    defineField({
      name: 'bingVerification',
      title: 'Bing Webmaster — Verification Code',
      type: 'string',
      group: 'analytics',
      description: 'Only the code value from the <meta name="msvalidate.01" content="..."> tag.',
      placeholder: 'abc123xyz',
    }),
    defineField({
      name: 'clarityId',
      title: 'Microsoft Clarity — Project ID',
      type: 'string',
      group: 'analytics',
      description: 'Free heatmaps & session recordings. Find your ID in clarity.microsoft.com → Settings.',
      placeholder: 'abcdefghij',
    }),
    defineField({
      name: 'hotjarId',
      title: 'Hotjar — Site ID (Optional)',
      type: 'string',
      group: 'analytics',
      description: 'Alternative to Clarity for heatmaps. Find in Hotjar → Settings → Tracking Code.',
      placeholder: '1234567',
    }),

    // ── Social Links ──────────────────────────────────────────────────────────
    defineField({
      name: 'twitter',
      title: 'Twitter / X Handle',
      type: 'string',
      group: 'social',
      description: 'e.g. @sitename — used in Twitter card meta tags.',
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook Page URL',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'youtube',
      title: 'YouTube Channel URL',
      type: 'url',
      group: 'social',
    }),
  ],
})
