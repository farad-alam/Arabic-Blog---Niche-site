/**
 * Pros & Cons Block
 * Renders a green/red two-column layout.
 * Single-language: fill in the article's language.
 */
export const prosConsBlockSchema = {
  name: 'prosConsBlock',
  title: '✅❌ Pros & Cons',
  type: 'object',
  fields: [
    {
      name: 'pros',
      title: 'Pros (✅)',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (rule: any) => rule.min(1),
      description: 'Enter each pro as a separate item.',
    },
    {
      name: 'cons',
      title: 'Cons (❌)',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (rule: any) => rule.min(1),
      description: 'Enter each con as a separate item.',
    },
  ],
  preview: {
    select: { pros: 'pros', cons: 'cons' },
    prepare({ pros, cons }: { pros?: string[]; cons?: string[] }) {
      return {
        title: '✅❌ Pros & Cons',
        subtitle: `${pros?.length ?? 0} pros · ${cons?.length ?? 0} cons`,
      }
    },
  },
}
