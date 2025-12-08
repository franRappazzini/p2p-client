import type { Ad, Rating, User } from "./types";
import type { Ad as PrismaAd, Rating as PrismaRating, User as PrismaUser } from "@prisma/client";

/**
 * Convierte un usuario de Prisma (con DateTime) al formato del cliente (con timestamps number)
 */
export function toClientUser(user: PrismaUser): User {
  return {
    walletAddress: user.walletAddress,
    username: user.username,
    telegramUsername: user.telegramUsername ?? undefined,
    avatar: user.avatar ?? undefined,
    createdAt: user.createdAt.getTime(),
    positiveRatings: user.positiveRatings,
    negativeRatings: user.negativeRatings,
    completedTrades: user.completedTrades,
    reputation: user.reputation,
    ratingSum: user.ratingSum,
    ratingCount: user.ratingCount,
  };
}

/**
 * Convierte un ad de Prisma (con DateTime) al formato del cliente (con timestamps number)
 */
export function toClientAd(ad: PrismaAd): Ad {
  return {
    id: ad.id,
    creatorWallet: ad.creatorWallet,
    type: ad.type.toLowerCase() as "buy" | "sell",
    tokenMint: ad.tokenMint,
    tokenAmount: ad.tokenAmount,
    fiatCurrency: ad.fiatCurrency,
    fiatAmount: ad.fiatAmount,
    paymentMethod: ad.paymentMethod,
    pricePerToken: ad.pricePerToken,
    terms: ad.terms,
    timeLimit: ad.timeLimit,
    status: ad.status.toLowerCase() as Ad["status"],
    escrowId: ad.escrowId ?? undefined,
    takenBy: ad.takenBy ?? undefined,
    createdAt: ad.createdAt.getTime(),
    expiresAt: ad.expiresAt.getTime(),
    creationSignature: ad.creationSignature ?? undefined,
    paidSignature: ad.paidSignature ?? undefined,
    releaseSignature: ad.releaseSignature ?? undefined,
  };
}

/**
 * Convierte un rating de Prisma (con DateTime) al formato del cliente (con timestamps number)
 */
export function toClientRating(rating: PrismaRating): Rating {
  return {
    id: rating.id,
    fromWallet: rating.fromWallet,
    toWallet: rating.toWallet,
    adId: rating.adId,
    rating: rating.rating,
    comment: rating.comment ?? undefined,
    createdAt: rating.createdAt.getTime(),
  };
}

/**
 * Valida recursivamente que no haya objetos Date en la respuesta (solo en desarrollo)
 * Ayuda a detectar DateTime no convertidos antes de enviarlos al cliente
 */
export function validateNoDateTime(obj: any, path = "response"): void {
  if (process.env.NODE_ENV === "production") return;

  if (obj === null || obj === undefined) return;

  if (obj instanceof Date) {
    throw new Error(
      `⚠️  DateTime no convertido detectado en ${path}. ` +
        `Asegúrate de usar toClientUser/toClientAd/toClientRating antes de retornar.`
    );
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => validateNoDateTime(item, `${path}[${index}]`));
    return;
  }

  if (typeof obj === "object") {
    Object.entries(obj).forEach(([key, value]) => {
      validateNoDateTime(value, `${path}.${key}`);
    });
  }
}

/**
 * Aplica el adapter correspondiente y valida que no haya DateTime sin convertir
 * Uso: safeResponse(user, toClientUser) o safeResponse(users, toClientUser)
 */
export function safeResponse<T, R>(data: T | T[] | null, adapter?: (item: T) => R): R | R[] | null {
  if (data === null || data === undefined) {
    return null;
  }

  let result: any;

  if (Array.isArray(data)) {
    result = adapter ? data.map(adapter) : data;
  } else {
    result = adapter ? adapter(data) : data;
  }

  validateNoDateTime(result);
  return result;
}
