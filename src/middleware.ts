import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.rewrite(new URL("/under-construction", request.url));
}

export const config = {
  matcher: [
    "/about",
    "/oca",
    "/executive-body",
    "/departments",
    "/advisors",
    "/former-ebs",
    "/events",
    "/press-releases",
    "/newsletters",
    "/blogs",
    "/magazine",
    "/gallery",
    "/contact",
    "/login",
    "/registration",
  ],
};
