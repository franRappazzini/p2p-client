import type React from "react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  className?: string
}

export function StatCard({ title, value, icon, className }: StatCardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-xl p-5 shadow-sm", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
        </div>
        {icon && <div className="text-primary opacity-80">{icon}</div>}
      </div>
    </div>
  )
}
