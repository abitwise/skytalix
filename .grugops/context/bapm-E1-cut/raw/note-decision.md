# bapm-E1-cut decisions: E1 is cut as `ABC-269` (size M, P2, intent GAIN), rows B0–B8 from `ADR-0064` d8 with the probe figures, DoR 10/10 on reading (b). `ABC-231` closes as merged into it; `ABC-232` closes as merged into it and E4. `EPIC-011`: Phase 2 closed, R1 after E1, E1 pulled forward, two owner questions

BA/PM, task `bapm-E1-cut`, records only, on `grugops/bapm-E1-cut` from `main` `2bef4d31` (`src/` tree `58fa3eb4`). Nothing run, built or timed.
- **Inputs:** `ADR-0064` (PROPOSED); `arch-E1` PREREG `…01c2d6a5`, results `…c524a01d`, decisions `…d8150777` (§ 4, the BA/PM inputs); `arch-next-pull` `…7e3ace66`; the Orchestrator's rulings on the board (2026-11-02): Phase 2 closed (P5 deferred), R1 deferred to after E1, next pull E1 with `ABC-231` / `ABC-232` folded.

## 1. The ticket: `ABC-269` (next free id; 268 was the highest in use)
- **Scope** = `ADR-0064` d1–d7: linear phase (N 1, B 1, R 2, Q 4 / 24), the delta-only blend (trunc, mirror-exact), the king's endgame half 40 − 15 m and the passers' 2 × by rank, the data-only params module, the memo's third part (448 KiB), the switch `taper` and three test-only doors with the ladder rule. Out: E2, E3, E4, any other endgame half, O1-e (except as F3's single cost cut).
- **Acceptance, one row per bar:** B0 exact counts (`chooseMove` kiwipete d8 1 296 788 / d9 2 733 330, position-6 d8 404 930 / d9 926 005 / d10 1 692 669; `search()` d8 839 514 / 1 533 901; doors = `main`); B1 (a) mirror over `G3` + ≥ 15 new positions, (b) exact at phase 24, (c) `evaluateWithoutTaper` = `main`, (d) centre king ≥ corner + 20 cp on 6 frozen endings, (e) passers ≥ 1.5 × at phase ≤ 6, exact at 24, ≤ 1.25 × at ≥ 18; B2 mate floor 0 / 163 and 0 / 189; B3 zugzwang 7 / 7; B4 `G1` ≥ 54 / 58 plus `G5`, `G7`, `G8`, `G9`, `G10`; B5 `ADR-0061`'s audit (≤ 0.5 %, 0 ≥ 200 cp); B6 `G2` ≤ 1.05 ×; B7 `G6` at 4 000 ms by `Q-3K-4`'s answer (median ≥ base, or every run ≥ 6); B8 C2′ GAIN ≥ 50.0 of 100, S′ at E 1 810 (`--elo 1810`), Levels deep lane. Reports (drift, reach, the instrument) are not graded. F1–F6 carried with dispositions.
- **Folded row changes** (a table on the page): `ABC-231` A1 → B7; A2's 2 cp → B1 (b) exact; A4 + `ABC-232` A3 → one B6 at 1.05 ×; `ABC-232` A1's within-5-cp clause → B1 (e) (false by construction for an advanced passer); A5 / A6 → B8 by reference.
- **`G7` is owed** (BA/PM's reading): the folded pages listed `G5`, `G8`, `G9`, `G10`; the memo grows a fixed 64 KiB, so `NFR-009`'s gate is named. A judgement, not a new bar: the level is unchanged.
- **Size M** (the Architect's). **Priority P2** (BA/PM's): it is the next pull and E2's prerequisite; both folded pages were P3.
- **DoR 10/10 on reading (b)** (the `ABC-208` / `ADR-0059` / `ADR-0061` precedent): the build may start once QE freezes the 6 endings, the passer readings and the ≥ 15 mirror positions; B8 and the merge wait on *"accept ADR-0064"*; B7 is graded once `Q-3K-4` is answered. `Q-3K-4` is not scored as a blocker, because the build does not wait on it.

## 2. Folds
- `ABC-231`: `status: done`, `column: Done`, `closed:` merged into `ABC-269`. `ABC-232`: the same, merged into `ABC-269` and E4. `ABC-205` stays dropped. The board moves are the Orchestrator's.

## 3. `EPIC-011`
- **Phase 2 closed** (the Orchestrator's ruling): P3 done, P2 dropped, P1 parked, P5 deferred (≈ 0 at 100 ms; stays a stub with no id), P4 / P6 stay stubs.
- **R1 deferred to after E1** (the Orchestrator's ruling; saves host time).
- **E1 pulled forward** ahead of Phase 3 and the rest of Phase 2 (`ADR-0056` D6's reorder rule; a delivery call, the owner told, not asked).
- **Owner questions:** a new row, *"accept ADR-0064"* / *"decline it"* (default: no taper; blocks B8 and the merge); `Q-3K-4` marked live with the settling answers and the Architect's recommendation (judge on play).

## 4. Page drift fixed (the Orchestrator's LOW)
- `ABC-265`: Done (merged `605874b8`, owner *"25 yes"*, QE `…d9879b9c`); `adr:` reads accepted and in force. `ABC-255`: Done (merged `87484808`, QE `…cc9d4bad`). `EPIC-011` Tickets rows 1 and 17 read Done.

## Questions
- **Owner** (already put by the Orchestrator, board): *"accept ADR-0064"* or *"decline it"*; `Q-3K-4`.
- **Orchestrator:** (1) move `ABC-269` Backlog → Ready, and `ABC-231` / `ABC-232` to Done (folded); (2) QE's freezes (test note 1) come before the build's first commit.
