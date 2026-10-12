# PHASE 8 — SECURITY & PERFORMANCE HARDENING

**File name suggestion:** `phase-8-security-performance-hardening.md`

## Context Summary From Previous Phases
Phase 0 से Phase 7 तक **Cosmic Finance** की पूरी functional साइट बन चुकी है — foundation/sitemap, design-system, cosmic animation-layer, live stock/gold/crypto data-integration, kundli-funnel (sensitive personal-data capture सहित), secure admin-panel, सभी public content-pages, और 20 starter-articles के साथ साइट launch-ready content से भरी हुई है। अब तक हर phase में security/performance के बुनियादी नियम बार-बार mention हुए हैं (हर phase के अंत में checklist में), लेकिन यह phase उन सभी को एक जगह इकट्ठा करके गहराई से, systematically audit और hardened करता है — क्योंकि यह साइट open-source है (कोड publicly visible होगा), sensitive personal data (birth-details, phone-numbers) collect करती है, और बिना किसी login-wall के पूरी तरह public-facing है। इसलिए एक dedicated, गंभीर security-pass बहुत ज़रूरी है launch से पहले। पिछले किसी भी phase की design, animation, data, funnel, या content-structure में कोई बदलाव इस phase का उद्देश्य नहीं है — यह सिर्फ उन सभी को मजबूत, सुरक्षित, और तेज़ बनाने के लिए है।

## Goal of This Phase
साइट के हर एक layer (frontend, backend, admin-panel, data-pipeline, forms) को इतना मजबूत बनाना कि (a) कोई भी malicious actor आसानी से exploit न कर सके, खासकर चूंकि कोड open-source है, (b) sensitive user-data (birth-details, phone-numbers) पूरी तरह सुरक्षित रहे, (c) साइट धीमे mobile-network पर भी तेज़ी से लोड हो, और (d) पूरा सिस्टम reliably बिना बार-बार टूटे चले, क्योंकि viral traffic कभी भी अचानक आ सकता है इस कॉन्सेप्ट की novelty को देखते हुए।

## 1. Open-Source Specific Security Considerations

- चूंकि पूरा codebase public रहेगा, यह सुनिश्चित करना अनिवार्य है कि **कोई भी credential, API key, database-connection-string, encryption-key, admin-password कभी भी repository में commit न हो** — यह environment-variables/secrets-manager के ज़रिए ही handle हो, और एक `.gitignore`/equivalent व्यवस्था से सुनिश्चित किया जाए कि environment-files कभी गलती से भी commit न हों
- एक स्पष्ट "Security Policy" दस्तावेज़ (जैसे open-source प्रोजेक्ट्स में `SECURITY.md` होता है) तैयार किया जाए, जिसमें बताया जाए कि अगर किसी को कोई vulnerability मिले तो वह कैसे responsibly report करे, ताकि community-contribution सुरक्षित तरीके से हो
- Repository में किसी भी sample/demo credential या placeholder-key का इस्तेमाल करते समय स्पष्ट रूप से mark किया जाए कि यह सिर्फ उदाहरण है, production-value नहीं
- Dependencies (third-party libraries/packages) की नियमित रूप से vulnerability-scanning की व्यवस्था हो, क्योंकि open-source प्रोजेक्ट में पुरानी/vulnerable dependencies एक आम कमजोरी होती हैं

## 2. Admin Panel — Deep Security Pass (Phase 5 पर आधारित, अब और गहराई से)

- Admin login route फिर से verify किया जाए कि वह truly किसी भी public navigation, sitemap.xml, robots.txt, या किसी meta-tag में reference नहीं हो रहा
- 2FA प्रणाली की पूरी तरह टेस्टिंग — बिना दूसरे factor के login संभव नहीं होना चाहिए, किसी भी परिस्थिति में
- Login-attempt rate-limiting और IP-based lockout की वास्तविक टेस्टिंग (जानबूझकर कई बार गलत password डालकर देखना कि लॉकआउट सही तरीके से ट्रिगर हो रहा है या नहीं)
- Admin-session tokens सुरक्षित, HttpOnly, और उचित expiry के साथ सेट हों ताकि session-hijacking का खतरा कम से कम रहे
- Admin-only API endpoints पर हर request पर authentication-check दोबारा verify किया जाए — यह सुनिश्चित करना कि कोई endpoint गलती से बिना protection के expose न हो (यह सबसे आम loophole होता है जहाँ UI तो protected दिखती है पर underlying API खुला रह जाता है)

## 3. Public-Facing Forms — Spam & Abuse Protection

- Kundli-form (Phase 4), Submit-an-Article form (Phase 6), और कोई भी अन्य public input-field — इन सभी पर:
  - CAPTCHA या equivalent bot-detection तंत्र लागू हो
  - IP-based rate-limiting हो ताकि एक ही स्रोत से बार-बार automated submissions न आ सकें
  - Server-side input-validation (सिर्फ frontend-validation पर निर्भर न रहें, क्योंकि frontend को bypass किया जा सकता है)
  - File-upload फीचर्स (अगर article-submission में इमेज अपलोड की सुविधा है) पर सख्त file-type whitelist और size-limit, साथ ही malicious-file-scanning का बुनियादी स्तर

## 4. Sensitive Data Protection (Birth-Details, Phone-Numbers)

- डेटाबेस में जन्म-तिथि, समय, स्थान, फ़ोन-नंबर जैसी जानकारी **encryption-at-rest** के साथ स्टोर हो, plain-text में कभी नहीं
- डेटा को transit में भी हमेशा HTTPS/TLS के ज़रिए भेजा जाए, कोई भी endpoint unencrypted (HTTP) पर काम न करे
- Database-access खुद भी सीमित (restricted) हो — सिर्फ ज़रूरी backend-services को ही एक्सेस मिले, कोई direct public-exposure न हो
- एक स्पष्ट डेटा-रिटेंशन नीति तय हो (कितने समय तक लीड-डेटा रखा जाएगा, पुराना/अप्रासंगिक डेटा कब हटाया जाएगा) — यह Privacy Policy page (अगला/बाद का phase) में भी दर्शाया जाए

## 5. Infrastructure & Deployment Security

- HTTPS हर जगह अनिवार्य (कोई भी पेज, कोई भी endpoint HTTP पर एक्सेसिबल न रहे) — automatic HTTP-to-HTTPS redirect सेट हो
- उचित security-headers लागू हों (जैसे Content-Security-Policy, X-Frame-Options, आदि) ताकि common web-attacks (XSS, clickjacking) से सुरक्षा मिले
- Server/hosting-environment पर firewall और सिर्फ ज़रूरी ports ही खुले रहें
- Regular, automated backups (डेटाबेस + अपलोड की गई मीडिया-फ़ाइलें) निर्धारित अंतराल पर हों, और backup-restore प्रक्रिया को वास्तव में टेस्ट किया जाए (सिर्फ backup लेना काफी नहीं, restore करके देखना भी ज़रूरी है)
- Localhost से production पर जाते समय environment-specific configuration (dev vs production) साफ-साफ अलग रखी जाए ताकि debug-mode या verbose-error-messages गलती से live-साइट पर expose न हों (यह जानकारी attackers के लिए बहुत उपयोगी होती है)

## 6. Performance Hardening — Desktop

- Phase 2 की cosmic-animation फिर से performance-profile की जाए — frame-rate, CPU/GPU usage चेक करके सुनिश्चित किया जाए कि average desktop/laptop पर भी स्मूद अनुभव मिले, सिर्फ high-end मशीन पर नहीं
- Images, fonts, और animation-assets का size-ऑडिट — unnecessarily बड़े assets compress/optimize किए जाएं
- Lazy-loading का व्यापक इस्तेमाल — जो भी content पहली नज़र (viewport) में नहीं है, वह तुरंत लोड न हो

## 7. Performance Hardening — Mobile (विशेष प्राथमिकता, चूंकि 80% traffic यहीं से है)

- हर पेज को धीमे भारतीय mobile-network (3G/धीमा 4G जैसी स्थिति सिमुलेट करके) पर टेस्ट किया जाए, सिर्फ तेज़ wifi पर नहीं
- Phase 2 की lightweight mobile-animation दोबारा verify हो कि यह वास्तव में हल्की है और बैटरी/डेटा ज़्यादा खर्च नहीं कर रही
- Critical रेंडरिंग पथ (critical rendering path) ऑप्टिमाइज़ हो ताकि "पहली नज़र में कुछ दिखना शुरू होने" का समय (First Contentful Paint) जितना हो सके कम रहे
- Core Web Vitals (Google के performance-मानक) के अनुसार साइट की जाँच हो — यह सिर्फ user-experience के लिए नहीं, बल्कि SEO rank के लिए भी ज़रूरी है

## 8. Live Data Pipeline Resilience (Phase 3 पर आधारित, अब स्ट्रेस-टेस्ट के साथ)

- यह सिमुलेट करके देखा जाए कि अगर अचानक बहुत ज़्यादा traffic (viral spike) आ जाए, तो data-caching-layer उस लोड को संभाल सकता है या नहीं, बिना बार-बार बाहरी स्रोतों को hit किए
- यह भी टेस्ट किया जाए कि अगर कोई डेटा-स्रोत पूरी तरह अनुपलब्ध हो जाए (जैसे एक पूरे दिन के लिए), तो साइट कैसा व्यवहार करती है — Phase 3 में तय किया गया graceful-fallback वास्तव में काम करता है या नहीं, असली परिस्थिति में verify किया जाए

## 9. Monitoring & Alerting

- एक बुनियादी monitoring-व्यवस्था हो जो बताए कि साइट ऊपर/नीचे (up/down) है, कोई critical-error आ रहा है या नहीं, और कोई data-source लगातार fail हो रहा है या नहीं (Phase 5 के Dashboard-Overview से जुड़ा हुआ)
- गंभीर समस्या की स्थिति में admin को तुरंत सूचना मिले (ईमेल/अन्य माध्यम से), ताकि साइट लंबे समय तक broken-state में न रहे बिना किसी के ध्यान दिए

## 10. SEO Technical Basics (Consolidation)

- हर पेज पर meta-title, meta-description सही तरीके से सेट (Phase 6 में पहले से कवर हुआ, यहाँ पूरे साइट पर एक बार फिर verify किया जाए)
- `sitemap.xml` और `robots.txt` सही तरीके से कॉन्फ़िगर हों — यह सुनिश्चित करते हुए कि admin-route कहीं भी इनमें शामिल न हो (फिर से दोहराया गया बिंदु, क्योंकि यह अत्यंत critical है)
- सभी images पर उचित alt-text हो, दोनों accessibility और SEO के लिए
- मोबाइल-फ्रेंडली टेस्ट (Google के मानकों के अनुसार) पास होना चाहिए

## What This Phase Should Produce

- पूरी तरह audit किया गया, hardened security-layer — कोई exposed credential, कोई unprotected admin-endpoint, कोई असुरक्षित-form न बचे
- Encrypted sensitive-data storage, HTTPS हर जगह, सही security-headers
- Tested, working automated-backup और restore-प्रक्रिया
- Desktop और Mobile दोनों पर वास्तविक परिस्थितियों में टेस्ट किया गया, ऑप्टिमाइज़्ड performance
- Stress-tested live-data pipeline जो traffic-spike और source-failure दोनों स्थितियों को गरिमा से संभाल सके
- बुनियादी monitoring/alerting व्यवस्था चालू
- पूरी साइट पर consolidated, verified SEO technical-basics

## Explicitly Out of Scope for This Phase

Terms & Conditions/Privacy Policy/Disclaimer pages की actual कानूनी भाषा अभी नहीं लिखनी (वह अगला phase हो सकता है, या साथ-साथ किसी legal-expert की मदद से तैयार हो)। यह phase एक टेक्निकल hardening-pass है, कोई नया feature या content इस phase में नहीं जोड़ा जा रहा।

## End-of-Phase Checklist (must confirm all before proceeding to Phase 9 — Final Audit)

- [ ] कोई credential/API-key/secret कहीं भी कोड में hardcode नहीं है, सब environment-variables के ज़रिए हैं
- [ ] Admin-route कहीं publicly linked/referenced नहीं है (sitemap, robots.txt, meta-tags सहित दोबारा वेरीफाई)
- [ ] 2FA, rate-limiting, lockout, session-security सभी वास्तविक टेस्टिंग से पास हो चुके हैं
- [ ] सभी public-forms पर CAPTCHA, rate-limiting, server-side validation लागू और टेस्टेड है
- [ ] सभी sensitive-data encrypted-at-rest और transit-में-सुरक्षित है
- [ ] HTTPS हर जगह अनिवार्य है, कोई HTTP-endpoint एक्सेसिबल नहीं
- [ ] उचित security-headers लागू हैं
- [ ] Automated backup चालू है और restore-प्रक्रिया वास्तव में टेस्ट की गई है
- [ ] Desktop और Mobile performance धीमे नेटवर्क/average-हार्डवेयर पर भी वास्तविक रूप से टेस्ट किया गया है
- [ ] Core Web Vitals स्वीकार्य सीमा में हैं
- [ ] Live-data pipeline traffic-spike और source-failure दोनों में टेस्ट किया गया है
- [ ] बुनियादी monitoring/alerting व्यवस्था काम कर रही है
- [ ] sitemap.xml, robots.txt, meta-tags, alt-text साइट-वाइड सही तरीके से सेट हैं
- [ ] इस phase में कुछ भी पिछले phases की design, content, या functionality को नहीं तोड़ता
