---
id: 20260925T202000Z-software-engineer-observation-abc109a5
kind: observation
by: software-engineer
at: 2026-09-25T20:20:00Z
verified_by:
confidence: high
refs:
  - ABC-109
  - ABC-109/A5
  - src/cli.test.ts
  - AGENTS.md
  - 7dd353b
supersedes:
---

# ABC-109 `A5` — the `AGENTS.md` byte-count guard, built and watched RED

Hand-authored, same reason as the Scribe's sibling notes (`context-io.ts` / `claim.js` absent from
this repo and the kit). `at` is the host clock (`date -u`). Worktree
`.claude/worktrees/ABC-109-agents-md-cap`, branch `grugops/ABC-109-agents-md-cap`, commit
`7dd353b` on top of claim commit `b264f54` (base tip `d447ef3`).

## What was built

- `src/cli.test.ts` — new `describe("ABC-109 — AGENTS.md stays inside its byte budget")` after the
  `ABC-065` block: one named constant `AGENTS_MD_BUDGET_BYTES = 24_576` and ONE `it` with ONE
  `expect`: `readFileSync(`${REPOSITORY}AGENTS.md`).length` (a Buffer, so bytes = `wc -c`)
  `toBeLessThanOrEqual(AGENTS_MD_BUDGET_BYTES)`. Numstat vs branch base `0bf562f`: `14 0
  src/cli.test.ts` — the only `src/` file on the branch.
- No hash, no line count, no rendering pin (`ABC-059`). No new test file, no spawn.

## Red proof (the contract's method: pad the real file, revert byte-for-byte)

- `AGENTS.md` before: 21,786 B, sha256 `08bda29fe744a24786c30cd5835bacd0d0e2dc33f76f7a261421ad17f7086fef`.
- Padded to **24,577 B (budget + 1)**; `npm test -- src/cli.test.ts` → 1 failed | 65 passed, exit 1,
  the failing row being this one alone. Observed message, verbatim:
  `AssertionError: AGENTS.md bytes against its 24576 B budget (ABC-109): expected 24577 to be less than or equal to 24576`
- Truncated to **exactly 24,576 B** → the row is green (boundary is `≤`, as `A1` words it).
- Restored from a scratch copy; sha256 re-read identical to the line above; `git status` showed
  only `src/cli.test.ts` modified. `AGENTS.md` is not in the diff.
- Deviation, recorded not hidden: `A5`'s text asks the red path be exercised "on an in-memory
  number rather than by writing the real file". The contract's stop condition allows only one
  assertion, so no in-memory mutant row ships; the red was watched by the contract's own method
  (temporary pad of the real file, reverted and hash-verified). The rule itself is a pure
  comparison of one number against the constant.

## Gates (on `7dd353b`'s tree, `AGENTS.md` restored)

- `npm test`: 47/47 files, **1447/1447** tests, exit 0 (baseline same session: 47 / 1446).
- `npm run typecheck` (`tsc --noEmit`): clean. `npm run lint` (`biome check .`): 83 files, clean.
- Existing `AGENTS.md` rows (`ABC-042` `A1`, `ABC-065` `A1`/`A3`, `ABC-071`, `ABC-067`) green against
  the restructured file — no stop condition fired.

## `N8-LANE` / `NFR-008` charge (`A6`)

- Ticket's `N8-LANE` line: not quoted as a slice; falsifiable zeroes instead. Measured: **0 new
  test files** (47 → 47), **0 new spawns**, **0 production lines**, **+1 test** (≤ 2 allowed).
- Cost of the row: one `readFileSync` of a 21,786 B file plus one comparison. `-t ABC-109` run:
  vitest `tests 1ms` for the file (65 skipped); `src/cli.test.ts` 35 ms → 57 ms across two full
  runs, and whole-lane wall 8.55 s → 9.44 s — both within run-to-run noise with parallel worktrees
  on the host, not attributable to a 1 ms row. `UNKNOWN - verify` for any finer figure.
- `A6` diff check: `src/` non-`.test.ts` files changed on the branch = none.
