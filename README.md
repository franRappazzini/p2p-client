# P2P Trading Platform

Plataforma de intercambio P2P construida con Next.js, Solana y PostgreSQL.

## Database Setup

### Vercel Postgres (Production)

1. **Crear base de datos en Vercel:**

   - Ve al [Vercel Dashboard](https://vercel.com/dashboard)
   - Selecciona tu proyecto
   - Ve a la pestaña **Storage**
   - Click en **Create Database**
   - Selecciona **Postgres**
   - Sigue los pasos para crear tu base de datos

2. **Configurar variables de entorno:**

   - Vercel automáticamente agregará `POSTGRES_URL` cuando conectes Vercel Postgres
   - No necesitas agregar variables adicionales, el proyecto usa `POSTGRES_URL` automáticamente

3. **Deploy:**
   - Haz push a tu repositorio
   - Vercel automáticamente ejecutará las migraciones durante el build gracias al script `vercel-build`

### Local Development

1. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env.local
   ```
2. **Actualizar `.env.local` con tu URL de base de datos:**

   ```env
   PRISMA_DATABASE_URL="postgresql://user:password@localhost:5432/p2p_dev"
   ```

3. **Ejecutar migraciones:**

   ```bash
   npx prisma migrate dev --name init
   ```

4. **Generar cliente de Prisma:**

   ```bash
   npx prisma generate
   ```

5. **Seed de datos de prueba (opcional):**
   ```bash
   bun run db:seed
   ```

### Comandos Útiles

- **Explorar base de datos con Prisma Studio:**

  ```bash
  bun run db:studio
  ```

- **Crear nueva migración:**

  ```bash
  npx prisma migrate dev --name nombre_de_migracion
  ```

- **Aplicar migraciones en producción:**

  ```bash
  npx prisma migrate deploy
  ```

- **Reset de base de datos (⚠️ elimina todos los datos):**

  ```bash
  npx prisma migrate reset
  ```

- **Ver schema actual:**
  ```bash
  npx prisma db pull
  ```

### Backup Strategy

Para el tier gratuito de Vercel Postgres, los backups automáticos no están incluidos. Recomendamos exportar datos periódicamente:

```bash
# Exportar base de datos
pg_dump $PRISMA_DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restaurar desde backup
psql $PRISMA_DATABASE_URL < backup-YYYYMMDD.sql
```

Para backups automatizados, considera usar servicios como:

- Vercel Postgres Pro (incluye backups automáticos)
- Servicios externos como Neon, Supabase, o Railway

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
- **Database:** PostgreSQL con Prisma ORM
- **Blockchain:** Solana, Anchor Framework
- **Wallet:** Dynamic Labs
- **Deployment:** Vercel
