"use client"

import { Modal } from "./ui-custom/modal"
import { Badge } from "./ui-custom/badge"
import { Button } from "./ui-custom/button"
import { Avatar } from "./ui-custom/avatar"
import { StatusStepper } from "./ui-custom/status-stepper"
import type { Announcement } from "@/lib/mock-data"

interface AnnouncementDetailModalProps {
  announcement: Announcement | null
  isOpen: boolean
  onClose: () => void
  showEscrowProgress?: boolean
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= Math.round(rating) ? "text-warning fill-warning" : "text-muted"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function AnnouncementDetailModal({
  announcement,
  isOpen,
  onClose,
  showEscrowProgress = false,
}: AnnouncementDetailModalProps) {
  if (!announcement) return null

  const escrowSteps = [
    { label: "Open", completed: true },
    { label: "Fiat Paid", completed: showEscrowProgress, current: showEscrowProgress },
    { label: "Completed", completed: false },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <Badge variant={announcement.type === "BUY" ? "buy" : "sell"} size="lg">
            {announcement.type}
          </Badge>
          <div>
            <p className="text-3xl font-bold text-card-foreground">
              {announcement.tokenAmount.toLocaleString()} {announcement.token}
            </p>
            <p className="text-xl text-muted-foreground flex items-center gap-2">
              <span>→</span>
              <span>
                ${announcement.fiatAmount.toLocaleString()} {announcement.fiat}
              </span>
            </p>
          </div>
        </div>

        {/* Escrow Progress */}
        {showEscrowProgress && (
          <div className="mb-6 p-4 bg-muted/50 rounded-xl">
            <h4 className="text-sm font-medium text-card-foreground mb-4">Escrow Status</h4>
            <StatusStepper steps={escrowSteps} />
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
            <p className="text-sm font-medium text-card-foreground">{announcement.paymentMethod}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Time Limit</p>
            <p className="text-sm font-medium text-card-foreground">{announcement.timeLimit}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Created</p>
            <p className="text-sm font-medium text-card-foreground">{announcement.createdAt}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Expires</p>
            <p className="text-sm font-medium text-card-foreground">{announcement.expiresAt}</p>
          </div>
        </div>

        {/* Price Highlight */}
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6">
          <p className="text-primary font-semibold text-lg">
            Price: ${announcement.pricePerToken.toFixed(4)} per {announcement.token}
          </p>
        </div>

        {/* Creator Profile */}
        <div className="border border-border rounded-xl p-4 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar src={announcement.creator.avatar} alt={announcement.creator.username} size="lg" />
            <div className="flex-1">
              <p className="font-semibold text-card-foreground">{announcement.creator.username}</p>
              <p className="text-sm text-muted-foreground font-mono">{announcement.creator.wallet}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={announcement.creator.rating} />
            <span className="text-sm text-muted-foreground">
              {announcement.creator.rating} ({announcement.creator.reviewCount} reviews)
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-semibold text-card-foreground">{announcement.creator.completedTrades}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-success">{announcement.creator.successRate}%</p>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-card-foreground">{announcement.creator.memberSince}</p>
              <p className="text-xs text-muted-foreground">Member Since</p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-card-foreground mb-2">Terms & Conditions</h4>
          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">{announcement.terms}</div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button variant="primary" size="lg" className="w-full" disabled>
            Take Escrow
          </Button>
          <div className="flex gap-3">
            <Button variant="secondary" size="md" className="flex-1" disabled>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Contact on Telegram
            </Button>
            <Button variant="ghost" size="md" disabled>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Report
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
