---
id: 20261104T142415Z-architect-design-decision-05ef9fc9
kind: decision
by: architect-design
at: 2026-11-04T14:24:15Z
verified_by: 
confidence: high on the floor, P0, zugzwang and G1 readings for K3 on the scratch copy; medium on robustness beyond the 287 (H-pre: the floor is order-sensitive under LMR; the d6 report reads 2 / 209)
refs:
  - arch-ABC-283-mate
  - ABC-283
  - ABC-233
  - ADR-0063
  - ADR-0064
  - ADR-0060
  - F1
  - F2
  - K3
  - P0
  - G1
  - PREREG
  - 07f1eb6d
  - c8e90c3c
  - orch-2026-10-30a
  - 19583086
  - se-ABC-283
  - 0b0b135f
  - grugops/ABC-283
  - 4e7ddcca
  - src/search.ts
  - src/search.bundle.test.ts
  - src/search.futility.test.ts
  - src/see.test.ts
  - src/evaluate.taper.test.ts
  - NFR-008
supersedes: 
seal: sha256:299907ad0092ab188002d19578fb6279955fd3746a24bf19758dc46b40bdad41
---

# arch-ABC-283-mate ruling on ADR-0063 F2: (i), a structural fix. **K3: history may promote a quiet move, never demote one.** Its ordering key is max(0, h). It holds the mate floor with all three parts on, and P0 is exact. ADR-0063 stays PROPOSED.

The rule is PREREG `…07f1eb6d`. The measurement is observation `…c8e90c3c` (`raw/out/`). Inputs: ruling `orch-2026-10-30a` `…19583086` and se-ABC-283 `…0b0b135f`.

## The mechanism, named

- LMR reduces a quiet mating move that the **malus has sunk** below the zero-history quiet moves.
- The mating line's quiet move is at pre-history index 1–2 at a White depth-3 null-window node. History puts it at index 9–16. LMR's reduced search scores it ≤ α, so it is never re-searched.
- The −9 cells come from cutoffs scored in the mate band.
- Under it is a pre-existing property that history only unmasks. On this tree, LMR makes the same-depth floor depend on the quiet order: the history-off door with its quiet tier reversed loses 6 / 190. ADR-0063 d11 already says LMR changes "through the index".

## The rule, by the PREREG

- K2, K1L, K1F and K1 come first in the preference order, and each misses a bar:
  - K2 misses B5 (`zugzwang.001`);
  - K1L and K1 miss B1 (a KQK row);
  - K1F misses B1 and B2.
- **K3 acts on the named node** (the mating move back at index ≤ 2, unreduced) **and meets B1–B6.**

## The fix, exact (ADR-0063 decision 4, amended)

- A quiet move that is not the hash move and not a killer is keyed **max(0, h)**, where h is its history cell.
- So a move with a positive cell sorts above the zero-keyed moves, by its cell. Every move whose cell is ≤ 0 keeps generation order among the zero keys (the stable sort).
- **Unchanged:**
  - the table, its index and size;
  - the update: +d² to a quiet cutter, −d² malus to each searched quiet move before it, gravity at 16 384, the same exemptions;
  - the lifetime, the tiers above the quiet moves, the root using the same comparator, and every LMR and futility rule and constant.
- The malus still does work: it pulls a positive cell back toward 0, so a move that stops cutting loses its rank. It can no longer sink a move below the moves history knows nothing about.
- **Not a value tune:** no constant moves. It decides which moves history may move: up, never down. That is the brief's "which moves history may affect".
- **One edit serves both recursions:** `orderKey` in `src/search.ts`, which `orderMoves` calls, and `src/engine.ts` calls `orderMoves`. With `history` off the key is 0 as before, so every door is untouched by construction. P0 is measured exact, 6 / 6.

## Floor and P0 evidence (scratch copy, all three parts on)

- `search()` d5: **0 / 190**. `chooseMove` d5: **0 / 188**.
- The older rows, against `searchWithoutFutility`, `…SeePruning` and `…Taper` at d5, and taper d4 → d5: 0 / 189, 0 / 190, 0 / 189, 0 / 163.
- `chooseMove` d6 (report): **2 / 209** (was 4 / 209), two KRK rows with Black to move, −29994 → −652.
- **P0:** `searchWithoutBundle` / `chooseMoveWithoutBundle` at d6–d8 on kiwipete and position-6 equal main `09694a4e` byte for byte, 6 / 6.
- **Zugzwang 7 / 7. G1 54 / 58, none newly missed.**
- **Drift d5 on the 190:** 99.47 %, max 28 / 27 cp, 0 mate changes. That meets ADR-0063 d8. The bundle as built reads a 44 cp maximum in `search()`, above d8's 42.
- **d8 nodes against main:** `search()` 0.8657 / 0.5758, `chooseMove` 0.9234 / 1.1595 (information).

## Residual risk (carried, not hidden)

- The floor holds **on the 287, not by construction.** H-pre shows that LMR makes the same-depth floor order-sensitive on this tree.
- A positive-history move can still push a mating move to index ≥ 3. The d6 report's 2 / 209 is that.
- The bar the brief names (d5, both recursions) is met. The d6 row stays a report, as the brief has it.
- If a later change re-reddens the d5 floor through the same door, the next lever is LMR itself (`ADR-0060` P1's ground), not another history form.

## SE build lines (on `grugops/ABC-283`)

1. **`src/search.ts` `orderKey`:** the last line becomes `return history ? Math.max(0, HISTORY[historyIndex(move)] as number) : 0;`. Its doc comment, and the tier comment above `HASH_MOVE_KEY`, say "a quiet move's key is max(0, its cell): history promotes, never demotes (ADR-0063 d4, dated 2026-11-04)". No other production line changes: no `engine.ts` edit, no export change (ADR-0063 d6's counts stand).
2. **`src/search.bundle.test.ts`, the order row:** re-pin with old → new in the PR.
   - The five −13, the −5 and the −9 cells now sort with the zero cells, in generation order.
   - The expected list becomes `killer, plain[7], then plain[0..6, 8, 9, 11..19]` in generation order.
   - Add one assertion: a negative cell sorts level with a zero cell (generation order) and below every positive cell.
3. **The source row** pinning the cutoff call text is unchanged (the update is unchanged). The lifetime row still holds: K3 reads 77 / 28 non-zero cells.
4. **Turn green with no re-pin:**
   - the bundle file's two mate-floor rows;
   - ABC-268 A3 (b), ABC-279 A3 (b), and ABC-269 B2 (both rows).
5. **Re-read and put in the PR:**
   - P0 (6 / 6), zugzwang 7 / 7, G1;
   - the ADR-0063 d8 drift (≤ 42 cp);
   - the d8 node ratios;
   - typecheck, lint, build, skip count 0, `npm test` green and ≤ 10 s (NFR-008).
   - If any count differs from this note's, explain it before any other bar is read.
6. **Then** QE's PREREG and the single 100-game read follow, by the Orchestrator's ruling `…19583086` item 2.
