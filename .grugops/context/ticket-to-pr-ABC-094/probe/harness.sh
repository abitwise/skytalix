#!/bin/bash
# ADR-0035 decision 2 narrow-set reading for ABC-094: set = src/book.test.ts (added; no src file modified,
# so no `vitest related` files). Trees: base (one-assertion placeholder at the same path, no src/book.ts),
# head, twin (diff -r-identical copy of head). Run by path: `npx vitest run src/book.test.ts`.
# Usage: harness.sh <worktree> <scratch dir for trees, outside the repo>. Writes runs.tsv beside this script.
set -u
SP="$(cd "$(dirname "$0")" && pwd)"
WT="$1"
TR="$2/trees"
NM=/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/node_modules
rm -rf "$TR"; mkdir -p "$TR"
for t in head twin base; do
  rsync -a --exclude .git --exclude node_modules --exclude .grugops --exclude plans \
    --exclude memory-bank --exclude .claude "$WT/" "$TR/$t/"
  ln -s "$NM" "$TR/$t/node_modules"
done
rm -f "$TR/base/src/book.ts"
cat > "$TR/base/src/book.test.ts" <<'P'
import { expect, it } from "vitest";

it("placeholder", () => {
  expect(1).toBe(1);
});
P
diff -r -x node_modules "$TR/head" "$TR/twin" && echo "twin identical to head (diff -r -x node_modules)"
OUT="$SP/runs.tsv"; echo -e "round\tarm\tload1\tuser\tsys\tcpu\tpassed" > "$OUT"
ARMS=(base head twin)
for r in 0 1 2 3 4 5 6 7 8; do
  for i in 0 1 2; do
    arm=${ARMS[$(( (i + r) % 3 ))]}
    load1=$(sysctl -n vm.loadavg | awk '{print $2}')
    res=$( { cd "$TR/$arm" && /usr/bin/time -p npx vitest run src/book.test.ts 2>&1; } 2>&1 )
    user=$(echo "$res" | awk '/^user/{print $2}'); sys=$(echo "$res" | awk '/^sys/{print $2}')
    passed=$(echo "$res" | grep -oE 'Tests +[0-9]+ passed' | grep -oE '[0-9]+')
    cpu=$(echo "$user + $sys" | bc)
    echo -e "$r\t$arm\t$load1\t$user\t$sys\t$cpu\t$passed" | tee -a "$OUT"
  done
done
