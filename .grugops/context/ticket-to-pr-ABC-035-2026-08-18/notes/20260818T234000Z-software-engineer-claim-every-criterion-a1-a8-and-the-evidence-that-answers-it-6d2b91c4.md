---
id: 20260818T234000Z-software-engineer-claim-every-criterion-a1-a8-and-the-evidence-that-answers-it-6d2b91c4
kind: claim
by: software-engineer
at: 2026-08-18T23:40:00Z
verified_by:
confidence: high
refs:
  - ABC-035
  - ABC-033
  - ABC-021
  - NFR-002
  - N8-LANE
  - src/command-input.ts
  - src/command-input.test.ts
supersedes:
---

# `A1`-`A8`, each with the evidence that answers it and the mutant that would break it

A **claim**, not a finding: no `finding` is admissible on this install and QE's hop is still owed
(`AGENTS.md` § QE validation authority — every ticket, no exception). Read this as the engineer's
own reading of his own tests.

| id | verdict | evidence | mutant that reds it |
|---|---|---|---|
| `A1` | **met** | 13 spellings (`help` / `HELP` / `  help  ` / `Help`, `board` / `BOARD` / `\tboard\n`, `quit` / `QUIT` / ` Quit `, `claim` / `CLAIM` / `  Claim  `) each classified to the arm the TABLE names, with `toFen` byte-identical and `history.moves` empty after each. **12 non-tokens** (`hel`, `helpme`, `h`, `boards`, `b4`, `he lp`, `help now`, `--help`, `quitt`, `claims`, `cl`, `""`) each fall through to the resolvers, asserted by the resolver spy seeing the line. `b4` gets its own row: it resolves to **the pawn move `b4`** and never to `board` | M1, M2, M3, M12 |
| `A2` | **met** | for each of the 13 spellings, `parseCoordinateMove` **0**, `parseSan` **0**, `legalMoves` **0**. Plus a **control** — the same three spies read **1 / 1 / 1** for `e1d1`, which is what stops the zeros being the zeros of a seam nothing reaches (`ABC-033` `G3`'s failure shape). Plus the other direction: each of the four tokens is `rejected` by **both real readers** in three positions, so classifying first steals no move | M7 (13 red) |
| `A3` | **met** | the **merged loop** driven for real with this module as the `InputSeam`: three `board` submissions produce **4** render-seam calls (`1 + one per non-advancing outcome`), and every frame's `messages` is `[]`. `help` puts its items on exactly **one** frame and the next frame is clean. `toFen` unmoved, `history.moves` empty | M11 (3 red), M13 (1 red after repair) |
| `A4` | **met** | `help`'s items are folded out of `COMMAND_TABLE`; the guard iterates **the table** and requires each token present, requires `helpMessages()` to have exactly `COMMAND_TABLE.length + 1` items, and requires the four foreign tokens `moves` / `undo` / `resign` / `new` (`ABC-036`'s and `EPIC-006`'s) to be **absent** — both directions | M5 (missing token), M6 (foreign token), M12 |
| `A5` | **met** | the **pair**. `claim` on `SHUFFLE_FEN` (nothing claimable) and on the same position at its **third occurrence** returns values that are `toEqual` to each other and to `{ kind: "claim" }`, with `Object.keys` exactly `["kind"]` — no message, no article. Driven through the merged loop, the claimable one **terminates `{ draw, threefold-repetition }` via transition 16**, and the refused one puts exactly **2** items on the frame, both matching `claimShortfall`'s shape (`repetition N of M` / `50-move N of M`) — **zero items from this module** | M4 (3 red), M10 (9 red) |
| `A6` | **met** | `gameStatusOf` **0** and `repetitionCounts` **0** for every one of the 13 spellings, measured through a **hoisted `vi.mock` of `./history.ts`** — not a `vi.spyOn` over an imported binding — so a direct import inside this module is still visible. A **control** row calls both functions directly and reads **1 / 1**. And the ply total: four prompt cycles (`help`, `board`, `quit`, `claim`) through the merged loop make **exactly 1** `gameStatusOf` — the loop's own, before the first frame — and **0** `repetitionCounts` | M9 (14 red), M10 (9 red) |
| `A7` | **met** | `help`'s items through `assembleFrame` at the **delivered** panel width: region is `MESSAGE_ROWS` (2) rows, contains no `(+` marker (**hidden count exactly 0**), and every item appears in full. Asserted at **two** widths, and the harder one is named: the **start position is the narrowest frame this project draws** (`W` = 21, measured) — empty history pane, no claim cell. `A7`'s instruction was obeyed rather than the frame widened: `help` is 5 short items, not 4 sentences, because one sentence per command does not fit 2 × 21 columns | — |
| `A8` | **met, measured from git** | `git diff --numstat main..HEAD -- src/` → `539 0 src/command-input.test.ts` and `142 0 src/command-input.ts`, **nothing else under `src/`**. `src/move-input.ts` byte-untouched. Suite green, skip **0**, `PERFT_DEEP=1` **32/32** — figures in the gate note | — |

## `NFR-002` and `N8-LANE`, honestly

- **`NFR-002` (≤ 100 µs per ply)** is carried by `A6`'s counts, which are the form the ticket itself
  chose: **zero** additional derives, and the ply total unchanged at the loop's one. The 46-50 µs
  price of the wrong build is `ABC-021`'s measurement, quoted, **not re-measured here**.
- **`N8-LANE` (≤ 650 ms CPU) was NOT measured to its own method.** The paired-delta protocol
  (n ≥ 7 interleaved rounds, identity null control ≤ 1.5%) was not run. What exists is the runner's
  own per-file figure — **`src/command-input.test.ts`: 79 tests, 56 ms** — and one added test file
  against the page's allotment of one. That is a consistency check, not an `N8-LANE` measurement, and
  it must not be quoted as one. Same posture `ABC-033` took and said so.
