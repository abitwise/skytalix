---
id: 20260813T080500Z-qe-e2e-observation-the-gate-on-the-merged-tip-every-number-re-measured-and-one-step-that-cannot-run-5c0d19a7
kind: observation
by: qe-e2e
at: 2026-08-13T08:05:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - .grugops/factory.config.json
  - AGENTS.md
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - tools/grugops/test-skip-integrity.js
supersedes:
---

# The gate on the MERGED tip — every number re-measured at `0ee148e`, none inherited from my `755` run, and ONE workflow-05 step that cannot run at all

> **Hand-authored `observation`, deliberately NOT a `finding`.** `scripts/context-io.ts` does not
> exist in this repository — there is no `scripts/` directory at all, checked at source this hop —
> so Workflow 05 step 5's `emitVerdict` carve-out cannot run and **no `§14-gate#<id>` can exist
> under this task**. `context.human_admission` is `off` and no named human granted a `human:<name>`
> stamp. **Nothing on this hop is a `finding` and no stamp was invented.** `confidence: high`
> refers to the measurements, every one of which was RUN; it is not an admission status.

**Tip: `0ee148e`, and `main` is the same commit** — `git log --oneline -1 main` → `0ee148e`. The
ticket is merged; this verdict is the record of what shipped, not a pre-merge recommendation.

## The four blocking gates, plus the two the workflow adds

```
lint       npm run lint        exit 0    Checked 49 files in 84ms. Found 2 infos.
                                         both PRE-EXISTING biome.json: $schema 2.3.0 against a
                                         2.5.5 CLI, and linter.rules.recommended deprecated
typecheck  npm run typecheck   exit 0    tsc --noEmit
build      npm run build       exit 0    tsc --noEmit — a typecheck wearing the build slot's name,
                                         per AGENTS.md's own honest naming
unit                                     total 807  passed 807  failed 0  pending 0  todo 0
                                         files 28   suites 140  success true
skip       0                             npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'
e2e        UNKNOWN - verify              AGENTS.md's E2E slot is UNKNOWN; no UI surface, no runnable
                                         game until EPIC-006. Recorded, never faked green
```

**`mandatory_gates` is `["lint","typecheck","unit","build"]` and all four are GREEN on the merged
tip.** `quality.self_fix_attempts` was never entered: nothing went red.

**The briefed `807 / 807` on 28 files is EXACT on this tip.** I am recording that it held because
the last brief on this stack was stale by 52 tests, and a hop that reports numbers only when they
move gives no evidence it re-measured the others.

## The workflow-05 step that CANNOT RUN, and which three gates on this ticket recorded as a pass

Workflow 05 step 3 names the test-integrity checker by exact command. It is present in this repo.
**Its registry is not.**

```
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
  Error: cannot read the registry file: .grugops/test-skips.md
  EXIT 2
```

Read at source (`tools/grugops/test-skip-integrity.js:65-80`): the read is deliberately
fail-closed, and `2` is documented there as *"error (could not run — distinguishable from a clean
fail)"*. **Workflow 05 step 3 says an exit `2` is *"recorded as such, never read as a pass."***

**It has been read as a pass three times on this ticket** — my `final` gate, my `narrow` gate and
the Engineer's own done-condition line 4 each recorded *"skip 0"* as the test-integrity result.
*"skip 0"* is the RUNNER's count and it is correct; it is not the CHECKER's verdict, and the
checker has no verdict here. **This is gap `H2`, and I am the role that recorded it wrong twice.**

**What it does NOT mean, stated so the gap is not inflated:** the substantive property is
vacuously satisfied — the runner reports `0` skipped tests, and the checker's only count assertion
is `skipCount > validJustifications`, which `0 > 0` does not trip. **There is no hollowed-out
suite hiding here.** `quality.test_integrity` is `"warn"`, the step is not in `mandatory_gates`,
and this does not block. What is missing is the MECHANICAL signal, not the property.

## The tip, measured rather than described

```
src/*.ts           45      of which src/*.test.ts   28   -> 17 production modules
src/history-pane.ts             c4653c4c263c4c417ea34969164ccd86
src/history-pane.test.ts        1b23df27a9a67ef0ed359dd33456ee1b
src/history-pane.nfr.test.ts    16bf2f50c93e2e896b5406cbfa772b8b

per-file test counts, from the runner's own JSON rather than from a grep:
  src/history-pane.test.ts       26     <- src/history-pane.nfr.test.ts:116's "26/26" still HOLDS
  src/history-pane.nfr.test.ts   11
  src/zobrist.test.ts            23
  src/status-panel.test.ts       29
```

**All three pane digests match the Engineer's post-edit values exactly**, so the tree I gated is
the tree they landed, and `src/history-pane.ts` is unmoved from before this ticket began.

**The `it(`-counting grep is NOT the instrument for a test count and I did not use it as one.** A
raw `/usr/bin/grep -cE '^\s*(it|it\.each)\('` returns `15` for `src/zobrist.test.ts` where the
runner reports `23`, because `it.each` expands. Naming that here because two of this ticket's open
record defects are exactly *"a comment states a test count"*, and the obvious instrument for
checking them is wrong by 8.

## Machine

8 cores, node `v24.12.0`, vitest `3.2.7`, biome `2.5.5`. **NO TIMING MEASUREMENT WAS TAKEN, and
the reason is specific rather than conventional: a Security/NFR hop is running CONCURRENTLY in this
same working tree.** Any lane number I took would be measuring that hop as much as this one.
`ABC-026`'s lane total stays `UNKNOWN - verify` and stays owed — see gap `H5`.
