---
id: 20260809T213845Z-software-engineer-observation-e8c31f31
kind: observation
by: software-engineer
at: 2026-08-09T21:38:45Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - ADR-0005
  - src/legal.ts
  - src/legal.test.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# Every sentence I wrote into a comment was re-measured here first — three trees, and BA/PM's guard-(a) mutant reproduced byte-for-byte

A comment that carries a fact is a fact this role is responsible for. The claims in the four
corrected paragraphs were therefore measured on this hop rather than transcribed, on the board's
standing protocol: one full tree copy per state, **one OS process per tree**, `tsc --noEmit`
**exit 0 on all three before any result was believed**, every FEN printed and re-parsed before a
verdict.

| tree | `src/moves.ts` md5 | `src/legal.ts` md5 | what it is |
| --- | --- | --- | --- |
| `t-pristine` | `0e247853ab2c05887c76105ff83d8621` | `9dd59894b42da2d4f5ad1fb1426010b4` | `git archive main src` |
| `t-fix` | `6335b452fc21ffe2d0f902ecab930840` | `aa645c6964ed902489425150e3879fd8` | `git archive HEAD src`, verified identical to the working tree |
| `t-fix-noA` | `6335b452…` | `450cd8cd839a0d3514395512c743e05c` | guard (a) deleted from the fixed tree |

**`t-fix-noA`'s `legal.ts` md5 is `450cd8cd839a0d3514395512c743e05c`, which is BA/PM's own mutant
hash for the same state.** That is byte-level corroboration of their construction, not merely a
same-shape rebuild — the thing my first hop could NOT claim about their restructure mutant.

## The four rows sites 5 and 6 are written about

`EP_CONTRADICTED_BY_THE_WRONG_PIECE`, oracle = `legalMoves(p).some(m => m.flags === FLAG_EN_PASSANT)`:

```
row                                   main                         branch tip
enemy KNIGHT on the capture square    genEp=1 oracle=true          genEp=0 oracle=false
enemy ROOK on the capture square      genEp=1 oracle=true          genEp=0 oracle=false
mover's OWN knight on the ep target   genEp=1 oracle=true          genEp=0 oracle=false
the same, mirrored                    genEp=1 oracle=true          genEp=0 oracle=false
```

`true/true/true/true` → `false/false/false/false`, which is exactly what BA/PM reported and is what
makes site 6's *"The oracle answers `true` on all four"* false. `hasLegalEnPassant` answers `false`
on all four on **both** trees, so the predicate never moved.

## The inversion, in the direction the comment now states

On `t-fix-noA` the same four rows read `hasLEP=true` against `oracle=false` on the two own-piece
rows, and the two enemy-knight-on-target rows of `CONTRADICTORY_EP` flip the same way. So on the
FIXED generator, **deleting guard (a) creates disagreement where there was none** — the agreement is
bought by guard (a), not inherited from the fix. That is the trap `A11` names and it is the sentence
the corrected paragraph closes on.

**The 447-of-100,801 figure is NOT mine.** I did not re-run the 131,072-state exhaustion; I measured
the direction on the named rows, which is what the comment asserts. The exact count stays BA/PM's and
is carried as such.

## The fenced-TRUE sentences, re-measured rather than trusted

- **`src/legal.test.ts` 289-292** — *"`generateMoves` reads an occupied ep target as an ordinary
  capture and never offers the ep move"*, about the two **ENEMY**-occupant rows: `genEp=0` on `main`
  **and** on the tip. Unchanged by the fix, so still true. This is the sentence one word away from
  site 4 that an engineer sweeping for "false comments about the generator" would break.
- **`src/legal.ts` 113-114** — *"Purity does NOT need it"*: on `t-fix-noA`, `hasLegalEnPassant` is
  pure on every row probed. Consistent with BA/PM's 100,801-state result at the scale I measured.
- The two in-domain controls are unmoved on all three trees: the real ep pair gives `genEp=1`,
  `oracle=true`, `hasLEP=true`; the pinned-capturer control gives `genEp=1`, `oracle=false`,
  `hasLEP=false`. The fix does not over-reject and neither does anything at this hop.
