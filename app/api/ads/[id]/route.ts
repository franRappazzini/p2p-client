import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const ad = db.ads.getById(id);

    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    return NextResponse.json(ad);
  } catch (error) {
    console.error("Error fetching ad:", error);
    return NextResponse.json({ error: "Failed to fetch ad" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if completing trade to update user stats
    if (body.status === "completed") {
      const currentAd = db.ads.getById(id);
      if (currentAd) {
        // Update Creator
        const creator = db.users.getByWallet(currentAd.creatorWallet);
        if (creator) {
          db.users.update(creator.walletAddress, {
            completedTrades: (creator.completedTrades || 0) + 1,
          });
        }

        // Update Taker
        if (currentAd.takenBy) {
          const taker = db.users.getByWallet(currentAd.takenBy);
          if (taker) {
            db.users.update(taker.walletAddress, {
              completedTrades: (taker.completedTrades || 0) + 1,
            });
          }
        }
      }
    }

    const updatedAd = db.ads.update(id, body);

    if (!updatedAd) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAd);
  } catch (error) {
    console.error("Error updating ad:", error);
    return NextResponse.json({ error: "Failed to update ad" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const success = db.ads.delete(id);

    if (!success) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting ad:", error);
    return NextResponse.json({ error: "Failed to delete ad" }, { status: 400 });
  }
}
