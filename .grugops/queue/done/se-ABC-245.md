---
subtask: se-ABC-245
role: software-engineer
ticket: ABC-245
ref: .grugops/context/se-ABC-245/
branch: new grugops/ABC-245 from main (worktree .claude/worktrees/se-ABC-245)
width: two records-only hops beside you (no vitest). A stray process may hold one core; record load1 with any timing.
---
# SE ABC-245 (XS, P3, test-only): a far-back third occurrence turns a lowered prior-keys cap red
## Read
The ticket page (every dated block, the RE-SCORED block included); ADR-0046 § Addendum R1–R4 and § Ruling 2026-10-31; ADR-0054 § Proposed amendment (ACCEPTED);
qe-ABC-242's plants note (…93eb0bf9; CAP8/CAP50) and se-ABC-242's notes, on main under .grugops/context/.
## Do
- Build the row(s) the ticket asks for, in src/levels.test.ts only, plus the stale header count (SE-242-f).
- Step 10 per level call, unless the ticket's fallback applies. Add the R1 census line.
- Show the row red with the cap lowered to 8 and to 50, green at 100, and not 0 on base (scratch plants only).
- Gates via `npm run …`; report the test count. Take an informal G8 wall and note load1.
## Fences
- src/levels.test.ts only. No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. No host paths.
- Waiting: poll an output file or `kill -0 <pid>`; never `while pgrep -f …`. Never put vitest on the same command line as a wait.
- Leave no process running at hand-back.
- Scratch `se-245/`.
## Publish
Sealed notes (task `se-ABC-245`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-10-31, Software Engineer. Done. Branch `grugops/ABC-245`, from `main` `9c008db4`. Code `7e81732e`; the notes, brief and claim are in the next commit. Not merged, nothing pushed.**

- **Row:** one, in `src/levels.test.ts`, nested at the end of the `ABC-242` block (no `ABC-242` row edited): "ABC-245 — a third occurrence whose earlier two lie more than 50 plies back" › "A1–A3: it scores exactly 0 with legal − 1 child searches at matches −98 and −94; base reads it otherwise". Decision `…69e64b77`.
- **Fixture:** a legal reversible KQ v K game from the probe FEN `4k3/8/8/8/8/8/8/1Q2K3 w - - 0 1`: a 4-ply cycle back to the start, 93 plies with no repeated position, then the loser's `d7e8` re-makes the start. Earlier occurrences at **−98 and −94** (nothing in −4…−92); child clock 98 (under the 50-move claim); 97 trimmed keys + root key = 98 ≤ 101. Head: `d7e8` exactly 0, 7 child searches for 8 legal moves. Test-local base at the same step: −1005.
- **Header (SE-242-f):** "DEFAULT (`npm test`, 19 tests)" → **46 tests** (the file's default-lane count as run).
- **R1 census** (`…c1655da6`): level 1's 100 ms, step 10, **10 reads per level call**; per-child budgets as handed 2.5, −25, −52.5, −80, −95, −122.5, −150 ms (depth 1 each; call elapsed 290 virtual ms). A2's kill set and A3 hold at step 10, so no fallback to step 1.
- **Plants (scratch, never committed; `src/levels.test.ts` alone):** cap 8 → row **red** (`d7e8:-1005` ≠ `d7e8:0`), 45/46; cap 50 → row **red**, 45/46; cap 100 → **green** 46/46; base `4387d4e8` `src/levels.ts` → row **red** (−1005, not 0), plus `ABC-242` A1 ×3 and A5 (41/46).
- **Gates** (`…bce18931`): lint, typecheck, build exit 0. `npm test` 63 files, **2 364 passed**, 0 skipped; skip-integrity `No findings.` Informal wall 9.30 / 9.41 / 9.24 s (median 9.30 s), load1 1.14–2.11, head only, two hops beside it: not `G8`.
- **Findings** `…f0b04c75`: SE-245-a..c, INFO. No UAT (no production line). QE re-runs Q6/Q8 on the whole lane and reads `G8`.
- STOP: none.

### Trace row (10 cells, header order)

| ABC-245 | A blunder row reads a third occurrence whose two earlier occurrences lie 98 and 94 plies back, so a lowered prior-keys cap turns the lane red; levels.test.ts header count corrected (test-only) | EPIC-010 | ADR-0054 § Proposed amendment (accepted); ADR-0046 § Addendum R1–R4, § Ruling 2026-10-31 | NFR-008: 0 real-clock rows; R1 census 10 reads per level call at step 10; informal tip 9.30 s, G8 owed | grugops/ABC-245 @ 7e81732e: src/levels.test.ts | npm test 63 files / 2 364 pass, skips 0; plants cap 8 red, cap 50 red, cap 100 green, base red (−1005) | No UAT (test-only, no production line) | — | In Review (branch, not merged; QE and G8 owed) |
