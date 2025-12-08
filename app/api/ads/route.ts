import { safeResponse, toClientAd } from "@/lib/adapters";

import { NextResponse } from "next/server";
import { handlePrismaError } from "@/lib/prisma-errors";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ads = await prisma.ad.findMany({
      orderBy: { createdAt: "desc" },
      // Opción futura: incluir relaciones para optimizar
      // include: { creator: true, taker: true }
    });
    return NextResponse.json(safeResponse(ads, toClientAd));
  } catch (error) {
    const { status, message } = handlePrismaError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.creatorWallet || !body.type || !body.tokenAmount || !body.pricePerToken) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Calcular expiresAt basado en timeLimit
    const expiresAt = new Date(Date.now() + body.timeLimit * 1000);

    const newAd = await prisma.ad.create({
      data: {
        creatorWallet: body.creatorWallet,
        type: body.type.toUpperCase() as "BUY" | "SELL",
        tokenMint: body.tokenMint,
        tokenAmount: body.tokenAmount,
        fiatCurrency: body.fiatCurrency,
        fiatAmount: body.fiatAmount,
        paymentMethod: body.paymentMethod,
        pricePerToken: body.pricePerToken,
        terms: body.terms,
        timeLimit: body.timeLimit,
        status: "ACTIVE",
        expiresAt,
        escrowId: body.escrowId || undefined,
        takenBy: body.takenBy || undefined,
        creationSignature: body.creationSignature || undefined,
        paidSignature: body.paidSignature || undefined,
        releaseSignature: body.releaseSignature || undefined,
      },
    });

    return NextResponse.json(safeResponse(newAd, toClientAd));
  } catch (error) {
    const { status, message } = handlePrismaError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
