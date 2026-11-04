# PREREG arch-bundle-1: bundle 1 (P4 `ABC-286` + O2c `ABC-288`) on `main` `0cc9afd1`: the forms, the doors, the bars, the choice rules and the verdict rule. Sealed and committed before any measured run

Brief `arch-bundle-1`; the owner's answers `orch-2026-10-30a` `…3b15b361`; `ADR-0056` § the bundle read (B1–B7, ACCEPTED with R-BUNDLE-1); `ADR-0063` (d2, d4 with K3, d8, d11, R-283-LMR); `ADR-0060` § Status; `ADR-0061` (the P4 rows, the cut audit); `arch-ABC-283-mate` `…05ef9fc9`; `plans/tickets/ABC-286…`, `ABC-288…`.

**The relation (B1, stated before this PREREG):** (a) both edit `orderMoves` / `src/search.ts` and the two `negamax` bodies; (b) P4 consumes the quiet order O2c changes; (c) P4 is held on its joint probe, and O2c's pay is expected to be small. No part is value-identical.

**No measured run has been made in this hop.** The patch was applied to a scratch copy. One load check is queued on the host lock; it prints no count.

## Instrument
- `git archive 0cc9afd1 src package.json` twice into `<scratch>/archb1/` (`base/` untouched, `head/` patched), outside the repository. Nothing goes into committed `src/` or `tools/`.
- `raw/probe/patch_bundle1.py` adds the knobs to BOTH recursions. They act only where `search()` and `chooseMove` set a `b1` field, so every older door is untouched by construction. With every knob off the head is `main`.
- Driver `raw/probe/probe.ts`, forms `raw/probe/forms.json`, job wrapper `raw/probe/run.sh`.
- Every batch runs as `flock <scratch>/host-test.lock timeout 1500 bash <batch>`, one job at a time on one core, each job under `timeout 900`, with `NODE_OPTIONS=--max-old-space-size=400`. Deterministic counts: fixed depth; `chooseMove` with `maxDepth` or `maxNodes` on a frozen clock; `G1` on its virtual clock. The one timing read is `nps`, a report. **No games.**
- Budget: each batch ≤ 25 min, all measured runs ≤ 1 h. On the budget's end the hop stops and reports what was read.

## The forms
**O2c (`C`).** All: on top of `ADR-0063`'s table, cleared with it, in both recursions, updated by the same call with the same ±d² and gravity at 16 384, only by a quiet cutter, only on a main-tree beta cutoff. No read or write at the root. A null move leaves the previous-move slot empty.
- **CM, the countermove:** `Int32Array(768)`, keyed by the previous move's (coloured piece × to), holding the last quiet cutter there. It sorts as one tier, key 400 000: after the killers (500 000 + rank), above the losing captures (100 000).
- **CH1, CH2, continuation history:** `Int16Array(768 × 384)` each, 589 824 bytes, keyed by a previous move's (coloured piece × to) × this move's (piece type × to). CH1 reads the move one ply back, CH2 two plies back.
- **The quiet key is max(0, h + c1 + c2):** K3 stands, with one floor over the sum, so O2c may promote and never demote. The sum is at most 49 152, below the losing captures' tier.
- Forms, in this order: **C1** CM; **C2** CH1; **C3** CM + CH1; **C4** CM + CH1 + CH2.

**P4 (`M`).** At a node of remaining depth d in either recursion, where: not the root; entered with a null window; alpha and beta strictly inside (−`MATE_FLOOR`, `MATE_FLOOR`); not in check. Once **T[d] quiet moves have been searched**, every later move in the ordered list that neither captures nor promotes nor gives check is skipped: not made, not counted, no malus. This is `ADR-0061`'s P4 row's count (searched quiet moves, not the list index). Index still advances past a skipped move. Futility's skips are not counted as searched.
- **The value rule:** T[d] = 3 + d², the textbook's slower count and the form on record in `ADR-0061`. No "improving" term: the search keeps no static-evaluation stack.
- Forms, in this order:
  - **M1:** T = 4 / 7 / 12, d ≤ 3.
  - **M2:** M1, skipping only a quiet whose ordering key is 0 (nothing on record for it).
  - **M3:** M2, and only with ≥ 3 non-pawn pieces for the side to move (the null move's guard).
  - **M4:** M2 at d ≤ 2: T = 4 / 7.
  - **M5:** M2 with T doubled: 8 / 14 / 24.

## The doors of a reading
`MAIN` is every knob off (the all-off door). A part's own door is that part off with the other on: for P4, head `Cx+My`, door `Cx`; for O2c, head `Cx+My`, door `My`.

## The rows
- **`nodes`:** depth 8, kiwipete and position-6, `search()` and `chooseMove`: four head / door ratios.
- **`reach`:** the mean completed depth at 47 000 nodes on the 190 (`chooseMove`, `maxNodes`).
- **`drift`:** depth 5 on the 190, both recursions.
- **`floor`:** the 287, same depth. B1 `search()` d5 against the door's d5. B2 `chooseMove` d5 likewise. B3 `search()` d5 against `searchWithoutBundle`, `searchWithoutFutility`, `searchWithoutSeePruning`, `searchWithoutTaper` at d5, `searchWithoutTaper` d4, and `chooseMove` d5 against `chooseMoveWithoutBundle` d5. R1, a report: `chooseMove` d6 against the door's d6.
- **`krk`, a report:** `qe-ABC-283`'s fresh seeded 300 KRK + 300 KQK, d5 both recursions and `chooseMove` d6, against the door.
- **`zug`:** `ADR-0050` d9's seven rows, `chooseMove`, recorded depths. **`g1`:** `G1`.
- **`audit`:** `ADR-0061` d8 (d)'s sample: `search()` d6 over the 190 + 6 endgames, every 10th node where the rule skips a move. Each is re-searched fresh three times with the tables as they stood at the mark: head at the node's window, door at it, door full window (v). Flip and error as there.
- **`fire`, the firing figure at 100 ms:** `chooseMove` at 47 000 nodes on the 190: nodes where P4 fires, moves skipped, nodes whose order O2c changes, the countermove's hit rate, the cutoff shape.
- **`nps`, a report:** `search()` d8, alternating arms, best of 5, and the time of one clear.

## Bars
No bar is new. Each is the one on record for the row, and none moves after a read.
- **Safety, every part and the bundle (`ABC-286` L3, `ABC-288` CH2, `ADR-0064` d7):** B1, B2, each B3 row 0 violations; zugzwang 7 / 7 at recorded depths; `G1` ≥ 54 / 58, no NEWLY-MISSED line.
- **Drift (L2; O2c's CH2 reads it too):** both recursions ≥ 95 % of non-mate scores within 25 cp (the bar `ADR-0061` § Alternatives held P4 to), max ≤ 75 cp (`main`'s shared drift literal, `arch-ABC-233`'s PREREG), 0 mate sign changes.
- **Audit (L2, P4 only):** `ADR-0061` d8's bars: flips ≤ 0.5 % of the sampled nodes, 0 flips with an error ≥ 200 cp.
- **Pay (L4):** the four d8 ratios each ≤ 0.95×; reach gain ≥ +0.10 ply.
- **Pay (CH3):** the four d8 ratios each ≤ 0.95× (`ADR-0063`'s number).

## The steps and the choice rules
0. **Instrument check, not a bar.** `check`: all knobs off equals `base/` in nodes, score and move, in both recursions and at the all-off doors, d6–d8, 24 of 24 rows. `main`'s d8 reads 523 847 / 234 214 / 707 548 / 101 425 (`src/search.bundle.test.ts`). A count that differs is explained before any row is read.
1. **Step A, O2c alone, door `MAIN`:** C1–C4: `nodes`, `reach`, `drift`, `floor`, `zug`, `g1`. **Rule A:** among forms meeting Safety and Drift, the lowest geometric mean of the four ratios; a mean within 0.01 of the best goes to the earlier form. It picks a form whether or not it meets CH3.
2. **Step B, P4 alone over history, door `MAIN` (`ADR-0063` d11's joint probe):** M1–M5: `nodes`, `reach`, `drift`, `floor`, `zug`, `g1`, `audit`. **Rule B:** among forms meeting every bar, the largest reach gain; a gain within 0.02 ply goes to the earlier form. If none meets every bar, the form carried is the lowest flip share among forms meeting Safety and Pay; if none does, the lowest flip share among forms meeting Safety; if none does, no form is carried.
3. **Step C, the bundle `Cx+My`, on the rows B2 and B3 grade.**
   - All on, door `MAIN`: `floor`, `krk`, `zug`, `g1`, `drift`, `nodes`, `reach`, `fire`, `nps`.
   - Per part, the floor and `krk` for `My` alone and `Cx` alone (each part's door is the other part alone).
   - **P4's own door** (`Cx+My` over `Cx`): `nodes`, `reach`, `drift`, `audit`. These grade L2 and L4.
   - **O2c's own door** (`Cx+My` over `My`): `nodes`, `drift`. These grade CH3. O2c alone over `MAIN` (Step A) is reported beside it, as B2 (e) has it.
   - If the form carried misses a graded row here and another form met every bar in Step B, the next by Rule B is read here. At most two more.
4. **Step D, the default-lane cost, a report.** The default lane, unchanged, on a scratch full-tree copy that counts `clearHistory` calls, under the lock, read once. Forecast = calls × the clear's time ÷ 2 workers, against the ≤ +0.1 s lane budget (`…112cd856` item 2).

## A red mate floor (B3, R-283-LMR)
- A red row is read per part (the row above) and the cause is named before any fix. An exploratory node trace may name it; it moves no bar.
- A P4 cause: M2 and M3 are the structural answers already listed, chosen by Rule B. A red on O2c alone: no form here fixes it, it is reported, and `R-283-LMR`'s pointer applies: the next lever is LMR (`ADR-0060` P1's ground), not another history form.
- No form is added after a read. If no single door clears it the cause is joint: a STOP to the Orchestrator, and the build does not start.
- Never a re-pin, a deeper depth or a tune.

## The verdict rule
- **P4's premise is met** when Step C meets Safety, Drift, Audit and Pay on its own door. **O2c's premise is met** when Step C meets Safety and Drift and CH3 on its own door.
- **Both met:** `ADR-0072` and `ADR-0073` are PROPOSED with the bars below. Acceptance is the owner's. The build may start on reading (b); the read and the merge wait.
- **A premise missed:** that ADR is PROPOSED with "premise not met", the row named, its F1 fired. No form is tuned after the read. It enters the build only by the owner's word (B2 (d), B6, the fourth guard), put as a question with these readings. "Accept" is not recommended over a miss without saying so.
- **The bundle's read, in every case:** one C2′, 100 games at 100 ms, all parts on against the merge-base, GAIN ≥ 50.0, S′ at E 1 810 and the Levels deep lane as C2′ has them; never re-played, no subset read instead. It is not run in this hop.

## Bars the ADRs write for the build (derived by these rules, fixed now)
- d8: ≤ min(0.95, ⌈100 · (max of the four + 0.05)⌉ / 100).
- Reach, for a part with a pay bar on it: ≥ door + max(0.10, ⌊20 · 0.7 · gain⌋ / 20).
- Drift: ≥ 95 % within 25 cp, none beyond max(25, min(75, ⌊1.5 × the larger measured maximum⌋)) cp, 0 sign changes.
- Safety as above. `G6` "≥ base" and `NFR-008` are the build's gates, not read here.
