---
id: 20260803T201500Z-security-nfr-artifact-ref-7ed0dedc
kind: artifact-ref
by: security-nfr
at: 2026-08-03T20:15:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - NFR-005
  - EPIC-001
  - EPIC-004
  - EPIC-006
  - ADR-0005
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - plans/tickets/ABC-011-zobrist-en-passant-hashing.md
  - src/zobrist.nfr.test.ts
  - src/legal.ts
  - src/zobrist.ts
  - .grugops/queue/done/ticket-to-pr-ABC-011-sec2/
supersedes: 
---

# Artifacts this gate produced, changed, and deliberately left alone

Pointers only. The reasoning is in the `decision`, the measurements in the `observation`, and the
open bounds in the `claim` beside this note.

## Changed by this gate

| path | what changed |
|---|---|
| `plans/board.md` | ABC-011 moved `In Security/NFR` → `Ready for UAT`. In Security/NFR **1/2 → 0/2**, Ready for UAT **0/4 → 1/4**. Header `_Updated:` line rewritten as this gate's record; full EXIT comment written under `## In Security/NFR` (it did not exist — the interrupted run moved the row without writing one); RE-ENTERED comment written under `## Ready for UAT`. |
| `plans/tickets/ABC-011-zobrist-en-passant-hashing.md` | Front matter `status: in-security-nfr` → **`ready-for-uat`**, `column: In Security/NFR` → **`Ready for UAT`**. It had been left disagreeing with the board by the interrupted run. Nothing else in the ticket touched. |
| `plans/nfr-catalog.md` | `NFR-005`'s `Verified by` cell gains this gate's re-gate block; header `_Updated:` line rewritten. **No target moved.** Two withdrawals recorded. NFR-001/002/003 and every other row byte-untouched; table integrity re-checked (7 pipe-delimited segments on every row). |
| `plans/traceability.md` | ABC-011's row updated **in place** — NFRs, Tests and Status cells; header `_Updated:` line rewritten. **Code and UAT cells untouched.** No other row touched, no row appended. Table integrity re-checked (12 real cell segments; the one literal pipe in the quoted `jq` command is escaped `\|`). |
| `src/zobrist.nfr.test.ts` | **Comment-only.** Kept the interrupted run's corrected four-combination deletion table (re-derived here and correct); **withdrew its "+1.6 ns" sentence** as unsupportable and replaced it with the structural fact. Verified after editing that both revisions stripped of comments remain md5-identical to `HEAD`'s — zero assertion, import or fixture lines changed. |
| `.grugops/queue/claimed/ticket-to-pr-ABC-011-sec2/` → `.grugops/queue/done/ticket-to-pr-ABC-011-sec2/` | Transitioned **by hand** (no `scripts/claim.js` on this install). `claim.md` rewritten as this run's honest record — the interrupted run's `claim.md` was found in place, asserting a completed transition that had not happened, and is superseded rather than trusted. |

## Reverted by this gate, and why

`plans/board.md`, `plans/nfr-catalog.md` and `plans/traceability.md` arrived carrying **uncommitted**
prose from the interrupted run — a full PASS record with figures, published against no notes at all.
It was **reverted to `HEAD` rather than patched**, and the record above was written from this run's own
measurements. Editing another run's numbers into place would have produced a record that read as mine
and was not. A copy of that prose was kept in the session scratchpad for the duration of this run and
is **not committed**; it was never committed at any point, so nothing left the audit trail.

## Left alone, deliberately

- **`src/legal.ts` and `src/zobrist.ts` are byte-untouched.** No production line was changed at this
  gate. Verified.
- **No test was added.** The two mutants QE handed this column are deliberately unpinned; the reasons
  are in the `decision` note.
- **`ADR-0005` remains `proposed`**; `ADR-0006` untouched. No agent may mark an ADR `accepted`.
- **`memory-bank/`** untouched — the plan-of-record belongs to the Orchestrator's sweep.
- **`coverage/`** untouched and still nine tickets stale, as QE flagged. Refreshing a checked-in build
  artifact is an unrequested change.

## Not committed

Nine throwaway scripts and thirteen extracted or mutated trees under the session scratchpad —
`bench.mjs`, `predbench.mjs`, `walk.mjs`, `purity.mjs`, `equiv.mjs`, `callcount.mjs`, `deltable.mjs`,
`proxy.mjs`, `mutrun.sh`, plus `git archive` extracts of `4c6ed7d` and `584defa`, a byte-identical
twin of the shipped tree, a one-import spy tree, three call-counting trees and eight mutant trees.
**Not committed** — the same posture every measurement on this project has taken. Every number is
transcribed in the `observation` note with its machine, so nothing depends on the scripts surviving;
anyone re-running them should expect to rebuild them from that note rather than find them.

The repository's own `src/` was mutated transiently six times to prove assertions fail or survive.
Both affected files were backed up first, restored after, and **each restore was md5-verified**;
`git status` showed only the intended changes afterwards.

## Not produced, and not invented

**No PR.** This repo has no git remote, so none exists and none was fabricated. Work is committed to
the branch `grugops/ticket-to-pr-ABC-011` per `agent-factory/_commit-convention.md`. **Nothing was
merged and nothing was deployed — a human holds both.**

**No `finding` note, and no derived `index.md` / `index.jsonl`.** There is no §14 gate on this install
to issue a stamp and `context.human_admission` is `off`, so no `finding` is admissible; and the
renderer that produces the derived index files does not exist here, so none was hand-faked.
