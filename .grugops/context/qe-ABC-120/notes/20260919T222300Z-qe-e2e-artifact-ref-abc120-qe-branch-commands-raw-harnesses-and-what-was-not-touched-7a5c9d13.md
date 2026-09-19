---
id: 20260919T222300Z-qe-e2e-artifact-ref-abc120-qe-branch-commands-raw-harnesses-and-what-was-not-touched-7a5c9d13
kind: artifact-ref
by: qe-e2e
at: 2026-09-19T22:23:00Z
verified_by:
confidence: high
refs:
  - ABC-120
  - ADR-0021
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - plans/tickets/ABC-120-the-turn-loop-gains-quit-and-take-back-arms.md
  - plans/traceability.md
  - .grugops/queue/done/qe-ABC-120.md
supersedes:
---

# `ABC-120` QE — the branch, the commands, the raw harnesses, and what was not touched

Branch **`grugops/qe-ABC-120`**, created from `grugops/wave-2026-09-19` @ `babc1b2` (carries the build
`d8e7ccc` via merge `ec160b6`) in an isolated worktree with the main checkout's `node_modules`
symlinked. **Unmerged; nothing pushed (no remote); not deployed.** The one commit on this branch carries
these notes, the trace row, the ticket § QE and the queue move, and **nothing under `src/`** —
`git diff --numstat babc1b2..HEAD` is the measurement, quoted in the hand-back.

## Commands run at the tip (numbers in the sibling `decision`)

Through a node script each (the PreToolUse hook refuses `npm run`, `$?`, heredocs):

- `npx biome check .` · `npx tsc --noEmit` (twice: typecheck and the build slot) ·
  `npx vitest run --dir src` · the same with `--reporter=json` for the skip count ·
  `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` ·
  `npx vitest run src/turn-loop.test.ts` · `npx vitest run src/turn-loop.nfr.test.ts` —
  `raw-gates-harness.mjs.txt` → `raw-gates-summary.json.txt`.
- 15 mutants, `npx vitest run src/turn-loop.test.ts src/turn-loop.nfr.test.ts --reporter=json` each,
  `git checkout -- src/turn-loop.ts` and `git status --porcelain -- src` asserted empty after each —
  `raw-mutants-harness.mjs.txt` → `raw-mutants-summary.json.txt`; `raw-mutant-Mn-harness.mjs.txt` →
  `raw-mutant-Mn-summary.json.txt`.
- `A7`/`A8` block hashes, `A9` recount, `A10` greps, reading `git show 20ad7cb:…` and `HEAD:…` only —
  `raw-a7a8a9-harness.mjs.txt` → `raw-a7a8a9-summary.json.txt`.

Deep lanes NOT run: `SEARCH_DEEP` / `ENGINE_DEEP` / `INPUT_DEEP` are owed after changes to
`src/search.ts` / `src/engine.ts` / `src/line-input.ts`, none of which this ticket touches (byte-identical
at the tip, measured).

## Not touched, on purpose

`src/**` (every mutant reverted; QE wrote no test and no production line), `plans/board.md`,
`AGENTS.md`, `plans/nfr-catalog.md`, `src/command-input.*`, `src/line-input.*`, `src/cli.ts`,
`src/search.ts`, `src/quiescence.ts`, `.grugops/test-skips.md` (human-owned: read and run only).
`NFR-008` not ruled (fence).

## State this hop wrote

`.grugops/context/qe-ABC-120/notes/*` (four notes, seven `raw-*.txt`), `plans/traceability.md` (one
`_Updated:` line prepended, one row `ABC-120 (qe)` appended, nothing touched in place),
`plans/tickets/ABC-120-…md` § QE appended, `.grugops/queue/{pending → claimed → done}/qe-ABC-120*`.
The `In Review` exit is the Orchestrator's board move; UAT needs the owner's word (production lines > 0).
