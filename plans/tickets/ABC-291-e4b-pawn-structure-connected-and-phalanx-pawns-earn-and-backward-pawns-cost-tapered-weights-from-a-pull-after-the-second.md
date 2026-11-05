---
id: ABC-291
title: "E4b: pawn structure. Connected and phalanx pawns earn a tapered bonus and backward pawns a tapered penalty, with hand values fixed by a stated rule and judged on its own C2′. First of the four terms on the tuning wait"
status: backlog
column: Backlog
size: S–M
priority: P2
epic: EPIC-011
feature: —
adr: "owed (the Architect's): a new ADR on main's tapered evaluation, form (b): the definitions of connected, phalanx and backward, the stated rule and the hand values it gives, whether they sit in the pawn memo and its size, and the G2 ratio. Intent GAIN (ADR-0056 D6's dated line of arch-owner-answers-1105). Its probe runs on the host after ABC-282's A4. A new ADR is the owner's to accept (reading (b))"
---

# ABC-291: connected, phalanx and backward pawns (E4b)

> **FORM (b), HAND VALUES ON ITS OWN READ; THE HOLD LIFTS; NEXT TERM, P3 → P2, 2026-11-05, by BA/PM** (task `bapm-wait-lines-1105`, records
> only, at `main` `a38315bf`; nothing run). Sources: the owner's "3. wait" (`orch-2026-10-30a` `…b836b85c` item 3), `ADR-0067`'s dated block and `ADR-0056` D2's and D6's dated
> lines of `arch-owner-answers-1105`, `…ba8265e9`, `…2b3440cf` item 4, and the order the Orchestrator accepted (brief
> `bapm-wait-lines-1105`).
> - **The hold lifts.** The trigger, "the second pull merges or closes", fired when `ABC-301` closed NOT MET. The ADR is owed now.
> - **Form (a) is gone for this term.** `ADR-0056` D2's dated line supersedes "structure at 0, values from a pull". This page's form (a)
>   rows and its weights section are out; the old text is in git history.
> - **The form (b) list gains its `G2` line.** The ratio is the ADR's. This page sets none.
> - **The intent is GAIN,** by `ADR-0056` D6's dated line: evaluation rows fire at 100 ms. The NEUTRAL 43.0 option on this page is gone.
> - **Order:** E4b (`ABC-291`), then E5 without per-piece mobility (`ABC-292`), then E3b (`ABC-290`), then E6 (`ABC-293`). The order is the
>   Architect's recommendation, accepted by the Orchestrator (`ADR-0056` D6's reorder rule, with the owner told).
>   **This page is first.** P3 → P2 by the brief, so it no longer goes ahead of two P2s at P3.
> - No bar is new. **DoR 9/10, unchanged: the ADR is owed. Backlog.** The board move is the Orchestrator's.

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog** (task `bapm-epic011-areas`, records only, at `main` `b274711c`;
> nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` Phase 4,
> stub row E4, the rest after E4a (`ABC-271`, Ready).
> - **Hold:** after E2's second pull (the ruled order `ABC-271` → the second pull). The ADR is owed.
> - **Re-open trigger:** the second pull merges or closes.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** every game with pawns on the board.
- **Pain:** `main` scores pawns by material, PSTs, passed by rank, doubled and isolated (`src/evaluate-params.ts`).
  `src/evaluate.ts`'s header leaves backward pawns, chains and connected passers out. A defended pawn chain and a
  backward pawn on a half-open file read the same as loose pawns.
- **Value:** `ADR-0056` D2 row E4 estimates **+20–60 Elo** for the whole row (E4a and E4b; an estimate, [B] 7.3 /
  7.4). Not a reading.

## Where the values come from (hand values, on the wait)

- **A stated rule in this term's ADR,** written before any row or game is read, and accepted by the owner. Nothing is adjusted after a
  result is seen.
- **Not from a pull.** Tuning waits: no third fit and no date (`ADR-0067`'s dated block of `arch-owner-answers-1105`).
- **Its own read.** If this term merges on its own read, a third pull may be asked for. Asking is not a yes.
- **Why first** (`…ba8265e9`): hand values here have failed by cost or by lost mates. This term looks only at pawns, so it may sit in the pawn
  memo, and the smallest job opens the way to a third pull as well as any other. That is reasoned, not read.
- **What it gives up:** it is not the largest estimate, and if its share of the row is small, 100 games may not show it.
- **The risk:** its endgame values touch pawn scores, and the row that failed both pulls is sensitive to those. **`zugzwang.001` played no
  part in this order.** Attribution is not run, and it may not choose the next term.
- **If he ever says yes to a third pull,** this term may enter its free set, and each new export is owed to that pull's emitter change
  (`…6ccd8243` item 3).

## Scope

The ADR governs each line.

1. Connected (defended by a friendly pawn) and phalanx (a friendly pawn beside on the same rank) pawns: a tapered bonus,
   by rank or flat, by the ADR's rule.
2. Backward pawns: a tapered penalty by the ADR's definition and rule.
3. Pawn-only features, so the ADR says whether they sit in the pawn memo (576 KiB after `ABC-271`, `ADR-0070` d2) and
   at what size.
4. Form (b): one switch and a test-only off-door pair (`ADR-0026` d10).

## Out of scope

- Passer terms (E4a, `ABC-271`), pawn storms, king shelter, tuning itself.

## Acceptance criteria

The ADR fixes exact counts before Ready. None is loosened after Ready. Form (b) is `ADR-0056` D6's dated line; no bar is new.

- **Values:** fixed by the ADR's stated rule before any row is read.
- **Rows:** the seam rows, one per definition and one per edge file, by arithmetic; the mirror; only the re-pins the ADR lists (the memo's
  byte size if it grows).
- **Safety:** `ADR-0064` d7's rows: mate floor 0 violations, zugzwang 7 / 7 at recorded depths with `zugzwang.001` among them, `G1` no
  NEWLY-missed line. No depth moves, and no expected result is rewritten.
- **`G2`:** per call against the base at or below **the ratio the ADR sets**. The earlier 1.05 × was form (a)'s precedent, not this row's
  bar.
- **`G6`** under `Q-3K-4` (b): every run at depth ≥ 6, depth 7 a WARN, "≥ base" reported.
- **The read:** C2′ **GAIN ≥ 50.0 of 100** at 100 ms against the merge-base, 100 of 100 complete, 0 candidate faults and 0 losses on time;
  S′ at the E in force (1 810 today); the Levels deep lane.
- **What a pass means:** "not seen worse", not "proven better". The term's Elo stays unknown (`ADR-0056`'s C2′ table).

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | a seam row or the mirror red | a defect |
| F2 | `G2` over the ADR's ratio | STOP to Architect/Design; one value-identical cost cut |
| F3 | a safety row red | a defect check first; if real, NOT MET |
| F4 | C2′ NOT MET | not merged, not re-played; the ticket comes back to BA/PM |

- **A candidate fault in the read:** this is a plain C2′ read, on C-1 as written. CF1–CF10 bind `ABC-303` only (`…4844df37`).
- **Recommended to the ADR, not a rule on any record** (`…ba8265e9`): no second set of values after a miss. New numbers chosen after seeing a
  loss are tuning on play by hand.

## NFR triggers

- **`NFR-009`** (`G7`): any memo growth stated in bytes; ≤ 16 MiB in all, ≤ 1 MiB growth between a 1 s and a 4 s
  search.
- **`NFR-001` / `G2`:** at or below the ADR's ratio. **`NFR-005`:** `G6` as above. **`NFR-008`** (≤ 10 s): units only.

## Test notes

1. QE freezes the seam fixtures and the (b) rows before the build.
2. UAT is owed (production lines); the QE verdict signs it.

## Size and priority

- **Size: S–M.** **Priority: P2** *(2026-11-05, `bapm-wait-lines-1105`: was P3; first in the accepted order)*.

## Dependencies

- **The ADR,** then the owner's acceptance. DoR row 10. Its probe runs on the host after `ABC-282`'s A4; it need not wait for `ABC-303` or `ABC-289`,
  only for the host (`ADR-0056` D6's dated line).
- **First of the four.**
- **The read queues.** A value-changing merge stales the read after it, so this term's C2′ follows `ABC-303` and `ABC-289`.
- **`ABC-301` closed NOT MET:** the trigger is met. *2026-11-05: "E2's second pull merged or closed" is gone as a wait.*
- **One at a time on `src/evaluate.ts` / `src/evaluate-params.ts`** with `ABC-272`, `ABC-290`, `ABC-292`–`ABC-294`.

## `UNKNOWN - verify`

Whether this term fits the pawn memo and at what size. Whether any hand-valued term pays. Whether it holds `zugzwang.001`. Its share of row
E4's estimate.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ no chain or backward terms; the value is an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–4 |
| 3 | INVEST | ✅ S–M; pawn-only terms |
| 4 | testable, measurable acceptance | ✅ form (b): seam rows, safety rows, `G2` at the ADR's ratio, `G6`, C2′ ≥ 50.0. Counts owed with the ADR |
| 5 | dependencies known | ✅ the ADR; first of the four; its read after `ABC-303` and `ABC-289`; the memo; the shared files |
| 6 | NFR triggers with targets | ✅ `NFR-009` ≤ 16 MiB; `G2` at the ADR's ratio; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ S–M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ **the ADR is owed** |

**DoR 9/10. Backlog.**
