#!/bin/sh

# Default to port 5000 if not set
PORT="${PORT:-5000}"
HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-3306}"

echo "Waiting for MySQL at $HOST:$DB_PORT..."

# Wait loop
# We try to connect to the TCP port. 
# netcat (nc) is often missing in minimal images, so we use a pure shell approach or sleep loop.
# Since we might not have netcat, we will just use a simple sleep loop with a retry on the app side,
# OR we can try a simple timeout loop if the container has `nc`. 
# Let's assume a simple sleep for now, as nodejs will retry on connection failure if programmed, 
# BUT `server.js` currently fails immediately on start if DB check fails.

# A safer approach without extra dependencies is just sleeping a bit, 
# but better is to loop until the port is open using python or node if available, or just `nc`.
# Alpine images usually have `nc`.

until nc -z -v -w30 "$HOST" "$DB_PORT"
do
  echo "Waiting for database connection..."
  # wait for 5 seconds before check again
  sleep 5
done

echo "Database is up - executing command"
exec node server.js