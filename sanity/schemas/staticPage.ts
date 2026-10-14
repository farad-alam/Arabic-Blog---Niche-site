import { defineField, defineType } from 'sanity'

/**
 * Static Page — About / Privacy / Terms / Affiliate Disclosure.
 * One document per page key; bilingual fields serve /ar and /en routes.
 * Sections are structured (heading + paragraphs) to match the info-page layout.
 */
export const staticPageSchema = defineType({
  name: 'staticPage',
  title: '📄 Static Page',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'Page Key',
      type: 'string',
      options: {
        list: [
          { title: 'About', value: 'about' },
          { title: 'Privacy Policy', value: 'privacy' },
          { title: 'Terms of Use', value: 'terms' },
          { title: 'Affiliate Disclosure', value: 'disclosure' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
      description: 'Determines the route: /[locale]/[key]. Use each key only once.',
    }),
    defineField({
      name: 'titleAr',
      title: 'Title (Arabic)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'titleEn',
      title: 'Title (English)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'descriptionAr', title: 'Meta Description (Arabic)', type: 'text', rows: 2 }),
    defineField({ name: 'descriptionEn', title: 'Meta Description (English)', type: 'text', rows: 2 }),
    defineField({
      name: 'introAr',
      title: 'Intro (Arabic)',
      type: 'text',
      rows: 3,
      description: 'Shown under the page title in the header block.',
    }),
    defineField({ name: 'introEn', title: 'Intro (English)', type: 'text', rows: 3 }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      description: 'Body sections: heading + paragraphs, rendered in order.',
      of: [
        {
          type: 'object',
          name: 'staticPageSection',
          fields: [
            defineField({
              name: 'headingAr',
              title: 'Heading (Arabic)',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'headingEn',
              title: 'Heading (English)',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'paragraphsAr',
              title: 'Paragraphs (Arabic)',
              type: 'array',
              of: [{ type: 'text' }],
              validation: (rule) => rule.min(1),
            }),
            defineField({
              name: 'paragraphsEn',
              title: 'Paragraphs (English)',
              type: 'array',
              of: [{ type: 'text' }],
              validation: (rule) => rule.min(1),
            }),
          ],
          preview: {
            select: { title: 'headingEn', subtitle: 'headingAr' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'titleEn', subtitle: 'key', media: 'titleAr' },
    prepare({ title, subtitle }) {
      return { title: title || 'Static page', subtitle: subtitle ? `/${subtitle}` : undefined }
    },
  },
})
