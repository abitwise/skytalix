---
id: 20261019T194000Z-qe-e2e-observation-abc174-gates-lanes-a6-criteria-3f8c1d27
kind: observation
by: qe-e2e
task: qe-ABC-174
at: 2026-10-19T19:40:00Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-174
  - ADR-0045
  - ABC-087
  - ABC-085
  - ABC-101
  - ABC-171
  - ABC-167
  - NFR-004
  - plans/tickets/ABC-174-re-cut-the-level-table-per-adr-0045-the-default-moves-to-level-5-and-plays-as-today.md
  - .grugops/queue/done/ticket-to-pr-ABC-174.md
supersedes:
---

# ABC-174 at `be6a5599`: gates green after the reboot, A6 green, A1–A5, A7 and A8 hold

Hand-authored and unsealed: the sanctioned writer is absent on this install (`AGENTS.md`). This is an observation, not a
stamp. The scratch worktree was `../wt-qe-ABC-174`, detached at `be6a5599`, with `node_modules` symlinked from main.

**Host:** Mac.lan, 8 cores, Darwin 25.5.0, node v26.11.1, vitest 4.1.11. It had been up about 15 min when this hop
started (19:14Z). User processes were 486–516 against `ulimit -u` 2666. load1 was 4.6 at the start and fell to about 2.5.

## Gates (resume check), one at a time, each in its `AGENTS.md` form
| gate | exit | reading | procs / load1 before |
|---|---:|---|---|
| `npm run lint` | 0 | 116 files, no fixes | 512 / 5.51 |
| `npm run typecheck` | 0 | — | |
| `npm run build` | 0 | — | |
| `npm test` | 0 | 59 files, **1987/1987**; `last-run.json`: `success: true`, 1987 total, 0 failed, 0 pending, 0 todo | 515 / 5.42 |
| skip count | — | **0** | |
| `test-skip-integrity.js … --skip-count 0` | 0 | `No findings.` | |
| `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts` | 0 | 11/11 | 516 / 5.72 |
| `PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/perft.test.ts` | 0 | 32/32 | 497 / 5.23 |

These match the SE's figures on `be6a5599`.

## A6, the deep lanes (QE's readings)
- **`ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts`:** exit 0, **35/35**, 103.45 s.
  Run 19:35:08Z, procs 463, load1 2.50 → 3.12.
  - `ABC-087` A2 (virtual clock, ±20 %): level 1 102/100, level 2 187.2/180, level 3 336.6/330, level 4 1020/1000, level 5
    3060/3000. Blunder path 101.3/100 (20 and 43 children).
  - `ABC-087` A3: easiest **31/58**, default **54/58** (strictly fewer).
  - `ABC-087` A4: ENDGAMES 81/204 = 39.7 %; perft + puzzles 96/242 = 39.7 % (against 40 %, ±5 pp).
  - **`ABC-087` A5 (real clock, level 5 = 3000/0): 30/30, max 3007 ms**, all within 3000–3007 ms (≤ 5 000).
  - `ABC-174` A3 ran in 57 ms on the default lane's step 1000.
- **`LADDER_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts`:** exit 0, **18/18**, 69.57 s.
  Run 19:37:00Z, procs 464 → 460, load1 2.95 → 3.27.
  - `ABC-085` A3 (claim policy and ply cap, five rows), A4 (replay check), A5 (1v2 reproduces, digest
    `197410d21aed4a42` twice): green.
  - The short-mode games are **not graded**, and no A1/A2 claim is made (D6.8). For the record, the stronger level
    scored: 3v4 4/4, 4v5 4/4, 2v3 1.5/4, 1v2 2.5/4, 1v5 10/10, at step 120.

## Criteria
- **A1:** the D1 deep-equal and frozen row is green. The merged ordering row is unedited (`git diff` does not touch it).
  Wrong builds M01, M02, M05–M07, M21 and M22 red it.
- **A2:** `[1, 5, 5]`, `{ DEFAULT_BUDGET_MS, 0 }`, and `DEFAULT_DIFFICULTY === DEFAULT_LEVEL`. `ABC-101` A2 is folded to
  the maximum. Wrong builds M10–M14 red it.
- **A3:** 30/30 for seeds 1 and 87 at step 1000. A no-flag CLI resolves 5, and `ABC-101` A8′ is green. Wrong builds M10,
  M11, M18 and M19 red the A3 row itself. The step grading is in `…c41d7e2a`.
- **A4:** the numstat over `src/engine.ts src/search.ts src/virtual-clock.ts src/level-seam.ts` is empty. In
  `src/levels.ts`, the `-U0` hunks are comment lines 37–40, entries 2–5 (lines 46–49 at the tip) and `DEFAULT_LEVEL`.
  The bodies of `createLevel`, `blunder` and `seededRandom` are untouched. The keys row is green.
- **A5:** the option line is a template on `DEFAULT_LEVEL`, with a second row for the literal. At the default, a bare
  `go` has a score, a time within the bound and 0 draws, and `go depth 3` reports depth 3. At skills 3 and 4, `go depth 3`
  gives one `info string`, a level line with no score, then `bestmove`. `ABC-171` A6 reads 1 → 100, 3 → 330 and
  5 → 3000. Wrong builds M03, M04 and M15–M17 red it.
- **A7:** data rows green. The R1 clamp row and `ABC-087` A5 are unedited, and A5 reads max 3007 ms above.
- **A8:** `--name-only` lists exactly the 7 named files. The `src/cli.ts` hunk is one comment line (27). Every page pin
  is re-pinned at equal or stronger strength (`…8a2e5b90`). No other pin moved.
- No stale "level 3" default text remains in production `src/`. A grep for `level 3`, `4_500`, `default 3` and
  `difficulty 3` outside test files found nothing.
