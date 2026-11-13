---
id: 20261113T215940Z-orchestrator-decision-dbb1a3ae
kind: decision
by: orchestrator
at: 2026-11-13T21:59:40Z
verified_by: 
confidence: high
refs:
  - ABC-322
  - ABC-321
  - ABC-320
  - qe-ABC-320/20261111T222707Z-qe-e2e-decision-1d9e9a62
  - qe-ABC-321/note-c-verdict …0a088790
  - .grugops/context/qe-ABC-320/raw/scripts/night.sh
supersedes: 
seal: sha256:7e15288618b3101996b383f7344a974da4588e30ab4906b95223b10dfbabece2
---

Owner, 2026-11-13 at about 21:59Z: "start next nightly game series for 8 hours". Read as his W (held host) for one 8 h window tonight and his go for L5 night 3. This cuts ABC-322: L5 night 3, run on PREREG …1d9e9a62 exactly as sealed (E 2280, first start 56), on the sealed scripts (`sha256sum -c` OK at 21:59:24Z), from the qe-ABC-320 worktree whose tools/ is 2ae53ab1 and src/ b668b153 (gate 2 enforces both; worktree clean).

The window equals the sealed 8 h cap; the script is not edited. Nights 1–2 ran 63–73 min a chunk, so expect 5–6 chunks (openings 56–80/85) and an end near 6–6.5 h. Pre-launch host: load1 0.22, Tctl 32.9 °C, foreign vitest/cutechess-cli/stockfish 0, lock free. If the owner needs the host back first, the orchestrator stops the session on his word: the running chunk is not clean and is not pooled; clean chunks before it stand.

Out-root: a new dir under scratch, copied to the durable `skytalix-ratings/` after the run. The read follows in a QE stage C hop, pooling nights 1–3. README and CHANGELOG wait for all 200 games.
