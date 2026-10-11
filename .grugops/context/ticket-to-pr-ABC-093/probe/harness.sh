#!/bin/bash
# ADR-0035 decision 2 narrow-set reading for ABC-093: set = tools/opening-book/book.test.ts (added).
# Trees: base (one-assertion placeholder at the same path, no compiler, no data), head, twin
# (diff -r-identical copy of head). Run by path: `npx vitest run tools/opening-book/book.test.ts`
# (NOT `--dir src`, which does not collect tools/).
set -u
SP="$(cd "$(dirname "$0")" && pwd)"
WT="$1"
NM=/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/node_modules
rm -rf "$SP/trees"; mkdir -p "$SP/trees"
for t in head twin base; do
  rsync -a --exclude .git --exclude node_modules --exclude .grugops --exclude plans \
    --exclude memory-bank --exclude .claude "$WT/" "$SP/trees/$t/"
  ln -s "$NM" "$SP/trees/$t/node_modules"
done
rm -rf "$SP/trees/base/tools/opening-book/compile.ts" "$SP/trees/base/data"
cat > "$SP/trees/base/tools/opening-book/book.test.ts" <<'P'
import { expect, it } from "vitest";

it("placeholder", () => {
  expect(1).toBe(1);
});
P
diff -r -x node_modules "$SP/trees/head" "$SP/trees/twin" && echo "twin identical to head (diff -r -x node_modules)"
OUT="$SP/runs.tsv"; echo -e "round\tarm\tload1\tuser\tsys\tcpu\tpassed" > "$OUT"
ARMS=(base head twin)
for r in 0 1 2 3 4 5 6 7 8; do
  for i in 0 1 2; do
    arm=${ARMS[$(( (i + r) % 3 ))]}
    load1=$(sysctl -n vm.loadavg | awk '{print $2}')
    res=$( { cd "$SP/trees/$arm" && /usr/bin/time -p npx vitest run tools/opening-book/book.test.ts 2>&1; } 2>&1 )
    user=$(echo "$res" | awk '/^user/{print $2}'); sys=$(echo "$res" | awk '/^sys/{print $2}')
    passed=$(echo "$res" | grep -oE 'Tests +[0-9]+ passed' | grep -oE '[0-9]+')
    cpu=$(echo "$user + $sys" | bc)
    echo -e "$r\t$arm\t$load1\t$user\t$sys\t$cpu\t$passed" | tee -a "$OUT"
  done
done
