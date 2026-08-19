---
id: 20260820T191000Z-uat-planner-observation-abc033-conducted-nine-scenarios-on-the-real-build-3f9d21b7
kind: observation
by: uat-planner
at: 2026-08-20T19:10:00Z
verified_by: 
confidence: high
refs:
  - ABC-033
  - plans/tickets/ABC-033-one-prompt-both-formats-and-the-ambiguity-outcome.md
  - src/move-input.ts
  - src/coordinate-move.ts
  - ABC-107
supersedes: 
---

# `ABC-033` conducted — nine scenarios against `node src/cli.ts` at `2605163`

**This is a conducted result, not an acceptance.** See the sibling `decision` note.

**9 scenarios run, 9 pass, 0 fail. 2 acceptance criteria NOT EXERCISED** and named as such below
rather than counted green.

## 33-1 to 33-4 — four ways of writing the same move, four fresh games

Typed `e4`, then in three further fresh sessions `e2e4`, `E2E4`, `e2-e4`. **All four produced the
identical outcome**, and the identity is visible on the screen rather than inferred:

```
$ printf 'e4\n' | node src/cli.ts        # and e2e4, E2E4, e2-e4 in three further runs
...
Black to move  1...
last: e4  material: 0
   1. e4
```

Each run: exit `0`, 3 boards drawn (start, after the human move, after the reply), 2 prompts,
~3.1 s elapsed (the opponent's budget). Nothing was declared and nothing was switched.
**PASS — `A1`'s business half.**

## 33-5 — three different notations inside ONE session

```
$ printf 'e4\ng1f3\nF1C4\n' | node src/cli.ts
...
   1. e4      Nc6
   2. Nf3     d5
   3. Bc4     dxc4
```
exit `0`, 9.1 s, 7 boards, 4 prompts. SAN, then lower-case coordinate, then UPPER-case
coordinate, accepted in one game with no mode remembered between them. **PASS — this is the
scenario that fails if a mode is remembered, and it is the one the criterion is really about.**

## 33-6 / 33-7 — the ambiguity, and the refusal to guess

Reaching a genuine ambiguity took two setup moves and is worth recording because the obvious
attempt does not work: after `Nf3` alone, `Nd2` is **not** ambiguous — `d2` is still occupied by
white's own pawn and the product correctly answers `no-such-move`. The line that reaches it is
`Nf3`, `d4`, `Nd2`.

```
$ printf 'Nf3\nd4\nNd2\nNbd2\n' | node src/cli.ts
...
White to move  3.
last: Qf6  material: 0
   1. Nf3     e6
   2. d4      Qf6
Nbd2 Nfd2                 <-- the message region, after `Nd2`
```

**Both halves of `A2` hold, and they were read separately:**
- **exactly 2 candidates, in SAN** — `Nbd2 Nfd2`;
- **nothing was applied** — the header still reads `White to move  3.`, `last:` still reads the
  opponent's `Qf6`, and the move list still ends at `2. d4 Qf6`. The product listed and then did
  **not** play one.

Typing `Nbd2` next moved the knight and the game continued (`3. Nbd2 Nc6`). exit `0`, 8 boards,
5 prompts. **PASS.**

## 33-8 — lower-case castling, which is the case-folded retry a player actually meets

```
$ printf 'Nf3\ne3\nBe2\no-o\n' | node src/cli.ts
...
   4. O-O     Nc6
```
The player typed `o-o`; the product played the castle and wrote it as `O-O`. exit `0`, 9 boards.
**PASS — the ticket names `o-o` as its own fold case and it works end to end.**

## 33-9 — text that is not a move, including a pasted escape sequence

```
$ printf 'e\033[31m4\n' | node src/cli.ts
White to move  1.
White to move  1.
unreadable
```
exit `0`, 2 boards, board and move number unchanged, and — checked byte by byte —
**zero ESC bytes reached stdout**. A player cannot paint the terminal by typing at the prompt.
Plain nonsense (`zzz`, `hel`, `boards`) behaves the same. **PASS — `A6`, and the sanitization
claim on the ticket's security section, observed rather than assumed.**

## NOT EXERCISED — named, not assumed

- **`A3`'s `bxc4` / `BXC4` pair.** The three rows need a position where a pawn capture and a
  bishop capture to `c4` are both legal, and the product accepts **no starting position**, so it
  cannot be constructed from the prompt. The behaviour it proves (fold is a RETRY, not the first
  attempt) is **indirectly supported** by 33-8 and 33-9 but is **not** demonstrated at the
  product surface. Not counted as passing.
- **`A4`.** Already **FALSIFIED and re-scoped on the ticket page itself** (7 knights overflow the
  message region; successor `ABC-107`). Reaching seven knights of one colour requires promotions
  no bounded UAT script can force. Not exercised, not re-cut, and correctly NOT marked met.
- **`A5` (exactly one `legalMoves` derive per prompt) and `A7` (no production change outside the
  module)** are call-count and diff properties. They are not observable from the prompt and are
  QE's instrument, not a business scenario. Out of this pack by nature, not skipped.
