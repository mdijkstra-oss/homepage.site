#!/bin/sh
# KNOWN ISSUE: the POST is synchronous, so an ingest endpoint that is slow or
# unreachable stalls this loop, fills the 64 KiB pipe behind it, and eventually
# blocks the application's own writes to stdout inside a request handler. curl's
# -m bounds one stall to 5s; sustained log volume is what would make it bite.
set -u

SERVICE="${BETTERSTACK_SERVICE:-unknown}"

while IFS= read -r line; do
  printf '%s\n' "$line"

  [ -n "$line" ] || continue
  [ -n "${BETTERSTACK_INGEST_HOST:-}" ] && [ -n "${BETTERSTACK_SOURCE_TOKEN:-}" ] || continue

  # Normalised so one query works across all three services: slog's "time" becomes
  # the "dt" Better Stack reads as the event time, chancery's nested "data" is
  # flattened to the top level where dragoman already puts the same kind of field,
  # and a non-JSON line becomes "msg" — the name the Go services use — rather than
  # a second spelling of it. Top-level keys win a collision with a flattened one.
  #
  # Unstructured output is level error because the services log everything routine
  # as JSON: what arrives as plain text is nginx's error_log or a panic.
  #
  # level is upper-cased because slog writes ERROR while nginx and the wrapper
  # write lower case, and a filter has to match one spelling.
  payload="$(printf '%s' "$line" | jq -Rc --arg svc "$SERVICE" '
    . as $raw
    | (try fromjson catch null) as $parsed
    | if ($parsed | type) == "object"
      then ( $parsed
             | (if has("time") and (has("dt") | not) then .dt = .time | del(.time) else . end)
             | (if (.data | type) == "object" then (.data + del(.data)) else . end)
             | (if (.level | type) == "string" then .level |= ascii_upcase else . end)
             | . + {service: $svc} )
      else {service: $svc, level: "ERROR", msg: $raw}
      end
  ')" || continue

  # -f so a rejected token or payload is an error rather than a silent 4xx, and
  # stderr left open so it is visible. Without both, misconfiguration looks
  # exactly like having no logs.
  curl -sS -f -m 5 -o /dev/null \
    "https://${BETTERSTACK_INGEST_HOST}" \
    -H "Authorization: Bearer ${BETTERSTACK_SOURCE_TOKEN}" \
    -H "Content-Type: application/x-ndjson" \
    --data-binary "$payload" \
    || printf 'ship: POST failed\n' >&2
done
