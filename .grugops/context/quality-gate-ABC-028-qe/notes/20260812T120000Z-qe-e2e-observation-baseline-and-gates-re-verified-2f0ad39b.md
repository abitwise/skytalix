---
id: 20260812T120000Z-qe-e2e-observation-baseline-and-gates-re-verified-2f0ad39b
kind: observation
by: qe-e2e
at: 2026-08-12T12:00:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
supersedes:
---

# The gate on the branch tip — every mandatory check re-run by me, and the baseline reproduces exactly

> **Hand-authored.** `scripts/context-io.ts` does **not exist** in this repository — there is no
> `scripts/` directory at all, re-checked at source this hop — and `mcp__grugops__propose_note` is
> not in this session's tools. `context.human_admission` is `off` and **no §14 gate verdict record
> exists under this task**, so **nothing on this hop is a `finding`.** `confidence: high` refers to
> the measurements, every one of which was RUN. `scripts/claim.js` does not exist either: the
> Workflow 17 step 2 claim was made by hand with a bare `mkdir`. There is no derived `index.md` /
> `index.jsonl` — the tool that renders them does not exist and none was hand-faked.

**Machine, once, for every figure on this hop:** Apple M3 (`Mac15,13`), 8 cores, macOS 26.5.2, node
`v24.12.0`, vitest `3.2.7`, typescript `5.9.3`, biome `2.5.5`. `UNKNOWN - verify` on any other.

## The gate, in Workflow 05's order

```
install    n/a — node_modules is a symlink to the main repo's, already present on arrival
lint       exit 0   (2 infos: biome config-migration hints, PRE-EXISTING, 46 files)
typecheck  exit 0
unit       750 passed (750) on 26 files
build      exit 0   (tsc --noEmit — honest naming, per AGENTS.md)
e2e        NOT RUN — see below
skip       0        (vitest --reporter=json: numPendingTests + numTodoTests = 0)
```

**The briefed baseline reproduces cell for cell** — lint 0, typecheck 0, 750/750 on 26 files,
skip 0 — so any red on this hop would have been attributable to me. **None was.**

## `e2e` — stated rather than invented

`quality.ui_e2e` is `ui-or-critical-path` and **this project has no runnable UI surface**: there is
no CLI entry point until `EPIC-006`, `AGENTS.md` records `E2E` and `Dev / run` as `UNKNOWN - verify`
for that reason, and `renderHistory` returns rows as a value and writes nothing. **I did not invent
an E2E lane.** The critical path this ticket guards is exercised by the unit suite, which is where
the pane's consumer contract lives.

## `test-integrity` — exit `2`, and it is NOT read as a pass

```
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
  -> "Error: cannot read the registry file: .grugops/test-skips.md"
  -> exit code 2
```

Per Workflow 05 step 3, exit `2` is **"the checker could not run" — an error distinct from a clean
fail, recorded as such, never read as a pass.** It is **not** exit `1`, so it is not the human-only
short-circuit that would force `BLOCKED_NEEDS_FIX`.

**Attribution, because it matters:** `.grugops/test-skips.md` has **never existed on this branch**
(`git log -- .grugops/test-skips.md` is empty). This is **pre-existing and not this ticket's**, and
the underlying quantity it guards is measured and clean — **the skip count is genuinely `0`**, so
there is no skip for a registry to justify. `quality.test_integrity` is `warn`. Recorded, not
inflated, and not silently zeroed.

## The zero-production-diff fence, tested rather than assumed

```
git diff -- src/                          EMPTY
src/history-pane.ts        md5   54fd4346dcc1a0060c4e66ae0149265d   unchanged
src/history-pane.nfr.test.ts md5 65f4f29ac930d7a7f432e14f2eef47f9   unchanged
src/history-pane.test.ts   md5   110ebc0b1650dcf2bffdd217885961c8   unchanged
git status --porcelain                    only this hop's own queue/context files
```

**I wrote nothing under `src/` at any point.** Every mutant on this hop was built in an out-of-tree
replica extracted from the object database (`git archive HEAD`) and `/usr/bin/diff -r`-verified
identical to this worktree's `src/` before use; the replica's own baseline is `750 passed (750)`.

## Lane cost — mine is zero, and that is a fact rather than a claim of prudence

**This hop adds no test, no file and no line to the repository**, so it has no `N8-LANE` delta to
measure and `ADR-0008`'s protocol was not run. **`N8-LANE`'s disputed TOTAL is `ABC-026`'s and I did
not touch it** — I neither re-derived it nor picked among the three readings the build hop published.
