---
id: 20260925T203924Z-software-engineer-observation-abc109a5-inmemory
kind: observation
by: software-engineer
at: 2026-09-25T20:39:24Z
verified_by:
confidence: high
refs:
  - ABC-109
  - ABC-109/A5
  - src/cli.test.ts
  - AGENTS.md
  - 20260925T203302Z-qe-e2e-decision-ea1c9d3f
supersedes:
---

# ABC-109 `A5` — red watched on an IN-MEMORY 24,577 B Buffer, through the shipped expression

Hand-authored (`context-io.ts` / `claim.js` absent from this repo and the kit). `at` is the host
clock. Task `ticket-to-pr-ABC-109-a5-proof`, worktree `.claude/worktrees/ABC-109-agents-md-cap`,
branch `grugops/ABC-109-agents-md-cap`, tree at claim commit `0b0bc2c` (base `9d5672a`). Closes the
QE ruling "`A5` NOT MET to the letter" (`20260925T203302Z-qe-e2e-decision-ea1c9d3f`). Appends to,
does not supersede, `20260925T202000Z-software-engineer-observation-abc109a5`.

## Method — the shipped row, unchanged, fed a Buffer instead of the file

Nothing new ships. `src/cli.test.ts` is **unchanged**. Two throwaway files lived in the session
scratchpad only (never in the repo, never committed):

- `abc109-a5-inmemory-setup.ts` — a vitest setup file doing `vi.mock("node:fs", …)` that replaces
  ONLY a `readFileSync` call with **no encoding argument** whose path ends `/AGENTS.md` (the shipped
  `A5` row's exact call) with `Buffer.alloc(Number(process.env.A5_MEMORY_BYTES), 0x61)`, logging
  `[a5-proof] in-memory Buffer of N B served for <path>` to stderr. Every other `readFileSync`,
  including the `utf8` `AGENTS.md` reads of the `ABC-042`/`065` rows, passes through to the real one.
- `abc109-a5-inmemory.config.ts` — `mergeConfig(<repo vitest.config.ts>, { root: <worktree>,
  test: { setupFiles: [<setup above>] } })`. (`--setupFiles` is not a vitest 3.2.7 CLI flag:
  `CACError: Unknown option --setupFiles` — first attempt, recorded.)

So the expression under test is the shipped one at `src/cli.test.ts:2140-2143`:
`expect(readFileSync(`${REPOSITORY}AGENTS.md`).length, …).toBeLessThanOrEqual(AGENTS_MD_BUDGET_BYTES)`.

## RED — `A5_MEMORY_BYTES=24577 npx vitest run src/cli.test.ts -t ABC-109 --config <scratch config>`

Exit **1**. Verbatim (the 65 `↓` skipped-row lines omitted here):

```
 RUN  v3.2.7 /Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/ABC-109-agents-md-cap

[a5-proof] in-memory Buffer of 24577 B served for /Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/ABC-109-agents-md-cap/AGENTS.md
 ❯ src/cli.test.ts (66 tests | 1 failed | 65 skipped) 5ms
   × ABC-109 — AGENTS.md stays inside its byte budget > A5 — AGENTS.md's size on disk, in BYTES, is at most the budget 4ms
     → AGENTS.md bytes against its 24576 B budget (ABC-109): expected 24577 to be less than or equal to 24576

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/cli.test.ts > ABC-109 — AGENTS.md stays inside its byte budget > A5 — AGENTS.md's size on disk, in BYTES, is at most the budget
AssertionError: AGENTS.md bytes against its 24576 B budget (ABC-109): expected 24577 to be less than or equal to 24576
 ❯ src/cli.test.ts:2143:7
    2141|       readFileSync(`${REPOSITORY}AGENTS.md`).length,
    2142|       `AGENTS.md bytes against its ${AGENTS_MD_BUDGET_BYTES} B budget …
    2143|     ).toBeLessThanOrEqual(AGENTS_MD_BUDGET_BYTES);
       |       ^
    2144|   });
    2145| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 65 skipped (66)
   Start at  23:38:40
   Duration  3.00s (transform 97ms, setup 11ms, collect 2.86s, tests 5ms, environment 0ms, prepare 34ms)
```

## GREEN — same command, `A5_MEMORY_BYTES=24576`

Exit **0**. Verbatim (skipped-row lines filtered):

```
 RUN  v3.2.7 /Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/ABC-109-agents-md-cap

[a5-proof] in-memory Buffer of 24576 B served for /Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/.claude/worktrees/ABC-109-agents-md-cap/AGENTS.md
 ✓ src/cli.test.ts (66 tests | 65 skipped) 1ms

 Test Files  1 passed (1)
      Tests  1 passed | 65 skipped (66)
   Start at  23:38:49
   Duration  2.99s (transform 105ms, setup 13ms, collect 2.81s, tests 1ms, environment 0ms, prepare 46ms)
```

## Fences

- `AGENTS.md` never written: sha256 `08bda29fe744a24786c30cd5835bacd0d0e2dc33f76f7a261421ad17f7086fef`
  (21,786 B) before the proof and after it; `git status --short` empty after the runs.
- Control, no scratch config: `npm test` 47/47 files, 1447/1447 tests, exit 0 — the real file still
  passes the real row.
- `src/cli.test.ts` unchanged; no new test file; the scratch files are not in the repo.
