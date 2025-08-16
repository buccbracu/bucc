// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";
// import type { NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//   const token = await getToken({
//     req: request,
//     secret: process.env.AUTH_SECRET,
//   });
//   const { pathname } = request.nextUrl;

//   const isProtected = pathname.startsWith("/dashboard");

//   if (!token && isProtected) {
//     return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
//   }

//   if (token && pathname === "/login") {
//     return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/login"],
// };

export const config = {
  matcher: [],
};