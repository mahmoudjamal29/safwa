"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function signInWithGoogle() {
  const supabase = await createClient();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://safwa-eight.vercel.app/";
  const redirectTo = `${origin}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    options: {
      redirectTo,
    },
    provider: "google",
  });

  if (error) {
    redirect(`/auth/signin?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    redirect(data.url);
  }

  redirect("/auth/signin?error=no_url");
}
