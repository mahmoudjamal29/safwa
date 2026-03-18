import { NextResponse, type NextRequest } from "next/server";

import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, options, value }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage = request.nextUrl.pathname.startsWith("/auth/");
  const isPublicRoute = isAuthPage || request.nextUrl.pathname === "/";

  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (user && isAuthPage && !request.nextUrl.pathname.startsWith("/auth/callback")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|sw\\.js|manifest\\.webmanifest|favicon\\.|icons/|.*\\.(?:svg|png|jpg|jpeg|ico|webp|woff2?)$).*)",
  ],
};
