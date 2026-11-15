# qe-ABC-325 observation: the v1.1.1 candidate on `grugops/ABC-325` (tip 2aac1bfe) closes G-QE-324-1/2/3 with no figure changed, bumps 1.1.0 to 1.1.1 in the two places it lives, carries a Keep a Changelog `[1.1.1] - 2026-11-15` entry, and changes `src/` by one comment line. Every figure re-derives, markdown renders clean, both `--version` print `skytalix 1.1.1`, and lint, typecheck, 72 files / 2740 tests and the build are green under the host lock

QE/E2E, task `qe-ABC-325`, branch `grugops/qe-ABC-325` from `grugops/ABC-325` `2aac1bfe` (merge base with `main` `79fa5cb1`; `main` at `eb7c671e`), 2026-11-15. The change under test is the SE's work commit `e3db946e`: `README.md` (blob `ea63cbe2`), `CHANGELOG.md` (blob `e18b85f0`), `package.json`, `package-lock.json` and `src/version-file.ts` (blob `2a73124f`). No game, no engine match, no tag, no `src/` edit, nothing fixed. The check scripts are in `raw/scripts/` (`arith.mjs`, `render_check.py`, `src_tokens.mjs`). They only read, and they take paths as arguments. Copies of `main`'s files were written to `<scratch>`.

## Scope of the change
- `git diff --stat main...grugops/ABC-325`: `README.md` +12 −8, `CHANGELOG.md` +7 −1, `package.json` +1 −1, `package-lock.json` +2 −2, `src/version-file.ts` +1 −1, plus the SE's own queue records and note.
- The README diff is confined to line 61 (the `--version` example) and the Levels and Strength sections (lines 83–110). Lines 1–60, the table rows and `assets/` are unchanged.

## 1. G-QE-324-1/2/3 (input: `qe-ABC-324/raw/notes/note-verdict.md`, sha256 `c1acbe7a69c7afd69c221b6ac8f8a7ea2e01b075ce136cc894a887b94ef2a226`, the pin in qe-ABC-324's QE block)
- **G-QE-324-1, closed.** Strength now opens "One measured figure at 100 ms a move, on one scale: X = 1902.5 ± 49.1." The section's second figure is level 5's 2413 ± 51 at 4 s, so the sentence is true. The old phrase "One measured figure, on one scale" is gone.
- **G-QE-324-2, closed.** Levels P2 (the measured paragraph) ends "How each level's time per move moves Stockfish's strength at a given `UCI_Elo` was not measured." That covers levels 1 to 5. The level-5 paragraph keeps its 4 s vs 1 s fact and drops its own "was not measured" sentence. In Levels+Strength, "was not measured" occurs once and "at a given `UCI_Elo`" occurs once. A sentence-level scan finds no duplicate sentence.
- **G-QE-324-3, closed.** The projection paragraph now says "That cost is assumed, not measured: about 10 to 14 Elo for each percentage point of blunder rate, so 50 to 70 at level 4's 5 %." This matches v1.1.0's README (`git show v1.1.0:README.md`, lines 81–82) word for word in its figures. The +73 to +79 is no longer called "measured": "That rate is derived, not measured: from the Strength section's measured 1902.5 at 0.1 s and level 4 at 1 s, with the same cost added back." The phrase "measured under 1 s" is gone.
- **"see below"** occurs once, in P3 (projections). The next paragraph, P4, is the level-5 Stockfish paragraph: "Level 5 measured above its projection of about 2240 to 2320. Stockfish had 4 s a move against level 5 and 1 s against level 4, …".
- **No figure changed.** I compared every number token in `main`'s Levels+Strength sections with the branch's. Branch-only tokens: `0.1 1 10 100 14 1902.5 4 4 4 5 5 50 70`. Main-only tokens: none. Each branch-only token restates an existing figure: the cost 10–14 / 50–70 from v1.1.0, 1902.5 at 0.1 s and 100 ms from Strength, and level 4's 1 s and 5 %. The table rows are byte-identical to `main`.
- **Arithmetic re-derives** (`arith.mjs`; inputs L5 2412.9, L4 2094.3, Strength 1902.5):
  - Cost at 5 %: 5 × 10–14 = 50–70.
  - Level 4 without blunders: 2144–2164.
  - Sub-1 s rate: (2144…2164 − 1902.5) / log2 10 = 72.70–78.72, from the README's 2094. From the recorded 2094.3 it is 72.79–78.81. Both print as "about +73 to +79".
  - Level 4 to level 5: (2413 − 2164…2144) / 2 = 124.5–134.5, from the README. From the records it is 124.3–134.3. Both print as "about +125 to +135".
  - The bottom +50 is below +73, as the text says.
  - L6 2479.0–2578.1 and L7 2542.4–2736.6, outward to ~2470–2580 and ~2540–2740. These are unchanged.
  - Strength: 1810 + 92.5 = 1902.5, and 63 % gives +92.46.
- **Rendering** (markdown-it-py 3.0.0, CommonMark with the GFM table):
  - Levels+Strength has 2 headings, 7 paragraphs and a 4 × 8 table. There is no list, code, blockquote, html or hr token.
  - The wrapped lines that start with `+125 to +135` (README 90) and `5 %. The bottom` (README 92) are not list markers.
  - The only list starts in the README are the pre-existing numbered GUI steps (lines 169–220), outside this diff.

## 2. Version
- `package.json` `version` is 1.1.1. `package-lock.json` changes on 2 lines: root `version` and `packages[""].version`, both 1.1.1. `npm ci` on the branch exited 0.
- The remaining `1.1.0` strings outside history are `package-lock.json` lines 1070, 1071 and 1149, all `@standard-schema/spec` (a dependency). `1.1.1` at lock lines 1538–1579 is `picocolors`. Neither is skytalix.
- The README example (line 61) reads `skytalix 1.1.1`.
- `src/version-file.ts` is comment-only. Line 2 sits inside the opening `/** … */` block and changed from `skytalix 1.0.0` to `skytalix X.Y.Z`. `src_tokens.mjs` (TypeScript scanner, trivia dropped) gives 66 code tokens on `main` and 66 on the branch, identical. `git diff --numstat` gives `1 1 src/version-file.ts`, the only `src/` file.
- The remaining `skytalix 1.0.0` strings are CHANGELOG line 78 (the released `[1.0.0]` entry, history) and VERSIONING.md line 18 ("for example `skytalix 1.0.0`"). See the verdict, G-QE-325-1.
- `--version` (after the build, each under the lock):
  - `node src/cli.ts --version` (the `chess` script's command) prints `skytalix 1.1.1`, exit 0.
  - `bin/skytalix-uci --version` prints `skytalix 1.1.1`, exit 0.
  - `dist/` did not exist before this build, so the launcher ran fresh output. `dist/version-file.js` line 2 carries the `X.Y.Z` comment.

## 3. CHANGELOG
- Headings, in order: `## [Unreleased]` (empty body), `## [1.1.1] - 2026-11-15`, `## [1.1.0] - 2026-11-11`, `## [1.0.0] - 2026-11-10`. The date is today, UTC.
- The `[1.1.1]` body begins with `main`'s `[Unreleased]` body verbatim (the merged ABC-324 content). The only addition is one `### Changed` bullet: "README Levels and Strength sections: wording made exact, with no figure changed. The Stockfish time caveat covers every measured level again, and level 4's assumed blunder cost behind the projections is stated." The bullet is true by checks 1 and 2.
- The `[1.1.1]` shape is a paragraph, then `### Changed`, then a list. That is `[1.1.0]`'s shape: lead text, then `### Changed` and a list. `[1.1.0]` and everything older are byte-identical to `main`.
- Link definitions:
  - `[Unreleased]: …/compare/v1.1.1...HEAD`
  - `[1.1.1]: …/releases/tag/v1.1.1`
  - `[1.1.0]` and `[1.0.0]` are unchanged.
  - Every version heading has a link, and no link is unused.
- **PATCH per VERSIONING.md.** "PATCH: fixes and docs that do not change how the engine plays." The diff is docs, the version field and one `src/` comment, whose code tokens are identical. Nothing changes how the engine plays, and no UCI option, flag or launcher changes.

## 4. Art
- `sed -n '8,13p' README.md | cmp - assets/readme-art.txt` exits 0 (identical, 6 lines) on the branch and on `main`. `assets/` is unchanged in the diff.
- ABC-319's old recipe compared fixed lines that moved when the logo block (README lines 1–5) was added. Info only, as the brief says.

## Gates (each alone under `flock <scratch>/host-test.lock`, on the branch tip plus this QE's uncommitted scripts)
| gate | result |
|---|---|
| `npx biome check .` | exit 0, "Checked 150 files … No fixes applied." |
| `npx tsc --noEmit` | exit 0 |
| `NODE_OPTIONS=--max-old-space-size=128 VITEST_MAX_WORKERS=1 npx vitest run` | exit 0, 72 files passed, 2740 / 2740 tests passed, 0 failed, 0 skipped (vitest 4.1.12) |
| `npx tsc -p tsconfig.build.json` (build) | exit 0 |
| `node src/cli.ts --version` | `skytalix 1.1.1`, exit 0 |
| `bin/skytalix-uci --version` | `skytalix 1.1.1`, exit 0 |
| `node tools/grugops/records-path-check.js --base main` | clean, before each commit |

Node v26.12.1.

## Waiver reference command (AGENTS.md, 2026-08-17)
- `git -c core.quotePath=false diff --name-only main...grugops/ABC-325 | grep -v '\.test\.ts$' | grep '^src/'` prints `src/version-file.ts`. It is not empty, so by its letter the zero-production-lines waiver does not apply, even though the change is a comment.
- UAT is then signed per the 2026-10-22 ruling, on this QE verdict. That call is the Orchestrator's.

## Not checked
- `npm run chess -- --version` itself was not run, because the session guard refuses `npm run`. Its command, `node src/cli.ts` (package.json line 22), was run.
- No game or engine match, per the brief's width.
