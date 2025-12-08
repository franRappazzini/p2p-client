import { safeResponse, toClientAd } from "@/lib/adapters";

import { NextResponse } from "next/server";
import { handlePrismaError } from "@/lib/prisma-errors";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const ad = await prisma.ad.findUnique({
      where: { id },
      // Opción futura: incluir relaciones para optimizar
      // include: { creator: true, taker: true }
    });

    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    return NextResponse.json(safeResponse(ad, toClientAd));
  } catch (error) {
    const { status, message } = handlePrismaError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Si el status cambia a "completed", usar transacción para actualizar ad y users atómicamente
    if (body.status === "completed") {
      const currentAd = await prisma.ad.findUnique({ where: { id } });

      if (!currentAd) {
        return NextResponse.json({ error: "Ad not found" }, { status: 404 });
      }

      // Preparar updates de datos del ad
      const adUpdateData: any = {
        status: "COMPLETED",
      };

      // Agregar otros campos si vienen en el body
      if (body.escrowId !== undefined) adUpdateData.escrowId = body.escrowId;
      if (body.takenBy !== undefined) adUpdateData.takenBy = body.takenBy;
      if (body.creationSignature !== undefined)
        adUpdateData.creationSignature = body.creationSignature;
      if (body.paidSignature !== undefined) adUpdateData.paidSignature = body.paidSignature;
      if (body.releaseSignature !== undefined)
        adUpdateData.releaseSignature = body.releaseSignature;

      // Transacción: actualizar ad + incrementar completedTrades de creator y taker
      const [updatedAd] = await prisma.$transaction([
        prisma.ad.update({
          where: { id },
          data: adUpdateData,
        }),
        prisma.user.update({
          where: { walletAddress: currentAd.creatorWallet },
          data: { completedTrades: { increment: 1 } },
        }),
        ...(currentAd.takenBy
          ? [
              prisma.user.update({
                where: { walletAddress: currentAd.takenBy },
                data: { completedTrades: { increment: 1 } },
              }),
            ]
          : []),
      ]);

      return NextResponse.json(safeResponse(updatedAd, toClientAd));
    }

    // Para otros updates (no completed), actualizar solo el ad
    const updateData: any = {};

    if (body.status !== undefined) {
      updateData.status = body.status.toUpperCase().replace(/_/g, "_");
    }
    if (body.escrowId !== undefined) updateData.escrowId = body.escrowId;
    if (body.takenBy !== undefined) updateData.takenBy = body.takenBy;
    if (body.creationSignature !== undefined) updateData.creationSignature = body.creationSignature;
    if (body.paidSignature !== undefined) updateData.paidSignature = body.paidSignature;
    if (body.releaseSignature !== undefined) updateData.releaseSignature = body.releaseSignature;

    const updatedAd = await prisma.ad.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(safeResponse(updatedAd, toClientAd));
  } catch (error) {
    const { status, message } = handlePrismaError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.ad.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const { status, message } = handlePrismaError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
