import { defineField, defineType } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    // ── Site Name ──────────────────────────────────────────────────────────────
    defineField({
      name: 'siteNameAr',
      title: 'Site Name (Arabic)',
      type: 'string',
      description: 'e.g. موقع المنزل والمطبخ',
    }),
    defineField({
      name: 'siteNameEn',
      title: 'Site Name (English)',
      type: 'string',
      description: 'e.g. Home & Kitchen Guide',
    }),

    // ── SEO — Arabic ─────────────────────────────────────────────────────────
    defineField({
      name: 'seoTitleAr',
      title: 'SEO Title (Arabic)',
      type: 'string',
      description: 'Homepage meta title for Arabic. Max 60 chars.',
      validation: (Rule) => Rule.max(60).warning('Longer titles may be truncated by Google'),
    }),
    defineField({
      name: 'seoDescriptionAr',
      title: 'SEO Description (Arabic)',
      type: 'text',
      rows: 3,
      description: 'Homepage meta description for Arabic. Max 160 chars.',
      validation: (Rule) => Rule.max(160).warning('Longer descriptions may be truncated by Google'),
    }),

    // ── SEO — English ─────────────────────────────────────────────────────────
    defineField({
      name: 'seoTitleEn',
      title: 'SEO Title (English)',
      type: 'string',
      description: 'Homepage meta title for English. Max 60 chars.',
      validation: (Rule) => Rule.max(60).warning('Longer titles may be truncated by Google'),
    }),
    defineField({
      name: 'seoDescriptionEn',
      title: 'SEO Description (English)',
      type: 'text',
      rows: 3,
      description: 'Homepage meta description for English. Max 160 chars.',
      validation: (Rule) => Rule.max(160).warning('Longer descriptions may be truncated by Google'),
    }),

    // ── Social / OG Image ─────────────────────────────────────────────────────
    defineField({
      name: 'seoImage',
      title: 'Default OG / Social Share Image',
      type: 'image',
      description: 'Fallback image used when sharing on social media. 1200×630px recommended.',
      options: { hotspot: true },
    }),

    // ── Social Links ──────────────────────────────────────────────────────────
    defineField({
      name: 'twitter',
      title: 'Twitter / X Handle',
      type: 'string',
      description: 'e.g. @sitename — used in Twitter card meta tags.',
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook Page URL',
      type: 'url',
    }),
  ],
})
