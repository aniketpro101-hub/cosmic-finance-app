# PHASE 9 — FINAL SELF-AUDIT & LAUNCH-READINESS PHASE

**File name suggestion:** `phase-9-final-self-audit.md`

## Context Summary From Previous Phases
Phase 0 से Phase 8 तक **Cosmic Finance** पूरी तरह बन चुकी है — foundation, design-system, cosmic animation-layer, live stock/gold/crypto data, kundli-funnel, secure admin-panel, सभी public content-pages, 20 starter-articles, और एक गहन security/performance hardening-pass। अब यह अंतिम phase है, जिसमें AI को खुद एक **strict, निष्पक्ष auditor** की भूमिका निभानी है — जैसे कोई बाहरी quality-assurance expert पूरी साइट को लॉन्च से ठीक पहले अंतिम बार जाँच रहा हो। यह phase कोई नया feature नहीं जोड़ता, सिर्फ यह वेरीफाई करता है कि पिछले सभी 8 phases में जो कुछ बनाने का वादा किया गया था, वह वाकई सही तरीके से, consistently, और बिना किसी loophole के मौजूद है। यह document बहुत detailed checklist-फॉर्मेट में है ताकि कुछ भी छूटे नहीं।

## Goal of This Phase
Site को "launch-ready" घोषित करने से पहले हर एक कोने की बारीकी से जाँच करना — visual, functional, security, legal, performance, और experiential — ताकि कोई भी embarrassing bug, broken-link, security-loophole, या inconsistency आम जनता के सामने जाने से पहले पकड़ी और ठीक की जा सके। AI को इस phase में instructed किया जाता है कि वह **हर आइटम को individually verify करे और स्पष्ट रूप से PASS/FAIL रिपोर्ट करे**, सिर्फ "सब ठीक लग रहा है" जैसा सामान्य जवाब न दे।

## Instruction to AI for This Phase
इस दस्तावेज़ में दी गई हर checklist-item को एक स्वतंत्र, निष्पक्ष ऑडिटर की तरह जाँचें। हर item के लिए स्पष्ट रूप से बताएं कि वह पास हुआ या फेल, और अगर फेल हुआ तो उसे ठीक करें उसके बाद ही अगले आइटम पर बढ़ें। किसी भी आइटम को "assume करके पास" न मानें — वास्तव में जाँच करें। अंत में एक समेकित (consolidated) रिपोर्ट दें जिसमें बताया जाए कि साइट लॉन्च के लिए तैयार है या नहीं, और अगर नहीं तो बाकी किन चीज़ों पर काम बचा है।

---

## SECTION 1: Responsive & Visual Consistency Audit

- [ ] Homepage सही तरीके से रेंडर हो रहा है: Mobile (small, ~360-400px width), Tablet (~768px), Desktop (~1280px+), और Large Desktop (~1920px+) — हर breakpoint पर कोई element टूटा/overlap/cut-off नहीं होना चाहिए
- [ ] सभी अन्य pages (Weekly Outlook, Articles Listing, Article Detail, News, Kundli Form, About, Contact, Legal pages) भी उपरोक्त सभी breakpoints पर सही दिख रहे हैं
- [ ] Cosmic animation-layer (Phase 2) किसी भी breakpoint पर layout को नहीं तोड़ रहा, और mobile का lightweight-version वास्तव में mobile पर ही लोड हो रहा है, desktop का भारी-version mobile पर गलती से लोड तो नहीं हो रहा
- [ ] Typography (font-sizes, line-heights) हर breakpoint पर पढ़ने में आरामदायक है, कहीं टेक्स्ट overlapping, cut-off, या बहुत छोटा/बड़ा नहीं दिख रहा
- [ ] Color-contrast हर जगह (विशेषकर cosmic dark-background पर टेक्स्ट) पढ़ने-योग्य स्तर पर है — कहीं भी टेक्स्ट बैकग्राउंड में "खो" तो नहीं रहा
- [ ] Buttons, CTAs, form-fields सभी breakpoints पर सही आकार के हैं, मोबाइल पर टैप-करने-योग्य (finger-friendly) साइज़ में हैं
- [ ] Images हर जगह सही aspect-ratio में लोड हो रही हैं, कहीं stretched/distorted नहीं दिख रहीं
- [ ] Navigation (header/footer) हर breakpoint पर ठीक तरह काम कर रहा है, mobile-menu सही खुल/बंद हो रहा है

## SECTION 2: Functional/Interaction Audit

- [ ] Desktop orbit-visualization (Phase 2) सही ग्रह-स्थिति दिखा रहा है, hover-interaction काम कर रहा है, planet-to-data-widget connection सही तरीके से हाइलाइट हो रहा है
- [ ] Mobile cosmic-banner touch-ripple और scroll-triggered animations सही काम कर रहे हैं, बिना lag के
- [ ] Live Planetary Hour widget सही समय दिखा रहा है और अपडेट हो रहा है
- [ ] सभी live-data widgets (Nifty, Sensex, Bank Nifty, Gold, Crypto) सही, वर्तमान वैल्यू दिखा रहे हैं, "last updated" लेबल सही काम कर रहा है
- [ ] Market-closed की स्थिति में सही लेबलिंग ("Market Closed — Last Close") दिख रही है
- [ ] Kundli-form पूरी तरह सबमिट हो रहा है: validation, date-picker, location-autocomplete सब काम कर रहे हैं
- [ ] Kundli-submit के बाद instant-teaser-result सही तरीके से generate और प्रदर्शित हो रहा है
- [ ] WhatsApp click-to-chat बटन सही pre-filled-message के साथ सही नंबर पर खुल रहा है (मोबाइल और डेस्कटॉप दोनों पर टेस्ट करें)
- [ ] Call-request फॉर्म सही तरीके से lead capture कर रहा है और वह लीड Admin Panel के Lead-Dashboard में दिख रही है
- [ ] Articles Listing का filter, search, pagination/infinite-scroll सही काम कर रहा है
- [ ] Single Article Page पर emoji-reactions, social-share बटन, related-articles सही काम कर रहे हैं
- [ ] Submit-an-Article फॉर्म सही सबमिट हो रहा है और Admin Panel के moderation-queue में पहुँच रहा है
- [ ] News Page सही तरीके से items दिखा रहा है, source-links सही खुल रहे हैं
- [ ] Admin Panel: लॉगिन + 2FA सही काम कर रहा है, Daily-Thoughts editor publish/schedule दोनों सही काम कर रहे हैं, Article-moderation approve/reject सही काम कर रहा है, Lead-Dashboard सही डेटा दिखा रहा है और status-update सही सेव हो रहा है

## SECTION 3: Broken Link & Asset Check

- [ ] साइट के हर पेज पर मौजूद हर internal-link टेस्ट किया गया है — कोई भी 404/broken-link नहीं मिलना चाहिए
- [ ] हर बाहरी-लिंक (जैसे News sources, social-share) सही खुल रहा है, नए टैब में खुल रहा है (जहाँ उपयुक्त हो)
- [ ] सभी images सही लोड हो रही हैं, कोई broken-image-icon कहीं नहीं दिख रहा
- [ ] Footer में मौजूद सभी लिंक (Privacy Policy, Terms, Disclaimer, Contact, आदि) सही पेज पर ले जा रहे हैं
- [ ] कोई भी "placeholder" टेक्स्ट (जैसे "Lorem Ipsum", "Coming Soon" जो गलती से रह गया हो) साइट पर कहीं नहीं बचा है

## SECTION 4: Admin Security & Access Leak Check (अत्यंत महत्वपूर्ण)

- [ ] Admin-route का URL किसी भी public HTML-source, JavaScript-file, sitemap.xml, robots.txt, meta-tag, या footer/header में कहीं भी reference/hint नहीं हो रहा
- [ ] साइट के पूरे public-facing नेविगेशन को manually scan किया गया है यह पुष्टि करने के लिए कि admin की तरफ कोई संकेत (लिंक, बटन, कमेंट) नहीं जा रहा
- [ ] बिना लॉगिन किए सीधे admin-panel के किसी भी internal-page/URL पर जाने की कोशिश की गई है — हर कोशिश सही तरीके से रीडायरेक्ट/ब्लॉक हो रही है (login-page पर भेजा जा रहा है)
- [ ] Admin-API endpoints को बिना authentication के सीधे कॉल करने की कोशिश की गई है — सभी सही तरीके से unauthorized-response दे रहे हैं
- [ ] 2FA को bypass करने की कोई कोशिश (जैसे सीधे दूसरे स्टेप पर URL से जाना) असफल हो रही है
- [ ] Browser का "View Source"/Developer-tools से पूरे public pages के source-code में कोई hardcoded secret, API-key, या admin-hint मौजूद नहीं है

## SECTION 5: Form Validation & Data Security Audit

- [ ] Kundli-form में गलत/अधूरी जानकारी डालने पर उचित error-message दिख रहा है (frontend validation)
- [ ] सर्वर-साइड पर भी वही validation दोबारा हो रही है (frontend को bypass करके सीधे API-call करने पर भी गलत-डेटा reject हो रहा है)
- [ ] Submit-an-Article फॉर्म में भी वही दोहरी (frontend + backend) validation सही काम कर रही है
- [ ] सभी फॉर्म्स पर rate-limiting/CAPTCHA वास्तव में सक्रिय है (बार-बार जल्दी-जल्दी सबमिट करने की कोशिश करके टेस्ट करें)
- [ ] Kundli-form का sensitive डेटा (नाम, DOB, समय, स्थान, फ़ोन) डेटाबेस में encrypted रूप में स्टोर हो रहा है, plain-text में नहीं (बैकएंड से वेरीफाई करें)
- [ ] यह डेटा कहीं भी publicly-accessible किसी API-response या पेज पर एक्सपोज़ नहीं हो रहा

## SECTION 6: Legal & Disclaimer Visibility Audit

- [ ] Privacy Policy, Terms & Conditions, और Disclaimer पेज पूरी तरह लिखे गए और एक्सेसिबल हैं
- [ ] हर पेज जहाँ बाज़ार/निवेश/ज्योतिष से जुड़ी कोई भी जानकारी है (Homepage, Weekly-Outlook, Kundli-Result, Articles, News), वहाँ उचित, दिखाई देने योग्य डिस्क्लेमर मौजूद है
- [ ] Kundli-फॉर्म पर consent-checkbox मौजूद है और Privacy-Policy से सही लिंक हो रहा है
- [ ] कहीं भी साइट पर कोई ऐसी भाषा नहीं है जो specific stock-recommendation, buy/sell/target/stop-loss जैसी सलाह जैसी प्रतीत हो (Phase 0 के non-negotiable rule का अंतिम वेरिफिकेशन — पूरी साइट की टेक्स्ट-कंटेंट एक बार मैन्युअल रूप से इस नज़रिए से दोबारा पढ़ी जाए)

## SECTION 7: Performance Final Check

- [ ] Homepage और प्रमुख pages का loading-समय धीमे मोबाइल-नेटवर्क की स्थिति में स्वीकार्य सीमा में है
- [ ] Core Web Vitals (जैसा Phase 8 में सेट किया गया) संतोषजनक स्तर पर हैं
- [ ] किसी भी पेज पर animation की वजह से मुख्य-कंटेंट (जैसे लाइव-डेटा) का लोड होना देर से नहीं हो रहा
- [ ] Reduced-motion accessibility-setting चालू करने पर साइट सही तरीके से सरल-version दिखा रही है

## SECTION 8: Cross-Browser & Cross-Device Consistency

- [ ] साइट प्रमुख browsers (Chrome, Safari, Firefox, Edge) पर एक समान, बिना टूटे दिख रही है
- [ ] iOS और Android दोनों पर मोबाइल-अनुभव टेस्ट किया गया है (विशेषकर touch-ripple और scroll-animation के लिए, क्योंकि ये browser-engines में अलग व्यवहार कर सकते हैं)
- [ ] पुराने/कम-शक्तिशाली डिवाइस पर भी साइट उपयोग-योग्य बनी रहती है (graceful-degradation वास्तव में काम कर रहा है, सिर्फ theoretical नहीं)

## SECTION 9: SEO Final Check

- [ ] हर पेज का meta-title, meta-description यूनिक और सही सेट है
- [ ] sitemap.xml सही पेजों को शामिल कर रहा है, admin-route शामिल नहीं है
- [ ] robots.txt सही कॉन्फ़िगर है
- [ ] सभी images पर उचित alt-text मौजूद है
- [ ] Structured-data (Article schema, आदि) सही तरीके से इम्प्लीमेंट और वैलिड है (Google के structured-data-testing-tool के मापदंड अनुसार सोचें)

## SECTION 10: Content Integrity Check

- [ ] सभी 20 starter-articles सही तरीके से प्रकाशित हैं, सही categories और tags के साथ
- [ ] Daily-Thoughts फ़ीड पर कम से कम कुछ प्रारंभिक एंट्री मौजूद हैं ताकि लॉन्च के दिन सेक्शन खाली न दिखे
- [ ] Weekly Macro Outlook का कम से कम पहला entry तैयार और प्रकाशित है
- [ ] News Page पर कम से कम कुछ प्रारंभिक curated items मौजूद हैं
- [ ] हर जगह लेखक/author-attribution सही दिख रहा है

## SECTION 11: Final Consolidated Launch-Readiness Report

इस phase के अंत में AI को एक स्पष्ट, संक्षिप्त अंतिम रिपोर्ट तैयार करनी चाहिए जिसमें शामिल हो:
- कितने कुल checklist-items ऊपर दिए गए (सभी sections मिलाकर) PASS हुए और कितने initial-फेल के बाद ठीक किए गए
- क्या कोई ऐसा item बचा है जिसे ठीक नहीं किया जा सका (और क्यों, अगर कोई तकनीकी/निर्भरता-संबंधी सीमा हो)
- एक स्पष्ट, सीधा वाक्य: **"यह साइट लॉन्च के लिए तैयार है"** या **"यह साइट अभी लॉन्च के लिए तैयार नहीं है, निम्नलिखित चीज़ों पर पहले काम ज़रूरी है: [सूची]"**

## Explicitly Out of Scope for This Phase

यह phase कोई नया feature, डिज़ाइन-बदलाव, या कंटेंट नहीं जोड़ता। यह विशुद्ध रूप से एक verification/audit/bug-fixing phase है, पिछले सभी phases में जो वादा किया गया था उसकी पुष्टि करने के लिए।
