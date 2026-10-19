---
id: ABC-175
title: "ABC-085 verdict re-take on ABC-174's QE-passed branch (route V)"
status: ready
column: Backlog
size: XS
priority: P1
epic: EPIC-004
feature: —
---

# ABC-175 — one pre-registered overnight run of the unchanged harness on the re-cut table, at width 1, before the owner's UAT word on `ABC-174`. ZERO lines under `src/`

> **Cut 2026-10-19 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-adr0045-cut`), on the owner's word
> (`.grugops/context/wave-2026-09-25/notes/20261019T130500Z-orchestrator-decision-owner-word-adr0045-accepted-q1-q3-abc171-rows-1a9c7f42.md`,
> a transcription, not a stamp), Q3: *"Verdict before UAT; add rows (Recommended)"*. The plan is `ADR-0045` D6,
> accepted. The template is `ABC-166`. **This hop ran nothing and timed nothing.**
>
> **Amended 2026-10-20 by BA/PM** (`bapm-ABC-175-heap`, records only, ran nothing):
> - § Scope 2 and `A1`'s probe now carry the heap prefix, copied verbatim from the Architect's `arch-ABC-175-heap`.
> - `A1`'s `A0` inputs moved to the re-take `ed88329c`, and the old "STALE" bullet is kept as dated history.
> - An out-of-memory line was added (§ Security / NFR triggers), and the DoR was re-scored at 10/10.

## Problem

*User:* the owner, who gives `ABC-174`'s UAT word and wants `EPIC-004`'s ladder criteria read on the table he
accepted: `ABC-085` `A1` (level 5 ≥ 90 % against level 1 over 100 games) and `A2` (each adjacent pair > 50 %).

*Pain:* the only verdict, `ABC-146` § `A5` reading 2026-10-19 (run 2, `d73c4d6c`, `…4c1d8e27`), describes the old table.
It goes **STALE** on `ABC-174`'s merge (`ABC-085` § Dependencies, folded), and every pair contains a changed level
(D6.1). So nothing carries over.

*Value:* the owner accepts or rejects the re-cut with its game score in hand. The run costs one night of one core and
no code.

## Scope

1. **Pre-flight, before the start** (`A1`).
2. **One run**, started by the Orchestrator overnight, in the background, serially, at width 1. The run tree is a
   worktree at **`ABC-174`'s QE-passed commit**. Route V (`ADR-0038` addendum 2), from the root of the run tree:

   `caffeinate -i env LADDER_DEEP=verdict NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts --reporter=verbose`

   *Amended 2026-10-20 (`bapm-ABC-175-heap`).* The command now carries the heap prefix. It is copied verbatim from
   the Architect's ruling `arch-ABC-175-heap` (H1–H5; `ADR-0045` § ADDENDUM 2026-10-20; `ADR-0038` § ADDENDUM 3).
   The run tree carries `ABC-173`'s heap guard, which refuses an unprefixed one-file run: exit 1, and no test runs
   (`…e4b8d062`). The flag is exactly **400** (ONE-FILE, 496 MiB), the same as the `AGENTS.md` ladder lane. It is
   bound by `A0`'s vitest arm (C1), so it is not changed on the night (`A1`).

   stdout and stderr go to `.grugops/context/abc175-verdict/raw/verdict.out.txt` (`.txt`, because `*.log` is
   git-ignored). **`verdict.meta.txt` beside it records the command verbatim**, plus everything `A2` lists. That closes
   the gap noted at `…6a2f9d03`. The run is made directly, **never through `npm test`**: the 60 s bound would end it.
3. **The reading** (`A3`), from this run's lines and nothing else.
4. **The tree check at merge** (`A5`).

*Assumption (coding rule 2: two readings, one picked and stated).* "The run tree is `ABC-174`'s QE-passed branch" is
read as **a dedicated worktree `../wt-ABC-175` on branch `grugops/ABC-175`, created at the commit QE passed**. The
records commit on top of it, and they add no `src/` line. The other reading is running inside `ABC-174`'s own
worktree. That puts records on the build's branch and risks a dirty `src/` check. If the Orchestrator picks it, he
says so before the start.

## Out of scope

- **Any byte under `src/`, `tools/`, `vitest.config.ts` or `package*.json`** (`A6`).
- **Route N.** It stays the fallback that `A1` and `A4` name.
- **Tuning.** A RED pair goes to the owner. **No table is tuned from these games, and no second table is derived from
  them without his word** (`ADR-0045` D6.7; `ABC-087` test note 4).
- **A second shot.** This is pre-registered as **one shot** (§ Pre-registration).
- **Comparing with run 2's scores.** Run 2 played a different table. Its digests describe other games.
- `AGENTS.md`, `plans/board.md` and `plans/traceability.md`.

## Pre-registration (fixed before the start, not after)

- **Bars:** `ABC-085` `A1` ≥ **90 %** (1v5 over 100 games), and `A2` > **50 %** for each adjacent pair (20 games each).
- **Harness:** unchanged: step 4; seeds `1..10` in both colours for each `A2` pair and `1..50` for 1v5; `PLY_CAP` 600;
  every claimable draw claimed at the first offer; the order 3v4, 4v5, 2v3, 1v2, 1v5 (D6.2).
- **One shot.** A RED pair is reported with its `claimedDraws` and `reasons` and goes **to the owner**. His options are
  `ADR-0038` menu (c), or accept. Nothing re-runs and nothing is re-tuned on an agent's call.
- **Prediction on record:** MET on all five, `UNKNOWN - verify` (D5). The reading quotes the prediction beside the
  score. It does not grade it.

## Acceptance (Given/When/Then)

- **`A1` (pre-flight; all of it passes before the start, or the run does not start).** **Given** the run tree, **when**
  the Orchestrator checks it on the night, **then**:
  - **`A0` is current.** The `A0` reading in force is **`secnfr-ABC-174-a0`'s re-take, commit `ed88329c`**
    (records only, on the run tree `f6b63c1c`, branch `grugops/secnfr-ABC-174-a0`): route **V**, `F_hi` **1.047**
    ≤ 1.30. Its staleness inputs are `…c7a3e915` § Staleness inputs at the run tree `f6b63c1c`, which supersedes
    `ABC-146`'s `…f1558f02`. With **`<A0>` = `ed88329c`**, this command prints **nothing**:
    `git diff --name-only <A0> HEAD -- vitest.config.ts package.json package-lock.json src/engine.ts 'src/search*.ts' 'src/evaluate*.ts' src/quiescence.ts src/transposition.ts src/ladder.test.ts`
    - If the scratch branch is not kept, `<A0>` = `f6b63c1c`. Its tree differs from `ed88329c` only under
      `.grugops/context/secnfr-ABC-174-a0/` (`secnfr-ABC-174-a0` § Result).
    - **`src/levels.ts` is not on this list.** It changes by design, and `A0` does not read it (D6.5).
    - `node --version` prints **`v26.11.1`**, and `npx vitest --version` prints
      **`vitest/4.1.11 darwin-arm64 node-v26.11.1`** (the values at `ed88329c`).
    - `md5 -q vitest.config.ts` prints **`326bc5ca578a29c48102e0192b4bfe5a`** (`ABC-173`'s heap guard, `affee860`),
      and `md5 -q src/ladder.test.ts` prints **`bba67b75565b4f4a2e8d231e8bcd6b2e`** (unchanged, 17 verdict rows).
      These are the values at `ed88329c`. They **replace the `eb216351` values** (`vitest.config.ts` `2d2b6379…`;
      `src/ladder.test.ts` `bba67b75…`, unchanged).
    - *History (written at the cut 2026-10-19; closed 2026-10-20 by BA/PM `bapm-ABC-175-heap`).* At the cut, `A0`
      (`eb216351`) was **STALE on `main` `6fc32150`**. Against `eb216351`, the command printed `package.json`
      (`ABC-169`'s `"license"`), `src/engine.ts` (`ABC-170`'s `maxDepth` / `maxNodes`) and `src/evaluate.ts`
      (`ABC-169`'s comment). So `A0` was owed a re-take, or the owner's route-N word. **The re-take is done:**
      `secnfr-ABC-174-a0`, `done_at` 2026-10-19T22:37Z, width 1, on `f6b63c1c` under `ABC-173`'s cap. 10/10 node
      counts were equal (29 717); median `F` 0.978; `F_hi` 1.047, so **route V**. The stale-list run against
      `ed88329c` in `../wt-ABC-174` (HEAD `f6b63c1c`) printed nothing (`.grugops/queue/done/secnfr-ABC-174-a0.md`).
      The checks above still run **on the night**. A re-take does not replace them.
  - **`src/` is the build QE passed.** `git status --porcelain -- src` is empty, and
    `git diff --name-only <ABC-174 QE-passed commit> HEAD -- src` is empty.
  - **The flag prints, through the same redirect.**
    `LADDER_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts --reporter=verbose -t "3v4" > <scratch>.txt 2>&1`
    exits **0**. It has exactly **4** lines containing `LADDER GAME {` and exactly **1** containing `LADDER PAIR {`,
    and that line reads `"pair":"3v4"`. This is short mode, so it gives counts only, and nothing in it is quoted as
    `A1` or `A2`.
    - It runs under the run tree's vitest configuration, which carries `ABC-173`'s heap guard (`f6b63c1c`). Its flag
      is the verdict's flag (`arch-ABC-175-heap` H4), so its exit 0 is also the cap's admission check for the night.
      `heap-guard: refused …` with exit 1 stops the night before the start.
    - *Amended 2026-10-20:* the heap prefix was added, copied verbatim from `arch-ABC-175-heap`.
  - **The flag is the one `A0` read.** Both commands carry exactly `NODE_OPTIONS=--max-old-space-size=400`. `A0`'s
    vitest arm read route V at that flag (C1, 496 MiB; `arch-ABC-175-heap` H3). A run at any other flag is a
    configuration `A0` did not read. That needs an `A0` re-take or route N, and the owner decides. `A2`'s verbatim
    command in `verdict.meta.txt` records the flag.
  - **The host.** `pmset -g batt` prints `Now drawing from 'AC Power'` on its first line.
    `ioreg -r -k AppleClamshellState -d 4 | grep AppleClamshellState` prints `= No` (the lid is open;
    `caffeinate -i` does not stop lid sleep). Both go into the meta file at the start and again at the end.
  - **Width 1.** No other hop is in flight or dispatched until the run ends, and no timing window overlaps it.
- **`A2` (the run completes, and its lines are all there).** **Given** `A1` passed, **when** the command ends, **then**:
  - it exits **0**, and the out file reads `Tests  17 passed (17)`. 17 is the verdict-mode row count at
    `bba67b75…`; `A1`'s md5 check holds the file to it;
  - the out file has exactly **5** lines containing `LADDER PAIR {` and exactly **180** containing `LADDER GAME {`;
  - per pair, the `LADDER GAME` counts are 3v4 **20**, 4v5 **20**, 2v3 **20**, 1v2 **20** and 1v5 **100**;
  - the `LADDER PAIR` lines come in the order **3v4, 4v5, 2v3, 1v2, 1v5**, and every one reads
    `"mode":"verdict mode, step 4"`;
  - every `LADDER PAIR` line's `commit` equals the meta file's commit, with no `+dirty-src` suffix;
  - **the meta file records the command verbatim**, the commit, the start and end times, the exit code, load1 at the
    start, `node --version`, `npx vitest --version`, and the power source and lid state at the start and at the end.
- **`A3` (the reading).** **Given** `A2` holds, **when** the reading is written, **then** it states, citing
  `verdict.out.txt` for each figure:
  - the commit, step **4**, the seeds, the game counts, the total wall (meta end − start, and vitest's `Duration`),
    each pair's `wallS` and `load1`, and the runner and versions;
  - **`ABC-085` `A1`:** 1v5's `score` over 100 games, **MET or RED against ≥ 90 %**. This is the line's own `verdict`,
    cross-checked by hand as `score ÷ games`;
  - **`ABC-085` `A2`:** each adjacent pair's `score` over 20, **MET or RED against > 50 %**, with **3v4 and 4v5 first**;
  - each pair's `claimedDraws`, `reasons` and `digest`;
  - **180 of 180** games terminated and replayed legally, read from the 17/17 pass;
  - beside the scores, `ADR-0045` D5's prediction ("MET on all five, `UNKNOWN - verify`") and D6.6's wall estimate
    (~5.5 h, 3.5–7.5 h), each labelled as prediction or estimate.
  - The reading goes in a note under `.grugops/context/abc175-verdict/notes/`, and in a dated section on this page and
    on `ABC-085` § Dependencies. **A RED score is a real score.** It goes to the owner (§ Pre-registration) and is not a
    delivery defect of `ABC-174`.
- **`A4` (no complete run, no score).** **Given** the run ends without `A2`, **then** **no score is quoted**, not even
  from `LADDER PAIR` lines printed before the end. That covers a non-zero exit, a summary other than 17 passed,
  counts other than 5 and 180, and no summary at all (sleep, power, a kill, an out-of-memory error). The Orchestrator
  takes it to the owner, naming route N as the next step and saying whether the run was ended from outside. **He
  does not restart on his own.** The owner's word covers one shot.
- **`A5` (the reading is on the engine that ships).** **Given** `A3` was written, **when** `ABC-174` merges, **then**:
  - `git diff --name-only <run commit> <ABC-174's merged tip> -- src` prints nothing. The branch took no `src/` commit
    after the run.
  - On the `main` side, `git diff --name-only <ABC-174's branch point> <the merge's first parent> -- <the A1 list> src/levels.ts src/virtual-clock.ts`
    prints nothing. That is `ABC-085`'s staleness rule.
  - If either prints a file, the reading is **STALE on arrival**. That is recorded on this page, and the Orchestrator
    tells the owner before the merge. It is not a gate on the merge (`ABC-085`).
- **`A6` (fences).** `git diff --name-only <run commit> <this ticket's tip> -- src/ tools/ vitest.config.ts package.json package-lock.json AGENTS.md`
  is **empty**.

## Sequence (owner Q3, recorded)

1. `ABC-174` passes QE.
2. `A0` is re-taken on the run tree (`A1`), or the owner names route N.
3. `ABC-175` runs on `ABC-174`'s QE-passed commit, overnight, at width 1.
4. The owner gives `ABC-174`'s UAT word with `A3`'s score in hand.
5. Both merge, `ABC-174` first. `A5` is read at that merge.

## Order with `ABC-173` (vitest caps): recommended BEFORE this run

`ABC-173` edits `vitest.config.ts` and `package.json`, and both are on `A1`'s `A0` list. **Recommendation: `ABC-173`
merges to `main` before `ABC-174` branches, so the run tree carries the cap.** In order: `ABC-171` → `ABC-173` →
`ABC-174` → QE → `A0` re-take → `ABC-175` → UAT → merge.

- **Why before:**
  - **`A0` must be re-taken anyway** (it is stale on `main` today, `A1`). Taken after `ABC-173`, one re-take covers the
    final configuration.
  - The owner asked that vitest be capped (`…c4a8e1f6`). Before means a 5.5 h vitest run happens under that cap, not
    outside it.
  - `ABC-085`'s verdict staleness list does not name `vitest.config.ts` or `package.json` (the games depend on node
    counts only, `ADR-0038` decision 4). So "after" saves no re-run. But it leaves a window: an `ABC-173` merge
    touching `src/` test files between this run and `ABC-174`'s merge would make `A5`'s `src/` diff print.
- **What `A0` then needs:** one re-take **after** `ABC-173` merges, on the run tree. It records the new
  `vitest.config.ts` md5, the `src/ladder.test.ts` md5 (and the verdict row count, if `ABC-173` adds a probe row to
  that file), and the versions. `A1` then checks against that re-take's commit. Under `ABC-173`'s cap, the `-t "3v4"`
  pre-flight probe is also the first ladder process to run under the per-isolate heap limit. An out-of-memory error
  there stops the night before it starts (`ABC-173` Q4: the owner decides, and nothing gives way).
- **Fallback, if `ABC-173` slips past `ABC-174`'s QE pass:** run on the uncapped tree with `A0` re-taken there, and
  **hold `ABC-173`'s merge until `ABC-174` has merged.** Then nothing lands between the run and `A5`. `ABC-173`'s merge
  then makes `A0` stale for any later re-take only.

## Dependencies

- **`ABC-174`'s QE pass** (the run tree). This ticket is its pre-UAT evidence.
- **`A0`'s re-take** (Security/NFR, width 1), or the owner's route-N word (`A1`). **Met 2026-10-19T22:37Z:**
  `ed88329c`, route V, `F_hi` 1.047 (`secnfr-ABC-174-a0`). `A1` still re-checks it on the night.
- **The Orchestrator's overnight slot**, with width 1 held.
- **`ABC-173`:** order recommended above.

## Security / NFR triggers

- **`NFR-008` / `N8-LANE`:** unchanged. The default lane plays 0 ladder games, and no file is added.
- **Cost:** one core for one night. **Estimate (D6.6, not timed):** about 5.5 h, in the range 3.5–7.5 h. Run 2 took
  40 823 s (11.3 h) on the old table. No wall figure is a bar: the games are a function of node counts only.
- **Security:** not triggered. There is no input path, network, dependency or code change.
- **Heap (`NFR-010`, `ADR-0008` addendum; added 2026-10-20).** The run tree carries `ABC-173`'s heap guard. The
  verdict and the `A1` probe each run one file, so each runs under the ONE-FILE row. The flag is exactly `400`, so
  `heap_size_limit` is **496 MiB** per isolate. The main process and 1 worker sum to **992 MiB**, within the 1984 MiB
  row (`arch-ABC-175-heap` H1, H6). Without the prefix, the guard exits 1 and no test runs (`…e4b8d062`).
  - **Whether 180 verdict games fit in 496 MiB is `UNKNOWN - verify`.** No step-4 game has run under the cap. The
    Architect's structural read is that heap does not build up across games, but that was not run.
  - **This page schedules no out-of-memory pre-probe.** Whether to run one is owner question **`OQ-175-H1`**
    (`arch-ABC-175-heap`). The Architect recommends none. A verdict-mode `-t "3v4"` pre-probe would show 3v4 verdict
    scores before the one shot, which § Pre-registration forbids without his word.
  - **Out of memory on the night.** If the probe or the run fails with a heap out-of-memory error, `A4` applies: no
    score, and nothing is restarted. The Orchestrator takes it to the owner, who decides under **`ABC-173` Q4**
    whether the limit goes up or the lane is fixed. Neither moves without his word.
    - The report says whether `verdict.out.txt` contains `heap out of memory` or `Worker exited unexpectedly`. The
      second is the out-of-memory signature `PUZZLE_DEEP` shows (`ADR-0008` addendum).
    - 1v5 runs last and is the longest pair, so an out-of-memory error there costs the most.

## Test notes

1. **Counts before scores.** `A2`'s 17 / 5 / 180 is read before any `A3` figure is written.
2. **The pre-flight is a real-file run**, with the same file, flag, configuration and redirect.
3. **No code, so the mandatory gates do not apply.** `A6`'s diff is the check. A QE hop is owed: QE recounts `A2` from
   the raw file and redoes `A3`'s `score ÷ games` by hand. With 0 production lines, the UAT waiver is expected for this
   ticket. It is measured at the exit, not asserted here. The owner's UAT is on `ABC-174`.

## Size and priority

**`XS`:** one command, one pre-flight, one reading and one tree check. The night is machine time. **Not `S`:** there is
no code and no new bar. Every bar is `ABC-085`'s.

**`P1`, inherited from `ABC-174` and `EPIC-004`.** It gates the owner's UAT word on `ABC-174`.

## Definition of Ready

### Re-score: BA/PM, 2026-10-20 (`bapm-ABC-175-heap`), at `main` `a76b006e`. **Result: 10 of 10.**

The re-score covers three changes: the heap prefix on both commands, copied verbatim from `arch-ABC-175-heap`; the
`A0` re-take recorded as done (`ed88329c`); and the out-of-memory line (§ Security / NFR triggers).

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** unchanged |
| 2 | scope and out-of-scope clear | **✅** one run with one exact command (§ Scope 2). Code, route N, tuning, a second shot and an out-of-memory pre-probe without the owner's word are fenced off |
| 3 | INVEST-shaped | **✅** unchanged. Testable by counts |
| 4 | acceptance testable and measurable | **✅** both commands are exact and carry `--max-old-space-size=400`. `A0`'s inputs are concrete: `<A0>` = `ed88329c`, md5s `326bc5ca…` / `bba67b75…`, `v26.11.1`, `vitest/4.1.11`. The flag must equal `A0`'s. Probe: 4 + 1 lines, exit 0. Run: 17/17, 5 and 180. MET/RED against ≥ 90 % and > 50 % |
| 5 | dependencies known | **✅** `ABC-174` QE passed (`be6a5599`; run tree `f6b63c1c`). **`A0` re-take met** (`ed88329c`, route V). `ABC-173` is on the run tree, so the recommended order holds. The heap command is ruled (`arch-ABC-175-heap`). The overnight slot and the owner's go for the night are the Orchestrator's to get |
| 6 | security/NFR triggers with a measurable target | **✅** 0 default-lane games; ~5.5 h estimate labelled; heap ONE-FILE 496 MiB per isolate, Σ 992 MiB ≤ 1984 MiB (`NFR-010`). Whether the games fit is `UNKNOWN - verify` and routed to the owner. Security not triggered |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS`. The prefix adds no work |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker | **✅** The command blocker (`…e4b8d062`) is closed by `arch-ABC-175-heap`, and `A0` is met. Two items remain open, and neither blocks: `OQ-175-H1` (whether to run a pre-probe) has a recommended default that needs no new word, and an out-of-memory error on the night is the owner's under `ABC-173` Q4 (`A4`) |

**Recommended: `Backlog → Ready` now.** The 2026-10-19 trigger, "when `ABC-174` enters QE", has passed: `ABC-174`
is Ready for UAT. The night then waits on the owner's go and width 1. Column moves are the Orchestrator's.

### Score at the cut (superseded by the re-score above): BA/PM, 2026-10-19, at `main` `6fc32150`. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the only verdict describes the old table and goes STALE on `ABC-174`'s merge |
| 2 | scope and out-of-scope clear | **✅** one run and one reading. Code, route N, tuning and a second shot are fenced off |
| 3 | INVEST-shaped | **✅** split from the build on the `ABC-146` precedent. Testable by counts |
| 4 | acceptance testable and measurable | **✅** an empty stale-list diff, md5s and versions; 4 + 1 pre-flight lines; exit 0, 17/17, 5 and 180; MET/RED against ≥ 90 % and > 50 %; an empty `src/` diff at merge |
| 5 | dependencies known | **✅** `ABC-174` QE, the `A0` re-take, the overnight slot, the `ABC-173` order |
| 6 | security/NFR triggers with a measurable target | **✅** 0 default-lane games; ~5.5 h estimate labelled; security not triggered |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker | **✅** the owner's word is given (Q3). The `A0` re-take is a named pre-step, and its route-N alternative is the owner's |

**Recommended: `Backlog → Ready` when `ABC-174` enters QE.** Column moves are the Orchestrator's.
