/*import { NextResponse } from 'next/server';

const allowedIps = ['203.171.27.84']; // Danh sách IP được phép

export function middleware(req) {
    const clientIp = req.ip || req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip");

    if (!clientIp || !allowedIps.includes(clientIp)) {
        return new NextResponse('Access Denied', { status: 403 });
    }

    if (req.nextUrl.protocol === "http:") {
        return NextResponse.redirect(`https://${req.nextUrl.host}${req.nextUrl.pathname}`, 301);
    }

    return NextResponse.next();
}

// Áp dụng middleware cho tất cả routes
export const config = {
    matcher: '/:path*',
};*/
