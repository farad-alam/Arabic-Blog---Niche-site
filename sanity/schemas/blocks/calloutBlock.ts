/**
 * Callout / Notice Block
 * Renders a highlighted box (info, tip, warning, important).
 * Single-language: fill in the article's language.
 */
export const calloutBlockSchema = {
  name: 'calloutBlock',
  title: '💡 Callout / Notice',
  type: 'object',
  fields: [
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: '💡 Tip', value: 'tip' },
          { title: 'ℹ️ Info', value: 'info' },
          { title: '⚠️ Warning', value: 'warning' },
          { title: '🔴 Important', value: 'important' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'info',
    },
    {
      name: 'text',
      title: 'Callout Text',
      type: 'text',
      rows: 2,
      validation: (rule: any) => rule.required(),
    },
  ],
  preview: {
    select: { type: 'type', text: 'text' },
    prepare({ type, text }: { type?: string; text?: string }) {
      const icons: Record<string, string> = {
        tip: '💡',
        info: 'ℹ️',
        warning: '⚠️',
        important: '🔴',
      }
      return {
        title: `${icons[type ?? 'info'] ?? '💡'} ${type?.toUpperCase() ?? 'CALLOUT'}`,
        subtitle: text?.slice(0, 60),
      }
    },
  },
}
