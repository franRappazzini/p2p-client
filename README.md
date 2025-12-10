# P2P Trading Platform

P2P exchange platform built with Next.js, Solana, and PostgreSQL.

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
