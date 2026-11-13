---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-13T04:54:05Z
subtask: qe-ABC-321
role: qe-e2e
ref: .grugops/context/qe-ABC-321/
branch: new grugops/qe-ABC-321 from main
width: stage C only — read L5 night 2 against PREREG …1d9e9a62. No game, no re-run, no engine start.
---
# ABC-321: QE stage C — read L5 night 2
Read the cut note `.grugops/context/orch-2026-10-30a/notes/20261112T224805Z-orchestrator-decision-b354e881.md`, the PREREG `.grugops/context/qe-ABC-320/notes/20261111T222707Z-qe-e2e-decision-1d9e9a62.md`, and night 1's stage C (`qe-ABC-320` notes `…63e4517c` and `…b1a03872`, the brief `.grugops/queue/done/qe-ABC-320.md`). Reuse qe-ABC-320's `raw/redact.sh` and the sealed `raw/scripts/` as they are.
- **The run:** `night.sh 2280 31 <scratch>/l5-e2280-n2 <repo>`, launched by the orchestrator under the host lock on W …b354e881. Start 2026-11-12T22:48:44Z, exit 0 at 2026-11-13T04:53:35Z (el 21 891 s): 5 clean chunks, 50 games, openings 31–55; the guard refused chunk 56; next start 56. Console `<scratch>/l5-n2.console`. A durable copy of both nights is in `<durable>/skytalix-ratings/`.
- **Read night 2** exactly as night 1 was read: every validity line, the night's own pooled figure, latency, FL by class and count only (SHARED label if it applies), and the walls against the estimate.
- **Then pool nights 1 and 2** with one `rsum` over the 11 chunk dirs (openings 1–55). The orchestrator's own run of that gave 68/40/2, 62.7 %, 2 370.4 ± 67.4; re-derive it, don't trust it. Report it as the interim (110 games, not L5's figure) and apply the band probe as sealed.
- Commit redacted records under `raw/out/l5-e2280-n2/`. Keep the raw dirs. Publish an observation and a verdict note, or commit their bodies if you have no note tool. Add a `## Stage C` block here and move the brief and claim to done.
Every run goes as `flock <scratch>/host-test.lock <cmd>`. Records carry placeholders only. Never kill foreign processes. No src/, README, CHANGELOG, ADR, EPIC or board edit. Run records-path-check `--base main` before each commit. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".
