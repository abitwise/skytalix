---
task: wave-2026-09-25
subtask: fix2-ABC-105
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-105-qe-hop-detector.md
ref: .grugops/context/fix2-ABC-105/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/fix2-ABC-105 (off QE3 tip 48a78f08, which contains qe2 db1cfb6c, fix cf353820, QE a0016dbb, SE 60415a8a)
---

# Subtask: bring `tools/grugops/qe-hop-integrity.test.ts` back under N8-LANE's 650 ms CPU without losing a single catch

QE3 (`.grugops/context/qe3-ABC-105-lane/notes/…15ca6e06`) read the narrow set at `db1cfb6c`: H − B **+0.690 s CPU** (interval +0.670..+0.700) — **NOT MET** at 650 ms. Its per-test breakdown (`probe/w3/h-last-run.json`): the 5 whole-tree reads of the real notes cost 499.5 of 538.3 ms — A4's three `--sweep` calls (lines ~149, ~157, ~173), A9's `--sweep` (~141), A3's unfiltered `readNotes` (~116). Everything else is ≤ 4.5 ms per test.

**Goal: at most 2 whole-tree reads of the real notes per file run** (target well under 650 ms; QE re-times). Prefer a test-only change: capture one plain `--sweep` result once (e.g. `beforeAll`/a lazy module-level value) and assert A4's text checks and A9's "lists ABC-073" on it; share one `readNotes(<real ctx>)` between A3's unfiltered check and anything else that needs all notes. If the `--json` and the all-Done-snapshot (`snapshotIds: parseDone(board)`) calls cannot be served without another read, you MAY add one more non-CLI seam option to `main` in the tool (like `root`/`snapshotIds`, e.g. pre-read notes), unreachable from argv — then state it in a decision note first, keep every other byte of the tool unchanged, and keep **at least one test running the real end-to-end `--sweep` read path with nothing injected**.

**No catch may be lost.** Re-run every recorded plant (QE's `qe-ABC-105/probe/plants.py`, QE2's `qe2-ABC-105/probe/plants2.py`, verbatim text in `fix-ABC-105/notes/…5c1e7a20`) in a scratch copy OUTSIDE the repo against the old file (`db1cfb6c`) and your new file: the red-test counts per plant must be ≥ the old file's for every plant (coverage()-only refs-only, full refs-only, exact refs, substring folder, observation kind, own ticket-to-pr folder, naive Done parse, silent 0 on missing board/snapshot, override flags, all three symlink levels). Table them. Every A1–A9 / Test note 1–5 assertion still present (moving it into a shared result is fine; dropping one is not). Count only the whole-tree reads, by instrumenting a scratch copy (e.g. count `readNotes` calls with no filter) — report before/after.

## Fences
Code changes: `tools/grugops/qe-hop-integrity.test.ts`, and only if needed the one seam option in `tools/grugops/qe-hop-integrity.js`. Still ONE test file, 0 spawns. Do not touch `src/`, `AGENTS.md`, `tsconfig.json`, `biome.json`, `plans/board.md`. Own worktree (`git worktree add ../wt-fix2-ABC-105 -b grugops/fix2-ABC-105 48a78f08`), `node_modules` symlinked in only. No `update-ref` on another branch, no `--force`, `-D`, `--amend`, `reset --hard`. `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. Gates before your last commit: `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, `last-run.json` success:true, `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`; `--sweep` still 132/38/77/2/15 exit 1. Take NO timing readings (QE re-times). Notes per Workflow 16 under `ref:`, a trace row at the END of `plans/traceability.md`, § Fix 2 (2026-10-12) on the ticket. Queue: `mkdir .grugops/queue/claimed/fix2-ABC-105`, then FLAT `.grugops/queue/done/fix2-ABC-105.md` and `.claim.md`, uncommitted. End commits with a `Co-Authored-By:` trailer naming the model you are. Report: tip, gates, test count, whole-tree read count before/after, the plant table, any tool change.
