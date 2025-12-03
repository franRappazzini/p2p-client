"use client"

import { useEffect, useState } from "react"

export interface ToastProps {
  message: string
  type?: "success" | "error" | "info"
  duration?: number
  onClose?: () => void
}

export function Toast({ message, type = "info", duration = 4000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose?.(), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = {
    success: "bg-success",
    error: "bg-red-500",
    info: "bg-info",
  }[type]

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-white shadow-lg transition-all duration-300 ${bgColor} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      {message}
    </div>
  )
}

export function useToast() {
  const [toast, setToast] = useState<ToastProps | null>(null)

  const showToast = (props: Omit<ToastProps, "onClose">) => {
    setToast({
      ...props,
      onClose: () => setToast(null),
    })
  }

  return {
    toast,
    showToast,
    ToastComponent: toast ? <Toast {...toast} /> : null,
  }
}
