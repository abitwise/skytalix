---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-105
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-105-qe-hop-detector.md
ref: .grugops/context/ticket-to-pr-ABC-105/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-105-qe-hop-integrity
base: main @ d64f6d73
---

# Subtask: deliver `ABC-105`. Build `tools/grugops/qe-hop-integrity.js`, the QE-hop completeness check on the record.

M (3), P2, DoR 10/10 (amended 2026-10-12 by `bapm-amend-ABC-105`, merged `70aae365`). The ticket page is the contract — read it whole, including § Scope 1–5, A1–A9, Test notes 1–5. Prior evidence: QE's re-check (`.grugops/context/qe-recheck-ABC-105/notes/`) and BA/PM's re-measurements (`.grugops/context/bapm-amend-ABC-105/notes/`). The precedent contract is `tools/grugops/test-skip-integrity.js` (exit 0/1/2, `--json`, builtins only).

Deliverables: `tools/grugops/qe-hop-integrity.js`; the committed cutover snapshot (38 ids from `git show 9998a544:plans/board.md` `## Done`, written once, never regenerated); `tools/grugops/qe-hop-integrity.test.ts` (ONE test file, 0 spawns, the § Scope 5 seam: exported `parseDone`, `coverage`, `main(argv,{snapshotIds?})`); the paragraph in `memory-bank/40-contributing.md` § Conventions (A7).
- **A2, A3, A9 against the real notes on disk** (Test note 1). **Every exit-1 criterion shown 0 → 1** on one controlled change (Test note 2), via the in-memory snapshot. Snapshot pinned (Test note 5).
- **A4 at your build tip:** run `--sweep` on `main` @ d64f6d73 and record every count line and every finding by id. The page expects 132/38/77/2/15 at `a37a4e12`; `ABC-105`'s own Done move has not happened, and `qe-recheck-ABC-105` now covers ABC-105 (QE-105-g). If your number differs from the page, state it and why — never force it. Hand-count the same rule and show they agree.
- **No `--force/--skip/--allow/--snapshot` flag** (Test note 3). Never execute anything read; never follow a symlink out of `.grugops/context/`. The tool writes nothing.
- **A7:** do NOT edit `AGENTS.md` (the Scribe does the pointer after merge, if the bytes can be freed). `wc -c AGENTS.md` must still read 24,545.

## Fences
Allowed paths: the tool, its test, the snapshot file (place it under `tools/grugops/` unless the page names a path), `memory-bank/40-contributing.md`, plus your notes/trace row/§ Delivery. **0 files under `src/`** (A8). If `tsconfig.json`/`biome.json` includes need a change for the new `.test.ts` to be linted/typechecked, say so first in your notes and keep the change minimal; check how `test-skip-integrity` is covered today. Never merge or push. Do not touch `plans/board.md` or `AGENTS.md`. Work in your OWN worktree (`git worktree add ../wt-ticket-to-pr-ABC-105 -b grugops/ABC-105-qe-hop-integrity main`), `node_modules` symlinked in only. No `update-ref` on another branch, no `--force`, `-D`, `reset --hard`. End each commit with a `Co-Authored-By:` trailer naming the model you actually are. `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. Gates before your last commit: `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, `.test-results/last-run.json` success:true, skip count 0 (`node tools/grugops/test-skip-integrity.js --skip-count 0`). You are the only hop running, but take NO timing readings — QE reads the N8-LANE narrow-set cost. Report the test file's test count. Publish typed notes per Workflow 16 under `ref:`, a trace row at the END of `plans/traceability.md`, § Delivery on the ticket page. Queue: `mkdir .grugops/queue/claimed/ticket-to-pr-ABC-105`, then at the end write FLAT files `.grugops/queue/done/ticket-to-pr-ABC-105.md` and `.grugops/queue/done/ticket-to-pr-ABC-105.claim.md`; leave both uncommitted. Report: branch tip, gates, each criterion A1–A9 PASS/FAIL with its reading, the full `--sweep` output, the UAT-waiver reading (`git diff --name-only main...HEAD | grep -v "\.test\.ts$" | grep "^src/"`), and the board move you recommend.
