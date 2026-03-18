export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: ["/invoices/:path*", "/customers/:path*", "/products/:path*", "/settings/:path*"],
}
