import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const pathname = req.nextUrl.pathname;
    
    const isPublicPage = pathname === "/";
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
    
    if ((isPublicPage || isAuthPage) && isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (!isAuth && !isPublicPage && !isAuthPage) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const response = NextResponse.next();
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    
    return response;
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/alumnos/:path*",
    "/evaluaciones/:path*",
    "/agenda/:path*",
    "/estadisticas/:path*",
    "/configuracion/:path*",
    "/test-resultados/:path*",
    "/login",
    "/register",
  ],
};