---
id: ABC-284
title: "P1: late-move reductions from a log table of remaining depth × move index, replacing ABC-121's flat 1-ply LMR (ADR-0026), behind a test-only off-door pair. Parked: no form in ADR-0060's set meets every bar on main; re-opened only by a new named premise with its own pre-registered probe"
status: dropped
column: Done
size: S–M
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0060 (PROPOSED; parked, premise not met on main, arch-ADR-0060-reopen …e17a23f4, arch-post-268 …1bc554fb). A re-open is the Architect's: a dated ADR-0060 line naming the new premise, its pre-registered probe, the form and the door counts on the main of that day. Acceptance of ADR-0060 is the owner's (reading (b): the build may start on PROPOSED once a form meets every bar)"
---

# ABC-284: late-move reductions from a log table (P1)

> **CLOSED WON'T-DO, 2026-11-09, by BA/PM** (task `bapm-close-1109`, records only, at `main` `e069b49a`; nothing run): project closed by the owner 2026-11-09 (`orch-2026-10-30a` `…a9c03e07`). Status `dropped`, column Done: closed, not delivered. The page below stands as the record; the board move is the Orchestrator's.

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog, PARKED** (task `bapm-epic011-areas`, records only, at `main`
> `b274711c`; nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`: "after
> cutting W1, start cutting EPIC-011 areas"). `EPIC-011` Phase 2, stub row P1, and § "P1, parked".
> - **The id is given now by the owner's ruling,** over § "P1, parked"'s "no id until the trigger passes". The bars
>   still have one home, `ADR-0060` d8 / d9. This page carries them by reference and does not restate a number that
>   could drift.
> - **Hold:** parked. On `main` `e72487e1` (futility in force) `ADR-0060` decision 1 missed `A4` (a) (`chooseMove`
>   position-6 0.8528 > 0.85), the 27 cp cap (63 cp) and zugzwang 7 / 7 (`zugzwang.004` g7f6 at d11). The joint
>   O1h + P1 probe (`arch-next-pull`) failed too.
> - **Re-open trigger:** a new named premise with its own pre-registered probe (`ADR-0056` D2's dated line). Named so
>   far: (1) E1's changed tree, **already on `main` since `54dee3f2`; no P1 re-probe on it is on record**
>   (`UNKNOWN - verify`); (2) `ABC-283` merging, which puts a history table on `main` for `ADR-0060` d11's history
>   term (`ADR-0063` decision 11); (3) E2's second pull merging.
>   - *2026-11-04 (`bapm-ABC-283-done`; `arch-ABC-283-accept` `…cbf0bc7b` § Owed, item 4):* **trigger (2) has
>     happened:** `ABC-283` merged `58e90d07`, with `ADR-0063`'s history (K3, max(0, h)) on `main`. It names the
>     premise; it does not re-open P1, which is the Architect's (a dated `ADR-0060` line and a new PREREG). **Read
>     R-283-LMR first** (`ADR-0060` § Status, 2026-11-04; QE-283-b, LOW): the same-depth mate floor depends on
>     quiet-move order through LMR (d5 0 / 190 and 0 / 188 hold; d6 `chooseMove` loses 2 / 209, the same two rows as
>     base `main`). If a later change turns the d5 floor red, the lever is LMR, this ticket, not history. A P1
>     re-open's PREREG reads both floors, d5 as the bar and d6 as a report, over the history table now on `main`.
>     **Still parked; DoR 9/10, Backlog.**
>   - *2026-11-04 (`bapm-bundle-1-cut`; `arch-bundle-1` `…37b7fb23` § Owed, item 5; `ADR-0060` § Status, the dated line of that date):*
>     **bundle 1's red forms add to R-283-LMR.** Forms not built: M1, M2 and M4 of P4 lose the KRK row
>     `6k1/R7/5K2/8/8/8/8/8 w` at d5 in `chooseMove`, and C2–C4 of O2c lose KQK rows. Six of those rows return the door's
>     mate with LMR off (exploratory, six rows, not a node trace). The forms built, `C1+M3`, `M3` and `C1`, read 0 on every d5
>     row; on P4 that rests on the three-piece clause, not on construction. If bundle 1 (`ABC-303`) turns the d5 floor red, the
>     lever is LMR. No bar, size or priority moves here. **Still parked; DoR 9/10, Backlog.**
>   - *2026-11-08 (`bapm-ABC-298-accept`; `orch-2026-10-30a` `…4d1e0382`, `…00cde110`, `…0b4bc6ba`; `arch-ABC-284`
>     `…9ae6cff1`):* **the owner skipped the re-open try.** On `Q-3K-12` he chose option 2, one try at P1 (`…4d1e0382`).
>     The Architect wrote it as a dated re-open of `ADR-0060`, § The 2026-11-08 look (L1–L6), PROPOSED (premise: today's
>     `main`, a different tree from the one it missed on; decision 1 unchanged), and recommended against it: `zugzwang.004` at d11 and R-283-LMR's
>     same-depth d5 mate floor have no reason to pass that is not a guess, and the probe's odds are below one in ten
>     (`…9ae6cff1`). He agreed with the Architect (`…0b4bc6ba`): **no freeze, no probe, no host time.** `ADR-0060`'s
>     2026-11-08 look **stays PROPOSED, not accepted,** parked as before. **The same-depth mate floor bar stands** (his
>     agreement with L6 question 4). The card went to In Design for the look and is back in Backlog (`…0b4bc6ba`); this
>     page read Backlog throughout. The re-open trigger is unchanged: a new named premise with its own pre-registered
>     probe. No bar, size or priority moves. **Still parked; DoR 9/10, Backlog.**
> - **The board move is the Orchestrator's.**

## Problem

- **User:** every game `skytalix` plays, at every level and at the claim control.
- **Pain:** `main` reduces every late quiet move by a flat 1 ply (`ABC-121`, `ADR-0026`). Reductions do not grow with
  depth or move number, so deep nodes spend the same share on late moves as shallow ones.
- **Value:** `ADR-0056` D2 row P1 estimates **+40–100 Elo** (an estimate, [B] 7.1 / 7.3, [t]). The history-free,
  capped form is expected nearer the low end (`ADR-0056` D2, dated 2026-11-02; an estimate). At depth 8 the rule read
  0.68–0.80× the door's nodes and +0.305 ply at 47 000 nodes on its first base (`ADR-0060`). Neither is a reading of
  play.

## Scope

The re-opened `ADR-0060` governs each line.

1. The reduction for a late quiet move is read from a table of remaining depth × move index, by the rule the re-open
   names (`ADR-0060` decision 1 was ⌊1.0 + ln d × ln m / 2.0⌋, one ply less at a PV node, capped at two plies, child
   depth ≥ 1). The exclusions and the re-search follow `ADR-0060`.
2. A history term in the reduction only if the re-open's premise is (2) above, measured jointly (`ADR-0063` decision
   11; `ADR-0060` d11).
3. One switch and a test-only off-door pair (`ADR-0026` d10's pattern). Older doors turn it off.

## Out of scope

- Late-move pruning (P4, `ABC-286`), reverse futility (P2, dropped), any change to futility (`ADR-0061`).
- Re-deriving the 27 cp cap: the owner's question is moot (`EPIC-011` § Owner questions) and stays closed.
- Any change to ordering (`ABC-283`, `ABC-288`).

## Acceptance criteria

`ADR-0060` d8 / d9 and the re-open's decision 2 hold the bars, unchanged, by reference (`EPIC-011` § "P1, parked"
lists them so this page is checkable). None is loosened after Ready.

- **A1:** the export lists grow as `ADR-0060` names (`ABC-077` `A6` +2, `ABC-078` `A4` +1, or the re-open's count).
- **A2:** the table cells, each exclusion, the two-ply re-search row and the source row, as `ADR-0060` names them.
- **A3 (drift and safety):** ≥ 95 % within 25 cp, none beyond 27 cp, 0 sign changes, both recursions at d5 on the 190;
  the mate floor one ply deeper (door d4, head d5) at 0 violations; the seven zugzwang rows at their recorded depths,
  never re-pinned.
- **A4 (pay):** (a) ≤ 0.85× at d8 on kiwipete and position-6 in both recursions; (b) mean completed depth at 47 000
  nodes on the 190 ≥ door + 0.25 ply; (c) `G6` "≥ base" (a search ticket; `Q-3K-4` (b) is for evaluation only).
- **A5:** `G1` ≥ 54 / 58 with no NEWLY-missed line.
- **A6 (the read; `EPIC-011` § The per-change rule, by reference). Intent GAIN** (`EPIC-011` § "P1, parked": 11.0 %
  of non-first moves are reduced at depth 6 on `main`). C2′ ≥ 50.0 of 100, S′ at E 1 810, the Levels deep lane. A
  miss is NOT MET and is not re-played.
- **A7 (identity):** every door that exists before the ticket reproduces its pre-ticket counts (`G4`). The door counts
  are re-derived on the `main` of the re-open; § "P1, parked"'s base facts are from `main` before P3 and are stale.

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | the re-open's probe misses any bar above | stays parked; no form is tuned after the read |
| F2 | A7 red | a defect: the door does not reproduce its base |
| F3 | A3 or A5 red on the build | a defect check first; if real, NOT MET |
| F4 | A6 NOT MET | not merged; the flat 1-ply LMR stays |

## NFR triggers

- **`NFR-005`** (`G6`): "≥ base" binds; every run at depth ≥ 6.
- **`NFR-008`** (`npm test` ≤ 10 s; 9.42 s on `main`): new rows at fixed depth only; heavier rows in `SEARCH_DEEP`.
- **`NFR-009`:** a table of at most a few hundred cells; no growth with search time (`G7`).
- **`NFR-004`:** unchanged; the search is time-bounded as today.

## Test notes

1. QE freezes the re-open's probe set and its door counts before the build (`EPIC-011` § Test notes, the QE freeze).
2. The read runs in QE's scratch clone, host ALONE, outside `npm test`.
3. UAT is owed (production lines). The QE verdict signs it.
4. `ADR-0046`'s moved deep rows run at QE (`R-281-a`): the diff touches a lane input.

## Size and priority

- **Size: S–M** (`ADR-0056` D2). **Priority: P2**, the largest Phase 2 estimate.

## Dependencies

- **The re-open premise and its probe** (the Architect's). DoR row 10.
- **One at a time on `src/search.ts` / `src/engine.ts`** with `ABC-283`, `ABC-286`, `ABC-296` and `ABC-297`; whichever
  merges second re-reads its door counts (`ADR-0061` d9).
- **Premise (2) waits on `ABC-283`'s read.** If `ABC-283` misses, premise (2) is gone and (1) / (3) remain.
  *2026-11-04 (`bapm-ABC-283-done`): `ABC-283` merged `58e90d07`; premise (2) is available to the Architect, with
  R-283-LMR (`ADR-0060` § Status) read first.*

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ flat 1-ply LMR; the value is an estimate, labelled |
| 2 | scope and out-of-scope | ✅ scope 1–3; P4, P2, the cap and ordering out |
| 3 | INVEST | ✅ one rule, one switch; S–M |
| 4 | testable, measurable acceptance | ✅ `ADR-0060`'s bars by reference: ≤ 0.85×, + 0.25 ply, 95 % / 25 cp / 27 cp, 7 / 7, ≥ 54 / 58, C2′ ≥ 50.0 |
| 5 | dependencies known | ✅ the premise; the shared files; `ABC-283` for premise (2) |
| 6 | NFR triggers with targets | ✅ `NFR-005` ≥ base; `NFR-008` ≤ 10 s; `NFR-009` ≤ 16 MiB |
| 7 | test notes | ✅ 1–4 |
| 8 | size | ✅ S–M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ **parked:** no form meets every bar on `main`. Re-opens on a named premise with a pre-registered probe (the Architect's) *2026-11-08 (`bapm-ABC-298-accept`; `…0b4bc6ba`): the owner skipped the 2026-11-08 try; `ADR-0060`'s look stays PROPOSED; still parked* |

**DoR 9/10. Backlog, parked.**
