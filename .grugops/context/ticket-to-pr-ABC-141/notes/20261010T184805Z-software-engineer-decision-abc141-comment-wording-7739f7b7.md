---
id: 20261010T184805Z-software-engineer-decision-abc141-comment-wording-7739f7b7
kind: decision
by: software-engineer
at: 2026-10-10T18:48:05Z
verified_by:
confidence: high
refs:
  - ABC-141
  - ABC-010
  - ABC-017
  - QE-010-b
  - QE-010-c
  - src/move-input.ts
  - src/move-input.test.ts
  - src/history-pane.ts
supersedes:
---

# `ABC-141`: how the three stale comment spans were rewritten

This note is hand-authored and unsealed (AGENTS.md: no sanctioned writer on this install).
Branch `grugops/ABC-141-stale-comments` from `957a85c3`; code `f92868f6`.

1. **`src/move-input.ts`** ("WHAT `A5` DOES NOT SAY"): "six queens on `d4` cost six of those, measured
   by QE" became "one for the prompt plus one per checking candidate, so six queens on `d4` (six
   candidates, all `#`) cost seven: 1 + 6, measured at `ABC-141`". The count carries its derivation,
   as the ticket asks, so a fixture re-author sees the number move.
2. **`src/move-input.test.ts`** (`RENDERED` docblock): the same count and derivation, worded "measured
   seven: 1 + 6, at `ABC-141`". The two sites agree. No assertion was added: "the guard is the
   ARGUMENT, not the count" stands.
3. **`src/history-pane.ts`** ("ACCEPTED LIMITATION"): "`parseFen` imposes no upper bound and `ABC-010`
   is the ticket that would" became "`parseFen` imposes no upper bound (it accepts fullmove 10000),
   and no ticket delivers one: the bound is for the first ticket that lets a human or a file supply a
   FEN to decide". No ticket is named as the deliverer. The span is the module docblock and lies outside
   the only `history-pane.ts` text pin (`src/history-pane.nfr.test.ts:386`, the `import type
   { GameHistory }` line) and outside every `it` body.

`plans/tickets/ABC-017-…md`'s historical sentence is untouched (out of scope).
