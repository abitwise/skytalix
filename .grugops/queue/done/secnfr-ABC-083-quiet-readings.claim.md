by: security-nfr (claude-opus-5-5)
at: 2026-10-11T13:47:05Z
task: secnfr-ABC-083-quiet-readings

completed_at: 2026-10-11T14:11:32Z
result: Quiet window, width 1. A9/A7 MET: depth 7 on 24/24 runs (base 5ed308a8 vs branch 09b8c960, load1 1.90-2.34, thermal 0); nodes to depth 7 kiwipete 610 179 -> 566 233, position-6 462 871 -> 644 469; margins kiwipete 1.126-1.130x, position-6 1.056-1.066x. ADR-0031 d5 does NOT fire (547b5155 stands). N8-LANE NOT MET at k = 3: +1.005 s CPU (+0.910..+1.060, twin R 0.110 s, 17-file narrow set); ~0.8 s second order, ~0.15 s new file; no required fix. Proposed LOW risks for the owner: AR-N8LANE-083, AR-NFR005-083. NFR-008 wall 7.63 s. Notes …1643be6c (depth), …4583f42c (lane), …8ff62fd0 (rulings). Branch grugops/ABC-083-king-safety-mobility. Not merged, not pushed, no board move.
commit: 67c189b9
