import { safeResponse, toClientUser } from "@/lib/adapters";

import { NextResponse } from "next/server";
import { handlePrismaError } from "@/lib/prisma-errors";
import { prisma } from "@/lib/prisma";

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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { walletAddress, ...updates } = body;

    if (!walletAddress) {
      return NextResponse.json({ error: "Missing walletAddress" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { walletAddress },
      data: {
        username: updates.username,
        telegramUsername: updates.telegramUsername || undefined,
        avatar: updates.avatar || undefined,
      },
    });

    return NextResponse.json(safeResponse(updatedUser, toClientUser));
  } catch (error) {
    const { status, message } = handlePrismaError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
