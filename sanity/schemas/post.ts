import { defineType, defineField } from 'sanity'

/**
 * Post Schema — Single Language Per Document
 *
 * Each article is written in ONE language (ar OR en).
 * The `language` field determines which locale route the article appears under:
 *   Arabic → /ar/[slug]
 *   English → /en/[slug]
 *
 * Two separate articles on the same topic in different languages
 * are linked via the optional `translation` reference field.
 */
export const postSchema = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  groups: [
    { name: 'content', title: '📝 Content', default: true },
    { name: 'seo', title: '🔍 SEO' },
    { name: 'affiliate', title: '🛍️ Affiliate' },
  ],
  fields: [
    // ── LANGUAGE ────────────────────────────────────────────────────────────
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: '🇸🇦 Arabic (العربية)', value: 'ar' },
          { title: '🇬🇧 English', value: 'en' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required(),
      description:
        'The language of this article. Determines the URL prefix: /ar/slug or /en/slug.',
    }),

    // ── CONTENT ──────────────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(100),
      description:
        'Arabic example: أفضل مكنسة روبوت 2026 | English example: Best Robot Vacuum 2026',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      description:
        'Arabic slug: افضل-مكنسة-روبوت-2026 | English slug: best-robot-vacuum-2026. Click Generate.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt / Meta Description',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Shown in article listings and used as meta description. Keep under 160 chars.',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'mainImage',
      title: 'Cover Image',
      type: 'object',
      group: 'content',
      fields: [
        defineField({
          name: 'asset',
          title: 'Upload via Cloudinary',
          type: 'cloudinary.asset',
          description: 'Use for niche affiliate sites with quality images.',
        }),
        defineField({
          name: 'externalUrl',
          title: 'External Image URL',
          type: 'url',
          description: 'Use for bulk publishing — paste a Unsplash/Pexels URL here instead of uploading.',
        }),
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the image for accessibility and Google Image Search.',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Article Body',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'string',
                    title: 'URL',
                    validation: (rule: any) => rule.required(),
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: true,
                  },
                  {
                    name: 'nofollow',
                    type: 'boolean',
                    title: 'rel="nofollow" (for affiliate links)',
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              validation: (rule: any) => rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption (optional)',
            },
          ],
        },
        { type: 'productComparisonTable' },
        { type: 'amazonProductCard' },
        { type: 'prosConsBlock' },
        { type: 'faqBlock' },
        { type: 'calloutBlock' },
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated At',
      type: 'datetime',
      group: 'content',
      description: 'Update when making significant edits — improves Google freshness signal.',
    }),
    defineField({
      name: 'articleType',
      title: 'Article Type',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: '⭐ Review', value: 'review' },
          { title: '⚖️ Comparison', value: 'comparison' },
          { title: '📋 How-To', value: 'howto' },
          { title: '📝 Listicle', value: 'listicle' },
          { title: 'ℹ️ Informational', value: 'informational' },
          { title: '📰 News', value: 'news' },
        ],
      },
      description: 'Affects Schema.org type and UI display. Choose the closest match.',
    }),
    defineField({
      name: 'translation',
      title: 'Translation (other language)',
      type: 'reference',
      to: [{ type: 'post' }],
      group: 'content',
      description:
        'If this same topic exists as a separate article in the other language, link it here. This generates hreflang SEO tags connecting the two.',
      options: {
        filter: ({ document }: { document: any }) => ({
          filter: 'language != $lang',
          params: { lang: document.language },
        }),
      },
    }),

    // ── SEO ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'seoTitle',
      title: 'SEO Title (override)',
      type: 'string',
      group: 'seo',
      description: 'Leave blank to use the article title. Max 60 chars for Google.',
      validation: (rule) => rule.max(60).warning('Longer titles may be truncated by Google.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description (override)',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'Leave blank to use the excerpt. Max 160 chars.',
      validation: (rule) => rule.max(160).warning('Longer descriptions may be truncated by Google.'),
    }),
    defineField({
      name: 'keywords',
      title: 'Target Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'seo',
      options: { layout: 'tags' },
      description: 'Primary and secondary keywords. Used in meta keywords and JSON-LD.',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Custom Canonical URL',
      type: 'url',
      group: 'seo',
      description:
        'Only set if cross-posting from elsewhere. Leave blank for the default /{locale}/{slug} canonical.',
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index (hide from search)',
      type: 'boolean',
      group: 'seo',
      initialValue: false,
      description: 'Enable to prevent this article from appearing in search results.',
    }),

    // ── AFFILIATE ─────────────────────────────────────────────────────────────
    defineField({
      name: 'affiliateDisclosure',
      title: 'Show Affiliate Disclosure',
      type: 'boolean',
      group: 'affiliate',
      initialValue: false,
      description:
        'Auto-injects an affiliate disclosure notice at the top of the article.',
    }),
    defineField({
      name: 'overallRating',
      title: 'Overall Product Rating (1–5)',
      type: 'number',
      group: 'affiliate',
      validation: (rule) => rule.min(1).max(5),
      description: 'Used for star rating display and Product schema. Only set for review articles.',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      language: 'language',
      media: 'mainImage.asset',
      date: 'publishedAt',
      category: 'category.titleAr',
    },
    prepare({ title, language, media, date, category }) {
      const flag = language === 'ar' ? '🇸🇦' : '🇬🇧'
      return {
        title: `${flag} ${title ?? 'Untitled'}`,
        subtitle: [category, date ? new Date(date).toLocaleDateString() : 'Draft']
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },

  orderings: [
    {
      title: 'Published (newest first)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Language',
      name: 'languageAsc',
      by: [{ field: 'language', direction: 'asc' }],
    },
  ],
})
