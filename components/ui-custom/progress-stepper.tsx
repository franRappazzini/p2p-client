import { cn } from "@/lib/utils"

interface ProgressStepperProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
  className?: string
}

export function ProgressStepper({ currentStep, totalSteps, labels, className }: ProgressStepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1
          const isCompleted = stepNum < currentStep
          const isCurrent = stepNum === currentStep

          return (
            <div key={stepNum} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                    isCompleted && "bg-success text-success-foreground",
                    isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                {labels?.[i] && (
                  <span
                    className={cn(
                      "text-xs mt-2 text-center",
                      isCurrent ? "text-foreground font-medium" : "text-muted-foreground",
                    )}
                  >
                    {labels[i]}
                  </span>
                )}
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={cn("flex-1 h-1 mx-3 rounded-full transition-all", isCompleted ? "bg-success" : "bg-muted")}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
