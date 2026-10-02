import { defineType, defineField } from 'sanity'

/**
 * Category Schema — Hierarchical + Bilingual
 *
 * Categories ARE bilingual because the same category (e.g. "Home & Kitchen" / "المنزل والمطبخ")
 * must appear in both /ar/ and /en/ navigation.
 *
 * Categories have separate titleAr/titleEn and slugAr/slugEn.
 * Parent reference enables subcategory nesting (leave empty for top-level).
 */
export const categorySchema = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'titleAr',
      title: 'Arabic Title',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'e.g. المنزل والمطبخ',
    }),
    defineField({
      name: 'titleEn',
      title: 'English Title',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'e.g. Home & Kitchen',
    }),
    defineField({
      name: 'slugAr',
      title: 'Arabic Slug',
      type: 'slug',
      options: { source: 'titleAr', maxLength: 96 },
      validation: (rule) => rule.required(),
      description: 'Auto-generated. Used in /ar/category/[slug] URL.',
    }),
    defineField({
      name: 'slugEn',
      title: 'English Slug',
      type: 'slug',
      options: { source: 'titleEn', maxLength: 96 },
      validation: (rule) => rule.required(),
      description: 'Auto-generated. Used in /en/category/[slug] URL.',
    }),
    defineField({
      name: 'descriptionAr',
      title: 'Arabic Description',
      type: 'text',
      rows: 3,
      description: 'Shown on the Arabic category page. Used as meta description.',
    }),
    defineField({
      name: 'descriptionEn',
      title: 'English Description',
      type: 'text',
      rows: 3,
      description: 'Shown on the English category page. Used as meta description.',
    }),
    defineField({
      name: 'parent',
      title: 'Parent Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description:
        'Leave empty for a top-level category. Set this to make it a subcategory.',
      options: {
        filter: ({ document }: { document: any }) => ({
          filter: '_id != $id',
          params: { id: document._id },
        }),
      },
    }),
    defineField({
      name: 'icon',
      title: 'Icon (emoji)',
      type: 'string',
      description: 'Single emoji to represent this category. e.g. 🏠 🍳 💻',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower number = appears first. Use to control category order in nav/grid.',
    }),
  ],

  preview: {
    select: {
      titleAr: 'titleAr',
      titleEn: 'titleEn',
      parent: 'parent.titleEn',
      icon: 'icon',
    },
    prepare({ titleAr, titleEn, parent, icon }) {
      return {
        title: `${icon ?? ''} ${titleAr} / ${titleEn}`.trim(),
        subtitle: parent ? `↳ Subcategory of: ${parent}` : 'Top-level category',
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
