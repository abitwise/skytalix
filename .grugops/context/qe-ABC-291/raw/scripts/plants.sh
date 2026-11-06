#!/bin/bash
# qe-ABC-291: K1's follow-ups and D8's leak. One copy per plant, rebuilt from the sealed archive, under <qe-scratch>/p, each run in one hold on one core.
# usage: plants.sh <qe-scratch> <raw-scripts> <lock> <worktree> <candidate sha>. A failed vitest here is the reading: read rows, not exit codes.
Q=$1 R=$2 L=$3 W=$4 C=$5 O=$Q/out/plants P=$Q/p; mkdir -p "$O"; : > "$O/exits.tsv"
fresh() { rm -rf "$P"; mkdir -p "$P"; git -C "$W" archive "$C" src tools data package.json package-lock.json vitest.config.ts tsconfig.json tsconfig.build.json biome.json AGENTS.md | tar -x -C "$P"; ln -s "$(readlink -f "$W/node_modules")" "$P/node_modules"; }
run() { t=$1; shift; st=$(date +%s); (cd "$P" && flock "$L" taskset -c 0 env "$@" > "$O/$t.log" 2>&1); rc=$?; echo -e "$t\texit=$rc\tsecs=$(( $(date +%s)-st ))\t$(sed 's/\x1b\[[0-9;]*m//g' "$O/$t.log" | grep -E '^ +Tests ' | tail -1 | sed 's/  */ /g')" >> "$O/exits.tsv"; }
V="NODE_OPTIONS=--max-old-space-size=400 npx vitest run"
pawns() { run "$1" $V src/evaluate.pawns.test.ts --reporter=default --reporter=json --outputFile.json="$O/$1.json"; }
d8() { run "$1" ENGINE_DEEP=1 $V src/uci-session.test.ts -t "A0-3" --reporter=verbose --reporter=json --outputFile.json="$O/$1.json"; }
fresh; pawns clean-pawns; d8 clean-d8
for p in flip-left-arm flip-left-arm-noflip stm-sign stm-memo memo-hit-drops memo-narrow memo-negative; do fresh; python3 -I "$R/plants.py" "$P" $p >> "$O/exits.tsv" || continue; pawns "$p"
  case $p in stm-*) run "$p-k0c" NODE_OPTIONS=--max-old-space-size=400 node "$R/drv291.ts" k0c "$P"; run "$p-engine" $V src/engine.test.ts;; esac; done
for p in leak-level-movetime leak-level-clock leak-movetime leak-simple-clock; do fresh; python3 -I "$R/plants.py" "$P" $p >> "$O/exits.tsv" || continue; d8 "$p"; done
rm -rf "$P"; echo "DONE copy deleted $(date -u +%FT%TZ)" >> "$O/exits.tsv"
