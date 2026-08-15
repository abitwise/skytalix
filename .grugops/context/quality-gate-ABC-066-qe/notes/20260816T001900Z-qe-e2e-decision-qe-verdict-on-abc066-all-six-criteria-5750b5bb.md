---
id: 20260816T001900Z-qe-e2e-decision-qe-verdict-on-abc066-all-six-criteria-5750b5bb
kind: decision
by: qe-e2e
at: 2026-08-16T00:19:00Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md
  - src/cli.ts
  - src/cli.test.ts
supersedes: 
---

# `ABC-066` — the QE verdict: **all six criteria MET, gate GREEN, `READY_FOR_HUMAN_REVIEW`**

The one-page answer. Every figure behind it is in this task's three `observation` notes and the
`A5`/`usageLineOf` `decision` note; nothing is restated here that is measured there.

## The criteria

| # | criterion | verdict | how I checked it MYSELF |
|---|---|---|---|
| `A1` | the separator reaches the user, 6 of 6 refusals | **MET** | the row asserts 6 refusal children **derived from the capture** (`status !== 0`), not listed; all six carry `npm run chess -- `; **0 new spawns**. Mutants M1, M9 and M12 all red this row. |
| `A2` | everything advertised resolves, ≥ 6 members incl. `[]` | **MET, and NOT vacuous** | 13 adversarial inputs through the **delivered expander bytes**; the degenerate `[[]]` return is caught by three independent rows. Mutants M2, M4, M5 red the resolver row; M3, M6 red the outside-group row; M8 reds the count floor. |
| `A3` | vocabulary 6 of 6 unchanged, no new argv token | **MET** | `ACCEPTED_ARGUMENTS` asserted equal **both ways** at run time; `src/cli-options.ts` unchanged in the delivered commit; `--` is not an accepted token. M8 (an option dropped) reds. |
| `A4` | `main`'s delivered string ⇒ suite RED | **MET — re-measured, not taken on faith** | **M1: `main`'s string byte-for-byte from `git show main:src/cli.ts`. RED, 1 failed / 29 passed.** I watched it red; the author is no longer the only witness. |
| `A5` | read, never transcribed | **MET** | separator spelled **once** in the whole file; **0** accepted-argument spellings in added **code**; `usage:` in **0** added lines; **M11 rewrote the entire sentence and stayed GREEN** — the behavioural proof. Full ruling in the `decision` note. |
| `A6` | 2 paths, 1 production line, 0 new files, `spawned` 10, green, skip 0 | **MET** | delivered-commit diff re-run: **2 paths**, `7 2` → **`1 1`** comments aside, **0** new files, **`spawned` 10** with **10** `CHILDREN` entries, **857/857 on 30 files**, skip **0**. |

## The gate

**`READY_FOR_HUMAN_REVIEW`.** lint **0** (54 files), typecheck **0**, unit **857/857 on 30 files**,
build **0**, skip count **0**, test-integrity **`No findings.` exit 0**. `self_fix_attempts` used:
**0 of 2**. Two honest `UNKNOWN - verify` rows (`scripts/check-uat-oracles.js` absent; the `AGENTS.md`
E2E slot), both non-blocking by Workflow 05's own words, neither in `quality.mandatory_gates`,
**neither recorded as a pass**.

**No green `§14-gate` verdict is emitted** — `scripts/context-io.ts` and its `emitVerdict` carve-out
do not exist on this install and `context.human_admission` is `off`. Workflow 05 step 5's emission
is **unperformable**, not skipped, and **no stamp is invented** (`Q5`). This ruling is a `decision`
note and carries no verdict stamp; **it is a QE result, not a human acceptance signature.**

## What I did NOT do, stated so it is not read as done

- **No production change.** Twelve mutants were built and **every one reverted**; `git status
  --porcelain src/` is empty and `git diff HEAD -- src/` is 0 lines. `src/cli.ts` is untouched by
  this hop. The defects I found (`Q1`, `Q2`) are **reported, not fixed** — each is a new hop.
- **No merge, no push, no deploy.**
- **`plans/board.md` and `plans/traceability.md` not written** — the Orchestrator's on this task, by
  instruction. **The `In Review` exit that `agent-factory/roles/qe-e2e.md` normally gives this role,
  and the trace row for `ab0864e` plus this QE result, are OWED AND UNWRITTEN** — named here so they
  are not silently lost, the same way the engineer named its own owed board move.
- **`AGENTS.md` not opened for write** — `ABC-065`'s half is live and unmerged on another branch.
- **`N8-LANE` not re-measured** — the engineer's paired instrument stands; I recorded a five-run
  absolute sanity bound against `NFR-008` only, and said so.
- **No criterion re-worded.** `Q3` would need `A2` re-worded to tighten; that is BA/PM's pen and the
  stop condition was respected.
- **No merged `ABC-042` row moved** — measured at **0 deleted lines** in `src/cli.test.ts`, so that
  stop condition never fired.

## Recommendation to the Orchestrator

**Move `ABC-066` on from `In Review`.** The fix is correct at the user's terminal (I reproduced the
ticket's own transcript and the repaired line now works), the guard is genuinely falsifiable on
**six** distinct assertions, and `A4`'s mutant has now been seen red by someone who did not write it.

**Two things to carry forward, both aimed at the next hop rather than at this one:**

1. **`Q2` is the one to hand to `ABC-065` explicitly.** `advertisedTextOf` fails silently without the
   separator, and today's `AGENTS.md` line has no separator — a guard that omits the
   `includes(SEPARATOR_FORM)` precondition and the count floor goes **vacuously green on the very
   defect `ABC-065` exists to catch**. The precondition and the fence-stripping are both spelled out
   with measured strings in the gaps note.
2. **`ABC-062` and `ABC-065` should be told the four helpers exist and where** (`src/cli.test.ts`,
   module scope, `:177` onward). The engineer's `G7` says neither page points at them; that is still
   true and it is BA/PM's pen.
