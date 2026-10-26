#!/usr/bin/env bash
set -e

if [ -z "$1" ]; then
  echo "Usage: ./db-restore.sh <path-to-sql-backup>"
  exit 1
fi

BACKUP_FILE="$1"
echo "==> Restoring database from $BACKUP_FILE..."
psql -U postgres -h localhost -d lumora_cypher_db < "$BACKUP_FILE"

echo "==> Database restore completed successfully."
