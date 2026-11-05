# se-ABC-303-rows decision: how the Architect's list was applied

`…0f8a4f82` § 5 applied as written, at `046cac35`, in `src/engine.test.ts` and `src/uci-session.test.ts` only. No production line. No figure was adjusted and no STOP fired.

1. **Merge.** `git merge` of `main` `c9ff7ff9`, no rewrite: `2a79887d`. One conflict, `plans/traceability.md`: both sides' rows kept, `main`'s first, as at `39a5b912`. `src/` and `tools/` took nothing from `main`.
2. **The claim came after the merge,** since the brief reached the branch only through it (`d219265c`).
3. **E3 and E4's shape, which the list leaves open.** `read` takes the search as its first argument; a local `door` names `engineModule.chooseMoveWithoutQuietBundle`. A0-1's table carries two `Figures` triples (move, score, nodes) per row, door then shipped. A0-2's carries both scores beside the shared figures. A0-2 builds a fresh `virtualClock(1)` for each search, since the clock is stateful and the second search must start from 0.
4. **Comments.** One dated `ABC-303` comment per edit, citing `…0f8a4f82` and the list's item. U2's sits in the doc comment, which keeps its `…aadd2d48`. Every old comment stays.
5. **A10's title** read "three searches", so it reads "four searches", per `ABC-221`'s page. Title only, no comment. The doc comment's "3 searches of 59.5 s" was left: the brief says title only, and that sentence is the block's own count of the `go movetime` rows, the fourth being named at its end.
6. **The A3 (a) line goes in the PR's row list, not in code.** `src/see.test.ts` is outside the width, and test note 4 says the PR lists it. It is in the artifact note.
7. **`raw/rows-read.ts`** prints the list's `UNKNOWN - verify` items as figures, because a green row shows only that they equal the pin. It is a scratch read and no row.
