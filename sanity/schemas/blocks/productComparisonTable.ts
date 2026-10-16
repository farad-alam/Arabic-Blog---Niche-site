/**
 * Product Comparison Table Block
 * Renders as swipeable cards on mobile, horizontal table on desktop.
 * Single-language: fill fields in the article's language.
 */
export const productComparisonTableSchema = {
  name: 'productComparisonTable',
  title: '📊 Product Comparison Table',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Table Heading',
      type: 'string',
      description: 'e.g. أفضل المنتجات | Top Products',
    },
    {
      name: 'products',
      title: 'Products',
      type: 'array',
      validation: (rule: any) => rule.min(1).max(10),
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Product Name', validation: (r: any) => r.required().error('Comparison Table: every product row needs a Product Name.') },
            { name: 'imageUrl', type: 'url', title: 'Product Image URL' },
            {
              name: 'rating',
              type: 'number',
              title: 'Rating (0–5)',
              validation: (r: any) => r.min(0).max(5),
            },
            {
              name: 'price',
              type: 'string',
              title: 'Price',
              description: 'e.g. ريال 299 or $29.99',
            },
            { name: 'affiliateUrl', type: 'url', title: 'Amazon Affiliate Link' },
            {
              name: 'pros',
              type: 'array',
              title: 'Pros',
              of: [{ type: 'string' }],
            },
            {
              name: 'cons',
              type: 'array',
              title: 'Cons',
              of: [{ type: 'string' }],
            },
            { name: 'asin', type: 'string', title: 'Amazon ASIN (optional)' },
            {
              name: 'verdict',
              type: 'string',
              title: 'Verdict Badge',
              description: 'Free text, e.g. Best Overall · Best Budget · Editor\'s Choice',
            },
          ],
          preview: {
            select: { title: 'name', subtitle: 'price' },
          },
        },
      ],
    },
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }: { heading?: string }) {
      return { title: heading ? `📊 ${heading}` : '📊 Product Comparison Table' }
    },
  },
}
