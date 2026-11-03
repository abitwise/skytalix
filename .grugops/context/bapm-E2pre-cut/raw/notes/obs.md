# bapm-E2pre-cut sources checked: each figure on the pages was read from `ADR-0067`, `arch-ABC-239` `…e4c34239` / `…48ae6a93`, the prototype's `out/diag2.json`, `se-ABC-269` `…669f366c` and `src/evaluate.ts` at `main` `0b87f2d5` (`src/` tree `58fa3eb4`, so `ABC-269` is not merged). Nothing run

- **The id:** `ABC-274` was free. A `grep` for `ABC-27[4-9]` found it only in the brief. The highest in use was `ABC-273`.
- **`ADR-0067` d8, E2-pre's bars:** node identity (B0's rows), `G3` mirror `Object.is`, `evaluate` equal to the pre-ticket `evaluate` on the frozen corpus, `G2` ≤ 1.05 ×, and `G6` "≥ base" "as for any value-identical ticket (`ADR-0056`'s dated `Q-3K-4` line)". No games. The falsifier table F1–F7 has no E2-pre row.
- **`ADR-0056` D7, dated 2026-11-03:** "A value-identical ticket keeps its own cost bar as before." `Q-3K-4` (b) is scoped to value-changing evaluation tickets.
- **`EPIC-011` § The per-change rule:** "Value-identical tickets keep the S2 nps reading and play no games". `ABC-265` is the only named exception, so `ABC-274`'s S2 is open for a ruling.
- **`se-ABC-269` `…669f366c`:**
  - B0 is exact on all 11 counts;
  - G4 cross-build on the 190 (`G3`'s 184 plus 6 endgames): 8 360 rows, 0 mismatches;
  - `G2` is 1.0711 × / 1.0672 ×, so F3 fired. `arch-ABC-269-F3` is pending in the queue.
- **King tables:**
  - D4 `params.pst.king.mg` starts at −178 and has −143 where `KING_TABLE` (`src/evaluate.ts:139-148`) has −50 and −40, a scale of ≈ 3.56 ×;
  - `…48ae6a93` reading 3 gives 3–3.6 × (mg) and 2.2–2.8 × (eg) across fits.
- **Prototype figures quoted on the pages:**
  - outer cross-entropy C-S 0.58342 against E1's 0.59153 = 0.9863 ×; D4 inner 0.9960 ×; queen 2 593 / 137;
  - 3 431 games and 254 485 rows; manifest `6e8d0ab0…`; identity 0 misses, worst 0.958 cp; K 0.585;
  - 40.2 % of rows from openings 1–50.
- **`ABC-239` A2 against B-T2:** the page read "≤ the hand weights' loss", and `ADR-0067` B-T2 reads "< 1.000 × (A2 as written)". This is recorded on the page, and the stricter bar governs.
- **Arithmetic, not a reading:** `ABC-274`'s packed table is about 6 × 64 × 2 × 4 B ≈ 3 KiB. Marked `UNKNOWN - verify`; the Engineer reports it.
