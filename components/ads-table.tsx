"use client"

import { Badge } from "./ui-custom/badge"
import { Button } from "./ui-custom/button"
import { Avatar } from "./ui-custom/avatar"
import type { Ad } from "@/lib/types"

interface AdsTableProps {
  ads: Ad[]
  onViewDetails: (ad: Ad) => void
}

export function AdsTable({ ads, onViewDetails }: AdsTableProps) {
  const getTimeLeft = (expiresAt: number) => {
    const now = Date.now()
    const diff = expiresAt - now
    if (diff <= 0) return "Expired"

    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)

    if (hours > 0) return `${hours}h ${minutes}m left`
    return `${minutes}m left`
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Type</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Trader</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Amount</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Price</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Payment</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad, index) => (
              <tr
                key={ad.id}
                className={
                  index !== ads.length - 1
                    ? "border-b border-border hover:bg-muted/30 transition-colors"
                    : "hover:bg-muted/30 transition-colors"
                }
              >
                <td className="px-4 py-4">
                  <Badge variant={ad.type === "buy" ? "success" : "primary"}>{ad.type.toUpperCase()}</Badge>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Avatar name={ad.creatorWallet} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {ad.creatorWallet.slice(0, 4)}...{ad.creatorWallet.slice(-4)}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-warning text-xs">★</span>
                        <span className="text-xs text-muted-foreground">New</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-semibold text-foreground">
                    {ad.tokenAmount} {ad.tokenMint}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    → {ad.fiatAmount} {ad.fiatCurrency}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-primary">
                    ${ad.pricePerToken}/{ad.tokenMint}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-muted-foreground">{ad.paymentMethod}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <Button variant="primary" size="sm" onClick={() => onViewDetails(ad)}>
                    {ad.type === "buy" ? `Sell ${ad.tokenMint}` : `Buy ${ad.tokenMint}`}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {ads.map((ad) => (
          <div key={ad.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <Badge variant={ad.type === "buy" ? "success" : "primary"}>{ad.type.toUpperCase()}</Badge>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs text-muted-foreground">{getTimeLeft(ad.expiresAt)}</span>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-lg font-bold text-foreground">
                {ad.tokenAmount} {ad.tokenMint}
              </p>
              <p className="text-sm text-muted-foreground">
                → {ad.fiatAmount} {ad.fiatCurrency}
              </p>
              <p className="text-sm font-medium text-primary mt-1">
                Price: ${ad.pricePerToken}/{ad.tokenMint}
              </p>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Avatar name={ad.creatorWallet} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {ad.creatorWallet.slice(0, 4)}...{ad.creatorWallet.slice(-4)}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-warning text-xs">★</span>
                  <span className="text-xs text-muted-foreground">New</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-3">Payment: {ad.paymentMethod}</p>

            <Button variant="primary" size="sm" className="w-full" onClick={() => onViewDetails(ad)}>
              {ad.type === "buy" ? `Sell ${ad.tokenMint}` : `Buy ${ad.tokenMint}`}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
