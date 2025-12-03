import { cn } from "@/lib/utils"

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card border border-border rounded-xl p-5 animate-pulse", className)}>
      <div className="flex justify-between mb-4">
        <div className="h-6 w-16 bg-muted rounded-md" />
        <div className="h-5 w-24 bg-muted rounded-md" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-8 w-32 bg-muted rounded-md" />
        <div className="h-6 w-28 bg-muted rounded-md" />
      </div>
      <div className="h-10 w-full bg-muted rounded-lg mb-4" />
      <div className="h-5 w-32 bg-muted rounded-md mb-4" />
      <div className="border-t border-border my-4" />
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-muted rounded-full" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-muted rounded-md" />
          <div className="h-3 w-32 bg-muted rounded-md" />
        </div>
      </div>
      <div className="h-9 w-full bg-muted rounded-lg" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="h-10 flex-1 bg-muted rounded-md" />
          <div className="h-10 w-20 bg-muted rounded-md" />
          <div className="h-10 w-24 bg-muted rounded-md" />
          <div className="h-10 w-20 bg-muted rounded-md" />
        </div>
      ))}
    </div>
  )
}
