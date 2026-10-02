import { defineType, defineField } from 'sanity'

export const authorSchema = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    // ── English / Latin Name (required) ──────────────────────────────────────
    defineField({
      name: 'firstName',
      title: 'First Name (English)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name (English)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    // ── Arabic Name (optional) ────────────────────────────────────────────────
    defineField({
      name: 'firstNameAr',
      title: 'First Name (Arabic)',
      type: 'string',
      description: 'e.g. محمد — displayed on Arabic articles',
    }),
    defineField({
      name: 'lastNameAr',
      title: 'Last Name (Arabic)',
      type: 'string',
      description: 'e.g. الأحمد — displayed on Arabic articles',
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Used for the /[locale]/authors/[slug] page URL. Click Generate.',
      options: {
        source: (doc: Record<string, unknown>) => {
          const firstName = (doc.firstName as string) ?? ''
          const lastName = (doc.lastName as string) ?? ''
          return `${firstName} ${lastName}`.trim()
        },
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar / Profile Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Square headshot, min 400×400px.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    // ── Job Title ─────────────────────────────────────────────────────────────
    defineField({
      name: 'jobTitle',
      title: 'Job Title (English)',
      type: 'string',
      description: 'e.g. Senior Tech Writer',
    }),
    defineField({
      name: 'jobTitleAr',
      title: 'Job Title (Arabic)',
      type: 'string',
      description: 'e.g. كاتب تقني أول — shown on Arabic article author boxes',
    }),

    // ── Short Bio ─────────────────────────────────────────────────────────────
    defineField({
      name: 'shortBio',
      title: 'Short Bio (English)',
      type: 'text',
      rows: 3,
      description: 'Shown inline on English articles. Max 200 chars.',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'shortBioAr',
      title: 'Short Bio (Arabic)',
      type: 'text',
      rows: 3,
      description: 'Shown inline on Arabic articles. Max 200 chars.',
      validation: (rule) => rule.max(200),
    }),

    // ── Full Bio ──────────────────────────────────────────────────────────────
    defineField({
      name: 'fullBio',
      title: 'Full Bio (English)',
      type: 'array',
      description: 'Rich text bio for the /authors/[slug] profile page.',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'string', title: 'URL' },
                  { name: 'blank', type: 'boolean', title: 'Open in new tab', initialValue: true },
                ],
              },
            ],
          },
        },
      ],
    }),

    // ── Expertise & Experience ─────────────────────────────────────────────────
    defineField({
      name: 'expertiseAreas',
      title: 'Expertise Areas',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Topics this author is authoritative on. Used in JSON-LD knowsAbout.',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'yearsExperience',
      title: 'Years of Experience',
      type: 'number',
    }),

    // ── Social Links ──────────────────────────────────────────────────────────
    defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
    defineField({ name: 'twitter', title: 'X / Twitter URL', type: 'url' }),
    defineField({ name: 'website', title: 'Personal Website URL', type: 'url' }),
  ],

  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      firstNameAr: 'firstNameAr',
      lastNameAr: 'lastNameAr',
      media: 'avatar',
      subtitle: 'jobTitle',
    },
    prepare({ firstName, lastName, firstNameAr, lastNameAr, media, subtitle }: Record<string, string>) {
      const enName = `${firstName ?? ''} ${lastName ?? ''}`.trim()
      const arName = firstNameAr ? `${firstNameAr} ${lastNameAr ?? ''}`.trim() : ''
      return {
        title: arName ? `${enName} (${arName})` : enName,
        subtitle,
        media,
      }
    },
  },
})
