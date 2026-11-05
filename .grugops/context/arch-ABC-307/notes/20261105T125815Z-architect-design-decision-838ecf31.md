---
id: 20261105T125815Z-architect-design-decision-838ecf31
kind: decision
by: architect-design
at: 2026-11-05T12:58:15Z
verified_by: 
confidence: medium: forms and placement rest on source and on kill sets recorded on an older tree; no remnant has been built or run, so DoR row 10 stays open; kept ms and parity UNKNOWN - verify
refs:
  - arch-ABC-307
  - ABC-307
  - EPIC-011
  - ADR-0046
  - ADR-0035
  - NFR-008
  - T-QEHOP-GROWTH
  - R-N8H-1
  - R-N8H-2
  - R-307-a
  - R-307-b
  - R-307-c
  - QE-244-a
  - QE-105-p
  - ABC-302
  - ABC-105
  - ABC-154
  - ABC-101
  - ABC-241
  - ABC-171
  - ABC-212
  - ABC-221
  - ABC-094
  - src/cli.test.ts
  - src/uci-session.test.ts
  - src/book.test.ts
  - tools/grugops/qe-hop-integrity.test.ts
  - secnfr-census-1105/20261105T122931Z-security-nfr-decision-19cea480
  - orch-2026-10-30a/20261105T123040Z-orchestrator-decision-f40ce634
  - orch-2026-10-30a/20261105T124120Z-orchestrator-decision-9e878ba6
  - bapm-rows-cut-1105/20261105T124052Z-ba-pm-observation-0dd99758
  - arch-ABC-302/20261104T181301Z-architect-design-decision-bcadd41d
  - arch-ABC-302/20261104T181301Z-architect-design-observation-8c8cfeed
  - qe-ABC-244/20261030T230742Z-qe-e2e-observation-98d5d2e4
  - 02e6e180
supersedes: 
seal: sha256:954dbde3debce15c281894dd596177df53a4d5c7bd5d6cf1526a28211018d062
---

# arch-ABC-307 decision: form S for all nine rows by source; DoR row 10 stays open because nothing was measured. Three calls for the Orchestrator, none for the owner

Architect/Design, task `arch-ABC-307`. Readings: this task's observation note. **The authoritative record is `ADR-0046` § Dated 2026-11-05 (`arch-ABC-307`), with `ADR-0035` § Addendum 2026-11-05 C6.** The forms, remnants, mutants, `-t` lines, counts and forecast are there and are not repeated here.

## Where this leaves row 10
The page's row 10 needs each remnant confirmed "measured". This hop was briefed to run nothing, so **the design is done and the measurement is not.** Do not tick row 10 on this note.

## For the Orchestrator
1. **How row 10 closes.** Either:
   - **(a) a reads hop, recommended.** Architect, scratch copy, under the host lock, a sketch of the nine remnants, the `ADR-0046` mutant list under a PREREG, whole default lane at base and tip. `arch-ABC-302` took about 17 minutes for 28 mutants. It also gives B1's k and every kept ms, which the thin forecast needs;
   - **(b) rule that `A7` is the measurement,** and the ticket goes Ready on this design. It saves a hop, and a miss comes back as a STOP after a build.
2. **The line in `A6`.** Read L3 with B1 and L3 with C2 as past the slack. They clear 113 ms on the skip read, but realised they land at about −0.19 to −0.21 s against −0.215 s, and no row is left to add. By reading no row needs K.
3. **`R-307-c`.** The real-tree guard (a malformed note or a link outside the named folders) has no default-lane holder under any form. The page's rule, read strictly, makes that a K, and a K of the trio falls short. I recommend accepting it under ruling 2, covered by the deep lines and the hand-run `--sweep`.
4. **`T-QEHOP-GROWTH`.** Do not dispatch a read at 5,500; the backstop is 5,900 (C6). It may cross within hours. Dispatch is yours.

**Owner question: none.** No ADR is reversed, and no NFR level, bound, cap, W or lane line moves. The retirement of the trigger is this role's by `ADR-0035` C2.

## Owed by BA/PM (the page)
- **§ Scope:** the remnants, lanes and kept ms from the ADR's table. L1's lane is settled.
- **`A2`, exceptions by name:**
  - `src/uci-session.test.ts`'s `./history.ts` import gains `gameStatusOf`;
  - `src/book.test.ts` and `tools/grugops/qe-hop-integrity.test.ts` gain `const RUN_DEEP = process.env.ENGINE_DEEP === "1"`;
  - the qe-hop file gains the `cpSync` and `afterAll` bindings and the remnants' shared fixture;
  - `STEP_MS`, `seamOf` and `scoreWith` leave `src/cli.test.ts`'s default describe;
  - L2's and L3's deep describe is titled "ABC-241 A4, A7 — the CLI: the ep twin and the claim [deep, ENGINE_DEEP=1]", not the original title plus the suffix.
- **`A3`:** no W, so the lane total stays base's.
- **`A4`:** the nine `-t` lines and the counts. `src/cli.test.ts` has no deep lane to read.
- **`A5`:** stands. The copied root is the injected root it allows.
- **`A7`:** "the one whose only default-lane killer at base is that row" will not hold for every row, and for the trio it reads per trio. It should read: the row's named mutant, with its remnant among the killers; and where a guard leaves the remnant (L2's QMATCH1, L3's five, C2's P2a and P2b), the named holders. Add the `ABC-154` plants.
- **`A8`:** the run rule is 22 lines, and its trigger gains two files.
- **§ Open 1 and 2:** answered by `…9e878ba6`. It merges alone and first, `A9` reads `main`, and `ABC-305` re-reads on top.
- **Risks:** `R-307-a` falls away with search-free remnants, once measured. `R-307-c` is new, LOW, owner Architect/Design.
- **`A10`:** gains `T-QEHOP-GROWTH`'s retirement and `R-N8H-2`.

## SE build lines (binding once row 10 closes)
1. **The qe-hop file.** One lazy fixture builds the temp root: `mkdtempSync` under `tmpdir()`; `cpSync` of `plans/board.md`, `.grugops/qe-cutover-2026-08-17.txt` and each `NAMED` folder's `notes/`. It is removed in `afterAll`, by that exact path. Q1's and Q3's remnants call `run([...], { root })`, and Q3's last line adds `snapshotIds`. Q2's reads `readNotes(join(ROOT, ".grugops/context"), NAMED)`. The trio's deep describes follow their originals, under `if (RUN_DEEP)`, each titled the original plus " [deep, ENGINE_DEEP=1]".
2. **`src/uci-session.test.ts`.** All five deep describes go after R8's block, each repeating its fixtures. C1's repeats `goes` and `levelOneMoves`, C2's `searchAt`, L1's `LEVEL_WORDS` and a `newGame(START_FEN)`, L2's and L3's what R8's has plus `TWIN`.
3. **L2's remnant** builds `gameOf(TWIN)` and `gameOf(FEN)`: `repetitionKeyHistory` equals `keyHistory` on the first, and not on the second.
4. **L3's remnant** finds d8e8 with `legalMoves`, plays it, and keeps the row's other asserts as they stand. It is synchronous.
5. **C1's remnant** takes `goes.slice(0, 4)`, and reads the two draws straddling `LEVELS[1].blunderRate` before the equality. If they do not straddle, take the page's form.
6. **B1's k** is the smallest that passes; the title names it.
7. **Comments** cite only `ABC-307`, `secnfr-census-1105`, `arch-ABC-307` and `ADR-0046`.
8. **A remnant the SE varies** is re-read on its mutant on a scratch copy (`ADR-0046` condition 1). A tool edit is a STOP to this role.

## Alternatives rejected
- **The page's injected-notes remnant for Q1–Q3:** blind to `ABC-154`'s plants.
- **L2 and L3 on a coarser step:** 500 trips the floor by estimate. 250 clears it by estimate, for 10–12 ms kept each, and still leaves A7's five unread. Search-free needs no step at all.
- **Form W for L3:** every recorded kill has a holder, but the game-side half is worth 1 ms to keep directly.
- **L1 under `CLI_DEEP`:** the spawn file needs new runtime imports, and option (ii) in `src/cli.test.ts` is reached by no lane line.
- **`TUNE_DEEP` for the tool rows:** nearer in name, but it belongs to one tuner file and goes when that does.
