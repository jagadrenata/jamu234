import type { Metadata } from "next";

export const siteMetadata: Metadata = {
  // Title ideal: 50–60 karakter
  title: {
    default: "Jamu 234 – Jamu Tradisional Herbal di Sleman Yogyakarta",
    template: "%s | Jamu 234 – Jamu Tradisional Herbal Sleman",
  },

  description:
    "Jamu 234 menghadirkan jamu tradisional dari empon-empon asli berkualitas tanpa pemanis buatan, menjaga daya tahan dan kebugaran tubuh secara alami.",

  metadataBase: new URL("https://jamu234.biz.id"),
  alternates: {
    canonical: "https://jamu234.biz.id",
  },

  keywords: [
    // brand keywords
    "Jamu 234",
    "Jamu234",
    "Jamu Bu Marmur",
    "Jamu Jagad",

    // lokal keywords
    "jamu tradisional Sleman",
    "jamu herbal Yogyakarta",
    "toko jamu Sleman",
    "jamu tradisional Yogyakarta",
    "jamu asli Sleman",
    "jamu herbal DIY",
    "warung jamu Sleman",

    // product keywords
    "jamu herbal tradisional",
    "minuman herbal sehat",
    "empon-empon asli",
    "jamu tanpa pemanis buatan",
    "jamu sehat alami",
    "obat herbal tradisional",
    "ramuan herbal Indonesia",

    // health keywords
    "jamu untuk kesehatan",
    "jamu untuk imunitas",
    "jamu untuk kebugaran",
    "jamu untuk daya tahan tubuh",
    "minuman sehat herbal",
    "ramuan tradisional sehat",
    "jamu anti virus",
    "jamu penambah stamina",

    // indonesian traditional keywords
    "jamu Indonesia asli",
    "warisan nenek moyang",
    "budaya jamu Jawa",
    "tradisi herbal Indonesia",
    "jamu racikan sendiri",
    "jamu fresh daily",
    "jamu siap minum",
  ],

  // informasi kreator
  authors: [
    { name: "Jagad Renata", url: "https://renn.biz.id" },
  ],
  creator: "Jagad Renata & Muhammad Qurtifa Wijaya",
  publisher: "Jamu 234 - Renn Sites",

  // Open Graph (Masih Template)
  openGraph: {
    title: "Jamu 234 – Jamu Tradisional Herbal di Sleman Yogyakarta",
    description:
      "Nikmati jamu tradisional Jamu 234, diracik dari empon-empon pilihan tanpa pemanis buatan, solusi alami untuk mendukung kesehatan dan kebugaran tubuh.",
    url: "https://jamu234.biz.id",
    siteName: "Jamu 234 - Jamu Tradisional Herbal Sleman",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jamu 234 – Jamu Tradisional Herbal di Sleman Yogyakarta",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  // Twitter Card (Masih Template)
  twitter: {
    card: "summary_large_image",
    title: "Jamu 234 – Jamu Tradisional Herbal Berkualitas di Sleman Yogyakarta",
    description:
      "Nikmati jamu tradisional Jamu 234, diracik dari empon-empon pilihan tanpa pemanis buatan, solusi alami untuk mendukung kesehatan dan kebugaran tubuh.",
    creator: "@jagadrenata",
    images: ["/twitter-image.jpg"],
  },

  // Ikon & manifest (masih template??)
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/234.png", type: "image/png", sizes: "48x48" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/web-app-manifest-192x192.png", sizes: "192x192" }],
  },

  manifest: "/manifest.json",

  // Robots.txt & indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Additional SEO metadata
  category: "Health & Wellness",
  classification: "Traditional Herbal Medicine",

  // Additional metadata untuk local SEO
  other: {
    "geo.region": "ID-DI",
    "geo.placename": "Sleman, Yogyakarta",
    "geo.position": "-7.7172;110.3792", // Koordinat Sleman
    ICBM: "-7.7172, 110.3792",
    "business:contact_data:street_address": "Sleman, Yogyakarta",
    "business:contact_data:locality": "Sleman",
    "business:contact_data:region": "Yogyakarta",
    "business:contact_data:country_name": "Indonesia",
  },
};

// Export individual sections untuk flexibility
export const seoKeywords = [
  "Jamu 234",
  "Jamu234",
  "Jamu Bu Marmur",
  "Jamu Jagad",
  "jamu tradisional Sleman",
  "jamu herbal Yogyakarta",
  "toko jamu Sleman",
  "jamu herbal tradisional",
  "minuman herbal sehat",
  "empon-empon asli",
  "jamu untuk kesehatan",
  "jamu untuk imunitas",
  "jamu Indonesia asli",
];

export const businessInfo = {
  name: "Jamu 234",
  description: "Toko jamu tradisional herbal berkualitas di Sleman Yogyakarta",
  location: "Sleman, Yogyakarta, Indonesia",
  specialty: "Jamu herbal tradisional tanpa pemanis buatan",
  target: "Kesehatan dan kebugaran keluarga Indonesia",
};
