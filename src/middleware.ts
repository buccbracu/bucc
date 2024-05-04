import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.rewrite(new URL("/under-construction", request.url));
}

export const config = {
  matcher: [
    "/about/:path*",
    "/events",
    "/publications/:path*",
    "/gallery",
    "/contact",
    "/login",
    "/registration",
  ],
};
