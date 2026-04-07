import type { MetadataRoute } from "next";

import { siteContent } from "@/content/site-content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteContent.firm.name,
    short_name: "Nayyar & Nayyar",
    description: siteContent.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#08111F",
    theme_color: "#08111F",
    icons: [
      {
        src: "/icon.jpg",
        sizes: "512x512",
        type: "image/jpeg"
      }
    ]
  };
}
