import { safeResponse, toClientRating } from "@/lib/adapters";

import { NextResponse } from "next/server";
import { handlePrismaError } from "@/lib/prisma-errors";
import { prisma } from "@/lib/prisma";

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
    const existingRating = await prisma.rating.findFirst({
      where: {
        fromWallet,
        adId,
      },
    });

    if (existingRating) {
      return NextResponse.json(
        { error: "You have already rated this transaction" },
        { status: 400 }
      );
    }

    // Usar transacción para crear rating y actualizar stats del usuario atómicamente
    const [newRating, updatedUser] = await prisma.$transaction(async (tx) => {
      // Crear el rating
      const createdRating = await tx.rating.create({
        data: {
          fromWallet,
          toWallet,
          adId,
          rating,
          comment: comment || undefined,
        },
      });

      // Obtener usuario actual para calcular nueva reputación
      const currentUser = await tx.user.findUnique({
        where: { walletAddress: toWallet },
      });

      if (!currentUser) {
        throw new Error("User not found");
      }

      // Actualizar stats del usuario
      const newRatingSum = currentUser.ratingSum + rating;
      const newRatingCount = currentUser.ratingCount + 1;
      const newReputation = newRatingSum / newRatingCount;

      const user = await tx.user.update({
        where: { walletAddress: toWallet },
        data: {
          positiveRatings: rating > 3 ? { increment: 1 } : undefined,
          negativeRatings: rating <= 3 ? { increment: 1 } : undefined,
          ratingSum: { increment: rating },
          ratingCount: { increment: 1 },
          reputation: newReputation,
        },
      });

      return [createdRating, user];
    });

    return NextResponse.json(safeResponse(newRating, toClientRating));
  } catch (error) {
    const { status, message } = handlePrismaError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get("wallet");
    const fromWallet = searchParams.get("fromWallet");
    const adId = searchParams.get("adId");

    // Check if user has rated a specific ad
    if (fromWallet && adId) {
      const existingRating = await prisma.rating.findFirst({
        where: {
          fromWallet,
          adId,
        },
      });
      return NextResponse.json({ hasRated: !!existingRating });
    }

    // Get all ratings for a user
    if (!wallet) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
    }

    const ratings = await prisma.rating.findMany({
      where: { toWallet: wallet },
      orderBy: { createdAt: "desc" },
      // Opción futura: incluir relaciones para optimizar
      // include: { fromUser: true, toUser: true, ad: true }
    });

    return NextResponse.json(safeResponse(ratings, toClientRating));
  } catch (error) {
    const { status, message } = handlePrismaError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
