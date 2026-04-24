import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Landly — Your guide to life in Korea",
    short_name: "Landly",
    description: "Helping foreigners navigate Korea with confidence.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f4f6",
    theme_color: "#0ea5e9",
    orientation: "portrait",
    categories: ["travel", "lifestyle", "utilities"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
