/**
 * FAQ Block
 * Renders as an accessible accordion. Each item auto-generates FAQPage JSON-LD.
 * Single-language: fill in the article's language.
 */
export const faqBlockSchema = {
  name: 'faqBlock',
  title: '❓ FAQ Block',
  type: 'object',
  fields: [
    {
      name: 'items',
      title: 'FAQ Items',
      type: 'array',
      validation: (rule: any) => rule.min(1),
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (rule: any) => rule.required(),
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 3,
              validation: (rule: any) => rule.required(),
            },
          ],
          preview: {
            select: { title: 'question' },
          },
        },
      ],
    },
  ],
  preview: {
    select: { items: 'items' },
    prepare({ items }: { items?: unknown[] }) {
      return {
        title: '❓ FAQ Block',
        subtitle: `${items?.length ?? 0} questions`,
      }
    },
  },
}
