#!/bin/bash
# mutrun.sh <scratch>: for each mutant, apply on the scratch tip tree, run the remnant's default-lane file(s) and the deep -t line.
S="$1"; T="$S/tiptree"; cd "$T"
one() { local tag="$1"; shift; local out; out=$(env "$@" 2>&1); local rc=$?
  echo "  $tag rc=$rc $(echo "$out" | grep -E '^\s+Tests ' | sed 's/  */ /g')"
  echo "$out" | grep -E '^\s+(×|FAIL) ' | sed 's/^ */    killer: /' | sort -u | head -8; }
for m in restore M2 M8d M9 M9r; do
  python3 -I "$S/mutkit/mut.py" "$T" "$S/prodorig" "$m" >/dev/null || { echo "$m apply failed"; continue; }
  echo "== $m"
  case $m in
    restore|M2) one "default uci-session" NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts
                one "deep R2 -t" ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts -t "ABC-241 A4, A5 — UCI: the prior keys are repetition keys \[deep, ENGINE_DEEP=1\]" ;;&
    restore|M8d) one "default cli" NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.test.ts
                one "deep R8 -t" ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts -t "ABC-241 A4, A7 — the CLI: a third occurrence through an uncapturable ep square \[deep, ENGINE_DEEP=1\]" ;;&
    M8d) one "default uci-session" NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts ;;&
    restore|M9|M9r) one "default engine.capacity" NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/engine.capacity.test.ts
                one "deep R9 -t" ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/engine.capacity.test.ts -t "ABC-122 A8: src/engine\.ts's KEY_ARRAY_CAPACITY guard, reached through chooseMove\(\) \[deep, ENGINE_DEEP=1\]" ;;
  esac
done
python3 -I "$S/mutkit/mut.py" "$T" "$S/prodorig" restore >/dev/null && echo "restored"
