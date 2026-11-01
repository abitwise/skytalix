#!/usr/bin/env bash
# qe-tc-depth-probe sanity block: 20 games skytalix vs itself (same build), st=<s>, rating.ts's skytalix engine shape
# (st, timemargin = 5000 - budget, restart=on, default options: level 5, OwnBook on), openings.epd 1..10 both colours.
# usage: sanity.sh <tools.env> <clone> <out> <st-seconds> <timemargin-ms>
set -u
envf=$1; CL=$2; G=$3; ST=$4; TM=$5
set -a; . "$envf"; set +a
mkdir -p "$G"
trap 'kill -TERM $cc 2>/dev/null; sleep 2; pkill -TERM -f "$CL/dist/uci.js"' TERM
"$CUTECHESS_CLI" \
  -engine name=sky-a cmd="$(command -v node)" arg="$CL/dist/uci.js" dir="$CL" st="$ST" timemargin="$TM" restart=on stderr="$G/sky-a.stderr" \
  -engine name=sky-b cmd="$(command -v node)" arg="$CL/dist/uci.js" dir="$CL" st="$ST" timemargin="$TM" restart=on stderr="$G/sky-b.stderr" \
  -each proto=uci \
  -openings file="$CL/tools/rating/openings.epd" format=epd order=sequential -repeat \
  -games 2 -rounds 10 -concurrency 1 -maxmoves 200 -pgnout "$G/s.pgn" -debug all > "$G/s.log" 2>&1 &
cc=$!
wait $cc; rc=$?
echo "cutechess rc=$rc" >> "$G/s.rc"
exit $rc
