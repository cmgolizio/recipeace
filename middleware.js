import { NextResponse } from "next/server";

const ALLOWED_PREFIXES = [
  "/_next",
  "/api",
  "/favicon.ico",
  "/vercel.svg",
  "/robots.txt",
  "/under-construction",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const isAllowed = ALLOWED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isAllowed) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/under-construction";
  return NextResponse.redirect(url);
}
