/**
 * Amazon Product Card Block
 * Renders a prominent buy-box style card with product image, rating, price, and affiliate CTA.
 * Single-language: fill in the article's language.
 */
export const amazonProductCardSchema = {
  name: 'amazonProductCard',
  title: '🛒 Amazon Product Card',
  type: 'object',
  fields: [
    {
      name: 'asin',
      title: 'Amazon ASIN',
      type: 'string',
      description: '10-character Amazon product ID. Found in the product URL: /dp/ASIN/',
    },
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (rule: any) => rule.required(),
    },
    {
      name: 'imageUrl',
      title: 'Product Image URL',
      type: 'url',
      description: 'Use the Amazon product image URL or any direct image link.',
    },
    {
      name: 'rating',
      title: 'Rating (0–5)',
      type: 'number',
      validation: (rule: any) => rule.min(0).max(5),
    },
    {
      name: 'reviewCount',
      title: 'Number of Reviews',
      type: 'number',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'e.g. ريال 299 or $29.99 — update manually when price changes.',
    },
    {
      name: 'affiliateUrl',
      title: 'Affiliate Link',
      type: 'url',
      description:
        'Full Amazon URL with your affiliate tag. e.g. https://www.amazon.sa/dp/ASIN?tag=your-tag-21',
      validation: (rule: any) => rule.required(),
    },
    {
      name: 'badge',
      title: 'Badge',
      type: 'string',
      description: 'e.g. الأفضل مبيعاً | Best Seller | اختيار المحررين | Editor\'s Choice',
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'price' },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: title ? `🛒 ${title}` : '🛒 Amazon Product Card', subtitle }
    },
  },
}
