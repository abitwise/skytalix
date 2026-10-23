---
subtask: bapm-cut-EPIC-007-M1-M8a
role: ba-pm
ticket: plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md
ref: .grugops/context/bapm-cut-EPIC-007-M1-M8a/
width: 1 (records only)
---

# Cut the XS agent-run QE reading ticket for EPIC-007 M1 and M8(a)

## Do
- The trigger you set (`…b5f65536`) fired: the owner built `cutechess-cli` 1.5.1 (`…7ea41eea`). It is not on PATH; the ticket pins the absolute path and version.
- Cut one ticket page (next free ABC id) that reads M1 and M8(a) exactly as the EPIC-007 measures state, agent-run by QE, no human gate, raw files kept under the ticket's context. Pin the flag spellings the measures leave `UNKNOWN - verify` from the upstream manual in the checkout (`docs/cutechess-cli.6.txt`), or leave them to QE's first run if the manual does not settle them.
- Say what the artifact under test is (`npm run build` → `dist/uci.js` at a named `main` sha) and how cutechess invokes it (`cmd=`/`dir=`, node).
- Host preconditions: rule whether the time-safety reading (M1 `tc=60+1`, 0 time forfeits) needs AC and a quiet host, and estimate wall time. If it needs the owner's quiet window, say so in the page.
- Run the Definition of Ready; size and prioritise. No production code is expected; if the reading could fail and need a fix, say how a failure routes.
- Add one dated line on the EPIC-007 page pointing to the new ticket.

## Fences
- Work on `grugops/bapm-cut-EPIC-007-M1-M8a` (worktree `../wt-bapm-cut-EPIC-007-M1-M8a` from `main`). Only the new ticket page, the EPIC-007 page and your notes. You may run `cutechess-cli --version` / `--help` read-only; no games. No `src/`, `package*.json`, `memory-bank/50-decisions/`, `plans/board.md`, `plans/traceability.md`. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm-m1m8a/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `bapm-cut-EPIC-007-M1-M8a`), `at` from `date -u`, with a `kind: decision`. Write `## Result` (with the board card line for the Orchestrator) plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
