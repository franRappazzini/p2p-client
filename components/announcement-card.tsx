"use client"

import { Badge } from "./ui-custom/badge"
import { Button } from "./ui-custom/button"
import { Avatar } from "./ui-custom/avatar"
import type { Announcement } from "@/lib/mock-data"

interface AnnouncementCardProps {
  announcement: Announcement
  onClick?: () => void
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-warning fill-warning" : "text-muted"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function AnnouncementCard({ announcement, onClick }: AnnouncementCardProps) {
  const { type, token, tokenAmount, fiat, fiatAmount, pricePerToken, paymentMethod, timeLeft, creator } = announcement

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <Badge variant={type === "BUY" ? "buy" : "sell"} size="sm">
          {type}
        </Badge>
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{timeLeft} left</span>
        </div>
      </div>

      {/* Amounts */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-card-foreground">
          {tokenAmount.toLocaleString()} {token}
        </p>
        <p className="text-muted-foreground flex items-center gap-1">
          <span className="text-lg">→</span>
          <span className="text-lg font-medium">
            ${fiatAmount.toLocaleString()} {fiat}
          </span>
        </p>
      </div>

      {/* Price */}
      <div className="bg-primary/5 border border-primary/10 rounded-lg px-3 py-2 mb-4">
        <p className="text-sm text-primary font-medium">
          Price: ${pricePerToken.toFixed(2)}/{token}
        </p>
      </div>

      {/* Payment Method */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        <span>{paymentMethod}</span>
      </div>

      {/* Divider */}
      <div className="border-t border-border my-4" />

      {/* Creator */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar src={creator.avatar} alt={creator.username} size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-card-foreground truncate">{creator.username}</p>
          <div className="flex items-center gap-2">
            <StarRating rating={creator.rating} />
            <span className="text-xs text-muted-foreground">
              {creator.rating} ({creator.reviewCount})
            </span>
          </div>
        </div>
      </div>

      {/* Action */}
      <Button variant="primary" size="sm" className="w-full group-hover:bg-primary/90" onClick={onClick}>
        View Details
      </Button>
    </div>
  )
}
