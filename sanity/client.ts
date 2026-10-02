import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-08-01',
  useCdn: false, // Set to false so we bypass Sanity's cache since Next.js handles caching
})

// Server-side client with write token — used ONLY in server actions/API routes
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-08-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})
