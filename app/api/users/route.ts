import { Api, TelegramClient } from "telegram";
import { safeResponse, toClientUser } from "@/lib/adapters";

import { NextResponse } from "next/server";
import { StringSession } from "telegram/sessions";
import { handlePrismaError } from "@/lib/prisma-errors";
import { prisma } from "@/lib/prisma";
import { validateTelegramUsername } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get("wallet");

    if (wallet) {
      const user = await prisma.user.findUnique({
        where: { walletAddress: wallet },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(safeResponse(user, toClientUser));
    }

    const users = await prisma.user.findMany();
    return NextResponse.json(safeResponse(users, toClientUser));
  } catch (error) {
    const { status, message } = handlePrismaError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.walletAddress) {
      return NextResponse.json({ error: "Missing walletAddress" }, { status: 400 });
    }

    // Usar upsert para prevenir duplicados y retornar el usuario existente si ya existe
    const user = await prisma.user.upsert({
      where: { walletAddress: body.walletAddress },
      update: {}, // No actualizar nada si ya existe
      create: {
        walletAddress: body.walletAddress,
        username: body.username || `User ${body.walletAddress.slice(0, 6)}`,
        telegramUsername: body.telegramUsername || undefined,
        avatar: body.avatar || undefined,
      },
    });

    return NextResponse.json(safeResponse(user, toClientUser));
  } catch (error) {
    const { status, message } = handlePrismaError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

/**
 * Verify Telegram username exists using Telegram API
 * Required environment variables:
 * - TELEGRAM_API_ID: Your Telegram API ID (get from https://my.telegram.org)
 * - TELEGRAM_API_HASH: Your Telegram API Hash (get from https://my.telegram.org)
 * - TELEGRAM_BOT_TOKEN: Your Telegram Bot Token (get from @BotFather)
 */
async function verifyTelegramUsername(
  username: string
): Promise<{ valid: boolean; error?: string }> {
  const apiId = parseInt(process.env.TELEGRAM_API_ID || "");
  const apiHash = process.env.TELEGRAM_API_HASH || "";
  const botToken = process.env.TELEGRAM_BOT_TOKEN || "";

  if (!apiId || !apiHash || !botToken) {
    console.error("Missing Telegram API credentials");
    return { valid: true };
  }

  const session = new StringSession("");
  const client = new TelegramClient(session, apiId, apiHash, {
    connectionRetries: 3,
  });

  try {
    await client.start({
      botAuthToken: botToken,
    });

    await client.invoke(
      new Api.contacts.ResolveUsername({
        username: username,
      })
    );

    await client.disconnect();
    return { valid: true };
  } catch (error: any) {
    await client.disconnect();

    if (
      error.message?.includes("USERNAME_NOT_OCCUPIED") ||
      error.message?.includes("USERNAME_INVALID") ||
      error.message?.includes("No user has")
    ) {
      return {
        valid: false,
        error: "This Telegram username does not exist",
      };
    }

    console.error("Telegram API error:", error);
    return { valid: true };
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { walletAddress, ...updates } = body;

    if (!walletAddress) {
      return NextResponse.json({ error: "Missing walletAddress" }, { status: 400 });
    }

    let sanitizedTelegramUsername = updates.telegramUsername;

    // Validate Telegram username if provided
    if (updates.telegramUsername && updates.telegramUsername.trim()) {
      // First validate format
      const validation = validateTelegramUsername(updates.telegramUsername);

      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error || "Invalid Telegram username format" },
          { status: 400 }
        );
      }

      sanitizedTelegramUsername = validation.sanitized;

      // Then verify username exists on Telegram
      const verifyResult = await verifyTelegramUsername(sanitizedTelegramUsername);

      if (!verifyResult.valid) {
        return NextResponse.json(
          { error: verifyResult.error || "Telegram username not found" },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { walletAddress },
      data: {
        username: updates.username,
        telegramUsername: sanitizedTelegramUsername || undefined,
        avatar: updates.avatar || undefined,
      },
    });

    return NextResponse.json(safeResponse(updatedUser, toClientUser));
  } catch (error) {
    const { status, message } = handlePrismaError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
