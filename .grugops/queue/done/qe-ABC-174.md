---
subtask: qe-ABC-174
role: qe-e2e
ticket: ABC-174
branch: grugops/ABC-174 @ be6a5599 (from bd480c99)
ref: .grugops/context/qe-ABC-174/
---

# QE pass on ABC-174: level table re-cut per ADR-0045 (lean)

## What you are checking
The delivery at `be6a5599`. Break it and report the gaps.

## Read first
The ticket page `plans/tickets/ABC-174-*.md`, ADR-0045 (ACCEPTED, `…1a9c7f42`), the SE's done file
`.grugops/queue/done/ticket-to-pr-ABC-174.md`, `AGENTS.md` (lanes, heap caps, NFR-008 / NFR-010 rules).

## Check
1. **Gates first (resume check).** The host rebooted after the pause. Re-run the brief's gates on `be6a5599`, exactly as `AGENTS.md` spells each lane, one at a time, each with its `NODE_OPTIONS` prefix: lint, typecheck, build, `npm test` (`last-run.json` success true, full count), skip-integrity with skip count 0, `CLI_DEEP`, `PERFT_DEEP`.
2. **A6 deep lanes (yours).** `ENGINE_DEEP=1 … src/levels.test.ts` (ABC-087 A2–A5 incl. A5 ≤ 5 s on 30/30 at level 5 = 3000/0) and `LADDER_DEEP=1 … src/ladder.test.ts` short mode, ABC-085 A3/A4/A5 only (no A2 claim, D6.8). Record figures as your readings.
3. **Criteria and pins.** A1–A5, A7, A8 must each hold and fail on a wrong build. Mutants on scratch copies (e.g. a table entry, `DEFAULT_LEVEL`, `DEFAULT_DIFFICULTY`, the `uci-session.ts` option template, a blunder rate at 3/4). Check each re-pinned row in the SE's § Pins is equal or stronger strength, none loosened.
4. **Open ruling: A3 step 1000** (budget/3) instead of the brief's "10 or 100". Grade it: does the A3 equality row still discriminate at step 1000 (a mutant that changes move/depth/nodes at level 5 must still red)? Recommend keep or tighten.
5. **NFR-008 / N8-LANE.** The SE listed rows whose cost moved (new A3 row: 90 searches). Take the reading **only** in a foreground-verified quiet window (180 s, no foreign vitest, no `oeselg-labs/platform` process, no other hop). The host hit its per-user process limit (~2670 vs `ulimit -u` 2666) at ~21:40 +0300 before the reboot; record `ps -u $(id -u) | wc -l` and load1 at each run. If no window opens, mark **OWED**. Never estimate.
6. **Waiver.** Production lines are non-empty (4 src files) → UAT applies. Confirm.

## Fences
- Scratch detached worktree `../wt-qe-ABC-174`; remove it at the end. Keep forks low (no wide shell loops).
- Do not touch: `src/` on any branch, `plans/board.md`, `plans/traceability.md`, `../wt-ABC-174`, any process you did not start.
- Do not fix anything. Never push, merge or self-sign.

## Publish
- Notes under `ref:` (include a `kind: decision` note by `qe-e2e`). Use the sanctioned writer if available; otherwise hand-authored, unsealed, and say so.
- `.grugops/queue/done/qe-ABC-174.md` (this brief + `## Result`) and `.claim.md`, uncommitted: verdict, per-criterion grades, A6 figures, mutants, lanes, A3-step ruling, NFR-008 reading or OWED, gaps `QE-174-*`, waiver, trace row.

## Result (qe-e2e, 2026-10-19): **PASS_WITH_GAPS**. `N8-LANE` **MET**. The `NFR-008` total reads **NOT MET** (`QE-174-b`, to Security/NFR)

**Notes** (`.grugops/context/qe-ABC-174/notes/`) are hand-authored and unsealed, because the sanctioned writer is absent:
- `…3f8c1d27`: gates, lanes, A6, criteria;
- `…8a2e5b90`: mutants and pins;
- `…c41d7e2a`: the A3-step ruling;
- `…5d9a0f63`: the timing;
- `…e7b3c218`: the decision (verdict).

Probe scripts and raw readings are in `.grugops/context/qe-ABC-174/probe/`.

What I did not do: commit, push, merge, fix or self-sign anything. I did not touch `src/` on any branch,
`plans/board.md`, `plans/traceability.md`, `../wt-ABC-174`, or any process I did not start. The scratch worktree
`../wt-qe-ABC-174` was removed. User processes peaked at 516 against `ulimit -u` 2666.

### Per criterion
| criterion | grade |
|---|---|
| A1 | PASS. D1 deep-equal and frozen. The ordering row is unedited and green. Red under M01, M02, M05–M07, M21, M22. Thin spot `QE-174-c` (INFO) |
| A2 | PASS. `[1,5,5]`, `{DEFAULT_BUDGET_MS, 0}`, `DEFAULT_DIFFICULTY === DEFAULT_LEVEL`. ABC-101 A2 is folded to the max. Red under M10–M14 |
| A3 | PASS. 30/30 for seeds 1 and 87. No-flag CLI resolves 5. A8′ green. Red under M10, M11, M18, M19. Step-1000 ruling: **keep**, with `QE-174-a` (LOW) |
| A4 | PASS. The numstat over engine/search/virtual-clock/level-seam is empty. `levels.ts` hunks are comments, entries 2–5 and `DEFAULT_LEVEL`. The mechanism bodies are untouched. The keys row is green |
| A5 | PASS. Option line is a template plus a literal row. Bare `go` at the default has a score, time within bound and 0 draws. `go depth 3` → depth 3. Skills 3 and 4 give info string, a level line with no score, then bestmove. A6 table 100/330/3000. Red under M03, M04, M15–M17 |
| A6 | PASS (figures below) |
| A7 | PASS from the data. R1 and ABC-087 A5 unedited. A5 max 3007 ms. `QE-174-e` (INFO) |
| A8 | PASS. Exactly 7 files; the `src/cli.ts` hunk is one comment line. Every pin is equal or stronger, none loosened. No further pin moved |

### A6 figures (QE's readings, `be6a5599`, Mac.lan M3, node v26.11.1)
- **`ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts`:** exit 0, **35/35**, 103.45 s.
  procs 463, load1 2.50 → 3.12.
  - ABC-087 A2 (virtual clock): 102/100, 187.2/180, 336.6/330, 1020/1000, 3060/3000. Blunder path 101.3/100.
  - ABC-087 A3: easiest 31/58 < default 54/58.
  - ABC-087 A4: 81/204 and 96/242 = 39.7 %.
  - **ABC-087 A5: 30/30 at level 5 = 3000/0, max 3007 ms on the real clock (≤ 5 s).**
- **`LADDER_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts` (short mode):** exit 0,
  **18/18**, 69.57 s. procs 464 → 460, load1 2.95 → 3.27.
  - ABC-085 A3 (claim policy, ply cap), A4 (replay check) and A5 (1v2 reproduces, digest `197410d21aed4a42` twice):
    green. No A1/A2 claim (D6.8).
  - Ungraded games: 3v4 4/4, 4v5 4/4, 2v3 1.5/4, 1v2 2.5/4, 1v5 10/10, at step 120.

### Mutants: 22 run, 22 killed
The control was green first, 1987/1987. Each mutant ran the whole default lane once and was restored and checked with
`cmp`.
- **Table entries:** M01 (L1 budget), M02 (L2 budget), M03 (L3 rate → 0), M04 (L4 rate → 0, armed), M05 (L4 rate 0.1),
  M06 (L3 rate 0.2), M07 (L4 budget 900), M08 (L5 budget 3500), M09 (L5 rate 0.01), M21 (L3 rate = L4's),
  M22 (L2 rate = L1's).
- **Defaults:** M10 and M11 (`DEFAULT_LEVEL` 4 and 3, armed), M12 and M13 (`DEFAULT_DIFFICULTY` 4 and 3), M14 (parser
  seeds 3).
- **UCI:** M15 (literal `default 3`, armed), M16 (`DEFAULT_LEVEL - 1`), M17 (session starts at skill 3).
- **Mechanism:** M18 (+300 ms), M19 (×1.4), M20 (−1 ms; killed only by the QE-087-a spy).
- All three armed reds from the page reproduce. Raw output: `probe/mutants.out`.

### Lanes (each typed as `AGENTS.md` spells it, one at a time)
| lane | exit | passed |
|---|---:|---|
| lint / typecheck / build | 0/0/0 | — |
| `npm test` | 0 | 59 files, **1987/1987**; `last-run.json` `success: true`, 0 failed/pending/todo |
| skip count / integrity | — / 0 | **0** / `No findings.` |
| `CLI_DEEP` | 0 | 11/11 |
| `PERFT_DEEP` | 0 | 32/32 |
| `ENGINE_DEEP` levels | 0 | 35/35 |
| `LADDER_DEEP` short | 0 | 18/18 |

`PUZZLE_DEEP` was not triggered: no file on its trigger list changed.

R-167-1: the `globalThis|global|Reflect|constructor` grep over added `src` lines found nothing (rc 1).

### A3-step ruling: **KEEP step 1000** (`…c41d7e2a`)
- **Blind bands.** Any virtual step leaves a blind band about one step wide. The row's self-scaling step makes it blind
  to raises of level 5's budget from 3001 up to 4499 ms: M08 passes the row and is killed by 15 other rows. With the
  step fixed, it is blind to a cut of less than one step in `createLevel`: M20 is killed only by QE-087-a.
- **Cost.** Step 100 costs about 4.4 s and step 10 about 46 s. Step 1000 costs about 45 ms.
- **Tightening (`QE-174-a`, optional).** Add a second literal `virtualClock(1_000)` per side, for about 85 ms. The union
  reds every budget probed except 3000.

### NFR-008 / N8-LANE (`…5d9a0f63`): read in a foreground-verified quiet window
- **Windows.** Eight 180 s windows were tried. Windows 3, 7 and 8 were quiet. The rest saw another session's grugops
  vitest or a shell or iTerm process naming `oeselg-labs/platform`.
- **Attempt 1 (after window 7).** The narrow set was **VOID**: iTerm `pidinfo` on platform appeared in round 3, and
  load1 reached 11.5. The full lane was **NOT APPLICABLE**: load1 was above 8 before 4 runs.
- **Attempt 2 (after window 8, 20:12:39–20:18:52Z).** 0 foreign samples, load1 ≤ 7.79, at most 435 user processes.
- **`N8-LANE`, narrow set of 7 files, B = `bd480c99` vs H = `be6a5599`, n = 8, k = 2: MET at 650 ms.**
  - H−B CPU **+0.115 s** (interval +0.020..+0.170), sign 7/8.
  - Twin −0.030 s, **R 0.160 s, admissible**.
  - Wall, reported: +0.030 s.
  - load1 2.77–4.26.
- **`NFR-008` total, `npm test`, H vs H2: NOT MET.**
  - **Median wall 10.010 s** against 10 s, range 9.85–10.28. **R 0.280 s**, admissible.
  - **CPU reported: 27.73 s.**
  - load1 3.10–6.01.
  - Attempt 1 read 9.95 s, but was not applicable.

### Gaps
| gap | severity | what | route |
|---|---|---|---|
| `QE-174-a` | LOW | The A3 row's blind band: level-5 budget raises 3001–4499 ms, and `createLevel` cuts of under one step. The data rows and the spy cover both | SE test-only (a literal 1000 ms clock), optional; or accept |
| `QE-174-b` | **MEDIUM** | The `NFR-008` total at the tip is NOT MET: 10.01 s median wall, R 0.28 s. This ticket's narrow-set charge is only +0.115 s CPU / +0.03 s wall, and no full-lane base arm was run. This is the first capped full-lane figure (`R-173-1`). Its twin R (0.39 s CPU / 0.28 s wall) is due to replace the pre-cap full-lane `F` | Security/NFR rules the state at this gate. Architect/Design owns the row and the `F` record |
| `QE-174-c` | INFO | The rate column is guarded only by the D1 deep-equal: adjacent levels sharing a rate pass the ordering row | accept |
| `QE-174-d` | INFO | Ladder short step 120 > `LEVELS[1].budgetMs` 100. Short games among levels 1–3 do not inform ordering. No criterion is affected | `ABC-175` / Architect: note it |
| `QE-174-e` | INFO | A7's step-4 row hard-codes 4 rather than `VERDICT_STEP`. Both files pin 4 | accept |
| `QE-174-f` | INFO | The SE published no typed notes (disclosed). The done file carries the content | Orchestrator |

**Owed by others:** `AGENTS.md:59` (Scribe), the `NFR-004` catalog lines (Security/NFR), and `ABC-175`'s verdict before
UAT (owner Q3).

### Waiver
`git diff --name-only bd480c99...be6a5599 | grep -v '\.test\.ts$' | grep '^src/'` prints `src/cli-options.ts`,
`src/cli.ts`, `src/levels.ts` and `src/uci-session.ts`, and the per-commit form prints the same. **Production lines
are non-empty, so UAT applies (confirmed).** A green QE is not a signature.

### Next column
`In Review` → **`In Security/NFR`**, for `QE-174-b`, the `NFR-004` catalog lines and the `N8-LANE` reading. `QE-174-a`
is optional for the SE. Then `ABC-175`'s verdict, then UAT with the owner's word. The Orchestrator decides.

### Trace row (for the Orchestrator to append; QE did not edit `plans/traceability.md`)
`| ABC-174 (A1–A8) | ADR-0045 D1–D4; owner words …b2e6d4a9, …1a9c7f42 | grugops/ABC-174 @ be6a5599 (from bd480c99) | src/levels.ts, src/cli-options.ts, src/uci-session.ts, src/cli.ts, src/levels.test.ts, src/cli.test.ts, src/uci-session.test.ts | QE qe-ABC-174: gates green on resume (1987/1987 success true; skips 0 No findings; CLI_DEEP 11; PERFT 32); A6 ENGINE_DEEP levels 35/35 (ABC-087 A5 30/30 max 3007 ms at L5), LADDER_DEEP short 18/18 (A3/A4/A5 only); mutants 22/22 killed (3 armed reds reproduced); pins equal or stronger; A3 step 1000 kept; N8-LANE MET +0.115 s CPU (R 0.160 s); NFR-008 total npm test 10.01 s wall (R 0.28 s, load1 ≤ 6.01) NOT MET; 4 production files (UAT applies) | PASS_WITH_GAPS: QE-174-b MEDIUM (NFR-008 total) → In Security/NFR; QE-174-a LOW; -c/-d/-e/-f INFO; ABC-175 before UAT | notes …3f8c1d27, …8a2e5b90, …c41d7e2a, …5d9a0f63, …e7b3c218 |`
