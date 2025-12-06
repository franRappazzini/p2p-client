import { NextResponse } from "next/server";
import { User } from "@/lib/types";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");

  if (wallet) {
    const user = db.users.getByWallet(wallet);
    if (user) {
      return NextResponse.json(user);
    }
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const users = db.users.getAll();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.walletAddress) {
      return NextResponse.json({ error: "Missing walletAddress" }, { status: 400 });
    }

    const newUser: User = {
      walletAddress: body.walletAddress,
      username: body.username || `User ${body.walletAddress.slice(0, 6)}`,
      telegramUsername: body.telegramUsername || "",
      avatar: body.avatar || "",
      createdAt: Date.now(),
      positiveRatings: 0,
      negativeRatings: 0,
      completedTrades: 0,
      reputation: 0,
      ratingSum: 0,
      ratingCount: 0,
    };

    const createdUser = db.users.create(newUser);
    return NextResponse.json(createdUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { walletAddress, ...updates } = body;

    if (!walletAddress) {
      return NextResponse.json({ error: "Missing walletAddress" }, { status: 400 });
    }

    const updatedUser = db.users.update(walletAddress, updates);

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
