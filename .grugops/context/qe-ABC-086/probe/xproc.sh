#!/usr/bin/env bash
# QE probe (qe-ABC-086, focus 1): determinism ACROSS SEPARATE node PROCESSES. For each
# (budget, step), three fresh processes over the shared 30: P1 forward, P2 reverse order, P3
# forward after warm-up searches at other budgets/steps. Every row (move, score, depth, nodes,
# elapsedMs) must be byte-identical across the three. argv: <out-dir>
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$1"; mkdir -p "$OUT"
for cfg in "2 1" "24 1" "24 0.5" "8 0.25" "60 1"; do
  set -- $cfg; b=$1; s=$2
  node "$HERE/xproc-worker.mts" "$b" "$s" fwd 0 > "$OUT/b${b}-s${s}-P1-fwd.jsonl"
  node "$HERE/xproc-worker.mts" "$b" "$s" rev 0 > "$OUT/b${b}-s${s}-P2-rev.jsonl"
  node "$HERE/xproc-worker.mts" "$b" "$s" fwd 1 > "$OUT/b${b}-s${s}-P3-warm.jsonl"
  n=$(wc -l < "$OUT/b${b}-s${s}-P1-fwd.jsonl" | tr -d ' ')
  d12=$(diff "$OUT/b${b}-s${s}-P1-fwd.jsonl" "$OUT/b${b}-s${s}-P2-rev.jsonl" | grep -c '^<')
  d13=$(diff "$OUT/b${b}-s${s}-P1-fwd.jsonl" "$OUT/b${b}-s${s}-P3-warm.jsonl" | grep -c '^<')
  depths=$(node -e 'const fs=require("fs");const r=fs.readFileSync(process.argv[1],"utf8").trim().split("\n").map(JSON.parse);const h={};for(const x of r)h[x.depth]=(h[x.depth]||0)+1;console.log(JSON.stringify(h))' "$OUT/b${b}-s${s}-P1-fwd.jsonl")
  echo "budget=$b step=$s positions=$n rows-differing P1vsP2=$d12 P1vsP3=$d13 depth-histogram=$depths"
done
