#!/bin/bash
# QE seed 5061: PUZZLE_DEEP=1 on base and branch, alternating, load1 + thermal recorded per run.
# usage: quiet-runs.sh <base-tree> <branch-tree> <outdir> <rounds>
set -u
B=$1; H=$2; O=$3; N=$4
mk() { printf '%s load1=%s thermal=%s' "$(date -u +%FT%TZ)" "$(sysctl -n vm.loadavg | awk '{print $2}')" "$(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}')"; }
for r in $(seq 1 "$N"); do
  for side in base branch; do
    T=$B; [ "$side" = branch ] && T=$H
    f="$O/r$r-$side.txt"
    { echo "# round $r $side tree $(git -C "$T" rev-parse --short=8 HEAD)"; echo "# start $(mk)"; } > "$f"
    ( cd "$T" && PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts ) >> "$f" 2>&1
    ec=$?
    echo "# end $(mk) exit=$ec" >> "$f"
    { printf 'r%s\t%s\t' "$r" "$side"; grep -E '^# (start|end)' "$f" | tr '\n' '\t'; grep -E 'PUZZLES shipped|seed 5061' "$f" | tr '\n' '\t'; echo; } >> "$O/summary.tsv"
  done
done
