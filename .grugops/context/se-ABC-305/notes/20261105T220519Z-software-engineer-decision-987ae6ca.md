---
id: 20261105T220519Z-software-engineer-decision-987ae6ca
kind: decision
by: software-engineer
at: 2026-11-05T22:05:19Z
verified_by: 
confidence: high: a pre-registration; sealed before any poll or timed run; nothing measured
refs:
  - se-ABC-305
  - se-ABC-305-main
  - ABC-305
  - ABC-301
  - ABC-307
  - NFR-008
  - ADR-0035
  - R-CEN-1
  - 35a694ee
  - a8594b50
  - 148c42e9
  - se-ABC-305/20261105T123410Z-software-engineer-decision-a175246b
  - se-ABC-305/20261105T124015Z-software-engineer-observation-2adad06f
  - orch-2026-10-30a/20261105T124120Z-orchestrator-decision-9e878ba6
  - orch-2026-10-30a/20261105T200316Z-orchestrator-decision-f5dc2987
  - orch-2026-10-30a/20261105T215707Z-orchestrator-decision-43e6d8fd
  - secnfr-census-1105/20261105T115526Z-security-nfr-decision-b9038a14
supersedes: 
seal: sha256:455d5a9ee3f5d4cbd968f8be68c52e988c4d2c9dbd2b2f347318a58a51652358
---

# PREREG, se-ABC-305-main: `ABC-305` A5, the `N8-LANE` re-read on the new base. Sealed and committed before any poll. No timed run in this hop

Software Engineer, task `se-ABC-305`, brief `se-ABC-305-main`. Ruling: `…9e878ba6` (a re-read is allowed, same harness, new output directory, new PREREG stating the void, after `ABC-307`'s merge). **This hop runs nothing timed and polls nothing.** The read waits for a hop dispatched on the owner's word that the whole host is quiet (`…f5dc2987`, `…43e6d8fd` item 4).

## What this read is
- **Read 1's void, `…2adad06f`:** PREREG `…a175246b`, H `a321b45e`, B `a21136b0`. Another project's vitest ran through the hold outside the lock: 8 of 8 scored rounds flagged, 0 unflagged. It stays void: no A5 verdict, not a miss. Neither its figures nor its `grade.out` lines are used or cited here.
- **What differs from `…a175246b`:** the arms (new base), the output directory, one re-read on a void where read 1 allowed none, the slot clock, and the flag count read before the grade. Nothing else.

## Arms, out of tree, `<scratch>/se305/arms`, each borrowing `node_modules` by symlink
- **B = `main` `a8594b50`** (`git archive`), the second parent of the merge: the tip's base on `main`. Lane inputs equal `bce24018`'s.
- **H = merge `35a694ee`** (`git archive`), parents `148c42e9` and `a8594b50`. Every later commit on the branch must be records only. **The read hop checks that first:** `git diff --name-only 35a694ee HEAD -- src tools package.json package-lock.json vitest.config.ts tsconfig.json AGENTS.md` empty, or it stops. If `main` has taken a lane input by then, these arms are stale, and it stops.
- **H2 = `cp -a` of H,** the identity twin. `diff -r` is read in this hop's readings note, not here.
- **Expected counts,** each read by one preflight `npm test` under the lock, counts only, its wall not used: B 71 files / 2 709 / 0 skipped / 0 failed, H and H2 71 / 2 710 / 0 / 0.

## Harness: `…a175246b`'s, one `flock <scratch>/host-test.lock` hold, ALONE
- **Scripts, `raw/scripts/`, `cmp`-equal in `<scratch>/se305/scripts`, sha256 prefixes:** `n8.sh` 254a7867 (its one change from read 1 is the header comment naming the arms; the counts are the same), `stage.inc.sh` a5b44278, `fsample.sh` 705353d6, `flags.py` 96ee7bc0, `n8-grade.py` fcb2c2d0, `reread.sh` 24a3ae41, `census.cjs` c8ab7cdb.
- Order rotates B H H2 / H H2 B / H2 B H. Round 0 is discarded. Until 8 complete scored rounds or 12 rounds, no new round past 1 200 s. `npm test` as spelled, one fresh process per run, `/usr/bin/time` wall and CPU. Every output file is checked non-empty before it is read, and an empty one leaves the run unscored. Host gate: load1 ≤ 8 before every run, waiting up to 120 s.
- **Grader:** `n8-grade.py` unchanged, k by `ADR-0035` D1 (k = 2 at n = 8–10). Twin admissible when |H2 − H CPU median| ≤ max(1.5 % of H's CPU, 10 ms), sign at chance, n ≥ 8.
- **Output:** `<scratch>/se305/out/n8-r2`, raw at `raw/out/n8-r2/`. A re-read goes to `n8-r3`, `raw/out/n8-r3/`.

## The slot
- **Clock: 15 minutes, 900 s, from the read hop's launch,** as `reread.sh`'s last argument. It cannot run from this note's commit, because the read waits on the owner's window and that time is not known here.
- `reread.sh`'s gate unchanged: take the lock, five samples 3 s apart naming no vitest, else release and try again after 60 s.
- No slot inside the clock stops the hop with nothing read. That spends neither the read nor the re-read, and a new clock is the Orchestrator's to give.
- One background command. Nothing else of the hop's on the host from launch to exit: no poller, no `tail`. Foreign load is recorded and never touched.

## The void line, `…b9038a14`'s
- **`flags.py` runs first, and the grade is read only if the count allows it.** Flagged is `flags.py`'s rule, and a round with a flagged run is a flagged round.
- **VOID when** more than 2 of the 8 complete scored rounds are flagged, or the twin is inadmissible, or fewer than 8 complete scored rounds finish.
- Up to 2 flagged rounds stay scored, with `flags.py`'s unflagged sensitivity beside the grade. A flag in round 0 or an incomplete round counts for nothing and is recorded.
- On a void, `grade.out`'s state and BUDGET lines are not cited and no figure stands. The grader does not read the flags, so its "MET" says nothing about a void.
- **One re-read on a void,** same arms, harness and rules, its own 15-minute clock from its own launch. **A void on the re-read stops the hop:** no further read under this PREREG, and the call goes back to the Orchestrator. A void is not a miss.

## The rules, fixed before the read
- **A5's bar:** the paired H − B median wall ≤ **+0.10 s** (`n8-grade.py`'s BUDGET line), with an admissible twin, **and** H's median wall ≤ 10 s. The difference of the two arm medians, the k = 2 interval and the twin's wall R are reported beside it and do not change the outcome. The page's bar is the median.
- **A read that stands is final. A miss is not re-played under this PREREG.** Over budget, the page's answer is that the row goes deep and the read is taken again; whether that can be done without breaking A2 is read then, and if the page does not cover it, the hop STOPS.
- **Reported against 10 s, 9.6 s and 9.5 s, as figures.** Routing on `…b9038a14`'s lines is the Orchestrator's, and any `NFR-008` line in the catalog is Security/NFR's. `R-N8H-1`'s state is not read here.
- **Rows (A5):** from H's and H2's scored JSON, `census.cjs` medians: every default-lane row of ≥ 50 ms among those this ticket adds or changes, and the sum of the added and changed rows against the 90 ms aim. "Added or changed" is listed by name from the diff against `main`, for the two `src/` files and `tools/tune/tune.test.ts`. A row of ≥ 50 ms that this ticket did not add or change is only reported if it is new against `main`. No new test file: 71 and 71.
