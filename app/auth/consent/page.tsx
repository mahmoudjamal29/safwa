"use client"

import { Suspense, useTransition } from "react"

import { Button } from "@/components/ui/button"

import { signInWithGoogle } from "@/app/auth/_actions"

function ConsentContent() {
  const [isPending, startTransition] = useTransition()
  const error = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("error")
  const provider = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("provider") ?? "Google"

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-sm">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Access Error</h1>
            <p className="mt-2 text-muted-foreground">
              {error === "access_denied"
                ? "You denied access to your account."
                : "An error occurred during authentication."}
            </p>
          </div>
          <form action={() => startTransition(() => signInWithGoogle())}>
            <Button type="submit" className="w-full" disabled={isPending}>
              Try Again
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-8 w-8" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                className="text-primary"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                className="text-primary"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                className="text-primary"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                className="text-primary"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Sign in to SAFWA</h1>
          <p className="mt-2 text-muted-foreground">
            Click below to sign in with {provider}
          </p>
        </div>

        <form action={() => startTransition(() => signInWithGoogle())}>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Redirecting..." : `Continue with ${provider}`}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to let SAFWA access your basic profile information.
        </p>
      </div>
    </div>
  )
}

export default function ConsentPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ConsentContent />
    </Suspense>
  )
}
