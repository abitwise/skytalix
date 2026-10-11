---
id: 20261011T222155Z-qe-e2e-observation-abc152-delta-comments-gates-merge-5cf58584
kind: observation
by: qe-e2e
at: 2026-10-11T22:21:55Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ABC-030
  - ADR-0042
  - ADR-0008
  - QE-152-d
  - QE-152-i
  - QE-152-k
  - src/cli.test.ts
  - src/render-seam.test.ts
  - src/command-input.test.ts
  - src/history-pane.nfr.test.ts
  - tools/opening-book/book.test.ts
  - .grugops/context/qe2-ABC-152/probe/v7/
  - .grugops/context/qe2-ABC-152/probe/merge/
  - 20261011T220201Z-software-engineer-observation-abc152-comments-and-gates-at-tip-bc57d56f
  - 20261011T220201Z-software-engineer-decision-abc152-repair-choices-handoff-d04191a4
supersedes:
---

# QE `ABC-152` delta: commit 3 is comment-only and accurate; `cli.test.ts` line 6 is stale (`QE-152-i`); the gates, `V5` and `V7` hold at the tip; the dry-run merge against `main` conflicts on the trace file only, and the merged tree is green

This note is hand-authored and unsealed. **No timing was read.**

## Commit 3 (`49997a87`, ruling 10): the comment-only check

- `git diff -U0 49997a87~1 49997a87`: **8 `-` and 8 `+` lines. Lines whose text, after the sign, does not start with
  `*` or `//`: 0.**
- **The hunks sit at exactly the named sites:**
  - `cli` 5;
  - `command-input` 51 and 63;
  - `history-pane.nfr` 670;
  - `render-seam` 4 and 6–7;
  - `book` 101.
  - No line was added or removed, so no line number moved.
- **`expect(` per file** (`91024242` / `88009d0b` / `49997a87`):
  - `cli` 321 / 324 / 324;
  - `command-input` 295 / 295 / 295;
  - `history-pane.nfr` 44 / 44 / 44;
  - `render-seam` 36 / 36 / 36;
  - `book` 26 / 26 / 26;
  - `puzzle-suite` 45 / 45 / 45.
- **Each new line, checked against the code:**
  - `cli:5`, "Its only `vi.mock` is `{ spy: true }`": **true**. One `vi.mock`, at `:53`.
  - `command-input:51/63`, "`vi.mock(p, { spy: true })`, calls through": **true**. The only mocks are `:56` and
    `:65`, both `{ spy: true }`.
  - `history-pane.nfr:670`, "`vi.mock` with `importOriginal()` and the static imports after the `vi.mock` blocks":
    **true**. Factories at 29–48, static imports at 56–69. There is no line-number citation.
  - `render-seam:4/6-7`, "NO `vi.mock` FACTORY", and "`A2`'s spies are file-top `vi.mock(p, { spy: true })`
    automocks": **true**. Seven `{ spy: true }` mocks at 61–67, read through `vi.mocked`. No factory.
  - `book:101`, "`mockImplementation` + `mockReset`": **true**. `mockImplementation` at 104, and `mockReset` in the
    `finally` at 112.

## `src/cli.test.ts` line 6: stale (`QE-152-i`, LOW, routed to the Architect)

- **The text:** "it is not an `*.nfr.test.ts`: nothing here re-routes the module graph."
- **Why it is stale.** The project's own definition, in `ABC-030`'s ticket, is: "`vi.mock` hoisting re-routes the
  module graph for **every** test in the file it sits in." The `*.nfr.test.ts` headers repeat it. Line 5 now
  (truly) says the file holds a `vi.mock`.
  - The A5 guard "`--ascii --unicode` is refused at the resolver, and selectGlyphMode is not called" expects **0**
    calls.
  - It sees a call from `cli-options.ts` **only because** that importer is routed through the `{ spy: true }`
    automock. QE's first-hop plant was red there (`called +0 times, but got 1 times`).
  - So "nothing here re-routes the module graph" misstates the mechanism this guard rests on. That is ruling 10's
    class.
- **When it went stale:** at `88009d0b` (R1: namespace `vi.spyOn` → file-top `{ spy: true }`). QE's first hop listed
  line 5 and missed line 6.
- **The SE's reading** (`…d04191a4` choice 3: true on call-through) is defensible as "no behaviour is re-routed".
  QE grades the mechanism, not the behaviour, as ruling 10 did.
- **Not fixed by QE.** It is the Architect's to rule: either the same one-line, comment-only treatment as ruling 10,
  or a follow-up.

## Gates at the tip `49997a87` (QE's worktree, its own `npm ci`, vitest 4.1.11)

| gate | result |
|---|---|
| `npm run lint` | exit 0, "Checked 107 files … No fixes applied." |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 |
| `npm test` | exit 0, **56 files, 1741 passed**; 0 `deprecat` lines |
| skip capture | `0` |
| `test-skip-integrity.js … --skip-count 0` | `No findings.`, exit 0 |
| `lane-inventory.js` | "collects 56 test files; git tracks 56", `No findings.`, exit 0 |
| `git status --porcelain` | only this hop's untracked `.grugops/context/qe2-ABC-152/` |

## `V5` over the ticket (`91024242..49997a87`)

- 15 test files changed.
- `expect(` is equal per file **except `src/cli.test.ts` 321 → 324** (declared in the first hop).
- **No `.skip`, `.only`, `.todo`, `skipIf`, `runIf`, `xit` or `xdescribe` was added.**
- 56 / 1741 / 0 skipped.
- UAT-waiver measurement (`git diff --name-only 91024242 HEAD | grep -v '\.test\.ts$' | grep '^src/'`): **empty**.

## `V7`, re-run on QE's call

- `node .grugops/context/qe-ABC-144/probe/screen.mjs <worktree> 20 20 <tsv>`, unchanged.
- **20 of 20 consecutive green runs, in 20 runs.** Every run: exit 0, 56 files, 1741 passed, 0 failed, 0 skipped,
  0 todo, 7/7 `*.nfr` files, 0 unhandled.
- `probe/v7/v7-screen-49997a87.tsv`; the `load1_before` column is dropped.
- **Why QE ran it although the Architect read it as not re-owed:**
  - the delta adds a file-scope automock to a default-lane file (`puzzle-suite`), whose spy records every
    `evaluate` call;
  - it also changes the module the reporter loads in the main process;
  - the screen costs minutes. Evidence over argument.

## Dry-run merge against `main` `9ad2c5f5` (`probe/merge/`)

- **`git merge-tree --write-tree --name-only main 49997a87`: exit 1, CONFLICT (content) in `plans/traceability.md`.**
  - The merge-base is `91024242`.
  - The branch appended `ABC-152 (build)` and `ABC-152 (QE)` at the table tail. `main` appended `ABC-152 (design, QE
    rulings)` at the same tail.
  - **Append against append, with no overlapping edit** (`QE-152-k`, INFO).
- **The real merge:**
  - a detached scratch worktree at `49997a87`, with `node_modules` cloned;
  - `git merge --no-commit --no-ff main`;
  - `git merge-file --union` on the trace file: **0 markers**, and all four `ABC-152` rows are kept.
- **What came in from `main` outside `.grugops/`:** `ADR-0042` (addendum 2), `plans/board.md` and the resolved trace
  file.
- **The merged tree:**
  - lint, typecheck and build exit 0;
  - `npm test` exits 0 at 56 / 1741, with 0 `deprecat` lines;
  - skip 0; integrity `No findings.`; inventory 56 = 56.
- **`git merge --abort`**, the worktree was removed, and nothing was committed. `main` is still `9ad2c5f5`.
- **This hop's own commit appends one more tail row to the branch's trace file.** The conflict stays, and it
  resolves the same way (keep both sides' rows).
