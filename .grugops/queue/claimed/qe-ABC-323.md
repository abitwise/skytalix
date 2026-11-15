---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-15T01:48:30Z
subtask: qe-ABC-323
role: qe-e2e
ref: .grugops/context/qe-ABC-323/
branch: new grugops/qe-ABC-323 from main
width: stage C only — read L5 night 4 and the full 200-game reading against PREREG …1d9e9a62. No game, no re-run, no engine start.
---
# ABC-323: QE stage C — read L5 night 4 and the full L5 reading
Read the cut note `.grugops/context/orch-2026-10-30a/notes/20261114T222840Z-orchestrator-decision-481f29ee.md`, the PREREG `.grugops/context/qe-ABC-320/notes/20261111T222707Z-qe-e2e-decision-1d9e9a62.md`, and night 3's stage C (the brief `.grugops/queue/done/qe-ABC-322.md` and notes `qe-ABC-322/…3809c084`, `…a42953f6`). Reuse qe-ABC-320's `raw/redact.sh` and the sealed `raw/scripts/` as they are.
- **The run:** `night.sh 2280 86 <scratch>/l5-e2280-n4 <repo>`, launched under the host lock on W …481f29ee by an orchestrator waiter (`<scratch>/n4-waiter.sh`, log `<scratch>/n4-waiter.log`) on its first quiet check, 30 s after a check that saw foreign vitest 2. Start 2026-11-14T22:28:47Z, exit 0 at 2026-11-15T01:46:52Z (el 11 885 s): 3 clean chunks, 30 games, openings 86–100; next start 101. Console `<scratch>/l5-n4.console`. A durable copy of nights 1–4 is in `<durable>/skytalix-ratings/`.
- **Read night 4** exactly as nights 1–3 were read, including FL by class and count only (the owner said another session was running just before launch; report any foreign load in the window).
- **Then the full reading:** one `rsum` over all 20 chunk dirs (openings 1–100). The orchestrator's run over the durable copies gave 133/60/7, 68.2 %, 2 412.9 ± 51.1; re-derive it. This is L5's figure if every PREREG line holds; apply the band rule once, as sealed, and state the PREREG's final-reading lines (colour split, cluster interval, L5 − L4, the Stockfish time-scale caveat). State the figure and wording the README and CHANGELOG should carry, as a recommendation only.
- Commit redacted records under `raw/out/l5-e2280-n4/` and `raw/out/l5-full/`. Keep the raw dirs. Commit an observation and a verdict note body. Add a `## Stage C` block here and move the brief and claim to done.
Every run goes as `flock <scratch>/host-test.lock <cmd>`. Records carry placeholders only. Never kill foreign processes. No src/, README, CHANGELOG, ADR, EPIC or board edit. Run records-path-check `--base main` before each commit. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".
