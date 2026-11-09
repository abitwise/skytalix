#!/usr/bin/env bash
# se-ABC-298-repoint: one G4 hold. Corpus as batch A runs it, the rest through the frozen run-g4.sh.
#   flock <lock> taskset -c 0 bash g4-hold.sh <frozenScripts> <tree> <outDir> <part>...
set -u
Q=$1; T=$2; O=$3; shift 3; mkdir -p "$O"
for part in "$@"; do
  if [ "$part" = corpus ]; then
    node "$Q/g4.mjs" "$T" corpus > "$O/g4-0-corpus.jsonl" 2> "$O/g4-0-corpus.err"; echo "g4 corpus exit $?" >> "$O/exits.txt"
  else
    bash "$Q/run-g4.sh" "$T" "$O" "$part"
  fi
done
