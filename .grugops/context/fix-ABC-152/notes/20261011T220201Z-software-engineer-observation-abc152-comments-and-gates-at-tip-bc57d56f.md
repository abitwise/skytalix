---
id: 20261011T220201Z-software-engineer-observation-abc152-comments-and-gates-at-tip-bc57d56f
kind: observation
by: software-engineer
at: 2026-10-11T22:02:01Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0042
  - QE-152-d
  - src/render-seam.test.ts
  - src/cli.test.ts
  - tools/opening-book/book.test.ts
  - src/command-input.test.ts
  - src/history-pane.nfr.test.ts
  - 20261011T214847Z-architect-design-decision-abc152-qe-rulings-e50fbbe3
supersedes:
---

# SE `ABC-152` commit 3 (`49997a87`, `QE-152-d`): comment lines only at the eight lines ruling 10 names; then the gates at the tip are all green

This note is hand-authored and unsealed. **No timing was read.**

## Commit 3

- **Sites** (line numbers at `88009d0b`; commits 1 and 2 touch none of these files):
  - `src/render-seam.test.ts` 4, 6 and 7;
  - `src/cli.test.ts` 5;
  - `tools/opening-book/book.test.ts` 101;
  - `src/command-input.test.ts` 51 and 63;
  - `src/history-pane.nfr.test.ts` 670.
- **Size:** 8 lines replaced in place (+8 / −8, 5 files). No line was added or removed, so no line number moved.
- **Comment-only check.** `git diff -U0 HEAD~1` was filtered to its `+` / `-` lines, minus the file headers. Lines
  that do not start with `*` or `//` after the sign: **0**.
- **`expect(` counts per file** (`HEAD~1` → `HEAD`): `render-seam` 36 → 36, `cli` 324 → 324, `book` 26 → 26,
  `command-input` 295 → 295, `history-pane.nfr` 44 → 44.
- **Line-number citations.** None are added. Line 670 dropped both of its old citations, `:43-44` and `:58-60`. It
  now names "the static imports after the `vi.mock` blocks".
- **`npm test` after commit 3:** exit 0, 56 / 1741.
- **The mechanism each line now states:**
  - `render-seam` names `vi.mock(p, { spy: true })` automocks, calling through. Line 4 now reads "NO `vi.mock`
    FACTORY".
  - `cli` names "its only `vi.mock` is `{ spy: true }`".
  - `book` names `mockImplementation` + `mockReset`.
  - `command-input` 51 and 63 name `vi.mock(p, { spy: true })`, calling through.
  - `history-pane.nfr` names "`vi.mock` with `importOriginal()` and the static imports after the `vi.mock` blocks".
- The wording choices are in the decision note `…d04191a4`.

## Gates at the tip `49997a87` (worktree, vitest 4.1.11)

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | exit 0, "Checked 107 files … No fixes applied." |
| typecheck | `npm run typecheck` | exit 0 |
| build | `npm run build` | exit 0 |
| unit | `npm test` | exit 0, **56 files, 1741 passed**; **0** console lines containing `deprecated` |
| skip count | `npx vitest run --reporter=json 2>/dev/null \| jq '.numPendingTests + .numTodoTests'` | **0** |
| integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |
| inventory | `node tools/grugops/lane-inventory.js` | "collects 56 test files; git tracks 56", `No findings.`, exit 0 |
| weakened, re-read at the tip | `PUZZLE_DEEP=weakened npx vitest run src/puzzle-suite.test.ts` | exit 1, 1 failed / 13 passed, the gate row, `solved 15/58` |
| UAT-waiver measurement | `git diff --name-only 91024242 HEAD \| grep -v '\.test\.ts$' \| grep '^src/'` | empty |

- **Worktree after the gates:** `git status --porcelain` is empty.
- **Not run at the tip:** the other opt-in deep lanes (`SEARCH_DEEP`, `ENGINE_DEEP`, `INPUT_DEEP`, `ZOBRIST_DEEP`,
  `CLI_DEEP`, `LADDER_DEEP`, `PERFT_DEEP`) and coverage.
  - The delta changes no file those lanes gate except through comment lines.
  - `PUZZLE_DEEP=1` was run in full at `476fdde0`: exit 0, 1747.
  - QE's delta re-check owns any further lane reading.
