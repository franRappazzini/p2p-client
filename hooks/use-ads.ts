"use client"

import { useState, useEffect } from "react"
import type { Ad } from "@/lib/types"

interface UseAdsOptions {
  type?: string
  token?: string
  fiat?: string
}

export function useAds(options: UseAdsOptions = {}) {
  const [data, setData] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAds = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.type) params.set("type", options.type)
      if (options.token) params.set("token", options.token)
      if (options.fiat) params.set("fiat", options.fiat)

      const res = await fetch(`/api/ads?${params.toString()}`)

      if (!res.ok) {
        throw new Error("Failed to fetch ads")
      }

      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAds()
  }, [options.type, options.token, options.fiat])

  return { data, loading, error, refetch: fetchAds }
}

export async function createAd(adData: Partial<Ad>) {
  const res = await fetch("/api/ads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(adData),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Failed to create ad")
  }

  return res.json()
}
