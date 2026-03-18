"use server"

import { signIn } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function signInWithGoogle(callbackUrl: string) {
  await signIn("google", { redirectTo: callbackUrl })
  redirect(callbackUrl)
}
