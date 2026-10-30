---
id: 20261030T122100Z-security-nfr-decision-d3394d72
kind: decision
by: security-nfr
at: 2026-10-30T12:21:00Z
verified_by: 
confidence: high: six cells placed and read back; rows and cells hashed before and after; records only, nothing run
refs:
  - ABC-228
  - NFR-004
  - NFR-005
  - NFR-009
  - AR-NFR004-A
  - ADR-0053
  - ADR-0053 d10
  - ADR-0045
  - plans/nfr-catalog.md
  - orch-2026-10-29g/20261030T044400Z-orchestrator-decision-c4ab73de
  - orch-2026-10-29g/20261030T041740Z-orchestrator-decision-3dd61448
  - qe-ABC-228-ii/20261030T115900Z-qe-e2e-decision-e39d190c
  - qe-ABC-228-ii/20261030T103542Z-qe-e2e-observation-3fac6579
  - qe-ABC-228-ii/20261030T103542Z-qe-e2e-observation-269152b2
  - grugops/secnfr-ABC-228-catalog
  - 0c54910e
  - 09060f67
  - e42b637b
supersedes: 
seal: sha256:e2bb157d14e6860385dae679fdb93353dd605f792461ea13b5645258b1a4259d
---

# ABC-228 reading (ii): NFR-004 / NFR-005 / NFR-009 catalog text at level 5 = 4 000 ms; no bound moved beyond the owner's word; AR-NFR004-A stands, not re-stated

Security/NFR, task secnfr-ABC-228-catalog. Branch grugops/secnfr-ABC-228-catalog from main 09060f67; catalog commit 0c54910e. Not pushed, not merged. Records only: nothing run, timed or built.

## Placed (plans/nfr-catalog.md, six cells in three rows, one _Updated line, one closing section)
- **NFR-004 Target:** "<= 3 s at default difficulty (level 5)" struck and kept, now <= 4 s, with a dated line on the owner's word (ii) (…c4ab73de, ADR-0053 d10). Ceilings 5 s (levels 1-5), 7 s (6), 32 s (7) unchanged. Mechanism line "at least 2 000 ms under it" dated: level 5 sits 1 000 ms under its 5 s ceiling (about 30x AR-NFR004-A's <= 31 ms), every other level keeps >= 2 000 (src/levels.test.ts clause B row, read only).
- **NFR-004 Verified by:** dated line. G5 at 4 000 ms (QE …3fac6579): levels A5 row 30/30 moves 4 000-4 001 ms, max 4 001; engine A1 rows 9/30 over 4 000 by <= 1 ms; levels 6/7 max 5 001 / 30 001 ms. Clause A (<= 4 s) NOT MET in the letter by the same abort granularity, covered by AR-NFR004-A. Ceiling MET at 5, 6, 7. 3 000 ms figures kept as history.
- **NFR-005 Target:** "within the 3 s budget" (twice) struck and kept, now 4 s; dated note. Depth-6 FAIL, depth-7 WARN, 5 s ceiling, plain-node runner unchanged.
- **NFR-005 Verified by:** dated status. G6 (QE …269152b2): plain node, own LEVELS[5].budgetMs, 5 interleaved rounds: kiwipete 8 x5, position-6 10 x5, 3 999.6-4 001.1 ms. FLOOR MET, DEPTH 7 MET.
- **NFR-009 Target and Verified by:** "a 1 s and a 3 s search" now "a 1 s search and one at DEFAULT_BUDGET_MS (3 s struck, 4 s from 2026-10-30)". The instrument (src/transposition.test.ts A7) always read DEFAULT_BUDGET_MS; it ran green at 4 000 in QE's ENGINE_DEEP lane (26/26). A longer second search is not a loosening.

## Rulings
1. **AR-NFR004-A: stands with its number; not re-stated.** Mechanism, <= 31 ms bound, owner (Security/NFR) and scope unchanged. Only the default call moved (budgetMs 3 000 -> 4 000). Reading at the new call: max +1 ms, inside the bound and not materially worse than 1.03 % (the risk's own re-open test). The closing section records this as its 4 000 ms reading.
2. **No bound moved beyond the owner's word.** (ii) moves level 5's per-move time and every level-5 statement; NFR-004 clause A and NFR-005's referent are level-5 statements. ADR-0053 d10 wrote these consequences before the build, as …c4ab73de asked.
3. **Owner: no decision needed for the catalog text.** For his information only: a depth in 4 s asks less than in 3 s, and level 5's ceiling margin halves to 1 000 ms; both are what (ii) means. One item IS his, and gates nothing: SEC-228-a (re-base the catalog's reference machine/runtime to the current host).

## Check
- Every NFR row hashed (sha256) before and after: only NFR-004, NFR-005, NFR-009 changed, and only their Target and Verified by cells (cell-by-cell compare). git diff --numstat on the catalog: 61 insertions, 3 deletions (3 rows edited, 1 _Updated line, 58-line section).
- Class scan of my added text: no host paths, IPs, URLs, machine model. The one hit in the diff is pre-existing NFR-005 text (the whole row line shows as changed).
- No src/, tools/, data/, test, ADR, board, trace, ticket or AGENTS.md byte changed.
