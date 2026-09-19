---
id: 20260919T103500Z-software-engineer-decision-three-criteria-read-and-how-a1-named-fen-a7-call-site-a8-placement-2f8b4d61
kind: decision
by: software-engineer
at: 2026-09-19T10:35:00Z
verified_by:
confidence: medium
refs:
  - ABC-034
  - ABC-034/A1
  - ABC-034/A7
  - ABC-034/A8
  - ABC-032
  - src/rejection.ts
  - src/move-input.ts
  - src/rejection.test.ts
supersedes:
---

# Three criteria needed a reading, and the readings are written down here rather than taken silently (coding rules 1, 2)

**This is not a stamp.** Hand-authored `decision`; confidence `medium` because each is an
interpretation QE and BA/PM may overrule — the code and tests are written so that overruling is a
small edit, and the alternative reading is named beside each.

## `A1` — the NAMED FEN is a check position, not a pin

`rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP1BP/RNBQK1NR w KQkq - 1 4`: the black queen on h4 attacks e1
along h4-g3-f2-e1 with f2 EMPTY (`PPPPP1BP`), so **white is in check** (`isInCheck` = true,
asserted in the test's fixture block) and the only legal move is `Kf1`. The ticket's own table makes
that `must-address-check` (= `own-king-exposed` AND `isInCheck`). So the file asserts:

- **the `A1` sentence** ("names the player's own king", reason in the king family) on a genuine
  absolute pin — `4r1k1/8/8/8/8/8/4N3/4K3 w - - 0 1`, rook e8 pinning knight e2 to king e1, NOT in
  check — reason `own-king-exposed`, four inputs (`Nc3`, `e2c3`, `Ng3`, `e2g1`);
- **the named FEN** as `must-address-check`, message containing `king`.

**Alternative reading:** `A1` literally wants `own-king-exposed` on the named FEN. That contradicts
the table's definition of `must-address-check` on the same page; the table wins because it is the
computation and `A1` is the sentence. If BA/PM rules the other way, the one-line fix is in the test.

## `A7` — "this ticket's module and test file(s) and nothing else under `src/`"

The ticket's `## Scope` says the messages *"travel as `PromptOutcome.rejected.messages` into the
frame's message region"* — which is only true if the dispatcher's rejected arm places them. That is
**one call site in `src/move-input.ts`**. Read strictly, `A7` forbids touching it; read with `## Scope`,
the module must be wired or the player still sees `no-such-move`. **The wiring is done** and the
whole `git diff --numstat 4f0ef01..6ee7cde -- src/` is:

```
24  11  src/move-input.test.ts
10  11  src/move-input.ts
345  0  src/rejection.test.ts
181  0  src/rejection.ts
```

`src/legal.ts`, `src/moves.ts`, `src/san.ts`, `src/coordinate-move.ts`, `src/frame.ts`,
`src/turn-loop.ts`, `src/command-input.ts`: untouched (not in the numstat). **The ticket's own
security firing threshold** — *"touches any file under `src/` other than its own module and test
file(s)"* — **fires on the letter of it** (`src/move-input.ts` is touched), so Security/NFR should
look; what they will find is that the sanitized sink is unchanged, no stream is written directly, and
no dependency is added. The `src/move-input.test.ts` change is the six rows that pinned the
placeholder codes IN `messages` — they now assert the classifier's code and that the dispatcher places
the classifier's rendering; no test was deleted, trimmed or moved.

**Alternative reading:** ship the module unwired and leave the call site to a follow-up. Rejected as
scope-hiding: a module nobody calls delivers none of the epic's value, and the follow-up would be a
one-line ticket.

## `A8` — `e8=K` and `O-O` are placed by the grammar's OWN verdicts, and they land on different codes

- `e8=K` on `8/4P3/8/8/8/4k3/8/4K3 w - - 0 1`: `parseSan` reads it (`K` is in the one table) and
  finds nothing → **`no-legal-move-named`**, sentence `no move e8=K here` (names `e8`).
- `O-O` on `4k3/8/8/8/8/8/8/K6R w - - 0 1`: no castle move exists to compare to, so `parseSan` says
  `unreadable` — `ABC-032`'s disclosed castle price → **`unreadable`**, sentence `type e2e4 or Nf3`.
- `e8=P` → `unreadable` (`P` is not in the table); `e8=Q` → `move`. Nothing collapses.
- The set stays at seven; no eighth code; both sentences carry a referent.

**The ticket leaned the other way** (*"by the floor's own words it belongs on the `unreadable` side …
see them together, place them together"*). Placing BOTH on one side needs this module to recognise
either a promotion letter (`e8=K` → `unreadable`) or a castle string (`O-O` → `no-legal-move-named`),
and either is a table `A8` forbids and the module header promises not to own. Deferring to the
readers' verdicts is the reading that introduces no grammar; it is the hop's decision as the ticket
delegated, and it is one `if` away from the other placement if BA/PM prefers it. The teaching cost
is named honestly: a player who types `O-O` when castling is not available is told the two formats
rather than *why* castling is unavailable — retrograde reasoning the ticket fences out anyway.
