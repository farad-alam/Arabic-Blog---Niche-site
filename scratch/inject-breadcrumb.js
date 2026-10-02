/**
 * Safely injects breadcrumb JSON-LD into static Next.js pages.
 * Works with both CRLF and LF line endings.
 */
const fs = require('fs');

const BASE = 'https://www.motionbite.com';

function buildBreadcrumb(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${BASE}${c.path}`,
    })),
  };
}

const pages = [
  {
    file: './app/services/page.tsx',
    crumbs: [{ name: 'Home', path: '' }, { name: 'Services', path: '/services' }],
  },
  {
    file: './app/pricing/page.tsx',
    crumbs: [{ name: 'Home', path: '' }, { name: 'Pricing', path: '/pricing' }],
  },
  {
    file: './app/about/page.tsx',
    crumbs: [{ name: 'Home', path: '' }, { name: 'About Us', path: '/about' }],
  },
  {
    file: './app/portfolio/page.tsx',
    crumbs: [{ name: 'Home', path: '' }, { name: 'Portfolio', path: '/portfolio' }],
  },
  {
    file: './app/blog/page.tsx',
    crumbs: [{ name: 'Home', path: '' }, { name: 'Blog', path: '/blog' }],
  },
  {
    file: './app/contact/page.tsx',
    crumbs: [{ name: 'Home', path: '' }, { name: 'Contact', path: '/contact' }],
  },
];

for (const page of pages) {
  let raw = fs.readFileSync(page.file, 'utf8');

  // Normalize to LF so string ops work predictably
  let content = raw.replace(/\r\n/g, '\n');

  if (content.includes('breadcrumbSchema') || content.includes('BreadcrumbList')) {
    console.log(`Skipping ${page.file} — already has breadcrumb`);
    continue;
  }

  const schema = JSON.stringify(buildBreadcrumb(page.crumbs));
  const scriptTag = `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: \`${schema}\` }} />`;

  // Strategy: find the first `export default function` and inject the script
  // just after the first opening JSX `<div` or `<>` in the return().
  // We do this by finding `return (\n` and inserting after the next opening tag line.
  
  // Find "export default function" to locate the function
  const exportIdx = content.indexOf('export default function');
  if (exportIdx === -1) {
    console.error(`Could not find export default function in ${page.file}`);
    continue;
  }
  
  // Find "return (" after the export
  const returnIdx = content.indexOf('return (', exportIdx);
  if (returnIdx === -1) {
    console.error(`Could not find return ( in ${page.file}`);
    continue;
  }
  
  // Find first JSX opening tag line after return
  const afterReturn = content.indexOf('\n', returnIdx) + 1;
  const firstTagLine = content.indexOf('\n', afterReturn) + 1;

  // Insert script tag after the first tag line
  const insertPos = firstTagLine;
  
  // Find what the first tag line looks like (for indentation reference)
  const snippet = content.slice(afterReturn, firstTagLine);
  const indent = snippet.match(/^(\s*)/)?.[1] ?? '      ';
  
  const injection = `${indent}${scriptTag}\n`;
  
  content = content.slice(0, insertPos) + injection + content.slice(insertPos);

  // Restore CRLF for Windows
  content = content.replace(/\n/g, '\r\n');
  fs.writeFileSync(page.file, content);
  console.log(`✓ Injected breadcrumb into ${page.file}`);
}

console.log('\nAll done!');
