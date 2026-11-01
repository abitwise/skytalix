---
subtask: se-ABC-248
role: software-engineer
ticket: ABC-248
ref: .grugops/context/se-ABC-248/
branch: new grugops/ABC-248 from main (worktree .claude/worktrees/se-ABC-248)
width: ALONE (no other hop runs). Record load1 and foreign processes with any timing. Leave no process running.
---
# SE ABC-248 (S, P1, test-only): ADR-0046 tranche 2 — T2c + T2a (narrow) + T2d; the default lane sheds ~0.3 s, no coverage lost
## Read
- The ticket page plans/tickets/ABC-248-*.md in full: Scope table, Out of scope, BA/PM ruling conditions 1–5, acceptance, Test notes. Line numbers there are as read at 209f4c5f; re-read them at main.
- ADR-0046 § Addendum 2026-10-31 (T2-R) and § BA/PM ruling 2026-10-31; ABC-244's page (conditions 1–3, step rule); ABC-177 A6 (M01–M11).
- Carried to this ticket: QE-244-a (the R4 re-run of the CLI ABC-241 A4/A7 mutant check, if any step, LEVELS[5].budgetMs or NODES_PER_CLOCK_CHECK moves; this ticket fences those rows out, so confirm none moves) and QE-245-b (see the ABC-245 page CLOSED block).
## Do
- Freeze the mutant list (incl. WRONGSIDE) in a committed PREREG before any head run.
- Each lever with its own evidence, separately revertible: T2c-a, T2c-b (non-vacuity and plant parity), T2a narrow (default-lane kill parity; a sole killer stays), T2d (step by kill-set parity; census of at most two more rows).
- Gates via `npm run …`; npm test green, 0 skips; skip-integrity and lane inventory clean; ENGINE_DEEP=1 run of the moved describes passes. One informal G8 read (head vs main) with load1; QE owns the gate (W1).
- A lever that fails its condition stays as it is: record it, do not force it. A STOP if the page's conditions cannot be met as written.
## Fences
- Only src/search.null-move.test.ts and src/uci-session.test.ts. Shared helpers byte-identical. No production line, no vitest.config.ts, package.json, AGENTS.md, tools/, data/. No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec.
- Waiting: `kill -0 <pid>` or poll a file; never `while pgrep -f`; never vitest on the same command line as a wait. Thermal stop: Tctl median > 85 °C.
- Scratch `se-248/`.
## Publish
Sealed notes (task `se-ABC-248`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-11-01, Software Engineer. Done. Branch `grugops/ABC-248` (worktree `.claude/worktrees/se-ABC-248`, from main `46365ed0`). PREREG `7e9ab524` (before any head run), code `71700836`, notes `7235b58b`. Not merged and nothing pushed. Two test files only, no production line, so the UAT waiver holds.**

- **PREREG `7e9ab524`.** `frozen-uci.json` (`013a860f…`) has 137 mutants that apply. They include M01–M11, with M06 and M07 re-anchored. They also include `WRONGSIDE`, WS-WHITE, WS-BLACK, MOVETIME-OFF, MOVESTOGO-1, L5-3000/4500 and the rest of qe-ABC-177's union. `frozen-plants.json` (`23811b19…`) has 26 plants that apply, the three `ADR-0050` plants first. Each lever's rule was fixed in the PREREG. Each lever ran as its own arm and then all together, so each reverts alone.
- **T2c-a: KEPT.** `QE-208-a` samples the even readings 4..24 (Σ 154 < 322), and its title says so. `insideNull` is 4 at the tip (5 at base). `engine-no-finally` is still red, and the row kills the same set at base and tip.
- **T2c-b: KEPT.** Both `QE-208-b` rows are re-rooted on `startpos` at depth 6 and retitled. `underNull` is 19/19 at the tip (44/44 at base), and `stale` is []. The search-/engine-stale-null-key plants red their rows at the tip as at base. Per-row kill sets are equal, and the whole file is 26 → 26.
- **T2a.** Four rows **MOVED** to `ABC-167 A5 — … [deep, ENGINE_DEEP=1]` under `RUN_ENGINE_DEEP`, placed before A11: "a bare go", "G = 3 500", "movetime 100" and "A5-b3". Two rows **STAYED**:
  - "white reads wtime" is the sole default-lane killer of WS-WHITE.
  - "black reads btime" is the sole default-lane killer of WS-BLACK.
  - Together these two are the only killers of `WRONGSIDE`.
  - Default-lane parity: 120 → 120 killed, none lost. Every staying A5 row kills the same set.
- **T2d: A4-a2 step 1 000** (reads 40 → 4). Its kill set is identical, 8 ids. **Census: 0 rows join.**
- **Counts.** `search.null-move` 38 = 38, with only the 3 ruling-5 retitles. `uci-session` 234 → 230, with exactly the 4 moved names gone. Lane 2 366 → 2 362.
- **Gates.** `npm test` 2 362/2 362, 0 skipped. Lint, typecheck and build exit 0. Skip-integrity and lane inventory (63 = 63) both report "No findings.". Helpers are byte-identical. With `ENGINE_DEEP=1`, the moved describe runs 4/4 green. With `ENGINE_DEEP` unset, the rows are not defined.
- **Informal G8** (b h h b, ALONE). The arms read 9.38 / 9.00 / 9.06 / 9.33 s at load1 0.58 / 0.87 / 1.28 / 1.86 and Tctl ≤ 74 °C. The only foreign process was `abtop` at about 6 %. H 9.03 s, B 9.36 s, H − B ≈ −0.33 s. This is n = 2 and `UNKNOWN - verify`; QE owns A9 under W1.
- **SE-248-a (MEDIUM).** Ruling 6's `-t "<moved describe>"` runs 0 tests with exit 0, because `[deep, …]` is a regex character class. Use `\[deep, ENGINE_DEEP=1\]`. SE-248-b/c/d are INFO (findings note).
- **Notes.** Decision `…237b57fb`, census `…b9dc61b6`, readings `…64b1718e`, findings/artifacts `…aedad93f`. Sealed with `admitAndAppend`, contextRoot = worktree, and 4/4 read back.
- **Carried.** QE-244-a: no step, `LEVELS[5]` or `NODES_PER_CLOCK_CHECK` move, and `cli.test.ts` is untouched. QE-245-b: carrier delivered.
- **STOP:** none.

### Trace row (10 cells, header order)

| ABC-248 | Tranche 2: QE-208-a even readings 4–24, QE-208-b on startpos, ABC-167 A5's 4 duplicated rows to ENGINE_DEEP (wtime/btime stay), A4-a2 step 1 000; census 0 | EPIC-010 | ADR-0046 § Addendum 2026-10-31 T2-R (BA/PM ruling 2026-10-31) | NFR-008 G8 owed (A9, W1; informal H 9.03 s / B 9.36 s, n = 2); N8-LANE owed (A8); R1 census A1 recorded | grugops/ABC-248 @ 71700836 (PREREG 7e9ab524, notes 7235b58b): src/search.null-move.test.ts, src/uci-session.test.ts (test-only) | npm test 63 files / 2 362 pass (−4 moved), skips 0; SE parity 137 mutants 120 → 120, plants 26 → 26, per-row sets equal; deep describe 4/4 | waived (zero production lines) | — | In Review (branch, not merged; QE A5–A11) |
