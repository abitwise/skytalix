---
id: 20260730T130119Z-orchestrator-observation-b52c8f10
kind: observation
by: orchestrator
at: 2026-07-30T13:01:19Z
verified_by: 
confidence: high
refs:
  - architecture-audit-2026-07-29
  - ABC-011
  - ABC-009
  - ABC-010
  - ADR-0002
  - ADR-0003
  - NFR-005
  - RISK-002
  - EPIC-001
  - EPIC-004
  - plans/tickets/ABC-011-zobrist-en-passant-hashing.md
  - plans/epics/EPIC-004-engine-and-ai-opponent.md
  - plans/board.md
  - plans/traceability.md
  - 20260730T121731Z-orchestrator-observation-6d1e04b7
  - 20260730T125614Z-ba-pm-artifact-ref-83fbaf48
supersedes: 
---

# Routing + close record — the two ADR leftovers are dispositioned; task `architecture-audit-2026-07-29` is closed

Scheduling record for subtask `ba-pm-adr-leftovers`. Both items were flagged twice by prior runs and
left twice because they are BA/PM's files; a human asked for both on 2026-07-30. Routed as **one**
subtask, not two, because both touch `plans/traceability.md` and a single writer is the only
concurrency net this repo has. Width 1, inside `queue.wip_limit` 3.

**This closes the task.** Every item the audit raised is now either merged, ticketed, ratified, or
explicitly out of scope with an owner. Nothing is waiting on a human.

## Board move — the only one in this whole task

`ABC-011` **created** in Backlog (WIP-unlimited, so no limit is at issue). That is a creation, not a
column transition: no existing ticket moved anywhere, and `ABC-009` / `ABC-010` sit in Backlog
untouched. **`ABC-011` was deliberately NOT promoted to `Ready`** — the Definition of Ready gate is a
separate step, exactly as recorded for its two predecessors. Three defect tickets now sit in Backlog
un-promoted; that is the honest state, not a backlog someone forgot to groom.

## What the subtask added beyond what was asked, and why it matters

BA/PM **ran the reproduction rather than transcribing it**, which was the right call and is why this
ticket is better than its brief. `ADR-0002`'s two keys reproduced byte-exact. Three facts the run
added, all verified in the ticket on disk:

- **"An ep capture is available" has two defensible readings that disagree on a real position.**
  `7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1` has 1 pseudo-legal ep capture and 0 legal ones. The ticket
  hands this to **Architect/Design at the design hop and forbids deciding it in dev** — correct,
  because the strict-FIDE reading would give `src/zobrist.ts` (today a leaf) a dependency edge to
  `moves`/`legal`, inside a function `EPIC-004`'s transposition table calls per node. **That edge
  is a live interaction with a just-ratified ADR**: `ADR-0002`'s Consequences assert the dependency
  graph stays an acyclic DAG with no upward edge. The strict reading does not create a cycle, but it
  does add an edge that ADR did not price, and it lands on the per-node path clause 3 protects. The
  routing for it is already recorded in the ticket, so it is not owed by me here.
- **The existing threefold test cannot catch this defect** (`src/gameend.test.ts:27-58` — its knight
  cycle never sets an ep square), and `src/zobrist.test.ts:33-37` uses the *real-capture* fixture, so
  it still asserts a true inequality after the fix. That is how this shipped under 100% coverage, and
  it is the third time this audit has found a defect that coverage could not see.
- **The NFR trigger is `NFR-005`, not `NFR-001`** — `src/perft.ts` never calls `zobristKey`, so the
  perft lanes are explicitly not the oracle. A cheaper analysis would have reflexively written
  `NFR-001`.

**Sizing is BA/PM's and it agreed with the ADR's recommendation** (`S` / `P2`), with both grounds
re-checked against files rather than accepted from the ADR. The reasoning on ratification is worth
keeping: clause 2 widened the defect's **blast radius** to four epics without moving its severity or
its reachability, and every inheritor is still unbuilt — so it argues for a **sequencing constraint,
not `P1`**. That constraint is encoded as an escalation trigger (it rises to `P1` when the clause-2
history module is decomposed, when `positionCounts` gets its first supplier, or when `EPIC-004`
builds its per-ply key array or TT). Independent of `ABC-009` / `ABC-010`, with the asymmetry
inverted: nothing removes this trigger, because it fires on a legal position one ply out of the start.

## The third leftover, found and closed inside the same edit

`EPIC-004`'s `NFR triggers` closed with *"Architect seeds both rows in `plans/nfr-catalog.md` at
design time"* — harmless before 2026-07-30, a trap after it, because both rows now exist and
`NFR-005` is ratified. Executed literally at the design hop it would **overwrite a human's ratified
decision**. BA/PM left the sentence as written and documented the consequence in the dated history
block ("at design time that step is a read, not a re-seed"). I considered dispatching a fourth edit
and judged the in-file warning sufficient: the sentence is now unreadable without its correction.

The retired `>= 500,000 nodes/sec` target is kept as a dated blockquote quoting the old wording
verbatim, not silently overwritten — matching how `plans/nfr-catalog.md` kept its `CORRECTED
2026-07-29` block. `RISK-002`'s mitigation now measures depth-in-budget on non-M3 hardware, and its
`GO WITH CONSTRAINT` answer from `ABC-008` is unchanged.

## Honest limits, unchanged across all fourteen notes in this folder

- **No `finding` admitted anywhere in this task.** Fourteen notes, all `observation` / `decision` /
  `artifact-ref`. There is no live §14-gate verdict for an audit, an ADR, or a ticket cut, so no
  `finding` is admissible and nobody self-stamped — including for the reproduction BA/PM actually
  ran and verified this session. `verified_by` on that note is **empty**, which is correct: running a
  repro is not a gate verdict.
- **No `scripts/context-io.ts`, no `scripts/claim.js`, no `.claude/hooks/`** (re-verified absent).
  No validator ran, no atomic claim was taken, `index.md` / `index.jsonl` were never regenerated.
  All fourteen notes are hand-written against SCTX-01.
- **No queue directory exists.** At width 1 the within-task writer is single by construction, so the
  WF17 atomic claim had nothing to run. Recorded rather than glossed.
- **REDUCED tier throughout this session** — `Agent` available on a default main thread with no
  enumerated allowlist, so the role grant was honored **by instruction, not by runtime enforcement**.
  Announced before scheduling.
- **Planning-only change**: `git diff --stat -- src/` empty, suite 143/143 green with a 0 skip count,
  typecheck clean.

## What this task leaves for the next one — all of it visible, none of it blocked

`ABC-009`, `ABC-010`, `ABC-011` in Backlog, un-promoted, each with an escalation trigger. `EPIC-002`
through `EPIC-006` still undecomposed — `EPIC-002` is `P0` and is the epic that will invent the
history module `ADR-0002` clause 2 now governs, so it is the natural next planning step. `ABC-011`'s
open design question is owed to Architect/Design at that design hop, not before. The `NFR-005`
depth-7 level stays **PROVISIONAL** until `EPIC-004`'s spike measures on non-M3 hardware; that
obligation has a home in the catalog's `Verified by` cell and in the epic's `RISK-002`.
