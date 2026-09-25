---
id: 20260924T093000Z-qe-e2e-decision-abc118-pass-a1-a2-a4-met-a3-a5-a6-met-as-read-nothing-runs-the-instrument-seven-gaps-named-2c8e5a17
kind: decision
by: qe-e2e
at: 2026-09-24T09:30:00Z
verified_by:
confidence: high
refs:
  - ABC-118
  - tools/grugops/lane-inventory.js
  - vitest.config.ts
  - ABC-109
  - ABC-114
  - ADR-0008
supersedes:
---

# `ABC-118` QE — PASS, with seven gaps named. The first gap is that nothing runs the instrument

**This is a hand-authored `decision` with no stamp.** `context.human_admission` is `off` and there
is no `context-io` writer on this install. No `finding` can be admitted, so none is claimed. Branch
`grugops/qe-ABC-118` is cut from `grugops/wave-2026-09-24` @ `162b2bd`. The build `1d0ce2a` and the
notes commit `75e7357` are already on `main`, so the fences below are measured against `129f53d`,
the build's own base. The probes, with raw output, are in the ledger note. The gates, the hash and
the sentence audit are in the gates note.

## Verdict: PASS

The build does what every criterion asks, read as written or as it was ruled. I reproduced each
red the Engineer recorded, count for count and message for message. I planted fourteen rounds of my
own. None of them found a behaviour defect against the ticket's defect class, which is a type-valid
`test.exclude` edit that changes what `npm test` collects. **`ABC-118` may leave `In Review`.** The
column move belongs to the Orchestrator.

## Criteria

| # | ruling | on what |
|---|---|---|
| `A1` | **MET** | `E-M1` reproduced: 42→41, RED, named `src/glyph-mode.nfr.test.ts`, lint/typecheck/build 0/0/0. My own `Q1` used the repo-relative `"src/perft.test.ts"`: 42→41, RED, named, 0/0/0 |
| `A2` | **MET** | `E-M2` reproduced: 42→84, RED naming 42 foreign paths, 0/0/0, back to 42 once the checkout was removed. At this hop, 27 live checkouts sit under `.claude/worktrees/`, including `residual-gqe115-3`. Every one of them carries `src/*.test.ts`. I counted them and did not open any. At the main checkout's own root the instrument reads 42/42 with the real glob in place |
| `A3` | **MET-AS-READ** | The "recorded expectation" is the git index and the "stated reason" is the commit. The Orchestrator's instruction set that reading, the Engineer said so openly, and I accept it. `E-M3` reproduced: 43/42 RED, then 43/43 GREEN after `git add`. "Makes the default lane RED" is read as the instrument going RED, because the lane itself stays green. `A4` allows that placement. **The cost of this reading is `Q3d`, gap G3** |
| `A4` | **MET** | The ruling (out of the lane), the rejected placements and the limit are all on the page. **`E-M4` on its own is not a discriminating demonstration.** A removed guard reads the same exit 0, 42/42, "No findings." that a live one does. **I added the red that tells them apart:** globs aimed at the guard (`"**/tools/**"`, `"**/lane-inventory*"`) planted together with the deletion glob. Result: **exit 1, 41/42, `src/glyph-mode.nfr.test.ts` named**. The guard survives globs aimed at it and still bites. The no-closure-claim-without-a-runnable-red clause is met by this probe |
| `A5` | **MET-AS-READ** | `git diff --numstat 129f53d 75e7357 -- src/ vitest.config.ts package.json AGENTS.md plans/nfr-catalog.md tsconfig.json biome.json` is **empty**. `main...75e7357` is also empty, but only trivially, because the build is an ancestor of `main`. **The hash as pinned is not met.** Rows 28–35 hash to `63f66795…` at `565c623` and to `b848732b…` at `129f53d`, at `75e7357` and at the tip. The rows moved before this hop, and they did not move across it. The pin is BA/PM's to refresh |
| `A6` | **MET-AS-READ** | Skip count 0. Test count 42 files / 1361 at this tip: 1325 at the build plus `ABC-046`'s +36, and `ABC-118` adds 0. Every input the lane reads is byte-identical between base and build (numstat above), so a paired-run delta can only measure noise. The Engineer's medians (−0.04 s wall, −0.32 s CPU) are inside the 0.30 s bound. His sign rule holds on CPU (4/5) and cannot hold on wall for a null change. I did not re-run the pairs, because the fence says do not rule NFR-008 |

## The Orchestrator's question: is the guard's "unreachability" a property or a gap?

**It is both, and the two halves need to be kept apart.**

- **Unreachable from `test.exclude`: this is the property the ticket asked for.** `A4` and
  `## The placement question` exist so that a glob cannot silently remove the guard. The combined
  probe above shows that it cannot.
- **Unreached by any runner: this is a gap, and today nothing runs it.** I searched every
  possible caller:
  - `workflows/05-pr-quality-gate.md` (the gate runner, kit) invokes `test-skip-integrity.js`
    and `uat-spec-integrity.js` by name, and has 0 hits for `lane-inventory`.
  - `AGENTS.md` has 0 hits. I ran `git grep -c` and read the count only; the file was never
    opened, per the fence.
  - `package.json` has no script for it.
  - `.github/`, `.claude/`, the main checkout's `.claude/settings.json` and the whole kit have 0 hits.
  - The ticket refused a CI job and a hook, and that refusal stands.

  The only places the command appears are the ticket, the notes, the trace row, the file's own
  header, and `memory-bank/60-progress.md` § Next action item 5, which says the Scribe line is owed.
  **So today it runs only when a person who has read those pages runs it by hand.** A control
  nobody runs cannot turn a silent inventory change into a red line. This is the ticket's
  `## Problem` sentence, and it will not be true on `main` until the command has a caller.

  The Engineer stated this limit and did not smooth it over. The ticket allows a partial mitigation
  only when it is stated ("an unstated one is not"). **So this is a stated, owed gap, not a failed
  criterion.** Even when the `AGENTS.md` `## Test integrity` line lands (`ABC-109` Scribe), it
  will be a line that hops read. Workflow 05 names only `test-skip-integrity.js`. **I recommend the
  Orchestrator not report `ABC-118`'s P1 control as live until that line is written.** The owner
  may also want to say whether the gate runner should call the instrument.

## Gaps (none of them fails a criterion; none was fixed by QE)

- **G1: nothing runs it.** See above.
- **G2: the unit gate's form diverges from the form the instrument watches (`Q1b`).**
  `exclude += "perft.test.ts"` has no directory part. It drops the file from
  `vitest list --dir src` (42→41), the form every hop's unit gate runs. The root form keeps 42.
  **Result: instrument GREEN, four gates green, and the unit gate is one file short.** The mirror
  case is `Q1`: `"src/perft.test.ts"` drops the file from the root form only, and the instrument
  goes RED. `ADR-0008` defines the default lane as `npm test`, which is the root form, so the
  instrument watches the right lane and `A1` is met. But the ticket's `## Test notes` call the lane
  `npx vitest run --dir src`, and the two forms resolve an `exclude` glob against different bases.
- **G3: once the index is the expectation, any commit moves it (`Q3d`).** A committed `git mv` of
  `src/fen.test.ts` to `src/fen.tests.ts`, a name the lane does not collect, shrinks both sets:
  41/41 GREEN, and 0/0/0 on lint/typecheck/build. The lane lost a file and no second reason was
  asked for. A recorded count, which the ticket's literal shape was, would have gone red.
- **G4: the tracked set and the collected set are not the same shape.** `git ls-files '*.test.ts'`
  sees only `.test.ts`. Vitest's include also collects `.spec.*`, `.mjs`, `.tsx` and more. A
  tracked `src/fen.spec.ts` (`Q3c`) and a tracked `tools/grugops/zz.test.mjs` (`Q2c`) both read RED
  with the message **"NOT tracked by git"**, and **that sentence is false**: both files are tracked.
  RED is the safe direction, but the diagnosis is wrong.
- **G5: every tracked `*.test.ts` counts as expected-in-lane (`Q2`).** A tracked illustrative
  `memory-bank/zz-illustrative.test.ts`, deliberately excluded by `"memory-bank/**"`, reads RED
  with "a `test.exclude` glob … is dropping it". That is false: the glob is doing its job. Drop
  that glob and the lane gains a file outside `src/`, and the instrument reads **GREEN** (43/43).
  The config comment says those directories "may carry illustrative code". Today none does: the
  only tracked `*.test.ts` files are the 42 under `src/`.
- **G6: a runtime diagnosis is false for a file moved on disk (`Q3b`).** A plain `mv` without git
  prints "a `test.exclude` glob in vitest.config.ts is dropping it" for `src/fen.test.ts`. No glob
  is involved; the file is gone from that path. The decision note calls the first half "true",
  and it is. The second half is not.
- **G7: sentence audit.** The details are in the gates note. The header has **no false
  sentence**; it has one imprecision, "a FIFTH step, like `test-skip-integrity.js`". Both are
  outside `mandatory_gates`, but the kit's gate runner calls `test-skip-integrity.js` by name and
  calls nothing for this one. § Delivery repeats the same imprecision. **One sentence is FALSE by
  the `ABC-114` standard, and it sits in the Engineer's `decision` note, not in the two places I
  was asked to audit:** "That is exactly `test-skip-integrity.js`'s position: the gate runner has to
  call it." The gate runner does call that one. Ground (2) of the placement ruling, "a new lane
  file's ~370 ms floor", is a standalone-process figure, while `vitest.config.ts` records an
  in-lane slope of 138.9 ms/file CPU. **`UNKNOWN - verify`.** I did not measure it, and the ruling
  stands on ground (1) alone.

## What QE did not do

No fix to the build and no line under `src/`. `vitest.config.ts` in this repository was never
edited; every mutant was planted in a `git init`ed copy under the session scratchpad and reverted,
and the final check read porcelain EMPTY with HEAD equal to base. `plans/board.md`, `AGENTS.md` and
`plans/nfr-catalog.md` were not opened (see the gates note for the two count/hash reads). NFR-008
was not ruled. Nothing was merged or deployed.
