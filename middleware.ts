import { NextRequest, NextResponse } from "next/server";

function isAdminFromCookie(req: NextRequest) {
    const raw = req.cookies.get("teera_user")?.value;
    if (!raw) return false;

    try {
        const parsed = JSON.parse(raw);
        const u = parsed?.user ?? parsed;
        return u?.role === "A";
    } catch {
        return false;
    }
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // กันเฉพาะ /admin
    if (pathname.startsWith("/admin")) {
        const ok = isAdminFromCookie(req);
        if (!ok) {
            const url = req.nextUrl.clone();
            url.pathname = "/login";
            url.searchParams.set("next", pathname);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};