---
id: 20261026T005347Z-orchestrator-decision-5c59d85e
kind: decision
by: orchestrator
at: 2026-10-26T00:53:47Z
verified_by: 
confidence: high
refs:
  - ABC-207
  - EPIC-008
  - QE-207-a
  - QE-207-b
  - QE-207-c
  - QE-207-f
  - QE-207-g
  - .grugops/context/qe-ABC-207/
supersedes: 
seal: sha256:d3e41c5d6e6c0c04e29fe60a4900efb6004e4ce6139e398f12bf22aecd59a847
---

# ABC-207 FAIL accepted: not merged; S1 call routed to BA/PM

**Verdict accepted as-is.** qe-ABC-207 FAIL at 3d39c8ff (…cc744e8c; failed-attempt …243de4b1):
- A1–A4 MET: G2 660.7/661.7 vs 639.8/641.0 ns; G6 MET, kiwipete 7 = 7 and position-6 8 = 8.
- A5 NOT MET under S1:
  - d1 NEUTRAL −15.6 ± 22.8 (81/99/220), so the one extension ran.
  - d2 NEUTRAL −20.9 ± 23.8 (86/110/204).
  - Pooled over 800 games, 167/209/424: −18.26 ± 16.49, LOSS.
  - The overlap-free figure is still LOSS: −18.1 ± 16.8 over 770 games.
- This was ABC-207's one reading, final under …4c3f7639. 0 faults. Battery for 5 min, logged, not a stop.
- UAT is not signed.

**Not merged.** The code stays on grugops/ABC-207 @ 5477df21 and grugops/qe-ABC-207 @ ab39b73f. Never merge either into main. Only the records come to main, by path: .grugops/context/qe-ABC-207/ and .grugops/context/ticket-to-pr-ABC-207/. ABC-207: In Review → back to BA/PM (Backlog, blocked on the S1 call). In Review 0/3.

**Routed `bapm-s1-ABC-207`** (records only): BA/PM makes S1's re-tune-or-close call, using QE-207-a, -b, -c and -f as input.
- **Constraint:** a re-tune round needs a new real-clock G6 + D reading of 6–12 h. That is a second reading for this ticket, beyond the owner's one-reading-per-ticket scope reading (…4c3f7639).
- So the delivery default is **close unmerged under S1**, as with ABC-205.
- If BA/PM recommends a re-tune, it goes to the owner as a question, not as a delivery call.

**Backlog notes:**
- QE-207-g (process INFO): an ALONE claim outlives `queue.stale_ttl_minutes` (30). No sweep ran during it. A future fix is a kit or config matter, not done here.
- QE INFO: qe-ABC-215's raw has no *.log files (gitignored). They are cited in its notes; ABC-207 renamed its logs to *.log.txt.
