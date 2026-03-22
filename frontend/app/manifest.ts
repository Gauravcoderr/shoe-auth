import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SneakerAuth — AI Shoe Authentication",
    short_name: "SneakerAuth",
    description: "AI-powered sneaker authentication. Check if your shoes are real or fake in seconds.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#111111",
    orientation: "portrait",
    categories: ["lifestyle", "shopping", "utilities"],
    icons: [
      {
        src: "/pwa-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/pwa-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    screenshots: [],
    shortcuts: [
      {
        name: "Start a Check",
        short_name: "Check",
        description: "Authenticate a sneaker",
        url: "/check",
      },
    ],
  };
}
