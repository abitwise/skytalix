---
id: 20261104T000848Z-software-engineer-observation-15cac083
kind: observation
by: software-engineer
at: 2026-11-04T00:08:48Z
verified_by: 
confidence: high on K0-K2 (deterministic counts and Object.is readings under the host lock, base and build in one process or byte-compared); K3/K4 are Engineer pre-reads on a host that was not ALONE (a foreign process on one core; G6 Tctl wait relaxed), QE grades them
refs:
  - se-ABC-270
  - grugops/ABC-270
  - ABC-270
  - EPIC-011
  - E3a
  - ADR-0068
  - ADR-0067
  - ADR-0064
  - ADR-0028
  - ABC-083
  - ABC-274
  - K0
  - K1
  - K2
  - K3
  - K4
  - G2
  - G6
  - NFR-005
  - NFR-008
  - NFR-009
  - QE-270-a
  - 4cb84035
  - 8f086ee8
  - 795a6b61
  - 0f393c18
  - src/evaluate.ts
  - src/evaluate-params.ts
  - src/evaluate.queen-on.test.ts
  - src/evaluate.taper.test.ts
  - src/evaluate.king-mobility.test.ts
  - qe-ABC-270-freeze/20261103T222633Z-qe-e2e-decision-fa82b3f3
  - qe-ABC-270-freeze/20261103T222638Z-qe-e2e-observation-543b10d8
  - sha256:68769ea9712097ff1a366b6ad952a71376579fba94d6625c032062dd5e19c681
supersedes: 
seal: sha256:34db1fec635a9042243e438c78fb94cfeb2e89e97ae4f38da4b393e429e45657
---

# se-ABC-270 acceptance readings (the Engineer's; QE grades): K0 node identity 7/7 exact (and the 4 door counts), base and build byte-identical; cross-build 0 mismatches in 9 120 search/door rows; K1 (a)–(e) green, incl. QE's 7 frozen pairs at exactly 3 × per king; evaluate 0 `Object.is` misses in 25 620 rows; K2 0 re-pins, every deep lane green (puzzle-weakened fails as the negative control it is); K3 G2 Engineer pre-read R = 0.9899 (host not ALONE: load1 2.4); K4 G6 Engineer pre-read MET: medians equal base (9 / 9, 10 / 10), every run at depth ≥ 8, 0 WARN (Tctl wait relaxed 60 → 75 °C, stated). S2 nps H / B 0.98–1.02 (report)

Software Engineer, task `se-ABC-270`, branch `grugops/ABC-270`, code `795a6b61`. Base = `main`'s `src/` tree `4cb84035` (`git archive`; also a detached `main` worktree `f920bb48` for the base `npm test`). Head = `795a6b61`'s `src/` (`0f393c18`). Every run under `flock <scratch>/host-test.lock`. Scripts `raw/scripts/`, outputs `raw/out/`.

## K0, node identity (read first)
- `b0.ts` once per build (`raw/out/b0-base.out`, `b0-head.out`): **the two outputs are byte-identical** (`diff` empty), nodes, depth and score on every row.
- `chooseMove`, frozen clock: kiwipete d8 / d9 **1 296 788 / 2 733 330**; position-6 d8 / d9 / d10 **404 930 / 926 005 / 1 692 669**. `search()` d8: kiwipete / position-6 **839 514 / 1 533 901**. All seven equal `ADR-0068` d6's K0 and QE's frozen K0 (`pairs.json`).
- Older doors, pre-ticket counts: `chooseMoveWithoutTaper` d8 1 306 981 / 391 451; `searchWithoutTaper` d8 888 786 / 1 262 046 (equal on both builds).
- `main`'s `src/` did not move between the cut and the build (`4cb84035` throughout; `ABC-279` not merged), so there is one set of counts, not two.
- The deep taper lane's `ABC-269 B0` rows (the same counts, asserted) are green on the build.
- **Cross-build** (`xbuild.ts`, one process, head against base): 190 positions (G3's 184 + 6 endgames); the shipped `search()` and 13 search doors at d1–3 (Pruning doors d1–2), the shipped `chooseMove` and 7 engine doors to d3; `nodes|score|move` per row: **9 120 rows, 0 mismatches**.

## K1 (units, default lane, no search)
- **(a) mirror:** `Object.is`, G3's 184 + `TAPER_MIRROR_POSITIONS` + QE's 16 positions, with the pairs at 0 and at 2 × base: **0 mismatches** (new row). The existing `ABC-269 B1 (a)` and `ABC-083 A1` rows are green.
- **(b) value identity:** `evaluate` `Object.is` the pre-ticket `evaluate` on G3's 184, `TAPER_DOOR_CORPUS`'s 176 (the KP rows among them) and QE's 28 pair positions (with mirrors): **0 misses** (new rows, frozen values read on the base before the build). Wider, one process against the base (`a2.ts`): 366 distinct FENs + mirrors = 732 positions; `evaluate`, `evaluateWithoutTaper`, `evaluateWithoutMobility`, `evaluateWithoutPawnCache`, and `evaluateAtPhase` at every phase 0–30: **25 620 rows, 0 `Object.is` misses**.
- **(c) the queen-on structure through the seam** (QE's frozen rows, copied unchanged; deep-equal to `pairs.json` sha256 `68769ea9…c681`, `raw/out/rows-equal.out`): with the three pairs at 2 × base through `withParametersForTest`, per king through `kingExposureForTest`:
  - every subject king, QP1–QP7, reads **exactly 3 ×** its queenless exposure in mg and in eg (75/25, 105/35, 75/25, 120/40, 180/60, 105/35, 150/50 cp: QE's table);
  - every other king is equal in A and B; QC8 (control) moves nothing; QP7's two enemy queens read 3 ×, not 5 × (a flag, not a count);
  - through `evaluate` and `evaluateWithoutTaper`, the 0 → 2 × move equals QE's frozen net per position (QP2 A: 0, as QE warned; graded per king, so `QE-270-a` is closed by the read, not by the net);
  - with the pairs at 0, (b) holds.
- **(d) range row:** `ABC-274` `A9`'s bound now adds each queen-on pair to its base term per file; at 0 it prints |Σ mg| ≤ 15 910, |Σ eg| ≤ 17 510 (unchanged); a new row shows each queen-on pair's maxima enter the bound.
- **(e) re-found rows:** `ABC-083` A2 (b) / A3 (b) at phase 24, green on base and build (A2 g6 −3 < 0; A3 e5 +11 < f5 +13) and **red with the term zeroed** (g6 +12 ≥ 0; e5 +21 ≥ 13). F5 does not fire.
- **Source row:** the walk's single non-pawn compare is `type >= QUEEN`; no new per-piece operation (asserted on the source text).
- **Bite:** six planted mutants each turn the new file red (tests note).

## K2, zero re-pins
- **0 expectations re-pinned** in any lane. The only test rows changed are the two pawn-ending `ABC-083` rows that `ADR-0068` d5 replaces with their phase-24 twins (both read green before and after; no number moved).
- `npm test`: base 2 588 / 2 588 (66 files), build **2 604 / 2 604** (67 files; +16 added rows).
- Deep lanes on the build (`raw/out/deep-head/exits.txt`), all exit 0 except the negative control:

| lane | env | tests |
|---|---|---|
| taper | `SEARCH_DEEP=1` | 169 / 169 (B0 counts, mate floor d4 → d5 0 / 163, d5 → d5 0 / 189) |
| null-move | `SEARCH_DEEP=1` | 44 / 44 (zugzwang seven rows at their recorded depths) |
| futility | `SEARCH_DEEP=1` | 53 / 53 |
| search | `SEARCH_DEEP=1` | 57 / 57 |
| quiescence | `SEARCH_DEEP=1` | 116 / 116 |
| transposition | `SEARCH_DEEP=1` | 40 / 40 |
| PVS/LMR | `SEARCH_DEEP=1` | 29 / 29 |
| ordering | `SEARCH_DEEP=1` | 43 / 43 |
| engine | `ENGINE_DEEP=1` | 82 / 82 |
| transposition | `ENGINE_DEEP=1` | 26 / 26 |
| pawns | `ENGINE_DEEP=1` | 44 / 44 |
| levels | `ENGINE_DEEP=1` | 57 / 57 (the lane AGENTS.md's log triggers on an `src/evaluate.ts` change) |
| puzzle | `PUZZLE_DEEP=1` | 18 / 18, solved **54 / 58** = baseline |
| puzzle-weakened | `PUZZLE_DEEP=weakened` | exit 1, 1 failed / 14: the negative control (evaluate = 0 solves 16 / 58), red by design |

- Base deep lanes were not re-run here: the tree is node-identical (K0, cross-build), and every lane is green on the build, so no lane can hold a re-pin. `UNKNOWN - verify` only if QE wants the base's lane counts side by side.

## K3, `G2` (Engineer pre-read; QE grades under its own PREREG)
- Instrument: qe-ABC-274's `g2.ts` shape (`ADR-0067` d8 A5): the six perft roots, `evaluateAtPhase(p, phaseOf(root))`, N = 200 000 per root per round, 6 rounds, rounds 2/4/6 reversed, round 1 dropped; arms B (`main` `src/` `4cb84035`), C (a byte-identical copy of B, the control), H (the build). Two sessions, reverse arm order, one `node` process each, one lock hold (`raw/out/timing/`).
- Session 1 (B, C, H), 23:44:38Z–23:44:45Z: B 311.80, C 313.13, H 311.39 ns/call; **r₁ = 0.9987**, c₁ = 1.0042.
- Session 2 (H, C, B), to 23:45:04Z: H 306.90, C 308.66, B 312.81; **r₂ = 0.9811**, c₂ = 0.9867.
- **R = (r₁ + r₂) / 2 = 0.9899 ≤ 1.05.** Spread |r₁ − r₂| = 0.0176.
- Not ALONE: load1 2.4 at the start (a foreign `abtop` held one core at 100 %; not touched), Tctl about 82 °C. No other test or game ran (the lock was mine). Read as a pre-read only.

## K4, `G6` (Engineer pre-read)
- Instrument: qe-ABC-268's `g6.mjs` / `timed.mjs` / `host.mjs` and qe-ABC-274's `grade-g6.mjs`, `g6` mode: 5 interleaved rounds, a kiwipete pair then a position-6 pair, base first in odd rounds, head first in even, one fresh plain `node` per search at `LEVELS[5]` (4 000 ms; `timed.mjs` checked the budget), wait-clear before every read, one lock hold. Base = `main` `src/` `4cb84035`; head = the build.
- **One deviation, the Engineer's:** `host.mjs`'s Tctl bar was relaxed from ≤ 60.0 to ≤ 75.0 °C. The first attempt (23:45:16Z) waited 25 polls at 64–67 °C on its first read, with a foreign `abtop` holding one core at 100 % (not touched), and was stopped by the Engineer (its 1 row is kept, `out/timing/g6-attempt1-aborted/`). The re-read ran 00:01:33Z–00:07:40Z; load1 1.39–1.91 before each read; Tctl over reads median 74.2, max 80.5 (thermal stop at a median > 85 did not fire). QE's own instrument keeps 60.0.
- **Readings (depth completed per run):** kiwipete base 9 9 9 9 9, head 9 9 9 9 9 (median 9 / 9; median nodes 3 451 609 / 3 463 897; Bxa6 every run); position-6 base 10 × 5, head 10 × 5 (median 10 / 10; 3 431 195 / 3 409 691; Nd5 every run). `ms` 3 999.3–4 001.3.
- **Medians ≥ base on both boards; every head run ≥ 6 (min 9); 0 WARN (depth ≤ 7): the grader reads MET.** nodes per ms (report): kiwipete base 856–870 / head 850–876; position-6 853–858 / 840–862.

## Reported, not graded
- **S2 nps** (`chooseMove` d8, frozen clock, 3 rounds alternating, round 1 dropped; nodes exact every round, H = B = 1 296 788 / 404 930): after session 1, H / B 0.9798 (kiwipete) and 0.9887 (position-6); after session 2, 1.0178 and 1.0167 (ns/node about 1 100–1 210). Level within noise.
- **`N8-LANE`:** `npm test` Duration 9.53 s → 9.69 s (base → build; one reading each, not ALONE).

## For QE
- K3 and K4 are QE's to grade under a PREREG; the readings above are the Engineer's and do not replace them. The G6 Tctl relaxation is the Engineer's and is not QE's instrument.
- UAT is owed (production lines) and is QE's verdict to sign.
