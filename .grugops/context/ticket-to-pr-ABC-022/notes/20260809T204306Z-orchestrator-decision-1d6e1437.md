---
id: 20260809T204306Z-orchestrator-decision-1d6e1437
kind: decision
by: orchestrator
at: 2026-08-09T20:43:06Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - ABC-011
  - ADR-0005
  - NFR-001
  - src/moves.ts
  - src/legal.ts
  - src/moves.enpassant.test.ts
supersedes: 
---

# `In Review` gate: implementation **holds**, but `ABC-022` does **not** advance to QE yet — `A11` is narrower than the harm this fix created

No board move. `ABC-022` stays in `In Review` (1/3). One BA/PM hop is enqueued before QE.

## What I verified on my own instruments

Re-run on the branch tip, not read off the hand-back:

```
lint 0 · typecheck 0 · build 0 · 439 passed (439) on 17 files · skip count 0
PERFT_DEEP=1  32/32 exact, 36.50 s      (engineer reported 36.55 s — reproduced)
```

**`A9`'s line-level claim holds mechanically**, which is the form `A9` demands:
`git diff --name-only --diff-filter=M main -- 'src/*.test.ts'` is **empty** — no existing test file
modified — and `--diff-filter=A` returns exactly one addition, `src/moves.enpassant.test.ts`. The
whole `src/` diff is three files: `moves.ts` (+24 −12), `legal.ts` **comment-only** (verified by
reading the diff — every changed line begins with `//`), and the new test file.

**The fix is two conditions and one local const**, guarded after the `epSquare` test:
`if (target === EMPTY && position.board[to - forward] === capturedPawn)`. `to - forward` is the same
square `apply.ts`'s `enPassantCaptureSquare` derives, so generator and applier cannot disagree about
which pawn is captured — a structural choice, not a coincidence, and the right one.

**`A11`'s 102-103 edit is correct and it did the hard part:** it corrects the false *mechanism* while
leaving the separate true sentence at 104-105 intact, which is exactly the trap the criterion was
rewritten to name.

**Not re-derived by me**, carried as the engineer's: the 31-red baseline, the disjoint load-bearing
split (8 vs 23, empty intersection), the 512-state `A5` re-verification, and the throughput figures
(6,393,713 nodes/sec, aggregate ratio 0.9926 against a `cmp`-verified twin at 0.9883/0.9956). Those
are QE's to re-derive, and duplicating them here would spend a hop for nothing.

## Why it does not advance

The engineer flagged, rather than fixed, a statement its own change falsified —
**`src/legal.ts:69-71`**:

> *"Outside it the oracle is unsound — `generateMoves` offers en-passant captures onto squares
> occupied by the mover's OWN piece — so the answer there is SPECIFIED rather than derived: `false`"*

**That em-dash clause is false as of this fix.** I confirmed it by reading the source: the generator
no longer offers that move on any position.

**Not widening the diff was the correct call** and I am recording it as correct so it is not
second-guessed at review: it sits outside `A11`'s cited 102-103 and outside the boundary I wrote, and
AGENTS.md rules 9 and 12 say flag rather than silently broaden.

**But `A11` as written is SATISFIED by what shipped, while the harm is live** — so this ticket could
pass every criterion and leave a false comment, in the same file, of the same class the criterion
exists for. That is **this ticket's own recurring defect shape for the fifth time**: a criterion
narrower than the harm. Advancing to QE now would mean QE verifies `A11` green against a file
containing the falsehood `A11` was cut to remove.

## The route, and why BA/PM rather than the engineer

`## Acceptance` is BA/PM's alone on this board — the standing rule that the role writing a criterion
is not the role that declares it satisfied. Widening the boundary without amending `A11` would leave
the new edit **covered by no criterion at all**, which is the "green signal read as protection" failure
this board has now paid for repeatedly.

The hop is also **not** scoped to the one line the engineer found. Every count on this ticket has been
a floor, never a ceiling — pre-check 2, BA/PM 7, and now an 8th from the engineer. A repo-wide sweep
for other statements this fix falsified is the actual job; `A11`'s amendment is its output.

There is a second question only BA/PM can settle, and it is not cosmetic: with the generator fixed,
`legalMoves(...).some(ep)` now returns `false` on exactly the out-of-domain positions where
`hasLegalEnPassant`'s specified answer is `false`, so **the stated reason the oracle is "SPECIFIED
rather than derived" may have partly evaporated**. The guards themselves unambiguously stay —
`ABC-022`'s own `## THE CORRECTION THIS TICKET CARRIES` proves guard (a) is load-bearing for both
classes because `hasLegalEnPassant` synthesises its own probe and never consults `generateMoves`, and
`ADR-0005` is not reopened by a comment. **What is in question is the justification text, not one line
of behaviour, and nothing executable may change.**

## Standing items, unchanged

`src/moves.ts` is now md5 `6335b452fc21ffe2d0f902ecab930840`, so **`ABC-023`'s `A4` pin is now
stale** — expected, deferred by design to `ABC-023`'s promotion hop, not re-pinned here.
`tools/grugops/test-skip-integrity.js` requires a registry file that this project has never created;
that is pre-existing, `quality.test_integrity` is `warn`, and the gate's actual test-integrity step —
the AGENTS.md skip-count command — reads **0**. Not `ABC-022`'s to fix and not counted against it.
