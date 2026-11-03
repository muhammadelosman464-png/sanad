import { MetadataRoute } from "next";

/**
 * Next.js PWA manifest — enables "Add to Home Screen" on mobile devices.
 * Auto-generates /manifest.webmanifest.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sanad (سَنَد) — Family Support Platform",
    short_name: "Sanad سَنَد",
    description:
      "Support your family back home with food, fuel, medical care and more — all verified and delivered.",
    start_url: "/",
    display: "standalone",
    background_color: "#090d16",
    theme_color: "#0284c7",
    orientation: "portrait",
    icons: [
      {
        src: "/logo.jpg.jpg",
        sizes: "any",
        type: "image/jpeg",
      },
    ],
  };
}
