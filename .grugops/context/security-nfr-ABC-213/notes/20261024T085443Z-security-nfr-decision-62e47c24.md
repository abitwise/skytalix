---
id: 20261024T085443Z-security-nfr-decision-62e47c24
kind: decision
by: security-nfr
at: 2026-10-24T08:54:43Z
verified_by: 
confidence: high: rulings on the sibling observation and QE/SE notes; no ASVS L1 row fails
refs:
  - security-nfr-ABC-213
  - ABC-213
  - EPIC-006
  - ABC-203
  - AR-203-UNLINK
  - AR-203-LANEGAP
  - AR-213-PARTIAL
  - QE-213-a
  - QE-213-b
  - QE-213-c
  - QE-213-d
  - QE-213-e
  - ADR-0036
  - ADR-0047
  - ADR-0015
  - NFR-008
  - NFR-010
  - R-174-1
  - grugops/ABC-213
  - 41d31b18
  - 7adc85ac
  - dfaa4cdc
  - src/pgn-file.ts
  - src/pgn.test.ts
  - qe-ABC-213/20261024T084131Z-qe-e2e-decision-aceaddaf
  - qe-ABC-213/20261024T084131Z-qe-e2e-observation-1bb1938c
  - qe-ABC-213/20261024T084131Z-qe-e2e-observation-cd83ece0
  - se-ABC-213-probe-rows/20261024T084630Z-software-engineer-decision-6f71057f
  - se-ABC-213-probe-rows/20261024T084630Z-software-engineer-observation-47f04206
  - se-ABC-213-probe-rows/20261024T084630Z-software-engineer-observation-e3ee9c45
  - security-nfr-ABC-203/20261023T211544Z-security-nfr-decision-eaaa1133
  - qe-ABC-213/20261024T090500Z-orchestrator-decision-502866f9
supersedes: 
seal: sha256:3bcba1045b9c98afcc6b4e3707e1872ee6cc20ed730663100a83bb4eacdc589a
---

# ABC-213 Security/NFR result: PASS_WITH_RISKS. No required fix. AR-203-UNLINK CLOSED (exit-code half fixed; leftover-file half narrowed to AR-213-PARTIAL, LOW, owner Orchestrator). AR-203-LANEGAP (b) CLOSED. Writer-child CPU median owed to an AC alone window, not a gap

Security/NFR, task `security-nfr-ABC-213`, on `grugops/ABC-213` @ `41d31b18`. Readings: the sibling observation of this task. Inputs: QE `qe-ABC-213/…aceaddaf` (PASS_WITH_GAPS), `…1bb1938c`, `…cd83ece0`; SE `se-ABC-213-probe-rows/…6f71057f`, `…47f04206`, `…e3ee9c45`; prior gate `security-nfr-ABC-203/…eaaa1133` § 5.

## Result: PASS_WITH_RISKS
- **Required fixes: none.** No ASVS L1 row fails, so no HIGH (`block_on: high`); nothing goes to the owner.

## Rulings
1. **`AR-203-UNLINK`: CLOSED** on its stated condition (`…eaaa1133` § 5: QE reads the plant red then green). QE: X3 reds `A1` x2 at base, green at head; A5 by hand base exit 70 -> head exit 0, stderr exactly `PGN not saved: EFBIG\n`. Re-read here independently: base holder under head rows reds exactly `A1` x2; head 24/24. `ADR-0047` D5 holds on the double fault, and a codeless unlink throw still escapes (A3, X5 reds it).
   - **What does not close with it:** the risk's second half, "a leftover partial file" (`…eaaa1133` § 5 "Reach"). On a double fault the file stays (QE-213-e; A5 head: 1 file). That is now the ruled reading of D4/D5 (best-effort removal), carried as item 3.
2. **`AR-203-LANEGAP` (b): CLOSED.** "No partial file" on a single fault is pinned by `A2` (write after one real byte, and close), and X1 reds `A2` x2. `AR-203-LANEGAP` (a) is unchanged and stays open (owner Orchestrator; ride-along trigger on the page).
3. **ACCEPTED: `AR-213-PARTIAL`, LOW. Owner: the Orchestrator** (Architect/Design writes the `ADR-0047` D4 dated line that states it).
   - On a write/close failure followed by an errno-coded unlink failure, a truncated PGN stays in `games/` under a valid name while the player reads `PGN not saved: <CODE>`.
   - LOW: it needs two OS faults at once; the file holds only product-made PGN bytes, inside the clone; nothing is overwritten (the next save takes `-2`, `"wx"`); the player is told the save failed; no L1 row fails.
   - Trigger to revisit: a report of a truncated file being taken for a saved game, or any ticket that changes D4's cleanup.
4. **QE-213-a, -b, -c: no security residual.** Pinned at `7adc85ac` by probe rows Q7/Q6/Q8 (SE: each reds only under its own plant; head 24/24, re-read here at `41d31b18`). Q7 matters most: it pins that the cleanup removes only the path this call created, never the owner's earlier game. A QE light re-check of `7adc85ac` (`…502866f9`) is the Orchestrator's call; it is not owed to this gate.
5. **QE-213-d: INFO. Owner: the Orchestrator** (route the one-line SE header edit with the D4 dated line). The holder header (lines 15-16) states the removal unconditionally; the code is correct. Under `ADR-0036` Ruling 2 that comment-only edit FIRES limb 1 again: it needs a Security/NFR short hop, records-only (clause-b instrument, 0 capability lines expected), not a re-review.
6. **The `node:fs` double (rig (b′)): no finding.** Writes are contained (unarmed relative paths throw; armed paths re-root to the row's `mkdtemp`; removal only by that exact path), the canary reds before any unarmed write, and `isolate: true` keeps the double inside `src/pgn.test.ts`. No product source is replaced.
7. **`ADR-0036` Ruling 2: fires by Ruling 2 only**, as predicted. 0 capability lines, 0 new edges, holders 3 -> 3, limbs 2 and 3 silent. No `§ Decision 3` re-arm (no new holder, no new caller value).

## NFR
- **`N8-SPAWN`: 0** (1 `spawnSync(` site, unchanged). **`N8-LANE`:** 0 files, 0 spawns; the writer child is byte-identical (118-line block, same sha256), so its CPU growth is 0 by construction.
- **In-process cost (Ruling 2 look, counts):** +9 rows on one hoisted double over 5 bindings; heap peak per row +2-3 MB (22-23 -> 24-26 MB, one-file shape). `NFR-010` (Σ `heap_size_limit`) not touched. No page bar fires on it.
- **Owed, timing, to an AC alone window (not a gap):** the writer child's CPU, median of 5 at base and head (page § NFR triggers). Recommended ride-along in the same window, not owed: a paired one-file `src/pgn.test.ts` CPU read at base and head, which turns the Architect's indicative +0.07 s into a reading. The lane already inherits `NFR-008` NOT MET under `R-174-1` (owner's, MEDIUM); this gate does not re-score it.

## Still owed before merge (not this gate's)
- `qe-timing-ABC-203` reports first (page DoR row 5).
- The `ADR-0047` D4 dated line (held branch `grugops/arch-adr0047-d4-ABC-213` @ `ecdd63b1`) merges with ABC-213; it now also states `AR-213-PARTIAL`.
- The writer-child CPU median (AC alone window).
- Board move `In Security/NFR -> Ready for UAT` and the trace row: the Orchestrator's. UAT is already signed by QE's verdict (`…502866f9`).
