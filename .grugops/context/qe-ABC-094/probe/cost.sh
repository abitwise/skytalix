#!/usr/bin/env bash
# QE ABC-094 — ADR-0035 decision 2 narrow-set cost reading. Set = src/book.test.ts (added file; no src/ file
# modified, so no `vitest related` files). Arms, all out of tree:
#   base = one-assertion placeholder at src/book.test.ts, no src/book.ts
#   head = the worktree as it stands (QE's final test file)
#   twin = a diff -r -x node_modules identical copy of head (the identity null)
#   se   = head with src/book.test.ts as delivered at 8cf395fc (the engineer's 26 tests), for comparison
# 9 rounds (round 0 discarded), arm order rotated per round, load1 logged before every run, counts asserted.
# Usage: cost.sh <worktree> <scratch dir outside the repo> <out.tsv>
set -u
WT="$1"; TR="$2/trees"; OUT="$3"
NM="$(cd "$WT/node_modules" && pwd -P)"
rm -rf "$TR"; mkdir -p "$TR"
for t in head twin base se; do
  rsync -a --exclude .git --exclude node_modules --exclude .grugops --exclude plans --exclude memory-bank --exclude .claude "$WT/" "$TR/$t/"
  ln -s "$NM" "$TR/$t/node_modules"
done
rm -f "$TR/base/src/book.ts"
cat > "$TR/base/src/book.test.ts" <<'P'
import { expect, it } from "vitest";

it("placeholder", () => {
  expect(1).toBe(1);
});
P
git -C "$WT" show 8cf395fc:src/book.test.ts > "$TR/se/src/book.test.ts"
diff -r -x node_modules "$TR/head" "$TR/twin" >/dev/null && echo "twin identical to head (diff -r -x node_modules)" >&2 || { echo "twin differs" >&2; exit 2; }
declare -A WANT=([base]=1 [head]=35 [twin]=35 [se]=26)
echo -e "round\tarm\tload1\tuser\tsys\tcpu\tpassed" > "$OUT"
ARMS=(base head twin se)
for r in 0 1 2 3 4 5 6 7 8; do
  for i in 0 1 2 3; do
    arm=${ARMS[$(( (i + r) % 4 ))]}
    load1=$(sysctl -n vm.loadavg | awk '{print $2}')
    res=$( { cd "$TR/$arm" && /usr/bin/time -p npx vitest run src/book.test.ts 2>&1; } 2>&1 )
    user=$(echo "$res" | awk '/^user/{print $2}'); sys=$(echo "$res" | awk '/^sys/{print $2}')
    passed=$(echo "$res" | grep -oE 'Tests +[0-9]+ passed' | grep -oE '[0-9]+')
    [ "$passed" = "${WANT[$arm]}" ] || { echo "count mismatch: $arm passed=$passed want=${WANT[$arm]}" >&2; exit 3; }
    echo -e "$r\t$arm\t$load1\t$user\t$sys\t$(echo "$user + $sys" | bc)\t$passed" >> "$OUT"
  done
done
