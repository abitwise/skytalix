---
id: 20261023T215851Z-architect-design-decision-1fb6e1bc
kind: decision
by: architect-design
at: 2026-10-23T21:58:51Z
verified_by: 
confidence: high
refs:
  - ABC-205
  - EPIC-008
  - ADR-0031
  - ADR-0028
  - ADR-0024
  - ADR-0039
  - ADR-0044
  - ABC-204
  - ABC-083
  - ABC-079
  - NFR-005
  - NFR-008
  - memory-bank/analysis/2026-10-23-game-1.md
supersedes: 
seal: sha256:6c04119496f53fe31dfec28b12613ccacee43fee713db71d107f66e046f019d5
---

# Architect/Design: ABC-205 design ruled. Queen scale ×3, a tapered king square with our own endgame table, no castled bonus without shelter. ADR-0031 addendum PROPOSED; one owner word (OD-205-1) is owed before merge

Records only, at `main` `c487d89c`, on `grugops/arch-design-ABC-205`. Full text: `plans/tickets/ABC-205-…md` § Design ruling, and `ADR-0031` § Addendum 2026-10-24 (**PROPOSED**; the Orchestrator reports it to the owner, `…7feb0553` item 2).

## Forms (hand-tuned, expected to move)
1. **Queen scale.** The whole `kingExposure` penalty ×3 while the enemy has ≥ 1 queen, ×1 otherwise. Ceiling 315 cp, below a minor piece (320). ×4 was rejected (420 cp).
2. **Taper.** Phase = Σ N1 B1 R2 Q4, clamped to 24. Per king: `((mg·phase + eg·(24−phase)) / 24) | 0`. mg = `KING_TABLE`, unchanged. eg = our own `40 − 15·m`, where m is the Manhattan distance to d4/e4/d5/e5; no Michniewski endgame table (Apache-2.0, `…28633db0`).
3. **Gate.** A positive mg value counts only while 0 shelter files are missing, by the same shelter test as `kingExposure`, computed once per king. The eg half is ungated.
4. **Contract unchanged:**
   - pure, integer and mirror-exact, in one board walk;
   - no new export or door, and no new import edge;
   - `evaluateWithoutMobility` is still exact.

## Tests
- Rows are appended to `src/evaluate.king-mobility.test.ts`. No new file (`NFR-008`).
- **`A1`** asserts (intact − broken) with the queen on > the same with the queen→rook on d8. `A1` must include the e1 rows: with scale = 1 the g1 rows stay green through the gate.
- **`A1` pairs (exact; White to move; intact / broken; for the rook twin, Black's d8 queen becomes a rook):**
  - castled g1: g2 missing: `r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 1` / `r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3P1P/R1BQ1RK1 w - - 0 1`
  - castled g1: g-pawn on g4 (equal material): `r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 1` / `r1bq1rk1/pp2bppp/2n1pn2/3p4/3P2P1/2NBPN2/PP3P1P/R1BQ1RK1 w - - 0 1`
  - castled g1: f2 missing, f half-open: `r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 1` / `r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP4PP/R1BQ1RK1 w - - 0 1`
  - castled g1: h-pawn on h4: `r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 1` / `r1bq1rk1/pp2bppp/2n1pn2/3p4/3P3P/2NBPN2/PP3PP1/R1BQ1RK1 w - - 0 1`
  - uncastled e1: d-pawn gone, d half-open (13.d4 shape): `r1bqk2r/pp2bppp/2n1pn2/3p4/8/2NBPN2/PP1P1PPP/R1BQK2R w KQkq - 0 1` / `r1bqk2r/pp2bppp/2n1pn2/3p4/8/2NBPN2/PP3PPP/R1BQK2R w KQkq - 0 1`
  - uncastled e1: e-pawn gone, e open: `r1bqk2r/pp1nbppp/2n5/3p4/8/2NBPN2/PP1P1PPP/R1BQK2R w KQkq - 0 1` / `r1bqk2r/pp1nbppp/2n5/3p4/8/2NB1N2/PP1P1PPP/R1BQK2R w KQkq - 0 1`
  - uncastled e1: f-pawn on f4: `r1bqk2r/pp2bppp/2n1pn2/3p4/8/2NBPN2/PP1P1PPP/R1BQK2R w KQkq - 0 1` / `r1bqk2r/pp2bppp/2n1pn2/3p4/5P2/2NBPN2/PP1P2PP/R1BQK2R w KQkq - 0 1`
  - uncastled e1: d-pawn on d4 (equal material): `r1bqk2r/pp2bppp/2n1pn2/8/8/2NBPN2/PP1P1PPP/R1BQK2R w KQkq - 0 1` / `r1bqk2r/pp2bppp/2n1pn2/8/3P4/2NBPN2/PP3PPP/R1BQK2R w KQkq - 0 1`
- **`A2`.**
  - Ending: `k7/5ppp/8/8/4K3/8/PPP5/8 w - - 0 1` > `k7/5ppp/8/8/8/8/PPP5/6K1 w - - 0 1`.
  - Middlegame: the g1 base above > the same with `PP2KPPP/R1BQ1R2`.
- **`A3`.**
  - Queens only: `3q3k/pppp1ppp/8/8/8/8/PPPP4/1K1Q4 w - - 0 1` against `3q3k/pp3ppp/8/8/8/8/PP6/1K1Q4 w - - 0 1`.
  - Full middlegame: `r1bq1rk1/pppnbppp/4pn2/8/8/2N1PN2/PPPPBPPP/1KBRQ2R w - - 0 1` against `r1bq1rk1/pp1nbppp/4pn2/8/8/2N1PN2/PP2BPPP/1KBRQ2R w - - 0 1`.
- **`A3b` (new; the gate's own row).** Drop > base on `r1b2rk1/pp2bppp/2n1pn2/8/8/2NBPN2/PP3PPP/R1B2RK1 w - - 0 1` against `r1b2rk1/pp2bppp/2n1pn2/8/6P1/2NBPN2/PP3P1P/R1B2RK1 w - - 0 1` (40 against 21).
- **Mutants** (probed):
  - scale = 1 reds `A1` (the e1 rows);
  - eg = mg reds `A2`'s ending;
  - the gate off reds `A3b` only.

## Moved rows, stops and routes
- **11 default-lane rows move.**
  - **Re-pin** (pinned values): transposition `A1` ×3 and `A5` ×2; ordering `A4` and `G1`.
  - **Re-find** under `ADR-0028` d2 (properties lost): pvs-lmr `A4` ×2; engine `ABC-170` `A1`.
  - **Level:** quiescence `A5` position-6 d1, 10.96x against 10x.
- **OD-205-1 (owner's word, before merge, not before the build).**
  - The 10x level already holds `ADR-0024` d3 headroom, so this is a stop under `ADR-0028` d4.
  - **Ruled not a defect:** the scale alone reads 11.02x, the taper alone 9.26x, base 9.19x.
  - **Proposed:** that cell becomes ⌊1.5 × the build's reading⌋ (about 16x), under `ADR-0028` d1's three checks. If he declines, the scale does not ship → BA/PM.
- **`G2`.**
  - Method: `ABC-076`, base → branch → branch → base; 990–1 210 ns re-read in reverse order.
  - Over 1 100 ns, or a `G6` miss → STOP to Architect/Design, with scale-only and taper-only readings. The Engineer drops nothing.
- **`G6`** is the likeliest stop: position-6 is +8.8 % nodes to depth 7. Read rule (dated, cheap to reverse):
  - ≥ 5 interleaved rounds per board per build;
  - "≥ base" compares medians;
  - any run below depth 6 is a FAIL.
- **`S1`.** The gates go green and OD-205-1 is answered, then the head is frozen, then D runs, after `ABC-204` is Done.
  - 400 games at B, concurrency 3, against the merge-base.
  - GAIN is MET; NEUTRAL gets one pooled extension; anything else → a `failed-attempt` note → BA/PM.
  - Recommended single re-tune: scale 3 → 2.
  - Licence path (B), re-deriving the tables, would make D stale. `ABC-206` and `ABC-212` would not.

## Next move
- **Orchestrator:**
  - report the addendum and OD-205-1 to the owner;
  - merge this records branch;
  - move ABC-205 In Design → Ready for Dev → In Development (SE).
- The build does not wait for the owner's answer. The merge does.
