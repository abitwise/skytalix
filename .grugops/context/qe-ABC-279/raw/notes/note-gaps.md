# qe-ABC-279 gaps, by severity: 0 blocking, 0 high, 0 medium; 5 low and 2 information. Every one is a record, a wording or a risk to watch. None is a defect in the build, so nothing goes back to the Software Engineer

QE/E2E, task `qe-ABC-279`, on `1feb7560`.

## Low
- **QE-279-a, A1 (b)'s wording cannot be met as written (ruled a gap, not a bar move).**
  - The bar asks for each `false` row "on a board where SEE alone would call the capture losing".
  - For a capture of an equal or bigger piece, en passant and every capturing promotion, `see ≥ victim − attacker ≥ 0` (the fold's lower bound), so no such board exists.
  - For a king capture it exists only on an illegal move: a legal king capture lands on an unattacked square, so its `see` is the victim's value.
  - So at threshold 0 the four guard clauses of `ADR-0069` d2 are behaviourally redundant on legal moves. They only spare a SEE call. A mutant that deleted any of them would pass every row (QE's and the Engineer's).
  - The rows pin `false` with `see` stated, which is all the code allows. Owner: Architect, a dated wording line in `ADR-0069` d10. No code change.
- **QE-279-b, the Engineer's Result names the frozen `src/` tree wrongly.** It gives `9e50717b`, but that is `cd9ccd10`'s tree. `1feb7560`'s is `fe6a0975`. The production files are equal, so nothing graded moves. Records only.
- **QE-279-c, `F9`'s margin on kiwipete is zero.** `G6` at 4 000 ms reads 9 = 9 there, with head nps about 0.80 × base (SEE's per-node cost). A later ticket that adds per-node cost in quiescence could fail `G6`'s median on kiwipete first. It is a regression risk for the next search ticket's `G6`.
- **QE-279-d, C2′'s interval spans 0.** +27.9 ± 60.0 (−32.1 to +87.9). GAIN is a point-estimate bar by the ticket's own text, and it is met at 54.0. The strength gain is not statistically resolved at 100 games, and the epic's C3″ read is where it will be.
- **QE-279-e, `N8-LANE` headroom is 0.50–0.58 s.** Head median 9.42 s and max 9.50 s against 10 s. It is met, and it is thin.

## Information
- **QE-279-f, `ABC-122` A6's oracle record gained `taper: true` beside `seePruning: true`.** That mirrors the shipped `RULES_SEE_PRUNING` exactly, and it is correct: the oracle's record had lagged the shipped one since `ABC-269`. The comment names only the SEE re-pin.
- **QE-279-g, the deep rows have no AGENTS.md lane line.** `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/see.test.ts` (52 tests, 54 s) holds A3 / A4. It is run here, but AGENTS.md § Test does not list it (the Engineer's suggestion). That edit is the Orchestrator's.

## Not covered (stated, not hidden)
- SEE's per-node cost is not timed in isolation. `G6`'s real-clock read is the instrument (`F9`), as the ticket says.
- A1 (b)'s guard clauses cannot be shown to bite (QE-279-a).
