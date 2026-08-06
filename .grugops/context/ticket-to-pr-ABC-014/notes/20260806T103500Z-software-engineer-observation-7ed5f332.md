---
id: 20260806T103500Z-software-engineer-observation-7ed5f332
kind: observation
by: software-engineer
at: 2026-08-06T10:35:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-014
  - ABC-014
  - ABC-018
  - EPIC-002
  - RISK-005
  - src/perft.test.ts
  - plans/traceability.md
  - coverage/
supersedes: 
---

# Handed forward and flagged, each with its reason — nothing here was absorbed or quietly fixed

## For QE/E2E (the `In Review` exit)

1. **The purity criterion has exactly one killer.** *"Renders byte-identically on a repeat and
   leaves the position untouched"* is the only test that kills the mutant which clears each square
   as it reads it. The 24 snapshots do not catch it — every render in the suite parses its own fresh
   position. This project's QE has twice ruled a single-assertion killer a suite gap.
2. **"a1 and h8 are dark" is now pinned by NAMING the character** (`:` at `a1`/`h8`, `.` at `a8`).
   That was forced by measurement — see the mutation note — but it does mean the test now encodes a
   character CHOICE, not only the colouring property. If a reviewer wants different shading
   characters, exactly three assertions and the two hand-written frames move with it.
3. **22 of the 24 snapshots were not hand-verified.** `kiwipete` and `position-3` were checked square
   by square against their FENs in both orientations. The rest are a regression net, not a
   correctness proof.
4. **Nothing imports `src/render.ts` yet**, so no test in this suite exercises it through a caller.
   `ABC-018` is the first, and the frame's composition into a 23-row terminal frame is where its
   constant geometry actually gets used.
5. **The `Position` is trusted, by the ticket's own `## Out of scope`.** A board byte outside `EMPTY`
   and the twelve real pieces — which nothing in merged `src/` can produce — has no glyph and would
   throw rather than draw a placeholder. That is deliberate (AGENTS.md rule 8), and it is named here
   so it is a decision on the record rather than an omission QE has to discover.

## For `ABC-018` (and for `RISK-005`)

6. **The Unicode figurines are East-Asian-Width AMBIGUOUS.** `U+2654`–`U+265F` render **double-width
   in some terminals** (and single-width in others, and it can depend on the font and on a
   `cjkwidth`-style setting). Every criterion in this ticket is written against **the frame as a
   value**, and as a value the geometry is provably constant — 9 rows of 18 code points, in both
   modes, asserted over all 24 matrix cells. **The string width and the terminal COLUMN width are
   not the same thing**, and a frame that measures 18 characters can occupy 18 or 26 columns
   depending on the terminal.

   This is invisible here and lands on `ABC-018`, where the frame meets a real terminal and where
   `4b`'s erase-to-end-of-screen and the composed row budget start depending on what the terminal
   actually did. It also belongs on `RISK-005`'s ledger — it is a **terminal portability** fact about
   the figurines that the risk's existing wording (glyph availability, tofu) does not cover.
   Recorded, not fixed: no criterion in this ticket can see it, and inventing a width heuristic here
   would be exactly the unrequested flexibility AGENTS.md rule 7 forbids.

## Corrections of record — small, and this project writes these down

7. **The standing perft FEN table holds SIX positions, not seven.** The Orchestrator's pull note and
   the `ABC-014` traceability row both say seven. `src/perft.test.ts` contains **nine** FEN string
   literals: the 6-row `PERFT_SUITE` table, two duplicates of table entries hoisted into
   `KIWIPETE` / `START_FEN` consts, and one ad-hoc promotion position
   (`7k/4P3/8/8/8/8/8/4K3 w - - 0 1`) used inside a `perftDivide` test, which is not a row of the
   table. **All six real ones are transcribed into `src/render.test.ts` and machine-compared to the
   originals character by character.** Nothing about the acceptance criterion changes — it is
   executable exactly as written, over six positions.
8. **`coverage/` is a stale tracked artifact.** It was last written at `ABC-007` (`76ca714`) and
   neither `ABC-011` nor `ABC-012` maintained it; it is not in `.gitignore`. A `--coverage` run
   during this subtask dirtied it and it was **restored with `git checkout -- coverage/`**, with the
   one file the run created deleted. Flagged, not deleted (AGENTS.md rule 12) — it is unrelated to
   this ticket and removing a tracked directory is not this role's call.

## Not fixed on purpose, because it is someone else's file

9. **`plans/nfr-catalog.md`'s `NFR-002` row is owed the measured compute half.** The figure and its
   machine are in the `claim` note beside this one. That file's rows are Architect/Design's and
   Security/NFR's — the same division `ABC-011` and `ABC-012` kept.
10. **The `ABC-014` ticket file's frontmatter still reads `status: in-development` /
    `column: In Development`.** Ticket frontmatter is board state and the Orchestrator moves it;
    this role moved `plans/board.md`, which is the state of record. This is the same class as the
    `ABC-012` frontmatter drift the Orchestrator already flagged in this task's context — recorded
    so the next reader does not have to re-derive which document is right. It is the board.
