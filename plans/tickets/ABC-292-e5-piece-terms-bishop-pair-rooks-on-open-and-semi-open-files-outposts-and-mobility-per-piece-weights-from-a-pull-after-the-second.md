---
id: ABC-292
title: "E5, without per-piece mobility: a bishop pair bonus, rooks on open and semi-open files and outposts, with hand values fixed by a stated rule and judged on their own C2′. Per-piece mobility (a re-try of dropped ABC-207) is split off as ABC-306; rook activity was fenced out of EPIC-010"
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-011
feature: —
adr: "owed (the Architect's): a new ADR on main's tapered evaluation, form (b): the three terms' definitions, the stated rule and the hand values it gives, the G2 ratio, and whether the three land as one ticket or split. Intent GAIN (ADR-0056 D6's dated line of arch-owner-answers-1105). Per-piece mobility and its ADR-0031 change left with ABC-306. A new ADR is the owner's to accept (reading (b))"
---

# ABC-292: bishop pair, rook files and outposts (E5, without per-piece mobility)

> **FORM (b), HAND VALUES ON ITS OWN READ; THE HOLD LIFTS; SECOND IN THE ORDER; THE SPLIT RULE APPLIES, 2026-11-05, by BA/PM** (task `bapm-wait-lines-1105`, records
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
>   **This page is second.**
>   *2026-11-07 (`bapm-terms-after-291`; `…8cc32a89` § 2, `ADR-0056` D6's dated line of `arch-ABC-291-closed`, `…aab9afd1`): **E4b is spent, NOT MET. The order now reads E5 (`ABC-292`), then E3b (`ABC-290`), then E6 (`ABC-293`). This page is first of the three.** `ADR-0075` d11 (d) leaves this page where it stands, so nothing moved by rule. The order stays the Orchestrator's, with the owner told.*
> - **The split rule applies.** The order gives one term a different place, so per-piece mobility leaves this page as `ABC-306`, held. It is the
>   one term that has already lost on hand values, and it waits for a fit or its own case (`…ba8265e9`). The three left share a form and a
>   place in the order, so they stay on this page. If the ADR gives them different forms or orders, the rule fires again before Ready.
> - No bar is new. **DoR 9/10, unchanged: the ADR is owed. Backlog.** The board move is the Orchestrator's.

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog** (task `bapm-epic011-areas`, records only, at `main` `b274711c`;
> nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` Phase 4,
> stub row E5 ("not cut: weights from the tuner; id at E2's merge" is superseded by the ruling).
> - **Hold:** after E2's second pull (the ruled order `ABC-271` → the second pull). The ADR is owed.
> - **Re-open trigger:** the second pull merges or closes.
> - **Split rule:** if the ADR gives the four terms different forms or orders, BA/PM splits this page per term
>   (E5a…E5d) before Ready. One page now, because one structure-at-0 landing would carry all four.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** every middlegame.
- **Pain, read on `main`** (`src/evaluate-params.ts`):
  - no bishop pair term, no open-file term ("open files are left to mobility"; only a rule of 20 on the seventh rank
    for the rook), no outposts;
  - *2026-11-05: mobility as one shared weight is `ABC-306`'s pain, not this page's.*
- **History:** `ABC-207` (mobility per piece with hand weights) lost and was dropped (`EPIC-008`). The three terms here have never been tried
  (`…ba8265e9`).
- **Value:** `ADR-0056` D2 row E5 estimates **+30–80 Elo** for the whole row, per-piece mobility included (an estimate, [B] 7.4 / 8.0). Not a
  reading. This page's share of it is `UNKNOWN - verify`.

## Where the values come from (hand values, on the wait)

- **A stated rule in this term's ADR,** written before any row or game is read, and accepted by the owner. Nothing is adjusted after a
  result is seen.
- **Not from a pull.** Tuning waits: no third fit and no date (`ADR-0067`'s dated block of `arch-owner-answers-1105`).
- **Its own read.** If this term merges on its own read, or inside a bundle (`…0f1ab02e` item 2), a third pull may be asked for. Asking is not
  a yes.
- **The third-pull door, without per-piece mobility:** *2026-11-05 (`bapm-ABC-291-lines`; `ADR-0075` d11 (c), accepted, in force at `ABC-291`'s merge; `ADR-0067`'s dated line of `arch-ABC-291`): **this page counts.** His table
  names "E3b, E4b, E5 or E6", and "E5" names the row. These three terms are that row, split by `ABC-207`'s loss and not by the row. All three are in `ADR-0056` D2's row E5 from 2026-11-01 and on this page
  from `181da9e3` (2026-11-04, 13:34Z), before `dd88560f` (23:58Z that day), so test 1 holds. If the three split, each part that merges counts on its own: the four tests read on the part, and only merged
  parts enter the free set. Test 4 is unchanged: one door, one fit. This is the Architect's reading, open to overruling at any third-pull call (`…c1623ae7`).*
  *2026-11-07 (`bapm-terms-after-291`; `ADR-0075`'s dated block of `arch-ABC-291-closed`, `…8cc32a89` § 1, `…aab9afd1`, `ADR-0067`'s dated line of `arch-ABC-291-closed`): **"in force at `ABC-291`'s merge" has no merge left to wait for,** and `ADR-0075` stays accepted, not in force. **d11 (c) stands, not struck, by the Orchestrator's ruling, so this page still counts.** It stays open to overruling at any third-pull call. E4b has left the door: it did not merge and cannot, so the door rests on E5, E3b and E6. Test 4 is unchanged, and asking is still not a yes.*
- **Cost** (`…ba8265e9`): the bishop pair and the rook files look cheap; outposts cost per call.
- **The shared mobility weight stays at its rule value** (`…2b3440cf`). `MOBILITY_CAP` stays fixed.
- **If he ever says yes to a third pull,** this term may enter its free set~~, and each new export is owed to that pull's emitter change
  (`…6ccd8243` item 3)~~. *2026-11-05 (`bapm-ABC-291-lines`): **superseded.** `ADR-0075`, accepted, in force at `ABC-291`'s merge, moves the tool line from a pull to the term's merge. d11 (a) settles it for
  `ABC-291`. **This term's ADR follows d12's pattern,** in its order: definitions; one rule built on `main`'s own table, fixed before any row and blind to `zugzwang.001`; the memo or per-call seam; one
  switch and an off-door pair; a `G2` ratio with its reason and its blind spot; a probe with rows, a sealed form, and a line for what it can and cannot change; K rows reading the term's own part; CF's
  table filled; the tool line at the merge; no second set after a miss. It sets its own ratio, and d12 binds none of its values. "No second set" binds it only if he accepts that in this term's own ADR
  (`…c1623ae7`). If E2 closes for good, no tool line is owed by any later term.*
  *2026-11-07 (`bapm-terms-after-291`; `ADR-0075`'s dated block of `arch-ABC-291-closed`, `…8cc32a89` § 1, `…aab9afd1`): **"in force at `ABC-291`'s merge" has no merge left to wait for.** `ABC-291` is NOT MET, and `ADR-0075` stays accepted, not in force. **This line stands, not struck, by the Orchestrator's ruling:** d11 (a) and d12 are not tree lines, so the emitter line stays superseded and this term's ADR still follows d12's pattern. `ABC-291` landed no tool line, so nothing is owed from it, and this term's tool line is its own, at its own merge. "No second set" still binds this term only if he accepts that in this term's own ADR.*

## Scope

The ADR governs each line.

1. A bishop pair bonus, tapered.
2. A rook on an open file and on a semi-open file, tapered, beside the seventh-rank rule (kept or folded, the ADR's
   call).
3. Outposts (a knight or bishop on a square no enemy pawn can attack, defended by a pawn), tapered, by the ADR's
   definition.
4. Form (b): one switch and a test-only off-door pair (`ADR-0026` d10).

## Out of scope

- Mobility per piece type (`ABC-306`), an early-queen term (`ABC-207`'s other half), threats (`ABC-293`), king attack (`ABC-290`), tuning itself.

## Acceptance criteria

The ADR fixes exact counts before Ready. None is loosened after Ready. Form (b) is `ADR-0056` D6's dated line; no bar is new.

- **Values:** fixed by the ADR's stated rule before any row is read.
- **Rows:** each term read through the seam by arithmetic; the mirror; only the re-pins the ADR lists.
  `G3`'s relation rows stay green, `ABC-083` A4 (mobility within ± 100 cp) included.
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
| F3 | a `G3` row or a safety row red | a defect check first; if real, NOT MET |
| F4 | C2′ NOT MET | not merged, not re-played; the ticket comes back to BA/PM |

- **A candidate fault in the read:** CF1–CF10 reach this read, by the owner's word (`…0f1ab02e` item 1). ~~The form QE copies for a single-part read
  is `arch-owner-answers-1105b`'s, in flight.~~ *2026-11-05 (`bapm-pointers-1105`): **settled.** The form, alone or in a bundle, is `ADR-0056` D5's dated block of
  `arch-owner-answers-1105b` (`…65557abd`): QE copies its Reach line and CF1–CF10 unaltered, then its table, filled from this page and the ADR. The block governs. No bar moves.*
- **Recommended to the ADR, not a rule on any record** (`…ba8265e9`): no second set of values after a miss. New numbers chosen after seeing a
  loss are tuning on play by hand.

## NFR triggers

- **`NFR-001` / `G2`:** at or below the ADR's ratio; outposts cost per call. **`NFR-005`:** `G6` as above.
- **`NFR-008`** (≤ 10 s): units only. **`NFR-009`:** no new table expected.

## Test notes

1. QE freezes the seam fixtures and the (b) rows before the build.
   *2026-11-07 (`bapm-terms-after-291`; `…aab9afd1`, `…32c023cc`, `ADR-0075`'s dated block of `arch-ABC-291-closed`): **the freeze is a gate before the build.** This term's build waits for QE's freeze of the seam fixtures and the (b) rows, and the Orchestrator checks this ticket for it before any build dispatch. `ABC-291`'s freeze came after its build (K1 (c)), the fourth such miss. The gate is on the dispatch: it adds no bar and no DoR row, and this note's words stand.*
2. UAT is owed (production lines); the QE verdict signs it.

## Size and priority

- **Size: M** (three terms; not re-estimated after the split; the rule above stands). **Priority: P2**, the second-largest evaluation
  estimate after E3.

## Dependencies

- **The ADR,** then the owner's acceptance. DoR row 10. Its probe runs on the host after `ABC-282`'s A4; it need not wait for `ABC-303` or `ABC-289`,
  only for the host (`ADR-0056` D6's dated line).
- **Second of the four, after `ABC-291`'s read.**
  *2026-11-07 (`bapm-terms-after-291`; `…8cc32a89` § 2, `…aab9afd1`): **that read is played, NOT MET, so this page is first of the three left and no read waits.** The read's base is `main` as it stands. This term's ADR is next, after these pages merge, unless the owner redirects. QE's freeze goes before its build (test note 1).*
- **The read queues.** A value-changing merge stales the read after it, so this term's C2′ follows `ABC-303` and `ABC-289`.
  *2026-11-06 (`bapm-lines-1106b`; `…7c297147` § 4 item 2, `…40ef8351`): **met.** `ABC-303` merged at `434fa171`, and `ABC-289`'s recorded outcome, NOT MET on an exact build with nothing merged, meets it. This term's place in the order does not change.*
- **`ABC-301` closed NOT MET:** the trigger is met. *2026-11-05: "E2's second pull merged or closed" is gone as a wait.*
- **One at a time on `src/evaluate.ts` / `src/evaluate-params.ts`** with `ABC-272`, `ABC-290`, `ABC-291`, `ABC-293`, `ABC-294`.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ the three absent terms, read on `main`; the value is an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–4 |
| 3 | INVEST | ✅ M; the split rule applied once and named again |
| 4 | testable, measurable acceptance | ✅ form (b): seam rows, `G3`, safety rows, `G2` at the ADR's ratio, `G6`, C2′ ≥ 50.0. Counts owed with the ADR |
| 5 | dependencies known | ✅ the ADR; second of the four *(2026-11-07, `bapm-terms-after-291`: first of the three left, `ABC-291` NOT MET)*; its read after `ABC-303` and `ABC-289` *(met 2026-11-06, `bapm-lines-1106b`; `…7c297147` § 4)*; the shared files |
| 6 | NFR triggers with targets | ✅ `G2` at the ADR's ratio; `NFR-005` `G6`; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ **the ADR is owed** |

**DoR 9/10. Backlog.**
