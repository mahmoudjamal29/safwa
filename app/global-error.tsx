'use client'
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html><body>
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold">حدث خطأ غير متوقع</h2>
        <button onClick={reset} className="rounded bg-yellow-600 px-4 py-2 text-white">إعادة المحاولة</button>
      </div>
    </body></html>
  )
}
