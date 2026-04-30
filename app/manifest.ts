import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const appManifest = {
    name: "Landly — Your guide to life in Korea",
    short_name: "Landly",
    description: "Helping foreigners navigate Korea with confidence.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f3f4f6",
    theme_color: "#0ea5e9",
    orientation: "portrait",
    categories: ["travel", "lifestyle", "utilities"],
    shortcuts: [
      {
        name: "SOS",
        short_name: "SOS",
        description: "Open emergency help",
        url: "/sos",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Offline Kit",
        short_name: "Offline",
        description: "Open saved offline essentials",
        url: "/offline",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Map Handoff",
        short_name: "Map",
        description: "Open route handoff center",
        url: "/navigate",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
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

  return appManifest as MetadataRoute.Manifest;
}
