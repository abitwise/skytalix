---
id: 20261017T105500Z-qe-e2e-observation-abc040-derived-blind-8c0b32bf
kind: observation
by: qe-e2e
task: qe-ABC-040
at: 2026-10-17T10:55:00Z
verified_by:
confidence: high
refs:
  - ABC-040
  - ABC-028
  - ABC-029
  - plans/tickets/ABC-040-traceability-duplicate-row-reconciliation.md
  - plans/traceability.md
supersedes:
---

# `ABC-040`: readings QE took before opening the SE's § Delivery or notes

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). Inputs came from `git show`
into scratch files: base `b84dc637` (1100 lines, md5 `6372321941926aec40fb3d9af249a17d`), code commit
`8d2e4f8b`, and tip `08bbdf2c`. The traceability file is byte-identical at code and tip (`cmp` 0; 1096 lines, md5
`e00fd5f604cbb9b13eecdfcfc00eb56f`). Split: `re.split(r'(?<!\\)\|', line.strip()[1:-1])`. The file's own
`.strip('|')` variant gives the same cell count on every row. Rows are addressed by id plus ordinal, never by line.

- **Duplicate pairs at base.** QE grouped all 512 `^| ABC-` rows on byte-identical raw cells 0–4. Exactly two
  groups share them: `ABC-028` (L461, L463) and `ABC-029` (L462, L464). `ABC-100` (L659/L680) and `ABC-154`
  (L1067/L1068) share a first cell but not cells 0–4, so they are not this defect. All four target rows split to 10
  cells and contain 0 escaped pipes. The non-10 rows at base are L631 (11), L632 (13), L740 (11), L987 (6) and
  L1011 (2), the same five the re-score named, each shifted by one line. They are untouched at the tip
  (L626/627/735/982/1006).
- **Cell lengths, stripped.** `ABC-028` live has Code 2659, Tests 3683, UAT/Release 0/0, Status 50168. `ABC-028`
  stale has 0/0/0/0 and Status 2618. `ABC-029` live has 727/2885/0/0 and Status 16544. `ABC-029` stale has
  0/0/0/0 and Status 5109. Cells 0–4 are identical within each pair.
- **R3 prefix proof (A2).** The stale `ABC-028` Status is a byte-exact prefix of the live one: `startswith` is True
  on stripped cells (2618 of 50168) and on raw cells (2620 of 50169). The stale Code, Tests, UAT and Release cells
  are all empty.
- **`d` (A3).** The first differing character of the stripped `ABC-029` Status cells is at index **2705** (2706 in
  the raw cell, because of the leading pad space). Neither cell is a prefix of the other. The tail `stale[2705:]`
  is 2404 characters, 2418 UTF-8 bytes. `live[:d]` ends ``…`HISTORY_COLS` HOLDS at 21.** **``, `live[d:]` begins
  `DESIGN HOP RUN 2026-08-12`, and `stale[d:]` begins `AMENDED 2026-08-11` and ends ``ZERO `src/` bytes.``. All six
  probes are in the stale tail, and none is in the old live cell. No 80-character window of the tail (sampled every
  40 characters) occurs in the old live cell, so the splice adds no duplicate text.
- **R4 splice equality (A3/A4).** The tip `ABC-029` Status equals `live[:d] + stale[d:] + " **" + live[d:]`:
  **True**. The raw cell equals `" " + that + " "`, so the original padding is kept. The tip row equals the base live
  row with only the Status cell replaced, and cells 0–8 are byte-identical. The cell has 206 `**` markers; without
  the separator it would have 205. The tail on its own holds 23, which closes the opener carried in `live[:d]`. Both
  A4 anchors occur once, in order. Record headers inside the merged cell read `AMENDED 2026-08-11` and then five
  `2026-08-12` records (`DESIGN HOP RUN`, `BUILT`, `WITNESSES LANDED AND GREEN`, `CONTAINMENT BUILT`,
  `CONTAINMENT BUILT AND GREEN`), so they are in date order. The 08-11 date is corroborated by git: the stale tail
  was introduced by `5caef94f`, authored 2026-08-11 23:54 +0300, even though its task id reads
  `abc019-rebase-2026-08-12`.
- **Every other row (A6).** Excluding the four target rows at base and the two survivors at the tip, 508 base rows
  equal the first 508 tip rows, byte for byte and in order. The tip has one extra row, `ABC-040 (build)`, at the
  file's tail, and it splits to 10 cells. The tip `ABC-028` row is byte-identical to the base live `ABC-028` row.
  The row count goes 512 → 511 with the build row, which is 510 before it: a drop of exactly 2. `diff` shows three
  hunks: the comment paragraph (base L379–388 → tip L379–385), the four rows (→ two), and the appended row.
  Nothing else in the file changed.
- **A5 sentence.** `grep -cF` on the amended criterion's sentence (`KNOWN DUPLICATE ROWS — flagged 2026-08-12 …
  NOT repaired.`) gives base 1 and tip 0. `grep -c 'NOT repaired'` gives base 5 and tip 4. The four remaining hits
  are other paragraphs and rows (L118, L193, L466, L475), and none of them is in the comment block. `STALE
  SNAPSHOT`, `KNOWN DUPLICATE` and the comment-block copy of `APPEND TO THE FIRST` all fall to 0 in the block.
  Tip L379–385 is one dated sentence (`DUPLICATE ROWS RECONCILED 2026-10-17 …`). It names R3 with the
  prefix and empty-cell checks, names R4 with the date-ordered splice, and says "preserved 2404 bytes (2404
  characters, 2418 UTF-8 bytes)".
