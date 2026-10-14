import { defineField, defineType } from 'sanity'

/**
 * Homepage FAQ Item — bilingual single document.
 * One document serves both /ar and /en (same pattern as category).
 * Ordered by `order`; rendered in the homepage FAQ accordion.
 */
export const faqItemSchema = defineType({
  name: 'faqItem',
  title: '❓ Homepage FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'questionAr',
      title: 'Question (Arabic)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'questionEn',
      title: 'Question (English)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answerAr',
      title: 'Answer (Arabic)',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answerEn',
      title: 'Answer (English)',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower number = appears first on the homepage FAQ section.',
    }),
  ],
  preview: {
    select: { title: 'questionEn', subtitle: 'questionAr' },
    prepare({ title, subtitle }) {
      return {
        title: title || subtitle || 'FAQ item',
        subtitle: title ? subtitle : undefined,
      }
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
