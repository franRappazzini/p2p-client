# Salana P2P - Client

P2P exchange platform built with Next.js, Solana, and PostgreSQL.

**Program Repository**: [https://github.com/franRappazzini/p2p/tree/winter-hackathon](https://github.com/franRappazzini/p2p/tree/winter-hackathon)

# How Solana Powers the Core of Our Project

Solana is not just a blockchain choice for our P2P exchange platform—it's the fundamental enabler that makes decentralized fiat-to-crypto trading actually viable and competitive with centralized solutions.

## Speed Enables Real-Time Trading

P2P exchanges require immediate transaction finality. When a buyer confirms fiat payment, the crypto needs to be released from escrow instantly. Solana's 400ms block times and sub-second finality make this possible. Users experience the responsiveness they expect from modern financial applications, with transactions confirming almost immediately. This speed is crucial for building trust in the P2P exchange process, where any delay creates uncertainty and friction.

## Low Fees Make Micro-Transactions Feasible

Our platform targets global adoption, including users in emerging markets who may trade small amounts. With transaction costs averaging $0.00025, Solana makes every trade economically viable regardless of size. Whether someone is trading $10 or $10,000, the fees remain negligible. This truly democratizes access to cryptocurrency, ensuring that cost is never a barrier to entry for anyone, anywhere in the world.

## Program Architecture for Trustless Escrow

Our smart contract leverages Solana's account model and Program Derived Addresses (PDAs) to create secure, trustless escrow mechanics. When an order is created, funds are locked in a PDA controlled by our program logic—neither party can access them unilaterally. The escrow automatically releases crypto to the buyer only when conditions are met, or returns it to the seller if the trade is cancelled. This eliminates counterparty risk without requiring a trusted third party, making peer-to-peer trading truly safe and decentralized.

## Scalability for Global Adoption

Solana's capacity to handle 65,000+ transactions per second means our platform can scale globally without congestion or degraded performance. As trading volume grows, the network maintains consistent speed and costs. This scalability is critical for a P2P platform where thousands of users might be creating orders, updating escrows, and completing trades simultaneously across different regions and time zones.

**In summary:** Solana's combination of speed, cost-efficiency, and robust programming capabilities makes decentralized P2P fiat-crypto exchange not just possible, but practical and scalable. The network provides the infrastructure needed to deliver a smooth, affordable, and trustless experience that can serve users globally without compromise.

## Database Setup

### Vercel Postgres (Production)

1. **Create database on Vercel:**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project
   - Go to the **Storage** tab
   - Click on **Create Database**
   - Select **Postgres**
   - Follow the steps to create your database

2. **Configure environment variables:**

   - Vercel will automatically add `POSTGRES_URL` when you connect Vercel Postgres
   - You don't need to add additional variables, the project uses `POSTGRES_URL` automatically

3. **Deploy:**
   - Push to your repository
   - Vercel will automatically run migrations during build thanks to the `vercel-build` script

### Local Development

1. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
2. **Update `.env.local` with your database URL:**

   ```env
   PRISMA_DATABASE_URL="postgresql://user:password@localhost:5432/p2p_dev"
   ```

3. **Run migrations:**

   ```bash
   npx prisma migrate dev --name init
   ```

4. **Generate Prisma client:**

   ```bash
   npx prisma generate
   ```

5. **Seed test data (optional):**
   ```bash
   bun run db:seed
   ```

### Useful Commands

- **Explore database with Prisma Studio:**

  ```bash
  bun run db:studio
  ```

- **Create new migration:**

  ```bash
  npx prisma migrate dev --name migration_name
  ```

- **Apply migrations in production:**

  ```bash
  npx prisma migrate deploy
  ```

- **Reset database (⚠️ deletes all data):**

  ```bash
  npx prisma migrate reset
  ```

- **View current schema:**
  ```bash
  npx prisma db pull
  ```

### Backup Strategy

For Vercel Postgres free tier, automatic backups are not included. We recommend exporting data periodically:

```bash
# Export database
pg_dump $PRISMA_DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore from backup
psql $PRISMA_DATABASE_URL < backup-YYYYMMDD.sql
```

For automated backups, consider using services like:

- Vercel Postgres Pro (includes automatic backups)
- External services like Neon, Supabase, or Railway

## Development

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

## Tech Stack

- **Frontend:** Next.js 16, React 19, TailwindCSS
- **Database:** PostgreSQL with Prisma ORM
- **Blockchain:** Solana, Anchor Framework
- **Wallet:** Dynamic Labs
- **Deployment:** Vercel
