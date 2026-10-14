/**
 * One-time CMS seed script.
 *
 * Migrates the previously-hardcoded homepage FAQ, Top Picks, static pages,
 * and Site Settings section copy into Sanity, so the whole site is driven
 * from the CMS. Safe to re-run: existing documents (matched by slug/key)
 * are updated in place, not duplicated.
 *
 * Usage:
 *   npx tsx scripts/seed-cms.ts
 *
 * Prerequisites:
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN set in .env
 *   - The new schema (faqItem, featuredPick, staticPage) deployed with the Studio
 */

import { createClient } from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// ─────────────────────────────────────────────────────────────────────────────
// FAQ items (from the old hardcoded HomeFaq component)
// ─────────────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    key: 'faq-suction-pa',
    order: 1,
    questionAr: 'كم قوة الشفط (باسكال) التي أحتاجها لكنس الرمال الدقيقة في سيارتي؟',
    questionEn: 'What suction power (Pa) do I need for fine sand and deep cleaning?',
    answerAr:
      'لتنظيف الغبار الخفيف وسطح المقاعد، تكفيك قوة 4,000 إلى 6,000 باسكال (Pa). أما إذا كانت سيارتك تتعرض لرمال الصحراء المتغلغلة في موكيت الأرضيات وأسفل المقاعد، فنوصي باختيار مكنسة بقوة شفط لا تقل عن 10,000 إلى 15,000 باسكال مع رأس فرك مخصص لتحريك حبيبات الرمل العالقة.',
    answerEn:
      'For light surface dust and dashboard touch-ups, 4,000 to 6,000 Pascals (Pa) is sufficient. For desert sand embedded deep into floor mats, we strongly recommend a vacuum with at least 10,000 to 15,000 Pa paired with a stiff bristle brush attachment.',
  },
  {
    key: 'faq-cordless-vs-corded',
    order: 2,
    questionAr: 'أيهما أفضل: مكنسة السيارة اللاسلكية أم السلكية بمدخل الولاعة 12V؟',
    questionEn: 'Which is better: Cordless rechargeable or 12V cigarette lighter corded?',
    answerAr:
      'المكانس اللاسلكية توفر حرية حركة كاملة وسهولة فائقة في الوصول إلى فتحات المكيف وجيوب الأبواب دون التقيد بسلك، وهي مثالية للتنظيف الأسبوعي السريع. بالمقابل، تتميز المكانس السلكية (12V) باستمرارية التشغيل دون القلق من نفاد شحن البطارية، وهي الخيار الأنسب للسيارات الكبيرة والعائلية.',
    answerEn:
      'Cordless models offer unmatched portability and maneuverability around tight AC vents and door pockets without tripping over wires. 12V corded models offer continuous, unlimited runtime, making them great for heavy-duty detailing of larger SUVs.',
  },
  {
    key: 'faq-summer-heat',
    order: 3,
    questionAr: 'هل ترك المكنسة اللاسلكية داخل السيارة آمن في حرارة الصيف بالسعودية؟',
    questionEn: 'Is it safe to store cordless vacuums inside cars during Saudi summer heat?',
    answerAr:
      'لا نوصي أبداً بترك أي أجهزة تعمل ببطاريات الليثيوم-أيون داخل مقصورة السيارة المغلقة تحت أشعة الشمس المباشرة خلال فصل الصيف، حيث قد تتجاوز درجات الحرارة داخل السيارة 60 درجة مئوية. يُفضل دائماً الاحتفاظ بالمكنسة في المنزل أو المكتب وأخذها للسيارة عند الحاجة فقط.',
    answerEn:
      'We strongly advise against leaving any lithium-ion battery appliances inside parked vehicles in direct sunlight during summer, as interior cabin temperatures can exceed 60°C. Keep your vacuum indoors and bring it out when ready to clean.',
  },
  {
    key: 'faq-testing-method',
    order: 4,
    questionAr: 'كيف نختبر ونقيم مكانس السيارات في كار كلين السعودية؟',
    questionEn: 'How does CarClean KSA test and rate car vacuums?',
    answerAr:
      'نقوم بتقييم المكانس بناءً على 5 معايير رئيسية: قوة الشفط الفعلية المقاسة بأجهزة الضغط (وليس الأرقام الترويجية فقط)، عمر البطارية الفعلي وسرعة شحنها، كفاءة فلاتر HEPA وسهولة غسلها، الملحقات المرفقة، ومدى توفر قطع الغيار وضمان الوكيل في المملكة العربية السعودية.',
    answerEn:
      'We rate models across 5 strict benchmarks: real suction pressure, sustained battery runtime, filtration efficiency (washable HEPA filters), ergonomics/crevice attachments, and local Saudi warranty availability.',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Featured picks (from the old hardcoded TopPicksRibbon component)
// ─────────────────────────────────────────────────────────────────────────────

const FEATURED_PICKS = [
  {
    key: 'pick-eufy-h30',
    order: 1,
    badgeColor: 'amber',
    badgeAr: '🥇 الأفضل على الإطلاق',
    badgeEn: '🥇 Best Overall',
    titleAr: 'مكنسة يوفي المحمولة HomeVac H30',
    titleEn: 'eufy HomeVac H30 Cordless Handheld',
    specsAr: 'قوة شفط 16,000 باسكال • وزن 800 جم • بطارية 20 دقيقة',
    specsEn: '16kPa Suction • 800g Weight • 20min Battery',
    verdictAr: 'أقوى توازن بين الشفط الفعلي وسهولة الوصول للأماكن الضيقة بالسيارة.',
    verdictEn: 'Best balance of high suction power and tight interior accessibility.',
    rating: 4.8,
    slugAr: 'cordless-car-vacuum',
    slugEn: 'cordless-car-vacuum',
  },
  {
    key: 'pick-baseus-a2',
    order: 2,
    badgeColor: 'emerald',
    badgeAr: '💰 الأفضل قيمة وسعراً',
    badgeEn: '💰 Best Budget Value',
    titleAr: 'مكنسة بيسوس اللاسلكية A2 Pro',
    titleEn: 'Baseus A2 Pro Car Vacuum Cleaner',
    specsAr: 'قوة شفط 6,000 باسكال • فلتر HEPA مزدوج • شحن Type-C',
    specsEn: '6kPa Suction • Dual HEPA Filter • Type-C Fast Charge',
    verdictAr: 'السعر الاقتصادي الأفضل للتنظيف اليومي السريع وفتات المقاعد.',
    verdictEn: 'The most reliable budget option for daily touch-ups and seat crumbs.',
    rating: 4.6,
    slugAr: 'best-car-vacuum',
    slugEn: 'best-car-vacuum',
  },
  {
    key: 'pick-dustbuster',
    order: 3,
    badgeColor: 'purple',
    badgeAr: '👑 الخيار الفاخر',
    badgeEn: '👑 Best Premium',
    titleAr: 'مكنسة بلاك آند ديكر للسيارات Dustbuster',
    titleEn: 'BLACK+DECKER Dustbuster Auto 12V',
    specsAr: 'تشغيل مستمر عبر ولاعة السيارة • خزان 560 مل • سلك 5 أمتار',
    specsEn: '12V Continuous Power • 560ml Bin • 5m Long Cable',
    verdictAr: 'قوة لا تنفد من البطارية لتنظيف الشاحنات والسيارات العائلية الكبيرة.',
    verdictEn: 'Non-stop runtime directly from the 12V port for SUVs and large families.',
    rating: 4.7,
    slugAr: 'car-vacuum',
    slugEn: 'car-vacuum',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Static pages
// ─────────────────────────────────────────────────────────────────────────────

const STATIC_PAGES = [
  {
    key: 'about',
    titleAr: 'من نحن',
    titleEn: 'About Us',
    descriptionAr: 'تعرّف على كار كلين السعودية: كيف نختبر ونقيّم منتجات العناية بالسيارات.',
    descriptionEn: 'Learn about CarClean KSA: how we test and rate car care products.',
    introAr:
      'كار كلين السعودية موقع عربي متخصص في منتجات التنظيف والعناية بالسيارات. هدفنا أن نوفر عليك الوقت والمال بمراجعات واضحة وصادقة.',
    introEn:
      'CarClean KSA is an Arabic site dedicated to car cleaning and care products. Our goal is to save you time and money with clear, honest reviews.',
    sections: [
      {
        headingAr: 'ماذا نقدم؟',
        headingEn: 'What we do',
        paragraphsAr: [
          'مراجعات تفصيلية، مقارنات بين الموديلات، وأدلة شراء مبسّطة تشرح ما يناسب سيارتك وميزانيتك.',
          'نكتب بلغة بسيطة، ونركّز على ما يهمك فعلاً: الأداء، سهولة الاستخدام، والسعر مقابل القيمة.',
        ],
        paragraphsEn: [
          'Detailed reviews, model comparisons and simple buying guides that explain what fits your car and your budget.',
          'We write in plain language and focus on what matters: performance, ease of use and value for money.',
        ],
      },
      {
        headingAr: 'كيف نقيّم المنتجات؟',
        headingEn: 'How we evaluate products',
        paragraphsAr: [
          'نعتمد على التجربة العملية والبحث في مواصفات المنتج وآراء المستخدمين الموثوقة. نذكر العيوب بنفس وضوح المميزات.',
          'نراجع مقالاتنا بشكل دوري لتحديث الأسعار والتوصيات عند ظهور موديلات جديدة.',
        ],
        paragraphsEn: [
          'We rely on hands-on use, close reading of specifications and trustworthy user feedback. We state the downsides as clearly as the strengths.',
          'We revisit our articles regularly to update prices and recommendations as new models appear.',
        ],
      },
      {
        headingAr: 'كيف يموَّل الموقع؟',
        headingEn: 'How the site is funded',
        paragraphsAr: [
          'قد نحصل على عمولة صغيرة عند الشراء عبر الروابط التابعة في مقالاتنا، دون أي تكلفة إضافية عليك. هذا لا يؤثر على رأينا في المنتجات. اقرأ المزيد في صفحة إفصاح الروابط التابعة.',
        ],
        paragraphsEn: [
          'We may earn a small commission when you buy through affiliate links in our articles, at no extra cost to you. This never changes our opinion of a product. Read more on the Affiliate Disclosure page.',
        ],
      },
    ],
  },
  {
    key: 'privacy',
    titleAr: 'سياسة الخصوصية',
    titleEn: 'Privacy Policy',
    descriptionAr: 'كيف تجمع كار كلين السعودية بياناتك وتستخدمها وتحميها.',
    descriptionEn: 'How CarClean KSA collects, uses and protects your information.',
    introAr:
      'خصوصيتك تهمنا. توضح هذه الصفحة المعلومات التي قد نجمعها عند استخدامك لكار كلين السعودية وكيف نستخدمها.',
    introEn:
      'Your privacy matters. This page explains what information we may collect when you use CarClean KSA and how we use it.',
    sections: [
      {
        headingAr: 'المعلومات التي نجمعها',
        headingEn: 'Information we collect',
        paragraphsAr: [
          'لا نطلب منك إنشاء حساب. قد نجمع بيانات تقنية مجهولة الهوية مثل نوع المتصفح والصفحات التي تزورها والبلد التقريبي عبر أدوات التحليلات.',
          'إذا راسلتنا عبر البريد الإلكتروني فسنحتفظ بالرسالة وبريدك للرد عليك فقط.',
        ],
        paragraphsEn: [
          'We do not ask you to create an account. We may collect anonymous technical data such as browser type, pages visited and approximate country through analytics tools.',
          'If you email us, we keep your message and address only to reply to you.',
        ],
      },
      {
        headingAr: 'ملفات تعريف الارتباط والتحليلات',
        headingEn: 'Cookies and analytics',
        paragraphsAr: [
          'قد نستخدم أدوات مثل Google Analytics وMicrosoft Clarity لفهم كيفية استخدام الموقع وتحسينه. تستخدم هذه الأدوات ملفات تعريف الارتباط، ويمكنك تعطيلها من إعدادات متصفحك.',
        ],
        paragraphsEn: [
          'We may use tools such as Google Analytics and Microsoft Clarity to understand and improve how the site is used. These tools use cookies, which you can disable in your browser settings.',
        ],
      },
      {
        headingAr: 'روابط الأطراف الثالثة',
        headingEn: 'Third-party links',
        paragraphsAr: [
          'تحتوي مقالاتنا على روابط لمتاجر ومواقع خارجية (مثل أمازون). لسنا مسؤولين عن سياسات الخصوصية أو محتوى تلك المواقع، وننصحك بمراجعتها.',
        ],
        paragraphsEn: [
          'Our articles contain links to external stores and sites (such as Amazon). We are not responsible for the privacy practices or content of those sites and encourage you to review them.',
        ],
      },
      {
        headingAr: 'مشاركة البيانات وحمايتها',
        headingEn: 'Data sharing and protection',
        paragraphsAr: [
          'لا نبيع بياناتك ولا نشاركها مع أي جهة إلا مزوّدي الخدمات الضروريين لتشغيل الموقع. نتخذ إجراءات معقولة لحماية البيانات.',
        ],
        paragraphsEn: [
          'We do not sell your data or share it with anyone except service providers needed to run the site. We take reasonable steps to protect the data we hold.',
        ],
      },
      {
        headingAr: 'التواصل معنا',
        headingEn: 'Contact',
        paragraphsAr: ['لأي استفسار بخصوص الخصوصية، يرجى استخدام صفحة اتصل بنا.'],
        paragraphsEn: ['For any privacy question, please use our Contact page.'],
      },
    ],
  },
  {
    key: 'terms',
    titleAr: 'شروط الاستخدام',
    titleEn: 'Terms of Use',
    descriptionAr: 'شروط وأحكام استخدام كار كلين السعودية.',
    descriptionEn: 'Terms and conditions for using CarClean KSA.',
    introAr:
      'باستخدامك كار كلين السعودية فإنك توافق على الشروط التالية. إذا لم توافق عليها فيرجى التوقف عن استخدام الموقع.',
    introEn:
      'By using CarClean KSA you agree to the terms below. If you do not agree, please stop using the site.',
    sections: [
      {
        headingAr: 'المحتوى',
        headingEn: 'Content',
        paragraphsAr: [
          'المحتوى المنشور هنا لأغراض إعلامية وتعليمية فقط. نبذل جهدنا لضمان دقته لكن لا نضمن خلوّه من الأخطاء أو أنه محدّث دائماً.',
          'الأسعار والتوفر والمواصفات قد تتغير في أي وقت؛ يرجى التأكد منها لدى البائع قبل الشراء.',
        ],
        paragraphsEn: [
          'Content here is for informational and educational purposes only. We work to keep it accurate but do not guarantee it is error-free or always up to date.',
          'Prices, availability and specifications can change at any time; please confirm with the seller before buying.',
        ],
      },
      {
        headingAr: 'الملكية الفكرية',
        headingEn: 'Intellectual property',
        paragraphsAr: [
          'جميع النصوص والتصاميم والشعارات ملك للموقع ما لم يُذكر خلاف ذلك. لا يجوز نسخ المحتوى أو إعادة نشره دون إذن مكتوب، ويُسمح بالاقتباس القصير مع ذكر المصدر ورابط للمقال.',
        ],
        paragraphsEn: [
          'All text, designs and logos belong to the site unless stated otherwise. You may not copy or republish content without written permission; brief quotations with credit and a link to the article are welcome.',
        ],
      },
      {
        headingAr: 'الروابط الخارجية والتابعة',
        headingEn: 'External and affiliate links',
        paragraphsAr: [
          'قد يحتوي الموقع على روابط لمواقع خارجية وروابط تابعة. لا نتحمل مسؤولية محتوى تلك المواقع أو معاملاتك معها.',
        ],
        paragraphsEn: [
          'The site may contain links to external websites and affiliate links. We are not responsible for the content of those sites or your dealings with them.',
        ],
      },
      {
        headingAr: 'إخلاء المسؤولية',
        headingEn: 'Disclaimer',
        paragraphsAr: [
          'يُقدَّم الموقع كما هو دون أي ضمانات. لا نتحمل مسؤولية أي خسارة ناتجة عن اعتمادك على المعلومات المنشورة.',
        ],
        paragraphsEn: [
          'The site is provided "as is" without warranties. We are not liable for any loss resulting from reliance on the information published.',
        ],
      },
      {
        headingAr: 'التعديلات',
        headingEn: 'Changes',
        paragraphsAr: [
          'قد نحدّث هذه الشروط من وقت لآخر، واستمرارك في استخدام الموقع يعني موافقتك على النسخة المحدّثة.',
        ],
        paragraphsEn: [
          'We may update these terms from time to time; continued use of the site means you accept the updated version.',
        ],
      },
    ],
  },
  {
    key: 'disclosure',
    titleAr: 'إفصاح الروابط التابعة',
    titleEn: 'Affiliate Disclosure',
    descriptionAr: 'كيف تربح كار كلين السعودية من الروابط التابعة وكيف نحافظ على استقلالية آرائنا.',
    descriptionEn: 'How CarClean KSA earns from affiliate links and how we keep our opinions independent.',
    introAr:
      'الشفافية مهمة لنا. تحتوي بعض مقالاتنا على روابط تابعة، وهذه الصفحة توضح ما يعنيه ذلك لك.',
    introEn:
      'Transparency matters to us. Some of our articles contain affiliate links, and this page explains what that means for you.',
    sections: [
      {
        headingAr: 'ما هي الروابط التابعة؟',
        headingEn: 'What are affiliate links?',
        paragraphsAr: [
          'عند نقرك على رابط تابع وإتمامك عملية شراء، قد نحصل على عمولة صغيرة من المتجر دون أي زيادة في السعر عليك.',
        ],
        paragraphsEn: [
          'When you click an affiliate link and complete a purchase, we may receive a small commission from the store at no additional cost to you.',
        ],
      },
      {
        headingAr: 'برنامج أمازون للمسوّقين بالعمولة',
        headingEn: 'Amazon Associates',
        paragraphsAr: [
          'نحن مشاركون في برامج التسويق بالعمولة، وقد نربح من عمليات الشراء المؤهلة عبر الروابط إلى أمازون ومتاجر أخرى.',
        ],
        paragraphsEn: [
          'We participate in affiliate programs and may earn from qualifying purchases made through links to Amazon and other stores.',
        ],
      },
      {
        headingAr: 'استقلالية التقييم',
        headingEn: 'Editorial independence',
        paragraphsAr: [
          'العمولة لا تؤثر على تقييماتنا أو ترتيب المنتجات. نوصي فقط بما نراه مناسباً للقارئ، ونذكر العيوب بوضوح.',
        ],
        paragraphsEn: [
          'Commissions never influence our ratings or product rankings. We recommend only what we think suits the reader and we state the downsides clearly.',
        ],
      },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Site Settings section chrome (was hardcoded in the homepage components)
// ─────────────────────────────────────────────────────────────────────────────

const SITE_SETTINGS_PATCH = {
  picksBadgeAr: 'اختيارات الخبراء',
  picksBadgeEn: "EDITOR'S BENCHMARK",
  picksHeadingAr: 'أفضل مكانس السيارات ترشيحاً لعام 2026',
  picksHeadingEn: 'Top Recommended Car Vacuums for 2026',
  picksSubheadingAr: 'مبنية على تجارب قياس الشفط الفعلي وعمر البطارية والتحمل لأجواء المملكة.',
  picksSubheadingEn:
    'Based on lab suction tests, battery endurance, and durability in harsh climate conditions.',
  picksCtaAr: 'قراءة المراجعة والمواصفات',
  picksCtaEn: 'Read Full Review',
  faqBadgeAr: 'الأسئلة الشائعة والأدلة',
  faqBadgeEn: 'FAQ & GUIDES',
  faqHeadingAr: 'أسئلة شائعة حول اختيار مكنسة السيارة',
  faqHeadingEn: 'Frequently Asked Questions',
  trustLineAr: 'نقيّم مكانس السيارات بالاستخدام الفعلي وقياسات الشفط الميدانية.',
  trustLineEn: 'We test car vacuums through real-world use and field suction tests.',
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function upsertDoc(
  doc: { _type: string } & Record<string, unknown>,
  keyField: string,
  keyValue: string
) {
  const existingId = await client.fetch<string | null>(
    `*[_type == $type && ${keyField} == $key][0]._id`,
    { type: doc._type, key: keyValue }
  )
  if (existingId) {
    await client.patch(existingId).set(doc).commit()
    console.log(`  updated ${doc._type}: ${keyValue}`)
  } else {
    await client.create(doc)
    console.log(`  created ${doc._type}: ${keyValue}`)
  }
}

async function resolvePostId(slug: string, language: 'ar' | 'en'): Promise<string | null> {
  const id = await client.fetch<string | null>(
    `*[_type == "post" && slug.current == $slug && language == $lang][0]._id`,
    { slug, lang: language }
  )
  return id
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Seeding FAQ items…')
  for (const item of FAQ_ITEMS) {
    // `key` is stored on the doc so re-runs can match it; not shown in Studio.
    await upsertDoc({ _type: 'faqItem', ...item }, 'key', item.key)
  }

  console.log('Seeding featured picks…')
  for (const pick of FEATURED_PICKS) {
    const { slugAr, slugEn, ...rest } = pick
    const postRefAr = await resolvePostId(slugAr, 'ar')
    const postRefEn = await resolvePostId(slugEn, 'en')
    if (!postRefAr) console.warn(`  ! no Arabic post found for slug "${slugAr}"`)
    if (!postRefEn) console.warn(`  ! no English post found for slug "${slugEn}"`)
    await upsertDoc(
      {
        _type: 'featuredPick',
        ...rest,
        ...(postRefAr ? { postRefAr: { _type: 'reference', _ref: postRefAr } } : {}),
        ...(postRefEn ? { postRefEn: { _type: 'reference', _ref: postRefEn } } : {}),
      },
      'key',
      pick.key
    )
  }

  console.log('Seeding static pages…')
  for (const page of STATIC_PAGES) {
    await upsertDoc({ _type: 'staticPage', ...page }, 'key', page.key)
  }

  console.log('Patching siteSettings…')
  const existingId = await client.fetch<string | null>(
    `*[_type == "siteSettings"][0]._id`
  )
  if (existingId) {
    await client.patch(existingId).set(SITE_SETTINGS_PATCH).commit()
  } else {
    await client.createOrReplace({ _id: 'siteSettings', _type: 'siteSettings', ...SITE_SETTINGS_PATCH })
  }
  console.log('  siteSettings updated')

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
