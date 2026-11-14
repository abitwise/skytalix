---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-14T04:41:30Z
subtask: qe-ABC-322
role: qe-e2e
ref: .grugops/context/qe-ABC-322/
branch: new grugops/qe-ABC-322 from main
width: stage C only — read L5 night 3 against PREREG …1d9e9a62. No game, no re-run, no engine start.
---
# ABC-322: QE stage C — read L5 night 3
Read the cut note `.grugops/context/orch-2026-10-30a/notes/20261113T215940Z-orchestrator-decision-dbb1a3ae.md`, the PREREG `.grugops/context/qe-ABC-320/notes/20261111T222707Z-qe-e2e-decision-1d9e9a62.md`, and night 2's stage C (the brief `.grugops/queue/done/qe-ABC-321.md` and its notes). Reuse qe-ABC-320's `raw/redact.sh` and the sealed `raw/scripts/` as they are.
- **The run:** `night.sh 2280 56 <scratch>/l5-e2280-n3 <repo>`, launched by the orchestrator under the host lock on W …dbb1a3ae. Start 2026-11-13T21:59:44Z, exit 0 at 2026-11-14T04:40:38Z (el 24 054 s): 6 clean chunks, 60 games, openings 56–85; the guard refused chunk 86; next start 86. Console `<scratch>/l5-n3.console`. A durable copy of nights 1–3 is in `<durable>/skytalix-ratings/` (the orchestrator checked it with `diff -r`).
- **Read night 3** exactly as nights 1 and 2 were read: every validity line, the night's own pooled figure, latency, FL by class and count only (SHARED label if it applies), and the walls against the estimate.
- **Then pool nights 1–3** with one `rsum` over the 17 chunk dirs (openings 1–85). The orchestrator's own run over the durable copies gave 109/57/4, 65.3 %, 2 389.8 ± 54.6; re-derive it, don't trust it. Report it as the interim (170 games, not L5's figure) and apply the band probe as sealed. State what night 4 runs (`night.sh 2280 86`, 3 chunks) and its expected wall.
- Commit redacted records under `raw/out/l5-e2280-n3/`. Keep the raw dirs. Publish an observation and a verdict note, or commit their bodies if you have no note tool. Add a `## Stage C` block here and move the brief and claim to done.
Every run goes as `flock <scratch>/host-test.lock <cmd>`. Records carry placeholders only. Never kill foreign processes. No src/, README, CHANGELOG, ADR, EPIC or board edit. Run records-path-check `--base main` before each commit. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".
