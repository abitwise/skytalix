---
subtask: security-nfr-ABC-213
role: security-nfr
ticket: plans/tickets/ABC-213-a-failed-pgn-save-reports-its-first-error-code-even-when-the-cleanup-also-fails-and-leaves-no-partial-file.md
ref: .grugops/context/security-nfr-ABC-213/
branch: grugops/ABC-213 (41d31b18), worktree ../wt-ABC-213
width: 1 of 3; host on battery — no timing readings
---

# Security/NFR for ABC-213 (ADR-0036 Ruling 2; AR-203-UNLINK)

## Do
- Review the holder change in src/pgn-file.ts (cleanup branch) and the new in-process node:fs test fake (ADR-0036 Ruling 2: its in-process cost — node/heap counts, not wall time).
- Rule on AR-203-UNLINK with QE's evidence (X3 red at base, green at head).
- The writer-child CPU median (page) is a timing item: name it owed to an AC alone window, not a gap.
- Result: PASS / required fixes / accepted risks with severities.

## Fences
- Only ../wt-ABC-213 and /private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sec213/. No src edits. Use read-only context reads (readContext), not render(). Never push, force, amend or rebase; never merge into main; no board edits.

## Publish
- Commit on the branch. Seal notes (task security-nfr-ABC-213). ## Result + trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**PASS_WITH_RISKS** (Security/NFR, 2026-10-24, on `grugops/ABC-213` @ `77d608a8`, from `41d31b18`; records only. No `src/` edit, no timing reading (battery), no `render()`).

- **Required fixes: none.** No ASVS L1 row fails, so no HIGH and nothing goes to the owner.
- **Holder change: MET.** `src/pgn-file.ts` is one hunk, the guarded cleanup unlink. An errno-coded unlink failure is dropped and the first code is reported. A codeless unlink throw still escapes, and so does a codeless first failure (D5). The contract is unchanged: 1 `node:fs` import with the same five bindings, 1 export, no `process.` in code.
- **`ADR-0036`: limb 1 fires by Ruling 2 only.** It reads 0 capability lines, 0 new edges and holders 3 → 3. Limbs 2 and 3 are silent. Instrument output: `sec213/clause-b-dfaa4cdc-41d31b18.txt` (scratch).
- **`AR-203-UNLINK`: CLOSED.**
  - QE: X3 is red at base (`A1` ×2) and green at head. The A5 hand reading goes from exit 70 at base to exit 0 at head, with `PGN not saved: EFBIG`.
  - Re-read independently here: the base holder under the head rows reds exactly `A1` ×2, and head is 24/24.
  - Its leftover-file half does not close. It is carried as `AR-213-PARTIAL`.
- **`AR-203-LANEGAP` (b): CLOSED.** `A2` pins it, and X1 reds it. (a) is unchanged and open (owner: the Orchestrator).
- **Accepted: `AR-213-PARTIAL`, LOW. Owner: the Orchestrator** (the `ADR-0047` D4 dated line states it).
  - On a double fault, a truncated PGN stays in `games/` while the player reads `PGN not saved: <CODE>` (QE-213-e).
  - It needs two OS faults at once. The bytes are product-made, nothing is overwritten, and no L1 row fails.
- **QE-213-a/b/c: no security residual.** They are pinned at `7adc85ac` by probe rows Q7/Q6/Q8. Whether QE light-re-checks them is the Orchestrator's call.
- **QE-213-d: INFO. Owner: the Orchestrator.**
  - The header comment still says the path "is removed", with no condition.
  - That one-line SE edit fires Ruling 2 again, so it needs a records-only Security/NFR short hop.
- **The `node:fs` double: no finding.**
  - Writes are contained. Unarmed, a relative path throws. Armed, a path is re-rooted to the row's `mkdtemp` and removed only by that exact path.
  - The canary goes red before any unarmed write.
  - `isolate: true` keeps the double inside the file.
- **NFR:**
  - `N8-SPAWN` 0. `N8-LANE`: 0 files and 0 spawns. The writer-child block is byte-identical (118 lines, same sha256), so its CPU growth is 0 by construction.
  - In-process cost, as counts: +9 rows on one double over 5 bindings. Peak heap per row is about +2–3 MB (22–23 → 24–26 MB, one-file shape, n = 3). `NFR-010` is not touched.
- **Owed, and not a gap:** the writer child's CPU, median of 5 at base and head. It is a timing item for an AC alone window. A paired one-file `src/pgn.test.ts` CPU read is a recommended ride-along in that window, not owed. The lane inherits `NFR-008` NOT MET under `R-174-1`; it is not re-scored here.
- **Still owed before merge (not this gate's):**
  - `qe-timing-ABC-203` reports first;
  - the `ADR-0047` D4 dated line (`grugops/arch-adr0047-d4-ABC-213` @ `ecdd63b1`) merges with ABC-213.
- **Notes** (`.grugops/context/security-nfr-ABC-213/notes/` on `grugops/ABC-213`, sealed by grugops 2.1.0 `admitAndAppend`, read back as 2):
  - `20261024T085443Z-security-nfr-observation-e5fc2a76` (readings)
  - `20261024T085443Z-security-nfr-decision-62e47c24` (rulings and the result)
- **Not touched:** `src/`, the ADRs, `plans/board.md`, `plans/traceability.md` (the row below is the Orchestrator's to place), the ticket page and the held D4 branch. No column moved. Nothing was pushed or merged.
- **Process note:** one command redirected to `/tmp/null` by mistake, outside the fence. That file was removed at once. Nothing else was written outside `../wt-ABC-213` and `sec213/`.

### Trace row (10 cells, header order)

| ABC-213 (security-nfr) | Security/NFR gate under ADR-0036 Ruling 2: guarded cleanup unlink in src/pgn-file.ts (first code reported; codeless throws still escape); in-process node:fs double in src/pgn.test.ts (rig b′) contained, canaried, file-scoped | EPIC-006 | PGN export (ABC-203, ADR-0047) | ADR-0036 limb 1 fires by Ruling 2 only (0 capability lines, 0 edges, holders 3→3; limbs 2/3 silent); ASVS L1 no row fails; N8-SPAWN 0; N8-LANE 0 files/0 spawns, writer child byte-identical; in-process +9 rows, +2–3 MB heap; AR-203-UNLINK CLOSED; AR-203-LANEGAP (b) CLOSED; AR-213-PARTIAL accepted LOW (Orchestrator); QE-213-d INFO | `grugops/ABC-213` @ `77d608a8` (records only, from `41d31b18`)<br>`.grugops/context/security-nfr-ABC-213/notes/` (…e5fc2a76, …62e47c24) | clause-b instrument dfaa4cdc..41d31b18; X3 re-read in scratch (base holder reds A1 ×2, head 24/24); writer-child block sha identity; heap counts via --logHeapUsage (no timing) | ACCEPTED by QE verdict (…aceaddaf, signed …502866f9) | — | PASS_WITH_RISKS (no required fix); writer-child CPU median owed to an AC alone window (not a gap); merge waits on qe-timing-ABC-203 and the D4 dated line; In Security/NFR → Ready for UAT is the Orchestrator's |
