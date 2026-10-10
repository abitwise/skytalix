#!/usr/bin/env bash
# QE ABC-139 — behavioural check of the A3 comment's numbers, by TRANSIENT mutants of src/turn-loop.ts.
# usage: bash qe139-cadence-mutants.sh <worktree>   (restores src/turn-loop.ts from HEAD after each mutant)
# M0 none: A3 row green, renders 4.
# M1 eof-emits-a-frame: the build the docblock's "count-every-outcome form" would accept -> expect 5 (red, "expected 5 to be 4").
# M2 board-redraws-for-itself: one extra render-seam call per message-less `command` -> expect 4 + 3 = 7.
set -u
cd "$1" || exit 2
F=src/turn-loop.ts
ROW="renders exactly once per prompt cycle, plus the loop's own first frame"
git diff --quiet -- "$F" || { echo "refusing: $F is dirty"; exit 2; }
run() {
  echo "== $1"
  npx vitest run src/command-input.test.ts -t "$ROW" 2>&1 | grep -E "AssertionError|expected .* to be|Tests +[0-9]" | sed 's/^ *//'
  git checkout -q -- "$F"
  git diff --quiet -- "$F" && echo "   restored: $F clean"
}
run "M0 none"
perl -0pi -e 's/(if \(outcome\.kind === "eof"\) \{\n)/$1        render(history, status, false, []);\n/' "$F"
grep -c 'render(history, status, false, \[\]);' "$F" | sed 's/^/   M1 applied lines: /'
run "M1 eof-emits-a-frame"
perl -0pi -e 's/(          messages = outcome\.messages;\n          continue;\n)/          if (outcome.kind === "command" \&\& outcome.messages.length === 0) render(history, status, false, []);\n$1/' "$F"
grep -c 'outcome.messages.length === 0) render' "$F" | sed 's/^/   M2 applied lines: /'
run "M2 board-redraws-for-itself"
