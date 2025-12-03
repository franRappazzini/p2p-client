import { cn } from "@/lib/utils"

interface Step {
  label: string
  completed: boolean
  current?: boolean
}

interface StatusStepperProps {
  steps: Step[]
  className?: string
}

export function StatusStepper({ steps, className }: StatusStepperProps) {
  return (
    <div className={cn("flex items-center justify-between w-full", className)}>
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-shrink-0">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                step.completed && "bg-success text-success-foreground",
                step.current && !step.completed && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                !step.completed && !step.current && "bg-muted text-muted-foreground",
              )}
            >
              {step.completed ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={cn(
                "text-xs mt-1.5 whitespace-nowrap",
                step.current || step.completed ? "text-foreground font-medium" : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 mx-2 rounded-full transition-all",
                step.completed ? "bg-success" : "bg-muted",
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
