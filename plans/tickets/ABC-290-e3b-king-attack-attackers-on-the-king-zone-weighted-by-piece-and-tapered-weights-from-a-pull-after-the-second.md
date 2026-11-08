---
id: ABC-290
title: "E3b: king attack. Pieces attacking the enemy king's zone add a weighted, tapered term (a re-try of dropped ABC-205's term), with hand values fixed by a stated rule and judged on its own C2′"
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-011
feature: —
adr: "owed (the Architect's): a new ADR on main's tapered evaluation, form (b): the zone, the attacker weights by piece, the count-to-score rule and the hand values it gives, and the G2 ratio. Intent GAIN (ADR-0056 D6's dated line of arch-owner-answers-1105). A new ADR is the owner's to accept (reading (b))"
---

# ABC-290: king attack, attackers on the king zone (E3b)

> **FORM (b), HAND VALUES ON ITS OWN READ; THE HOLD LIFTS; THIRD IN THE ORDER, 2026-11-05, by BA/PM** (task `bapm-wait-lines-1105`, records
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
>   **This page is third.**
>   *2026-11-07 (`bapm-terms-after-291`; `…8cc32a89` § 2, `ADR-0056` D6's dated line of `arch-ABC-291-closed`, `…aab9afd1`): **E4b is spent, NOT MET. The order now reads E5 (`ABC-292`), then E3b (`ABC-290`), then E6 (`ABC-293`). This page is second of the three,** still after `ABC-292`'s read. The order stays the Orchestrator's, with the owner told.*
> - No bar is new. **DoR 9/10, unchanged: the ADR is owed. Backlog.** The board move is the Orchestrator's.

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog** (task `bapm-epic011-areas`, records only, at `main` `b274711c`;
> nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` Phase 4,
> stub row E3, the rest after E3a (`ABC-270`, merged).
> - **Hold:** after E2's second pull (the ruled Phase 4 order is `ABC-271` → the second pull, one read judging both;
>   `ADR-0056` D6's dated line of 2026-11-04). The ADR is owed.
> - **Re-open trigger:** the second pull merges or closes. Then the Architect designs on that `main`.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** the owner at level 5 and every game in which the kings are attacked with queens on.
- **Pain:** `main` scores king safety by shelter and open files only (`KING_SHELTER_MISSING`, `KING_FILE_HALF_OPEN`,
  `KING_FILE_OPEN`, and their queen-on pairs at 0 from `ABC-270`). Nothing counts the pieces bearing on the king.
- **History:** `ABC-205`'s king-safety term died on `G6` cost alone (`EPIC-008`). Under `Q-3K-4` (b) an evaluation
  ticket is judged on play with `NFR-005`'s floor, so that cause no longer gates it the same way (`ADR-0056` D2's dated
  line of 2026-11-03, row E3).
- **Supporting information, not a bar:** every tuner fit weights the king's square tables about 3–3.6 × (mg) and
  2.2–2.8 × (eg) above E1's rule tables (`ADR-0067` § Context).
- **Value:** `ADR-0056` D2 row E3 estimates **+40–100 Elo** for the whole row (E3a and E3b; an estimate, [B] 7.3 /
  7.4). Not a reading.

## Where the values come from (hand values, on the wait)

- **A stated rule in this term's ADR,** written before any row or game is read, and accepted by the owner. Nothing is adjusted after a
  result is seen.
- **Not from a pull.** Tuning waits: no third fit and no date (`ADR-0067`'s dated block of `arch-owner-answers-1105`).
- **Its own read.** If this term merges on its own read, or inside a bundle (`…0f1ab02e` item 2), a third pull may be asked for. Asking is not
  a yes.
- **The record against it** (`…ba8265e9`): `ABC-205` died on cost, and `ADR-0068`'s king values lost mates. If he would rather try the
  largest estimate first, this is the term, at a higher risk of both. The order is cheap to change.
- **If he ever says yes to a third pull,** this term may enter its free set~~, and each new export is owed to that pull's emitter change
  (`…6ccd8243` item 3)~~. *2026-11-05 (`bapm-ABC-291-lines`): **superseded.** `ADR-0075`, accepted, in force at `ABC-291`'s merge, moves the tool line from a pull to the term's merge. d11 (a) settles it for
  `ABC-291`. **This term's ADR follows d12's pattern,** in its order: definitions; one rule built on `main`'s own table, fixed before any row and blind to `zugzwang.001`; the memo or per-call seam; one
  switch and an off-door pair; a `G2` ratio with its reason and its blind spot; a probe with rows, a sealed form, and a line for what it can and cannot change; K rows reading the term's own part; CF's
  table filled; the tool line at the merge; no second set after a miss. It sets its own ratio, and d12 binds none of its values. "No second set" binds it only if he accepts that in this term's own ADR
  (`…c1623ae7`). If E2 closes for good, no tool line is owed by any later term.*
  *2026-11-07 (`bapm-terms-after-291`; `ADR-0075`'s dated block of `arch-ABC-291-closed`, `…8cc32a89` § 1, `…aab9afd1`): **"in force at `ABC-291`'s merge" has no merge left to wait for.** `ABC-291` is NOT MET, and `ADR-0075` stays accepted, not in force. **This line stands, not struck, by the Orchestrator's ruling:** d11 (a) and d12 are not tree lines, so the emitter line stays superseded and this term's ADR still follows d12's pattern. `ABC-291` landed no tool line, so nothing is owed from it, and this term's tool line is its own, at its own merge. "No second set" still binds this term only if he accepts that in this term's own ADR.*

## Scope

The ADR governs each line.

1. For each side, the enemy pieces that attack squares of its king's zone are counted by piece type, and a stated rule
   turns the weighted count into a score, tapered by phase (mg / eg halves in `src/evaluate-params.ts`).
2. Form (b): one switch and a test-only off-door pair (`ADR-0026` d10).

## Out of scope

- Pawn storms, shelter rules (on `main`), tuning itself (`ADR-0067`), any search change.

## Acceptance criteria

The ADR fixes exact counts before Ready. None is loosened after Ready. Form (b) is `ADR-0056` D6's dated line; no bar is new.

- **Values:** fixed by the ADR's stated rule before any row is read.
- **Rows:** rule rows through the seam (attacker counts per piece, the zone), by arithmetic; the mirror.
- **Safety:** `ADR-0064` d7's rows: mate floor 0 violations, zugzwang 7 / 7 at recorded depths with `zugzwang.001` among them, `G1` no
  NEWLY-missed line. No depth moves, and no expected result is rewritten.
- **On offer, the ADR's to take:** QE's castled-corner rows S1–S3 (`TAPER_KP_SHELTER_STRESS`, frozen on `grugops/ABC-269` `d6a57653`) as graded
  rows at ≥ 20 cp (`ADR-0056` D2's dated line, row E3).
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

- **A candidate fault in the read:** CF1–CF10 reach this read, by the owner's word (`…0f1ab02e` item 1). ~~The form QE copies for a single-part read
  is `arch-owner-answers-1105b`'s, in flight.~~ *2026-11-05 (`bapm-pointers-1105`): **settled.** The form, alone or in a bundle, is `ADR-0056` D5's dated block of
  `arch-owner-answers-1105b` (`…65557abd`): QE copies its Reach line and CF1–CF10 unaltered, then its table, filled from this page and the ADR. The block governs. No bar moves.*
- **Recommended to the ADR, not a rule on any record** (`…ba8265e9`): no second set of values after a miss. New numbers chosen after seeing a
  loss are tuning on play by hand.

## NFR triggers

- **`NFR-001` / `G2`:** at or below the ADR's ratio; attacker counting costs per call. A lazy evaluation of costly terms is recorded as the cost cut
  to weigh (`EPIC-011` § Phases, "Not cut, recorded"; `ADR-0057` D8.7).
- **`NFR-005`:** `G6` as above. **`NFR-008`** (≤ 10 s): units only. **`NFR-009`:** no new table expected.

## Test notes

1. QE freezes the seam fixtures and the (b) rows before the build.
   *2026-11-07 (`bapm-terms-after-291`; `…aab9afd1`, `…32c023cc`, `ADR-0075`'s dated block of `arch-ABC-291-closed`): **the freeze is a gate before the build.** This term's build waits for QE's freeze of the seam fixtures and the (b) rows, and the Orchestrator checks this ticket for it before any build dispatch. `ABC-291`'s freeze came after its build (K1 (c)), the fourth such miss. The gate is on the dispatch: it adds no bar and no DoR row, and this note's words stand.*
2. UAT is owed (production lines); the QE verdict signs it.

## Size and priority

- **Size: M.** **Priority: P2**, the largest evaluation estimate after E2.

## Dependencies

- **The ADR,** then the owner's acceptance. DoR row 10. Its probe runs on the host after `ABC-282`'s A4; it need not wait for `ABC-303` or `ABC-289`,
  only for the host (`ADR-0056` D6's dated line).
- **Third of the four, after `ABC-292`'s read.**
  *2026-11-07 (`bapm-terms-after-291`; `…8cc32a89` § 2, `…aab9afd1`): `ABC-291`'s read is played, NOT MET, so this page is **second of the three left, still after `ABC-292`'s read.** QE's freeze goes before its build (test note 1).*
  *2026-11-08 (`bapm-ABC-292-accept`; the owner's ruling, `orch-2026-10-30a` `…23d30c72`): **a miss on `ABC-292`, any `ADR-0076` d14 (c) miss, is the stop for the hand-valued path:** E3b (`ABC-290`) and E6 (`ABC-293`) are not built after it without his new word. This page stands, and nothing on it moves. Without a miss there, the order above holds.*
- **The read queues.** A value-changing merge stales the read after it, so this term's C2′ follows `ABC-303` and `ABC-289`.
  *2026-11-06 (`bapm-lines-1106b`; `…7c297147` § 4 item 2, `…40ef8351`): **met.** `ABC-303` merged at `434fa171`, and `ABC-289`'s recorded outcome, NOT MET on an exact build with nothing merged, meets it. This term's place in the order does not change.*
- **A bundle with `ABC-293`** (`…a5d74f70`) stays lawful under B1. A term merged inside it can open `ADR-0067`'s third-pull door, and CF1–CF10 reach
  it (`…0f1ab02e` items 1 and 2). ~~How the four tests read for a bundle term is `arch-owner-answers-1105b`'s, in flight.~~ *2026-11-05 (`bapm-pointers-1105`): **settled.** `ADR-0067`'s dated
  line of `arch-owner-answers-1105b`, at the end of the block above § What would falsify this (`…3e6b25fb`): each test is read on the term, not the bundle. A bundle that does
  not merge opens nothing.*
- **`ABC-301` closed NOT MET:** the trigger is met. *2026-11-05: "E2's second pull merged or closed" is gone as a wait.*
- **One at a time on `src/evaluate.ts` / `src/evaluate-params.ts`** with `ABC-272`, `ABC-291`–`ABC-294`.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ no attacker term; `ABC-205`'s cause stated; the value is an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–3; storms, shelter, tuning out |
| 3 | INVEST | ✅ M; one term |
| 4 | testable, measurable acceptance | ✅ form (b): seam rows, safety rows, `G2` at the ADR's ratio, `G6`, C2′ ≥ 50.0. Counts owed with the ADR |
| 5 | dependencies known | ✅ the ADR; third of the four *(2026-11-07, `bapm-terms-after-291`: second of the three left, `ABC-291` NOT MET)*; its read after `ABC-303` and `ABC-289` *(met 2026-11-06, `bapm-lines-1106b`; `…7c297147` § 4)*; the shared files |
| 6 | NFR triggers with targets | ✅ `G2` at the ADR's ratio; `NFR-005` `G6`; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ **the ADR is owed** (zone, weights rule) |

**DoR 9/10. Backlog.**
