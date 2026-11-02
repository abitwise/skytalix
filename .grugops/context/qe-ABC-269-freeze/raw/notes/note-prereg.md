# qe-ABC-269-freeze PREREG: ABC-269's QE position sets, frozen before any E1 code exists. The fixture is `src/evaluate.taper-corpus.ts` (sha256 `05ed9e81da4ad803a41c43e12c92d8ada9c23d52e91fa7fb770c871ae6e96339`). It holds B1 (a) 30 mirror rows over phases 0–24, B1 (b) 3 rows at raw phase ≥ 24, B1 (c) the pre-ticket `evaluate` on 176 + 184 positions, B1 (d) 6 graded king-and-pawn endings plus 3 shelter-stress endings (a report until the Architect rules), and B1 (e) 36 passer pairs plus an every-phase array grid. Each set was built by a stated rule and checked on `main`, and none of them is ever changed to make a row fit

QE/E2E, task `qe-ABC-269-freeze`, on `grugops/ABC-269` from `main` `3e55c6a4`. `src/` tree `58fa3eb4` (read with `git rev-parse HEAD:src`; it is the probe's tree and the ticket's B0 base).

**Sources:** the ticket's test note 1, B1 (a)–(e) and § Test notes 5 (reuse sourced fixtures); `ADR-0064` d1–d3 and d8 B1; arch-E1 `…d8150777` § 4 item 4. No production line is touched. Only the fixture is added under `src/`.

## Why QE froze these sets (independent of the probe)
- **The probe's sets were not reused.** The probe's six endings, six passer positions and 145 game positions (`arch-E1/raw/probe/e1probe.ts`, `positions.jsonl`) appear in none of the sets below.
- **Every set comes from a stated rule.** The build rules are in `raw/scripts/gen.ts` and `write.ts`, and the checks are in `verify.ts` (it reads the committed file).
- **The sets were built with the rule's arithmetic in view, and this note says so.**
  - `raw/scripts/lib.ts` `analyse` gives `main`'s mg and the analytic Δ (king 40 − 15 m minus `KING_TABLE`, plus the passer bonus) for a FEN.
  - QE used that to give the mirror rows a Δ × (24 − w) that 24 does not divide, to build the −0 traps, and to see where B1 (d) can fail.
  - No E1 code ran: none exists. The forecasts are published apart, as information. They are not bars.

## The sets

### B1 (a): `TAPER_MIRROR_POSITIONS`, 30 rows (the bar asks for ≥ 15)
- **One row per phase, 0–24, by removal ladders** (side to move flipped to black on even phases where that is legal):
  - **L1:** position-4, minors removed first, alternating white / black in board order. Rows 23–16.
  - **L3:** position-4, queens first, then minors, then rooks. Rows 15, 13, 11 and 9.
  - **L2:** position-5, queens, then rooks, then minors. Rows 14, 12, 10 and 8–0.
  - **Phase 24:** position-5 with black to move.
  - **Why ladders:** the rows are sourced roots (`G3`'s), reproducible, and cover every phase. The kings are asymmetric, so Δ ≠ 0 (−50 on position-4, +125 on position-5), and 26 of 30 rows have Δ × (24 − w) not divisible by 24, so trunc and floor give different answers.
- **Two clamp rows,** `M-clamp28` and `M-clamp32` (promoted queens; the pawn counts allow it). Raw phase above 24 must clamp to 24 (d1). Unclamped, w > D gives (D − w) < 0 and B1 (b) moves.
- **Two −0 traps, `M-negzero-a` and `M-negzero-b`:**
  - mg is exactly 0 and |Δ × (24 − w)| < 24 (phases 23 and 21, Δ ±5). They come from the first hits of a seeded random walk from the start (seed 269).
  - The full form trunc((mg × w + eg × (D − w)) / D) returns −0 on the white-to-move side, and its mirror returns +0. That is an `Object.is` mismatch.
  - d2's delta form mg + trunc(Δ × (D − w) / D) returns +0 on both. d2 says "bit for bit": that holds for the delta form only.
- **One en-passant row, `M-ep-p9`:** an ep square set and black to move below phase 24.

### B1 (b): the full-material rows
The rows with `rawPhase ≥ 24`: `M-p24-pos5-btm`, `M-clamp28` and `M-clamp32`. They sit beside every `G3` corpus position at phase 24, which the test filters by phase.

### B1 (c): `TAPER_DOOR_CORPUS` and `G3_CORPUS_MAIN_EVALUATE`
- **`TAPER_DOOR_CORPUS`:** the pre-ticket `evaluate` on every position in the file and its `mirrorPosition` twin, de-duplicated: 176 positions.
- **`G3_CORPUS_MAIN_EVALUATE`:** the pre-ticket `evaluate` on `G3`'s 184, in `buildCorpus()` order.
- **This is the "frozen corpus run through the pre-ticket `evaluate`", recorded before the ticket.** The build's `evaluateWithoutTaper` must equal each value, `Object.is`.

### B1 (d): `TAPER_KP_ENDINGS`, 6 graded
- **Each row is one ending twice.** Only the walking king's square differs (checked), and the phase is 0.
- **The spread:**
  - 3 white kings and 3 black kings;
  - every corner (a1, h1, h8, a8, and h8 again for white; a1 again for black);
  - every centre square (d4, e5, e4, d5, e4, d4);
  - corner shelter "none" (D1, D3, D5, D6) and "partial" (D2 h2, D4 a7);
  - side to move against the walking king in D2 and D4, so the reading flips sign.
- **Pre-ticket centre minus corner:** −55, −96, −45, −86, −35, −55.
- **The bar:** ≥ 20 cp on all six, from the walking king's side.

### `TAPER_KP_SHELTER_STRESS`, 3: a REPORT, with a ruling owed
- **The rows:** S1 (Kh1 behind g2 h2), S2 (Ka8 behind a7 b7) and S3 (Ka1 behind a2 b2, an enemy c-pawn). This is the castled corner with both files sheltered and the centre files bare.
- **Pre-ticket readings:** −117, −117, −107.
- **Why they are apart:**
  - `kingExposure` has equal halves at E1, and tapering it is E3's (`ADR-0064` § Alternatives). So the centre king still pays up to 105 cp there.
  - Whether B1 (d) is meant to cover the sheltered corner is a question about the ADR's scope. QE does not decide it.
- **Disposition, fixed now:** if the Architect rules the sheltered corner is in B1 (d), S1–S3 join the graded set exactly as frozen. If it is out, they stay a reported reading.

### B1 (e): `TAPER_PASSER_PAIRS` (36) and `TAPER_PASSER_PHASES`
- **The pairs:** each is the same position with and without one passed pawn.
  - White passers on d2–d7 (own ranks 2–7) and black passers on e7, e4 and e2 (own ranks 2, 5 and 7), each at phases 0, 6, 18 and 24.
  - The phase pieces sit in a fixed layout clear of both kings.
  - **The kings stand at white a8 and black h1, where the king's two halves are equal** (40 − 15 × 6 = −50 = `KING_TABLE` there). So the passer is the only term whose halves differ, and the pair isolates it exactly, with no cross-term truncation.
- **Reading:** passed term at w = sign × ((E(A) − E(B)) − (W(A) − W(B))) + base bonus, with E = `evaluate` and W = `evaluateWithoutTaper`. An equivalent reading is sign × (E(A) − W(A)) + base bonus.
- **The array grid:** own ranks 2–7, every phase 0–6 (≥ 1.5 ×), exactly 24 (= base) and every phase 18–24 (≤ 1.25 ×), read from `VALUE_TABLES_FOR_TEST`'s passed halves.

## Checks run on `main` (all exit 0)
- `raw/scripts/verify.ts` on the committed file: **0 failures.**
  - The mirror rows cover phases 0–24, every FEN is canonical, and `main` is mirror-exact on all 30.
  - Each ending differs only by the king; each pair differs only by the passer; the passer is passed.
  - Kings stand on a8 / h1, the stated phases hold, and all 176 + 184 pinned values equal `main`'s `evaluate`.
- `npm run typecheck`: exit 0. `npm run lint`: exit 0 (134 files).
- `npm test`: **2 429 / 2 429**, 65 files, 0 skipped, about 9.4 s.
  - The first run was 1 red: `ABC-082` `A7`'s guard text-scans non-test modules for the mirror corpus's file name, and the fixture's docblock named it.
  - The docblock was reworded, and the second run was green. Nothing else changed.
- Every run was under `flock <host-test.lock>`.

## What this PREREG binds
- **The fixture's bytes at the sha256 above.** A changed row is a new dated QE note and a re-freeze, never an edit.
- **The bars stay `ADR-0064` d8's.** This note adds no bar and loosens none.
- **QE writes no test that needs E1 code.** The B1 rows that read these sets are the Engineer's.
