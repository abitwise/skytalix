---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T17:29:48Z
subtask: bapm-qe-gaps-1101
role: ba-pm
ref: .grugops/context/bapm-qe-gaps-1101/
branch: new grugops/bapm-qe-gaps-1101 from main (worktree .claude/worktrees/bapm-qe-gaps-1101)
width: records only, beside QE hops (tests under the lock).
---
# BA/PM: route today's QE gaps
## Gaps (read each QE note on main; qe-ABC-254 notes are on branch grugops/qe-ABC-254 — read with git show)
- QE-249-a LOW (qe-ABC-249 …66371344): ABC-249's row discriminates only at depth 4–5; add a test note to ABC-233/236/237/238 ("on re-pin, keep move-with-keys ≠ move-withheld, or add that relational assert").
- QE-249-b INFO: no default-lane row for a pre-root draw scored exactly 0 at ply ≥ 4.
- QE-259-a MEDIUM (qe-ABC-259 …1aca1753): env rule misses `import { env } from "node:process"`; proposed widen to \bprocess\b (0 hits today).
- QE-259-b LOW: comment strip ignores string literals (shared with ABC-087 A8).
- QE-259-c LOW: budget aliases survive; carry as a review note on ABC-251.
- QE-254-b LOW (grugops/qe-ABC-254 …dede949b): hasLegalMove rebuilt on lazy legalMoves (losing early exit) is caught by nothing.
- QE-254-c LOW: no default-lane row for quiet queen promotions while in check.
## Do
Cut the smallest set of test-only tickets (bundle where natural, e.g. one "lane hardening" ticket for 259-a/b + 254-b/c + 249-b) into EPIC-010 milestone 1b or EPIC-011 M0 (argue), DoR honest; add the notes to the named tickets. No cuts for INFO-only items unless bundled cheaply.
## Fences
plans/tickets/ (named + new), plans/epics/EPIC-010*/EPIC-011* (rows only), plans/traceability.md (append), your notes. Not board, memory-bank/, src/, tools/, data/. Run nothing. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task bapm-qe-gaps-1101, contextRoot = worktree's .grugops/context, never the plugin cache; cite only existing commits), commit, ## Result + trace row, brief + claim to done/.

## Result
- **Placement: `EPIC-010` milestone 1b, not `EPIC-011` M0.** M0 is a `tools/` instrument (`ABC-255`). These are
  default-lane rows guarding files 1b rewrites next (`ABC-250` packs the lazy filter; `ABC-251` rewrites the scanned
  search), on `ABC-259`'s precedent. Neither adds a read to the close.
- **Two tickets, not one bundle (pushback).** A bundle would touch three or four test files across three modules, and
  would make QE-259-a (MEDIUM, independent) wait on `ABC-254` (UNRESOLVED on A4; dropped if A4 misses).
  - **`ABC-260`** (QE-259-a + QE-259-b): XS, **P2**, `EPIC-010` row 31, Backlog, **DoR 10/10, Ready recommended**.
    `process` matched as a whole word. Strings cannot hide code from the `ABC-259` block or `ABC-087` A8 (guard row or
    string blanking, the SE's pick). Plants Q5/Q6/Q7 plus an A8 string plant red; comment controls green; ≤ 20 ms;
    `src/levels.test.ts` only. No ADR change and no Architect ruling owed (stated, with a stop if the SE finds one).
    Recommended before `ABC-251`.
  - **`ABC-261`** (QE-254-b + QE-254-c): XS, **P3**, `EPIC-010` row 32, Backlog, **DoR 10/10 conditional on
    `ABC-254`'s merge**. An early-exit row (spied `isSquareAttackedBy`; PL3a red, gap ≥ 2 calls) and an in-check
    quiet-promotion row (lazy vs full on an illegal and a blocking board; PQ2 red); ≤ 30 ms. Dropped if `ABC-254` is
    dropped or declined. Recommended after `ABC-254`, before `ABC-250`. Plant spellings are QE's `plant.py`.
- **Notes carried:** QE-249-a as a dated test note on `ABC-233`, `ABC-236`, `ABC-237`, `ABC-238` (keep with-keys ≠
  withheld on re-pin, or add the relational assert; equal figures mean re-run QPLY4 and rebuild). QE-259-c as a dated
  review note on `ABC-251`.
- **QE-249-b (INFO): not cut.** The fixture cost is unknown and the mutant is reasoning only (`UNKNOWN - verify`), so
  it is not cheap. One conditional line rides the QE-249-a note. Re-open trigger: a QE ply ≥ 4 draw plant that
  survives the lane.
- **Not this hop's:** QE-254-a (`qe-ABC-254-a4`) and its D3 spread-rule question (not in this brief).
- **Commits:** claim `dda56d80`; records `62399736`; notes, this Result and the move to done/ in the closing commit.
- **Notes (sealed, contextRoot = this worktree):** decision `20261101T173719Z-ba-pm-decision-2bbbf72f`, observation
  `20261101T173719Z-ba-pm-observation-56b47697`.
- **Trace rows (appended to `plans/traceability.md`):** ABC-260 ← QE-259-a/b ← `ABC-259` ← `ADR-0056` R-TC (G-1) ←
  EPIC-010; ABC-261 ← QE-254-b/c ← `ABC-254` ← `ADR-0003` ← EPIC-010; bapm-qe-gaps-1101 → both. Refs on both notes.
- No board, `memory-bank/`, `src/`, `tools/`, `data/` or `EPIC-011` edit. Nothing run, built, timed, pushed or merged.
