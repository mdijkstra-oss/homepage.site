#!/bin/sh
# Runs as PID 1, so the stop signal arrives here rather than at the application.
#
# The FIFO is what keeps the application's PID available to signal; a pipeline
# would not, and busybox ash has no process substitution.
#
# Only TERM is forwarded because only TERM can be: a shell starts an async
# command with INT and QUIT set to ignore, and an inherited SIG_IGN cannot be
# reset by the child, so a forwarded QUIT is discarded in silence. Anything here
# wanting a graceful stop has to be sent TERM, which is why the site image sets
# STOPSIGNAL SIGTERM rather than relying on nginx's QUIT.
set -u

# Removed first: PID 1 always yields the same name, so a FIFO left by a crashed
# predecessor in a reused /tmp would otherwise make this image unbootable.
FIFO="/tmp/logpipe.$$"
rm -f "$FIFO"
mkfifo "$FIFO" || { printf 'entrypoint: cannot create %s\n' "$FIFO" >&2; exit 1; }

"${SHIPPER:-/usr/local/bin/ship.sh}" <"$FIFO" &
SHIPPER_PID=$!

# Installed before the spawn: a TERM arriving in between would otherwise take
# the default action and kill PID 1 with the application still running.
APP=""
trap '[ -n "$APP" ] && kill -TERM "$APP" 2>/dev/null' TERM

"$@" >"$FIFO" 2>&1 &
APP=$!

# wait returns as soon as a trapped signal arrives, so it is repeated until the
# application has actually exited and the status collected is its own.
while :; do
  wait "$APP"
  STATUS=$?
  kill -0 "$APP" 2>/dev/null || break
done

wait "$SHIPPER_PID" 2>/dev/null
rm -f "$FIFO"

exit "$STATUS"
