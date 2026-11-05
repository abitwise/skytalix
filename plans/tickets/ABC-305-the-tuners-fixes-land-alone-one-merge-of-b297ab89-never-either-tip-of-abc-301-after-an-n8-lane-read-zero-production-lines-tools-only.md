---
id: ABC-305
title: "The tuner's fixes land alone: one merge of b297ab89, never either tip of ABC-301, after an N8-LANE read, with zero production lines and dd88560f out of main's ancestry (tools-only, UAT waived)"
status: ready
column: Ready
size: S
priority: P3
epic: EPIC-011
feature: —
adr: "No new ADR. ADR-0067's dated block of arch-owner-answers-1105 (the tools land by a tools-only ticket from b297ab89, never either tip, after an N8-LANE read; the read holds the host, so it follows A4), in force as the owner's word …b836b85c item 3; the shape is arch-ABC-301-miss …2b3440cf item 3"
---

# ABC-305: the tuner's fixes land on `main` alone

> **Cut 2026-11-05 by BA/PM: DoR 10/10, Ready** (task `bapm-wait-lines-1105`, records only, at `main` `a38315bf`; nothing run). Sources: the
> owner's word `orch-2026-10-30a` `…b836b85c` item 3, `arch-ABC-301-miss` `…2b3440cf` item 3, `ADR-0067`'s dated block of
> `arch-owner-answers-1105`, QE's `qe-ABC-301-miss` `…066fadea` and the precedent `ABC-280`. **No bar moves.** The id was checked free on
> every local ref at the cut.
> - **This is `ABC-301`'s tool work, not its emission.** That ticket closed NOT MET; its `≤ +0.10 s` lane budget passes here.
> - **The column moves are the Orchestrator's.** The front matter reads Ready, the BA/PM exit.

## Problem

- **User:** whoever next runs `tools/tune`, and every hop that trusts the tool's rows on `main`.
- **Pain:** `main`'s `tools/tune` knows nothing of E4a. It has no `PASSED_KING_ENEMY`, `PASSED_KING_OWN`, `PASSED_FREE` or
  `PASSED_UNSTOPPABLE`, and writes thirteen value exports, so by reading it cannot emit `main`'s own table (`…2b3440cf`). `QE-271-h`
  (MEDIUM, a live gap) and `QE-271-g` stay open on `main`. The fix exists on `grugops/ABC-301` at `b297ab89`, and QE read it as sound. It
  rots against a moving `main`, and `dd88560f`, the emission that must not ship, sits on the same line of descent.
- **Value:** a merged, tested tool for the third pull the wait may or may not ask for, the two gaps closed, and no change to play.
- **Whether `TUNE_DEEP` is red on `main` today is `UNKNOWN - verify`.** Nobody has read it, and this ticket does not need the answer.

## Scope

1. **One merge of `b297ab89` into `grugops/ABC-305`, cut from `main`.** A merge and not a cherry-pick, so `e763119c`, the hash the PREREG
   names, stays reachable from `main` (`…066fadea`). **Never `d5041c54`, never `e9cbeb40`, never any commit that descends from `dd88560f`.**
2. **The conflicts.** Read by `git merge-tree` at `main` `a38315bf`, and they want one fresh read at the build:
   - `src/evaluate.passer.test.ts`, content. On QE's rehearsal this was the import lines: keep `type Position` from the branch and
     `searchWithoutBundle` from `ABC-304`.
   - `.grugops/queue/…/se-ABC-301-fit-2.md`, a rename on each side. Keep `main`'s `done/` copy.
   - `plans/traceability.md` merges clean.
3. **The `N8-LANE` read, before the landing,** then the gates, the deep lanes and QE (§ Acceptance criteria).

## Out of scope

- **`dd88560f`, and any fit, `extract`, `emit` or game.** `src/evaluate-params.ts` does not move.
- **Any production line.** No file under `src/` other than the two test files named in A2.
- **`QE-304-a`'s line on `src/see.test.ts`.** The board has it riding on `ABC-303` at its `main`-merge hop.
- **Attribution of e1e5** (`…b836b85c`: not run), and deleting `grugops/ABC-301` or `grugops/qe-ABC-301-miss`. Both stay as refs.

## Acceptance criteria

- **A1 (the shape).** **Given** the branch tip, **then** `git merge-base --is-ancestor b297ab89 HEAD` and the same for `e763119c` exit 0,
  **and** `git merge-base --is-ancestor dd88560f HEAD` exits 1. One commit on the branch has `b297ab89` as a parent. **After the merge
  to `main`,** the Orchestrator reads the `dd88560f` line again on `main`: exit 1.
- **A2 (contents).** **Given** the tip, **when** `git diff --name-only main...HEAD` runs, **then** outside `.grugops/`, `plans/` and
  `memory-bank/` it lists exactly six paths: `tools/tune/bounds.ts`, `tools/tune/tracer.ts`, `tools/tune/tune.ts`,
  `tools/tune/tune.test.ts`, `src/evaluate.king-mobility.test.ts` and `src/evaluate.passer.test.ts`. **And** `git diff b297ab89 HEAD --
  tools/tune src/evaluate.king-mobility.test.ts` is empty. **And** in `src/evaluate.passer.test.ts` every `ABC-304` re-point stands.
- **A3 (zero production lines).** **Given** the tip, **then** `git diff --name-only main HEAD -- src` prints those two test files and
  nothing else, and `src/evaluate-params.ts` is byte-equal to `main`'s. So the UAT waiver for zero production lines applies, as `ABC-280`'s
  did. QE re-reads it on the delivered merge.
- **A4 (the default lane).** **Given** `main`'s `npm test` count N, read at the pre-ticket head on the same day, **when** `npm test` runs at
  the tip, **then** it exits 0 with N + 1 passed and 0 failed. QE's rehearsal read 2 684 → 2 685 at `48d78985`. A delta other than + 1 is
  explained row by row in the hand-off. **And** the skip-count capture returns the same integer as on `main`, `test-skip-integrity` prints
  `No findings.`, and `npm run lint`, `npm run typecheck` and `npm run build` exit 0. After the build, `dist/` holds no file from `tools/`.
- **A5 (`N8-LANE`, before the landing; `ABC-301`'s budget, by `…b836b85c`).** **Given** host alone, after `ABC-282`'s A4 ends, **when** `N8-LANE` is
  read, **then** the H − B median wall, with an admissible twin, is **≤ +0.10 s**, and the graded median is ≤ 10 s. H is the tip, B its base
  on `main`, and both are named. No new test file goes in the default lane. Any default-lane row of ≥ 50 ms, by its duration in the tip's
  vitest JSON report, goes to its file's deep lane. Aim, not a gate: the rows this ticket adds or changes sum to ≤ 90 ms in-thread.
- **A6 (the deep lanes of the arriving test files; `…681c6363` 3).** **When** each runs at the tip under the host lock, **then** it exits 0 with
  every registered row passed and 0 skipped, and its count is reported:
  - `TUNE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/tune` (25 of 25 on the rehearsal);
  - `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/evaluate.passer.test.ts` (29 of 29 on the rehearsal).
  - `src/evaluate.king-mobility.test.ts` has no deep lane, by the Architect's grep.
- **A7 (the gaps close).** **Given** the tip, **then** the rows of `ABC-301` P1 (`QE-271-h`, 44 / 44 in the own-phase form QE confirmed), P2
  (`QE-271-g`) and P3 (`QE-271-i`, 17 exports) are present and green. The hand-off names each row. `QE-270-e`'s helper change arrives
  in `src/evaluate.king-mobility.test.ts` and changes nothing on `main`'s table.
- **A8 (records).** **When** `node tools/grugops/records-path-check.js --base main` runs at the tip, **then** it exits 0.
- **A9 (QE).** A `qe-e2e` hop records its verdict before the ticket leaves In Review. UAT is waived by A3. The verdict and the waiver go in the
  Done note.

## What happens on a miss

- **A1 reads `dd88560f` as an ancestor:** the branch is thrown away and cut again from `main`. A revert does not fix it: the emission would
  still be in the history (`…066fadea`). **It never reaches `main`.**
- **A2 or A3 fails:** a defect in the landing, fixed on the branch. No production line is added to make a row pass.
- **A5 over budget:** the row goes deep, as `ABC-301`'s page says, and the read is taken again. No NFR level moves.
- **A4 or A6 red on the merged tree:** back to the Software Engineer. If the tool is green at `b297ab89` and red here, a **STOP to
  Architect/Design** with the failing row, as `ABC-280`. `src/` production lines are not edited to fit the tool.

## NFR triggers

- **`NFR-008`** (`npm test` ≤ 10 s): A5. The budget is `ABC-301`'s, whole. It covers this landing and nothing else.
- **`NFR-009`:** none. **`NFR-005`, `G2`:** none, zero production lines.
- **Host:** the lanes and the `N8-LANE` read run under the host lock, one job at a time. Under an hour by the Architect's estimate, which is
  `UNKNOWN - verify`.
- **Security:** no new surface. The tool reads local files only.

## Test notes

1. No new test is written. The rows land as built and read at `b297ab89`.
2. QE's rehearsal was at `48d78985`, so its 2 685 and 29 of 29 want one fresh read (`…2b3440cf`).
3. UAT is waived (A3). The QE hop is still owed.

## Size and priority

- **Size: S.** One merge, two mechanical conflicts, the gates, two deep lanes, the lane read and a QE read.
- **Priority: P3,** as `ABC-280`. It does not change play. Landing it before the next `src/evaluate*` change is cheaper: that is the next
  chance for the tool to drift unseen.

## Dependencies

- **After `ABC-282`'s A4** (`qe-ABC-282-a4`). It holds the host alone, so no lane or read of this ticket starts until it ends. The `N8-LANE`
  read then comes before the landing.
- **Order with `ABC-282`:** either. Whichever lands second reads this page's A4 and A5 on a `main` that holds the first. Scope 2's conflict list is then
  read again.
- **Order with `ABC-303`:** none on the read. Zero production lines stale no C2′ (`…2b3440cf`). If this lands first, `ABC-303` takes it when
  `main` goes in.
- **`ABC-301` closed NOT MET, and the owner's answer is in:** `…2b3440cf`'s hold until his answer is met.

## Open, not bars (for the Orchestrator)

1. **The row census.** `…5ec6c124` gated "the second of `ABC-282` / `ABC-301`", and `ABC-301` will not merge. Whether it still gates this landing
   is the Orchestrator's (`…2b3440cf`). `UNKNOWN - verify`. It does not block the build.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ the tool on `main` cannot emit `main`'s table; two gaps open; the fix sits on a line with an emission that must not ship |
| 2 | scope and out-of-scope | ✅ one merge, two conflicts; no emission, no fit, no production line |
| 3 | INVEST | ✅ S; independent of `ABC-282`'s and `ABC-303`'s verdicts; testable by A1–A9 |
| 4 | testable, measurable acceptance | ✅ ancestry exit codes; six paths; N + 1; ≤ +0.10 s; two lanes exit 0; path check exit 0 |
| 5 | dependencies known | ✅ after `ABC-282`'s A4 lock; either order with `ABC-282`; none on `ABC-303`'s read |
| 6 | NFR triggers with targets | ✅ `NFR-008` ≤ 10 s and ≤ +0.10 s; no others |
| 7 | test notes | ✅ 1–3 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ✅ no ADR and no owner item: his word is in. The wait on `ABC-282`'s A4 is an ordering, and the census is a ruling before the merge, not before the build |

**DoR 10/10. Ready.** The board move is the Orchestrator's.
