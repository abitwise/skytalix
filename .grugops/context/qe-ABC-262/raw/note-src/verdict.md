# qe-ABC-262 verdict: PASS_WITH_GAPS (A4 waived by the Orchestrator); QE-262-a LOW, QE-262-b INFO, QE-262-c INFO; none blocking

The grade is of `grugops/ABC-262`: code `39a6237e`, tip `bb399321`, base `767a2e3e`. QE branch `grugops/qe-ABC-262`. The acceptance contract is the ticket page. The SE's published notes (`se-ABC-262` `…2f045ef5`, `…70b46340`, `…e1a2c12e`, `…89aff8be`, failed-attempt `…2aee4de1`) were read first. Every run went under `flock host-test.lock`.

| row | verdict | evidence |
|---|---|---|
| A1 green at production | **MET** | both rows pass in 3 head `npm test` runs (2 376/2 376) and in the merged tree |
| A2 non-vacuous boards | **MET** | read in the diff: B2 out of check, `pseudo[0]` a pawn, ≥ 3 king moves, spied count > 0; P1′/P2′ black to move, in check, black pawn on `from >> 4 === 1`, square ahead empty, absent/present asserted |
| A3 QX1, PL3a, QX2 red | **MET** | B2 counts: production 1, QX1 2, PL3a 9, QX2 10; row red on each (plants note) |
| A4 QB red on P1′ | **NOT MET, WAIVED** (Orchestrator) | QB green on the row and on all of `npm test`; **red on the ENGINE_DEEP ABC-254 A1 walk** (C0 green). Line 429 read and correct (line-429 note). QE's own QBe and QKb turn the black row red, so it has teeth. |
| A5 plants never committed | **MET** | 0 plant or probe markers in `git log -p 767a2e3e..HEAD -- src` |
| A6 diff fence | **MET** | `39a6237e` touches only `src/gameend.nfr.test.ts` and `src/legal.test.ts`. One import line is widened (adds `PAWN`); 0 removed title or `expect(` lines. Neither file has a header test count (`gameend.nfr.test.ts` line 8's "45 tests in `gameend.test.ts`" is a historic measurement of another file). Added comments cite only ABC-262, ABC-261, QE-261-a and QE-261-b. The `base..code` range also carries the SE's claim paths (`3ea272c0`), accepted as before. |
| A7 cost | **MET** | summed row median 0.29 ms ≤ 20 ms |
| A8 gates | **MET** | lint, typecheck and build rc 0; 2 376 = base 2 374 + 2, 0 skips; skip-integrity and lane-inventory (63 = 63) report no findings; G8 H 8.94 s ≤ 10 s, admissible (ALONE ×6) |

- **UAT:** waived. `git -c core.quotePath=false diff --name-only 39a6237e~1 39a6237e | grep -v '\.test\.ts$' | grep '^src/'` is empty, and so is the same grep over `767a2e3e..bb399321`. No production line changed, and QE's verdict signs.
- **Merge:** `merge-tree` against `main` `d9bbd0c2` is clean (tree `0988f004`). That tree runs 2 376/2 376.
- **Gaps (gaps note):**
  - QE-262-a (LOW): the black row's catch of QB-shaped regressions is masked by the epoch-0 alias; carry to ABC-252.
  - QE-262-b (INFO): the ticket page's A4 should be marked waived at close.
  - QE-262-c (INFO): the scratch volume hit EDQUOT; old hop trees need clearing with owner consent.
- **Board:** ABC-262 can leave In Review. With no production line, NFR is met in-row, and UAT is waived, it goes to the Orchestrator for merge routing. Humans hold merge.
