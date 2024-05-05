import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = new URL(request.url).pathname;
  if (!(process.env.NODE_ENV === "development")) {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.rewrite(
        new URL("/dashboard/under-construction", request.url)
      );
    }
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
