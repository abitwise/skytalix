#!/bin/sh
# Recount QE's ABC-127 A3 per-row files with seeds 1982/1008/1424/1075 removed (ADR-0034 (b)).
# usage: drop-recount.sh <qe-ABC-127/probe dir>
D="$1"; DROP='seed (1982|1008|1424|1075):'
for f in "$D"/raw-deep-process1.rows.txt "$D"/a3/W*.rows.txt; do
  n=$(grep -c . "$f"); s=$(grep -c '^SOLVED' "$f")
  n2=$(grep -Ev "$DROP" "$f" | grep -c .); s2=$(grep -Ev "$DROP" "$f" | grep -c '^SOLVED')
  printf '%s\t%s/%s\t-> %s/%s\t%s\n' "$(basename "$f" .rows.txt)" "$s" "$n" "$s2" "$n2" "$( [ "$s2" -ge 54 ] && echo green || echo RED )"
done
