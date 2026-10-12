---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-154
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-154-the-qe-hop-detector-test-has-no-positive-control-on-its-whole-tree-read.md
ref: .grugops/context/ticket-to-pr-ABC-154/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-154-positive-control-whole-tree-read
base: main @ c4822697
---

# Subtask: deliver `ABC-154`. A positive control on the QE-hop test's whole-tree read, plus the `main` JSDoc "neither" fix.

XS, P3, DoR 10/10. The ticket page is the contract (A1–A4, Test notes 1–5). Base is `main` @ c4822697; confirm the tool and the test there are `cmp` 0 to `8fd0c233`.
- **Show the gap first** (Test note 1): the three A1 plants (`q4a-readNotes-unfiltered-drops-secnfr`, `q4a-readNotes-unfiltered-drops-quality-gate`, `q4b-both-memos-empty`) loaded VERBATIM with `ast.literal_eval` from `.grugops/context/qe4-ABC-105/probe/plants4.py` — 0 red on base, ≥ 1 red on head. Six readings in the delivery note.
- **A2:** all 23 recorded plants + the 9 in `plants4.py`, base vs head, head ⊇ base by test NAME. Table it.
- **A3:** only `main`'s JSDoc changes in the tool; "neither" gone; says the command line can supply none of `snapshotIds`, `root`, `notes`.
- **A4:** exactly the two files; 0 new files; 0 spawn sites (the page's grep); whole-tree reads still 2 (instrument a scratch copy of `readNotes`, `fix2-ABC-105`'s method); `--sweep` stdout from head tool `cmp` 0 to base tool on the same tree; `npm test` file count = base, tests = base or base + 1, skips 0, integrity `No findings.`
- Use the existing memos (`allNotes()`, `plainSweep()`); no new tree read; ≤ 1 new `it`. Do not inject `notes` under `--ticket` (Test note 4).

## Fences
Never merge or push. Do not touch `plans/board.md`, `AGENTS.md`, `src/`, `tsconfig.json`, `biome.json`. Work in your OWN worktree (`git worktree add ../wt-ticket-to-pr-ABC-154 -b grugops/ABC-154-positive-control-whole-tree-read main`), `node_modules` symlinked in only (into the WORKTREE root; never run `ln -s` in the main checkout). Plants only in scratch copies OUTSIDE the repo; `git status --porcelain` clean afterwards. No `update-ref` on another branch, no `--force`, `-D`, `--amend`, `reset --hard`. `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. Gates before your last commit: `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, `.test-results/last-run.json` success:true, `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`. Take NO timing readings (QE reads the lane at width 1). End each commit with a `Co-Authored-By:` trailer naming the model you actually are. Notes per Workflow 16 under `ref:`, a trace row at the END of `plans/traceability.md`, § Delivery on the ticket page. Queue: `mkdir .grugops/queue/claimed/ticket-to-pr-ABC-154`, then at the end FLAT files `.grugops/queue/done/ticket-to-pr-ABC-154.md` and `.claim.md`, uncommitted; `rmdir` the claim dir. Report: branch tip, gates, test count, the six A1 readings, the A2 table summary, A3/A4 readings, the UAT-waiver reading, the board move you recommend.
