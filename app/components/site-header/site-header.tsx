"use client";

import { usePathname } from "next/navigation";
import { labelTypography } from "@/app/components/ui/label/label";
import { Link } from "@/app/components/ui/link/link";
import { SiteMark } from "@/app/components/ui/site-mark";
import { ThemeToggle } from "@/app/components/ui/theme-toggle/theme-toggle";
import { cn } from "@/app/components/ui/utils/cn";

interface NavItem {
	label: string;
	href: string;
	isActive: (pathname: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
	{
		label: "Archive",
		href: "/archive",
		isActive: (p) => p.startsWith("/archive") || p.startsWith("/teaching"),
	},
	{ label: "Series", href: "/#series", isActive: (p) => p === "/" },
];

export function SiteHeader() {
	const pathname = usePathname() ?? "";

	return (
		<header>
			<div className="page-wrap flex min-h-[84px] items-center py-[18px]">
				{/* One shared text baseline for wordmark, name, nav and toggle; the mark centres on its own. */}
				<div className="flex w-full items-baseline justify-between gap-2 min-[481px]:gap-4">
					<Link
						href="/"
						variant="plain"
						aria-label="Teachings, Cameron Bristol — home"
						className="flex items-baseline gap-2 min-[481px]:gap-3.5"
					>
						<SiteMark size="md" detail="simple" className="self-center max-[480px]:size-6" />
						<span className="flex flex-wrap items-baseline gap-3.5">
							<span className="font-serif text-[23px] font-medium min-[481px]:text-[26px] italic leading-none text-text-primary">
								Teachings
							</span>
							<span
								className={cn(labelTypography, "hidden text-text-secondary min-[600px]:inline")}
							>
								Cameron Bristol
							</span>
						</span>
					</Link>
					<nav aria-label="Primary" className="flex items-baseline gap-2 min-[481px]:gap-7">
						{NAV_ITEMS.map((item) => {
							const active = item.isActive(pathname);
							return (
								<Link
									key={item.href}
									href={item.href}
									variant="plain"
									aria-current={active ? (pathname === "/" ? "true" : "page") : undefined}
									className={cn(
										labelTypography,
										"border-b py-1.5 tracking-[0.08em] min-[481px]:tracking-label",
										active
											? "border-accent text-text-primary"
											: "border-transparent text-text-secondary data-[hovered]:text-text-primary",
									)}
								>
									{item.label}
								</Link>
							);
						})}
						<ThemeToggle />
					</nav>
				</div>
			</div>
		</header>
	);
}
