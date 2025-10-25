import type { Metadata } from "next";
import { seoKeywords, businessInfo } from "./metadata";

export function generatePageMetadata({
  title,
  description,
  keywords = [],
  path = "",
  image,
}: {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  image?: string;
}): Metadata {
  const baseUrl = 'https://jamu234.biz.id';
  const fullUrl = `${baseUrl}${path}`;
  const combinedKeywords = [...seoKeywords, ...keywords];

  return {
    title,
    description,
    keywords: combinedKeywords,

    alternates: {
      canonical: fullUrl,
    },

    openGraph: {
      title: `${title} | Jamu 234`,
      description,
      url: fullUrl,
      siteName: "Jamu 234 - Jamu Tradisional Herbal Sleman",
      images: [
        {
          url: image || "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "id_ID",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: `${title} | Jamu 234`,
      description,
      creator: "@jagadrenata",
      images: [image || "/twitter-image.jpg"],
    },
  };
}

// Schema.org structured data untuk Local Business
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: businessInfo.name,
  description: businessInfo.description,
  url: 'https://jamu234.biz.id',
  telephone: "+62-882-0061-86099",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. [Alamat Lengkap]", // Nanti update alamat yang benar
    addressLocality: "Sleman",
    addressRegion: "Yogyakarta",
    postalCode: "55XXX",
    addressCountry: "ID",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -7.7172,
    longitude: 110.3792,
  },
  openingHours: [
    "Mo-Su 08:00-17:00",
  ],
  servesCuisine: "Indonesian Traditional Herbal Drinks",
  priceRange: "$$",
    image: 'https://jamu234.biz.id/og-image.jpg',
};
