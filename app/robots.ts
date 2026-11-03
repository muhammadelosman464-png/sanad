import { MetadataRoute } from "next";

/**
 * Next.js robots — auto-generates /robots.txt for SEO crawlers.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/"],
    },
    sitemap: "https://sanad.app/sitemap.xml", // ← Replace with your production domain
  };
}
