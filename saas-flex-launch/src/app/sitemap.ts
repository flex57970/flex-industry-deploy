import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return [
    { url: `${base}/`, priority: 1.0, changeFrequency: "weekly" },
    { url: `${base}/pricing`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/terms`, priority: 0.3, changeFrequency: "yearly" },
    { url: `${base}/privacy`, priority: 0.3, changeFrequency: "yearly" },
    { url: `${base}/refund`, priority: 0.3, changeFrequency: "yearly" },
  ];
}
