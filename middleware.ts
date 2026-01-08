import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	// Block access to /design-system in production
	if (
		request.nextUrl.pathname.startsWith("/design-system") &&
		process.env.NODE_ENV === "production"
	) {
		return NextResponse.rewrite(new URL("/404", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: "/design-system/:path*",
};
