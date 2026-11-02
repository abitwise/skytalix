---
id: 20261102T212011Z-architect-design-decision-f3a4dac0
kind: decision
by: architect-design
at: 2026-11-02T21:20:11Z
verified_by: 
confidence: high on the S' amendment (the Orchestrator's ruling, arithmetic from the pooled W/L/D) and on the ADR-0063 verdict (pre-registered rule, measured); the expected score at 1 810 and the 'why it pays little' reading are estimates
refs:
  - arch-ABC-233
  - grugops/arch-ABC-233
  - ABC-233
  - EPIC-011
  - O1h
  - P1
  - P4
  - P5
  - ADR-0063
  - ADR-0060
  - ADR-0061
  - ADR-0056
  - ADR-0050
  - ADR-0026
  - ADR-0062
  - ABC-204
  - ABC-234
  - NFR-005
  - NFR-009
  - e72487e1
  - 60b76b52
  - ec2ed472
  - orch-2026-10-30a/20261102T210500Z-orchestrator-decision-8ce2fd23
  - arch-ABC-233/20261102T210820Z-architect-design-decision-4d5a0fe3
  - arch-post-268/20261102T205950Z-architect-design-decision-1bc554fb
  - arch-post-268/20261102T205950Z-architect-design-observation-9a7f24af
supersedes: 
seal: sha256:54997c3df4076b2995c0dd6b735132b044a25dcdd958466ebb3e92ee59f48316
---

# arch-ABC-233 decisions: S′ amended to **E 1 810** (band-centre step E′ = E + X − 168.4, symmetric; pool empty at 1 810). `ADR-0063` is written PROPOSED, **premise not met on `main`** (F4), intent NEUTRAL. `ABC-233` stays at DoR 9/10. Architect's recommendation: park O1h as a standalone change, and re-open it only inside a joint P1/P4 probe

Architect/Design, task `arch-ABC-233`, records only, on `grugops/arch-ABC-233` from `main` `60b76b52`. Inputs: Orchestrator `…8ce2fd23`; `arch-post-268` `…1bc554fb` / `…9a7f24af`; the PREREG `…4d5a0fe3` and the results note of this task.

## 1. `ADR-0056` S′: dated amendment (§ Status; pointers at S′'s E bullet and the re-pin bullet)
- **The rule:** when the pooled score p over ≥ 30 games leaves 60–85 %, compute **E′ = E + X − C**.
  - X = −400 log₁₀(1/p − 1);
  - C = +168.4, the Elo at 72.5 %, the band's centre;
  - E′ is rounded to 10 and clamped to 1 320–3 190.
  - The formula is the same in both directions. Upward, it applies with no ask up to 2 600. A downward E′ is proposed, but applying it is the owner's question.
- **This step:** 1 650 + 325.2 − 168.4 = 1 806.8 → **1 810**.
  - Stockfish 19 `UCI_Elo` 1 810, pick depth 4. Everything else in S′ is unchanged.
  - **Command:** `node tools/rating/rating.ts r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`. The dry-run is good.
- **The pool starts empty at 1 810.** The 1 980 pool never opened, and the 1 650 pool stays closed at 26.0 / 30.
- **Expected score:** about 72 % (range 33–93 % at ± 292). S-4 would stop an unchanged build about 0.1 % of the time.

## 2. `ADR-0063` (PROPOSED; premise not met on `main`)
- **Design of record:**
  - `Int32Array(2×64×64)`, side × from × to, 32 768 bytes, module scope in `src/search.ts`.
  - On a quiet beta cutoff: +d² to the cutter, −d² to each earlier searched quiet move; gravity bound 16 384.
  - No update in quiescence, at the root, on a null move, or for futility-skipped moves.
  - Cleared at every `search()` / `chooseMove` entry, kept across iterations, no aging.
  - Ordered after the killers (killer key 500 000 + rank; quiet key = h, stable), the root included.
  - Switch `history` in both recursions; doors `searchWithoutHistory` / `chooseMoveWithoutHistory`, the top rung.
  - Exports: +3 in `search.ts` (door, `historyByteLength`, `historyScore`), +1 in `engine.ts`.
- **Bars, by the PREREG's rules for H1:**
  - A4 (a) d8 four readings ≤ 0.95×;
  - drift ≥ 95 % within 25 cp, none beyond 42 cp, 0 sign changes, both recursions;
  - mate floor at the same depth d5, 0 / 189;
  - zugzwang 7 / 7;
  - `G1` ≥ 54 / 58 with no NEWLY-MISSED;
  - the audit is information;
  - `G6` is the build's gate.
- **Intent: NEUTRAL** (reach +0.089 < +0.10). Its deep bar A4 (a) is missed: 1.0011 / 0.9751 / 0.9832. So **F4 fired**, the build does not start, no read is owed, and "accept ADR-0063" is not put to the owner.
- **LMR:** this ticket only orders. Reordering changes which moves LMR reduces and futility skips, through the index only.
  - A later P1 probe adds `ADR-0060` d11's history term to the reduction (less for high h, more for h < 0), measured jointly with this table.
  - P4 counts moves in history order, and its ADR measures that.
- **Why it pays little:** the killers hold 90 % of quiet cutoffs, and 82 % of cutoffs are on the first move. History re-orders the rest (≈ 2.6 % of cutoffs).
- Dated lines were written in `ADR-0056` D2 (row O1h) and in `ADR-0060` § Status (the P1-over-history diagnostic; P1 stays parked).

## 3. What BA/PM needs for `ABC-233` DoR 10/10
- **Today, DoR 10 cannot turn ✅ on this ADR.** Item 10 reads "❌ `ADR-0063` PROPOSED, premise not met on `main` (F4); the build does not start". DoR stays 9/10 and the ticket stays in Backlog.
- **Records owed now (BA/PM's fence):**
  - a dated block on `ABC-233` with the figures, its A6 S′ line changed to E 1 810 with `--elo 1810`, and `NFR-009` at 32 KiB, not 16;
  - the ticket's A3 (d7 ≤ 0.95) is superseded by `ADR-0063` d9 (d8, both recursions). The literal d7 `search()` reads 0.9497 / 0.8367 (met by 0.0003), and `chooseMove` 0.9769 / 0.9373 (missed);
  - `EPIC-011` § Close-out S′ pool row and C10: E 1 810, pool empty, the 1 980 pool never opened;
  - every open strength ticket's S′ line: `--elo 1810`;
  - `EPIC-011` Phase 3 order: O1h is no longer a standalone first pull.
- **What would earn 10/10 (on a re-open):**
  1. the Orchestrator names a re-open premise (`ADR-0063` § Status 1–3);
  2. a pre-registered probe meets the pay gate, or a joint P1/P4 bar the probe's ADR writes;
  3. the page then takes these deltas: A1 export counts (+3 / +1, door names); A2 = decision 7's four rows; A3 = 42 cp both recursions, the same-depth mate floor and zugzwang 7 / 7; A4 (a) d8 ≤ 0.95 on four readings, (c) `G6`; A5 `G1` ≥ 54 / 58; A6 intent NEUTRAL (≥ 43.0), S′ at E 1 810, the Levels deep lane; NFR-009 32 768 bytes; the scope says "side × from × to".

## Questions
- **Owner:** none. Two items to tell him, through the Orchestrator: S′ is now at E 1 810 by the band-centre rule, and O1h's premise is not met.
- **Orchestrator:**
  1. **`ABC-233`:** park it (the Architect's recommendation), or re-cut it as an enabler inside a joint probe?
  2. **The next Phase 2/3 pull:**
     - (a) a pre-registered joint probe of O1h's table plus `ADR-0060` d11's history term, with zugzwang as the hard gate. It is the one premise on record for both P1 and P4, and the diagnostic shows history removes two of P1's three misses. It is cheap: records plus a scratch probe.
     - (b) P5 as NEUTRAL with a deep bar (`ADR-0061` F6).
     - (c) another Phase 3 row (O3s `ABC-234`), or T1.
     - Architect's recommendation: (a), then (b).
