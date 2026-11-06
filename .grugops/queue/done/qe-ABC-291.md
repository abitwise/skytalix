---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-06T20:54:25Z
subtask: qe-ABC-291
role: qe-e2e
ref: .grugops/context/qe-ABC-291/
branch: new grugops/qe-ABC-291 from grugops/ABC-291 at 9e496e4a — worktree .claude/worktrees/qe-ABC-291
width: stage 0 only: seal the PREREG and read the count rows. No timing run, no game. Reads only: no src or test change lands.
---
# ABC-291's PREREG and count rows
Read ABC-291's page, ADR-0075 with its dated lines, …2d2c2bad, …77dd9228, …860a0dbd, …28283e48, …a223d29a, and qe-ABC-303's PREREG …53858301 for shape.
1. **PREREG, sealed before any run.** It carries:
   - …28283e48 § 3 (a)–(f): FL word for word, in the order Reach, CF1–CF10, ADR-0075 d8's table, FL; fsample.sh by name, sha 705353d632274a01; W not inherited, left open for the Orchestrator's line before the first game, with both branches written (without W the CF3 STOP branch stands); the Levels line; "the harness's state: label is not the verdict"; FL stops at games.
   - K4 in ADR-0067 d8's A5 shape with a main-copy control, PR8's two levels, stated as F2's one re-read: above 1.03 × is not merged and a miss under d11 (d). K5 with its void rule, every run at depth ≥ 6; a clean run below is F2's second miss (…43e6d8fd 3). NFR-008 timing with its void line …b9038a14. Timing before games.
   - C2′ GAIN ≥ 50.0 of 100 at 100 ms against the merge-base, then S′ at E 1 810, then Levels, each by bar. A miss is never re-played; a void is not a miss.
   - Any G1 row missed is class B: QE FAIL, defect check, on an exact build NOT MET, F3, no owner route (…860a0dbd). Row 1632's watch.
   - The run-rule's 23rd line, F1's deep line in ADR-0046, "1 passed". About 1.4 GB of /tmp quota per C2′, not shown by df.
   - Each stage's wall estimate, and the total owner-held window.
2. **Count rows, no quiet host needed:** K0 to K3 and K7 at the tip, and the five production files against 63af973e. Read K3 yourself; the page's "unread" is yours to close.
3. **K1 follow-ups:** read the engineer's fileFlip helper (…96abeaf8); say whether its flipped side-to-move and per-row memo omissions leave a gap.
4. **D8's leak, …77dd9228:** plant a W1 leak on a copy, off the worktree; say whether D8 still reads red. Then delete the copy.
STOP after these. Do not start timing or games: those come in a later brief carrying the owner's word. Report the PREREG note id, the window estimate and any red.
Every test or engine run goes under the host lock the dispatch prompt gives, one at a time. Deep spelling: ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run <file>; "no tests" is a failure. Read counts. Log foreign load by class and count only; no foreign command line in any record. Leave nothing running; check with ps, not pgrep -f.
Fences: your records only. No src, test, ticket, ADR, EPIC or board edits. No push, force, amend or rebase, and no merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.

## Result

_by qe-e2e (claude-opus-5-5, qe-ABC-291), 2026-11-06T21:31:04Z, branch `grugops/qe-ABC-291` from `grugops/ABC-291` at `9e496e4a`. Stage 0 only. No src or test edit, no timing run, no game, nothing tuned, nothing pushed or merged. No verdict comes from this stage._

**PREREG `…a49d69d7` sealed and committed at `22319099` before any run. Count rows clean, no red. D8 still reads red under a leak. Stop here: timing and games wait for the brief that carries the owner's word.**

- **PREREG:** `…a49d69d7`, addendum `…7febbbfe`. All the brief's lines, with Reach, CF1–CF10, d8's table and FL copied by script. Candidate `70d931ab`, base `780d9021`.
- **Held by it:** H1 the owner's word for timing. H2 W, both branches written. H3 no game until `NFR-008` is read and met, QE's stricter reading of a point the records leave open, for the later brief to confirm or change. H4 the `/tmp` quota.
- **Window:** timing about 14 min, 27 with every allowance. Games about 41 min, 48 with S-4's ten more. **About 55 min back to back; with every allowance about 75 min, over 1 h, which needs his word.** Two stages, each under 1 h. Without W he holds only the timing stage.
- **Count rows (`…710af068`):** five files blob-equal to `63af973e`. K0 7 of 7, 70 of 70, 7 of 7. K3 read at the tip, closing the page's "unread": mate floor 0 of 163 and 0 of 191, zugzwang 7 / 7, `G1` 54 / 58, no NEWLY-MISSED line. K7 28 of 28. `npm test` 2 814 of 2 814; `ENGINE_DEEP` pawns 121, `uci-session` 270, `engine` 105; `SEARCH_DEEP` bundle 51; `PUZZLE_DEEP` 18. The 23 lines by count, `F1` 1 passed.
- **K2:** 62 of arm T's 63 reds are in the list's 64 and the two byte rows stay green. The 63rd is the `QUIET_RULES` source row, named in `…cb124720` and ruled in `…2d2c2bad` § 3: not a defect.
- **Row 1632's watch:** 16 838 of 20 534, 82.0 %, misses at 0.8×, unchanged.
- **K1 (c), two halves:** rows 60, green. Order **not met to the letter**, and the merge question is the owner's. Labeller `4dc558bb…` at the tip: 28 126 positions, 0 mismatches (`…f80750e9`). The form (b) sets are named in `…7febbbfe`.
- **K1 follow-ups (`…f80750e9`):** `fileFlip` is right and bites. Side to move and the memo per row leave no gap on the five plants tried. One limit named: K1 (d) reads the 60 as written, not in images.
- **D8 (`…d8e51b65`):** all four `D8` rows and `D7` read red under a planted leak, and the copy is deleted. The margin stays one clock read, 595 nodes.
- **My faults, no figure moved:** `k2read.py`'s matcher read 0 matches and `k2match.py` replaced it; a bare `--dry-run` needed the tools' environment.
- **Host:** at most 2 busy node-class processes around the row holds, by class and count, none touched. Quota left 1 464 165 kB at close, about 90 MB over one C2′, and it moved through this hop.
