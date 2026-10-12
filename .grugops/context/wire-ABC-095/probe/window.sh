#!/bin/bash
W=/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-ticket-to-pr-ABC-095
P=$W/.grugops/context/wire-ABC-095/probe/time.ts
deadline=$(( $(date +%s) + 900 ))
log() {
  echo "--- $1 $(date -u +%FT%TZ)"
  echo "load: $(sysctl -n vm.loadavg)"
  echo "therm: $(pmset -g therm 2>/dev/null | grep -v '^$' | tr '\n' ' ')"
  echo "power: $(pmset -g batt | head -1)"
  echo "vitest: $(pgrep -fl '[v]itest' | cut -c1-160 | tr '\n' '|')"
}
attempt=0
while [ $(date +%s) -lt $deadline ]; do
  if pgrep -f '[v]itest' >/dev/null; then sleep 15; continue; fi
  attempt=$((attempt+1))
  echo "=== attempt $attempt"
  log before
  cd $W
  for i in 1 2 3 4 5 6 7 8 9 10; do node $P $W cold-hit; done
  for i in 1 2 3; do node $P $W warm-miss; done
  log after
  if pgrep -f '[v]itest' >/dev/null; then echo "VOID: vitest appeared during the window"; sleep 15; continue; fi
  echo "CLEAN WINDOW"; exit 0
done
echo "NOT READ: no clean window by $(date -u +%FT%TZ)"; log end; exit 3
