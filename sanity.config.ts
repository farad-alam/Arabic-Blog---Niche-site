import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { cloudinaryAssetSourcePlugin, cloudinarySchemaPlugin } from 'sanity-plugin-cloudinary'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  basePath: '/studio',
  name: 'arabic-blog-platform',
  title: 'Blog Studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [
    cloudinaryAssetSourcePlugin(),
    cloudinarySchemaPlugin(),
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // ── Settings ──────────────────────────────────
            S.listItem()
              .title('⚙️ Site Settings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Site Settings')
              ),
            S.divider(),
            // ── Arabic Content ────────────────────────────
            S.listItem()
              .title('🇸🇦 Arabic Posts')
              .child(
                S.documentTypeList('post')
                  .title('Arabic Posts')
                  .filter('_type == "post" && language == "ar"')
              ),
            // ── English Content ───────────────────────────
            S.listItem()
              .title('🇬🇧 English Posts')
              .child(
                S.documentTypeList('post')
                  .title('English Posts')
                  .filter('_type == "post" && language == "en"')
              ),
            S.divider(),
            // ── Taxonomy ──────────────────────────────────
            S.listItem()
              .title('👤 Authors')
              .child(S.documentTypeList('author').title('Authors')),
            S.listItem()
              .title('🏷️ Categories')
              .child(S.documentTypeList('category').title('Categories')),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
})
