import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site/siteUrl";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: { userAgent: "*", allow: "/", disallow: "/design-system" },
		sitemap: `${SITE_URL}/sitemap.xml`,
	};
}
