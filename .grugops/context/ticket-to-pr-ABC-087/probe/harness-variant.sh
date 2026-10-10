#!/bin/bash
# ADR-0035 decision 2 narrow-set reading for ABC-087: set = src/levels.test.ts (added).
# Trees: base (one-assertion placeholder at the same path), head, twin (cmp-identical copy of head).
set -u
SP="$(cd "$(dirname "$0")" && pwd)"
WT=<worktree>
NM=/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/node_modules
rm -rf "$SP/trees"; mkdir -p "$SP/trees"
for t in head twin base; do
  mkdir -p "$SP/trees/$t"
  (cd "$WT" && git ls-files -z | grep -zv '^\.grugops/\|^plans/\|^memory-bank/' | xargs -0 -I{} rsync -R {} "$SP/trees/$t/") 
  cp "$WT/src/levels.ts" "$WT/src/levels.test.ts" "$SP/trees/$t/src/"; [ -n "${VARIANT:-}" ] && [ "$t" != base ] && cp "$VARIANT" "$SP/trees/$t/src/levels.test.ts"
  ln -s "$NM" "$SP/trees/$t/node_modules"
done
rm "$SP/trees/base/src/levels.ts"
cat > "$SP/trees/base/src/levels.test.ts" <<'P'
import { expect, it } from "vitest";

it("placeholder", () => {
  expect(1).toBe(1);
});
P
diff -r "$SP/trees/head/src" "$SP/trees/twin/src" && echo "twin identical to head (diff -r src)"
OUT="$SP/runs.tsv"; echo -e "round\tarm\tload1\tuser\tsys\tcpu\tpassed" > "$OUT"
ARMS=(base head twin)
for r in 0 1 2 3 4 5 6 7 8; do
  for i in 0 1 2; do
    arm=${ARMS[$(( (i + r) % 3 ))]}
    load1=$(sysctl -n vm.loadavg | awk '{print $2}')
    res=$( { cd "$SP/trees/$arm" && /usr/bin/time -p npx vitest run src/levels.test.ts 2>&1; } 2>&1 )
    user=$(echo "$res" | awk '/^user/{print $2}'); sys=$(echo "$res" | awk '/^sys/{print $2}')
    passed=$(echo "$res" | grep -oE "Tests +[0-9]+ passed" | grep -oE '[0-9]+')
    cpu=$(echo "$user + $sys" | bc)
    echo -e "$r\t$arm\t$load1\t$user\t$sys\t$cpu\t$passed" | tee -a "$OUT"
  done
done
