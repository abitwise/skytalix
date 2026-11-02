# qe-ABC-268 verdict (part 1): GAPS (QE-268-a/b/c, LOW, none blocking). A1-A4 MET with every count to the node, A3 (d) re-run clean (0 of 2 943), every part-1 gate green; not READY-FOR-A6 only because 5 of 8 QE plants survive the lanes

QE/E2E, task `qe-ABC-268`, by the PREREG rule (`…fae528bd`, sealed and committed before any graded or timed run). At `grugops/ABC-268` `df984484` against `main` `ca6e8506`. Part 1 only: the 100-game read, the Stockfish smoke and the Levels lane were not run (they wait on the owner's acceptance of `ADR-0061`).

- **A1 MET** (QE's own cross-build sample, 23 pairs, 0 differ, history pair non-vacuous 8 / 12; exports exactly +3 / +1).
- **A2 MET** (file reviewed against the page; QE plants 3 of 8 red: QP1, QP7, QP8).
- **A3 MET:** drift `search()` 100 % within 25 cp, max 10 cp; `chooseMove` 100 %, max 0; 0 sign flips; mate floor 0 / 189; zugzwang 7 / 7, no depth re-pinned.
- **A3 (d) MET, re-run independently:** 30 272 firing, 2 943 sampled (1 918 / 966 / 59), 0 flips, 0 ≥ 200 cp, door noise 0; the sample is byte-identical to the probe instrument's.
- **A4 MET:** 0.7958 / 0.7876 / 0.8295 / 0.8220, reach +0.279 (5.558 → 5.837); every head, door and reach count equals the probe's to the node. G6 MET.
- **Re-pointed `ABC-229` rows:** figures unchanged (1.019× / 1.000×; drift max 8 cp both), read on both trees.
- **Gates:** lint / typecheck / build 0; `npm test` 2 407 / 2 407 ×3; skips 0, integrity and inventory clean; G1 54 / 58 no NEWLY; G5 MET (max 4 001.3 ms); G6 MET (9 = 9, 10 = 10); G8 9.00 s; G9 empty; G11 same move ×5; 7 deep lanes green.
- **Verdict: GAPS (`QE-268-a`, `QE-268-b`, `QE-268-c`, all LOW).** The PREREG requires every plant red; QP2, QP3, QP4, QP5 and QP6 survive the lanes. None touches a bar or the shipped path as built. No FAIL condition holds.
- **For the Orchestrator:** the board move; routing the three LOW gaps to the Engineer (rows only; no production change needed); after the owner's word on `ADR-0061`, the part-2 hop (A6, the smoke, the Levels lane), which carries the UAT-signing verdict. The four INFO items (`QE-268-d…g`) need no action before A6.
