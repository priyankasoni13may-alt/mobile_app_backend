#!/usr/bin/env bash
set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="$BACKUP_DIR/lumora_backup_$TIMESTAMP.sql"

mkdir -p "$BACKUP_DIR"

echo "==> Creating PostgreSQL backup to $FILENAME..."
pg_dump -U postgres -h localhost -d lumora_cypher_db > "$FILENAME"

echo "==> Backup completed: $FILENAME"
