---
id: 20261101T172756Z-qe-e2e-observation-dede949b
kind: observation
by: qe-e2e
at: 2026-11-01T17:27:56Z
verified_by: 
confidence: high on the plant results as run; QE-254-b/c suggested rows are QE advice, BA/PM decides; deviations disclosed
refs:
  - qe-ABC-254
  - ABC-254
  - EPIC-010
  - ADR-0003
  - ADR-0055
  - ADR-0026
  - NFR-005
  - NFR-004
  - NFR-009
  - NFR-008
  - NFR-001
  - QE-254-a
  - QE-254-b
  - QE-254-c
  - G1
  - G4
  - G5
  - G6
  - G7
  - G8
  - G9
  - grugops/ABC-254
  - 600d8de3
  - fe53dbda
  - 09d1f675
  - grugops/qe-ABC-254
  - 2c0bcbc3
  - 12288266
  - 6d393592
  - qe-ABC-254/20261101T153338Z-qe-e2e-decision-6b25d0a8
  - se-ABC-254/20261101T152313Z-software-engineer-decision-cb525705
  - se-ABC-254/20261101T152313Z-software-engineer-decision-7f5312e8
  - se-ABC-254/20261101T152313Z-software-engineer-observation-4a50887c
  - se-ABC-254/20261101T152313Z-software-engineer-observation-1b77dfbe
  - se-ABC-254/20261101T152325Z-software-engineer-observation-d672f92e
  - src/legal.ts
  - src/legal.test.ts
  - src/gameend.nfr.test.ts
supersedes: 
seal: sha256:dbd98c26e0f570822d89dcde903f304f2c6db2bef16c491830bb493821fbec7e
---

# ABC-254 findings: QE-254-a A4 UNRESOLVED (BLOCKING, re-read owed); QE-254-b the tightened hasLegalMove bar no longer catches a rebuild on the lazy list (LOW); QE-254-c no default-lane row reads quiet promotions in check (LOW); the SE's gameend.nfr edit confirmed

QE/E2E, task `qe-ABC-254`. Plants ran in a scratch copy (`git archive 600d8de3`), never in the worktree. After the plants, `src/legal.ts` was restored and `cmp`-equal to the worktree's. Raw files are in `raw/plants/`.

## The SE's out-of-ticket edit, `src/gameend.nfr.test.ts` (bars 1 → 0 and 8 → 0): ACCEPTABLE, confirmed
- **PL1, the full-filter rebuild** the Orchestrator asked about: `hasLegalMove` → `fullHasLegalMove` and `legalCaptures` → `fullLegalCaptures`. **Both tightened rows turn red.**
  - "hasLegalMove … plays NO move" and "legalCaptures on kiwipete plays none …": 2 failed, 8 passed.
- **PL2, a rebuild on the full list** (the ABC-217 A2 regression as first written): `fullLegalMoves(p).length > 0` and `fullLegalMoves(p).filter(captured)`. 3 rows turn red: both tightened rows and "generateCaptures once and generateMoves never".
- **PL3b:** `legalCaptures` → `legalMoves(p).filter(captured)`. 2 rows turn red, the tightened kiwipete row and the generateMoves row.
- The edit only tightens. Titles and comments say so. The file stays 10/10 at head and in `ENGINE_DEEP`. The fence deviation is test-only and stricter, so I accept it.

## QE-254-a: A4 UNRESOLVED (BLOCKING for merge and for the UAT signature; carrier: Orchestrator, QE re-read)
- Under the pre-registered D3 spread rule (≤ 5 % per build and board, one re-run, then VOID), position-6 and start are **VOID**. Their re-run spreads were 6.9 % (position-6 base) and 6.9 % (start head).
- That leaves two of the three main boards ungraded. kiwipete is valid at **1.115** and the in-check guard position-4 at **1.102**, both above their bars.
- **The cause:** the host was shared all session. A recurring foreign `grugops` vitest ran 20+ min per run, and other sessions' `node` and `git` processes ran at 100–264 % CPU.
  - Every out-of-band run sits in a pair flagged not clear, or in a shared round of the re-run.
  - Every per-round paired ratio on every board is 1.067–1.192 (INFO, post hoc).
- **This is not a speed miss.** No failed-attempt note is written, because nothing graded fell below a bar. It is not a pass either.
- **Owed:** an ALONE A4 re-read on a new PREREG, about 15 min of host time, at a window with no other hop on the host and no foreign vitest.
- **QE's advice for the re-read** is a ruling for BA/PM or the Architect, not QE's: whether D3's spread rule should be read over clear pairs only. Under the present rule, a shared host voids boards that read ≥ 1.10 in every round.

## QE-254-b: the tightened `hasLegalMove` bar does not guard the ABC-217 A2 class against a rebuild on the LAZY list (LOW; carrier BA/PM, test-only follow-up)
- **PL3a:** `hasLegalMove` → `legalMoves(p).length > 0` (lazy list, no early exit).
  - **`gameend.nfr.test.ts` stays 10/10.** The whole default lane stays green, `npm test` 2 368/2 368.
  - At the start position the lazy list plays no `makeMove` either, so the bar of 0 cannot tell the two apart.
- The early exit is worth less now, because out of check the lazy list tests only king, en-passant and pinned moves. So the cost of the regression is small. It is still a regression no row sees.
- **Suggested row:** count cross-module `isSquareAttackedBy` calls on a board where the king's moves come first in generation order and the first one is legal. `hasLegalMove` calls it about twice; a full lazy list calls it once per king move. Which row to add is BA/PM's call.

## QE-254-c: no default-lane row reads `legalCapturesAndQueenPromotions`' quiet promotions in check (LOW; carrier BA/PM, test-only)
- **PQ2:** quiet queen promotions are never tested in check.
  - **The default `legal.test.ts` lane stays 42/42.**
  - The `ENGINE_DEEP` A1 walks catch it (2 red, `kiwipete 20-65 39-22 65-99`), and so does QE's fuzz (988 mismatches).
- The ticket's A1 is a deep-lane criterion and it holds, so this is not a defect.
- A one-position lane row would put the in-check promotion path in the default lane. An example: White in check, with a pawn on the seventh whose push neither blocks nor captures.

## Lazy-logic plants (informative; each read on the default lane and on QE's fuzz at 300 playouts / 30 000 placements)
| plant | default `legal.test.ts` | fuzz mismatches | deep A1 |
|---|---|---|---|
| PQ1, a queen not counted as a pinner | **red** (2: the depth-1 A1 row and a per-move-scan reference row) | 428 | — |
| PQ2, quiet promotions untested in check | green (QE-254-c) | 988 | **red** (2) |
| PQ3, an out-of-check king move tested on its home square | **red** (8, A2 and pre-existing rows) | 26 673 | — |

## Disclosures (deviations from the PREREG, each labelled)
1. The foreign-vitest detector was fixed after the PREREG: it counts only a running `node`/`vitest`, not a `flock` waiter on our lock. The rule did not change (timing note).
2. The first board re-run was aborted at the 45-min cap after 12 runs and is not graded. The graded re-run ran SHARED in rounds 1–2.
3. That re-run was serialized under `host-test.lock` held by my own suspended job (SIGSTOP), not by its own `flock`. Nothing else ran under the lock meanwhile. The suspended driver was terminated afterwards.
4. G6 was read from the A4 schedule (pre-registered and disclosed there).
5. The puzzle lane ran twice more (`--silent=false`, then `--reporter=verbose`), only for its count line. It was 18/18 each time.
6. Not run, outside the PREREG: the `CLI_DEEP`, `UCI_DEEP`, `LADDER_DEEP`, `INPUT_DEEP` and `ZOBRIST_DEEP` lanes. None of them reads `src/legal.ts` beyond what A1 and the engine lanes read. INFO, not a gap.

## Regression risk
- **Low for values.** G4 is byte-equal over about 2.2 × 10⁹ search nodes. The A1 walks cover 803 548 nodes, and QE's fuzz 777 439 nodes biased toward checks, pins, en passant and promotions. The full filters stay in `src/` as the oracle.
- The one piece of new state is a fixed 512 B module scratch, shared by the four filters. It is safe only while no filter calls another filter inside its loop. A comment in `src/legal.ts` says so, but nothing tests it (INFO).
- `ABC-009`'s malformed-castle defect is unchanged (out of scope).
