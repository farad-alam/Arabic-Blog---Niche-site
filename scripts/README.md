# Bulk Publishing Scripts

## bulk-import.ts

Imports 100–300 articles from a JSON file into Sanity.

### Prerequisites

```bash
npm install tsx dotenv
```

Make sure you have `SANITY_WRITE_TOKEN` in your `.env.local`.

### Usage

```bash
npx tsx scripts/bulk-import.ts --file=articles.json
```

### Input JSON Format

Create a JSON file with an array of articles:

```json
[
  {
    "title": "أفضل مكنسة روبوت 2026",
    "slug": "افضل-مكنسة-روبوت-2026",
    "language": "ar",
    "excerpt": "مراجعة شاملة لأفضل مكانس الروبوت في السعودية لعام 2026 مع مقارنة الأسعار والمميزات.",
    "body": "الفقرة الأولى هنا.\n\nالفقرة الثانية هنا.\n\nالفقرة الثالثة هنا.",
    "categorySlug": "منزل-ومطبخ",
    "authorSlug": "admin",
    "publishedAt": "2026-09-30T00:00:00Z",
    "mainImageUrl": "https://images.unsplash.com/photo-xxx",
    "keywords": ["مكنسة روبوت", "روبوت تنظيف 2026"],
    "articleType": "review",
    "affiliateDisclosure": true
  }
]
```

### Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✅ | Article title in the article's language |
| `slug` | ✅ | URL slug. Arabic: `افضل-مكنسة-روبوت`. English: `best-robot-vacuum` |
| `language` | ✅ | `"ar"` or `"en"` |
| `excerpt` | ✅ | Short description, max 160 chars |
| `body` | ✅ | Article body. Separate paragraphs with double newlines (`\n\n`) |
| `categorySlug` | ✅ | Must match an existing category slug in Sanity |
| `publishedAt` | ✅ | ISO 8601 date string |
| `authorSlug` | ❌ | Defaults to `"admin"` if not set |
| `mainImageUrl` | ❌ | Direct URL to image (Unsplash, Pexels, etc.) |
| `keywords` | ❌ | Array of target keywords |
| `articleType` | ❌ | One of: `review`, `comparison`, `howto`, `listicle`, `informational`, `news` |
| `affiliateDisclosure` | ❌ | `true` to show affiliate disclosure. Default: `false` |
| `overallRating` | ❌ | Number 1-5 for review articles |

### Tips for Arabic Slugs

Arabic slugs can contain Arabic characters. Example:
- Title: `أفضل مكنسة روبوت 2026`
- Slug: `افضل-مكنسة-روبوت-2026`

Remove diacritics (tashkeel) from slugs. Use hyphens between words.

### Rate Limits

- Free Sanity tier: ~200K API requests/month
- The script processes 20 articles per batch with 100ms delay between batches
- For 300 articles/day: ~15 batches × 300 days = 4,500 batch calls/month — well within free tier
- API overhead: each article = ~3 API calls (category lookup cache, author lookup cache, mutate)

### After Import

The Sanity webhook automatically triggers revalidation at `/api/revalidate` for each new post.
New pages go live on Vercel within seconds of import completion.
