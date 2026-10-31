---
subtask: se-ABC-243
role: software-engineer
ticket: ABC-243
ref: .grugops/context/se-ABC-243/
branch: new grugops/ABC-243 from main ae7211c3 (worktree .claude/worktrees/se-ABC-243)
width: shared with a records-only BA/PM; no timed reads owed by the SE
---
# SE ABC-243 (XS, test-only): setoption-Hash row reads a bare go; TT memory row names its budget; QE-241-a UCI fen row
## Read
plans/tickets/ABC-243-the-setoption-hash-row-reads-a-bare-go-at-level-5-and-the-tt-memory-row-names-the-budget-it-reads.md (all FOLDED blocks; A1–A6; the ABC-244 census note: A1's bare go keeps step 100, census line owed), ADR-0046 § Addendum
2026-10-30 R1–R4, qe-ABC-241 QE-A4e and QM3 (on main under .grugops/context/qe-ABC-241/), QE-244-a carry (do not make ABC-241 A4/A7 shallower).
## Do
Build A1–A6 test-only; census line per new/changed real-search row; gates via `npm run …`; npm test count and an informal wall
(G8 headroom: 9.25 s; ABC-243 estimate ≈ +0.03 s). Reproduce QM3 red on the new A6 row (scratch only).
## Fences
Only the two test files the ticket names. Never push, force, amend, rebase, merge into main. No board edits. Never bare npx/npm exec. No host paths. Wait on jobs via output file or `kill -0 <pid>`, never `while pgrep -f`. Scratch `se-243/`.
## Publish
Sealed notes (task `se-ABC-243`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-10-31, Software Engineer. Done. Branch `grugops/ABC-243`, from `main` `4bd9ac6a` (same `src/`/`tools/`/`data/` as `ae7211c3`). Code `8772cf36`; notes, brief and claim are in the next commit. Not merged, nothing pushed. No timed read owed.**

- **A1:** the Hash row's level half sends `position startpos` + bare `go` and bounds `time` on `expectWithin(LEVELS[5].budgetMs)` (4 000..4 200, step 100). Book half and title unchanged. Decision `…c408ef9e`.
- **A2 (SE plants, scratch only):** L = 4, 6, 7 → red at tip (`time` 1 100, 5 100, 30 100); no plant → green. The base test file stays green for 6 and 7 (SE-228ii-a reproduced). QE records its own reds.
- **A3:** `src/transposition.test.ts` header `:19`, doc `:660` and title `:667` say "a 1 s and a `DEFAULT_BUDGET_MS` (4 s)"; 3 lines changed, nothing else.
- **A4:** diff touches only the two test files; `npm test` 2 322 → 2 323; the sorted names differ by the A6 row only.
- **A5:** lint, typecheck, build exit 0; `npm test` green, skips 0; the `ENGINE_DEEP` deep row ran once, green (5 094 ms). Informal wall: base 9.05 s (n = 1), tip 8.81 / 9.20 s (n = 2); `G8` is QE's.
- **A6:** the row in `ABC-241`'s UCI block, `go depth 4` → `bestmove d1e1`, `cp 0`; raw `keyHistory` list at the same root is not 0. QM3 on scratch: red at tip (`cp -875`), green on the base test file (QE-241-a reproduced).
- **Census (R1)**, observation `…9c3d34df`: Hash row, bare `go` level 5, 4 000 ms ÷ 100 = 40 reads, class P (was 35 at `GO_G3500`); A6 row fixed depth, no clock read.
- **Readings** `…a66447b8`; **findings + QE handoff** `…fd162ca2`: SE-243-a..e, all INFO.
- STOP: none.

### Trace row (10 cells, header order)

| ABC-243 | Hash row reads a bare go on LEVELS[5].budgetMs (catches a jump to any level); TT memory row names DEFAULT_BUDGET_MS; UCI row for a FEN carrying an uncapturable ep square (QE-241-a) | EPIC-010 | ADR-0046 § Addendum 2026-10-30 R1 | NFR-008 G8 owed (informal tip 8.81/9.20 s); NFR-009 bar unchanged; R1 census A1 = 40 reads | grugops/ABC-243 @ 8772cf36: src/uci-session.test.ts, src/transposition.test.ts (test-only) | npm test 63 files / 2 323 pass, skips 0; SE plants L4/L6/L7 red on Hash row, QM3 red on A6; ENGINE_DEEP deep row green | — (no UAT: test-only; QE verdict is the gate) | — | In Review (branch, not merged; A2/A6 reds and G8 QE) |
