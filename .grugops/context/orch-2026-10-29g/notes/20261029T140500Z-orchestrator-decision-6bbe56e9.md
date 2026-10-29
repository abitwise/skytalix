---
id: 20261029T140500Z-orchestrator-decision-6bbe56e9
kind: decision
by: orchestrator
at: 2026-10-29T14:05:00Z
verified_by: 
confidence: high
refs:
  - qe-epic008-q4c
  - EPIC-008 Q4
  - EPIC-008 § D
  - orch-2026-10-29g/…21444ff1
  - orch-2026-10-29c/…d9513dc1
supersedes: 
seal: sha256:d4a7c828f4c868f2eaf42ad8979deb507bcb8b2340f494437f32f48b97fe4a22
---

# Owner go: Q4 (c) runs as a 100-game look, information only, width 1

**Owner (Olger Oeselg), 2026-10-29, in session:**
- "let's see how it goes" (in reply to the width-1 hold, after the cores context).
- "let's go with 100 games then, this speeds up progress and we get rough understanding."

**He was told before choosing:**
- The page defines a D reading as 400 games; anything shorter is not one and cannot count.
- The margin at 100 games is about ±47, against ±23 at 400. 100 games take about 4.5 h at width 1.
- The game count is fixed in PREREG, and the run plays to the end: no early stop.

**Recorded:**
- **GO** for `qe-epic008-q4c` with 100 games (`--rounds 50`), `--concurrency 1`, B = 1 500 ms, candidate main (src/data = b5c67ab7) against base `3497aad2`.
- **Information only:** M1 is not re-graded, and the result is not a D reading in the page's sense. QE reports X ± Y and the arithmetic state it would have, labelled "100-game look, not a D reading", plus its sign against R's −82.9 ± 73.8.
- This supersedes the brief's 400 games / `--rounds 200` and the ~18 h estimate.

**Still needed before spawn:** the cutechess-cli path for the env file, which goes outside the repo and is never recorded.
