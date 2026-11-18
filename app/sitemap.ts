import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site/siteUrl";
import { buildSitemap } from "@/lib/teachings/buildSitemap";
import { getAllTeachings } from "@/lib/teachings/teachings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	return buildSitemap(await getAllTeachings(), SITE_URL);
}
