#!/bin/bash

set -e

echo "🚀 Configurando entorno de desarrollo local para P2P Trading Platform"
echo ""

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker no está instalado"
    echo "Por favor instala Docker Desktop desde: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Verificar si Docker está corriendo
if ! docker info &> /dev/null; then
    echo "❌ Error: Docker no está corriendo"
    echo "Por favor inicia Docker Desktop y vuelve a ejecutar este script"
    exit 1
fi

echo "✅ Docker está instalado y corriendo"
echo ""

# Iniciar servicios de Docker
echo "🐳 Iniciando contenedor de PostgreSQL..."
docker compose up -d

# Esperar a que PostgreSQL esté listo
echo "⏳ Esperando a que PostgreSQL esté listo..."
sleep 5

# Verificar salud del contenedor
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker compose ps | grep -q "healthy"; then
        echo "✅ PostgreSQL está listo"
        break
    fi
    attempt=$((attempt + 1))
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ Error: PostgreSQL no está respondiendo después de 30 intentos"
        docker compose logs postgres
        exit 1
    fi
    sleep 1
done

echo ""

# Aplicar schema a la base de datos local
echo "📊 Aplicando schema de Prisma a la base de datos local..."
bun run db:push

echo ""

# Ejecutar seed
echo "🌱 Poblando base de datos con datos de prueba..."
bun run db:seed

echo ""
echo "✅ ¡Configuración completada exitosamente!"
echo ""
echo "📝 Próximos pasos:"
echo "1. Inicia el validador de Solana en otra terminal: solana-test-validator"
echo "2. Inicia el servidor de desarrollo: bun run dev"
echo "3. Abre http://localhost:3000 en tu navegador"
echo ""
echo "💡 Comandos útiles:"
echo "  - Ver logs de PostgreSQL: bun run docker:logs"
echo "  - Detener PostgreSQL: bun run docker:down"
echo "  - Resetear base de datos: bun run db:reset"
echo ""
