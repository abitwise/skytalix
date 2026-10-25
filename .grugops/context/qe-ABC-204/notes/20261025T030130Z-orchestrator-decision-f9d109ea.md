---
id: 20261025T030130Z-orchestrator-decision-f9d109ea
kind: decision
by: orchestrator
at: 2026-10-25T03:01:30Z
verified_by: 
confidence: medium
refs:
  - ABC-204
  - ABC-205
  - ABC-216
  - ABC-217
  - EPIC-008
  - M1
  - QE-204-a
  - QE-204-b
  - QE-204-d
  - qe-ABC-204/…b5f4d5a1
  - owner-word-2026-10-24/…4c3f7639
  - owner-delegation-2026-10-22/…5aaf7cec
supersedes: 
seal: sha256:77649ec830a9d015a21e254fccb6b352269580eb825983bb3336d1dfa58f8c94
---

# ABC-204 QE accepted; A5 UNRESOLVED ruled final and accepted; artifact fix before merge; 216/217 pulled

- **QE PASS_WITH_GAPS accepted** (`…b5f4d5a1`, merge `e546e124`, tip `16c51d1c`). **M1 baseline R = 2 061.3 ± 50.3 at E = 1 910 (frozen)**; 200/200 games, 0 faults, 0 overlap. B = 1 500 ms for D readings. UAT signed by QE (waiver: 0 production lines).
- **A5 (A/A interval contains 0): UNRESOLVED is FINAL under `…4c3f7639` — not re-run. Accepted as risk LOW (owner: Orchestrator).** The battery switch stopped game 100 of 100; the 99 finished games give X = +17.6 ± 47.4 by the ported `elo.cpp` (port matched ABC-202's tool line exactly), and the 57 overlap-free games give 0.0 ± 61.5. One game moves X by far less than the 30-point margin to the interval edge, so the side-bias claim stands in substance. B is unaffected (100-game median lies in [328.5, 330] s either way).
- **QE-204-b MEDIUM — required fix before merge:** `artifacts.txt` hashes `dist/uci.js` only, so two different engines print equal hashes. It would blind ABC-205's D reading. Fix on the ABC-204 line (per-file `dist/` manifest). **QE-204-a LOW** (symlinked out dir passes the guard) rides the same SE hop. Short QE re-check, no readings; the readings stand (the fix changes recording, not play).
- **QE-204-c/-e/-f/-g INFO:** closed; -d (go→bestmove gaps up to 3 206 ms, outside the engine's search) is an observation for Security/NFR's next NFR-004 catalog hop; no bound moves.
- **No alone run is active now**, so normal hops resume: `se-fix-ABC-204`, `ticket-to-pr-ABC-216` (README; outline shown to the owner, no changes asked), `ticket-to-pr-ABC-217`. Width 3/3. ABC-205 QE + G6 + D (alone) follows ABC-204 Done.
- **Board:** ABC-204 stays In Review (fix loop). ABC-216, ABC-217 Ready → In Development (2/3).
