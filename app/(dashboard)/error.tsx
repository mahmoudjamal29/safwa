'use client'

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold text-foreground">حدث خطأ</h2>
      <button onClick={reset} className="rounded bg-primary px-4 py-2 text-primary-foreground text-sm">
        إعادة المحاولة
      </button>
    </div>
  )
}
