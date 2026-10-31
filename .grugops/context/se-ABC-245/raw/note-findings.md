# `ABC-245` SE notes and QE handoff (INFO only; none blocks)

- **SE-245-a (INFO).** The row kills every cap below 98, not only 8 and 50: its nearer match is at −94, its farther at
  −98, and nothing matches in −4…−92. Caps 98–99 and the cap's removal (Q7) stay equivalent on this list, as QE and
  the SE agreed at `ABC-242` for any trimmed caller.
- **SE-245-b (INFO).** The fixture's queen checks the black king on some plies of the walk; every move is legal and
  reversible (clock reaches 98 with no reset), and no position other than the start repeats. 0 is the best score in
  the root list, so the strict second-best (`d7c8`, −1000) is the move played; the row does not assert the pick.
- **SE-245-c (INFO).** The header's other words ("every search is depth 1", the A-list) were not rewritten; only the
  count the ticket names. It reads 46 at this commit and goes stale with the next row in this file.
- **For QE:** re-run Q6 and Q8 on the whole lane (A2), read `G8`. No production line changed: no UAT (Test note 2).
  The generator is `raw/fixture-gen.ts` (node, seed 7); the plant outputs are `raw/plants/`.
