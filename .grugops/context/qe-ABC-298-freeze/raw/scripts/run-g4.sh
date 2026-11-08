#!/usr/bin/env bash
# qe-ABC-298-freeze G4 runner (SG1 (b)), serial: one process at a time on one core (the qe-ABC-254 runner used a
# pool; the rows are deterministic, so the layout is the same either way). Run as:
#   flock <scratch>/host-test.lock taskset -c 0 bash run-g4.sh <tree> <outDir> <part>...
# parts: lists choose search doors unpruned sample ordering:<i>/<of>  (corpus runs in batch A)
# File names sort into one fixed layout; join.sh concatenates them in name order into g4.jsonl and g4-sample.jsonl.
set -u
T=$1; O=$2; shift 2; S=$(dirname "$(readlink -f "$0")"); mkdir -p "$O"
for part in "$@"; do
  echo "g4 $part start $(date -u +%FT%TZ)" >> "$O/holds.txt"
  case $part in
    lists) node "$S/g4.mjs" "$T" lists > "$O/g4-1-lists.jsonl" 2> "$O/g4-1-lists.err" ;;
    choose) node "$S/g4.mjs" "$T" choose > "$O/g4-2-choose.jsonl" 2> "$O/g4-2-choose.err" ;;
    search) node "$S/g4.mjs" "$T" search > "$O/g4-3-search.jsonl" 2> "$O/g4-3-search.err" ;;
    doors) node "$S/g4.mjs" "$T" doors > "$O/g4-4-doors.jsonl" 2> "$O/g4-4-doors.err" ;;
    unpruned) node "$S/g4.mjs" "$T" unpruned > "$O/g4-5-unpruned.jsonl" 2> "$O/g4-5-unpruned.err" ;;
    sample) A1_UNPRUNED_DEPTH=5 A1_FAMILIES=kq-corner,kr-corner,kqk-h8,kp-vs-k,krk-a-file,pawn-race,position-3 \
      node "$S/g4.mjs" "$T" unpruned > "$O/g4-9-sample.jsonl" 2> "$O/g4-9-sample.err" ;;
    ordering:*) sh=${part#ordering:}; tag=$(printf %02d "${sh%/*}")
      node "$S/g4.mjs" "$T" ordering "$sh" > "$O/g4-6-ordering-$tag.jsonl" 2> "$O/g4-6-ordering-$tag.err" ;;
    *) echo "unknown part $part" >&2; exit 2 ;;
  esac
  echo "g4 $part exit $?" >> "$O/exits.txt"
  echo "g4 $part end $(date -u +%FT%TZ)" >> "$O/holds.txt"
done
