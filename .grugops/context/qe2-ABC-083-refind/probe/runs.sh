#!/bin/bash
# QE2 ABC-083 re-find: PUZZLE_DEEP runs on base(+5147 row) and branch, load1 + thermal per run.
# usage: runs.sh <base-tree> <branch-tree> <outdir> <rounds>   (then one PUZZLE_DEEP=weakened on branch)
set -u
B=$1; H=$2; O=$3; N=$4
mk() { printf '%s load1=%s thermal=%s' "$(date -u +%FT%TZ)" "$(sysctl -n vm.loadavg | awk '{print $2}')" "$(notifyutil -g com.apple.system.thermalpressurelevel | awk '{print $2}')"; }
one() { # label tree mode file
  { echo "# $1 tree $(git -C "$2" rev-parse --short=8 HEAD 2>/dev/null || echo 5ed308a8+b29c837c-row) PUZZLE_DEEP=$3"; echo "# start $(mk)"; } > "$4"
  ( cd "$2" && PUZZLE_DEEP=$3 npx vitest run src/puzzle-suite.test.ts ) >> "$4" 2>&1
  ec=$?; echo "# end $(mk) exit=$ec" >> "$4"
  { printf '%s\t' "$1"; grep -E '^# (start|end)' "$4" | tr '\n' '\t'; grep -E 'PUZZLES shipped|seed 5147|NEWLY|Tests ' "$4" | tr -s ' ' | tr '\n' '\t'; echo; } >> "$O/summary.tsv"
}
for r in $(seq 1 "$N"); do
  one "r$r-base" "$B" 1 "$O/r$r-base.txt"
  one "r$r-branch" "$H" 1 "$O/r$r-branch.txt"
done
one "weakened-branch" "$H" weakened "$O/weakened-branch.txt"
