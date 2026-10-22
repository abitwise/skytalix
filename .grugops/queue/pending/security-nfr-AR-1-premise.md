---
subtask: security-nfr-AR-1-premise
role: security-nfr
ref: .grugops/context/security-nfr-AR-1-premise/
inputs: Orchestrator …1b62e80b; RM …eb1d1cdf (drift), …130fb9a3, …d1d9ec04 (task rm-restate-AR-1); AR-1 record …901f43b6 (rm-ABC-158); owner set …193e08fb; ABC-168 (merged 513c0211), ABC-056 (P1 trigger: a bin); QE …feb20104 (0 sockets)
width: 2 (beside bapm-rule-QE-198)
---

# Re-read AR-1's premise now that `bin` → `dist/uci.js` and `dist/` exist

## Do
- On a fresh clone of `main` @ `6ccbcc3e` (scratch `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sec-ar1/`), run `npm ci --ignore-scripts`, then re-run `…901f43b6`'s checks 1–7. Widen them where the `bin` and `dist/` make them blind: `dist/` imports, every `scripts.*` entry (not only `chess`), `files`/`bin`, and what `npm pack --dry-run` would ship.
- Rule whether AR-1's reason still holds: no flagged package (nanoid, postcss, source-map-js) is reachable from any shipped or runtime path. Rule each pair's severity in context.
- Publish a revised premise check table and reason (for the Release Manager to adopt), with each check's expected reading and the command spelled out.
- Decide whether ABC-056's P1 `bin` trigger fires. If it does, say what it requires.
- **STOP condition:** if any pair is HIGH in context (reachable from a shipped path), do not accept it. Publish a `finding` and stop: that acceptance is the owner's.

## Fences
- Records only. Work on `grugops/security-nfr-AR-1-premise` (worktree `../wt-security-nfr-AR-1-premise` from `main`). No edits to `src/`, `tools/`, `package*.json`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Never run npm in main's checkout. No timing runs. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sec-ar1/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `security-nfr-AR-1-premise`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief, then move it to `done/`.
