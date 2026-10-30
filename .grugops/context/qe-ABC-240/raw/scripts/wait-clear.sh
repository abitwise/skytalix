#!/usr/bin/env bash
# Poll host.sh every 15 s, up to 60 min. Exit 0 when clear, 4 when it never clears (UNRESOLVED). usage: wait-clear.sh <host.jsonl>
S=$(dirname "$(readlink -f "$0")"); log=$1
for i in $(seq 1 240); do
  if "$S/host.sh" >> "$log"; then exit 0; fi
  sleep 15
done
exit 4
