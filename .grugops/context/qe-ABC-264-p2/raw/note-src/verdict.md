# qe-ABC-264-p2 verdict: FAIL. A6 NOT MET: the 100-game read at 100 ms scored 44.0 / 100 (W/D/L 30/28/42, Elo -41.9 +/- 58.5), below the GAIN bar of 50.0. Smoke MET (7.0 / 10), Levels MET (57 / 57), gates green

QE/E2E, task `qe-ABC-264-p2`. Read by the rule fixed in the PREREG (`…a63b4c37`, committed `e32b4745` before any result was read). Candidate `4d1c0616`, base `0b73f51d`.

- **A6 per-change read: NOT MET.**
  - 100 of 100 games complete; 0 faults; 0 losses on time for either side.
  - Score **44.0 / 100 (0.440) < 50.0** (GAIN, `ADR-0056` C2′, ticket `A6`).
  - The ticket says a miss is NOT MET and is not re-played. It was not re-played.
- **The harness prints `state: NEUTRAL`.** That is its >= 43.0 band. It does **not** apply here:
  - The owner's answer C (`…81ae2db4`) allows the NEUTRAL bar only for changes **invisible at 100 ms**.
  - `ADR-0059` d10 states reverse futility fires at 100 ms.
  - Part 1 measured it firing there (`qe-ABC-264` firing-rate observation: 0.32-4.82 % of nodes).
  - So the ticket's own GAIN bar governs. See gap QE-264-p2-b.
- **Smoke S′: MET.** 7.0 / 10 against Stockfish 19 at E 1 650 (bar 3.0). 10 of 10 complete, 0 faults, 0 losses on time.
- **Levels deep lane: MET.** rc 0; 57 passed, 0 failed, 0 skipped (57 expected).
- **Gates: green.** `npm test` once: 2 404 / 2 404, 64 files, 0 skipped. Lint, typecheck and build each exit 0.
- **Falsifier disposition (ticket; `ADR-0059` F5):** A6 NOT MET means `ABC-264` is **not merged**, and `ADR-0059` reads "accepted, not in force". The dated line is the Architect's.
  - This is not a defect: A1-A4 were MET in part 1, and nothing here is red against the code.
  - It does not go back to the Software Engineer as a fix.
- **Open gaps:**
  - QE-264-p2-a HIGH: A6 NOT MET, blocks the merge.
  - QE-264-p2-b INFO: the harness label.
  - QE-264-p2-c INFO: colour asymmetry.
  - QE-264-b LOW (records, part 1) is carried open.
- **UAT is not signed.** The QE verdict is FAIL.
