import { Ad } from "@/lib/types";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const ads = db.ads.getAll();
  return NextResponse.json(ads);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.creatorWallet || !body.type || !body.tokenAmount || !body.pricePerToken) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newAd: Ad = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      status: "active",
      ...body,
    };

    const createdAd = db.ads.create(newAd);
    return NextResponse.json(createdAd);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create ad" }, { status: 500 });
  }
}
