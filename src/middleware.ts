import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt";

// this function can be marked async if using await inside
export async function middleware (request: NextRequest) {
    // const token = await getToken({ req: request });
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const url = request.nextUrl;

    if(token && (
        url.pathname === '/' ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/verify')
    )) {
        console.log('everything fine');
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if(!token && url.pathname.startsWith('/dashboard')){
        console.log('did this happen?');
        return NextResponse.redirect(new URL('sign-in', request.url));
    }

    return NextResponse.next();
}

// Match specific paths for middleware
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
}