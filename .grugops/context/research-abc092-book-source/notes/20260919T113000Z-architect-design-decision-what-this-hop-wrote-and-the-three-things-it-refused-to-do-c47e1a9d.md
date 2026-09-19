---
id: 20260919T113000Z-architect-design-decision-what-this-hop-wrote-and-the-three-things-it-refused-to-do-c47e1a9d
kind: decision
by: architect-design
at: 2026-09-19T11:30:00Z
verified_by:
confidence: high
refs:
  - ABC-092
  - ADR-0023
  - RISK-004
  - NFR-006
  - memory-bank/50-decisions/ADR-0023-opening-book-source-is-lichess-chess-openings-under-cc0.md
  - plans/tickets/ABC-092-opening-book-source-and-licence-decided-before-a-byte-is-copied.md
  - plans/traceability.md
supersedes:
---

# WHAT THIS HOP WROTE, AND THE THREE THINGS IT DELIBERATELY DID NOT DO

Branch `grugops/research-abc092-book-source`, from `grugops/owner-rulings-2026-09-19` @ `2c96dbd`,
in an isolated worktree. Not merged, not deployed. Subtask claimed by a bare `mkdir` of
`.grugops/queue/claimed/research-abc092-book-source/` and moved to `done/` at the end.

## Written (markdown only)

1. `memory-bank/50-decisions/ADR-0023-opening-book-source-is-lichess-chess-openings-under-cc0.md`
   — **`status: proposed`**, one recommended source, six rejected candidates with their reasons
   (`A3` needs ≥ 2), the redistribution clause verbatim with its `git clone` sentence (`A2`), the
   attribution path `data/opening-book/ATTRIBUTION.md` and the explicit "none required" (`A4`),
   the `NFR-006` size figures (388,052 B raw / 3,704 rows / compiled `UNKNOWN - verify`), the ASVS
   `V15.1.1`/`V15.2.1` answer, and a blank ratification line.
2. Two sibling notes here: the candidate table (`observation`) and the recommendation (`claim`).
3. `plans/tickets/ABC-092-…md` — a dated "research done" section: what remains is one owner sentence.
4. `plans/traceability.md` — `ABC-092`'s row touched in place (`NFRs`, `Code`, `Status` cells,
   append-only) and one `_Updated:` header line.
5. Queue: subtask file `pending/` → `claimed/<task>/` → `done/<task>/`, with its `claim.md`.

## Refused, on purpose

- **Did not ratify.** `ADR-0023` is `proposed`. The owner's *"we can research that"* authorises
  research; `A1` wants his name as ratifier and `ADR-0012` § Status records that this particular
  choice is his. The one sentence that ratifies is written in the ADR and in the `claim` note.
- **Did not move `RISK-004`.** `plans/nfr-catalog.md` is untouched — `A5` moves the row on
  delivery, and delivery is the ratification. `NFR-006`'s row is also untouched: the size figures
  are *informed* (ticket § Security), and the compiled figure does not exist to verify.
- **Did not copy a byte.** `A6` checked from git: `git diff --name-only <base>` shows no file under
  `src/`, no `.tsv`, `.pgn`, `.bin`, `.epd`, and no attribution file — that file is written on
  ratification, not before. Row counts and sizes were read from the publishers' pages and the
  GitHub contents API; the TSVs themselves were never fetched into any path of this repository.

## Board

No board move — `plans/board.md` is the Orchestrator's and this subtask says so. The honest column
for `ABC-092` after this hop is still short of `Done`: the research half is finished, the
ratification half is a person's calendar (`ABC-092` § Dependencies).
