# PHASE 5 — ADMIN PANEL (SECURE, SINGLE ADMIN)

**File name suggestion:** `phase-5-admin-panel.md`

## Context Summary From Previous Phases
Phase 0 ने **Cosmic Finance** की foundation तय की — no-login public site, sitemap, non-negotiable rules। Phase 1 ने design system बनाया। Phase 2 ने cosmic orbit visualization और interactivity जोड़ी। Phase 3 ने live stock/gold/crypto data को reliable caching के साथ integrate किया। Phase 4 ने birth-details form, instant teaser, और WhatsApp/Call lead-capture funnel बनाया। अब यह phase एक पूरी तरह secured, single-admin-only backend panel बनाता है जहाँ से site का इकलौता admin — बिना किसी public-facing login system के — daily thoughts post करे, articles moderate करे, news curate करे, leads manage करे, और basic analytics देखे। यह route कभी भी public navigation, sitemap, या footer में कहीं linked नहीं होना चाहिए, जैसा Phase 0 में rule तय हुआ था।

## Goal of This Phase
एक secure, reliable, और उपयोग में आसान admin backend बनाना जो non-technical admin भी आराम से रोज़ इस्तेमाल कर सके — daily posts लिखने से लेकर leads देखने तक — बिना किसी technical जटिलता के, और साथ ही यह सुनिश्चित करना कि यह panel किसी भी तरह से बाहर से access न किया जा सके, क्योंकि यही एकमात्र "privileged" entry point है पूरे open-source, no-login site में।

## 1. Admin Access & Security Architecture

- Admin panel का route path hidden/non-obvious हो (कहीं लिंक नहीं होना चाहिए, न header में, न footer में, न sitemap.xml में) — सिर्फ admin को सीधा URL पता हो
- Login सिस्टम ज़रूरी है सिर्फ इस एक admin के लिए — username/password के साथ **mandatory Two-Factor Authentication (2FA)** (जैसे authenticator app-based OTP), क्योंकि यह site open-source है और पूरा codebase public हो सकता है, इसलिए सिर्फ password-based security पर्याप्त नहीं
- Login attempts पर rate-limiting/lockout mechanism हो ताकि brute-force attack की कोशिश को रोका जा सके
- Session timeout logic हो — लंबे समय तक inactive रहने पर automatically logout हो जाए
- चूंकि codebase open-source है, admin credentials, secret keys, encryption keys कभी भी कोड में hardcode नहीं होने चाहिए — environment variables/secure secrets management के ज़रिए रखे जाएं, जैसा Phase 0 में rule तय हुआ था
- Admin panel का पूरा backend communication हमेशा HTTPS पर ही हो

## 2. Dashboard Home — Overview Screen

- Admin login करते ही एक साफ, useful overview screen दिखे — जैसे: आज कितने नए kundli-form leads आए, कितने articles moderation queue में pending हैं, कौन सी daily post सबसे ज़्यादा engagement पर है, कोई data-source अगर लगातार fail हो रहा है तो उसका alert (Phase 3 से जुड़ा monitoring)
- यह screen admin को रोज़ाना एक नज़र में बता दे कि आज क्या ध्यान देने लायक है, बजाय इसके कि उसे हर सेक्शन अलग-अलग खोलकर चेक करना पड़े

## 3. Daily Thoughts / Danayani Editor

- एक simple, clean rich-text editor हो (bold, italic, bullet points, image embed, video embed support सहित) जिससे admin अपने रोज़ के विचार/दृष्टिकोण आसानी से लिख सके, बिना किसी तकनीकी जटिलता के — जैसे किसी social media post जितना आसान अनुभव
- **"Publish Now"** और **"Schedule for Later"** दोनों विकल्प हों — ताकि admin रात में लिखकर सुबह किसी तय समय पर automatically publish होने के लिए set कर सके
- हर पोस्ट के साथ timestamp साफ दिखे, और पुरानी posts की एक आसानी से browse होने वाली list/history हो ताकि admin पुरानी एंट्री ढूंढ या एडिट कर सके
- Published होते ही यह पोस्ट homepage के "Live Feed" सेक्शन में सबसे ऊपर (Phase 1/2 में तय किए गए visual style में) अपने आप दिखनी शुरू हो जाए

## 4. Article Management (Admin-Written + User-Submitted)

- Admin खुद भी सीधे इसी पैनल से नए आर्टिकल लिख/पब्लिश कर सके (वही rich-text editor इस्तेमाल करते हुए, featured image अपलोड करने की सुविधा सहित)
- Phase 4 जैसा ही एक **public "Submit an Article" form** पहले से sitemap में मौजूद है (Phase 0) — वहां से आए सभी submissions यहाँ एक **"Pending Review" moderation queue** में दिखें
- Admin हर pending article को: पूरा पढ़ सके, ज़रूरत पड़ने पर edit कर सके, फिर Approve (publish) या Reject कर सके — कोई भी submission अपने आप live नहीं होनी चाहिए, जैसा Phase 0 का non-negotiable rule है
- Approve करते समय author का नाम/credit article के साथ attach हो (जैसा पहले discuss हुआ community-building angle के लिए)
- Reject करने पर एक वैकल्पिक internal note रखने का विकल्प हो (admin के अपने रिकॉर्ड के लिए, submitter को भेजना ज़रूरी नहीं)
- Spam/plagiarism जैसी चीज़ों के लिए admin को submission के साथ submitter की basic जानकारी (नाम, ईमेल, submission timestamp) भी दिखे ताकि वह अंदाज़ा लगा सके कि genuine content है या नहीं

## 5. News Section Management

- Admin manually news items add कर सके (title, short description, source link, relevant image) — शुरुआत में यह approach ज़्यादा भरोसेमंद रहेगा जैसा पहले चर्चा हुई थी
- अगर future में RSS feed-based automated aggregation जोड़ी जाए, तो भी एक **review queue** हो जहाँ automated feed से आई खबरें पहले admin की नज़र से गुज़रें, फिर ही publish हों — ताकि गलत/misleading news सीधे live न हो जाए
- News items को आसानी से edit/delete/reorder करने की सुविधा हो

## 6. Lead Management Dashboard (Phase 4 से जुड़ा हुआ)

- Phase 4 में capture हुए सभी leads (kundli form से जो WhatsApp/Call के लिए आगे बढ़े) यहाँ एक साफ, sortable list में दिखें — नाम, फ़ोन नंबर, जन्म-विवरण, submission समय, किस माध्यम से आगे बढ़े (WhatsApp/Call), और एक status-marking सुविधा (जैसे "New", "Contacted", "Converted", "Not Interested") ताकि admin अपनी follow-up प्रक्रिया track कर सके
- नया lead आते ही admin को एक त्वरित notification मिले (ईमेल और/या WhatsApp के ज़रिए) ताकि वह जल्दी follow-up कर सके — जैसा पहले चर्चा हुई थी, speed ही conversion की कुंजी है यहाँ
- सभी sensitive birth-data जानकारी सिर्फ इसी secured dashboard के भीतर दिखनी चाहिए, कहीं और एक्सपोज़ न हो (Phase 4 के privacy rules के अनुरूप)

## 7. Basic Analytics Panel

- Admin को यह देखने की सुविधा हो कि कौन सी daily post/article सबसे ज़्यादा views/engagement ले रही है, कितने leads रोज़ाना/साप्ताहिक आ रहे हैं, कौन सा traffic source (अगर track किया जा सके) ज़्यादा आ रहा है
- यह ज़्यादा complex analytics suite नहीं होनी चाहिए — सिर्फ उतना जो admin को content strategy और follow-up प्राथमिकता तय करने में मदद करे

## 8. Content Pre-Population Note (Phase 7 से जुड़ाव)

- यह panel इस तरह बनाया जाए कि आगे चलकर Phase 7 में तैयार किए जाने वाले 20 प्रारंभिक articles आसानी से bulk रूप से या एक-एक करके इसी Article Management सेक्शन के ज़रिए डाले जा सकें, बिना किसी अतिरिक्त तकनीकी बदलाव के

## 9. Security Hardening Specific to Admin Panel

- Admin panel की सभी API endpoints को public-facing endpoints से अलग सुरक्षा स्तर पर रखा जाए — हर request पर authentication-check अनिवार्य हो
- File/image upload फीचर (daily posts, articles, news के लिए) में file-type validation और size-limit हो ताकि malicious file upload का खतरा न रहे
- Regular automated backup व्यवस्था हो — सभी content (posts, articles, news) और सभी leads डेटा का, ताकि किसी तकनीकी समस्या की स्थिति में डेटा सुरक्षित रहे
- चूंकि साइट open-source है, admin panel का कोड सार्वजनिक रूप से दिखाई देगा — इसलिए logic भले ही public हो, पर actual admin credentials, API keys, encryption keys, database-access विवरण कभी भी repository में commit नहीं होने चाहिए

## What This Phase Should Produce

- एक पूरी तरह सुरक्षित, 2FA-protected, hidden-route admin login प्रणाली
- एक उपयोगी Dashboard Overview screen
- Daily Thoughts/Danayani editor जिसमें publish-now और schedule-later दोनों सुविधाएं हों
- पूर्ण Article Management सिस्टम — admin-written और user-submitted दोनों के लिए, moderation queue सहित
- News Section management सुविधा
- Lead Management Dashboard जो Phase 4 के fonnel से जुड़े सभी leads दिखाए, notification सिस्टम सहित
- एक बुनियादी Analytics Panel
- सभी ज़रूरी security hardening उपाय लागू

## Explicitly Out of Scope for This Phase

Terms & Conditions/Privacy Policy की पूरी legal content अभी नहीं लिखनी (वह अलग phase में आएगी)। 20 प्रारंभिक articles की actual content अभी नहीं लिखनी (Phase 7 में होगा)। Final security audit/penetration-testing जैसी गहराई अभी नहीं (Phase 8/9 में cover होगी) — यहाँ सिर्फ functional admin panel की बुनियादी सुरक्षा संरचना बनानी है।

## End-of-Phase Checklist (must confirm all before proceeding to Phase 6)

- [ ] Admin login hidden route पर है, कहीं publicly linked नहीं
- [ ] 2FA सही तरीके से काम कर रहा है
- [ ] Login rate-limiting/lockout और session timeout लागू है
- [ ] Dashboard Overview screen सही जानकारी दिखा रहा है
- [ ] Daily Thoughts editor publish-now और schedule-later दोनों के साथ काम कर रहा है, और published पोस्ट homepage पर सही तरीके से दिख रही है
- [ ] Article Management सिस्टम में moderation queue सही काम कर रहा है, कोई भी submission auto-publish नहीं हो रहा
- [ ] News management सेक्शन काम कर रहा है
- [ ] Lead Management Dashboard सभी Phase 4 leads सही तरीके से दिखा रहा है, status-marking और notification सिस्टम सहित
- [ ] Basic Analytics Panel सही डेटा दिखा रहा है
- [ ] File upload पर validation और size-limit लागू है
- [ ] Backup व्यवस्था चालू है
- [ ] कोई भी credential/secret key कोड में hardcode नहीं है
- [ ] इस phase में कुछ भी पिछले phases की design, animation, data, या funnel प्रणाली को नहीं तोड़ता
