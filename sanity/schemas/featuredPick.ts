import { defineField, defineType } from 'sanity'

/**
 * Featured Pick — bilingual "Top 3" homepage ribbon card.
 * One document serves both locales; link each side to its own article via
 * postRefAr / postRefEn (posts are single-language documents).
 */
export const featuredPickSchema = defineType({
  name: 'featuredPick',
  title: '⭐ Top Pick',
  type: 'document',
  fields: [
    defineField({
      name: 'badgeAr',
      title: 'Badge (Arabic)',
      type: 'string',
      description: 'Short label on the colored pill. e.g. 🥇 الأفضل على الإطلاق',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'badgeEn',
      title: 'Badge (English)',
      type: 'string',
      description: 'e.g. 🥇 Best Overall',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'badgeColor',
      title: 'Badge Color',
      type: 'string',
      options: {
        list: [
          { title: 'Gold', value: 'amber' },
          { title: 'Green', value: 'emerald' },
          { title: 'Purple', value: 'purple' },
          { title: 'Blue', value: 'blue' },
          { title: 'Rose', value: 'rose' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'amber',
    }),
    defineField({
      name: 'titleAr',
      title: 'Product Title (Arabic)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'titleEn',
      title: 'Product Title (English)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'specsAr',
      title: 'Specs Line (Arabic)',
      type: 'string',
      description: 'One short line of key specs. e.g. قوة شفط 16,000 باسكال • وزن 800 جم',
    }),
    defineField({ name: 'specsEn', title: 'Specs Line (English)', type: 'string' }),
    defineField({ name: 'verdictAr', title: 'Verdict (Arabic)', type: 'text', rows: 2 }),
    defineField({ name: 'verdictEn', title: 'Verdict (English)', type: 'text', rows: 2 }),
    defineField({
      name: 'rating',
      title: 'Rating (0–5)',
      type: 'number',
      validation: (rule) => rule.min(0).max(5),
    }),
    defineField({
      name: 'postRefAr',
      title: 'Linked Article (Arabic)',
      type: 'reference',
      to: [{ type: 'post' }],
      options: { filter: 'language == "ar"' },
      description: 'Arabic review article this pick links to.',
    }),
    defineField({
      name: 'postRefEn',
      title: 'Linked Article (English)',
      type: 'reference',
      to: [{ type: 'post' }],
      options: { filter: 'language == "en"' },
      description: 'English review article this pick links to.',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower number = appears first (leftmost on desktop).',
    }),
  ],
  preview: {
    select: { title: 'titleEn', subtitle: 'badgeEn' },
    prepare({ title, subtitle }) {
      return { title: title ? `⭐ ${title}` : '⭐ Top Pick', subtitle }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
