---
id: 20261024T124433Z-security-nfr-decision-e2c5d6b9
kind: decision
by: security-nfr
at: 2026-10-24T12:44:33Z
verified_by: 
confidence: high on the placement, clause (b) and NFR-009; N8-LANE owed (UNKNOWN - verify); the residual at 32 000 UNKNOWN - verify
refs:
  - ABC-212
  - security-nfr-ABC-212
  - EPIC-004
  - grugops/security-nfr-ABC-212
  - 052ae3ad
  - d417b07c
  - 7727400c
  - NFR-004
  - NFR-009
  - NFR-008
  - N8-LANE
  - AR-NFR004-A
  - ADR-0036
  - ADR-0045
  - ADR-0044
  - qe-ABC-212/…e58d4635
  - qe-ABC-212/…f9560997
  - qe-ABC-212/…55691ad1
  - owner-word-2026-10-23/…2c6fa3b1
  - arch-design-ABC-212/…d2c68ace
  - plans/nfr-catalog.md
  - 20261024T124433Z-security-nfr-observation-7bc559a1
  - AR-212-LANE
  - SEC-212-a
  - SEC-212-b
  - QE-212-a
  - owner-delegation-2026-10-22/…5aaf7cec
  - qe-timing-ABC-203/…1dc2eccc
supersedes: 
seal: sha256:dabc33b3d82f553df7e82ef64c0002ca76b9074830beb2990889cd09b575119e
---

# Security/NFR on ABC-212: **PASS_WITH_RISKS.** No required fix. NFR-004 placed verbatim; AR-NFR004-A stands at 32 000; NFR-009 MET at 30 s; clause (b) does not fire; N8-LANE owed (AR-212-LANE, MEDIUM, Orchestrator)

ASVS L1, `block_on: high`, `compliance_regime` empty. The readings are in the sibling observation. The catalog text is in `plans/nfr-catalog.md`: the `NFR-004` row, and the last section, on `grugops/security-nfr-ABC-212`.

## 1. The NFR-004 text: placed verbatim, with no bound beyond the owner's
- **The `Target` cell carries the owner's sentence byte for byte** (`…2c6fa3b1` item 1, which equals `…d2c68ace` item 7). It was copied by script from the sealed note. The old text is struck through and kept.
- **The cell also carries** the dated line and the mechanism line: one clamp, `HARD_CEILING_MS` 32 000, with each level's ceiling held by its budget at least 2 000 ms under it.
- **Retired, struck and kept:**
  - the "a level's budget reaches `HARD_CEILING_MS`" bullet;
  - the 2026-10-19 sentence "the hardest level is the default and clause A covers it" (OD-212-2 point 6).
- **Hashes:** `NFR-001`–`NFR-003` and `NFR-005`–`NFR-012` are byte-identical, each hashed before and after. The `NFR-004` cells ID, Category, `Applies to` and `Verified by` are byte-identical too.

## 2. AR-NFR004-A at 32 000: STANDS, re-accepted with its number. Owner: Security/NFR
- **Clause A at the default (level 5):** max +5 ms, 23 of 30 over, median +2 ms (QE `A4`). That is inside ≤ 31 ms.
- **The residual above the clamp** can be reached only by a raw `chooseMove` call with a budget above 32 000. No surface passes one:
  - the CLI passes the level's budget, at most 30 000;
  - UCI uses `min(G, level budget)`.
  - The exact figure at 32 000 is `UNKNOWN - verify`, because it was not read on the real clock.
- **The per-level ceilings are met with about 2 s to spare:** level 6 max 5 005 ms against 7 000, and level 7 max 30 004 ms against 32 000.

## 3. NFR-009 at 30 s: MET
`heapUsed` −0.16 MiB and `arrayBuffers` 0 between a 3 s and a 30 s search, against ≤ 1 MiB each. `arrayBuffers` is 4.13 MiB against ≤ 16 MiB. The `Map` control moved `heapUsed` by +19.22 MiB, so the instrument is sensitive. **This was a memory reading, one plain `node` process, and not a timing reading.** It is the one item this records-only hop measured. It was explicitly Security/NFR's (page § NFR triggers; `…d2c68ace` interaction 8; QE `…e58d4635` "Owed by others"). If the Orchestrator reads the "no timing runs" fence to cover it, discount it and re-take it in an alone window. The verdict does not depend on host quietness: more load means fewer nodes searched.

## 4. N8-LANE: OWED by rule, not taken at this hop. Accepted as **AR-212-LANE, MEDIUM. Owner: the Orchestrator**
- **The indicator:** the 9 new `A9` rows in `src/uci-session.test.ts` sum to 1 053.5 ms. The 7 that search take 144–161 ms each. `N8-LANE` is 650 ms.
- **It is not admissible:** a foreign vitest was live, it is per-test wall, and it has no base twin.
- **The `ABC-203` waiver's reason does not carry over by itself.** That waiver (`…1dc2eccc`) rested on ≤ 0.05 s against 1.065 s of headroom.
- **The Orchestrator's choice:** an admissible reading on `src/uci-session.test.ts` (base `7727400c`, head the merge) in an alone window, or a written waiver that carries this number.
- **The lever if NOT MET** is BA/PM's: `A12`'s budget-read arm. Rows that read the budget without searching cost no search.
- No level moved. It does not block (`block_on: high`; it is not an ASVS row).

## 5. ADR-0036 clause (b): does NOT fire on any limb. No finding.

## 6. Security (ASVS L1): no row fails
- **V2.2.1 and V2.1.1 MET.** Every level input is a closed allow-list grown by two words, and every message states 1–7.
- **V1.3.2 and V1.2.5:** limb 3 is silent.
- **V15.1.1 and V15.2.1:** no component changed.
- **Everything else:** N/A.

## Accepted risks and items
| id | severity | owner | what |
|---|---|---|---|
| `AR-NFR004-A` | (standing) | Security/NFR | re-accepted at 32 000 with its number (§ 2) |
| `AR-212-LANE` | MEDIUM | Orchestrator | the `N8-LANE` reading is owed; the indicator is 1 053.5 ms against 650 ms (§ 4) |
| `SEC-212-a` | LOW | Architect/Design (`ADR-0044` D5 worker trigger) | UCI `isready`/`stop` mid-search are answered up to about 32 s late at level 7 and about 7 s at level 6. Accepted under OQ-212-3 (`ADR-0045` § AMENDMENT A4); a GUI that times out should stay at level 5 or below |
| `SEC-212-b` | INFO | Security/NFR, at the next catalog hop the Orchestrator routes | the `NFR-004` `Verified by` cell ("not built yet") is stale. Its standing trigger fired at this hop. Moving it is a verdict outside this hop's items, so it was not moved |
| `QE-212-a` | LOW | Orchestrator (already accepted `…55691ad1`) | not re-scored |

**No HIGH, so no risk acceptance goes to the owner. Result: PASS_WITH_RISKS.**

**Next:** `In Security/NFR → Ready for UAT` (UAT is already signed by QE under `…5aaf7cec` item 2). That move is the Orchestrator's. The merge waits on the sibling hops (`bapm-fold-ABC-212`, `scribe-runbook-ABC-212`) and on the Orchestrator's call on `AR-212-LANE`.

**Not touched:** `src/`, the tests, ADRs (`ADR-0044` included), `memory-bank/70-runbook.md`, `plans/board.md`, `plans/traceability.md`, the ticket page, `AGENTS.md`. Nothing was pushed or merged.
