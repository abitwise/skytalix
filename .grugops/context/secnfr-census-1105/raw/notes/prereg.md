# PREREG, secnfr-census-1105: `NFR-008` graded on `main` with W1 in, with twin arms (ADR-0035 D1), then a row census and a probe. Sealed before any timing run

Security/NFR, task `secnfr-census-1105` (brief by the Orchestrator, 2026-11-05T11:49:20Z). The grounds: `…f30bd604` item 3, `…42f7fd67` item 1, `…16e0ec2c` item 1. The method is `secnfr-nfr008-1104`'s (`…c7289371`, `…39f73707`), the changes below stated.

## Session 1: the graded read (one `flock <scratch>/host-test.lock` hold, ALONE)
- **Arms, out of tree, each borrowing `node_modules` by symlink:**
  - **H = `main` `572edf13`** (`git archive`). Its lane inputs equal merge `a6ae8227`'s, ABC-282 in (`git diff --name-only a6ae8227 572edf13` over `src tools package.json package-lock.json vitest.config.ts tsconfig.json AGENTS.md` is empty). Expected 71 files / 2 709 passed / 0 skipped / 0 failed (`…16e0ec2c`).
  - **H2 = `cp -a` of H** (`diff -r` clean, checked before sealing). The identity twin.
  - **B = `7117ce75`** (`git archive`), first parent of `a6ae8227`: `main` just before W1. Its lane inputs equal `9f481fa5`'s. Expected 71 / 2 684 / 0 / 0 (`…42f7fd67` item 6). B is the in-window reference for what W1 cost on `main`. B is not graded.
- **Harness:** `secnfr-nfr008-1104`'s `n8.sh`, with these changes only:
  1. the expected counts above;
  2. every output file (the time file, the run's console file, `last-run.json` and its copy) is checked non-empty before it is read, and an empty or absent one leaves the run unscored (the brief; `QE-282-b`);
  3. per run, host CPU from `/proc/stat`, and `foreign_cpu_s` = host CPU over the run minus the run's own CPU (information);
  4. the foreign vitest count is taken after each run as well as before, on the process's own command and working directory, so a `flock` waiter or a shell that quotes the word is not counted, and a sampler logs foreign vitest every 3 s for the hold (information);
  5. a stage clock: no new round starts past 1 200 s.
  Order rotates B H H2 / H H2 B / H2 B H. Round 0 is discarded. It runs until 8 complete scored rounds or 12 rounds. `npm test` as spelled, one fresh process per run, `/usr/bin/time` wall and CPU (user + sys). Wait-clear before round 0: up to 300 s for load1 ≤ 2.0, logged, not a gate.
- **The host gate (unchanged):** before every run, wait up to 120 s for load1 ≤ 8. A run that starts at load1 > 8, exits non-zero or reads other counts is not scored, and its round is not complete.
- **Grader:** `qe-ABC-282`'s `n8-grade.py`, unchanged. k by ADR-0035 D1's 92 % rule (k = 2 at n = 8–10). Twin admissible when |H2 − H CPU median| ≤ max(1.5 % of H's CPU, 10 ms) and its sign is at chance, with n ≥ 8.
- **State, per ADR-0035 D1:** MET when the twin is admissible, the wall R ≤ 10 s, and H's median ≤ 10 s. NOT MET when H's median > 10 s, or H's x(k) > 10 s. Otherwise UNRESOLVED. An inadmissible twin is VOID, not graded. Then ONE re-read session is allowed with the same harness, and it is final.
- **ALONE (`flags.py`):** a run is flagged when a busy foreign vitest shows before or after it, when the sampler names a foreign vitest in its window, or when `foreign_cpu_s` is over the session median + 5 s. A round with a flagged run is a flagged round. Flagged rounds stay scored, as in the sealed method, and an unflagged sensitivity is reported beside the grade. **More than 2 flagged rounds of the 8 and the read is not ALONE:** it is reported ungraded, and the same ONE re-read applies. No process is touched.
- **Reported:** H's median, interval [x(k), x(n+1−k)] and max against **10 s, 9.6 s and 9.5 s**; H − B wall and CPU; the twin.

## The rules, fixed before the read
On H's graded median m:
- **`R-N8H-1`** (marks of `…1184fec4`, unchanged): m ≤ 9.0 s closed; 9.0 < m < 9.5 s LOW; 9.5 ≤ m ≤ 10 s and MET MEDIUM; NOT MET HIGH, and the breach goes to the owner (ADR-0035 D6). The mark is one-sided, as `…0089724b` read it.
- **The 9.6 s line (`…f30bd604` item 2):** m ≥ 9.6 s means a row move comes first, and the owner is asked only if the next graded read is still ≥ 9.6 s.
- **Whether the next lane-adding merge may go (`…42f7fd67` item 1), one of three outcomes:**
  - **G-GO:** m + 0.10 < 9.6 s. The next lane-adding merge may go at its ≤ +0.10 s budget. Its own gate's H arm is then the next graded read, and that read decides the one after it.
  - **G-WITH:** m < 9.6 s, but m + 0.10 ≥ 9.6 s. It may go only with a row move merged first or in the same merge.
  - **G-HOLD:** m ≥ 9.6 s, or the state is not MET, or the read is VOID after its re-read. No lane-adding merge until a row move has landed and a graded read is under 9.6 s.
  - The test is on the median alone. The interval is reported beside it and does not change the outcome.

## The census (from session 1's own runs)
- From the scored H and H2 runs' JSON: the per-file slot and the per-row in-thread `duration`, as medians (`census.cjs`, unchanged). From the same runs, new: vitest's own phase totals from the console line, and the file timeline from `startTime` / `endTime`, to answer `…25105dda`'s `UNKNOWN - verify`: whether `src/cli.test.ts`'s worker is still the critical path.
- **The candidate rule, fixed now.** A row is a candidate when its median in-thread cost is ≥ 50 ms and it is none of:
  - a recorded bar row: the zugzwang rows, ABC-283's bundle rows (`src/search.bundle.test.ts`), the door-switch rows;
  - a fine-step time row: `uci-session`'s ABC-167 A5 / A6 / A7, ABC-171 A2 / A6, ABC-174 A5, ABC-220 A13;
  - a default slice of a deeper deep row: `legal` ABC-206 A2, `search.test` A4;
  - a remnant of ABC-281 or ABC-302;
  - `src/cli.test.ts`'s spawned children, or a row that pins the lane's own shape (child count, worker cap);
  - a row an ADR or a page names as a default-lane bar. I read each page before naming the row.
- Rows in a file with its own `*_DEEP` gate are class 1. Rows in a file without one are class 2: they need an existing lane elsewhere, or a gate in their own file with no `AGENTS.md` line (`arch-ABC-302` option (ii)), and the Architect's call.
- Rows under 50 ms are read only if classes 1 and 2 fall short. I write the list, each row's proposed remnant and the arms into a sealed probe plan before session 2.

## Session 2: the probe (an estimate, never a grade; one hold, ALONE)
- **H = the same arm. P1 = `cp -a` of H with class 1 rows marked `it.skip`. P2 = P1 plus class 2 rows.** The diffs are kept. Rotated H P1 P2 / P1 P2 H / P2 H P1, round 0 discarded, 8 complete scored rounds or 12 rounds, same harness, gate and `flags.py`.
- **Read:** per round, P1 − H and P2 − H, wall and CPU, as medians with the k = 2 interval and sign counts (`probe-grade.py`, unchanged).

## The supply rule, fixed before the read
- The brief's "about −0.28 s" is `…0089724b`'s forecast figure: −0.21 s realised ÷ 0.76. A forecast already allows for remnants, and a probe reads skips. On ABC-302 the skip read was −0.555 s, the forecast −0.50 s (× 0.90), and the graded result −0.38 s (× 0.76 of the forecast, × 0.68 of the skip read).
- **So the bar on the skip read is −0.31 s** (−0.28 ÷ 0.90). The supply is **enough** when the probe's median on the named list reaches it, and **short** when it does not. The size of the shortfall is reported in the same terms.
- I also restate the ask from m. There are three claimants (ABC-303, ABC-289 and ABC-305) at ≤ +0.10 s each, so the realised need under 9.6 s is m + 0.30 − 9.6 s. If that differs from −0.21 s, I report both.
- Remnants are proposals. The Architect confirms each with mutant reads. Whether any row can move at parity stays `UNKNOWN - verify` until then.

## Budget and fences
At most 50 minutes of lock over the whole hop; the lock is released between stages. If it would run longer I stop and report. Nothing left running. Foreign load is recorded and never touched. Records only: this task's notes and `raw/`. No `src/`, test, config, ticket, ADR, EPIC, board or catalog edit: `plans/nfr-catalog.md` is outside this brief's fence, so its `NFR-008` line, if owed, is reported as owed.
