# qe-ABC-292-freeze gaps: seven reading notes for the probe (PR3), se-ABC-292 and QE's stage 0 (INFO). None blocks step 4, and no definition was found to read two ways

QE/E2E, task `qe-ABC-292-freeze`, at `main` `0885de71` (`src/` tree `bba42fb7`). This note goes with the freeze `20261108T090744Z-qe-e2e-decision-277b648a`, which holds the rows in `raw/fixtures.json` and `raw/pre-ticket.json`.

- **`QE-292-a` (INFO, the seam's shape).** QE grades `pieceTermsForTest` **per side and per part**, as `{ BISHOP_PAIR, ROOK_OPEN_FILE, ROOK_SEMI_OPEN_FILE }`, each `{ mg, eg }` in centipawns at the shipped table (d5: "each side's three parts, mg and eg, per side and never netted").
  - If the build returns counts beside the parts, QE grades the parts.
  - If it returns a net, K1 (c) is not met as d5 words it. P5, RX2 and FB1 read 0 net, and so cannot tell the difference.
- **`QE-292-b` (INFO, "a file holds" is the whole file).** d2 reads the file, not the squares ahead of the rook, and d4's masks (`rooks & ~(white | black)`) say the same. So there is one reading, not two.
  - RW1 (own pawn behind the rook) reads 0, where an ahead-only reading gives 20.
  - RW2 (enemy pawn behind) reads semi 10, where ahead-only gives open 20.
- **`QE-292-c` (INFO, K2-A4's form).** Only A4's first row moves to the re-found board.
  - `MOBILE_WHITE` stays in `KING_POSITIONS`, so A1's mirror corpus, its "≥ 15 new" count and A4's ± 100 bound row are unchanged.
  - The re-found board's legal-move margin is 11 against the row's 10. It is a static count that no evaluation change moves.
- **`QE-292-d` (INFO, K2-A3b is robust to the table).** Neither arm puts a rook on a semi-open file, and both arms carry equal piece terms (W 50/40/0, B 50/40/0). So the margin is `main`'s −2 / +8 under the shipped table and under `zeroed("KING_FILE_HALF_OPEN")`, whether or not a build ties `ROOK_SEMI_OPEN_FILE` to the king value. d4 says data only.
  - Both the row and its twin move to the new pair.
  - The old phase-24 FENs stay in `KING_POSITIONS` as literal strings, for A1.
- **`QE-292-e` (INFO, other `ABC-083` rows, read by hand, not graded).**
  - A2 (b) (`SHELTERED_24` / `G_PAWN_ON_G6_24`): the piece terms are equal across the arms (a-files open on both sides, f-file neither), so it is not lost.
  - A2 (a), A3 (a) and the phase-0 rows: no rook and no bishop, so 0.
  - The A4 bound row reads `evaluate` − `evaluateWithoutMobility`, both with the term on, so it is unchanged.
  - This is for PR11. K2's list stays the Architect's (d10 step 5).
- **`QE-292-f` (INFO, K1 (b)'s new rows are a baseline read).** `pre-ticket.json` `newRows` holds `main`'s `evaluate` / `evaluateWithoutTaper` on this freeze's positions and their mirrors. They are not hand values. If `main`'s `src/` moves before the build, they are re-read on the new base under K0 (c)'s form: both sets go in the PR and a dated line is added, never a moved row. The committed sets (`G3_PRE`, `DOOR_PRE`, `QUEEN_PAIR_PRE`, `PASSER_PRE`, `G3_CORPUS_MAIN_EVALUATE`, `TAPER_DOOR_CORPUS`) were re-read at this tip with 0 mismatches.
- **`QE-292-g` (INFO, what is not graded here).**
  - K1 (d)'s second row (unequal test halves, `ADR-0070` d4's own-phase form), K1 (e)–(h) and K0 have no fixture of QE's. They are read on the build. Hand phases are frozen so the unequal-halves row can use them.
  - **No coverage claim.** No ABC-292 code exists, so nothing was graded. Every reading of a build is `UNKNOWN - verify`.
