---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-145
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-145-the-book-compiler-stamps-its-source-commit-and-never-checks-the-source-bytes.md
ref: .grugops/context/ticket-to-pr-ABC-145/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-145-book-source-sha256
base: main @ 61aef6e6
---

# Subtask: deliver `ABC-145`. The book compiler checks the sha256 of its five source files before it writes.

XS, P3, DoR 10/10. The ticket page is the contract; `ADR-0037` D1(f) amendment is the design. Fence `A6` is exact: only `tools/opening-book/compile.ts`, `tools/opening-book/book.test.ts`, `data/opening-book/ATTRIBUTION.md`; 0 `src/` paths, 0 new files, `book.json` byte-unchanged, `compileBook` body and `writeBook` export line byte-unchanged, the 9 existing `it` blocks unchanged, +2 tests, 0 spawns in `book.test.ts`. Re-read the base file/test counts at `main` now (vitest 4.1, 2 workers; ABC-144/152 have merged). Show `A1` green → red. `A3` mutant on a scratch copy. `A4` is a delivery RUN: fetch the five files at `SOURCE_COMMIT` from the raw URLs in `ATTRIBUTION.md` into a dir OUTSIDE the repo (scratch), compile, `cmp` against `git show main:data/opening-book/book.json`, plus the one-byte negative run. If the network fetch fails, record it and report `A4` as NOT RUN — never fake it. `A5` is read on joined text, not line grep.

## Fences
Never merge or push. Do not touch `plans/board.md`. Work in your OWN worktree (`git worktree add ../wt-ticket-to-pr-ABC-145 -b grugops/ABC-145-book-source-sha256 main`), with `node_modules` symlinked in only. Never use `git update-ref` on another hop's branch, never `--force`, `-D` or `reset --hard`. End each commit with a `Co-Authored-By:` trailer naming the model you actually are. In this shell `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. Gates before your last commit: `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, with `.test-results/last-run.json` success:true. Two other SE hops run in parallel (width 3): take NO timing readings, and grade nothing on wall/CPU. Publish typed notes per Workflow 16 under `ref:`, add a trace row at the END of `plans/traceability.md`, fill § Delivery on the ticket page. Move the queue file pending → claimed (`mkdir .grugops/queue/claimed/ticket-to-pr-ABC-145`) → done by hand; leave the done file uncommitted. Report: branch tip, gate results, each criterion PASS/FAIL with its reading, the UAT-waiver reading (`git diff --name-only main...HEAD | grep -v "\.test\.ts$" | grep "^src/"`), and the board move you recommend.
