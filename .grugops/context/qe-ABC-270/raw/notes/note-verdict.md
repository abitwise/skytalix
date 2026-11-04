# qe-ABC-270 verdict: **PASS_WITH_GAPS** (none blocking; two LOW, two INFO). K0 7 / 7 + 4 doors, cross-build 0 / 9 120; K1 (a)–(e) met (QE's 7 frozen pairs exactly 3 × per king, 0 misses over 184 132 positions against the stated rule, twins green and biting, FENs literal); K2 0 re-pins, all lanes green; K3 `G2` R = 0.9911 MET; K4 `G6` MET (medians 9 / 9, 10 / 10, every run ≥ 9). **The QE verdict signs UAT for `ABC-270`**; the merge is human

QE/E2E, task `qe-ABC-270`, on `grugops/ABC-270` (code `795a6b61`, `src/` `0f393c18`) against `main` `4b9c5357` (`src/` `4cb84035`, the cut's tree). Not pushed, not merged. Every graded row was read by QE this hop; K3 and K4 under PREREG `…f8ab73a7` (sealed and committed `fb920c14` before any QE timing). Cited, not restated: ticket `ABC-270` K0–K4 and falsifiers, `ADR-0068` d1–d6 and F1–F5.

| row | bar | QE reading | grade |
|---|---|---|---|
| K0 | 7 counts exact; older doors at pre-ticket counts | 7 / 7 exact on H and B; 4 door counts equal; cross-build 0 / 9 120 | **MET** |
| K1 (a) | mirror, `Object.is`, 0 mismatches | 0 / 368 264 at non-zero queen-on values; 0 / 62 055 at 0; build rows green | **MET** |
| K1 (b) | `evaluate` `Object.is` pre-ticket on the frozen corpora | 0 / 4 840 290 over every entry and phase 0–30; build's frozen-value rows green | **MET** |
| K1 (c) | ≥ 6 frozen pairs, exactly 3 × per king in each half at 2 × base; (b) at 0 | 7 / 7 pairs exactly 3 × in mg and eg, other king equal, QC8 still, nets equal; 0 misses over 184 132 positions (seam and hot path) | **MET** |
| K1 (d) | range row reads the new maxima; int16 holds | green; 15 910 / 17 510 unchanged at 0 | **MET** |
| K1 (e) | twins green and red with term zeroed; FENs literal | green on B and H; red zeroed; 4 / 4 literal | **MET** |
| source row | flags from the walk's non-pawn branch; no new per-piece op | read and green | **MET** |
| K2 | 0 re-pins in every lane | 0; `npm test` 2 604 / 2 604; 14 deep lanes as expected | **MET** |
| K3 | `G2` ≤ 1.05 × | R = 0.9911 (r 0.9932 / 0.9889; c 0.9947 / 0.9926) | **MET** |
| K4 | medians ≥ base; every run ≥ 6 | 9 / 9, 10 / 10; min 9; 0 WARN | **MET** |
| S2 nps | report | H / B 1.0054–1.0194 (report) | reported |
| N8-LANE | report | 9.46 s → 9.34 s | reported |

- **Falsifiers:** F1 (mismatch, `Object.is` miss, re-pin) does not fire; F2 (`G2`, `G6`) does not fire; F5 (twin not red zeroed or not green on `main`) does not fire. F3 / F4 are `ABC-239`'s.
- **Mutants:** 7 / 7 QE mutants killed by QE's rule-based read and by the build's own file (plus the Engineer's 6).
- **Gaps** (gaps note): QE-270-d LOW (process: the Engineer moved the board); QE-270-e LOW (forward: the bite rows zero only the base pair and turn red once `ABC-239` frees a queen-on mg); QE-270-f INFO (Architect: `kingExposureForTest`'s form, `UNKNOWN - verify`; QE's view: keep it); QE-270-g INFO (reports not taken in full). None blocks the merge.
- **UAT:** owed (production lines, test note 5). Under the owner's delegation (`…5aaf7cec` item 2) this QE verdict signs it: **UAT signed, PASS_WITH_GAPS.**
- **Next:** the Orchestrator's board move (In Review → UAT signed) and the human merge. `ABC-239`'s fit of record is taken on a `main` that contains this build (`ADR-0068` d7); QE-270-e goes with that work.
