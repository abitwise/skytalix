# arch-ABC-289 decisions: `ADR-0074` is written PROPOSED, **premise MET on `main`**. Form D200b is chosen, the only form to pass both gates: out of check, skip a capture when stand pat + victim + 200 ≤ alpha, and raise `best` to that bound. It amends `ADR-0024` d4 on the owner's acceptance. Owed lines and the owner question are below

Architect/Design, task `arch-ABC-289`, records only, on `grugops/arch-ABC-289` from `main` `0cc9afd1`. PREREG `…174760a3` was sealed and committed (`9e07dae4`) before any measured run. The readings are in this task's observation note.

## 1. The verdict, by the sealed rule
- **Pay gate:** all six forms pass, so there is a trim over `main`: `ABC-289` F2 does not fire.
- **Safety gate:** only D200b passes. D300, D200, D100, D200c and D200e all exceed 150 cp of drift in `search()` (D100 also reads 87.70 %), and D300 also fails `G1` (53 / 58, one newly missed).
- **Choice rule:** D200b is the only form left, so the tie-break never applied. Reach 6.868 → 7.147 (+0.279). d8 0.6362 / 0.8263 and 0.6484 / 0.8201.
- **The premise, plainly:** 43.73 % of the captures searched out of check are ones the rule would skip and `seePruning` does not, and 99.52 % of those are refuted. Q1 did not use up this trim.

## 2. The design of record (`ADR-0074` decisions 1–13)
- **The rule:** tested in the loop before `isLosingCapture`, on the stand-pat branch, with current alpha; `continue`, not `break`.
- **The margin:** 200 cp, a private constant.
- **The return is the point:** `best = max(best, bound)`. D200 and D200b differ only here, and read 192 cp against 12 cp. Item 6's question is answered by measurement: the skipped capture's bound, not the stand pat.
- **The order is value-relevant,** because of the bound: delta first, as measured.
- **Exclusions:** promotions only. No check exemption, no phase condition, no mate-band guard.
- **Seam:** `QuiescenceRules.deltaPruning?`, `RULES_DELTA_PRUNING`, switch `deltaPruning` in both recursions. Caller-built records do not opt in.
- **Doors:** `searchWithoutDeltaPruning`, `chooseMoveWithoutDeltaPruning`, the top rung. Every older door turns it off, `ABC-283`'s three and four included. `A6` +1, `A4` +1.
- **Bars:** d8 ≤ 0.88× ×4; reach ≥ door + 0.15 (7.018); drift ≥ 98 %, ≤ 30 cp, 0 sign changes; mate 0 both recursions; zugzwang 7 / 7; `G1` ≥ 54 / 58; `G6` ≥ base; `G2` by byte identity.
- **The read:** C2′ GAIN ≥ 50.0 / 100, S′ at E 1 810, the Levels deep lane. Firing at 100 ms: 48.25 % of captures reached, 185 / 190 rows, 65.9 % at ply 0, so not depth-gated.
- **Lanes:** no new test file. Default rows are hand-board units in `src/quiescence.test.ts`; anything ≥ 50 ms goes behind `SEARCH_DEEP=1`.

## 3. What is weak, stated
- **Checks.** 99.25 % of the rule's errors at margin 200 are checking captures, 485 mates among them. The mate rows are clean, but a check-exempt form with the bound was not pre-registered, so nothing here says what it would read.
- **Margin.** Only 200 was measured with the bound. D100 and D300 failed as stand-pat forms, which says nothing about them with the bound. Reading them now would be a new PREREG, and I recommend against it unless a read asks.
- **The cause of the drift is reasoned, not measured.** That the return value makes the difference is measured; the false-bound account of why is not.
- **The bars are tight by rule:** ≤ 30 cp and ≥ 98 % come from D200b's own 20 cp and 100 %. `ABC-301`'s fit may need a re-read.
- **Size of the gain.** +0.279 ply is a third of Q1's. C2′ cannot size it; `ADR-0056`'s +5–20 stays an estimate.

## 4. Flags for the Orchestrator
- **`ABC-289` test note 1 was not followed:** "QE freezes the re-measure's set before it runs". The brief routed no QE hop, so I ran without one. The sets are committed corpora named in the sealed PREREG (the 190, the 287, the seven zugzwang rows, `G1`'s 58), and I chose no rows. Line 3 of § 6 proposes the wording. If you want QE's freeze as written, the re-measure's standing is yours to rule on.
- **The lane budget:** `…f30bd604` does not name `ABC-289`. It needs a budget, and it would be a further claimant on the census of ruling 3.
- **Wording:** the brief says park on a miss, and F2 says closed as dropped. It did not arise.
- **`ADR-0056`** row Q2 is owed by the Architect; `arch-bundle-1` holds that file, so it waits.

## 5. Effort
**S, near its top end.** The rule is about 8 lines, and the switch and two doors are `ADR-0069`'s shape. The bulk is turning the switch off in every older door and the re-points. One SE hop and a QE hop with C2′. Size is BA/PM's to confirm.

## 6. Lines owed (not edited here; the fences forbid it)
**BA/PM, `ABC-289`:**
1. `adr:` reads "`ADR-0074` PROPOSED, premise met (`arch-ABC-289`); the owner accepts it (reading (b))". Hold 2 is cleared; F2 did not fire.
2. Scope 1: margin 200 cp, and "a skip raises the node's value to the skipped capture's bound". Exclusions: promotions only.
3. Test note 1: "The re-measure read committed corpora named in PREREG `…174760a3`", subject to § 4.
4. **DP0:** add the counts of `ADR-0074` d12, and every older door off, `ABC-283`'s included.
5. **DP1:** the rows of `ADR-0074` d10, (a)–(f).
6. **DP2:** drift ≥ 98 % within 25 cp, none beyond 30 cp, 0 sign changes; the mate floor in both recursions.
7. **DP3:** d8 ≤ 0.88× on each of the four; reach ≥ door + 0.15 (≥ 7.018 on 6.868).
8. **DP4:** intent **GAIN, ≥ 50.0 / 100**, firing 48.25 % at 47 000. The NEUTRAL line is struck.
9. Falsifiers: add `ADR-0074` F9 (the bound).
10. `NFR-008` line: the budget, when the Orchestrator sets it. `NFR-009`: 0 bytes.
11. Dependencies, § "One at a time": `ABC-282`, bundle 1 (`ADR-0074` § Consequences).
12. DoR row 10 and the DoR count. The board move is the Orchestrator's.

**BA/PM, `EPIC-011`:** § Phases row 3 (Q2): premise met, `ADR-0074` PROPOSED, +0.279 ply. § Tickets row for `ABC-289`. § Owner questions: add OQ-0074-1. § Dependencies: `ABC-289` one at a time with `ABC-282` and bundle 1.

**Architect, next records hop:**
- `ADR-0056` row Q2 and a dated D2 line: basis "pre-registered: D200b +0.279 ply, d8 0.64–0.83×"; after `arch-bundle-1` releases the file.
- `ADR-0024`: the § Status pointer and the d4 line, **at the owner's acceptance only** (`ADR-0074` d9).

## 7. Owner question (one): OQ-0074-1
**Accept `ADR-0074`?** It amends `ADR-0024` d4: delta pruning enters quiescence, with quiet checks still fenced. Recommendation: yes. The sealed rule met its premise and D200b's safety rows are clean. Under reading (b) the build may start on PROPOSED; it merges only on his acceptance and on its own read. Without his acceptance d4 stays as written, apart from the design opening he already gave.
