// import { authConfig } from "@/auth.config";
// import { DEFAULT_REDIRECT, PUBLIC_ROUTES, ROOT } from "@/lib/routes";
// import NextAuth from "next-auth";

// const { auth } = NextAuth(authConfig);

// export default auth(async (req) => {
//   const { nextUrl } = req;
//   const isAuthenticated = !!req.auth;
//   const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

//   if (isPublicRoute && isAuthenticated)
//     return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));

//   if (!isAuthenticated && !isPublicRoute)
//     return Response.redirect(new URL(ROOT, nextUrl));
// });

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };
// // };
// // export function middleware(request: NextRequest) {
// //   const pathname = new URL(request.url).pathname;
// //   if (!(process.env.NODE_ENV === "development")) {
// //     if (pathname.startsWith("/dashboard")) {
// //       if (pathname === "/dashboard") {
// //         return NextResponse.rewrite(new URL("/dashboard", request.url));
// //       }
// //       return NextResponse.rewrite(
// //         new URL("/dashboard/under-construction", request.url),
// //       );
// //     }
// //     return NextResponse.rewrite(new URL("/under-construction", request.url));
// //   }
// // }

export const config = {
  matcher: [],
};
