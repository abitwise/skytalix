---
id: 20260919T173200Z-qe-e2e-observation-abc107-sentence-audit-three-imprecisions-none-a-defect-782e2fd1
kind: observation
by: qe-e2e
at: 2026-09-19T17:32:00Z
verified_by:
confidence: high
refs:
  - ABC-107
  - ABC-114
  - ADR-0022
  - src/frame.overflow-bound.test.ts
  - src/frame.test.ts
  - src/move-input.test.ts
  - src/history-pane.ts
supersedes:
---

# `ABC-107` sentence audit of `src/frame.overflow-bound.test.ts` (the `ABC-114` standard) — every sentence checked against what the file exercises; three imprecisions, zero false verdicts

**NOT A STAMP.** Each sentence was read against the code it names or a measurement through the
real pipeline (the probe in the sibling `artifact-ref`).

| sentence (docblock / comment) | checked how | verdict |
| --- | --- | --- |
| "`W` is whatever the delivered panels set (21 today, from the history pane)" | widest frame row measured = 21; `HISTORY_COLS = MOVE_NUMBER_DIGITS + 1 + (1 + SAN_WIDTH) * 2` (`src/history-pane.ts:83`), its own docblock says 21; board 18 | **TRUE** |
| "It holds every candidate of an ambiguity of up to SIX same-square SAN items" | true for the 4–5-character items every fixture renders (measured hidden 0 at six); `ADR-0022`'s geometry table: 7-character items (`Qh4xe1#`) fit **4** in two rows | **IMPRECISE** — "six" is the bound for this rendering's item lengths, not for every SAN length. Same wording as `ADR-0022` clause 1; a same-square ambiguity of six 7-character items (full-origin capture with check) is further from play than the fixtures. Wording, not a defect |
| "at seven it shows five and marks `(+2 more)`, at eight it shows five and marks `(+3 more)`" | region read back: `["N2d4 Nb3d4 Nf3d4", "Nb5d4 Nf5d4 (+2 more)"]`, `["Nc2d4 Ne2d4 Nb3d4", "Nf3d4 Nb5d4 (+3 more)"]` | **TRUE** |
| "this file is the only thing that holds it in place (clause 2)" | `src/frame.test.ts:376` pins six FITTING with no marker (synthetic items at W = 18); `src/move-input.test.ts` `A4` pins hidden 0 on its six-queen and smaller fixtures | **IMPRECISE** — true of the 7→2 / 8→3 tripwire (nowhere else); the six-fits requirement has two other guards |
| "A wider frame, a narrower SAN rendering or a moved `MESSAGE_ROWS` reds one of these rows" | M5a (W+1) 6 red, M6 (separator removed) 9 red, M1a/M1b 9 red each | **TRUE** — and one column / one row is enough |
| "NO WIDTH IS ASSERTED HERE" | grep: no `width`, `W`, `21` assertion in the file | **TRUE** |
| "read … exactly as `src/move-input.test.ts` reads it" | `src/move-input.test.ts:444` asserts `not.toContain("(+")` — absence only, never parses N; the regex `/\(\+(\d+) more\)/` has no counterpart there. `src/frame.test.ts:418` reads N via `endsWith(`(+${hidden} more)`)` | **IMPRECISE** — the marker is the same channel; the parse is this file's own. Wording |
| "Every FEN below is the ticket's, verbatim" | byte-compared with the ticket's table | **TRUE** (three knight FENs; the queen FEN is `ADR-0022`'s, as the sentence says) |
| "the other piece type that reaches the cap of eight" | `ADR-0022` § geometry: knights 8, queens 8, rooks/bishops 4 | **TRUE** (by the ADR's argument; not re-derived) |
| "seven knights of one colour is five promotions" | 2 + 5 = 7 | **TRUE** |
| "`A2`'s reference: the everyday two-candidate ambiguity (`ABC-033` `A2`'s own fixture)" | `src/move-input.test.ts:21` `TWO_KNIGHTS_FEN` byte-equal | **TRUE** |
| "One frame through the real pipeline: the delivered panels set `W`; nothing here does" | `frameOf` passes the real `renderBoard` / `renderStatusPanel` / `renderHistory` | **TRUE** |
| "The message region: the `MESSAGE_ROWS` rows before the reserved prompt row" | `assembleFrame` pushes the prompt row last; slice matches | **TRUE** |
| "`d4` is empty in every fixture, so neither spelling carries a capture mark" | rank-4 field of each FEN: `8`, `8`, `8`, `Q6Q` (a4, h4 occupied; d4 empty) | **TRUE** |
| "comparing `Move` objects by reference across two `legalMoves` calls reads 0/8" (Engineer's note, mirrored by the `from`/`to` value compare) | the file compares by value; not re-measured | **CONSISTENT** with the code; the 0/8 figure is the ruling hop's, `UNKNOWN - verify` here |
| "candidates minus hidden appear whole, the rest not at all" (line 147) | the row asserts exactly that; M3b/M4b/M5a red it | **TRUE** |

## Criterion-naming check (subtask: "asserted by a row that names it, not by a comment")

Every `it` row's full name carries a criterion id through its `describe`: `ABC-107 A1' / A3 / A5 —
…`, `ABC-107 A1' — every candidate stays reachable …`, `ABC-107 A2 — …`. The only criterion carried
by a COMMENT alone is `A3`'s line-139 `// A3 — six still fits…` — but the row it annotates
(`six knights shows every candidate in full`) sits under the describe that names `A3` in its
title, so the full test name does name it. `A4` is a git measurement, not a row, by its own
wording. **No criterion rests on a comment.**

## What QE did NOT do

No production line edited (mutants excepted, every one reverted); no test added; `plans/board.md`,
`AGENTS.md`, `plans/nfr-catalog.md` not opened for writing; `NFR-008` not ruled.
