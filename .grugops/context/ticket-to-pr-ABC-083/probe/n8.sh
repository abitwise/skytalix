#!/bin/bash
# ABC-083 cost per ADR-0035 decision 2: the NARROW set (every test file the ticket adds or modifies, plus
# `npx vitest related --run src/evaluate.ts`: 15 files). Three out-of-tree trees: base, head, and a twin
# of base (identity null). Base and twin carry a one-assertion placeholder at the ADDED file's path.
# CPU = user + sys of the whole `npx vitest run <set>` process tree, one fresh process per run, rounds
# rotated, round 0 discarded, load1 logged before every run (logged, never gated).
# Usage: n8.sh <root-with-base,head,twin> <rounds> <out.tsv>
R=$1; N=$2; OUT=$3
SET="src/cli.real-engine.test.ts src/engine.capacity.test.ts src/engine.test.ts src/evaluate.king-mobility.test.ts src/evaluate.pawns.test.ts src/evaluate.test.ts src/levels.test.ts src/puzzle-suite.test.ts src/quiescence.test.ts src/search.capacity.test.ts src/search.ordering.test.ts src/search.pvs-lmr.test.ts src/search.qe.test.ts src/search.test.ts src/transposition.test.ts"
ARMS=(base head twin)
printf 'round\tarm\tload1\tuser\tsys\tcpu\treal\tpassed\tfailed\n' > "$OUT"
for ((r=0; r<=N; r++)); do
  for ((i=0; i<3; i++)); do
    arm=${ARMS[$(( (i + r) % 3 ))]}
    cd "$R/$arm" || exit 1
    load=$(sysctl -n vm.loadavg | awk '{print $2}')
    { TIMEFORMAT='%U %S %R'; time npx vitest run $SET > "$R/$arm.last.log" 2>&1 ; } 2> "$R/$arm.time"
    read u s re < <(tail -1 "$R/$arm.time")
    p=$(grep -E 'Tests ' "$R/$arm.last.log" | grep -oE '[0-9]+ passed' | grep -oE '[0-9]+'); f=$(grep -E 'Tests ' "$R/$arm.last.log" | grep -oE '[0-9]+ failed' | grep -oE '[0-9]+')
    printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$r" "$arm" "$load" "$u" "$s" "$(echo "$u + $s" | bc)" "$re" "${p:-0}" "${f:-0}" >> "$OUT"
  done
done
