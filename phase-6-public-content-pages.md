# PHASE 6 — PUBLIC CONTENT PAGES

**File name suggestion:** `phase-6-public-content-pages.md`

## Context Summary From Previous Phases
Phase 0 ने **Cosmic Finance** की foundation तय की — sitemap, non-negotiable rules। Phase 1 ने design system बनाया। Phase 2 ने cosmic orbit visualization और interactivity जोड़ी। Phase 3 ने live stock/gold/crypto data integrate किया। Phase 4 ने kundli-funnel बनाया। Phase 5 ने secure admin panel बनाया जहाँ से daily thoughts, articles, news, और leads manage होते हैं। अब यह phase उन सभी backend capabilities को वास्तविक, पॉलिश्ड, public-facing pages में बदलता है — यानी जो कुछ admin पैनल से publish होता है, वह visitor को किस रूप में, किस layout में, किस experience के साथ दिखेगा। पिछले phases का design-system, animation-system, और data-system बिल्कुल नहीं बदलना — यह phase सिर्फ content को सही तरीके से present करने की structure बनाता है।

## Goal of This Phase
Homepage की content-feed, Articles की listing और detail pages, News page, और Weekly Macro Outlook archive page — इन सभी को इस तरह डिज़ाइन और structure करना कि ये Cosmic Finance के overall universe का स्वाभाविक हिस्सा लगें, ना कि किसी generic blog/CMS जैसा महसूस हों। हर page पढ़ने में आसान, मोबाइल पर तेज़, और SEO के लिहाज़ से भी मजबूत होना चाहिए, क्योंकि यही pages organic traffic (Google search) लाने का मुख्य ज़रिया बनेंगे।

## 1. Homepage — Live Feed Section (Daily Thoughts Integration)

- Homepage पर, hero/cosmic-visualization सेक्शन (Phase 2) और live-data सेक्शन (Phase 3) के नीचे, एक dedicated **"Admin's Daily Cosmic Thoughts"** feed सेक्शन हो
- यह एक vertically scrolling feed जैसा दिखे (social-media-style card layout) — हर entry में timestamp, संक्षिप्त content preview, और अगर लंबा पोस्ट है तो "पूरा पढ़ें" का विकल्प
- नई पोस्ट सबसे ऊपर दिखे, पुरानी नीचे की तरफ — infinite-scroll या "Load More" बटन के ज़रिए पुरानी entries भी देखी जा सकें
- इस feed का visual treatment Phase 1 के design-tokens के अनुसार हो — जैसे हल्का glowing card border, cosmic background के साथ harmonize करता हुआ
- इसी homepage पर आगे एक सेक्शन हो जो **Featured/Latest Articles** दिखाए (2-3 cards), और एक सेक्शन जो **Latest News** दिखाए (संक्षिप्त headlines के रूप में) — दोनों के पास "सभी देखें" लिंक हो जो respective listing pages पर ले जाए

## 2. Weekly Macro Outlook Archive Page

- यह वही पेज है जहाँ "इस हफ्ते ग्रहों का बाज़ार पर प्रभाव" टाइप की content संग्रहित होती है (मूल concept के Pillar A से जुड़ा हुआ)
- नया सबसे ऊपर, और नीचे पुराने हफ़्तों के outlook क्रमवार दिखें — एक कैलेंडर/टाइमलाइन जैसा visual feel दिया जा सकता है ताकि user आसानी से समझ सके कि यह साप्ताहिक रूप से लगातार प्रकाशित हो रहा है (यह विश्वसनीयता और नियमितता दोनों दिखाता है)
- हर एंट्री में: हफ़्ते की तारीख-सीमा, मुख्य ग्रह-गोचर (transits) की संक्षिप्त सूची, और Nifty/Sensex, Gold, Crypto, Nasdaq पर संभावित व्यापक असर — टेक्स्ट फॉर्मेट में, कोई specific tip नहीं, जैसा Phase 0 के नियम में तय है
- इस पेज पर भी डिस्क्लेमर स्पष्ट रूप से मौजूद हो

## 3. Articles Listing Page

- सभी published articles (admin-written + approved user-submissions) यहाँ grid/list लेआउट में दिखें
- Filter/category विकल्प हों — जैसे "Astrology Basics", "Market Analysis", "Speculation Yoga", "Trader Stories" जैसी categories (categories की पूरी सूची content-strategy के हिसाब से बाद में तय हो सकती है)
- हर article-card में: featured image, शीर्षक, संक्षिप्त excerpt, author का नाम, प्रकाशन तारीख, और अनुमानित पढ़ने का समय (reading time) दिखे
- Search functionality हो ताकि user किसी खास topic पर article ढूंढ सके
- Pagination या infinite-scroll — mobile performance को ध्यान में रखते हुए (Phase 2/3 के performance guardrails के अनुरूप)

## 4. Single Article Detail Page

- Clean, पढ़ने में आरामदायक typography (Phase 1 के body-text font-token का इस्तेमाल करते हुए) — लंबा पढ़ते समय आँखों पर ज़ोर न पड़े, cosmic background बहुत subtle/muted हो ताकि टेक्स्ट पढ़ने में बाधा न बने
- ऊपर featured image, शीर्षक, author-credit, तारीख, reading-time
- Article के अंत में: author की संक्षिप्त जानकारी (अगर user-submitted है तो), संबंधित अन्य articles की सिफारिश ("आपको ये भी पसंद आ सकते हैं"), और एक स्पष्ट **"अपना आर्टिकल Submit करें"** CTA जो Submit-an-Article page की तरफ ले जाए (community-contribution को बढ़ावा देने के लिए)
- Bina-login इमोजी-रिएक्शन फीचर यहाँ भी जोड़ा जा सकता है (जैसे पहले discuss हुआ था) — 🔥💰📉 जैसे reactions, पूरे comment-सिस्टम की बजाय, ताकि engagement दिखे पर spam-risk कम रहे
- Social-share बटन हों (WhatsApp विशेष रूप से प्राथमिकता में, क्योंकि भारतीय audience वहीं सबसे ज़्यादा शेयर करती है)
- हर article पर सामान्य disclaimer-footer-note हो (अगर content में बाज़ार/निवेश से जुड़ी कोई भी बात हो)

## 5. Submit an Article Page (Public, No-Login)

- सरल फॉर्म: लेखक का नाम, ईमेल, article का शीर्षक, content (rich-text editor जिसमें image embed की सुविधा हो), वैकल्पिक रूप से एक छोटा author-bio
- स्पष्ट संदेश हो कि submission सीधे publish नहीं होगा, पहले admin review से गुज़रेगा (Phase 5 का moderation-queue यहीं जुड़ता है)
- Spam-protection (rate-limiting/CAPTCHA) यहाँ भी ज़रूरी, जैसा Phase 0/4 में rule तय है
- Submit करने के बाद एक स्पष्ट confirmation message ("आपका आर्टिकल समीक्षा हेतु भेज दिया गया है, स्वीकृति मिलने पर यह प्रकाशित होगा")

## 6. News Page

- Curated news items एक साफ, scannable list/card-format में — शीर्षक, संक्षिप्त विवरण, स्रोत (source) का नाम/लिंक, तारीख
- हर news-item में एक छोटा सा visual indicator हो सकता है कि यह ज़्यादा "financial" न्यूज़ है या "astrology-related" न्यूज़ (color-coded tag, Phase 1 के color-system के अनुसार)
- बाहरी स्रोत की खबर होने पर स्पष्ट रूप से "Source: [नाम]" और original-link दिखे (credibility और copyright-सम्मान दोनों के लिए)

## 7. SEO Considerations Across All These Pages

- हर article, news-item, और weekly-outlook entry का अपना unique, descriptive URL (slug) हो
- हर पेज पर उचित meta-title और meta-description हो, जो उस specific content को दर्शाए (generic साइट-वाइड meta नहीं)
- Structured-data (schema markup) का इस्तेमाल जहाँ उपयुक्त हो (जैसे Article schema) ताकि Google में बेहतर तरीके से content दिखे
- Internal-linking को प्रोत्साहित किया जाए (जैसे articles के अंदर दूसरे संबंधित articles/weekly-outlook का लिंक) ताकि साइट की समग्र SEO-मजबूती बने

## 8. Mobile-Specific Considerations for Content Pages

- चूंकि 80% traffic मोबाइल से है, इन सभी content-pages का मोबाइल-अनुभव अत्यंत तेज़ और पढ़ने में आसान होना चाहिए — भारी animation इन pages पर (Phase 2 के hero जैसी) नहीं होनी चाहिए, सिर्फ हल्की scroll-reveal transitions
- Font-size, line-height मोबाइल के लिए विशेष रूप से अनुकूलित हो ताकि लंबा पढ़ना थकाऊ न लगे
- Images lazy-load हों, compressed हों (Phase 3 के performance-guardrails के अनुरूप)

## What This Phase Should Produce

- पूरी तरह काम करने वाला Homepage Live-Feed सेक्शन जो admin की daily-thoughts दिखाए
- Weekly Macro Outlook Archive page, क्रमबद्ध और cosmic-theme में प्रस्तुत
- Articles Listing page (filter/search/pagination सहित) और Single Article Detail page (reactions, share, related-articles सहित)
- Submit-an-Article public फॉर्म, moderation-queue से जुड़ा हुआ
- News Page, curated items के साथ
- सभी pages पर उचित SEO meta-tags और structured-data
- मोबाइल-अनुकूलित, तेज़ लोडिंग अनुभव हर content-page पर

## Explicitly Out of Scope for This Phase

Terms & Conditions, Privacy Policy, और Disclaimer pages की पूरी कानूनी सामग्री अभी नहीं लिखनी (अगला/बाद का phase)। 20 प्रारंभिक articles की actual content अभी नहीं (Phase 7)। Security-hardening/performance-audit की गहराई अभी नहीं (Phase 8/9)।

## End-of-Phase Checklist (must confirm all before proceeding to Phase 7)

- [ ] Homepage Live-Feed सेक्शन admin की daily-posts सही क्रम में दिखा रहा है
- [ ] Weekly Macro Outlook archive page सही तरीके से क्रमबद्ध और cosmic-theme में है
- [ ] Articles Listing page filter, search, pagination सहित सही काम कर रहा है
- [ ] Single Article Detail page पढ़ने में आरामदायक है, reactions/share/related-articles सही काम कर रहे हैं
- [ ] Submit-an-Article फॉर्म सही तरीके से moderation-queue में जा रहा है, spam-protection सहित
- [ ] News Page सही तरीके से curated items दिखा रहा है, source-attribution सहित
- [ ] हर content-page पर उचित meta-title/description और structured-data मौजूद है
- [ ] मोबाइल पर सभी content-pages तेज़ी से लोड हो रहे हैं, images lazy-load हो रही हैं
- [ ] हर जगह जहाँ ज़रूरी है, डिस्क्लेमर मौजूद है
- [ ] इस phase में कुछ भी पिछले phases के design, animation, data, funnel, या admin-system को नहीं तोड़ता
