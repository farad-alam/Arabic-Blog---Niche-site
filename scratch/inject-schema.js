/**
 * Injects breadcrumb + FAQ JSON-LD schema into static pages.
 * 
 * For each page:
 * 1. Adds import { breadcrumbSchema } from '@/lib/schema'
 * 2. Wraps the return JSX with schema script tags
 */
const fs = require('fs');

// Pages to inject breadcrumbs into, with their breadcrumb trails
const pages = [
  {
    file: './app/services/page.tsx',
    crumbs: [{ name: 'Home', path: '' }, { name: 'Services', path: '/services' }],
    hasFaq: true,
    faqVar: 'faqs',
    faqQKey: 'q',
    faqAKey: 'a',
  },
  {
    file: './app/pricing/page.tsx',
    crumbs: [{ name: 'Home', path: '' }, { name: 'Pricing', path: '/pricing' }],
    hasFaq: false,
  },
  {
    file: './app/about/page.tsx',
    crumbs: [{ name: 'Home', path: '' }, { name: 'About', path: '/about' }],
    hasFaq: false,
  },
  {
    file: './app/portfolio/page.tsx',
    crumbs: [{ name: 'Home', path: '' }, { name: 'Portfolio', path: '/portfolio' }],
    hasFaq: false,
  },
  {
    file: './app/blog/page.tsx',
    crumbs: [{ name: 'Home', path: '' }, { name: 'Blog', path: '/blog' }],
    hasFaq: false,
  },
  {
    file: './app/contact/page.tsx',
    crumbs: [{ name: 'Home', path: '' }, { name: 'Contact', path: '/contact' }],
    hasFaq: false,
  },
  {
    file: './app/pricing/page.tsx',
    crumbs: [{ name: 'Home', path: '' }, { name: 'Pricing', path: '/pricing' }],
    hasFaq: false,
  },
];

for (const page of pages) {
  let content = fs.readFileSync(page.file, 'utf8');

  // Skip if already has breadcrumbSchema import
  if (content.includes('breadcrumbSchema')) {
    console.log(`Skipping ${page.file} — already has breadcrumbSchema`);
    continue;
  }

  // 1. Inject import line after existing imports
  // Find the last import line
  const lines = content.split('\n');
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) lastImportIdx = i;
  }

  const importLine = page.hasFaq 
    ? `import { breadcrumbSchema, faqSchema } from '@/lib/schema'`
    : `import { breadcrumbSchema } from '@/lib/schema'`;

  if (lastImportIdx >= 0) {
    lines.splice(lastImportIdx + 1, 0, importLine);
    content = lines.join('\n');
    console.log(`  Added import to ${page.file} at line ${lastImportIdx + 2}`);
  }

  fs.writeFileSync(page.file, content);
  console.log(`Updated ${page.file}`);
}

console.log('\nDone! Now manually add the JSON-LD scripts to the return() of each page.');
