---
id: 20260813T120000Z-qe-e2e-observation-the-gate-as-it-ran-and-the-scope-i-derived-rather-than-inherited-3c81a5d7
kind: observation
by: qe-e2e
at: 2026-08-13T12:00:00Z
verified_by:
confidence: high
refs:
  - ABC-021
  - EPIC-002
  - N8-LANE
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - src/turn-loop.nfr.test.ts
  - plans/traceability.md
  - agent-factory/workflows/05-pr-quality-gate.md
supersedes:
---

# The gate as it ran, the scope I derived rather than inherited, and the two figures my brief got wrong

> **Hand-authored, and disclosed rather than hidden.** `scripts/context-io.ts` does **not** exist in
> this repository (no `scripts/` directory at all, re-checked this hop) and
> `mcp__grugops__propose_note` is not in this session's tools. `context.human_admission` is `off`
> and **no `§14-gate#<id>` verdict record exists under this task**, so **nothing on this hop is a
> `finding`** and no stamp was invented. There is no derived `index.md` / `index.jsonl`: the tool
> that renders them does not exist and none was hand-faked. `scripts/claim.js` is equally absent, so
> the Workflow 17 step-2 claim was made by hand — `mkdir -p .grugops/queue/claimed` for the parent,
> then a bare `mkdir` (no `-p`) of `.grugops/queue/claimed/quality-gate-ABC-021/`, which is the
> atomic act and the one that would have raced.

**Machine, once, for every figure I publish:** Apple M3 arm64, macOS 26.5.2, node `v24.12.0`,
vitest `3.2.7`, typescript `5.9.3`, biome `2.5.5`. `UNKNOWN - verify` on any other.

## The tree I gated, pinned before anything was measured

Branch `grugops/quality-gate-ABC-021`, worktree `../cli-chess-qe021`, **HEAD
`4601f14081f87409812910a06afa02b0b2d46277`** — branched from the ticket branch, not from `main`.

```
file                        md5 AT THE START OF THIS HOP
src/turn-loop.ts            347755edcbfcc8dfe7c1dae150ddc8b5   <- UNMOVED at the end (I wrote no production line)
src/turn-loop.test.ts       d87c30d730df0831ad6f176696047bbf   -> ff57bf8394122c043c6cc1cc1be83145 (my two rows)
src/turn-loop.nfr.test.ts   d48a0eb3a53a14e55972418614b8bdf2   <- UNMOVED, forbidden to me and untouched
src/gameend.ts              7121f414d3b2af82ad0036d711ceae2f   <- UNMOVED
src/history.ts              12f8c562d46286e68383f8e2cab407fa   <- UNMOVED
src/frame.ts                bf3e5a8413d0f2740775608b5925a1a8   <- UNMOVED
```

Every mutant generator on this hop pins the two files it edits by md5, **throws** rather than
measuring the wrong tree, and restores from a pristine copy in a `finally`.

## The scope, derived by the method rather than copied from the number

My brief said to check the method. I did, and the method is `git merge-base`:

```
git merge-base main HEAD                    -> 06c54277cf053e4f96a74c4493a4b5dfce36565e
git diff --numstat 06c5427..HEAD            -> 12 files; THREE outside .grugops/
    206   0  src/turn-loop.test.ts
     89  10  src/turn-loop.ts
      3   1  plans/traceability.md
```

**THREE files, `+298 / −11`. Confirmed.** `src/gameend.ts` untouched, the four `*.nfr.test.ts`
files `ABC-030` owns untouched, `src/turn-loop.nfr.test.ts` untouched, **zero new test FILES**.

**Two figures in my brief are wrong and I check rather than relay:**

1. **`src/turn-loop.ts` is `+89`, not `+99`.** The brief's own total (`+298`) is only reachable with
   `+89` (`206 + 89 + 3 = 298`; `+99` gives 308), so the brief is internally inconsistent and the
   total is the half that is right. `+89` is also what the Engineer's own correction note
   (`…-observation-b70c4d15` § 2) settled on.
2. **`main` is no longer at `87e771a`.** It is at **`be0f92ba`**, two commits further on
   (`02fe652` moved `ABC-021` to `In Review`; `be0f92b` cut `ABC-039`/`ABC-040`). Its change since
   the merge base is therefore **not** board-only: `be0f92b` appends two rows to
   `plans/traceability.md`, which this branch also edits. **I checked the exposure rather than
   assuming it:** `git merge-tree --write-tree main HEAD` exits **0** with a clean tree —
   **no conflict, in `src/` or anywhere else.** The Engineer's "rebase exposure: none in `src/`" now
   holds for `plans/` too, but it holds by measurement at `be0f92b`, not by his measurement at
   `87e771a`.

## The gate, in Workflow 05's order, every command from the `AGENTS.md` slots

```
npm run lint       LINT_EXIT=0        Checked 49 files. Found 2 infos.   (pre-existing biome.json migration infos)
npm run typecheck  TYPECHECK_EXIT=0   tsc --noEmit, no output
npm run build      BUILD_EXIT=0       tsc --noEmit, no output            (a typecheck wearing the build slot's name — AGENTS.md says so)
npm test           TEST_EXIT=0        Test Files 28 passed (28) | Tests 816 passed (816)
skip count         0                  npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'
```

- **`self_fix_attempts` NOT consumed: 0 of 2.** Lint was green on the FIRST run, with my two rows
  already in the file. The Engineer's one autofix pass is his record, not mine, and I did not
  re-spend his budget.
- **814 → 816** is my `+2` (both in the existing `src/turn-loop.test.ts`); **28 test files, before
  and after.** The Engineer's `807 → 814` on 28 files reproduces exactly at his tip.
- **Coverage of `src/turn-loop.ts`: 100 % statements / 100 % branch / 100 % functions / 100 % lines**
  (`--coverage.include='src/turn-loop.ts'` over `turn-loop.test.ts` + `turn-loop.nfr.test.ts`),
  against `quality.coverage_threshold` `0.8`. `mode` is `lean`, so the threshold is not enforced
  here; the number is reported because it was run. `ABC-019`'s gate left `:240-241` uncovered — the
  prompt-driven `game-over` return — and this ticket's rows close it.

## `test-integrity`: exit **2**, recorded as COULD NOT RUN and never as a pass

```
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
Error: cannot read the registry file: .grugops/test-skips.md
TEST_INTEGRITY_EXIT=2
```

**Exit `2` is "the checker could not run", which Workflow 05 § step 3 makes an error distinct from a
clean fail and forbids reading as a pass.** The skip count itself is a real **0**, captured with the
`AGENTS.md` command, so it is not the `UNKNOWN - verify` case either — the registry is simply
absent. **It is `H2`, owned by a named human, and I did NOT create `.grugops/test-skips.md`:** the
agent may not self-author a justification to clear its own gate, and there is nothing to justify at
zero skips. Exit `2` is **not** the human-only exit `1` short-circuit, so it does not by itself force
`BLOCKED_NEEDS_FIX`.

**`scripts/check-uat-oracles.js` does not exist in this repo** (it ships with grugops's own tooling,
not every host), so the Tier-1 auto-UAT step records `UNKNOWN - verify` and is non-blocking, exactly
as Workflow 05 provides. `quality.ui_e2e` is `ui-or-critical-path` and the `AGENTS.md` E2E slot reads
`UNKNOWN - verify` — there is no UI surface and no runnable game until `EPIC-006`, so no Playwright
or axe lane ran, and none was faked.

## `PERFT_DEEP` — the ruling, and then I ran it anyway

**The ruling: NOT REQUIRED.** `git diff --numstat 06c5427..HEAD -- src/moves.ts src/legal.ts
src/apply.ts src/position.ts` is **empty**, and so is the same diff for my own working tree against
`HEAD`. Neither the branch nor my hop reaches the rules core.

**Run regardless, because this is the ticket that closes `EPIC-002` and 37 s is cheaper than an
argument:** `PERFT_DEEP=1 npx vitest run src/perft.test.ts` → **32 passed / 32, exit 0, 37.47 s.**
Exact counts, no drift.

## One landmine I stepped on, named rather than quietly cleaned up

**`coverage/` is TRACKED in this repository (22 files), and vitest's coverage provider wipes the
directory before it writes** (`clean` defaults to `true`). Running the coverage command above
therefore shows **22 tracked files as deleted** in `git status`. I restored them with
`git checkout -- coverage/` and re-verified `git diff -- coverage/` is **empty** — byte-identical,
nothing of anyone's was lost.

**Named because the next role will hit it too**: a hop that runs coverage and then commits with
`git add -A` silently deletes 22 tracked files, and the deletion looks like an intentional cleanup in
the diff. Not my ticket, not a defect in `ABC-021`, and I have not created one for it — but nobody
should have to rediscover it.

## Lane cost of my two rows — measured with a NULL CONTROL, and I refuse a tighter number

`ABC-026` is measuring this lane concurrently and `N8-LANE` binds the FILE count. **I added ZERO new
test files** — both rows sit in `src/turn-loop.test.ts`, which already mocks `history.ts` — so the
`160 ms`-per-file term is `+0` by construction and `ABC-026`'s file-count measurement does not need
re-taking on my account.

Seven interleaved A/B/A rounds, `user + sys` per full `npx vitest run`, one discarded warm-up:

```
A (delivered, 814)  median 10.72 s CPU
B (this hop,  816)  median 10.92 s CPU
C (null control — the DELIVERED file measured again)  median 10.79 s CPU
```

**B − A = +0.20 s; the null control's own C − A = +0.07 s, and the raw spread inside each arm is
±0.5 s.** So the honest statement is: **the two rows cost ≤ ~200 ms CPU and are not distinguishable
from a null control on this instrument**, against `ABC-021`'s inherited `≤ 650 ms` and `NFR-008`'s
13 s clause, with the whole lane measured at **10.7–10.9 s CPU**. I will not publish a point estimate
an instrument with a 70 ms null cannot support.
