---
id: 20260809T220313Z-software-engineer-observation-ba761d81
kind: observation
by: software-engineer
at: 2026-08-09T22:03:13Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - src/moves.enpassant.test.ts
  - src/moves.ts
  - src/apply.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# Every sentence in the corrected comments, re-measured at this hop — four trees, and both mutant hashes came out byte-equal to hop one's

A comment that carries a fact is a fact this role owns, so nothing below was transcribed from an
earlier hop's note. Four full tree copies outside the repository, `node_modules` symlinked,
`tsconfig` narrowed to `src/**`, **one OS process per tree**, `tsc --noEmit` **exit 0 on every tree
before any result was believed**, and every probe **prints its FEN and re-parses it** — the probe
aborts if `toFen(parseFen(fen)) !== fen`, so a mistyped board cannot silently become a verdict.

```
tree             moves.ts md5                        what it is
t-pristine       0e247853ab2c05887c76105ff83d8621    git archive main src
t-fix            6335b452fc21ffe2d0f902ecab930840    git archive HEAD src, diff -r verified against the working tree
t-fix-noEmpty    6762b334bd096f8b1d072cb68478786d    the empty-target condition deleted from the fix
t-fix-noPawn     2f19080b1bf32fc1f72bd063f48ea3f3    the captured-pawn condition deleted from the fix
```

Both mutant md5s are **byte-equal to the first engineer hop's**, which corroborates that hop's
mutants rather than restating them. Each mutation was an anchored single edit asserting `count == 1`
before writing and asserting the file changed after.

## The before/after the corrected text asserts

```
rows                              t-pristine (main)                         t-fix (branch tip)
4 own-colour-occupant  (A1)       gen_ep=1 legal_ep=1, pure, 0 dirty        gen_ep=0 legal_ep=0, pure, 0 dirty
6 no-captured-pawn     (A3)       gen_ep=1 legal_ep=1, impure on 5 of 6,    gen_ep=0 legal_ep=0, pure,
                                  1 dirty make/unmake pair EACH             0 dirty pairs
4 enemy-occupant       (A5)       gen_ep=0                                  gen_ep=0     <- unmoved
2 controls             (A6)       1/1 and 1/0                               1/1 and 1/0  <- unmoved
```

The `A5` row is why *"Already 0 today"* was left standing, and the `A6` row is the standing check that
this ticket's fix does not over-reject.

## The self-masking sentence, traced move by move rather than asserted

On `main`, `4k3/8/8/8/3pp3/8/8/4K3 b - e3 0 1`, e4 holds byte `9` (a black pawn):

```
move #1 d4->d3        e4 after unmake = 9
move #2 d4->e3 [EP]   e4 after unmake = 1     <- the black pawn rewritten WHITE
move #3 e4->e3        e4 after unmake = 9     <- the very next move puts it back
... 5 further king moves, all 9
end of pass: e4 = 9
```

So the call-level oracle reads CLEAN and the pair-level oracle does not — and *"the very next move in
the same pass"* is literally true, which is why that phrase survived the tense change. On `t-fix`
the position offers no en-passant move at all, so nothing rewrites e4 and `dirty_pairs` is 0.

## Half (b)'s "the restore CREATES one", traced the same way

On `main`, `4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1`: d5 is **empty (0)** before, the generator offers the
en-passant move with `captured = 9`, and after the make/unmake pair **d5 holds `9`** — a black pawn
the board never held. On `t-fix` that row offers **0** en-passant moves.

## The two mutant counts written into the new paragraph

`npx vitest run src/moves.enpassant.test.ts`, one tree per process:

```
t-fix           58 passed (58)
t-fix-noEmpty    8 failed | 50 passed    A1 x4, A2 x4
t-fix-noPawn    23 failed | 35 passed    A2 x6, A3 x6, A4 x11
```

Failing tests were bucketed from vitest's JSON reporter, not read off the console. The **A4 x11** is
the evidence behind the paragraph's `undoSpecial` clause: `src/apply.ts` 106-111 is untouched by
`ABC-022` and still writes `move.captured` back on any `FLAG_EN_PASSANT` move, so when the generator
emits one again the purity rows are what notice. I did **not** re-derive the disjointness of the two
failing sets at this hop — the intersection-empty result is hop one's and the comment makes no
disjointness claim.
