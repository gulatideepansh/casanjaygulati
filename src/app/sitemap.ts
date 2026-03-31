import type { MetadataRoute } from "next";

import { siteContent } from "@/content/site-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = `https://${siteContent.firm.domain}`;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1
    }
  ];
}
