/**
 * Migration script: Imports all 9 hardcoded portfolio items into Sanity
 * Run: node --env-file=.env.local scratch/migrate-portfolio.js
 */
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

const portfolioItems = [
  {
    _id: 'portfolio-papa-roma',
    _type: 'portfolioProject',
    name: 'Papa Roma Food Engineering',
    slug: { _type: 'slug', current: 'papa-roma' },
    status: 'published',
    industry: 'Restaurant & Hospitality',
    services: ['Web Design', 'Web Development', 'SEO', 'Local SEO'],
    result: 'Multi-menu restaurant site live in under 2 weeks',
    liveUrl: null,
    deliveryDays: 14,
    completedAt: '2024-06-01',
    order: 1,
    challenge: 'Papa Roma had no online presence and no way for new diners to discover their menus before visiting. Their four distinct dining experiences — including Texas-style BBQ, Bengali cuisine, and international flavours — were completely invisible to anyone searching online, and there was no way to make a reservation without calling.',
    solution: 'We built a premium dark-themed restaurant website on Next.js with Framer Motion scroll-parallax animations, four dedicated menu pages, an online reservation form, and a lakeside dining atmosphere conveyed through full-screen food photography. Lenis smooth scroll, Schema.org LocalBusiness markup, and Vercel deployment ensured maximum speed and local SEO visibility.',
    results: [
      'Full 4-menu restaurant website live in under 2 weeks',
      'Page 1 Google ranking for relevant Dhanmondi restaurant searches within 45 days',
      'Online reservation form generating 20+ enquiries per week within 60 days of launch',
      'Google Business Profile impressions up 180% in the first month',
    ],
    metrics: [
      { _type: 'object', _key: 'm1', label: 'Timeline', value: '2 Weeks' },
      { _type: 'object', _key: 'm2', label: 'Google Rank', value: 'Page 1' },
    ],
    testimonial: 'We had zero online presence before MotionBite. Now we rank on Google, diners browse our full menu before visiting, and reservations come through the website every day. Exactly what we needed.',
    clientName: 'Nizhum, Owner — Papa Roma Food Engineering',
    seoKeywords: 'restaurant website design dhaka, food restaurant web development, bangladeshi restaurant website',
  },
  {
    _id: 'portfolio-reach-logic',
    _type: 'portfolioProject',
    name: 'ReachLogic',
    slug: { _type: 'slug', current: 'reach-logic' },
    status: 'published',
    industry: 'Digital Marketing Agency',
    services: ['Web Design', 'Web Development', 'UI/UX Design'],
    result: 'Premium agency site built to Awwwards-tier quality',
    deliveryDays: null,
    completedAt: '2024-07-01',
    order: 2,
    challenge: "ReachLogic was a full-service digital marketing agency offering social media management, paid ads (Facebook, TikTok, Google), and web development — but their website was generic and didn't reflect the premium brand they were building. High-value international clients weren't converting because the site didn't inspire the confidence the services deserved.",
    solution: 'We built a premium agency site targeting Awwwards-tier quality: an interactive canvas particle network in the hero, GSAP ScrollTrigger animations throughout, Lenis smooth scroll, custom Fraunces serif display typography paired with Inter, and a deep teal/forest dark colour palette. Each section was conversion-engineered — from animated stat counters to structured service cards — to move visitors toward a lead form.',
    results: [
      'Complete brand-aligned website delivered at Awwwards / CSS Design Awards quality standard',
      'Bounce rate dropped significantly as scroll animations kept visitors engaged through every section',
      "High-value client enquiries increased — site now matches the agency's premium market positioning",
      "GSAP particle hero made the site a talking point — shared in the agency's own client case studies",
    ],
    metrics: [
      { _type: 'object', _key: 'm1', label: 'Quality', value: 'Awwwards' },
      { _type: 'object', _key: 'm2', label: 'Engagement', value: '+60%' },
    ],
    testimonial: "We sell premium marketing but our old site looked like a free template. MotionBite built something we're genuinely proud to show prospects. The animations and overall craft make exactly the right impression.",
    clientName: 'Founder — ReachLogic Digital Agency',
    seoKeywords: 'digital marketing agency website design, agency portfolio website, premium agency web development',
  },
  {
    _id: 'portfolio-muscle-flex',
    _type: 'portfolioProject',
    name: 'Muscle Flex Gym',
    slug: { _type: 'slug', current: 'muscle-flex' },
    status: 'published',
    industry: 'Fitness & Wellness',
    services: ['Web Design', 'Web Development', 'Local SEO'],
    result: 'Membership sign-ups increased within weeks of launch',
    deliveryDays: null,
    completedAt: '2024-05-01',
    order: 3,
    challenge: 'Muscle Flex Gym was relying entirely on word-of-mouth and walk-in traffic to grow their membership base. They had no website, no way to showcase their facilities, and no online presence to capture people searching for a gym in their area. Potential members were choosing competitors simply because they could find them online.',
    solution: 'We built a high-energy gym website with Framer Motion animations, a facilities showcase with photography, membership plan comparison, trainer profiles, a transformation gallery, class schedule, and a WhatsApp-integrated sign-up CTA. The site was built mobile-first on Next.js with Tailwind CSS and optimised for local gym searches from day one.',
    results: [
      'First professional online presence — gym discoverable on Google within weeks of launch',
      'Membership enquiries through the site within the first month of going live',
      'Facilities and transformation results visible online for the first time — building trust before members walk in',
      'Positive Google Business Profile reviews increased after launch as online credibility grew',
    ],
    metrics: [
      { _type: 'object', _key: 'm1', label: 'Discoverability', value: 'Top 3' },
      { _type: 'object', _key: 'm2', label: 'Enquiries', value: '+300%' },
    ],
    testimonial: 'Before the site, people would drive past our gym and not know what was inside. Now they find us on Google, see our results, and come in ready to sign up. The difference was immediate.',
    clientName: 'Owner — Muscle Flex Gym',
    seoKeywords: 'gym website design, fitness website development, gym membership website',
  },
  {
    _id: 'portfolio-saudi-garej',
    _type: 'portfolioProject',
    name: 'Saudi Garej',
    slug: { _type: 'slug', current: 'saudi-garej' },
    status: 'published',
    industry: 'Automotive Services',
    services: ['Web Design', 'Web Development', 'Bilingual / RTL', 'Local SEO'],
    result: 'WhatsApp leads flowing from day one of launch',
    deliveryDays: null,
    completedAt: '2024-04-01',
    order: 4,
    challenge: 'Saudi Garej (مؤسسة سيارة الحد) was a 24/7 car service garage in Saudi Arabia with no website. Customers had no way to discover their oil change, tyre, battery, and car wash services online. The garage was invisible to the growing number of drivers who search for nearby service centres before calling.',
    solution: 'We built a fully bilingual Arabic/English website with RTL layout support, a WhatsApp-first contact flow, animated service cards for engine oil and workshop services, a special offer section (free car wash with every oil change), product listings for tyres and oils, an image slider for the "Why Us" section, and a hero slider — all with Schema.org markup for local search in Saudi Arabia.',
    results: [
      'Bilingual Arabic/English website reaching both local and expat customers from day one',
      'WhatsApp contact button driving inbound enquiries within days of launch',
      'Free car wash offer featured prominently — reported increase in oil change bookings',
      "Local SEO foundations in place for car service searches in the garage's area",
    ],
    testimonial: 'The website made us look like a proper business. Arabic and English customers both find us on Google now, and the WhatsApp button brings in new customers every day.',
    clientName: 'Owner — مؤسسة سيارة الحد, Saudi Arabia',
    seoKeywords: 'arabic website design, bilingual RTL website, car garage website development saudi arabia',
  },
  {
    _id: 'portfolio-fitlife-bd',
    _type: 'portfolioProject',
    name: 'FitlifeBD',
    slug: { _type: 'slug', current: 'fitlife-bd' },
    status: 'published',
    industry: 'Fitness & Wellness',
    services: ['Web Design', 'Web Development', 'UI/UX Design'],
    result: 'Unified digital hub for a 7-location gym chain',
    deliveryDays: null,
    completedAt: '2024-03-01',
    order: 5,
    challenge: "FitlifeBD had grown to 7 gym locations across Bangladesh with 1,000+ members and 30+ certified trainers over 8 years — but had no unified website. Each branch was marketed separately, prospective members had no central place to explore membership plans, and the gym's track record of body transformations was completely invisible online.",
    solution: 'We built a comprehensive gym website with Framer Motion scroll animations and CountUp stats, service breakdowns across six categories (weight training, cardio, group classes, personal training, nutrition coaching, body transformation), trainer profiles, three membership tiers, a before/after transformation gallery, branch locations map, FAQ, and a contact section — all mobile-first and performance-optimised.',
    results: [
      'All 7 branches unified under one professional website for the first time',
      'Membership enquiries increased as prospective members could browse plans and trainers before visiting',
      'Transformation gallery built social proof online and reduced front-desk sales friction',
      'Trainer profiles and certifications increased trust — new members arrived already knowing who they wanted to train with',
    ],
    testimonial: 'We had 7 gyms and zero online presence. MotionBite built a site that finally matches the quality of our facilities. New members come in already knowing our trainers, our pricing, and what results to expect.',
    clientName: 'Abu Sufian Taj, Founder — FitlifeBD',
    seoKeywords: 'multi-location gym website, gym chain website bangladesh, fitness club web development',
  },
  {
    _id: 'portfolio-pethygene-lab',
    _type: 'portfolioProject',
    name: 'PethyGene Lab',
    slug: { _type: 'slug', current: 'pethygene-lab' },
    status: 'published',
    industry: 'Healthcare & Diagnostics',
    services: ['Web Design', 'Web Development', 'SEO', 'Booking System'],
    result: 'Professional diagnostic lab site with online appointment booking',
    deliveryDays: null,
    completedAt: '2024-02-01',
    order: 6,
    challenge: 'PethyGene Lab was a diagnostic and genetics laboratory with no web presence. Patients and referring physicians could not find information about their test panels, pricing, or how to book appointments online. In a sector where trust is everything, the lack of a professional online presence was directly costing them referrals.',
    solution: 'We built a clean, trust-first laboratory website on Next.js with a services/test panel directory, online appointment booking system, doctor referral portal, blog for health & research content, and a contact section with embedded map. The site was built with healthcare SEO best practices — structured data, fast loading, and clear E-E-A-T signals — to rank for diagnostic searches in their area.',
    results: [
      'Professional website live for the first time — lab now findable on Google',
      'Online appointment booking reducing front-desk call volume',
      'Doctor referral portal streamlining the physician-to-lab workflow',
      'Health blog establishing the lab as an authority in diagnostics and genetic testing',
    ],
    testimonial: 'Our patients kept asking if we had a website. Now we do — and referring doctors can send patients directly from the appointment booking page. MotionBite understood the trust requirements of a healthcare brand and built accordingly.',
    clientName: 'Director — PethyGene Lab',
    seoKeywords: 'healthcare website design, diagnostic lab website, medical website development',
  },
  {
    _id: 'portfolio-omatic-social',
    _type: 'portfolioProject',
    name: 'Omatic Social',
    slug: { _type: 'slug', current: 'omatic-social' },
    status: 'published',
    industry: 'SaaS / Social Media',
    services: ['Full-Stack Development', 'UI/UX Design'],
    result: 'Full social scheduling SaaS shipped with automated publishing',
    deliveryDays: null,
    completedAt: '2024-01-01',
    order: 7,
    challenge: 'The client needed a complete social media content management platform — not just a posting tool, but a full SaaS with Instagram-connected scheduling, calendar-based planning, draft management, and automated cron-job publishing. Existing tools were too expensive or too limited for their target users.',
    solution: "We built a full-stack SaaS on Next.js with TypeScript and Prisma, featuring an Instagram-like post creation UI, a dashboard with calendar view showing scheduled/published/draft/failed post statuses, Instagram account connection, bulk scheduling with per-post date/time control, automated cron-based publishing, and a phone-preview mode that renders posts exactly as they appear on a user's Instagram profile.",
    results: [
      'Complete social media scheduling SaaS built and deployed end-to-end',
      'Automated cron-based publishing running without manual intervention',
      'Calendar dashboard giving users a clear visual of their entire content pipeline',
      'Instagram-accurate phone preview mode reducing post errors before publishing',
    ],
    testimonial: 'Every feature we asked for was built exactly as we described it. The bulk scheduling alone saves our team hours every week. The phone preview is a detail none of the competitors get right.',
    clientName: 'Founder — Omatic Social',
    seoKeywords: 'saas development company, social media scheduling app development, full stack saas development',
  },
  {
    _id: 'portfolio-bismillah-auto',
    _type: 'portfolioProject',
    name: 'Bismillah Auto',
    slug: { _type: 'slug', current: 'bismillah-auto' },
    status: 'published',
    industry: 'Automotive Tech',
    services: ['Web Design', 'Web Development', 'SEO', 'Local SEO'],
    result: 'Page 1 Google ranking for GPS tracker searches within 30 days',
    deliveryDays: null,
    completedAt: '2023-12-01',
    order: 8,
    challenge: 'Bismillah Auto was the local dealer for MotoLock GPS trackers in Chapainawabganj but had zero online visibility. Motorcycle owners searching for GPS tracking and anti-theft protection were finding competitors from other cities instead. Walk-in traffic and word-of-mouth were their only acquisition channels.',
    solution: 'We built a conversion-focused product landing page on Next.js with TypeScript, showcasing the MotoLock GPS tracker with feature breakdowns, real-time tracking and engine-lock capabilities, pricing, and a WhatsApp-first CTA. Schema.org Product markup with star ratings and pricing was implemented for rich Google search results, and the entire site was optimised for local GPS tracker keywords specific to Chapainawabganj.',
    results: [
      'Page 1 Google ranking for "GPS tracker Chapainawabganj" within 30 days of launch',
      'Rich results (star ratings, price) appearing in Google search within 2 weeks',
      'WhatsApp enquiries from the site converting at 35% in the first month',
      'First online sales channel established — no longer reliant solely on walk-in customers',
    ],
    metrics: [
      { _type: 'object', _key: 'm1', label: 'Ranking', value: '30 Days' },
      { _type: 'object', _key: 'm2', label: 'Conversion', value: '35%' },
    ],
    testimonial: 'Before the website, nobody could find us online. Now customers from across Chapainawabganj contact us through the site before even visiting the shop. The Google visibility alone paid for the site in the first month.',
    clientName: 'Owner — Bismillah Auto, Chapainawabganj',
    seoKeywords: 'gps tracker website bangladesh, product landing page development, local seo web design',
  },
  {
    _id: 'portfolio-baitullah-musafir',
    _type: 'portfolioProject',
    name: 'Baitullah Musafir',
    slug: { _type: 'slug', current: 'baitullah-musafir' },
    status: 'published',
    industry: 'Travel & Pilgrimage',
    services: ['Web Design', 'Web Development', 'SEO'],
    result: 'Hajj enquiries doubled in the first season after launch',
    deliveryDays: 21,
    completedAt: '2023-11-01',
    order: 9,
    challenge: "Baitullah Musafir was a Hajj & Umrah travel agency with no digital presence. Prospective pilgrims searching online for Hajj packages from Bangladesh couldn't find them. With three package tiers and years of experience, the agency had no way to showcase its value or provide pre-departure guidance to registered pilgrims.",
    solution: "We built a complete Bengali-language Hajj travel website on Next.js with animated package cards across three tiers (Economy ৳5.5L, Standard ৳6.75L, VIP ৳8.5L), a comprehensive Hajj guide, step-by-step training pages, duas sections, a dedicated women's guide, downloadable documents, FAQ, and a WhatsApp-integrated contact form — all with Framer Motion animations for a polished, trustworthy feel.",
    results: [
      'Complete 12-page Hajj agency website built and deployed within 3 weeks',
      'All three package tiers presented clearly with pricing — removing the need for an initial sales call',
      'Pilgrims can now access Hajj guides, duas, and training materials directly on the site',
      'WhatsApp enquiries from the site doubled package sign-ups in the first Hajj season',
    ],
    metrics: [
      { _type: 'object', _key: 'm1', label: 'Pages Built', value: '12' },
      { _type: 'object', _key: 'm2', label: 'Enquiries', value: '2×' },
    ],
    testimonial: 'Families research Hajj for months before booking. Having a professional site with our packages, guides, and duas built their trust before they even contacted us. Our enquiries doubled in the first season.',
    clientName: 'Management Team — Baitullah Musafir',
    seoKeywords: 'hajj umrah agency website bangladesh, travel agency web design bengali, pilgrimage website development',
  },
]

async function migrate() {
  console.log(`Migrating ${portfolioItems.length} portfolio projects to Sanity...`)
  let success = 0
  let failed = 0

  for (const item of portfolioItems) {
    try {
      // Remove null values from item
      const cleaned = Object.fromEntries(Object.entries(item).filter(([, v]) => v !== null))
      await client.createOrReplace(cleaned)
      console.log(`✅ ${item.name}`)
      success++
    } catch (err) {
      console.error(`❌ Failed: ${item.name}`, err.message)
      failed++
    }
  }

  console.log(`\n🎉 Migration complete! ${success} succeeded, ${failed} failed.`)
  if (success > 0) {
    console.log('\n⚠️  IMPORTANT: You still need to upload thumbnail images manually in Sanity Studio.')
    console.log('   Go to /studio → Portfolio Projects → each project → upload the thumbnail.')
    console.log('   The images are currently in: /public/images/portfolio/')
  }
}

migrate()
