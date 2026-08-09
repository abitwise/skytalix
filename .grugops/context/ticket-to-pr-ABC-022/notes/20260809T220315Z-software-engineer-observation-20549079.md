---
id: 20260809T220315Z-software-engineer-observation-20549079
kind: observation
by: software-engineer
at: 2026-08-09T22:03:15Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - ABC-009
  - src/moves.castling.test.ts
  - src/legal.test.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# A SIXTH site of the same shape, in `src/moves.castling.test.ts` — measured false, out of `A11`'s remit, and NOT edited

To answer *is `A11` discharged?* honestly I had to sweep `A11`'s whole remit, not only my own file.
`git grep` over every comment line under `src/` on the premise's vocabulary (`unsound`, `offers`,
`own piece`, `mover's own`, `corrupt`, `phantom`, `never check`, `enforced by nothing`, `provably`)
with each hit read rather than counted. One thing came back, and it is not `ABC-022`'s.

## What it says, and what is measured

`src/moves.castling.test.ts` — `ABC-009`'s red-before-green header, same author, same pattern:

- **7-10** — *"With a right asserted on a board that contradicts it, `generateMoves` **offers** a
  `FLAG_CASTLE` move the rules forbid, and `legalMoves` … **writes** a king onto a square that never
  held one."*
- **98-99** — *"**Today** one `legalMoves` call **DESTROYS** the occupant and writes a king of the
  moving side over it — silent material loss plus a piece-type change."*

Measured on the delivered tree, FENs printed and re-parsed, taken from that file's own families 1
and 2:

```
castles_offered=0  legalMoves_pure=true   4k3/8/8/8/8/8/8/K6R w K - 0 1     (king off its home square)
castles_offered=0  legalMoves_pure=true   4k3/8/8/8/8/8/8/K3B2R w K - 0 1   (own bishop on e1)
castles_offered=0  legalMoves_pure=true   4k3/8/8/8/8/8/8/K3b2R w K - 0 1   (ENEMY bishop on e1)
```

Both sentences are false. The file's own 58 green assertions say the same thing from the other side.

## Why it was flagged and not fixed

**Out of `A11`'s remit by construction.** `A11` covers what *this* fix falsified about
`generateMoves`'s **en-passant** branch. This is the **castling** branch, and `ABC-009`'s fix
falsified it — that ticket merged in `e644039`. It is the identical situation BA/PM already ruled on
for `src/legal.test.ts` 202: *"false, but NOT falsified by this fix … recorded so the next sweep does
not re-find it and mis-attribute it."*

**And out of this hop's boundary**, which is one named file. Unlike the two sites I did fix, this one
is neither in the criterion nor in the permitted surface — so the discipline that produced the
escalation two hops ago applies here and I stopped.

## The pattern is worth more than the two sentences

Three instances now, all the same mechanism: **a red-before-green test header written in the present
tense, describing a defect, and never re-tensed when the fix went green.** `ABC-022` created one
(site 7, fixed here), `ABC-009` created two (above, open), and the same author-hop wrote
`src/moves.ts` 183-195 in the **past** tense correctly, which shows the standard exists and is simply
not applied at the moment of going green.

That is a process observation, not a ticket. `mode` is `lean` so the Factory Coach is not live; it is
recorded here and on the ticket for the retro rather than routed. If someone does want it as work, it
is comment-only, measurable, and cheap — but it is not `ABC-022`'s, and I did not enqueue anyone.
