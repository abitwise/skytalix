---
id: 20260818T184000Z-software-engineer-claim-every-criterion-and-the-evidence-that-answers-it-c05d31ea
kind: claim
by: software-engineer
at: 2026-08-18T18:40:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - EPIC-003
  - src/move-input.ts
  - src/move-input.test.ts
supersedes:
---

# `A1`–`A7`, each with the assertion that answers it — and the two places the evidence is weaker than the words

This is a `claim`, not a `finding`: no `finding` is admissible on this install
(`AGENTS.md` § "Role / workflow files"), so nothing here carries a gate stamp. QE's hop is where
this is checked by someone other than its author.

| criterion | verdict | evidence |
|---|---|---|
| `A1` both formats, one prompt, no mode switch | **met** | `e4`, `e2e4`, `E2E4`, `e2-e4` all return `move`, and moves 2–4 are `toBe` (reference) the same element of the one `legal` array as move 1; `toFen` unchanged and `moves` empty after all four |
| `A2` ambiguity lists candidates in SAN | **met** | `Nd2` on the two-knight FEN returns `ambiguous` with exactly 2 messages, sorted `["Nbd2","Nfd2"]`. **Separately**, in its own `it`, `toFen` byte-identical and `history.moves` length unchanged |
| `A3` the folded retry, both directions | **met** | row 1 `bxc4` → the bishop capture; row 2 `BXC4` → `ambiguous`, exactly 2, `["Bxc4","bxc4"]`; **row 3** `bxc4` in the pawn-only position → the pawn capture, with `parseCoordinateMove` and `parseSan` each called EXACTLY once and each with the string `"bxc4"` — no variant ever reached a resolver, so the fold demonstrably did not run |
| `A4` the candidate list fits the frame | **met, with a bounded claim — read below** | six ambiguities passed through `assembleFrame` with real panels: no `(+` marker in the 2-row region and every candidate present in full |
| `A5` one derive per prompt | **met** | seven lines (first-attempt move, last-exact move, folded move, folded castle, exact ambiguity, folded ambiguity, unresolvable) each assert the `legalMoves` spy at exactly **1** |
| `A6` rejection does not advance | **met** | five unresolvable lines return `rejected` with a single reason CODE, `toFen` byte-identical, `moves` empty, and the derive count still 1; plus `e2e5` → `no-such-move` rather than `unreadable` |
| `A7` no production change outside this module | **met, measured** | `git diff --numstat a83b933~1 a83b933` = `src/move-input.test.ts 374/0` and `src/move-input.ts 182/0`. Nothing else, under `src/` or anywhere |

## Where `A4`'s evidence stops, stated plainly

`A4` says *"any `ambiguous` outcome this ticket can produce"*. What was measured is **six** of them,
at the width the delivered panels set (21 columns, not asserted anywhere in the test):

- the two-knight `Nd2` (2 candidates);
- the folded `BXC4` (2);
- `e7e8` and `e7d8`, the four-way promotion and promotion-capture lists a coordinate produces (4
  each, the largest a coordinate can ever produce, and `e7d8`'s names carry `+` suffixes);
- an adversarial five-knight position (5 candidates, fully qualified `N1d2`/`Nb3d2` names);
- an adversarial six-queen position (6 candidates of 6 characters each, `Q1xd4#` and friends) —
  which fills the region to 20 and 19 of its 21 columns and still hides nothing.

**That is a worst case FOUND, not a proof over all legal positions.** A constructed position with
seven or more long candidate names would overflow two rows of 21, and I did not demonstrate that
such a position is unreachable — I searched for one and did not find one. The knight case is
genuinely capped: exactly six squares attack any given square by knight move. **No truncation and no
frame widening was implemented**, so if such an outcome is ever produced, the ticket's own rule
applies unchanged: a finding for `EPIC-002`'s frame owner and a new ticket.

## The mutation checks that show the tests bite

Three deliberate breakages, run and then reverted:

- **fold the case first** (capitalised variant attempted before the exact line): **6 tests red**,
  including `A3` row 3 — the row the brief names as the discriminator.
- **lowercase the exact attempt**: 5 red, including both halves of `A2`'s and `A3` row 2's
  ambiguity.
- **try every variant first and take the first match**: 2 red — `A3` row 2 and its `A4` row, i.e.
  the build that quietly picks one of two legal moves is caught by the candidate count.
