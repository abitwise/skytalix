# arch-post-269: `ADR-0064` is **IN FORCE on `main` since 2026-11-03**, at `ABC-269`'s merge `54dee3f2`, on QE's PASS_WITH_GAPS `…eff2fe64`. QE's readings are recorded in its status: `G2` 1.0373 ×, B8 C2′ 57.0 / 100 (+49.0 ± 59.5 Elo, the interval crosses 0), S′ 7.0 / 10 at E 1 810, Levels 57 / 57. `QE-269-f` (LOW) is answered in `ADR-0067` decision 8: A5's PREREG states the session spread ahead of the reading, and the bar stays 1.0500. `QE-269-g` (INFO) is fixed as wording: "odd rounds" means rounds 2, 4 and 6 counted from 1. No bar moved

Architect/Design, task `arch-post-269`, records only, on `grugops/arch-post-269` from `main` `128e3c6c`. Nothing was run. Inputs: `qe-ABC-269`'s seven notes (PREREG `…21cd76df`, `G2` `…cebf49fe`, verdict `…eff2fe64`, B8 `…2c51ee30`, re-read `…3fb121de`, B5 / B7 `…48b34063`, gaps `…9ba289c2`); merge commit `54dee3f2` (2026-11-03T12:25:48Z); the Orchestrator's board line of 2026-11-03 (post-merge `npm test` 2 566 / 2 566); `arch-ABC-269-F3`'s PREREG `…e36ee7ca`; `se-ABC-269` `raw/scripts/g2b.ts` lines 16–17.

## 1. `ADR-0064` status: IN FORCE
- A new top status block in the `ADR-0061` pattern. The earlier "accepted, not in force" block is kept below it, marked "Earlier status, kept".
- Recorded from QE's notes, nothing re-read. B6 `G2` R = (1.0186 + 1.0560) / 2 = 1.0373, MET, with both controls valid. B5: 1 flip in 2 986, 17 cp. B7: depth 9 / 10, medians equal base. B8: C2′ 57.0 / 100 against `01a67c5d`, 0 time losses; S′ 7/3/0 at E 1 810; Levels 57 / 57. B0 11 / 11 exact.
- "What 57.0 means": a point estimate ≥ 0, not a proven gain (`QE-269-i`).
- What follows: `ABC-274`'s base is `main` `54dee3f2` with C1 in it. The S′ pool at E 1 810 opens. R1's window opens (the control is ruled in this task's R1 decision). P1 re-opens only on a named premise.
- Four decision-log rows were added: `se-ABC-269-cut`, `qe-ABC-269`, the merge, and this task.

## 2. `QE-269-f` (LOW): the `G2` margin is about one session's spread
- Written into `ADR-0067` decision 8 as a dated line, with a pointer from F8's row. A5's PREREG is sealed by QE before anyone times `ABC-274`, and it states:
  1. the bar and the statistic, unchanged: the mean of two session ratios ≤ 1.0500, unrounded, with no third session;
  2. the arms: H is `ABC-274`'s shipped tapered entry, B is the pre-ticket head `54dee3f2`, and C is a copy of B, all called as `ev(position, phase)`, with `58fa3eb4` reported;
  3. the control void band [0.970, 1.030], with one re-run;
  4. **the spread, stated ahead as a report:** each r_s, |r₁ − r₂|, and each arm's per-round min–max, against the reference spread 0.037. If |R − 1.05| ≤ 0.037 the verdict line adds "within one session spread", and the label grades nothing;
  5. the round order in words.
- **Rejected:** more sessions, a median statistic, or a margin under 1.05. Each would change `ADR-0031` d3's method or the bar, and the brief and F8 forbid both. The packed form's forecast stays `UNKNOWN - verify`.

## 3. `QE-269-g` (INFO): the reversal parity
- `g2b.ts` reverses on `r % 2` with `r` counted from 0, which is rounds 2, 4 and 6 counted from 1. Round 1, the dropped warm-up, runs the listed order. QE ran it that way.
- The sealed PREREG `…e36ee7ca` keeps its text. A dated wording line sits under `ADR-0064`'s F3 block "The one reading" and in `ADR-0067` d8's A5 item 5.
