---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-101
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-101-difficulty-selection.md
ref: .grugops/context/ticket-to-pr-ABC-101/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-101-difficulty-selection
base: main @ 4aa99deb
---

# Subtask: deliver `ABC-101`. `--difficulty <level>` selects one of `LEVELS` 1–5 (default 3) and the played engine is that level. You are the ONLY hop running (width 1).

M, P1, DoR 10/10 (re-scored 2026-10-12, `bapm-rescore-backlog-product`). The ticket page is the contract — read it whole, including the subject boundary ("search depth, time budget, blunder rate … are EPIC-004's"), § Acceptance with **A4 struck, A8 → A8′, new A10**, Test notes 1–5 (note 5 as amended), § "The guards this ticket will red, named in advance", and § Re-score — 2026-10-12. Design: `src/levels.ts` (`createLevel(level, { seed, now })`, `LEVELS`, `DEFAULT_LEVEL`), `ADR-0037` D3 (the seed: `Math.floor(Math.random() * 2 ** 32)` at the root, when ABC-101 wires a level), `ADR-0012`.

- **ABC-095 has merged since the re-score** (`ed7cb332`). The wiring line is now `src/cli.ts:188` `engine: withBook(book, createEngine({ budgetMs: DEFAULT_BUDGET_MS })),`. Per the owner's answer to question 5 (book over level, KEEP), the result is `engine: withBook(book, <this ticket's level seam>)` — the book stays OUTSIDE, the level replaces only the inner seam. Every line number in the page's re-location table (taken at `1eb2edbc`) is pre-ABC-095; re-locate each guard at your base before relying on it.
- **Guards ABC-095 added that your change will meet** — read them, do not weaken them: `ABC-043` A1 pin on the `engine:` expression; `ABC-119` A1/A3/A4/A6 (the real-engine rows and their mutants M1 composition-reverted and M2 budget-shadowed), `CLI_DEEP` rows in `src/cli.real-engine.test.ts`, and the 10 re-targeted children (doubles at `./book-engine.ts`). If wiring the level contradicts one of these criteria as written (not merely its line numbers or an expression pin the page told you would move), **STOP and report** with the red, its reason and the criterion text — do not amend another ticket's criterion yourself.
- **Adapter:** the `createLevel` → `EngineSeam` wrapper, the size of `createEngine` (`src/engine.ts:518-523`). `EngineSeam` (`src/turn-loop.ts:150`) does not change. **A8′:** `src/levels.ts`, `src/engine.ts` and the engine trigger list stay byte-identical (do not make `ABC-146` stale); assert equivalence to `createLevel` on an injected clock and seed, never strength.
- **Parsing:** A3's boundary pair (`0`, `6`) and `3.0`, `+3`, `03` rejected (Test note 1); A1 both argument orders (note 2); `Object.hasOwn` for the level lookup (Security forward note). `USAGE` (now `src/cli.ts:91`) and `AGENTS.md`'s command row are named in A5/A9 — **you may not edit `AGENTS.md`**: write the exact line it needs into your report and the § Delivery; the Scribe lands it (24,569 B, 7 B headroom — say the byte delta).
- **NFR-008:** 0 new test files in the default lane unless the page allows one, 0 new spawned processes in the default lane; A10 is a `CLI_DEEP` row. No timing readings are owed by this hop; do not take any.

## Fences
Never merge or push. Do not touch `plans/board.md`, `AGENTS.md`, engine modules (search, evaluation, ordering, TT, ID, time budget, `levels.ts`), `src/book*.ts`, `data/`. Own worktree: `git worktree add ../wt-ticket-to-pr-ABC-101 -b grugops/ABC-101-difficulty-selection main`; `node_modules` symlinked into the WORKTREE root only — never `ln -s` in the main checkout. No `update-ref` on another branch, no `--force`, `-D`, `--amend`, `reset --hard`, rebase. `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. Gates before your last commit: `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, `.test-results/last-run.json` success:true, `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`; plus the `CLI_DEEP` lane (`CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`), with 0 `abc095-book-absent-*` copies left in the temp dir before and after. End each commit with a `Co-Authored-By:` trailer naming the model you actually are. Notes per Workflow 16 under `ref:`, a trace row at the END of `plans/traceability.md`, § Delivery on the ticket page (sync its front matter to P1 / Ready→In Development is NOT yours; leave it). Queue: `mkdir .grugops/queue/claimed/ticket-to-pr-ABC-101` in the main checkout, then at the end FLAT files `.grugops/queue/done/ticket-to-pr-ABC-101.md` and `.claim.md`, uncommitted; `rmdir` the claim dir. Report: branch tip, gates (counts), each criterion PASS/FAIL with its reading, guards that moved and why, the ADR-0036 limb reading (clause-b on the delivered pair), the files changed, the AGENTS.md line owed, and the board move you recommend.
