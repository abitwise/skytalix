---
id: 20261017T125103Z-ba-pm-observation-cut-followups-readings-85e8dfdd
kind: observation
by: ba-pm
task: bapm-cut-followups
at: 2026-10-17T12:51:03Z
verified_by:
confidence: high
refs:
  - QE-024-a
  - QE-056-a
  - QE-056-b
  - QE-030-a
  - QE-155-a
  - QE-101-a
  - QE-101-b
  - SEC-101-a
  - AR-095-CWD
  - AR-095-L1UNIT
  - AR-095-READ
  - QE-095-b
  - QE-095-c
  - QE-095-d
  - QE-040-c
  - QE-156-a
  - ABC-146
  - ADR-0038
  - ADR-0043
supersedes:
---

# Re-measure of the 15 follow-ups at `main` `1671f24f`: every LOW/MEDIUM gap still reproduces, and three were found wider than recorded

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). **No timing was read**: an SE hop
was running in `wt-ABC-096` beside this one, so every reading is a count or a pass/fail, never a wall time.

**Method.** `git archive 1671f24f` was extracted into the session scratchpad (outside the repository), with
`node_modules` symlinked from the main checkout. Each plant went into its own copy of that tree. The worktree
`wt-bapm-followups` holds no plant, and `git status --porcelain` there showed only this hop's files. The lane is
`npx vitest run` (default, 58 files / 1810 tests on the unmutated tree) unless a narrower one is named.

| item | plant / reading | result at `1671f24f` |
|---|---|---|
| 1 `QE-024-a` | `src/moves.ts:337` → `if (position.castling === 0) continue;` | default lane **1810/1810 green** (survives) |
| 1 witness | `legalMoves` count on `r3k2r/8/8/8/8/8/8/R3K2R` `w K`, `w Q`, `b k`, `b q`, `w kq`, `b KQ` | delivered 25/25/25/25/24/24; mutant 26 on all six |
| 2 `QE-056-a` | G1 (subdir import), G2 (`./../node_modules/…`), G3 (`await import (x)`), G4 (`process.getBuiltinModule`) planted together | checks 5a empty, 5b empty, 5c `node:fs`: **all as recorded** |
| 3 `QE-056-b` | current values | `scripts.chess` = `node src/cli.ts`; `package.json` keys hold no `dependencies`/`optionalDependencies`/`peerDependencies`/`bundleDependencies`; 0 of 122 lockfile packages lack `dev: true`. No AR-1 check reads either |
| 4 `QE-030-a` | joined-text search of `src/*.ts` for a number word in a sentence citing `plans/nfr-catalog.md`, plus an ordinal grep | **4 sites**, not 2: `status-panel.nfr` "three times", `history-pane.nfr` "five times now", `turn-loop.nfr` "sixth bar", `san.nfr` "twice". The first three count the same thing and disagree |
| 5 `QE-155-a` | `compile.ts:168` → `slice(-8)` (Q-SUFFIX8) and `slice(8)` (Q-SKIP8) | `tools/opening-book/book.test.ts` **19/19 green** on each |
| 6 `QE-101-a` | P11: `createLevel(…)` inside the returned seam function | default lane **1810/1810**; with `A8′` at `call < 3`, `src/cli.test.ts` reds (1 failed) |
| 6 `SEC-101-a` | S2c: `next !== undefined && /^[1-5]$/m.test(next) ? next : undefined` | default lane **1810/1810**; with `"3\n"` added to `refusedValues`, reds (1 failed) |
| 6 `QE-101-b` | P9a: slot `--difficulty 1\|2\|3\|4` | default lane **1810/1810** |
| 6 NEW | P9e: slot `--colour white\|random` (drops `black`) | `src/cli.test.ts` **78/78 green**. `black` occurs twice in the slot (the `-- --colour black` example) |
| 7 `AR-095-CWD` | P6b: `readFileSync("data/opening-book/book.json")` | `CLI_DEEP=1 … src/cli.real-engine.test.ts` **10/10 green** |
| 8 `AR-095-L1UNIT` | scratch git repo, one commit: `src/book-file.ts` reads `"/etc/passwd"`; `clause-b.mjs <base> <head> 1/2/3` | **does not fire** on limbs 1, 2, 3; by-hand Ruling 2 diff prints `src/book-file.ts`. Instrument unchanged since `341da4c1` |
| 8 `AR-095-READ` | `package.json` `private: true`, `bin`/`main`/`exports`/`files` null; `book-file.ts:16` reads a constant module-relative URL | trigger not fired |
| 9 `QE-095-b` | P2: `withBook` calls the probe, discards the hit, always searches | default lane **2 failed** (`book-engine.test.ts` `A1`, `A4`): covered by composition |
| 9 `QE-095-c` | P7: a book probe built per move in `cli.ts`'s `engine:` | default lane **6 failed** (`ABC-042` `A9`, `ABC-043` `A1`/`A2`/`A6`/`A7`, `ABC-044` `A6`); `CLI_DEEP` 10/10 green. `src/book.test.ts` `ABC-094` `A5` pins "warn exactly once" at unit level |
| 9 `QE-095-d` | `abc095-book-absent-*` under `os.tmpdir()` after three `CLI_DEEP` runs here | **0** |
| 9 `QE-095-e` | the copy rule's wording | wrong on `ABC-095` test note 4 (`:260`) and `ABC-119` § Amendment (`:407`), both `Done`; **right** in `ADR-0037:41` and in `src/cli.real-engine.test.ts:112-130` |
| 10 `AGENTS.md` | `wc -c`; `CLI_DEEP` lane; default lane | **24,576 B** (0 B headroom); `CLI_DEEP` 10 passed (1 default) vs "7 passed" at `:132`; 58 files / 1810 vs "57 files, 1775" at `:85` |
| 11 `QE-156-a` | `plans/metrics.md:2-3` | two `_Updated:` lines, no blank line, no trailing `\` |
| 12 `QE-040-c` | GFM cell count (unescaped `\|` separates) over `plans/traceability.md` table rows | **10 rows** not at 10 cells: 626, 627, 735, 951, 982, 1001, 1006, 1099, 1101, 1103 (QE counted 5; 1099/1101/1103 appended 2026-10-17). The paragraph at `:377-378` names `ABC-009`/`011`/`015`/`019`, which split to 10 |
| 13 ADR-0038 | `grep -nE '^#+ .*PROPOSED'` | `:196`, `:235` say PROPOSED; § Status `:12` says ACCEPTED 2026-10-11 |
| 14 `ABC-146` | page, harness | no amendment for the 2026-10-12 owner word on the page; `src/ladder.test.ts` md5 `bba67b75…` = `1031911b`; `LADDER_DEEP=verdict` accepted (`:70`); no wall timeout (`:552-556`) |
| 15 ADR-0043 | D3 wording vs `packRegion` | D3 says code points (`:82-87`); the artifact holds 0 astral code points (ADR `:39`), so both units give the same cut on every shipped family; `ABC-096` `A4` pins the astral case |

Scratch copies were left in the session scratchpad only, never in the repository.
