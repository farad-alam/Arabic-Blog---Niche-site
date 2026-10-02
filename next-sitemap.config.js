/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://example.com',
  generateRobotsTxt: false, // We use app/robots.ts instead
  exclude: ['/studio', '/studio/*', '/api/*'],
}
