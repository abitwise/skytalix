---
task: wave-2026-09-25
subtask: wire-ABC-095
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-095-short-circuit-the-engines-move-choice-with-the-book-and-fall-through-cleanly.md
ref: .grugops/context/wire-ABC-095/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-095-book-before-engine (continue from 1f205b00; bring main @ b7f5d335 in by MERGE, not rebase)
---

# Subtask: finish `ABC-095` — wire the book into a real game, to the rulings now on main

The decorator (`521a8513`) is on the branch. Everything that blocked the wiring is now ruled and on main @ b7f5d335: ADR-0037 § Addendum — 2026-10-12 (R1 `src/book-file.ts`, R2 doubles move to `./book-engine.ts` + ABC-119's book-absent tree copy, R3 miss bar warm), ADR-0036 § S1 (limb-1 (b1) unit = the holder file) and the **S3 checklist** (`.grugops/context/secnfr-ABC-095-placement/notes/…a096cf43` — build to items 2–8), and BA/PM's amendments (ABC-095 now **M (3)**, DoR 10/10; ABC-119 A1/A3/A4 Givens; ABC-043/044/045/046 (N) confirmations; notes `.grugops/context/bapm-amend-ABC-095/notes/`). The ticket page as amended is the contract — re-read it whole after the merge.
- In the existing worktree `../wt-ticket-to-pr-ABC-095`: `git merge main` (no rebase). Then build: `src/book-file.ts` (R1 contract exactly: one import `{ readFileSync } from "node:fs"`, zero params, one call on the fixed `new URL(…, import.meta.url)`, no write/other path/`process`/`catch`, nothing at import time); `src/cli.ts` (imports, the one `const` binding read/warn/random, the `engine:` line only; **no banned substrings in new text or comments** — `eval`, `Function(`, `child_process`, `import(`, `fetch`, `WebSocket`, `XMLHttpRequest`); the 10 children re-targeted to `./book-engine.ts`; the two pin moves with reason lines (ABC-042 A9 9 → 10, ABC-043 A1 `engine:` row); ABC-119's lane on a REAL copy under `mkdtemp(os.tmpdir())` — no symbolic links (a linked `src/` reads the repo's book), `src/` byte-identity asserted before spawn, `book.json` absent, `rmSync` only on the exact mkdtemp path, A3(iv) asserts the book-absent warning PRESENT exactly once.
- Deliver A5's stream half and A7 (`CLI_DEEP` rows), and run the `CLI_DEEP` lane. Check ABC-064's `black`/`random` rows still read only the first frame (BA/PM's note).
- **Timing (A2 ≤ 30 ms COLD — first call in a fresh process; miss ≤ 5 ms WARM — R3's procedure: one warm-up hit, 200 timed calls of the position after 1. e4 e5 2. Ke2, max ≤ 5 ms, median and p99 recorded):** you are the ONLY grugops hop running. Read them outside the suite on v26.11.0, logging load1, thermal pressure, `pgrep -fl vitest` and power before and after. A foreign vitest (e.g. `oeselg-labs/platform/repos/product-template`, the grugops kit) voids a reading; wait up to ~15 min for a clear moment, else record NOT READ (never estimate). Figures go in notes only.
- Run clause-b yourself as a self-check of S3 item 1 (`.grugops/context/design-F-072-1/probe/clause-b.mjs`) and record the output; Security/NFR re-runs it at the gate.

## Fences
Never merge to main or push. Do not touch `plans/board.md`, `AGENTS.md`, engine modules (search, evaluation, ordering, TT, ID, time budget, levels), `src/book.ts`, `data/opening-book/`, ADRs. No `update-ref` on another branch, no `--force`, `-D`, `--amend`, `reset --hard`, no rebase. `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. Gates before your last commit: `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, `.test-results/last-run.json` success:true, `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`, and the `CLI_DEEP` lane. End each commit with a `Co-Authored-By:` trailer naming the model you actually are. Notes per Workflow 16 under `ref:`, a trace row at the END of `plans/traceability.md`, update § Delivery on the ticket page. Queue: `mkdir .grugops/queue/claimed/wire-ABC-095`, then FLAT `.grugops/queue/done/wire-ABC-095.md` and `.claim.md`, uncommitted; `rmdir` the claim dir. Report: branch tip, gates (counts, incl. `CLI_DEEP`), each criterion A1–A7 PASS/FAIL with its reading, the S3 items 2–8 self-check, clause-b output, the timing readings with window logs, files changed, and the board move you recommend.
