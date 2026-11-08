---
id: ABC-293
title: "E6: threats and tempo. A piece attacked by an enemy pawn and a hanging piece (attacked and not defended) cost the side that owns it, and the side to move earns a tempo bonus, each tapered, with hand values fixed by a stated rule and judged on its own C2′"
status: backlog
column: Backlog
size: M
priority: P3
epic: EPIC-011
feature: —
adr: "owed (the Architect's): a new ADR on main's tapered evaluation, form (b): the threat definitions, the tempo term and how it meets the null move and the mirror relation, the stated rule and the hand values it gives, and the G2 ratio. Intent GAIN (ADR-0056 D6's dated line of arch-owner-answers-1105). A new ADR is the owner's to accept (reading (b))"
---

# ABC-293: threats and tempo (E6)

> **HELD UNDER THE OWNER'S STOP: NOT BUILT WITHOUT HIS NEW WORD, 2026-11-08, by BA/PM** (task `bapm-ABC-292-closed`, records only, at `main` `6b8dd230`; nothing run). Sources:
> `arch-ABC-292-probe` `…22e36b63`, the Orchestrator's `…5bc9e701`, and the owner's ruling `…23d30c72`.
> - **The stop has fired.** `ABC-292` (E5) missed at its probe, by `ADR-0076` d13 rule 2 (PR7, `G1`: "win material, seed 1700" newly missed), and that is a d14 (c) miss. By his ruling, a miss
>   there is the stop for the hand-valued path, and this ticket (E6) is not built after it without his new word. Nor is `ABC-290` (E3b), and nor is `ABC-308` (outposts) on hand values (`…e63ff24f`).
> - **This page stands, and nothing on it moves:** no value, rule, bar, order place or DoR row. Its place (last of the three) applies only if he re-opens the path. Column Backlog and DoR 9/10, as written.
>   A board card change, if any, is the Orchestrator's.
> - **What comes next on the evaluation side is his question,** open as `Q-3K-12` on `EPIC-011` § Owner questions, asked on the Architect's options read (`arch-ABC-292-closed`). Until he answers,
>   no build of this ticket is dispatched.

> **FORM (b), HAND VALUES ON ITS OWN READ; THE HOLD LIFTS; LAST IN THE ORDER, 2026-11-05, by BA/PM** (task `bapm-wait-lines-1105`, records
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
>   **This page is last:** the lowest estimate, and tempo's effect on the rules is still unknown.
>   *2026-11-07 (`bapm-terms-after-291`; `…8cc32a89` § 2, `ADR-0056` D6's dated line of `arch-ABC-291-closed`, `…aab9afd1`): **E4b is spent, NOT MET. The order now reads E5 (`ABC-292`), then E3b (`ABC-290`), then E6 (`ABC-293`). This page stays last,** after `ABC-290`'s read. The order stays the Orchestrator's, with the owner told.*
> - No bar is new. **DoR 9/10, unchanged: the ADR is owed. Backlog.** The board move is the Orchestrator's.

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog** (task `bapm-epic011-areas`, records only, at `main` `b274711c`;
> nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` Phase 4,
> stub row E6 ("not cut: weights from the tuner; id at E2's merge" is superseded by the ruling).
> - **Hold:** after E2's second pull (`ADR-0056` D2: E6 depends on E2). The ADR is owed.
> - **Re-open trigger:** the second pull merges or closes.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** every game; tactics at the leaves.
- **Pain:** `main`'s static score does not see a piece attacked by a pawn or left hanging. Quiescence resolves captures
  (`ADR-0024`, `ADR-0069`), but at a quiet leaf the threat is scored as if absent. There is no tempo term.
- **Value:** `ADR-0056` D2 row E6 estimates **+20–50 Elo** (an estimate, [J], lowest confidence). Not a reading.

## Where the values come from (hand values, on the wait)

- **A stated rule in this term's ADR,** written before any row or game is read, and accepted by the owner. Nothing is adjusted after a
  result is seen.
- **Not from a pull.** Tuning waits: no third fit and no date (`ADR-0067`'s dated block of `arch-owner-answers-1105`).
- **Its own read.** If this term merges on its own read, or inside a bundle (`…0f1ab02e` item 2), a third pull may be asked for. Asking is not
  a yes.
- **If he ever says yes to a third pull,** this term may enter its free set~~, and each new export is owed to that pull's emitter change
  (`…6ccd8243` item 3)~~. *2026-11-05 (`bapm-ABC-291-lines`): **superseded.** `ADR-0075`, accepted, in force at `ABC-291`'s merge, moves the tool line from a pull to the term's merge. d11 (a) settles it for
  `ABC-291`. **This term's ADR follows d12's pattern,** in its order: definitions; one rule built on `main`'s own table, fixed before any row and blind to `zugzwang.001`; the memo or per-call seam; one
  switch and an off-door pair; a `G2` ratio with its reason and its blind spot; a probe with rows, a sealed form, and a line for what it can and cannot change; K rows reading the term's own part; CF's
  table filled; the tool line at the merge; no second set after a miss. It sets its own ratio, and d12 binds none of its values. "No second set" binds it only if he accepts that in this term's own ADR
  (`…c1623ae7`). If E2 closes for good, no tool line is owed by any later term.*
  *2026-11-07 (`bapm-terms-after-291`; `ADR-0075`'s dated block of `arch-ABC-291-closed`, `…8cc32a89` § 1, `…aab9afd1`): **"in force at `ABC-291`'s merge" has no merge left to wait for.** `ABC-291` is NOT MET, and `ADR-0075` stays accepted, not in force. **This line stands, not struck, by the Orchestrator's ruling:** d11 (a) and d12 are not tree lines, so the emitter line stays superseded and this term's ADR still follows d12's pattern. `ABC-291` landed no tool line, so nothing is owed from it, and this term's tool line is its own, at its own merge. "No second set" still binds this term only if he accepts that in this term's own ADR.*

## Scope

The ADR governs each line.

1. A penalty per piece attacked by an enemy pawn, by piece type, tapered.
2. A penalty per hanging piece (attacked, not defended), by the ADR's definition, tapered.
3. A tempo bonus for the side to move, tapered.
4. Form (b): one switch and a test-only off-door pair (`ADR-0026` d10).

## Out of scope

- SEE in the evaluation, king attack (`ABC-290`), piece terms (`ABC-292`), tuning itself.

## Acceptance criteria

The ADR fixes exact counts before Ready. None is loosened after Ready. Form (b) is `ADR-0056` D6's dated line; no bar is new.

- **Values:** fixed by the ADR's stated rule before any row is read.
- **Rows:** each term read through the seam by arithmetic; the mirror.
- **Safety:** `ADR-0064` d7's rows: mate floor 0 violations, zugzwang 7 / 7 at recorded depths with `zugzwang.001` among them, `G1` no
  NEWLY-missed line. No depth moves, and no expected result is rewritten.
- **`G2`:** per call against the base at or below **the ratio the ADR sets**. The earlier 1.05 × was form (a)'s precedent, not this row's
  bar.
- **`G6`** under `Q-3K-4` (b): every run at depth ≥ 6, depth 7 a WARN, "≥ base" reported.
- **The read:** C2′ **GAIN ≥ 50.0 of 100** at 100 ms against the merge-base, 100 of 100 complete, 0 candidate faults and 0 losses on time;
  S′ at the E in force (1 810 today); the Levels deep lane.
- **What a pass means:** "not seen worse", not "proven better". The term's Elo stays unknown (`ADR-0056`'s C2′ table).
- **Tempo, named open:** a side-to-move term changes the static score the null move compares with beta and how the
  mirror relation (`G3`, `ABC-083` A1, exact equality) is stated. Which relation rows it touches is `UNKNOWN - verify`;
  the ADR lists them before Ready.

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

- **`NFR-001` / `G2`:** at or below the ADR's ratio; attack and defence maps cost per call. **`NFR-005`:** `G6` as above.
- **`NFR-008`** (≤ 10 s): units only. **`NFR-009`:** no new table expected.

## Test notes

1. QE freezes the seam fixtures and the (b) rows before the build.
   *2026-11-07 (`bapm-terms-after-291`; `…aab9afd1`, `…32c023cc`, `ADR-0075`'s dated block of `arch-ABC-291-closed`): **the freeze is a gate before the build.** This term's build waits for QE's freeze of the seam fixtures and the (b) rows, and the Orchestrator checks this ticket for it before any build dispatch. `ABC-291`'s freeze came after its build (K1 (c)), the fourth such miss. The gate is on the dispatch: it adds no bar and no DoR row, and this note's words stand.*
2. UAT is owed (production lines); the QE verdict signs it.

## Size and priority

- **Size: M.** **Priority: P3** (the lowest-confidence estimate).

## Dependencies

- **The ADR,** then the owner's acceptance. DoR row 10. Its probe runs on the host after `ABC-282`'s A4; it need not wait for `ABC-303` or `ABC-289`,
  only for the host (`ADR-0056` D6's dated line).
- **Last of the four, after `ABC-290`'s read.**
  *2026-11-07 (`bapm-terms-after-291`; `…8cc32a89` § 2, `…aab9afd1`): `ABC-291`'s read is played, NOT MET, so this page is **last of the three left, still after `ABC-290`'s read.** QE's freeze goes before its build (test note 1).*
  *2026-11-08 (`bapm-ABC-292-accept`; the owner's ruling, `orch-2026-10-30a` `…23d30c72`): **a miss on `ABC-292`, any `ADR-0076` d14 (c) miss, is the stop for the hand-valued path:** E3b (`ABC-290`) and E6 (`ABC-293`) are not built after it without his new word. This page stands, and nothing on it moves. Without a miss there, the order above holds.*
  *2026-11-08 (`bapm-ABC-292-closed`; `…22e36b63`, `…5bc9e701`): **the miss came, at `ABC-292`'s probe (d13 rule 2), so the stop has fired.** This ticket is held for his new word (the banner).*
- **The read queues.** A value-changing merge stales the read after it, so this term's C2′ follows `ABC-303` and `ABC-289`.
  *2026-11-06 (`bapm-lines-1106b`; `…7c297147` § 4 item 2, `…40ef8351`): **met.** `ABC-303` merged at `434fa171`, and `ABC-289`'s recorded outcome, NOT MET on an exact build with nothing merged, meets it. This term's place in the order does not change.*
- **A bundle with `ABC-290`** (`…a5d74f70`) stays lawful under B1. A term merged inside it can open `ADR-0067`'s third-pull door, and CF1–CF10 reach
  it (`…0f1ab02e` items 1 and 2). ~~How the four tests read for a bundle term is `arch-owner-answers-1105b`'s, in flight.~~ *2026-11-05 (`bapm-pointers-1105`): **settled.** `ADR-0067`'s dated
  line of `arch-owner-answers-1105b`, at the end of the block above § What would falsify this (`…3e6b25fb`): each test is read on the term, not the bundle. A bundle that does
  not merge opens nothing.*
- **`ABC-301` closed NOT MET:** the trigger is met. *2026-11-05: "E2's second pull merged or closed" is gone as a wait.*
- **One at a time on `src/evaluate.ts` / `src/evaluate-params.ts`** with `ABC-272`, `ABC-290`–`ABC-292`, `ABC-294`.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ threats unseen at quiet leaves; no tempo; the value is an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–4 |
| 3 | INVEST | ✅ M |
| 4 | testable, measurable acceptance | ✅ form (b): seam rows, safety rows, `G2` at the ADR's ratio, `G6`, C2′ ≥ 50.0. The tempo relation rows owed with the ADR |
| 5 | dependencies known | ✅ the ADR; last of the four *(2026-11-07, `bapm-terms-after-291`: last of the three left, `ABC-291` NOT MET)*; its read after `ABC-303` and `ABC-289` *(met 2026-11-06, `bapm-lines-1106b`; `…7c297147` § 4)*; the shared files |
| 6 | NFR triggers with targets | ✅ `G2` at the ADR's ratio; `NFR-005` `G6`; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ **the ADR is owed** |

**DoR 9/10. Backlog.**
