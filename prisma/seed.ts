import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // Limpiar datos existentes
  console.log("🧹 Limpiando datos existentes...");
  await prisma.rating.deleteMany();
  await prisma.ad.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios de prueba
  console.log("👥 Creando usuarios...");

  const user1 = await prisma.user.create({
    data: {
      walletAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      username: "trader_sol",
      telegramUsername: "@trader_sol",
      positiveRatings: 15,
      negativeRatings: 2,
      completedTrades: 17,
      ratingSum: 78,
      ratingCount: 17,
      reputation: 4.59,
    },
  });
  console.log(`✓ Usuario creado: ${user1.username} (${user1.walletAddress})`);

  const user2 = await prisma.user.create({
    data: {
      walletAddress: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
      username: "usdc_buyer",
      telegramUsername: "@usdc_buyer",
      positiveRatings: 8,
      negativeRatings: 0,
      completedTrades: 8,
      ratingSum: 40,
      ratingCount: 8,
      reputation: 5.0,
    },
  });
  console.log(`✓ Usuario creado: ${user2.username} (${user2.walletAddress})`);

  const user3 = await prisma.user.create({
    data: {
      walletAddress: "DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK",
      username: "p2p_veteran",
      telegramUsername: "@p2p_veteran",
      positiveRatings: 42,
      negativeRatings: 3,
      completedTrades: 45,
      ratingSum: 212,
      ratingCount: 45,
      reputation: 4.71,
    },
  });
  console.log(`✓ Usuario creado: ${user3.username} (${user3.walletAddress})`);

  // Crear ads de prueba
  console.log("\n📢 Creando anuncios...");

  const now = new Date();

  // Ad 1: BUY wSOL - ACTIVE
  const ad1 = await prisma.ad.create({
    data: {
      creatorWallet: user1.walletAddress,
      type: "BUY",
      tokenMint: "wSOL",
      tokenAmount: 5,
      fiatCurrency: "USD",
      fiatAmount: 1000.0,
      paymentMethod: "PayPal, Bank Transfer",
      pricePerToken: 200.0,
      terms: "Fast payment. Available 24/7. Verified seller.",
      timeLimit: 1800, // 30 min
      status: "ACTIVE",
      createdAt: now,
      expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 días
    },
  });
  console.log(`✓ Ad creado: ${ad1.type} ${ad1.tokenAmount} ${ad1.tokenMint} - ${ad1.status}`);

  // Ad 2: SELL USDC - ACTIVE
  const ad2 = await prisma.ad.create({
    data: {
      creatorWallet: user2.walletAddress,
      type: "SELL",
      tokenMint: "USDC",
      tokenAmount: 500.0,
      fiatCurrency: "EUR",
      fiatAmount: 465.0,
      paymentMethod: "SEPA Transfer",
      pricePerToken: 0.93,
      terms: "Only SEPA transfers. Payment within 1 hour.",
      timeLimit: 3600, // 1 hour
      status: "ACTIVE",
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 horas atrás
      expiresAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 días
    },
  });
  console.log(`✓ Ad creado: ${ad2.type} ${ad2.tokenAmount} ${ad2.tokenMint} - ${ad2.status}`);

  // Ad 3: BUY USDT - TAKEN
  const ad3 = await prisma.ad.create({
    data: {
      creatorWallet: user3.walletAddress,
      type: "BUY",
      tokenMint: "USDT",
      tokenAmount: 1000.0,
      fiatCurrency: "ARS",
      fiatAmount: 1000000.0,
      paymentMethod: "Mercado Pago, Bank Transfer (CBU)",
      pricePerToken: 1000.0,
      terms: "Compro USDT. Pago inmediato por Mercado Pago.",
      timeLimit: 1800,
      status: "TAKEN",
      takenBy: user1.walletAddress,
      createdAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 min atrás
      expiresAt: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000), // 6 días
    },
  });
  console.log(`✓ Ad creado: ${ad3.type} ${ad3.tokenAmount} ${ad3.tokenMint} - ${ad3.status}`);

  // Ad 4: SELL wSOL - ESCROW_CREATED
  const ad4 = await prisma.ad.create({
    data: {
      creatorWallet: user2.walletAddress,
      type: "SELL",
      tokenMint: "wSOL",
      tokenAmount: 10.0,
      fiatCurrency: "USD",
      fiatAmount: 2050.0,
      paymentMethod: "Zelle, Cash App",
      pricePerToken: 205.0,
      terms: "Quick release after payment confirmation.",
      timeLimit: 1800,
      status: "ESCROW_CREATED",
      escrowId: 1001,
      takenBy: user3.walletAddress,
      creationSignature: "5xK3...",
      createdAt: new Date(now.getTime() - 45 * 60 * 1000), // 45 min atrás
      expiresAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
    },
  });
  console.log(`✓ Ad creado: ${ad4.type} ${ad4.tokenAmount} ${ad4.tokenMint} - ${ad4.status}`);

  // Ad 5: SELL USDC - PAID
  const ad5 = await prisma.ad.create({
    data: {
      creatorWallet: user1.walletAddress,
      type: "SELL",
      tokenMint: "USDC",
      tokenAmount: 750.0,
      fiatCurrency: "USD",
      fiatAmount: 750.0,
      paymentMethod: "Bank Transfer",
      pricePerToken: 1.0,
      terms: "Bank transfer only. Fast release.",
      timeLimit: 3600,
      status: "PAID",
      escrowId: 1002,
      takenBy: user2.walletAddress,
      creationSignature: "3aB7...",
      paidSignature: "8kL9...",
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
      expiresAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    },
  });
  console.log(`✓ Ad creado: ${ad5.type} ${ad5.tokenAmount} ${ad5.tokenMint} - ${ad5.status}`);

  // Ad 6: BUY wSOL - COMPLETED
  const ad6 = await prisma.ad.create({
    data: {
      creatorWallet: user3.walletAddress,
      type: "BUY",
      tokenMint: "wSOL",
      tokenAmount: 20.0,
      fiatCurrency: "USD",
      fiatAmount: 4000.0,
      paymentMethod: "PayPal",
      pricePerToken: 200.0,
      terms: "Verified PayPal only.",
      timeLimit: 1800,
      status: "COMPLETED",
      escrowId: 1003,
      takenBy: user1.walletAddress,
      creationSignature: "9mN4...",
      paidSignature: "2pQ8...",
      releaseSignature: "7rS1...",
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 días atrás
      expiresAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    },
  });
  console.log(`✓ Ad creado: ${ad6.type} ${ad6.tokenAmount} ${ad6.tokenMint} - ${ad6.status}`);

  // Ad 7: SELL USDT - COMPLETED
  const ad7 = await prisma.ad.create({
    data: {
      creatorWallet: user1.walletAddress,
      type: "SELL",
      tokenMint: "USDT",
      tokenAmount: 2000.0,
      fiatCurrency: "EUR",
      fiatAmount: 1860.0,
      paymentMethod: "SEPA",
      pricePerToken: 0.93,
      terms: "SEPA only. Trusted trader.",
      timeLimit: 3600,
      status: "COMPLETED",
      escrowId: 1004,
      takenBy: user3.walletAddress,
      creationSignature: "4tV6...",
      paidSignature: "1wX3...",
      releaseSignature: "6yZ9...",
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 días atrás
      expiresAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
    },
  });
  console.log(`✓ Ad creado: ${ad7.type} ${ad7.tokenAmount} ${ad7.tokenMint} - ${ad7.status}`);

  // Ad 8: BUY USDC - ACTIVE
  const ad8 = await prisma.ad.create({
    data: {
      creatorWallet: user2.walletAddress,
      type: "BUY",
      tokenMint: "USDC",
      tokenAmount: 300.0,
      fiatCurrency: "USD",
      fiatAmount: 300.0,
      paymentMethod: "Cash App, Venmo",
      pricePerToken: 1.0,
      terms: "Fast payment. Good reputation required.",
      timeLimit: 1800,
      status: "ACTIVE",
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hora atrás
      expiresAt: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
    },
  });
  console.log(`✓ Ad creado: ${ad8.type} ${ad8.tokenAmount} ${ad8.tokenMint} - ${ad8.status}`);

  // Crear ratings
  console.log("\n⭐ Creando calificaciones...");

  const rating1 = await prisma.rating.create({
    data: {
      fromWallet: user1.walletAddress,
      toWallet: user3.walletAddress,
      adId: ad6.id,
      rating: 5,
      comment: "Excellent trader! Very fast and reliable.",
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    },
  });
  console.log(`✓ Rating creado: ${rating1.rating}⭐ de ${user1.username} a ${user3.username}`);

  const rating2 = await prisma.rating.create({
    data: {
      fromWallet: user3.walletAddress,
      toWallet: user1.walletAddress,
      adId: ad6.id,
      rating: 5,
      comment: "Perfect transaction. Highly recommended!",
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    },
  });
  console.log(`✓ Rating creado: ${rating2.rating}⭐ de ${user3.username} a ${user1.username}`);

  const rating3 = await prisma.rating.create({
    data: {
      fromWallet: user3.walletAddress,
      toWallet: user1.walletAddress,
      adId: ad7.id,
      rating: 4,
      comment: "Good experience. Minor delay in release.",
      createdAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
    },
  });
  console.log(`✓ Rating creado: ${rating3.rating}⭐ de ${user3.username} a ${user1.username}`);

  const rating4 = await prisma.rating.create({
    data: {
      fromWallet: user1.walletAddress,
      toWallet: user3.walletAddress,
      adId: ad7.id,
      rating: 5,
      comment: "Great trader! Will trade again.",
      createdAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
    },
  });
  console.log(`✓ Rating creado: ${rating4.rating}⭐ de ${user1.username} a ${user3.username}`);

  const rating5 = await prisma.rating.create({
    data: {
      fromWallet: user2.walletAddress,
      toWallet: user3.walletAddress,
      adId: ad4.id,
      rating: 5,
      comment: "Fast payment, no issues!",
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
  });
  console.log(`✓ Rating creado: ${rating5.rating}⭐ de ${user2.username} a ${user3.username}`);

  console.log("\n✅ Seed completado exitosamente!");
  console.log(`\n📊 Resumen:`);
  console.log(`   • ${3} usuarios creados`);
  console.log(`   • ${8} anuncios creados`);
  console.log(`   • ${5} calificaciones creadas`);
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
