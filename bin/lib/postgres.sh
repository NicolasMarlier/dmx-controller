# Dockerized PostgreSQL for DMX Control -- shared by bin/start and bin/full_start.
#
# Source it, then call:
#   ensure_docker      # Docker Desktop up and answering
#   ensure_postgres    # container created/started, accepting connections
#   seed_db_if_fresh   # brand-new volume: load the newest dump
#   run_migrations     # pending sequelize migrations (mtime-stamp guarded)
#
# It exports DATABASE_URL, which is all the server and sequelize-cli need.
#
# The database runs on 5433, deliberately not the global 5432, so it never
# collides with a Postgres.app the machine may also be running. Both launchers
# share this one container: they use different app ports, so they can run side
# by side, and now see the same data.

DB_CONTAINER="${DMX_DB_CONTAINER:-dmx-control-postgres}"
DB_VOLUME="${DMX_DB_VOLUME:-dmx-control-pgdata}"
DB_IMAGE="${DMX_DB_IMAGE:-postgres:18}"
DB_PORT="${DMX_DB_PORT:-5433}"
DB_NAME="${DMX_DB_NAME:-dmx_control}"

# The server and sequelize-cli both read this.
export DATABASE_URL="postgres://postgres@localhost:${DB_PORT}/${DB_NAME}"

# Callers that already define these keep their own (full_start prefixes its logs).
declare -f log >/dev/null 2>&1 || log() { echo "[db] $*"; }
declare -f die >/dev/null 2>&1 || die() { echo "[db] ERROR: $*" >&2; exit 1; }
declare -f prefix_output >/dev/null 2>&1 || prefix_output() {
  local label="$1"
  while IFS= read -r line; do
    echo "[$label] $line"
  done
}

# Derived here so a bare `source` works; a caller that set them wins.
ROOT="${ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
STATE_DIR="${STATE_DIR:-$HOME/Library/Application Support/dmx-control}"
MIGRATION_STAMP="${MIGRATION_STAMP:-$STATE_DIR/migrations.stamp}"
mkdir -p "$STATE_DIR"

# Set by ensure_postgres, read by seed_db_if_fresh and run_migrations.
FRESH_DB=0


ensure_docker() {
  command -v docker >/dev/null 2>&1 || die "docker not found in PATH"

  if ! docker info >/dev/null 2>&1; then
    log "Docker is not running, starting Docker Desktop..."
    open -ga Docker || die "could not launch Docker Desktop"
    local i=0
    while [ $i -lt 90 ]; do
      docker info >/dev/null 2>&1 && break
      sleep 2
      i=$((i + 1))
    done
    docker info >/dev/null 2>&1 || die "Docker did not become ready in time"
  fi
  log "Docker is ready"
}

ensure_postgres() {
  local status i
  status=$(docker inspect -f '{{.State.Status}}' "$DB_CONTAINER" 2>/dev/null) || status="missing"
  FRESH_DB=0

  if [ "$status" = "running" ]; then
    log "Postgres container '$DB_CONTAINER' already running"
  elif [ "$status" = "missing" ]; then
    # No volume yet means we are creating the database from scratch.
    docker volume inspect "$DB_VOLUME" >/dev/null 2>&1 || FRESH_DB=1
    log "Creating postgres container '$DB_CONTAINER' ($DB_IMAGE) on port $DB_PORT"
    docker run -d \
      --name "$DB_CONTAINER" \
      -e POSTGRES_HOST_AUTH_METHOD=trust \
      -e POSTGRES_DB="$DB_NAME" \
      -p "127.0.0.1:${DB_PORT}:5432" \
      -v "${DB_VOLUME}:/var/lib/postgresql" \
      "$DB_IMAGE" >/dev/null || die "could not start the postgres container"
  else
    log "Restarting postgres container '$DB_CONTAINER' (was $status)"
    docker start "$DB_CONTAINER" >/dev/null || die "could not restart the postgres container"
  fi

  log "Waiting for postgres..."
  i=0
  while [ $i -lt 60 ]; do
    docker exec "$DB_CONTAINER" pg_isready -U postgres -d "$DB_NAME" >/dev/null 2>&1 && break
    sleep 1
    i=$((i + 1))
  done
  docker exec "$DB_CONTAINER" pg_isready -U postgres -d "$DB_NAME" >/dev/null 2>&1 \
    || die "postgres never became ready (docker logs $DB_CONTAINER)"
  log "Postgres ready on $DATABASE_URL"
}

seed_db_if_fresh() {
  [ "$FRESH_DB" = "1" ] || return 0

  local latest_dump
  latest_dump=$(ls -1 "$ROOT/dmx-control-server/dumps"/*.sql 2>/dev/null | tail -1)
  if [ -n "$latest_dump" ]; then
    log "Fresh database, loading $(basename "$latest_dump")"
    docker exec -i "$DB_CONTAINER" psql -q -U postgres -d "$DB_NAME" < "$latest_dump" >/dev/null \
      || log "WARNING: loading the dump reported errors, continuing"
  else
    log "Fresh database, no dump to load"
  fi
}

# sequelize-cli costs a few seconds, so only pay it when a migration was added.
run_migrations() {
  local newest_migration
  newest_migration=$(ls -t "$ROOT/dmx-control-server/migrations"/*.js 2>/dev/null | head -1)
  if [ "$FRESH_DB" = "1" ] || [ ! -f "$MIGRATION_STAMP" ] || [ "$newest_migration" -nt "$MIGRATION_STAMP" ]; then
    log "Running migrations..."
    (cd "$ROOT/dmx-control-server" && npx sequelize-cli db:migrate --url "$DATABASE_URL" 2>&1 | prefix_output "migrate") \
      || die "migrations failed"
    touch "$MIGRATION_STAMP"
  else
    log "No new migrations"
  fi
}

# Stop the container on exit only when asked; leaving it up makes the next
# start instant, and the other launcher may still be using it.
stop_db_if_requested() {
  if [ "${DMX_STOP_DB:-0}" = "1" ]; then
    log "Stopping postgres container"
    docker stop "$DB_CONTAINER" >/dev/null 2>&1
  fi
}
