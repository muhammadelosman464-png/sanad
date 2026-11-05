"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ar" | "tr";
export type Direction = "ltr" | "rtl";

interface Translations {
  [key: string]: { en: string; ar: string; tr: string };
}

export const translations: Translations = {
  announcementText: {
    en: "Now Live: Support your family back home with food baskets, heating fuel, and medical care.",
    ar: "\u0645\u062a\u0648\u0641\u0631 \u0627\u0644\u0622\u0646: \u0627\u062f\u0639\u0645 \u0639\u0627\u0626\u0644\u062a\u0643 \u0628\u0633\u0644\u0627\u0644 \u063a\u0630\u0627\u0626\u064a\u0629\u060c \u0645\u062d\u0631\u0648\u0642\u0627\u062a \u062a\u062f\u0641\u0626\u0629\u060c \u0648\u062e\u062f\u0645\u0627\u062a \u0635\u062d\u064a\u0629.",
    tr: "Artık Aktif: Ailenize gıda, yakıt ve sağlık hizmeti gönderin.",
  },
  emergencySupport: {
    en: "24/7 Family Support Line",
    ar: "\u062e\u0637 \u0645\u0633\u0627\u0646\u062f\u0629 \u0627\u0644\u0639\u0627\u0626\u0644\u0627\u062a 24/7",
    tr: "7/24 Aile Destek Hattı",
  },
  navHome: { en: "Home", ar: "\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629", tr: "Ana Sayfa" },
  navServices: { en: "Services", ar: "\u0627\u0644\u062e\u062f\u0645\u0627\u062a", tr: "Hizmetler" },
  navProviders: { en: "How It Works", ar: "\u0643\u064a\u0641 \u062a\u0639\u0645\u0644 \u0627\u0644\u0645\u0646\u0635\u0629", tr: "Nasıl Çalışır" },
  navPricing: { en: "Pricing", ar: "\u0627\u0644\u0623\u0633\u0639\u0627\u0631", tr: "Fiyatlandırma" },
  navAboutUs: { en: "About Us", ar: "\u0645\u0646 \u0646\u062d\u0646", tr: "Hakkımızda" },
  navContact: { en: "Contact", ar: "\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627", tr: "İletişim" },
  login: { en: "Log In", ar: "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644", tr: "Giriş Yap" },
  createAccount: { en: "Create Account", ar: "\u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628 \u062c\u062f\u064a\u062f", tr: "Hesap Oluştur" },
  continueGoogle: { en: "Continue with Google", ar: "\u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 Google", tr: "Google ile Devam Et" },
  signOut: { en: "Sign Out", ar: "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062e\u0631\u0648\u062c", tr: "Çıkış Yap" },
  heroBadge: {
    en: "The Trusted Bridge Between Diaspora & Family",
    ar: "\u0627\u0644\u062c\u0633\u0631 \u0627\u0644\u0645\u0648\u062b\u0648\u0642 \u0628\u064a\u0646 \u0627\u0644\u0645\u063a\u062a\u0631\u0628 \u0648\u0639\u0627\u0626\u0644\u062a\u0647",
    tr: "Gurbetçi ile Ailesi Arasında Güvenilir Köprü",
  },
  heroTitle1: {
    en: "Your lifeline abroad.",
    ar: "\u0633\u064e\u0646\u064e\u062f\u0643 \u0641\u064a \u0627\u0644\u063a\u0631\u0628\u0629:",
    tr: "Gurbetteki Güvenceniz:",
  },
  heroTitle2: {
    en: "The safest way to support your loved ones.",
    ar: "\u0623\u0633\u0647\u0644 \u0648\u0623\u0623\u0645\u0646 \u0637\u0631\u064a\u0642 \u0644\u062f\u0639\u0645 \u0639\u0627\u0626\u0644\u062a\u0643",
    tr: "Ailenizi desteklemenin en güvenli yolu.",
  },
  heroSubtitle: {
    en: "Sanad enables you to fulfill your family's essential needs back home — from food baskets and heating fuel to medical services. Every delivery is verified and guaranteed.",
    ar: "\u0645\u0646\u0635\u0629 \u0633\u064e\u0646\u064e\u062f \u062a\u062a\u064a\u062d \u0644\u0643 \u062a\u0644\u0628\u064a\u0629 \u0627\u062d\u062a\u064a\u0627\u062c\u0627\u062a \u0639\u0627\u0626\u0644\u062a\u0643 \u0628\u0643\u0644 \u0645\u0648\u062b\u0648\u0642\u064a\u0629.",
    tr: "Sanad, ailenizin temel ihtiyaçlarını güvenle karşılamanızı sağlar.",
  },
  heroCtaPrimary: {
    en: "Send Support Now",
    ar: "\u0627\u0628\u062f\u0623 \u0628\u062f\u0639\u0645 \u0639\u0627\u0626\u0644\u062a\u0643 \u0627\u0644\u0622\u0646",
    tr: "Şimdi Destek Gönderin",
  },
  heroCtaSecondary: {
    en: "Become a Verified Provider",
    ar: "\u0627\u0646\u0636\u0645 \u0643\u0645\u0632\u0648\u062f \u062e\u062f\u0645\u0629 \u0645\u0639\u062a\u0645\u062f",
    tr: "Onaylı Hizmet Sağlayıcı Ol",
  },
  heroSearchPlaceholder: {
    en: "What does your family need? (Food, heating, medical, gifts\u2026)",
    ar: "\u0645\u0627 \u0627\u0644\u0630\u064a \u062a\u062d\u062a\u0627\u062c\u0647 \u0639\u0627\u0626\u0644\u062a\u0643\u061f (\u063a\u0630\u0627\u0621\u060c \u062a\u062f\u0641\u0626\u0629\u060c \u0637\u0628\u064a\u060c \u0647\u062f\u0627\u064a\u0627...)",
    tr: "Ailenizin neye ihtiyacı var? (Gıda, yakıt, sağlık, hediye\u2026)",
  },
  statUsers: { en: "15,000+ Families Supported", ar: "+15,000 \u0639\u0627\u0626\u0644\u0629 \u0645\u0633\u062a\u0641\u064a\u062f\u0629", tr: "15.000+ Desteklenen Aile" },
  statProviders: { en: "800+ Verified Local Partners", ar: "+800 \u0634\u0631\u064a\u0643 \u0645\u062d\u0644\u064a \u0645\u0639\u062a\u0645\u062f", tr: "800+ Onaylı Yerel İş Ortağı" },
  statEscrow: { en: "100% Delivery Guarantee", ar: "\u0636\u0645\u0627\u0646 \u062a\u0648\u0635\u064a\u0644 100%", tr: "%100 Teslimat Garantisi" },
  servicesHeading: { en: "How You Can Help Your Family", ar: "\u0643\u064a\u0641 \u064a\u0645\u0643\u0646\u0643 \u062f\u0639\u0645 \u0639\u0627\u0626\u0644\u062a\u0643", tr: "Ailenize Nasıl Destek Olabilirsiniz" },
  servicesSubheading: {
    en: "Choose from our verified humanitarian services. Every order is tracked in real-time and confirmed with photo proof.",
    ar: "\u0627\u062e\u062a\u0631 \u0645\u0646 \u062e\u062f\u0645\u0627\u062a\u0646\u0627 \u0627\u0644\u0625\u0646\u0633\u0627\u0646\u064a\u0629 \u0627\u0644\u0645\u0639\u062a\u0645\u062f\u0629.",
    tr: "Doğrulanmış insani hizmetlerimizden seçin.",
  },
  svcFood: { en: "Food Baskets", ar: "\u0633\u0644\u0627\u0644 \u063a\u0630\u0627\u0626\u064a\u0629", tr: "Gıda Kolileri" },
  svcFoodDesc: { en: "Curated essential food packages delivered to your family.", ar: "\u0633\u0644\u0627\u0644 \u063a\u0630\u0627\u0626\u064a\u0629 \u0623\u0633\u0627\u0633\u064a\u0629 \u062a\u064f\u0648\u0635\u0644 \u0645\u0628\u0627\u0634\u0631\u0629 \u0625\u0644\u0649 \u0628\u0627\u0628 \u0639\u0627\u0626\u0644\u062a\u0643.", tr: "Ailenize teslim edilen temel gıda paketleri." },
  svcFuel: { en: "Fuel & Heating", ar: "\u0645\u062d\u0631\u0648\u0642\u0627\u062a \u0648\u062a\u062f\u0641\u0626\u0629", tr: "Yakıt ve Isınma" },
  svcFuelDesc: { en: "Diesel, gas, and firewood delivery — verified and on schedule.", ar: "\u062a\u0648\u0635\u064a\u0644 \u0645\u0627\u0632\u0648\u062a\u060c \u063a\u0627\u0632\u060c \u0648\u062d\u0637\u0628 \u2014 \u0645\u0648\u062b\u0642 \u0648\u0628\u0645\u0648\u0627\u0639\u064a\u062f \u0645\u0646\u062a\u0638\u0645\u0629.", tr: "Motorin, tüp ve odun teslimatı — doğrulanmış." },
  svcSolar: { en: "Solar Energy Solutions", ar: "\u0645\u0646\u0638\u0648\u0645\u0627\u062a \u0637\u0627\u0642\u0629 \u0634\u0645\u0633\u064a\u0629", tr: "Güneş Enerjisi Çözümleri" },
  svcSolarDesc: { en: "Solar panels, batteries, and professional installation.", ar: "\u0623\u0644\u0648\u0627\u062d \u0634\u0645\u0633\u064a\u0629\u060c \u0628\u0637\u0627\u0631\u064a\u0627\u062a\u060c \u0648\u062a\u0631\u0643\u064a\u0628 \u0627\u062d\u062a\u0631\u0627\u0641\u064a.", tr: "Panel, batarya ve profesyonel kurulum." },
  svcHealth: { en: "Health & Medical", ar: "\u062e\u062f\u0645\u0627\u062a \u0635\u062d\u064a\u0629 \u0648\u0637\u0628\u064a\u0629", tr: "Sağlık ve Tıbbi Hizmetler" },
  svcHealthDesc: { en: "Medical consultations, medication, and emergency care.", ar: "\u0627\u0633\u062a\u0634\u0627\u0631\u0627\u062a \u0637\u0628\u064a\u0629\u060c \u0623\u062f\u0648\u064a\u0629\u060c \u0648\u062a\u0646\u0633\u064a\u0642 \u0631\u0639\u0627\u064a\u0629 \u0637\u0627\u0631\u0626\u0629.", tr: "Tıbbi danışmanlık, ilaç ve acil bakım." },
  svcGifts: { en: "Gifts & Perfumes", ar: "\u0647\u062f\u0627\u064a\u0627 \u0648\u0639\u0637\u0648\u0631\u0627\u062a", tr: "Hediyeler ve Parfümler" },
  svcGiftsDesc: { en: "Curated gift sets and premium perfumes delivered.", ar: "\u0647\u062f\u0627\u064a\u0627 \u0645\u0646\u062a\u0642\u0627\u0629 \u0648\u0639\u0637\u0648\u0631\u0627\u062a \u0641\u0627\u062e\u0631\u0629.", tr: "Özel hediye setleri ve kaliteli parfümler." },
  svcFlowers: { en: "Flower Bouquets", ar: "\u0628\u0627\u0642\u0627\u062a \u0648\u0631\u062f", tr: "Çiçek Buketleri" },
  svcFlowersDesc: { en: "Beautiful arrangements for all occasions.", ar: "\u062a\u0646\u0633\u064a\u0642\u0627\u062a \u062c\u0645\u064a\u0644\u0629 \u0644\u062c\u0645\u064a\u0639 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0627\u062a.", tr: "Her otel için güzel düzenlemeler." },
  svcMeals: { en: "Restaurant Meals & Delivery", ar: "\u0648\u062c\u0628\u0627\u062a \u0637\u0639\u0627\u0645 \u0648\u0645\u0637\u0627\u0639\u0645", tr: "Restoran Yemekleri" },
  svcMealsDesc: { en: "Hot meals from trusted local restaurants.", ar: "\u0648\u062c\u0628\u0627\u062a \u0633\u0627\u062e\u0646\u0629 \u0645\u0646 \u0645\u0637\u0627\u0639\u0645 \u0645\u062d\u0644\u064a\u0629 \u0645\u0648\u062b\u0648\u0642\u0629.", tr: "Yerel restoranlardan sıcak yemekler." },
  featuresHeading: { en: "Built on Trust, Delivered with Heart", ar: "\u0645\u0628\u0646\u064a\u0629 \u0639\u0644\u0649 \u0627\u0644\u062b\u0642\u0629\u060c \u062a\u064f\u0642\u062f\u064e\u0651\u0645 \u0645\u0646 \u0627\u0644\u0642\u0644\u0628", tr: "Güven Üzerine Kuruldu, Kalple Teslim Edilir" },
  featuresSubheading: { en: "Every service on Sanad is verified, tracked, and documented.", ar: "\u0643\u0644 \u062e\u062f\u0645\u0629 \u0641\u064a \u0633\u064e\u0646\u064e\u062f \u0645\u0648\u062b\u0642\u0629 \u0648\u0645\u064f\u062a\u062a\u0628\u0639\u0629 \u0648\u0645\u0639\u062a\u0645\u062f\u0629.", tr: "Sanad'daki her hizmet doğrulanmış ve takip edilmektedir." },
  feature1Title: { en: "Verified & Trusted Partners", ar: "\u0634\u0631\u0643\u0627\u0621 \u0645\u0648\u062b\u0642\u0648\u0646 \u0648\u0645\u0639\u062a\u0645\u062f\u0648\u0646", tr: "Doğrulanmış ve Güvenilir Ortaklar" },
  feature1Desc: { en: "Every local partner undergoes rigorous identity and quality checks.", ar: "\u064a\u062e\u0636\u0639 \u0643\u0644 \u0634\u0631\u064a\u0643 \u0645\u062d\u0644\u064a \u0644\u0641\u062d\u0635 \u062f\u0642\u064a\u0642 \u0644\u0644\u0647\u0648\u064a\u0629 \u0648\u0627\u0644\u062c\u0648\u062f\u0629.", tr: "Her yerel ortak sıkı kimlik ve kalite denetiminden geçer." },
  feature2Title: { en: "Photo-Verified Delivery", ar: "\u062a\u0648\u0635\u064a\u0644 \u0645\u0648\u062b\u0642 \u0628\u0627\u0644\u0635\u0648\u0631", tr: "Fotoğraflı Teslim Onayı" },
  feature2Desc: { en: "Every delivery is photographed and confirmed in real-time.", ar: "\u0643\u0644 \u0639\u0645\u0644\u064a\u0629 \u062a\u0633\u0644\u064a\u0645 \u062a\u064f\u0635\u0648\u064e\u0651\u0631 \u0648\u062a\u064f\u0648\u062b\u064e\u0651\u0642 \u0644\u062d\u0638\u064a\u0627\u064b.", tr: "Her teslimat gerçek zamanlı fotoğraflanır." },
  feature3Title: { en: "Escrow-Protected Payments", ar: "\u0645\u062f\u0641\u0648\u0639\u0627\u062a \u0645\u062d\u0645\u064a\u0629 \u0628\u0627\u0644\u0636\u0645\u0627\u0646", tr: "Emanet Korumalı Ödemeler" },
  feature3Desc: { en: "Your money is held securely until delivery is confirmed.", ar: "\u0623\u0645\u0648\u0627\u0644\u0643 \u0645\u062d\u0641\u0648\u0638\u0629 \u0628\u0623\u0645\u0627\u0646 \u062d\u062a\u0649 \u062a\u0623\u0643\u064a\u062f \u0627\u0644\u062a\u0633\u0644\u064a\u0645.", tr: "Paranız teslimat onaylanana kadar güvenle tutulur." },
  aboutTitle: { en: "Who We Are", ar: "\u0645\u0646 \u0646\u062d\u0646", tr: "Biz Kimiz" },
  aboutSubtitle: { en: "Bridging Hearts Across Borders.", ar: "\u0646\u0635\u0644 \u0627\u0644\u0642\u0644\u0648\u0628 \u0639\u0628\u0631 \u0627\u0644\u062d\u062f\u0648\u062f.", tr: "Sınırlar Ötesinde Kalpleri Birleştiriyoruz." },
  aboutParagraph1: { en: "Sanad was founded by diaspora families who lived the difficulty of helping loved ones back home.", ar: "\u062a\u0623\u0633\u0633\u062a \u0633\u064e\u0646\u064e\u062f \u0639\u0644\u0649 \u064a\u062f \u0639\u0627\u0626\u0644\u0627\u062a \u0645\u063a\u062a\u0631\u0628\u0629 \u0639\u0627\u0634\u062a \u0645\u0639\u0627\u0646\u0627\u0629 \u0627\u0644\u0639\u062c\u0632 \u0639\u0646 \u062f\u0639\u0645 \u0623\u062d\u0628\u0627\u0626\u0647\u0627.", tr: "Sanad, sevdiklerine yardım etmekte güçlük çeken diaspora aileleri tarafından kuruldu." },
  aboutParagraph2: { en: "Today, Sanad bridges thousands of families with trusted local providers.", ar: "\u0627\u0644\u064a\u0648\u0645\u060c \u062a\u0634\u0643\u0644 \u0633\u064e\u0646\u064e\u062f \u0627\u0644\u062c\u0633\u0631 \u0628\u064a\u0646 \u0622\u0644\u0627\u0641 \u0627\u0644\u0639\u0627\u0626\u0644\u0627\u062a \u0648\u0634\u0631\u0643\u0627\u0621 \u0645\u062d\u0644\u064a\u064a\u0646 \u0645\u0639\u062a\u0645\u062f\u064a\u0646.", tr: "Bugün Sanad, binlerce aileyi güvenilir yerel sağlayıcılarla buluşturuyor." },
  footerTagline: { en: "The trusted platform connecting diaspora families with verified local services.", ar: "\u0627\u0644\u0645\u0646\u0635\u0629 \u0627\u0644\u0645\u0648\u062b\u0648\u0642\u0629 \u0644\u062a\u0648\u0635\u064a\u0644 \u0639\u0627\u0626\u0644\u0627\u062a \u0627\u0644\u0645\u0647\u062c\u0631 \u0628\u062e\u062f\u0645\u0627\u062a \u0645\u062d\u0644\u064a\u0629 \u0645\u0639\u062a\u0645\u062f\u0629.", tr: "Diaspora ailelerini doğrulanmış yerel hizmetlerle buluşturan güvenilir platform." },
  quickLinks: { en: "Quick Links", ar: "\u0631\u0648\u0627\u0628\u0637 \u0633\u0631\u064a\u0639\u0629", tr: "Hızlı Bağlantılar" },
  legalLinks: { en: "Legal & Compliance", ar: "\u0627\u0644\u0642\u0627\u0646\u0648\u0646\u064a\u0629 \u0648\u0627\u0644\u0627\u0645\u062a\u062b\u0627\u0644", tr: "Yasal & Uyumluluk" },
  contactUs: { en: "Direct Contact", ar: "\u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0627\u0644\u0645\u0628\u0627\u0634\u0631", tr: "Doğrudan İletişim" },
  privacyPolicy: { en: "Privacy Policy", ar: "\u0633\u064a\u0627\u0633\u0629 \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629", tr: "Gizlilik Politikası" },
  termsOfService: { en: "Terms & Conditions", ar: "\u0627\u0644\u0634\u0631\u0648\u0637 \u0648\u0627\u0644\u0623\u062d\u0643\u0627\u0645", tr: "Kullanım Koşulları" },
  allRightsReserved: { en: "All rights reserved. Powered by Sanad Technologies.", ar: "\u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0645\u062d\u0641\u0648\u0638\u0629. \u0645\u0634\u063a\u0651\u0644 \u0628\u0648\u0627\u0633\u0637\u0629 \u062a\u0642\u0646\u064a\u0627\u062a \u0633\u064e\u0646\u064e\u062f.", tr: "Tüm hakları saklıdır. Sanad Technologies tarafından güçlendirilmiştir." },
  chatTitle: { en: "Sanad Family Concierge", ar: "\u0645\u0633\u0627\u0639\u062f \u0633\u064e\u0646\u064e\u062f \u0627\u0644\u0639\u0627\u0626\u0644\u064a", tr: "Sanad Aile Asistanı" },
  chatOnline: { en: "Online - Ready to assist", ar: "\u0645\u062a\u0635\u0644 - \u0645\u0633\u062a\u0639\u062f \u0644\u062e\u062f\u0645\u062a\u0643", tr: "Çevrimiçi - Yardıma hazır" },
  chatPlaceholder: { en: "Type your question or request...", ar: "\u0627\u0643\u062a\u0628 \u0627\u0633\u062a\u0641\u0633\u0627\u0631\u0643 \u0623\u0648 \u0637\u0644\u0628\u0643...", tr: "Sorunuzu yazın..." },
  chatWelcome: { en: "Welcome to Sanad! How can we help support your family today?", ar: "\u0623\u0647\u0644\u0627\u064b \u0628\u0643 \u0641\u064a \u0633\u064e\u0646\u064e\u062f! \u0643\u064a\u0641 \u064a\u0645\u0643\u0646\u0646\u0627 \u0645\u0633\u0627\u0639\u062f\u062a\u0643 \u0641\u064a \u062f\u0639\u0645 \u0639\u0627\u0626\u0644\u062a\u0643 \u0627\u0644\u064a\u0648\u0645\u061f", tr: "Sanad'a hoş geldiniz! Ailenize nasıl destek olmak istersiniz?" },
  chatSendTelegram: { en: "Open Telegram Chat", ar: "\u0641\u062a\u062d \u0645\u062d\u0627\u062f\u062b\u0629 \u062a\u064a\u0644\u064a\u062c\u0631\u0627\u0645", tr: "Telegram Sohbeti Aç" },
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const savedLang = (localStorage.getItem("sanad_lang") as Language) || "ar";
    handleSetLanguage(savedLang);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

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

  if (!mounted) {
    return (
      <LanguageContext.Provider
        value={{ language: "en", direction: "ltr", setLanguage: () => {}, t: (k) => String(k) }}
      >
        <div dir="ltr" className="font-sans min-h-screen" />
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage: handleSetLanguage, t }}>
      <div dir={direction} className={direction === "rtl" ? "font-arabic" : "font-sans"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}