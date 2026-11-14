---
id: 20261114T222840Z-orchestrator-decision-481f29ee
kind: decision
by: orchestrator
at: 2026-11-14T22:28:40Z
verified_by: 
confidence: high
refs:
  - ABC-323
  - ABC-322
  - qe-ABC-320/20261111T222707Z-qe-e2e-decision-1d9e9a62
  - qe-ABC-322/20261114T044851Z-qe-e2e-decision-a42953f6
  - .grugops/context/qe-ABC-320/raw/scripts/night.sh
  - .grugops/context/qe-ABC-320/raw/scripts/hostcheck.sh
supersedes: 
seal: sha256:65743487adf189b06459cea5debadc7c3846ea6740e4a74b8497c4e4a45e1464
---

Owner, 2026-11-14 at about 22:28Z: "push main, then start night 4 after machine is quiet, currently one session is running, check after every 10 minutes until machine is quiet and then start tests". Read as his W (held host) for night 4, conditional on the host going quiet. This cuts ABC-323: L5 night 4, `night.sh 2280 86 <new out-root> <repo>` on PREREG …1d9e9a62 exactly as sealed, from qe-ABC-320's worktree (tools/ 2ae53ab1, src/ b668b153, clean; `sha256sum -c` OK at 22:28:16Z). Main pushed to 1603b292 first, on the owner's word.

Quiet, for the launch: the sealed `hostcheck.sh` line shows foreign vitest, cutechess-cli and stockfish all 0 (gate 3's own WAIT condition), load1 below 1.00, and the host lock is free. At 22:28:16Z it was not quiet (foreign vitest 2, load1 0.83). An orchestrator waiter re-checks every 600 s and launches on the first quiet check; each check is logged by class and count only. Night.sh's own gate 3 re-checks at launch; if it WAITs (exit 4) the waiter stops and reports, with no game played.

Expected: 3 chunks, openings 86–100, about 3 h 22 min (worst 7 h), ending on next start 101. The read follows in a QE stage C hop that pools all 20 chunks (200 games); README and CHANGELOG follow that.
