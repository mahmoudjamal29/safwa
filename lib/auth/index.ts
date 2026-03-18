import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

export async function signInWithGoogle(callbackUrl?: string) {
  const supabase = await createClient()
  const redirectTo = callbackUrl ?? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
  
  await supabase.auth.signInWithOAuth({
    options: {
      redirectTo,
    },
    provider: "google",
  })
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/auth/signin")
}

export async function auth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
