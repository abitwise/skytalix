---
result: delivered
branch: grugops/ABC-157-castling-one-right
tip: 2202b8eb
code_commit: 968a5843
base: aa37f9cb
---

ABC-157 is delivered on its branch, in the worktree `/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-ABC-157`.
The only file changed under `src/` is `src/moves.castling.hardening.test.ts`, +90/-0, with 0 removed lines at `-U0`.
`src/moves.ts` md5 is `6335b452fc21ffe2d0f902ecab930840` at base and at head, so there are 0 production lines.

A1-A4 are MET.
- `X-any-right` survives base 1824/1824 and is killed at head on exactly the six new rows. It reads 26 moves on
  all six, against 25/25/25/25/24/24 delivered.
- The seven named ABC-024 mutants and both class controls are killed at base and head, with identical failure
  lists apart from ABC-157 rows.
- EQ01-EQ15 survive at both, so 0 kills were added.

Gates on `968a5843`: lint, typecheck and build exit 0. `npm test` gives 58 files, 1830/1830 (base 58/1824, +6).
The last-run success flag is true, skip count is 0, integrity reports `No findings.`, and PERFT_DEEP perft is 32/32.
No timing was read.

Notes are in `.grugops/context/ticket-to-pr-ABC-157/notes/` (`…da7f6206`, `…14459646`, `…2a729cfc`) on the branch.
`plans/traceability.md` and `plans/board.md` were not touched; the row is in the handoff.
