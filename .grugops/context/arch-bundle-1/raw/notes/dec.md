# arch-bundle-1 design: bundle 1 is `C1+M3`. Neither premise is met, so `ADR-0072` and `ADR-0073` are PROPOSED with F1 fired and the build waits for the owner's word. The mate floor is 0 with both parts on and per part

PREREG `…aa5c4dc1`; readings: this task's observation note. Brief `arch-bundle-1`; inputs `orch-2026-10-30a` `…3b15b361`, `…ce2883d8`, `…112cd856`.

## What was done
1. **`ADR-0056`:** § the bundle read marked ACCEPTED 2026-11-04 (owner, `Q-3K-11` (a)), carrying R-BUNDLE-1, with a dated line in § Status. No line of B1–B7 changed.
2. **`ADR-0072` (P4) and `ADR-0073` (O2c), both PROPOSED.** `ADR-0073` is a new ADR, not an `ADR-0063` amendment: `ADR-0063` is accepted on `ABC-283`'s read, and a B6 miss could not un-amend it (`ADR-0073` § Status).

## The relation (B1)
(a) a shared file; (b) P4 reads the order O2c moves; (c) P4 is held and O2c is marginal. The relation held as stated, and (b) proved small: O2c moves P4's audit from 16.43 % to 15.27 % and its drift by under a point.

## The forms the rules picked
- **O2c = C1, the countermove alone** (Rule A). Continuation history failed Safety and bought no node. This narrows `ABC-288`'s scope, so it goes to the owner.
- **P4 = M3: T = 4 / 7 / 12, d ≤ 3, key-0 quiets only, three non-pawn pieces** (Rule B's carry rule, since no form met every bar).

## The verdict, by the PREREG
| part | met | missed |
|---|---|---|
| P4, own door | L3 floor 0, zugzwang 7 / 7, `G1` 54 / 58; L4 d8 0.6039 / 0.8170 / 0.7509 / 0.8363, reach +0.116 | **L2** drift 93.58 % / 94.12 % (≥ 95 %), 80 / 79 cp (≤ 75); audit 15.27 % (≤ 0.5 %), 29 errors ≥ 200 cp (0) |
| O2c, own door | CH2 floor 0, zugzwang, `G1`, drift 100 %, 9 / 4 cp | **CH3** 1.0031 / 0.9999 / 1.0935 / 0.9989 (≤ 0.95) |

All on against `main`: d8 0.5947 / 0.8106 / 0.6982 / 0.9358, reach +0.148. No form is tuned after this read. The build does not start without the owner's word.

## The mate floor
- **`C1+M3`, `M3`, `C1` each:** B1 0 / 191, B2 0 / 189, the older rows 0, R1 0 / 209, `krk` 0 / 17, 0 / 17, 0 / 29.
- **It is order-sensitive, as `R-283-LMR` says.** Other forms went red: M1, M2, M4 lose a KRK row, C2–C4 a KQK row. Six of those rows return the mate with LMR off.
- **If it goes red on the build:** `ADR-0056` B3. Read per part; name the cause; a structural dated line in that part's ADR; every safety row again. No single door clears it: a STOP to Architect/Design. Never a re-pin, a deeper depth or a tune. The next lever is LMR (`ADR-0060`), not history, T or another history form.
- **The floor holds on the 287 and the fresh 600, not by construction.** On P4 it rests on the three-piece clause; that is residual risk, carried.

## The single read and the bars alone
- **One C2′, 100 games at 100 ms,** all parts on against the merge-base, **GAIN ≥ 50.0,** S′ at E 1 810, the Levels deep lane, PREREG first, never re-played, no subset. Both parts fire at 100 ms, so the intent is GAIN.
- **Alone (B2):** each part's door pair and rule rows; the all-off door node-equal to `main`; the form fixed; each part's own bar on its own door, reported under a lift; `G2`, `G6`, `NFR-008` with all parts on.
- **Lane budget:** rows in the existing `src/search.bundle.test.ts`; rows ≥ 50 ms go deep; ≤ +0.1 s; no new default-lane file. After `ABC-302`.

## The merge interactions
- **`ABC-282` (W1):** both edit `runIteration`. P4 changes the tree's growth, so b = 2.3 and A0's counts are re-read by whichever lands second (`ADR-0071` D12). If W1 lands first, a changed b is its own ticket with its own read.
- **`ABC-298` (V3):** one at a time on `orderMoves`. `moveCountFrom` needs one sorted list, the malus reads the searched prefix, the countermove joins stage 3. Whichever lands second re-reads the other's identity rows.

## Owner questions
- **`OQ-0072-1`: accept `ADR-0072`, lifting L2 for this bundle?** P4 misses drift narrowly and the audit by thirty times, with piece-sized errors. Every form misses the audit (13.9–17.6 %). Lifting it overrides a guard, not only a pay gate as in `ABC-283`.
- **`OQ-0073-1`: accept `ADR-0073`, lifting CH3 for this bundle, with `ABC-288` narrowed to the countermove?**
- **The choices, one answer for both:**
  - **(a) Lift both; build `C1+M3`; one read.** On a pass both ADRs are accepted as a bundle; on a miss both return to held.
  - **(b) Lift L2 only; `ABC-286` alone on its own C2′.** O2c stays held. Simpler, and the read is attributable to one part.
  - **(c) Hold both.** The default without an answer. The slot goes to the next item.
- **Recommendation: (a), over two misses, and said as such.** The safety rows are all green, and the read is cheap: about 0.7 h of host plus the build, and a miss merges nothing. `ADR-0061` calls the audit a guard, not a predictor. `ABC-283` missed three pay gates and read 66.0 / 100. Against it: reach is only +0.148 ply, P2's +0.70 still lost, and 100 games cannot tell +10 from −10. O2c is nearly free and nearly empty, so R-BUNDLE-1 is exactly its risk. (b) is the plain alternative if he would rather not carry it.

## Owed
**BA/PM, on the owner's answer** (nothing here edits a ticket, the EPIC or the board):
1. `ABC-286`: `adr:` line names `ADR-0072`. DoR row 10 reads "joint probe read: L2 missed, F1 fired; held on `OQ-0072-1`". L2 and L4 take `ADR-0072` d9's numbers. Scope 1 takes d1's clauses; L0's door is the all-off door.
2. `ABC-288`: `adr:` line names `ADR-0073`. DoR row 10 reads "CH3 missed, F1 fired; held on `OQ-0073-1`". CH1's bytes: 3 072; CH3: ≤ 0.95. On his yes: title and scope 1 drop continuation history; on (a) or (b) the F1 disposition is as he rules.
3. `EPIC-011`: rows P4 and O2c; § Owner questions gains both; § The per-change rule's pointer reads ACCEPTED (Q-3K-11 (a), R-BUNDLE-1).
4. **On (a):** one bundle ticket in `ABC-283`'s form (B7), its bars copied from `ADR-0072` d7–d11 and `ADR-0073` d8–d12, the two pages kept as design pages, after `ABC-302`.
5. `ABC-284`: a line that bundle 1's red forms add to `R-283-LMR` (its named trigger 2).

**Architect, at acceptance:** the two Status lines; `ADR-0056` D2 rows P4 and O2c; a dated pointer in `ADR-0063` (d2, d4); `R-283-LMR`'s new rows in `ADR-0060` § Status.
**Orchestrator:** the board move; the owner's question.
