"use client"

import { SimpleHeader } from "@/components/simple-header"
import { Sidebar } from "@/components/sidebar"
import { Avatar } from "@/components/ui-custom/avatar"
import { Button } from "@/components/ui-custom/button"
import { StatCard } from "@/components/ui-custom/stat-card"
import { Tabs } from "@/components/ui-custom/tabs"
import { Badge } from "@/components/ui-custom/badge"
import { currentUser, mockAnnouncements, mockReviews } from "@/lib/mock-data"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= Math.round(rating) ? "text-warning fill-warning" : "text-muted"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function ProfilePage() {
  const userAnnouncements = mockAnnouncements.slice(0, 3)

  const tabContent = {
    active: (
      <div className="space-y-4">
        {userAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <Badge variant={announcement.type === "BUY" ? "buy" : "sell"} size="sm">
                {announcement.type}
              </Badge>
              <div>
                <p className="font-semibold text-card-foreground">
                  {announcement.tokenAmount} {announcement.token}
                </p>
                <p className="text-sm text-muted-foreground">
                  → ${announcement.fiatAmount} {announcement.fiat}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{announcement.timeLeft} left</span>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          </div>
        ))}
        {userAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground">No active announcements</p>
          </div>
        )}
      </div>
    ),
    completed: (
      <div className="space-y-4">
        {mockAnnouncements.slice(3, 6).map((announcement) => (
          <div
            key={announcement.id}
            className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <Badge variant="success" size="sm">
                COMPLETED
              </Badge>
              <div>
                <p className="font-semibold text-card-foreground">
                  {announcement.tokenAmount} {announcement.token}
                </p>
                <p className="text-sm text-muted-foreground">
                  → ${announcement.fiatAmount} {announcement.fiat}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{announcement.createdAt}</span>
              <Button variant="ghost" size="sm">
                Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    ),
    reviews: (
      <div className="space-y-4">
        {mockReviews.map((review) => (
          <div key={review.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start gap-4 mb-3">
              <Avatar src={review.reviewer.avatar} alt={review.reviewer.username} size="md" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-card-foreground">{review.reviewer.username}</p>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= review.rating ? "text-warning fill-warning" : "text-muted"}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground">{review.text}</p>
          </div>
        ))}
      </div>
    ),
  }

  const tabs = [
    { id: "active", label: "Active", content: tabContent.active },
    { id: "completed", label: "Completed", content: tabContent.completed },
    { id: "reviews", label: "Reviews", content: tabContent.reviews },
  ]

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <Sidebar />

      <main className="md:ml-16 container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar
              src="/male-avatar-professional.jpg"
              alt={currentUser.username}
              size="xl"
              className="mx-auto md:mx-0"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-card-foreground mb-1">{currentUser.username}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-3">
                <span className="font-mono text-sm">{currentUser.wallet}</span>
                <button className="p-1 hover:bg-muted rounded transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <StarRating rating={currentUser.rating} />
                <span className="text-muted-foreground">
                  {currentUser.rating} ({currentUser.reviewCount} reviews)
                </span>
              </div>
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Completed Trades"
            value={currentUser.completedTrades}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatCard
            title="Success Rate"
            value={`${currentUser.successRate}%`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
          <StatCard
            title="Rating"
            value={`★ ${currentUser.rating}`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            }
          />
          <StatCard
            title="Member Since"
            value={currentUser.memberSince}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />
        </div>

        {/* Tabs */}
        <div className="bg-card border border-border rounded-xl p-6">
          <Tabs tabs={tabs} />
        </div>
      </main>
    </div>
  )
}
