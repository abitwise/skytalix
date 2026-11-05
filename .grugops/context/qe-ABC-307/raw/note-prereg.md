# qe-ABC-307 PREREG: A7's list, the order-independent MC1, F3's three random-half plants, and A9's method, sealed and committed before any run

QE/E2E, task `qe-ABC-307`, for `ABC-307`. **No QE test, build or engine run has happened.** Before this seal I made scratch copies, confirmed the anchors apply exactly once, and loaded the plant dictionaries without running a test. The SE's readings are not QE's and are not re-used.

## Trees
- **Base** `e01d39b1` (the build's branch point). **Tip** `797bb1a5`, code `47556083`. `git archive` copies in `<scratch>/qe307`, `node_modules` borrowed by symlink. Mutants touch only those copies.
- The ten production and data files `mut.py` restores compare equal at base and tip. `src`, `tools`, `data`, `package.json` and `vitest.config.ts` have no diff between `8d66a706` and `e01d39b1`, so the Architect's kill sets read on the same code.
- Every run is `flock <scratch>/host-test.lock taskset -c 0 …`, one worker where the Architect's scripts set it, held per run. **A9 is the one exception on the core:** the page reads `npm test` as spelled, as the census did, and pinning it would measure something else. It keeps the lock for its whole session.
- Scripts in `raw/scripts/`, sha256 prefix: `a3.py` ac41c7f7, `a7-plants.py` 2e834551, `a7-plants-read.py` 9f76a128, `a7-read.py` 9eac23ff, `a7.sh` 6e31b2b3, `a8.sh` d7db7961, `a9-read.py` 06ae3ca0, `flags.py` 96ee7bc0, `fsample.sh` 705353d6, `mc1lines.sh` 2104ef4e, `mutq.py` f3d64617, `n8-grade.py` fcb2c2d0, `n8.sh` 322833c6, `reread.sh` 24a3ae41, `stage.inc.sh` a5b44278. The Architect's, verbatim: `mut.py` eac26ea2, `sweep.sh` 68283ba8, `lane.sh` 2e03fd97, `tlines.sh` 220bab6c, `summ.py` 3a8544ff, `frozen-mutants.json` 9cbf279f, `mb1.json` 8ea3c0b3, `plants.py` e993fc0f. Plant set sha256 17826ac6, as `…5c65a408` sealed.

## A7: the list, frozen
**Twenty `src` and `data` mutants, whole default lane at base and tip, then the row's `-t` line at the tip (`sweep.sh`):** the page's A7 table, read by `a7-read.py`, which holds each row's required remnants, holders and deep lines.
- **Base kill sets, frozen by reference:** `arch-ABC-307-reads` `raw/kill-matrix.tsv` 8626d805, `raw/kills/` 951525ac, `raw/tlines-mutated.tsv` 4448f55a, `raw/plants.tsv` f99e3049. As counts, base then tip: ML1 1/1, M6 21/20, M7 3/3, S241M2 12/12, QMATCH1 8/7, S241M1 18/19, S241M4 2/2, F230 8/7, M2s 7/6, M4 19/20, QSEAMRAW 7/6, QPRIOROFF 16/15, QMATCH3 20/19, QTRIM1 30/29, MC1 11/11, MC2h 9/9, P2a 17/17, P2b 6/5, MB1 3/3, M4z 22/22. **A count that differs is reported. It is not a miss;** the three legs decide.
- **Trio plants, `a7-plants.py`:** each plant at base (the test file, default), at the tip (default) and at head (the tip under `ENGINE_DEEP=1`). That is the 38 tool plants (A5R and `F2`'s two among them), the 6 memo plants, the 3 re-anchored `q4b`. Rules, in `a7-plants-read.py`:
  - every tool plant the base file kills, the tip file kills, and head holds base's names, deep suffix removed;
  - the six memo plants read 0 in the tip's default lane and red at head by base's names;
  - `q4a-readNotes-unfiltered-drops-secnfr` and `…-quality-gate`: Q1's remnant at the tip, Q1 at head. MQ2: Q2's and Q2. MQ3: Q3's and Q3;
  - `q4b-tip-named-read-empty` Q2's remnant, `q4b-tip-copied-root-empty` Q1's, `q4b-tip-both-empty (two faults)` both;
  - **A5R, repeated:** base 3 red, tip default 0. **`F4`** by `ABC-154` A4's method: whole-tree reads 2 at head, 0 with the flag unset;
  - **`F2`:** each of the two plants 0 at base, 0 in the tip's default lane, **≥ 1** at head; the unmutated head green at 36 of 36.
- **`F3`:** head ⊇ base by name over the 32 (31 plants and the unmutated control), QE's `own` plants and `F2`'s two.
- **What counts as killed** is `…5c65a408`'s: a row `failed` in the JSON report; a suite error counts for every row of that file; an absent or empty report is UNREAD, re-run once, never 0 killers; a total that differs from its control with no suite error is UNREAD; a run-bounded 124 is not a kill. Unmutated control lanes at base and tip must be green with 0 skipped before any mutant reading stands.

## The order-independent MC1, its form and its read
`UNKNOWN - verify` until run; nobody has run this form.
- **Why MC1 is not.** It adds a running session count to the seed, so a row's two sessions get salts n and n + 1, and a kill needs those two salts to take different paths. That depends on n.
- **The form (`mutq.py`).** The same two anchors as MC1, but the salt is the count's **parity**: `const mc1Salt = (G.__mc1 = (G.__mc1 ?? START) + 1) & 1;` and `seed + mc1Salt`. Any two consecutive sessions get salts 0 and 1, in some order. On seed 2 those take different first moves (`raw/mc1-probe.txt`: 0 e2e3, 1 b1c3).
- **Why that is order-independent, and how it is shown.** The parity is the mutant's only state, so it has two orders, and both are read: **`MC1p0`** (START 0) and **`MC1p1`** (START 1). They are one form at its two parities.
- **Its weakness, stated first.** It is fitted to seed 2, the seed both rows use. It shows the rows catch a cross-session leak in the seed; it says nothing of a leak whose salts happen to take one path.
- **The read, at each parity:** (a) base default lane killed, with the full C1 row among the killers; (b) tip default lane killed, with C1's remnant among the killers; (c) the tip's C1 deep line, "1 failed"; (d) base's full row alone on its `-t` line, "1 failed"; (e) the tip's remnant alone on its `-t` line, "1 failed". Controls, unmutated: (c), (d), (e) each "1 passed".
- **A miss of (a), (b) or (c) at either parity is a STOP** (`…ad217a34` 5). (d) and (e) test the form. If one fails, the form is not what this note claims. That is also a STOP: the form is not redesigned after this seal, and A9 is not read.
- This read comes first, before the other twenty.

## F3's three random-half plants
`q5-readNotes-drops-random-half (unfiltered only) #1`, `#2`, `#3`, loaded verbatim from `plants6.py`. The three are one edit, and `Math.random()` makes each run a fresh draw, so a kill set from one run means nothing.
- **Draws:** five per plant at base and five at head, so 15 a side.
- **Rule on the pool of 15:** (i) `F1` is red in **every** head draw; (ii) every name red in any base draw is red in some head draw, deep suffix removed; (iii) each plant's own union is printed, for information.
- **A name missing at head** gets one top-up of 15 head draws. Still missing is an `F3` miss, a STOP to Architect/Design, reported with its base count. No other re-read.

## The rest, before A9
Controls first, then the MC1 read, the twenty, the plants. Then `a8.sh`: typecheck, lint, build, `npm test` at base and tip (A3 by `a3.py`), the skip count, `test-skip-integrity`, `lane-inventory`, the 22 lines (`ABC-167` A5 reads 4 passed, the rest 1 passed), and the three deep lanes at tip and base. A1 and A2 are read from git, with `se-ABC-307`'s `a2check.py`. A sampler logs foreign vitest through all of this. **Budget:** 50 minutes of lock before A9; past that the stage stops and what is unread is said. Every output file is checked non-empty before it is read.

## A9: `NFR-008`, graded, last
**Arms:** B = `e01d39b1`, H = `797bb1a5`, H2 = `cp -a` of H, `diff -r` clean. All three expect 71 files, 2 709 passed, 0 skipped, 0 failed. `git diff --name-only e01d39b1 07773bde` over `src tools package.json package-lock.json vitest.config.ts tsconfig.json AGENTS.md data biome.json` is empty, so H's lane inputs are what `main` holds once this tip merges. The page says A9 reads `main`; the brief reads it here, before the merge.

**Harness:** the census's, unchanged but for the expected counts. `n8.sh`, `stage.inc.sh`, `fsample.sh`, `flags.py`, `n8-grade.py`, `reread.sh`, under `…b9038a14`'s rules: `npm test` as spelled, one fresh process a run, rotated B H H2 / H H2 B / H2 B H, round 0 discarded, until 8 complete scored rounds or 12 rounds, stage clock 1 200 s, load1 ≤ 8 before each run, every output checked non-empty. One lock hold, alone, nothing else in it.

**The slot.** `reread.sh` takes the lock and starts only when five samples 3 s apart name no foreign vitest; otherwise it releases, waits 60 s and tries again, for up to 40 minutes. No slot in 40 minutes is a void of that attempt: nothing was read. This note is committed before the first poll.

**The void rule, the brief's.** The read is **VOID** when:
- **any** scored round in the grade is flagged for foreign load by `flags.py`;
- the twin is inadmissible;
- fewer than 8 complete scored rounds finish.

`…b9038a14` allowed up to 2 flagged rounds of 8, kept scored. The brief says flagged rounds void the read, and it is the later and tighter line, so any flagged round voids. **One re-read is allowed on a void, in a new output directory. A second void stops the hop. A void is not a miss.** On a void the flags are reported, `n8-grade.py`'s MET line is not cited, and no figure from that read stands as graded. Round 0 is discarded, so a flag there voids nothing, and it is recorded.

**Reported on a read that stands:** H's median with its interval and max against 10 s, 9.6 s and 9.5 s; H − B in wall and CPU; the twin's admissibility and R, from `n8-grade.py`; three-decimal figures from `a9-read.py`. **The target is H − B ≤ −0.215 s in paired median wall, graded with an admissible twin. It is not a bar.** A miss is a gap the Orchestrator routes, and it is not re-played. `n8-grade.py`'s "BUDGET … bar ≤ +0.10 s" line is another ticket's bar and is not this ticket's. H's median goes through `…b9038a14`'s G-GO, G-WITH, G-HOLD; `≥ 9.6 s` goes as `…ad217a34` 4 says; `R-N8H-1`'s state is Security/NFR's. QE reads no further.

## STOP and verdict
- A miss on any leg of A7 is a STOP to Architect/Design, not a waiver.
- A STOP before A9 leaves A9 unread.
- UAT is waived if A1's `grep` is empty (test note 3), and QE's verdict signs.
- Nothing is left running. Foreign load is recorded and never touched.
