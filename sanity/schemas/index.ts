import { postSchema } from './post'
import { categorySchema } from './category'
import { authorSchema } from './author'
import { siteSettingsSchema } from './siteSettings'
import { productComparisonTableSchema } from './blocks/productComparisonTable'
import { amazonProductCardSchema } from './blocks/amazonProductCard'
import { prosConsBlockSchema } from './blocks/prosConsBlock'
import { faqBlockSchema } from './blocks/faqBlock'
import { calloutBlockSchema } from './blocks/calloutBlock'

export const schemaTypes = [
  // Documents
  siteSettingsSchema,
  postSchema,
  authorSchema,
  categorySchema,
  // Custom Portable Text block objects
  productComparisonTableSchema,
  amazonProductCardSchema,
  prosConsBlockSchema,
  faqBlockSchema,
  calloutBlockSchema,
]
