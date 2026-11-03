"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ar" | "tr";
export type Direction = "ltr" | "rtl";

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
    tr: string;
  };
}

export const translations: Translations = {
  // ── Top Mini-Bar ──────────────────────────────────────────────
  announcementText: {
    en: "🤝 Now Live: Support your family back home with food baskets, heating fuel, and medical care — all verified and delivered.",
    ar: "🤝 متوفر الآن: ادعم عائلتك في الداخل بسلال غذائية، محروقات تدفئة، وخدمات صحية — كلها موثقة ومضمونة التوصيل.",
    tr: "🤝 Şimdi Aktif: Ülkedeki ailenize gıda kolileri, yakıt ve sağlık hizmeti gönderin — tamamı doğrulanmış ve garantili.",
  },
  emergencySupport: {
    en: "24/7 Family Support Line",
    ar: "خط مساندة العائلات 24/7",
    tr: "7/24 Aile Destek Hattı",
  },

  // ── Navigation ────────────────────────────────────────────────
  navHome: { en: "Home", ar: "الرئيسية", tr: "Ana Sayfa" },
  navServices: { en: "Services", ar: "الخدمات", tr: "Hizmetler" },
  navProviders: { en: "How It Works", ar: "كيف تعمل المنصة", tr: "Nasıl Çalışır" },
  navPricing: { en: "Pricing", ar: "الأسعار", tr: "Fiyatlandırma" },
  navAboutUs: { en: "About Us", ar: "من نحن", tr: "Hakkımızda" },
  navContact: { en: "Contact", ar: "تواصل معنا", tr: "İletişim" },
  login: { en: "Log In", ar: "تسجيل الدخول", tr: "Giriş Yap" },
  createAccount: { en: "Create Account", ar: "إنشاء حساب جديد", tr: "Hesap Oluştur" },
  continueGoogle: { en: "Continue with Google", ar: "المتابعة باستخدام Google", tr: "Google ile Devam Et" },
  signOut: { en: "Sign Out", ar: "تسجيل الخروج", tr: "Çıkış Yap" },

  // ── Hero Section (Humanitarian Focus) ─────────────────────────
  heroBadge: {
    en: "The Trusted Bridge Between Diaspora & Family",
    ar: "الجسر الموثوق بين المغترب وعائلته",
    tr: "Gurbetçi ile Ailesi Arasında Güvenilir Köprü",
  },
  heroTitle1: {
    en: "Your lifeline abroad.",
    ar: "سَنَدك في الغربة:",
    tr: "Gurbetteki Güvenceniz:",
  },
  heroTitle2: {
    en: "The safest way to support your loved ones.",
    ar: "أسهل وأأمن طريق لدعم عائلتك وأحبابك",
    tr: "Ailenizi desteklemenin en güvenli yolu.",
  },
  heroSubtitle: {
    en: "Sanad enables you to fulfill your family's essential needs back home with full reliability — from food baskets and heating fuel to medical services and solar energy solutions. Every delivery is verified, tracked, and guaranteed.",
    ar: "منصة سَنَد تتيح لك تلبية احتياجات عائلتك في الداخل بكل موثوقية.. من الغذاء إلى الطاقة والصحة. كل خدمة موثقة، مُتتبعة، ومضمونة الوصول.",
    tr: "Sanad, ülkenizdeki ailenizin temel ihtiyaçlarını güvenle karşılamanızı sağlar — gıda kolilerinden yakıt ve sağlık hizmetlerine, güneş enerjisi çözümlerine kadar. Her teslimat doğrulanmış ve garantilidir.",
  },
  heroCtaPrimary: {
    en: "Send Support Now",
    ar: "ابدأ بدعم عائلتك الآن",
    tr: "Şimdi Destek Gönderin",
  },
  heroCtaSecondary: {
    en: "Become a Verified Provider",
    ar: "انضم كمزود خدمة معتمد",
    tr: "Onaylı Hizmet Sağlayıcı Ol",
  },
  heroSearchPlaceholder: {
    en: "What does your family need? (Food, heating, medical, gifts…)",
    ar: "ما الذي تحتاجه عائلتك؟ (غذاء، تدفئة، طبي، هدايا...)",
    tr: "Ailenizin neye ihtiyacı var? (Gıda, yakıt, sağlık, hediye…)",
  },

  // ── Trust Badges ──────────────────────────────────────────────
  statUsers: {
    en: "15,000+ Families Supported",
    ar: "+15,000 عائلة مستفيدة",
    tr: "15.000+ Desteklenen Aile",
  },
  statProviders: {
    en: "800+ Verified Local Partners",
    ar: "+800 شريك محلي معتمد",
    tr: "800+ Onaylı Yerel İş Ortağı",
  },
  statEscrow: {
    en: "100% Delivery Guarantee",
    ar: "ضمان توصيل 100%",
    tr: "%100 Teslimat Garantisi",
  },

  // ── Service Categories ────────────────────────────────────────
  servicesHeading: {
    en: "How You Can Help Your Family",
    ar: "كيف يمكنك دعم عائلتك",
    tr: "Ailenize Nasıl Destek Olabilirsiniz",
  },
  servicesSubheading: {
    en: "Choose from our verified humanitarian and daily-life services. Every order is tracked in real-time and confirmed with photo proof of delivery.",
    ar: "اختر من خدماتنا الإنسانية والحياتية المعتمدة. كل طلب يُتتبع لحظياً ويُوثق بصور تسليم حقيقية.",
    tr: "Doğrulanmış insani ve günlük yaşam hizmetlerimiz arasından seçim yapın. Her sipariş gerçek zamanlı takip edilir ve fotoğraflı teslim onayı ile belgelenir.",
  },
  svcFood: { en: "Food Baskets", ar: "سلال غذائية", tr: "Gıda Kolileri" },
  svcFoodDesc: {
    en: "Curated essential food packages delivered directly to your family's doorstep. Fresh produce, staples, and seasonal items.",
    ar: "سلال غذائية أساسية مختارة بعناية تُوصل مباشرة إلى باب عائلتك. منتجات طازجة، مواد تموينية، وحاجات موسمية.",
    tr: "Özenle hazırlanmış temel gıda paketleri doğrudan ailenizin kapısına teslim edilir.",
  },
  svcFuel: { en: "Fuel & Heating", ar: "محروقات وتدفئة", tr: "Yakıt ve Isınma" },
  svcFuelDesc: {
    en: "Keep your family warm through harsh winters. Diesel, gas, and firewood delivery — verified and on schedule.",
    ar: "أبقِ عائلتك دافئة خلال الشتاء القاسي. توصيل مازوت، غاز، وحطب — موثق وبمواعيد منتظمة.",
    tr: "Zorlu kışlarda ailenizi sıcak tutun. Motorin, tüp ve odun teslimatı — doğrulanmış ve zamanında.",
  },
  svcSolar: { en: "Solar Energy Solutions", ar: "منظومات طاقة شمسية", tr: "Güneş Enerjisi Çözümleri" },
  svcSolarDesc: {
    en: "Sustainable energy for homes affected by power cuts. Solar panels, batteries, and professional installation.",
    ar: "طاقة مستدامة للمنازل المتضررة من انقطاع الكهرباء. ألواح شمسية، بطاريات، وتركيب احترافي.",
    tr: "Elektrik kesintilerinden etkilenen evler için sürdürülebilir enerji. Panel, batarya ve profesyonel kurulum.",
  },
  svcHealth: { en: "Health & Medical", ar: "خدمات صحية وطبية", tr: "Sağlık ve Tıbbi Hizmetler" },
  svcHealthDesc: {
    en: "Medical consultations, prescription medication, and emergency care coordination for your loved ones.",
    ar: "استشارات طبية، أدوية موصوفة، وتنسيق رعاية طارئة لأحبابك في الداخل.",
    tr: "Sevdikleriniz için tıbbi danışmanlık, reçeteli ilaç ve acil bakım koordinasyonu.",
  },
  svcGifts: { en: "Gifts & Perfumes", ar: "هدايا وعطورات", tr: "Hediyeler ve Parfümler" },
  svcGiftsDesc: {
    en: "Send joy and love across borders. Curated gift sets, premium perfumes, and occasion-specific presents.",
    ar: "أرسل الفرح والحب عبر الحدود. هدايا منتقاة، عطورات فاخرة، وتقديمات خاصة بالمناسبات.",
    tr: "Sınır ötesi sevgi gönderin. Özel hediye setleri, kaliteli parfümler ve özel gün hediyeleri.",
  },
  svcFlowers: { en: "Flower Bouquets", ar: "باقات ورد", tr: "Çiçek Buketleri" },
  svcFlowersDesc: {
    en: "Beautiful arrangements for birthdays, celebrations, condolences, or simply to say 'I miss you'.",
    ar: "تنسيقات جميلة لأعياد الميلاد، الاحتفالات، التعازي، أو فقط لتقول 'اشتقت لك'.",
    tr: "Doğum günleri, kutlamalar, taziyeler veya sadece 'seni özledim' demek için güzel düzenlemeler.",
  },
  svcMeals: { en: "Restaurant Meals & Delivery", ar: "وجبات طعام ومطاعم", tr: "Restoran Yemekleri" },
  svcMealsDesc: {
    en: "Order hot meals from trusted local restaurants. Family dinners, celebration feasts, or daily deliveries.",
    ar: "اطلب وجبات ساخنة من مطاعم محلية موثوقة. عشاء عائلي، ولائم احتفالية، أو توصيل يومي.",
    tr: "Güvenilir yerel restoranlardan sıcak yemek siparişi. Aile yemeği, kutlama ziyafeti veya günlük teslimat.",
  },

  // ── Features Section (updated) ────────────────────────────────
  featuresHeading: {
    en: "Built on Trust, Delivered with Heart",
    ar: "مبنية على الثقة، تُقدَّم من القلب",
    tr: "Güven Üzerine Kuruldu, Kalple Teslim Edilir",
  },
  featuresSubheading: {
    en: "Every service on Sanad is verified, tracked, and documented — because your family deserves certainty, not promises.",
    ar: "كل خدمة في سَنَد موثقة ومُتتبعة ومعتمدة — لأن عائلتك تستحق اليقين لا الوعود.",
    tr: "Sanad'daki her hizmet doğrulanmış, takip edilen ve belgelenmiştir — çünkü aileniz sözlerden fazlasını hak ediyor.",
  },
  feature1Title: { en: "Verified & Trusted Partners", ar: "شركاء موثقون ومعتمدون", tr: "Doğrulanmış ve Güvenilir Ortaklar" },
  feature1Desc: {
    en: "Every local partner undergoes rigorous identity, license, and quality checks before joining the Sanad network.",
    ar: "يخضع كل شريك محلي لفحص دقيق للهوية والترخيص والجودة قبل الانضمام لشبكة سَنَد.",
    tr: "Her yerel iş ortağı, Sanad ağına katılmadan önce sıkı kimlik, lisans ve kalite denetiminden geçer.",
  },
  feature2Title: { en: "Photo-Verified Delivery", ar: "توصيل موثق بالصور", tr: "Fotoğraflı Teslim Onayı" },
  feature2Desc: {
    en: "Every delivery is photographed and confirmed. You receive real-time proof that your support reached your family.",
    ar: "كل عملية تسليم تُصوَّر وتُوثق. تصلك صور لحظية تثبت وصول دعمك لعائلتك فعلياً.",
    tr: "Her teslimat fotoğraflanır ve onaylanır. Desteğinizin ailenize ulaştığını gerçek zamanlı olarak görürsünüz.",
  },
  feature3Title: { en: "Escrow-Protected Payments", ar: "مدفوعات محمية بالضمان", tr: "Emanet Korumalı Ödemeler" },
  feature3Desc: {
    en: "Your money is held securely until delivery is confirmed. Full refund if the order isn't fulfilled as agreed.",
    ar: "أموالك محفوظة بأمان حتى تأكيد التسليم. استرداد كامل إذا لم يتم تنفيذ الطلب كما هو متفق.",
    tr: "Paranız teslimat onaylanana kadar güvenle tutulur. Sipariş yerine getirilmezse tam iade yapılır.",
  },

  // ── About Us Modal ────────────────────────────────────────────
  aboutTitle: { en: "Who We Are — The Story of Sanad", ar: "من نحن — قصة منصة سَنَد", tr: "Biz Kimiz — Sanad'ın Hikayesi" },
  aboutSubtitle: {
    en: "Bridging Hearts Across Borders.",
    ar: "نصل القلوب عبر الحدود.",
    tr: "Sınırlar Ötesinde Kalpleri Birleştiriyoruz.",
  },
  aboutParagraph1: {
    en: "Sanad (سَنَد) is an Arabic word meaning 'a pillar of support, a sanctuary, and a steadfast guarantor'. We were founded by diaspora families who lived the agony of being unable to directly help their loved ones back home — and the fear of sending money through unverified channels.",
    ar: "كلمة 'سَنَد' تجسد معنى العون والمؤازرة والضمانة الراسخة. تأسست المنصة على يد عائلات مغتربة عاشت معاناة العجز عن دعم أحبابها مباشرة — وقلق إرسال الأموال عبر قنوات غير موثقة.",
    tr: "'Sanad' (سَنَد), Arapça'da 'güvenilir dayanak, destekçi ve güvence' anlamına gelir. Ülkelerindeki sevdiklerine doğrudan yardım edememenin ve doğrulanmamış kanallardan para gönderme korkusunun acısını yaşayan diaspora aileleri tarafından kurulmuştur.",
  },
  aboutParagraph2: {
    en: "Today, Sanad bridges the gap between thousands of families abroad and trusted local providers on the ground. We replace anxiety with certainty — every food basket, fuel delivery, and medical service is verified, photographed, and guaranteed.",
    ar: "اليوم، تشكل منصة سَنَد الجسر الموثوق بين آلاف العائلات في المهجر وشركاء محليين معتمدين على الأرض. نستبدل القلق باليقين — كل سلة غذاء، وقود، وخدمة طبية موثقة ومصورة ومضمونة.",
    tr: "Bugün Sanad, yurtdışındaki binlerce aile ile sahadaki güvenilir yerel sağlayıcılar arasında köprüdür. Endişeyi kesinliğe dönüştürüyoruz — her gıda kolisi, yakıt teslimatı ve sağlık hizmeti doğrulanmış ve garantilidir.",
  },

  // ── Footer & Contact ──────────────────────────────────────────
  footerTagline: {
    en: "The trusted platform connecting diaspora families with verified local services and humanitarian support.",
    ar: "المنصة الموثوقة التي تصل عائلات المهجر بخدمات محلية معتمدة ودعم إنساني.",
    tr: "Diaspora ailelerini doğrulanmış yerel hizmetler ve insani yardımla buluşturan güvenilir platform.",
  },
  quickLinks: { en: "Quick Links", ar: "روابط سريعة", tr: "Hızlı Bağlantılar" },
  legalLinks: { en: "Legal & Compliance", ar: "القانونية والامتثال", tr: "Yasal & Uyumluluk" },
  contactUs: { en: "Direct Contact", ar: "التواصل المباشر", tr: "Doğrudan İletişim" },
  privacyPolicy: { en: "Privacy Policy", ar: "سياسة الخصوصية", tr: "Gizlilik Politikası" },
  termsOfService: { en: "Terms & Conditions", ar: "الشروط والأحكام", tr: "Kullanım Koşulları" },
  allRightsReserved: {
    en: "All rights reserved. Powered by Sanad Technologies.",
    ar: "جميع الحقوق محفوظة. مشغّل بواسطة تقنيات سَنَد.",
    tr: "Tüm hakları saklıdır. Sanad Technologies tarafından güçlendirilmiştir.",
  },

  // ── Chatbot ───────────────────────────────────────────────────
  chatTitle: { en: "Sanad Family Concierge", ar: "مساعد سَنَد العائلي", tr: "Sanad Aile Asistanı" },
  chatOnline: { en: "Online • Ready to assist", ar: "متصل • مستعد لخدمتك فوراً", tr: "Çevrimiçi • Yardıma hazır" },
  chatPlaceholder: { en: "Type your question or request...", ar: "اكتب استفسارك أو طلبك هنا...", tr: "Sorunuzu veya talebinizi yazın..." },
  chatWelcome: {
    en: "Welcome to Sanad! How can we help you support your family today? (Food, Fuel, Medical, Gifts…)",
    ar: "أهلاً بك في سَنَد! كيف يمكننا مساعدتك في دعم عائلتك اليوم؟ (غذاء، محروقات، طبي، هدايا...)",
    tr: "Sanad'a hoş geldiniz! Ailenize nasıl destek olmak istersiniz? (Gıda, yakıt, sağlık, hediye…)",
  },
  chatSendTelegram: {
    en: "Open Direct Telegram Chat",
    ar: "فتح محادثة مباشرة عبر تيليجرام",
    tr: "Doğrudan Telegram Sohbeti Aç",
  },
};

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [direction, setDirection] = useState<Direction>("ltr");

  useEffect(() => {
    const savedLang = (localStorage.getItem("sanad_lang") as Language) || "ar";
    handleSetLanguage(savedLang);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguageState(lang);
    const dir: Direction = lang === "ar" ? "rtl" : "ltr";
    setDirection(dir);
    if (typeof window !== "undefined") {
      localStorage.setItem("sanad_lang", lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
    }
  };

  const t = (key: keyof typeof translations): string => {
    if (!translations[key]) return String(key);
    return translations[key][language] || translations[key].en;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        setLanguage: handleSetLanguage,
        t,
      }}
    >
      <div dir={direction} className={direction === "rtl" ? "font-arabic" : "font-sans"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
