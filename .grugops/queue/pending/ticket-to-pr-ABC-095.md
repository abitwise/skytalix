---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-095
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-095-short-circuit-the-engines-move-choice-with-the-book-and-fall-through-cleanly.md
ref: .grugops/context/ticket-to-pr-ABC-095/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-095-book-before-engine
base: main @ da7ba9aa
---

# Subtask: deliver `ABC-095`. The opening book sits in front of the engine's move choice and falls through cleanly when the game leaves book.

S, P1, DoR 10/10 (re-scored 2026-10-12, `bapm-rescore-backlog-product`). The ticket page is the contract — read it whole, including § Out of scope ("THE SEARCH IS EPIC-004's … STOP"), A1–A7, Test notes 1–5 and § Re-score — 2026-10-12. Design: `ADR-0012` (clauses 3(b), 6), `ADR-0037` (D3: `random: Math.random` at the root, no session seed), `ADR-0036` (the (b1)/(b2) limb your read placement fires — record which one).
- **Test note 1 first:** confirm the search entry point is spy-able. If A1 is unwritable without touching the engine, STOP and report — do not weaken A1 and do not edit engine modules (A6).
- **The one wiring line** at `src/cli.ts:176` (`engine: createEngine({ budgetMs: DEFAULT_BUDGET_MS })`) wraps the engine with the book decorator. ABC-101 will touch the same line later; keep the wrap minimal.
- **A1/A3 by call count, never a stopwatch** (Test note 2). **A4 compares two real captured frames** (Test note 3). **A5** per the re-score's pinned driver (10 in-book positions, a `read` that throws, a counting stub engine: engine called exactly 10×, warning exactly once) plus its `CLI_DEEP` row; artifact moved aside in a TEMP COPY, never deleting `data/opening-book/book.json` (Test note 4). **A7:** a real session consults the book.
- **A2 (≤ 30 ms, out of suite) and the miss-path probe cost (≤ 5 ms):** you are the ONLY hop running (width 1). Read them outside the suite on the reference stack (`node --version` v26.11.0), logging load1, `notifyutil -g com.apple.system.thermalpressurelevel`, any other vitest process (`pgrep -fl vitest`; the grugops kit's suite in another session or `oeselg-labs/platform/repos/shared` voids a reading) and power source before and after. Figures go in notes with the machine, never in an assertion (Test note 5). If no quiet moment, record NOT READ.
- **NFR-008 pins:** ≤ 1 new test file, 0 new spawned processes in the default lane (A2/A5 out-of-lane).

## Fences
Never merge or push. Do not touch `plans/board.md`, `AGENTS.md`, engine modules (search, evaluation, ordering, TT, ID, time budget, levels), `data/opening-book/`, the book probe/picker/artifact format (ABC-093/094's). Work in your OWN worktree (`git worktree add ../wt-ticket-to-pr-ABC-095 -b grugops/ABC-095-book-before-engine main`), `node_modules` symlinked into the WORKTREE root only — never `ln -s` in the main checkout. No `update-ref` on another branch, no `--force`, `-D`, `--amend`, `reset --hard`. `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. Gates before your last commit: `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, `.test-results/last-run.json` success:true, `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`; plus the `CLI_DEEP` lane for your new row. End each commit with a `Co-Authored-By:` trailer naming the model you actually are. Notes per Workflow 16 under `ref:`, a trace row at the END of `plans/traceability.md`, § Delivery on the ticket page. Queue: `mkdir .grugops/queue/claimed/ticket-to-pr-ABC-095`, then at the end FLAT files `.grugops/queue/done/ticket-to-pr-ABC-095.md` and `.claim.md`, uncommitted; `rmdir` the claim dir. Report: branch tip, gates (counts), each criterion A1–A7 PASS/FAIL with its reading, the A2/miss-cost readings with their window log, the ADR-0036 limb, the files changed, and the board move you recommend.
