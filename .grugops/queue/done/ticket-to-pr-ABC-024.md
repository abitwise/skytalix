---
result: delivered
branch: grugops/ABC-024-castling-default-lane
tip: 290a9f86
code_commit: a18da7f5
base: b84dc637
---

ABC-024 delivered on branch. The only file changed under `src/` is `src/moves.castling.hardening.test.ts`, +280/-0.
`src/moves.ts` md5 is still `6335b452fc21ffe2d0f902ecab930840`, so there are 0 production lines.

A1-A5 are MET. Five survivors at base 1792 (BK g8, BQ b8, BQ c8, R-half, R-ep) are now killed on A1/A2
rows, and so are the two that base killed only incidentally (BQ d8, R-full). All 15 equivalent controls
still survive, so 0 kills were added.

Gates on the tip: lint, typecheck and build exit 0. `npm test` gives 58 files, 1810/1810 (base 58/1792).
The last-run success flag is true, skip count is 0, integrity reports `No findings.`, and PERFT_DEEP is 32/32.

Notes are in `.grugops/context/ticket-to-pr-ABC-024/notes/` on the branch. `plans/traceability.md` was not
touched; the row is in the handoff.
