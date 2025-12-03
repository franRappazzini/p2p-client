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

    if (!body.wallet || !body.username) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      memberSince: new Date().toISOString(),
      rating: 0,
      reviewCount: 0,
      completedTrades: 0,
      successRate: 0,
      avatar: "",
      ...body,
    };

    const createdUser = db.users.create(newUser);
    return NextResponse.json(createdUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
