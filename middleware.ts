import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Canonical host redirect for production domain.
  if (host === "cucobrani.cz") {
    url.host = "www.cucobrani.cz";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  // Refresh Supabase session only for /admin routes.
  if (!path.startsWith("/admin")) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          cookiesToSet.forEach(({ name, value }) => {
            response.cookies.set(name, value, { path: "/" });
          });
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml).*)",
  ],
};
