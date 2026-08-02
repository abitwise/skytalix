---
id: 20260802T210633Z-orchestrator-decision-cfb48956
kind: decision
by: orchestrator
at: 2026-08-02T21:06:33Z
verified_by: 
confidence: high
refs:
  - refinement-fide-9-6-1
  - ABC-020
  - ABC-011
  - ABC-012
  - ADR-0002
  - EPIC-004
  - src/gameend.ts
  - memory-bank/60-progress.md
  - plans/traceability.md
  - plans/board.md
  - 20260802T205454Z-orchestrator-decision-14cf502d
  - 20260802T210100Z-ba-pm-decision-968fe5b1
  - 20260802T210200Z-ba-pm-artifact-ref-cfeaccce
supersedes: 
---

# Close: FIDE 9.6.1 settled, no gap, no ticket, and the conditional design hop is CANCELLED

## The ruling is accepted, and it was gated rather than taken on report

BA/PM ruled **no conformance gap**. This role re-verified the load-bearing half independently
before accepting it — the claim is about already-merged rules code on `main`, which is the
condition under which accepting a report unchecked is worst.

Fetched live from `https://handbook.fide.com/chapter/E012023` at 2026-08-02T21:0xZ, separately
from the copy BA/PM retained:

- **9.6.1 verbatim: *"the same position has appeared, as in 9.2.2 at least five times."***
- **`consecutive` occurs ZERO times** in the whole 2023 Laws page — the decisive measurement,
  taken on the retrieved bytes.
- BA/PM's retained `sources/E012023-laws-of-chess-2023.html` is **sha256-identical** to this
  independent fetch (`e0c8bee28c2dee07b724357b9802fee8591e9d11efd2a910b38e9bd21d3c7643`). The
  evidence in the context folder is the real response, not a transcription.

Three code↔text correspondences checked here, not just the one asked about:

| Laws (2023, verbatim) | `src/gameend.ts` | Verdict |
|---|---|---|
| 9.6.1 "at least five times" | `occurrences >= 5` | matches, and `>=` is the right direction — `=== 5` would have been the defect |
| 9.6.2 "at least 75 moves … by each player" | `halfmoveClock >= 150` | matches (75 moves = 150 plies) |
| 9.6 "If the last move resulted in checkmate, that shall take precedence" | terminal check precedes both 9.6 branches | matches — this is ABC-020's A6, already pinned by test |

**QE's `UNKNOWN - verify` is vindicated, not overturned.** The remembered phrase *"five
consecutive alternate moves by each player"* is verbatim correct for the **2014** edition and was
replaced in the **2017** edition. Right words, wrong edition — a failure mode that no amount of
care in recall can detect and only retrieval can. QE's refusal to assert from memory is the
process working, and the same refusal is what made this task cheap.

## What follows

1. **No ticket cut. No board column moved.** `Ready` stays 5/8, `Backlog` unchanged; no limit
   approached, no override taken, no written reason owed.
2. **`src/gameend.ts` does not change.** The "second change on `main`" that `plans/board.md` and
   `memory-bank/60-progress.md` both warned was now owed is **not owed**. That warning is
   discharged, not carried.
3. **The conditional Architect/Design hop is CANCELLED, not deferred.** The routing decision
   (`20260802T205454Z-orchestrator-decision-14cf502d`) held one back in case consecutiveness were
   load-bearing, since it is not derivable from a counts map and would have needed the per-ply key
   list of `ADR-0002` clause 3. The premise failed, so `positionCounts` needs no ordering for
   9.6.1 and **`ADR-0002` needs no amendment on this account**. Cancelled here explicitly, because
   a conditional hop nobody closes becomes a phantom dependency later.
4. **No gate was re-run, and that is deliberate rather than skipped.** `git status` shows two
   markdown files modified and two new untracked directories; **nothing under `src/` or any test
   file changed**. Re-running the 174-test suite would prove only that markdown does not affect
   TypeScript. The last real gate result stands as recorded: 174/174, 0 skips, verified on `main`
   after the merge.

## One judgment call reviewed and upheld

BA/PM edited **ABC-020's** Status cell in `plans/traceability.md`, not a row of its own. Reviewed
by diff rather than by description: the edit is **additive** — the original sentence recording
that the ticket *was* merged with the question open is preserved verbatim, with the closure
appended after it. The clause was assigned to BA/PM **by name** by both QE and Security/NFR, so
closing it where it was recorded is that role discharging its own item, not editing another
role's evidence. **Upheld.** The alternative — a new row for a question that belongs to an
existing ticket — would have split one fact across two places.

## Not touched, and deliberately

Open questions 2 (`GameResult` is a dead alias, Architect/Design's seam) and 3 (ABC-020's A5/A8
`Given` wording, documentation only) are untouched. The request was "settle FIDE 9.6.1"; closing
adjacent questions because a role was already open in the file is scope creep, and both are
recorded where they will be found.

BA/PM's out-of-scope observation on Article 9.2.3.1 — a pawn *"could have been captured en
passant"* — is **evidence for ABC-011, not new scope**. That ticket already sits in `Ready` at
S/P1. No size, priority or ticket file was changed, and none should be on this basis alone.

## Nothing was committed, merged or deployed

The work sits in the working tree on `main`. This role does not commit on `main` and did not.
`autonomy=pr`, `mode=lean`; **a human holds merge and deploy**, unchanged.

## Provenance

Written directly into `notes/` — this install has no `scripts/context-io.ts`, no
`mcp__grugops__propose_note` and no `scripts/claim.js`. **`finding` is not admissible on this
task**: the re-verification above is genuinely evidenced, but there is no §14 gate here to issue a
stamp, so it is recorded as a `decision` carrying its evidence inline rather than self-stamped
into a `finding`. Nothing is self-stamped.
