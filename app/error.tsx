"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center">
        <h2 className="text-heading mb-2">页面加载出错</h2>
        <p className="text-body text-muted-foreground mb-4">
          请刷新页面重试
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 text-sm font-medium"
        >
          重试
        </button>
      </div>
    </div>
  )
}
