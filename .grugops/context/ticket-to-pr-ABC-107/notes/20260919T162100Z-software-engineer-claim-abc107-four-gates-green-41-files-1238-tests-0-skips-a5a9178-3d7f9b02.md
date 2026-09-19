---
id: 20260919T162100Z-software-engineer-claim-abc107-four-gates-green-41-files-1238-tests-0-skips-a5a9178-3d7f9b02
kind: claim
by: software-engineer
at: 2026-09-19T16:21:00Z
verified_by:
confidence: high
refs:
  - ABC-107
  - ADR-0022
  - src/frame.overflow-bound.test.ts
  - .grugops/test-skips.md
supersedes:
---

# `ABC-107` — the four gates at `a5a9178`, raw numbers, and every criterion by count

**NOT A STAMP — a `claim`.** No `finding` is admissible on this install (`AGENTS.md`); this is the
Software Engineer's own gate run on the branch tip `grugops/ABC-107-overflow-bound` @ `a5a9178`,
in the isolated worktree with the main checkout's `node_modules` symlinked read-only. Every
command below was RUN; nothing is quoted from memory. Load average at the time: 2.6–6.0 (two
sibling hops live).

| gate | command | result |
| --- | --- | --- |
| lint | `npm run lint` | exit 0 — `Checked 74 files in 90ms. No fixes applied.` |
| typecheck | `npm run typecheck` | exit 0 — `tsc --noEmit`, no output |
| build | `npm run build` | exit 0 — `tsc --noEmit`, no output (the typecheck wearing the build slot's name) |
| unit | `npx vitest run --dir src` | exit 0 — **41 files passed (41), 1238 tests passed (1238)**, duration 4.06 s; baseline 40 / 1213 / 0 → **+1 file, +25 tests** |
| skip count | `npx vitest run --dir src --reporter=json` → `numPendingTests + numTodoTests` | **0** (pending 0, todo 0, failed 0, 252 suites) |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.` |
| new file alone | `npx vitest run src/frame.overflow-bound.test.ts` | 25 passed (25), tests 15 ms, duration 204 ms |

## Criteria, by count

- **`A1'`** — hidden **0 / 2 / 3** on the 6/7/8-knight fixtures (and 3 on the 8-queen fixture);
  marker present exactly when hidden > 0; full-origin SAN and coordinate form each resolve every
  candidate as a `move` with matching `from`/`to`: **6/6, 7/7, 8/8, 8/8** for both spellings.
- **`A2`** — every fixture's frame is **23 rows**, equal to the two-candidate reference and to
  `frameHeight({ board: 9, status: STATUS_ROWS, history: HISTORY_ROWS })`.
- **`A3`** — six knights: hidden 0, no marker, every one of the 6 candidates present in full.
- **`A4`** — `git diff --name-only a5a9178~1 a5a9178 | grep -v '\.test\.ts$' | grep '^src/'` →
  EMPTY; `git diff --numstat a5a9178~1 a5a9178` → `202 0 src/frame.overflow-bound.test.ts` and
  nothing else. `src/move-input.ts`, `src/san.ts`, `src/search.ts`: 0 changed lines.
- **`A5`** — the three knight fixtures are named `describe` blocks (`six knights`, `seven
  knights`, `eight knights`); the tripwire was watched red at `MESSAGE_ROWS` = 3 (7 of 25 fail).

## Standing rules honoured

Zero production lines → the 2026-08-17 UAT waiver applies once the Orchestrator measures it from
git (measured above, at `a5a9178`). QE's hop is still owed at `In Review` (2026-08-17 directive).
Not merged, not deployed.
