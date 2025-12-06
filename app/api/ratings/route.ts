import { NextResponse } from "next/server";
import { Rating } from "@/lib/types";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fromWallet, toWallet, adId, rating, comment } = body;

    if (!fromWallet || !toWallet || !adId || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    // Check if already rated
    if (db.ratings.hasRated(fromWallet, adId)) {
      return NextResponse.json(
        { error: "You have already rated this transaction" },
        { status: 400 }
      );
    }

    const newRating: Rating = {
      id: Math.random().toString(36).substring(7),
      fromWallet,
      toWallet,
      adId,
      rating,
      comment,
      createdAt: Date.now(),
    };

    db.ratings.create(newRating);

    // Update user stats
    const user = db.users.getByWallet(toWallet);
    if (user) {
      db.users.update(toWallet, {
        ratingSum: (user.ratingSum || 0) + rating,
        ratingCount: (user.ratingCount || 0) + 1,
      });
    }

    return NextResponse.json(newRating);
  } catch (error) {
    console.error("Failed to create rating", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");
  const fromWallet = searchParams.get("fromWallet");
  const adId = searchParams.get("adId");

  if (fromWallet && adId) {
    const hasRated = db.ratings.hasRated(fromWallet, adId);
    return NextResponse.json({ hasRated });
  }

  if (!wallet) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
  }

  const ratings = db.ratings.getByUser(wallet);
  return NextResponse.json(ratings);
}
