---
id: ABC-166
title: "Re-run `ABC-146`'s verdict with `--reporter=verbose`, overnight: run 1 passed 17/17 in 10.6 h, but the default reporter dropped every `LADDER` line, so no score exists"
status: done
column: Done
size: XS
priority: P1
epic: EPIC-004
feature: —
---

# ABC-166 — the same verdict command plus one output flag, one serial run at width 1, on AC power with the lid open. ZERO lines outside records

> **Cut 2026-10-18 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-cut-ABC-166`), on the owner's word of 2026-10-18
> (`.grugops/context/wave-2026-09-25/notes/20261018T072901Z-orchestrator-decision-owner-word-abc146-rerun-tonight-as-ticket-f8c7af0c.md`,
> a transcription, not a stamp): *"ok later, save this plan somewhere asa ticket so we can take it tonight (right now is
> morning)."* **This hop ran nothing and timed nothing.** Readings: `.grugops/context/bapm-cut-ABC-166/notes/`.
>
> **Where the facts live.** `A0`'s reading, `ADR-0038` addendum 2 and run 1's record are on the **unmerged** branch
> `grugops/ABC-146-ladder-verdict` (worktree `wt-ABC-146`, tip `d73c4d6c`), not on `main`. Paths below are on that branch.

## Problem

*User:* the owner, who wants `EPIC-004`'s first criterion read (`ABC-085` `A1`: level 5 scores ≥ 90 % against level 1
over 100 games) and the ladder's order (`ABC-085` `A2`).

*Pain:* verdict run 1 (route V, `ADR-0038` addendum 2, `3030bccf`) ran
`caffeinate -i env LADDER_DEEP=verdict npx vitest run src/ladder.test.ts` in `wt-ABC-146` at `c639a220`, from
2026-10-17T19:13:37Z to 2026-10-18T05:50:59Z. It exited **0**, `Tests 17 passed (17)`, `Duration 38201.85s` (10.6 h).
The scores exist only in the `LADDER GAME` / `LADDER PAIR` lines, which `src/ladder.test.ts:571` and `:597` write with
`console.log`. vitest 4.1.11's `default` reporter dropped every one of them from a passing test.
`raw/verdict-run1.out.txt` holds 9 lines and no `LADDER` line. The Orchestrator reproduced the drop with a probe test:
`console.log` is absent under `default` and present under `--reporter=verbose`
(`.grugops/context/abc146-verdict/notes/20261018T055215Z-orchestrator-observation-abc146-verdict-run1-no-score-lines-75f37904.md`).
**No score is quoted from run 1, and none can be.**

*Value:* the pass already showed that 180 games terminate and replay legally. What the epic owes is still missing: the
score, the MET/RED verdict and the game digests. Run 2 gives them for one more night of one core and no new code.

## Scope

1. **Pre-flight, before the start** (`A1`): `A0` is not stale, the flag is shown to print a passing test's
   `console.log` in this file, and the host is on AC power with the lid open.
2. **One run**, started by the Orchestrator once the owner says to take it. It runs in the background, serially, at
   width 1, from the root of the run tree:

   `caffeinate -i env LADDER_DEEP=verdict npx vitest run src/ladder.test.ts --reporter=verbose`

   stdout and stderr go to `.grugops/context/abc146-verdict/raw/verdict-run2.out.txt`. The `.txt` suffix matters:
   `*.log` is git-ignored. A `verdict-run2.meta.txt` beside it records what run 1's meta records, plus the lid state.
   It is run directly, **never through `npm test`**: the 60 s bound would end it (`ADR-0038` addendum 2, item 1).
3. **The reading** of `ABC-146` `A5`, taken from run 2's lines and nothing else (`A3`).
4. **Two records-only decisions** for other roles (`A5`).

*Assumption (coding rule 2: two readings, one picked and stated).* The **run tree is `wt-ABC-146`** on
`grugops/ABC-146-ladder-verdict`. That branch is where `A0`, addendum 2, run 1 and `abc146-verdict/raw/` live, and its
`src/` equals `main`'s. A fresh worktree from `main` would also play the same games if `A1`'s staleness check passes, but
the records would then sit on two branches. If the Orchestrator picks it, he says so before the start.

## Out of scope

- **Any byte under `src/`, `tools/`, `vitest.config.ts` or `package*.json`.** This includes making `src/ladder.test.ts`
  print with `process.stdout.write`. That would be a code change for an output problem that one flag already solves.
- **Route N** (the first addendum's `tools/ladder/` move). It stays the fallback named in `A4`.
- **Tuning the levels.** A RED pair is `ABC-087`'s finding (`ABC-146` `A5`).
- **`AGENTS.md`, `ADR-0038`, `plans/board.md`, `plans/traceability.md`.** `A5` names who decides about the first two.
- **Comparing run 1 with run 2.** Run 1 printed no digest, so nothing exists to compare.

## Acceptance (Given/When/Then)

- **`A1` (pre-flight; all of it passes before the start, or the run does not start).** **Given** the run tree,
  **when** the Orchestrator checks it on the night, **then**:
  - **`A0` is not stale** (its staleness list, `ABC-146` § `A0` and `…f1558f02` § Staleness inputs).
    - This command prints **nothing**:
      `git diff --name-only eb216351 HEAD -- vitest.config.ts package.json package-lock.json src/engine.ts 'src/search*.ts' 'src/evaluate*.ts' src/quiescence.ts src/transposition.ts src/levels.ts src/virtual-clock.ts src/ladder.test.ts`
    - `node --version` prints `v26.11.1`, and `npx vitest --version` prints `vitest/4.1.11 darwin-arm64 node-v26.11.1`.
    - `md5 -q vitest.config.ts` is `2d2b6379dca047103493ab0bd9b10480`, and `md5 -q src/ladder.test.ts` is
      `bba67b75565b4f4a2e8d231e8bcd6b2e`.
    - `git status --porcelain -- src` is empty.
    - If any of these differs, `A0` is stale. Nothing starts. `A0` is re-taken under `ABC-146`'s rule.
  - **The flag prints a passing test's `console.log`, in this file, through the same redirect.**
    `LADDER_DEEP=1 npx vitest run src/ladder.test.ts --reporter=verbose -t "3v4" > <scratch>.txt 2>&1` exits **0**.
    The file has exactly **4** lines containing `LADDER GAME {` and exactly **1** containing `LADDER PAIR {`, and that
    line reads `"pair":"3v4"`. This is short mode, so it is counts only and nothing in it is ever quoted as `A1` or `A2`.
  - **The host.** `pmset -g batt` prints `Now drawing from 'AC Power'` on its first line, and
    `ioreg -r -k AppleClamshellState -d 4 | grep AppleClamshellState` prints `= No` (the lid is open; `caffeinate -i`
    does not stop lid sleep). Both are written to the meta file at the start and again at the end.
  - **Width 1.** No other hop is in flight or dispatched until the run ends, and no timing window overlaps it
    (`ABC-146` `A6`).
- **`A2` (the run completes, and its lines are all there).** **Given** `A1` passed, **when** the command in Scope 2
  ends, **then**:
  - it exits **0**, and the out file reads `Tests  17 passed (17)`;
  - the out file has exactly **5** lines containing `LADDER PAIR {` and exactly **180** containing `LADDER GAME {`;
  - per pair, the `LADDER GAME` counts are 3v4 **20**, 4v5 **20**, 2v3 **20**, 1v2 **20** and 1v5 **100**;
  - the `LADDER PAIR` lines come in the order **3v4, 4v5, 2v3, 1v2, 1v5**, and every line reads
    `"mode":"verdict mode, step 4"`;
  - every `LADDER PAIR` line's `commit` equals the meta file's commit, with no `+dirty-src` suffix (`commitOf`, `:298`);
  - the meta file records the commit, the start and end times, the exit code, load1 at the start, `node --version`,
    `npx vitest --version`, and the power source and lid state at the start and at the end.
- **`A3` (`ABC-146` `A5`, read from run 2 only).** **Given** `A2` holds, **when** the reading is written, **then** it
  states, citing `verdict-run2.out.txt` for each figure:
  - the commit, step **4**, the seeds (`1..50` for 1v5 and `1..10` for each `A2` pair, both colours each), the game
    counts, the total wall (meta end − start, and vitest's `Duration`), each pair's `wallS` and `load1`, and the runner
    and versions;
  - **`ABC-085` `A1`:** 1v5's `score` over 100 games, as **MET or RED against ≥ 90 %**. This is the line's own `verdict`,
    cross-checked by hand as `score ÷ games`;
  - **`ABC-085` `A2`:** each adjacent pair's `score` over 20 games, as **MET or RED against > 50 %**, with **3v4 and 4v5
    first**;
  - each pair's `claimedDraws` and `reasons`;
  - **180 of 180** games terminated and replayed legally, read from the 17/17 pass (each verdict row asserts the game
    count, no `error` ending, and a legal replay at `:568`–`:590`);
  - each pair's `digest`. **Run 2's five digests are the verdict's evidence. Run 1 has none.**
  - The reading is a note under `.grugops/context/abc146-verdict/notes/` and a dated section on `ABC-146`'s page § `A5`.
    A RED score is a real score: it goes to `ABC-087` and is not a delivery defect.
- **`A4` (no complete run, no score).** **Given** the run ends without `A2`, **when** that happens, **then** **no score
  is quoted**, not even from `LADDER PAIR` lines printed before the end. This covers four cases: a non-zero exit, a
  summary other than 17 passed, counts other than 5 and 180, or no summary at all (sleep, power, a kill). The
  Orchestrator takes it to the owner and names **route N** (the first `ADR-0038` addendum, as accepted) as the
  ADR's next step. If the run was ended from outside, he says so, so the owner can choose another night instead. The
  Orchestrator does not restart on his own: the owner's word covers this one run.
- **`A5` (two decisions, records only, recorded before any `A3` number is quoted).**
  - **Architect/Design** records whether `ADR-0038` addendum 2's item 1 command needs `--reporter=verbose` noted.
    *BA/PM's recommendation: yes, as a dated line.* A re-take under the staleness rule would otherwise repeat run 1.
  - **Orchestrator** records whether `AGENTS.md`'s ladder-lane comment goes to the Scribe after `ABC-146` merges. That
    comment still says the verdict is "not run here (~44 h in vitest)" and that its route is plain `node`.
    *Recommendation: yes. `AGENTS.md` is 24,576 B at `fedb80d4`, exactly its budget, so the rewrite must be net ≤ 0 B or
    ride with `ABC-164`.*
- **`A6` (fences).** `git diff --name-only <base> <tip> -- src/ tools/ vitest.config.ts package.json package-lock.json AGENTS.md`
  is **empty**. The production-`src/` grep (`AGENTS.md` § Test and UAT authority) is empty.

## Dependencies

- **`ABC-146` (`In Development`):** `A0` (`c639a220`), `A7` (`3030bccf`) and run 1 (`d73c4d6c`) are on its unmerged
  branch. This ticket supplies its `A5` reading. `ABC-146` closes on that reading.
- **The owner's "take it" tonight.** The Orchestrator starts the run only on that word (`…f8c7af0c`).
- **Staleness:** a merge to the run tree that touches `A1`'s list before the start makes `A0` stale (`A1`).
- **None blocking among open tickets.** No open ticket edits `A1`'s list today (`eb216351..fedb80d4`: 0 files under `src/`,
  `tools/`, `vitest.config.ts` and `package*.json`).

## Security / NFR triggers

- **`NFR-008` / `N8-LANE`:** unchanged. The default lane plays 0 ladder games, and no file is added.
- **Cost:** one core for about one night. Run 1 took **38 201.85 s (10.6 h)**, on battery at the start and with load1
  9.11. This is a reading of run 1, not a bound on run 2. The reporter is an output setting, and the games are a
  function of node counts only (`ADR-0038` decision 4), so no wall bound is a bar.
- **Security:** not triggered. No input path, network, dependency or code change.

## Test notes

1. **Counts before scores.** `A2`'s 17 / 5 / 180 is read before any `A3` figure is written.
2. **The pre-flight is a real-file run.** `A1`'s `-t "3v4"` short pair uses the same file, flag, config and redirect.
   That is stronger than a probe file, and it adds nothing under `src/`.
3. **Mandatory gates do not apply to a run with no code.** `A6`'s diff is the check. A QE hop is owed (the owner's standing
   rule): QE recounts `A2` from the raw file and redoes `A3`'s `score ÷ games` by hand. With 0 production lines, the UAT
   waiver is expected. It is measured at the exit, not asserted here.

## Size and priority

**`XS`:** one command, one pre-flight and one reading. The night is machine time. **Not `S`:** there is no code and no
new criterion. Every bar is `ABC-085`'s or `ABC-146`'s.

**`P1`, inherited from `ABC-146`.** It carries the epic's first criterion. **Not `P0`:** for the same reason `ABC-146`
is not.

## Definition of Ready

BA/PM, 2026-10-18, at `main` `fedb80d4`. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** run 1 passed 17/17 in 10.6 h with 0 `LADDER` lines, and the reporter drop was reproduced |
| 2 | scope and out-of-scope clear | **✅** one flag, one run and one reading. Code, route N and tuning are fenced off |
| 3 | INVEST-shaped | **✅** independent of other open tickets. Testable by counts |
| 4 | acceptance testable and measurable | **✅** stale-list diff empty plus md5s and versions; 4 + 1 pre-flight lines; exit 0, 17/17, 5 and 180; MET/RED against ≥ 90 % and > 50 % |
| 5 | dependencies known | **✅** `ABC-146`'s branch, the owner's "take it", the staleness list |
| 6 | security/NFR triggers with a measurable target | **✅** 0 default-lane games; run 1's 10.6 h cited; security not triggered |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P1`, inherited, both directions argued |
| 10 | no major unresolved blocker | **✅** the owner's word is given; the start time is his and is scheduling |

**Recommended: `Backlog → Ready`.** Column moves are the Orchestrator's.
