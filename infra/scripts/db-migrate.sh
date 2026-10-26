#!/usr/bin/env bash
set -e

echo "==> Running Prisma Migrations..."
npx prisma migrate dev --schema=./database/prisma/schema.prisma

echo "==> Generating Prisma Client..."
npx prisma generate --schema=./database/prisma/schema.prisma

echo "==> Seeding Database..."
node database/seed/seed.js

echo "==> Database migration and seed complete!"
