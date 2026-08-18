---
id: 20260819T000500Z-qe-e2e-observation-the-blocking-gate-re-run-at-qe-and-the-search-deep-lane-that-was-owed-here-c31a7f05
kind: observation
by: qe-e2e
at: 2026-08-19T00:05:00Z
verified_by:
confidence: high
refs:
  - ABC-035
  - ABC-050
  - NFR-008
  - N8-LANE
  - src/command-input.ts
  - src/command-input.test.ts
  - 20260818T234500Z-software-engineer-observation-the-gate-on-the-branch-tip-and-the-lane-it-ran-in-8f30ca27
supersedes:
---

# The blocking gate, re-run at the QE hop — every figure reproduced, plus the `SEARCH_DEEP` lane the engineer correctly deferred to here

## The lane, checked before anything was believed of it

Branch `grugops/quality-gate-ABC-035-qe-2026-08-18`, cut from
`grugops/abc035-in-game-commands` @ `e01033f` — **the delivery branch, not `main`**, as the subtask
required. `main` is at `387c9b2` and was not touched.

Containment checked first, exactly as the engineer's note describes and by the same means:
`ls -a .claude/` in this worktree returns `settings.json` and `skills/` and **no `worktrees/`
directory**. The repository's known `vitest.config.ts` defect (no `exclude`, so a root-level run
sweeps sibling checkouts — `ABC-050`, already routed and NOT chased here) therefore has nothing to
sweep from inside an isolated agent worktree.

**So `npm test` and `npm run lint` — the commands `AGENTS.md` actually records — were run AS
RECORDED, not replaced with hand-tuned `--exclude` variants.** The confirming signature is the lint
file count: `biome check .` reports **66 files**, which is this repository alone; the contamination
signature is a count in the hundreds. This is the third recorded instance of that shape
(`quality-gate-ABC-033-qe-2026-08-18`, the `ABC-035` delivery hop, and this one) and no new lane
technique was invented for it.

## Every step, as it ran at this hop

| step | command | result | engineer's figure | agrees |
|---|---|---|---|---|
| test | `npm test` (`vitest run`) | **37 files / 1128 tests, 0 failed**, 2.70 s | 37 / 1128 / 0 | **yes** |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** | 0 | **yes** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`**, exit **0** | same | **yes** |
| lint | `npm run lint` (`biome check .`) | **Checked 66 files, no fixes applied**, exit **0** | 66, exit 0 | **yes** |
| typecheck | `npm run typecheck` (`tsc --noEmit`) | exit **0**, no output | exit 0 | **yes** |
| build | `npm run build` (`tsc --noEmit`) | exit **0**, no output | exit 0 | **yes** |
| deep perft | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **32/32 passed**, 38.01 s, exit 0 | 32/32 | **yes** |
| **deep search** | **`SEARCH_DEEP=1 npx vitest run src/search.test.ts`** | **41/41 passed**, 24.29 s, exit **0** | **NOT RUN — deferred to here** | **discharged** |

**All eight green. Not one engineer figure moved under an independent run.**

## `SEARCH_DEEP` — the deferral was correct, and the debt is now paid

The engineer did not run this lane and checked the reason against the rule rather than assuming it:
`AGENTS.md` § Test names two triggers, *"at the **QE hop**"* and *"after any change to
`src/search.ts`"*. The second does not fire (`git diff main..HEAD -- src/` touches only the two
`command-input` files); the first fires **here**. That reading is correct and this hop honours it
rather than inheriting `ABC-033` `G7`'s omission.

**Run, and green: 41 passed of 41, exit 0, 24.29 s** — 28 in the default lane plus the 13 expensive
repetitions the deep lane defines. The deep cases are NOT DEFINED rather than skipped when the
variable is unset, so the gate's skip count stays **0** either way, which is what the table above
records.

## `A8`, measured from git at this hop rather than quoted

```
git diff --numstat main..grugops/abc035-in-game-commands -- src/
539     0       src/command-input.test.ts
142     0       src/command-input.ts
```

**Nothing else under `src/`.** `src/move-input.ts` is byte-untouched, as claimed. The full delivered
diff is those two `src/` files plus six engineer notes, three queue files, `plans/board.md`,
`plans/traceability.md` and the ticket page — no other production line anywhere. `A8` **MET**,
measured, not asserted.

## `N8-LANE` — NOT ruled here, and that is deliberate

The subtask asks whether `N8-LANE` needs measuring to its paired-delta method. **I do not rule it.**
`ABC-078` is in Security/NFR right now and that role owns the NFR bars; the fence on this subtask is
explicit. What I record is the fact and nothing above it:

- The paired-delta protocol (CPU instrument, median of paired per-round deltas, n ≥ 7 interleaved,
  identity null control ≤ 1.5%, net of 160 ms per test file added) **was not run, by the engineer or
  by me.**
- The runner's own per-file figure, re-measured at this hop: **`src/command-input.test.ts` — 79
  tests, 14 ms** (the engineer recorded 56 ms; runner-reported per-file timings vary run to run and
  neither number is an `N8-LANE` measurement).
- One test file added against the ticket's `## Lane cost` allotment of one.

**That is a consistency check, not an `N8-LANE` measurement, and it must not be quoted as one.**
The engineer said exactly this and was right to. Routing the question to the NFR owner is the
recommendation; ruling it is not mine.

## Mutation hygiene at this hop

All seventeen of my mutants (sibling note) were applied to `src/command-input.ts` and reverted from
an out-of-repo pristine copy, with `git status --porcelain -- src/command-input.ts` asserted empty
after **every single one** — the harness exits non-zero rather than continuing if it is not. Two
scratch probe files (`src/zz-qe-scratch.test.ts`, `src/zz-qe-probe.test.ts`) were created, run and
deleted; `git status --porcelain` is empty and neither appears in any commit. The harness itself
(`mutants.py`) is scratch, lives outside the repository and is **not committed** — the same posture
the engineer took.
