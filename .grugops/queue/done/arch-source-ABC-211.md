---
subtask: arch-source-ABC-211
role: architect-design
ticket: plans/tickets/ABC-211-the-opening-book-goes-deeper-in-the-english-lines.md
ref: .grugops/context/arch-source-ABC-211/
branch: new grugops/arch-source-ABC-211 from main, worktree ../wt-arch-source-ABC-211
width: 2 of 2 (beside bapm-ready-ABC-208; records only — no npm, vitest or timing)
---

# ABC-211: opening-book source ruling (ADR-0023)

## Do
- Make the page's source ruling: can the deeper English lines come from the current ADR-0023 source (`lichess-org/chess-openings` at the pinned commit, CC0) or by its documented rule? If yes, rule it inside ADR-0023 (no ADR change) and state what the compile would take.
- If a new or changed source is needed, do NOT decide it. Write the ADR-0023 change as PROPOSED, with options and licences, for the owner (ABC-092 rule: the licence is decided before a byte is copied). Copy no third-party bytes.
- Give the page's Ready trigger status and the board card line in your Result; don't edit the board.

## Fences
- Only your worktree and `<scratchpad>/arch211/`. No `src/` or `data/` edits. Network reads only for licence/source facts (no downloads into the repo). Do NOT run npm/vitest/timing. Never push, force, amend or rebase; never merge into main. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task arch-source-ABC-211). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result (architect-design, 2026-10-26T01:13Z): **source ruled NOT possible inside ADR-0023. An ADR-0023 amendment is PROPOSED to the owner with options O0–O3, recommending O0 (no new source; the ticket closes). Ready trigger NOT MET.**

Records only. Branch `grugops/arch-source-ABC-211` in `../wt-arch-source-ABC-211`, cut from `main` `1df54ba6`. One
commit, **`1f59cbb8`**, not merged and not pushed. No npm, vitest or timing. No `src/` or `data/` edit. 0 third-party
bytes in the repo. Scratch: `<scratchpad>/arch211/` (the fetched sources, 4 probes, the seal script).

Notes are in `.grugops/context/arch-source-ABC-211/notes/`. They were sealed with grugops 2.1.0 `context-io.js`
`admitAndAppend` (context root: the worktree's `.grugops/context`). `readContext` read back 2 of 2, and `index.*` was
rendered:
- `20261026T011145Z-architect-design-decision-7bb8daf1`: the ruling and the options;
- `20261026T011145Z-architect-design-observation-a1ddd6fb`: the read-backs and measurements.

| item | ruling |
|---|---|
| inside ADR-0023? | **No.** 0 of the pinned source's 3,865 rows reach the game-1 position (after 3...b6) at any ply, with transpositions included and no 12-ply cut. Upstream `master` is the pin `a6189a30`, with all 5 sha256 values equal, so the re-pin rule adds nothing. compile(pin) is byte-identical to `book.json` (356,526 B) |
| ADR-0023 | **PROPOSED amendment appended** (§ "Proposed amendment 2026-10-26 (`ABC-211`)"), plus a one-line pointer in § Status. Decisions 1–5 are unchanged. Default without an answer: nothing changes. His answer is one option id |
| O0 (recommended) | No new source. BA/PM closes `ABC-211` undelivered, with the veto open. Why: `QE-207-f` found base already plays 4.d3 (d8 +56) here, not 4.Qa4; the ticket is `P3`; every source option also needs an `ADR-0037` change and a scope change |
| O1 | `official-stockfish/books` `8moves_v3.pgn` @ `a804a97e`, **CC0-1.0**, 1.c4 lines only, graft weights. **`A1` met** (e4 11, e3 3, d4 1, g3 1). **715,259 B** (68.2 % of `NFR-006`). `NFR-007`'s 2x re-read fires (2.006x). Needs an `ADR-0037` D1 change (`source` becomes a list of two, `format` stays 1), a PGN reader (S → M), a second sha pin and attribution section, and new `A3` wording. Without the graft rule, 1.c4 goes from 5.2 % to 54.5 % of the root weight |
| O2 / O3 | Offline lines from our own engine (Apache-2.0; adds nothing here) or from Stockfish 19 (GPL-3.0; FSF FAQ: output "not, in general, covered"; the legal reading is `UNKNOWN - verify`, the owner's; the rebuild rests on a host binary). Each would be its own ADR. Not recommended |
| not proposed | Lichess DB (CC0; `R1` fitness stands). `bjbraams_chessdb` lines (provenance). EPD sets (a position, no move) |
| Ready trigger | **NOT MET.** The Architect's half has landed, and the source pick is the owner's. O0: BA/PM closes. O1: the Architect writes the `ADR-0037` D1 amendment, then BA/PM re-scores the DoR, then Ready. O2/O3: a new ADR first |

Files on the branch:
- `memory-bank/50-decisions/ADR-0023-…` (+80);
- `plans/tickets/ABC-211-…` (+13, a dated § Source ruling);
- 2 notes, plus the 2 index renders.

Not touched: `src/`, `data/`, `tools/`, `plans/board.md`, `plans/traceability.md`, `plans/nfr-catalog.md` (no bound
moves at PROPOSED), `ADR-0037`, the config. In main's checkout, only this queue record and its claim moved,
uncommitted, for the Orchestrator.

### Board card line (for the Orchestrator; ABC-211 stays in Backlog; no column moves)

- **ABC-211**, appended to its card: `2026-10-26 (arch-source-ABC-211, …7bb8daf1): source ruled NOT inside ADR-0023 (0 of 3,865 pinned rows reach 3...b6 at any ply; upstream master = pin). ADR-0023 amendment PROPOSED → owner: O0 no new source + close (recommended; QE-207-f: base already plays 4.d3 here) | O1 official-stockfish/books 8moves_v3.pgn CC0, 1.c4 lines, graft weights (A1 met, 715,259 B; needs ADR-0037 D1 provenance change + scope change S→M; NFR-007 re-read fires) | O2/O3 engine-generated (not recommended). Ready trigger NOT MET — waits on the owner's pick. Held in Backlog.`

### Trace row (10 cells, the order of the existing rows)

| ABC-211 (arch-source-ABC-211) | Source ruling: NOT possible inside ADR-0023 (0/3,865 pinned rows reach 3...b6 at any ply; master = pin a6189a30; compile(pin) = book.json); ADR-0023 amendment PROPOSED → owner, O0 no new source + close (recommended) / O1 official-stockfish/books 8moves_v3.pgn @ a804a97e CC0, 1.c4 lines, graft weights / O2, O3 engine-generated (not recommended) | EPIC-008 | no design built; O1 would need an ADR-0037 D1 provenance change (source → list of two, format stays 1; src/book.ts:96 unaffected) + a PGN reader in compile.ts | NFR-006: O1 715,259 B ≤ 1,048,576 (all lines 2,527,629 B fails); NFR-007: O1 2.006x → re-read fires; no bound moved; notes …7bb8daf1, …a1ddd6fb | grugops/arch-source-ABC-211 @ 1f59cbb8 (records only) | — (records only; scratch probes, no lane run) | — (UAT owed at delivery if a source ships; QE signs) | Owner: pick O0–O3 on the PROPOSED ADR-0023 amendment; Orchestrator: report it, board card, trace; BA/PM: close on O0, or DoR re-score on O1 (after the Architect's ADR-0037 amendment) | Backlog (held), 2026-10-26 |
