import type { Locale } from '@/lib/i18n'

export type InfoPageKey = 'about' | 'privacy' | 'terms' | 'disclosure'

export type InfoSection = { heading: string; paragraphs: string[] }

export type InfoPageContent = {
  title: string
  description: string
  intro: string
  sections: InfoSection[]
}

/**
 * Static bilingual content for the basic pages.
 * NOTE: legal pages are a sensible starting template — have them reviewed
 * before launch, especially if you collect personal data or run ads.
 */
export function getInfoPage(key: InfoPageKey, locale: Locale, siteName: string): InfoPageContent {
  const ar = locale === 'ar'

  switch (key) {
    case 'about':
      return ar
        ? {
            title: 'من نحن',
            description: `تعرّف على ${siteName}: كيف نختبر القلايات الهوائية وأجهزة المطبخ ونكتب مراجعاتنا.`,
            intro: `${siteName} موقع عربي متخصص في القلايات الهوائية وأجهزة المطبخ الصغيرة. هدفنا أن نوفر عليك الوقت والمال بمراجعات واضحة وصادقة.`,
            sections: [
              {
                heading: 'ماذا نقدم؟',
                paragraphs: [
                  'مراجعات تفصيلية، مقارنات بين الموديلات، وأدلة شراء مبسّطة تشرح لك ما يناسب مطبخك وعائلتك وميزانيتك.',
                  'نكتب بلغة بسيطة، ونركّز على ما يهمك فعلاً: الأداء، سهولة التنظيف، الحجم، والسعر مقابل القيمة.',
                ],
              },
              {
                heading: 'كيف نقيّم المنتجات؟',
                paragraphs: [
                  'نعتمد على التجربة العملية والبحث في مواصفات المنتج وآراء المستخدمين الموثوقة. نذكر العيوب بنفس وضوح المميزات.',
                  'نراجع مقالاتنا بشكل دوري لتحديث الأسعار والتوصيات عند ظهور موديلات جديدة.',
                ],
              },
              {
                heading: 'كيف يموَّل الموقع؟',
                paragraphs: [
                  'قد نحصل على عمولة صغيرة عند الشراء عبر الروابط التابعة في مقالاتنا، دون أي تكلفة إضافية عليك. هذا لا يؤثر على رأينا في المنتجات. اقرأ المزيد في صفحة إفصاح الروابط التابعة.',
                ],
              },
            ],
          }
        : {
            title: 'About Us',
            description: `Learn about ${siteName}: how we test air fryers and kitchen appliances and write our reviews.`,
            intro: `${siteName} is a bilingual site about air fryers and small kitchen appliances. Our goal is to save you time and money with clear, honest reviews.`,
            sections: [
              {
                heading: 'What we do',
                paragraphs: [
                  'Detailed reviews, model comparisons and simple buying guides that explain what fits your kitchen, your family and your budget.',
                  'We write in plain language and focus on what matters: performance, ease of cleaning, size and value for money.',
                ],
              },
              {
                heading: 'How we evaluate products',
                paragraphs: [
                  'We rely on hands-on use, close reading of specifications and trustworthy user feedback. We state the downsides as clearly as the strengths.',
                  'We revisit our articles regularly to update prices and recommendations as new models appear.',
                ],
              },
              {
                heading: 'How the site is funded',
                paragraphs: [
                  'We may earn a small commission when you buy through affiliate links in our articles, at no extra cost to you. This never changes our opinion of a product. Read more on the Affiliate Disclosure page.',
                ],
              },
            ],
          }

    case 'privacy':
      return ar
        ? {
            title: 'سياسة الخصوصية',
            description: `كيف يجمع ${siteName} بياناتك ويستخدمها ويحميها.`,
            intro: `خصوصيتك تهمنا. توضح هذه الصفحة المعلومات التي قد نجمعها عند استخدامك ${siteName} وكيف نستخدمها.`,
            sections: [
              {
                heading: 'المعلومات التي نجمعها',
                paragraphs: [
                  'لا نطلب منك إنشاء حساب. قد نجمع بيانات تقنية مجهولة الهوية مثل نوع المتصفح والصفحات التي تزورها والبلد التقريبي عبر أدوات التحليلات.',
                  'إذا راسلتنا عبر البريد الإلكتروني فسنحتفظ بالرسالة وبريدك للرد عليك فقط.',
                ],
              },
              {
                heading: 'ملفات تعريف الارتباط والتحليلات',
                paragraphs: [
                  'قد نستخدم أدوات مثل Google Analytics وMicrosoft Clarity لفهم كيفية استخدام الموقع وتحسينه. تستخدم هذه الأدوات ملفات تعريف الارتباط، ويمكنك تعطيلها من إعدادات متصفحك.',
                ],
              },
              {
                heading: 'روابط الأطراف الثالثة',
                paragraphs: [
                  'تحتوي مقالاتنا على روابط لمتاجر ومواقع خارجية (مثل أمازون). لسنا مسؤولين عن سياسات الخصوصية أو محتوى تلك المواقع، وننصحك بمراجعتها.',
                ],
              },
              {
                heading: 'مشاركة البيانات وحمايتها',
                paragraphs: [
                  'لا نبيع بياناتك ولا نشاركها مع أي جهة إلا مزوّدي الخدمات الضروريين لتشغيل الموقع. نتخذ إجراءات معقولة لحماية البيانات.',
                ],
              },
              {
                heading: 'التواصل معنا',
                paragraphs: ['لأي استفسار بخصوص الخصوصية، يرجى استخدام صفحة اتصل بنا.'],
              },
            ],
          }
        : {
            title: 'Privacy Policy',
            description: `How ${siteName} collects, uses and protects your information.`,
            intro: `Your privacy matters. This page explains what information we may collect when you use ${siteName} and how we use it.`,
            sections: [
              {
                heading: 'Information we collect',
                paragraphs: [
                  'We do not ask you to create an account. We may collect anonymous technical data such as browser type, pages visited and approximate country through analytics tools.',
                  'If you email us, we keep your message and address only to reply to you.',
                ],
              },
              {
                heading: 'Cookies and analytics',
                paragraphs: [
                  'We may use tools such as Google Analytics and Microsoft Clarity to understand and improve how the site is used. These tools use cookies, which you can disable in your browser settings.',
                ],
              },
              {
                heading: 'Third-party links',
                paragraphs: [
                  'Our articles contain links to external stores and sites (such as Amazon). We are not responsible for the privacy practices or content of those sites and encourage you to review them.',
                ],
              },
              {
                heading: 'Data sharing and protection',
                paragraphs: [
                  'We do not sell your data or share it with anyone except service providers needed to run the site. We take reasonable steps to protect the data we hold.',
                ],
              },
              {
                heading: 'Contact',
                paragraphs: ['For any privacy question, please use our Contact page.'],
              },
            ],
          }

    case 'terms':
      return ar
        ? {
            title: 'شروط الاستخدام',
            description: `شروط وأحكام استخدام ${siteName}.`,
            intro: `باستخدامك ${siteName} فإنك توافق على الشروط التالية. إذا لم توافق عليها فيرجى التوقف عن استخدام الموقع.`,
            sections: [
              {
                heading: 'المحتوى',
                paragraphs: [
                  'المحتوى المنشور هنا لأغراض إعلامية وتعليمية فقط. نبذل جهدنا لضمان دقته لكن لا نضمن خلوّه من الأخطاء أو أنه محدّث دائماً.',
                  'الأسعار والتوفر والمواصفات قد تتغير في أي وقت؛ يرجى التأكد منها لدى البائع قبل الشراء.',
                ],
              },
              {
                heading: 'الملكية الفكرية',
                paragraphs: [
                  'جميع النصوص والتصاميم والشعارات ملك للموقع ما لم يُذكر خلاف ذلك. لا يجوز نسخ المحتوى أو إعادة نشره دون إذن مكتوب، ويُسمح بالاقتباس القصير مع ذكر المصدر ورابط للمقال.',
                ],
              },
              {
                heading: 'الروابط الخارجية والتابعة',
                paragraphs: [
                  'قد يحتوي الموقع على روابط لمواقع خارجية وروابط تابعة. لا نتحمل مسؤولية محتوى تلك المواقع أو معاملاتك معها.',
                ],
              },
              {
                heading: 'إخلاء المسؤولية',
                paragraphs: [
                  'يُقدَّم الموقع كما هو دون أي ضمانات. لا نتحمل مسؤولية أي خسارة ناتجة عن اعتمادك على المعلومات المنشورة.',
                ],
              },
              {
                heading: 'التعديلات',
                paragraphs: ['قد نحدّث هذه الشروط من وقت لآخر، واستمرارك في استخدام الموقع يعني موافقتك على النسخة المحدّثة.'],
              },
            ],
          }
        : {
            title: 'Terms of Use',
            description: `Terms and conditions for using ${siteName}.`,
            intro: `By using ${siteName} you agree to the terms below. If you do not agree, please stop using the site.`,
            sections: [
              {
                heading: 'Content',
                paragraphs: [
                  'Content here is for informational and educational purposes only. We work to keep it accurate but do not guarantee it is error-free or always up to date.',
                  'Prices, availability and specifications can change at any time; please confirm with the seller before buying.',
                ],
              },
              {
                heading: 'Intellectual property',
                paragraphs: [
                  'All text, designs and logos belong to the site unless stated otherwise. You may not copy or republish content without written permission; brief quotations with credit and a link to the article are welcome.',
                ],
              },
              {
                heading: 'External and affiliate links',
                paragraphs: [
                  'The site may contain links to external websites and affiliate links. We are not responsible for the content of those sites or your dealings with them.',
                ],
              },
              {
                heading: 'Disclaimer',
                paragraphs: [
                  'The site is provided "as is" without warranties. We are not liable for any loss resulting from reliance on the information published.',
                ],
              },
              {
                heading: 'Changes',
                paragraphs: ['We may update these terms from time to time; continued use of the site means you accept the updated version.'],
              },
            ],
          }

    case 'disclosure':
      return ar
        ? {
            title: 'إفصاح الروابط التابعة',
            description: `كيف يربح ${siteName} من الروابط التابعة وكيف نحافظ على استقلالية آرائنا.`,
            intro: 'الشفافية مهمة لنا. تحتوي بعض مقالاتنا على روابط تابعة، وهذه الصفحة توضح ما يعنيه ذلك لك.',
            sections: [
              {
                heading: 'ما هي الروابط التابعة؟',
                paragraphs: [
                  'عند نقرك على رابط تابع وإتمامك عملية شراء، قد نحصل على عمولة صغيرة من المتجر دون أي زيادة في السعر عليك.',
                ],
              },
              {
                heading: 'برنامج أمازون للمسوّقين بالعمولة',
                paragraphs: [
                  'نحن مشاركون في برامج التسويق بالعمولة، وقد نربح من عمليات الشراء المؤهلة عبر الروابط إلى أمازون ومتاجر أخرى.',
                ],
              },
              {
                heading: 'استقلالية التقييم',
                paragraphs: [
                  'العمولة لا تؤثر على تقييماتنا أو ترتيب المنتجات. نوصي فقط بما نراه مناسباً للقارئ، ونذكر العيوب بوضوح.',
                ],
              },
            ],
          }
        : {
            title: 'Affiliate Disclosure',
            description: `How ${siteName} earns from affiliate links and how we keep our opinions independent.`,
            intro: 'Transparency matters to us. Some of our articles contain affiliate links, and this page explains what that means for you.',
            sections: [
              {
                heading: 'What are affiliate links?',
                paragraphs: [
                  'When you click an affiliate link and complete a purchase, we may receive a small commission from the store at no additional cost to you.',
                ],
              },
              {
                heading: 'Amazon Associates',
                paragraphs: [
                  'We participate in affiliate programs and may earn from qualifying purchases made through links to Amazon and other stores.',
                ],
              },
              {
                heading: 'Editorial independence',
                paragraphs: [
                  'Commissions never influence our ratings or product rankings. We recommend only what we think suits the reader and we state the downsides clearly.',
                ],
              },
            ],
          }
  }
}
