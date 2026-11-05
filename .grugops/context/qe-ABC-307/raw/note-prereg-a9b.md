# qe-ABC-307-a9b PREREG: the one re-read of `…da060cef`, on a new clock under `…f5dc2987`. The last read under these rules. Sealed and committed before any slot poll or run

QE/E2E, task `qe-ABC-307`, brief `qe-ABC-307-a9b`. **No test, build or engine run, no `ps` look and no slot poll has happened in this hop.** A1 to A5, A7 and A8 stand on `…19f6c80a` and `…d356030c` and are not re-run.

## What this read is
- **Read 3's void, `…4a8dd8dc`:** 7 of 8 rounds flagged, a foreign `grugops` vitest first sampled 85 s into the hold (`…d5cd6d19`). It stays void. No figure from reads 1, 2 or 3 is used here.
- **This is `…da060cef`'s one re-read,** unspent at its clock's end, on a new clock under `…f5dc2987`. The owner has said the host should be quiet; the brief records no vitest and load1 0.38 at 21:39:44Z. That is the brief's reading, not mine.
- **Last read under these rules:** a void here stops the hop, with no further re-read. A void is not a miss. A miss of the target is not re-played.

## Arms, harness, scripts: `…da060cef`'s, unchanged
- **Arms:** `<scratch>/qe307/arms`, B = `e01d39b1`, H = `797bb1a5`, H2 = `cp -a` of H. Re-checked now: `diff -r --no-dereference -x .test-results H H2` is empty. Unfiltered, the one difference is `.test-results/last-run.json`, read 3's output, which each run overwrites. 19 115, 19 131 and 19 131 files. Expected 71 files, 2 709 passed, 0 skipped, 0 failed.
- **Lane inputs:** `main` is now `375f6362`, not `54cf8334`. `git diff --name-only e01d39b1 main` over `…da060cef`'s list is still empty, and empty from `797bb1a5` to the branch.
- **Harness:** as `…da060cef`, one lock hold, alone.
- **sha256 prefixes, each `cmp`-equal in `<scratch>/qe307/scripts` and `raw/scripts/`:** `n8.sh` 322833c6, `stage.inc.sh` a5b44278, `fsample.sh` 705353d6, `flags.py` 96ee7bc0, `n8-grade.py` fcb2c2d0, `reread.sh` 24a3ae41, `a9-read.py` 06ae3ca0, `a9-sens.py` 1c8897ec. All equal `…da060cef`'s. No script changes.
- **New output directory:** `<scratch>/qe307/out/n8-r5`, raw at `raw/n8-r5/`. `…da060cef` named `n8-r4`, but `raw/n8-r4/` holds the spent gate log and the brief asks for a new directory.

## Void line and verdict labels: `…da060cef`'s, word for word in effect
Flagged is `flags.py`'s rule, and a round with a flagged run is a flagged round. **VOID when** more than 2 of the 8 complete scored rounds are flagged, the twin is inadmissible, or fewer than 8 complete scored rounds finish. Up to 2 flagged rounds stay scored, with `a9-sens.py`'s unflagged sensitivity beside the grade. A flag in round 0 or an incomplete round counts for nothing and is recorded. `flags.py` runs first; the grade runs only if the flag count allows it. On a void, `n8-grade.py`'s state line is not cited and no figure stands.

**Verdict, a `decision` note by qe-e2e, if the read stands:** **PASS** with H − B ≤ −0.215 s in paired median wall on an admissible twin; **PASS_WITH_GAPS** with the target missed, `H ≥ 9.6 s` named for the owner; **FAIL** if the state is NOT MET, H over 10 s; an UNRESOLVED state goes to the Orchestrator as read, not as a pass. The target is not a bar, and `n8-grade.py`'s "BUDGET … bar ≤ +0.10 s" line is not read. Marks reported as `…da060cef` lists them: 10 s, 9.6 s, 9.5 s, `…b9038a14`'s G-GO, G-WITH, G-HOLD as a figure for routing, `≥ 9.6 s` straight to the owner, H > 10 s to the owner (`ADR-0035` D6). `R-N8H-1`'s state is Security/NFR's. **UAT** waived as the page's test note 3 says, and QE's verdict signs. **No stands-read, no verdict:** an `observation` note.

## The slot
`reread.sh`'s gate unchanged. **The clock is 15 minutes from this note's commit:** the last argument is 900 s less the seconds from commit to launch. No slot in 15 minutes stops the hop with nothing read, and that spends nothing. One background command; nothing else of mine on the host from launch to exit, no poller and no `tail`. Foreign load is recorded and never touched. Nothing is left running; checked with `ps`.
