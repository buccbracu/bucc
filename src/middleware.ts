import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.rewrite(new URL("/under-construction", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/about/:path*",
    "/events",
    "/publications/:path*",
    "/gallery",
    "/contact",
    "/login",
    "/registration",
  ],
};
