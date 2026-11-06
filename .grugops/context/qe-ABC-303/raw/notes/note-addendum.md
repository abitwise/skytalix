# qe-ABC-303 ADDENDUM to PREREG `…53858301`: FL fills H1, W is dropped by its recorded line, Q2 is ruled timing first. Sealed before any run of this hop. No bar moves, no word of CF1–CF10 moves

QE/E2E, task `qe-ABC-303`, brief `qe-ABC-303-read` (Orchestrator, 2026-11-06T16:47:16Z), read with `orch-2026-10-30a` `…318c9e3b`, which governs where they differ. No test, build, game or engine run has happened in this hop. The arms and scripts below were copied, and nothing was run. This note releases § 0 of the PREREG in the order below. It adds no bar and drops none.

## 1. After CF10, word for word (`ADR-0056` D5's dated block of `arch-ABC-303-load`, `…a5dc0532`)
> **FL. Foreign load.** Foreign load during C2′ or S′ changes no line of this read. No game or read is voided, stopped, paused or played again for it, and no foreign process is touched. The read is graded as played, by its bars and CF1–CF10, whatever the host did: a clean read at or above its bar is MET; a clean read below it is NOT MET (CF5); a candidate fault or loss on time is CF1; a base fault or loss on time is UNRESOLVED, re-run once (C-2, CF9). Load does not answer CF3: if the cause is the host alone, no tree is fixed, so it is CF3's STOP with no new read, and `timemargin` and the control do not move. QE reports beside the result, by class and count: the harness's `host.log`, `fsample.sh`'s busy foreign samples of the total, the largest load1, and each side's largest move time. No verdict rides on those figures.

> **W. The window.** The first game starts only on the owner's word that the whole host is quiet, this project, `grugops` and any other, for all three stages of § 6, checked with `ps` first. A busy foreign process at that check is a wait, not a read. If load comes after the first game, FL governs and the read plays on.

**W is dropped.** The line, `orch-2026-10-30a` `…318c9e3b`, 2026-11-06T16:47:59Z, before the first game: "Games: W is dropped by this recorded line, before the first game, as …a5dc0532 allows. W's "a busy foreign process at that check is a wait" no longer applies; FL alone governs. The cost is told to him: the CF3 branch, a load-caused candidate move past 150 ms with the score at or above 50.0, stays a STOP with no new read."

H1 is filled by FL. W governs nothing in this read.

## 2. The order, Q2 (H2)
Ruled by the Orchestrator (brief step 1): **B6 as written, timing first.** P7, P6 and R5 are read before any game. No game starts unless P6 and P7 are met.

## 3. The stale rule does not fire
A merge of records into the branch is not needed. `git diff --name-only 38914841 main -- src tools package.json package-lock.json vitest.config.ts tsconfig.json AGENTS.md`, `main` at `55996783`: **empty, 0 paths.** `git diff --name-only 38914841 main` in all: 21 paths, 15 under `.grugops`, 5 under `plans`, 1 under `memory-bank`, none elsewhere. So no value-changing merge has moved the base, and the base stays `38914841`, the candidate `bb0cc134`. § 7 (B4) still stands for the merge itself.

## 4. Stage A: § 6a as sealed, with what it left to the run stated here
**Nothing is loosened** (`…318c9e3b`). His word opens the slot and does not waive it. 24 threads changes no line.
- **The slot gate:** `reread.sh`, unchanged: five samples 3 s apart naming no foreign vitest, inside the lock, or release and try again after 60 s. **Its clock is 40 minutes from this note's commit.** § 6a names no clock, so this is `qe-ABC-307-a9`'s, the case of a foreign vitest live at dispatch. No slot in 40 minutes: no timing read, no game, stop and report. That spends nothing.
- **One hold:** P7, P6, R5 in that order in the one hold `reread.sh` takes (`stage-a.sh`, its RUNNER), one after the other, nothing else in it.
- **P7 arms:** `<scratch>/qe303/arms`, full trees by `git archive`, `node_modules` by symlink: B = `38914841`, H = `bb0cc134`, H2 = `cp -a` of H (`diff -r --no-dereference` empty). Expected: B 71 files, 2 710 passed; H and H2 71 files, 2 734 passed; 0 skipped, 0 failed. Flags and void line: `flags.py` and § 6a's: more than 2 of the 8 rounds flagged, an inadmissible twin, or under 8 rounds. `flags.py` is read first, and the grade only if the flags allow it. `n8-grade.py`'s "BUDGET" line is the ≤ +0.10 s bar here.
- **P6:** § 6a's. `g6.mjs`, `timed.mjs`, `host.mjs` as `qe-ABC-283`'s, `g6` mode only, on `base` and `head` links to arms B and H, `fsample.sh` beside it. **"Busy" reads as `stage.inc.sh` has it: a foreign vitest above 1.0 % CPU.** A run's window is `at − ms` to `at + 1 s`; rows naming a foreign vitest at or below 1.0 % are reported beside it, and flag nothing. Read by `p6-read.py`. `host.mjs`'s own wait-clear runs as it is written, and its `kill -0` sends no signal.
- **R5:** `drv.ts nps` on `<scratch>/qe303/H`, spelled as `rows.sh` runs its modes, `fsample.sh` beside it. § 6a seals no void line for R5, and none is added: its flags are reported with it, it is a reported row, and it gates nothing.
- **Re-read:** one, of a void row only, under a new note, by the same gate on a clock of 15 minutes from that note's commit. P7 and P6 each stand or void alone. A miss is never re-read. G6 or L4 red is a STOP. No slot, or both reads of P6 or of P7 void, means no game: stop and report.
- **Any table 2 row not met: no game,** by the page's § What happens on a miss.

## 5. Stage B: § 6 as sealed, in order, each in its own hold, only if P6 and P7 are met
C2′, then S′ at E 1 810, then the Levels lane, each with its sealed command, `fsample.sh` beside it, and QE reading the result before the next starts. Levels runs on arm H, a full tree of `bb0cc134`. Graded as played, by the bars, CF1–CF10 and FL. FL's figures are reported beside each result, and each side's largest move time comes from `analyze.py` on the debug log, read before that log is deleted. **`G11`:** § 6a keeps P6 to `g6` mode, so it is reported as `qe-ABC-269` did, from P6's own runs (head's move against base's on both boards). A miss is never re-played.

## 6. Records
Foreign load goes by class and count only, in every record, raw files included. No foreign command line is read into any file: `fsample.sh` logs the state, CPU, age, command name and the basename of the working directory. Pids are blanked in committed copies. `host.log` holds a count. Host paths go as `<scratch>`, `<repo>`, `<home>`.

**Scripts, sha256 prefixes, in `<scratch>/qe303/scripts`, copied to `raw/scripts/`:** `n8.sh` 9362f12e (`qe-ABC-307`'s but for the header and `exp_of`), `stage.inc.sh` a5b44278, `fsample.sh` 705353d6, `flags.py` 96ee7bc0, `n8-grade.py` fcb2c2d0, `reread.sh` 24a3ae41, `a9-sens.py` 1c8897ec (all five `qe-ABC-307`'s), `g6.mjs` c8f970c3, `host.mjs` ee03ea2b, `timed.mjs` 9e7fee7f, `analyze.py` 8cc334ec (`qe-ABC-283`'s), `drv.ts` 33dd73f4 (§ 2's), and new, reading or sequencing only: `stage-a.sh` ac6c870c, `p6-read.py` 7681bca0, `fl-read.py` 8953c54e.
