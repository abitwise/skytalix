---
subtask: security-nfr-ABC-212
role: security-nfr
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/security-nfr-ABC-212/
branch: new grugops/security-nfr-ABC-212 from grugops/qe-ABC-212 (052ae3ad), worktree ../wt-security-nfr-ABC-212
width: 1 of 3 (beside bapm-fold-ABC-212, scribe-runbook-ABC-212; records only, no timing reading)
---

# Security/NFR for ABC-212 (levels 6–7; NFR-004 text)

## Do
- Read the QE verdict `qe-ABC-212/…e58d4635` ("Owed by others") and the Orchestrator ruling `qe-ABC-212/…55691ad1`. Review the five production files on the line for security/NFR risk (UCI `Skill Level` 7 answers `isready`/`stop` up to ~32 s late; clamp `HARD_CEILING_MS` 32 000).
- Place the NFR-004 text in `plans/nfr-catalog.md` verbatim from owner `…2c6fa3b1` / Architect `…d2c68ace` item 7, plus the dated line and mechanism line; retire the "a level's budget reaches `HARD_CEILING_MS`" bullet; `AR-NFR004-A` at 32 000, `NFR-009` at 30 s, the `N8-LANE` ruling and `ADR-0036` (b) as owed.
- No bound changes beyond the owner's text — anything else goes back to the Orchestrator as an owner item.
- Result: PASS / required fixes / accepted risks with severities.

## Fences
- Only your worktree and your scratch dir `<scratchpad>/sec212/`. No `src/` edits. Read-only context reads (readContext), not render(). No timing runs. Never push, force, amend or rebase; never merge into main; no board edits. Records: no hostnames, IPs, or personal paths (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task security-nfr-ABC-212). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**PASS_WITH_RISKS** (Security/NFR, 2026-10-24, on `grugops/security-nfr-ABC-212` @ `26f53dec`, from the QE tip `052ae3ad`). Records only, plus one memory reading. No timing reading and no test lane were run, and no `src/` edit was made.

- **Required fixes: none.**
- **`NFR-004` text: PLACED VERBATIM.**
  - The `Target` cell carries the owner's sentence byte for byte (`…2c6fa3b1` item 1, which equals `…d2c68ace` item 7), copied by script from the sealed note. It also carries the dated line and the mechanism line: one clamp, `HARD_CEILING_MS` 32 000, with each level's ceiling held by its budget at least 2 000 ms under it.
  - The old text is struck through and kept.
  - The other eleven rows and the other `NFR-004` cells are byte-identical, hashed.
  - **No bound beyond the owner's text, so no STOP.**
- **Retired, struck and kept:**
  - the "a level's budget reaches `HARD_CEILING_MS`" bullet;
  - the 2026-10-19 sentence "the hardest level is the default and clause A covers it" (OD-212-2 point 6).
  - A pointer paragraph heads the 2026-08-18 `NFR-004` section.
- **`AR-NFR004-A` at 32 000: STANDS, re-accepted with its number. Owner: Security/NFR.**
  - Level 5: max +5 ms, 23 of 30 over 3 000 ms, median +2 ms, inside ≤ 31 ms.
  - The residual above the clamp is reachable only by a raw `chooseMove` call above 32 000, and no surface passes one. Its exact figure is `UNKNOWN - verify`.
  - Level 6 reads max 5 005 ms against 7 000, and level 7 max 30 004 ms against 32 000.
- **`NFR-009` at 30 s: MET.** This is a memory reading, one plain `node --expose-gc` process, the `ABC-081` `A7` instrument.
  - `heapUsed` changed −0.16 MiB and `arrayBuffers` 0, against ≤ 1 MiB each. `arrayBuffers` is 4.13 MiB, against ≤ 16 MiB.
  - The `Map` control moved `heapUsed` by +19.22 MiB, so the instrument is sensitive.
  - If the "no timing runs" fence is read to cover this, discount it and re-take it alone.
- **`ADR-0036` clause (b): DOES NOT FIRE** on any limb (`7727400c..052ae3ad`; canonical instrument, blob `e8607203`).
- **`N8-LANE`: OWED by rule, NOT TAKEN.** Accepted as **`AR-212-LANE`, MEDIUM. Owner: the Orchestrator.**
  - The indicator, from a record read of QE's `last-run.json`: the 9 new `A9` rows in `src/uci-session.test.ts` sum to **1 053.5 ms** against 650 ms. It is not admissible.
  - The `ABC-203` waiver's reason (≤ 0.05 s) does not carry over by itself.
  - The Orchestrator either schedules an admissible reading (base `7727400c`, head the merge) or waives it in writing with this number.
  - The lever if NOT MET is BA/PM's: `A12`'s budget-read arm.
- **ASVS L1: no row fails.**
  - V2.2.1 and V2.1.1 MET: every level input is a closed allow-list grown by two words.
  - V1.3.2 and V1.2.5: limb 3 is silent.
  - V15.1.1 and V15.2.1: no component changed.
- **`SEC-212-a`, LOW. Owner: Architect/Design** (`ADR-0044` D5 worker trigger). UCI answers `isready` and `stop` mid-search up to about 32 s late at level 7 and about 7 s at level 6. This is accepted under OQ-212-3 (`ADR-0045` § AMENDMENT A4).
- **`SEC-212-b`, INFO. Owner: Security/NFR**, at the next catalog hop the Orchestrator routes. The `NFR-004` `Verified by` cell ("not built yet") is stale, and its standing trigger fired. Moving it is a verdict outside this hop's items, so it was not moved.
- **`QE-212-a`** (LOW, Orchestrator) is not re-scored.
- **No HIGH**, so no risk acceptance goes to the owner.
- **Notes** (`.grugops/context/security-nfr-ABC-212/notes/` on the branch, sealed by grugops 2.1.0 `admitAndAppend`, read back as 2, index rendered):
  - `20261024T124433Z-security-nfr-observation-7bc559a1` (readings)
  - `20261024T124433Z-security-nfr-decision-e2c5d6b9` (rulings and the result)
  - The evidence is in `raw/`, with no personal paths.
- **Not touched:** `src/`, the tests, ADRs (`ADR-0044` included), `memory-bank/70-runbook.md`, `plans/board.md`, `plans/traceability.md` (the row below is the Orchestrator's), the ticket page, `AGENTS.md`, and the sibling branches. No column moved. Nothing was pushed or merged.
- **Process note.** The clause (b) instrument was run from main's root, because the fresh worktree has no `node_modules`. It reads git objects only, and it wrote nothing to main's tree.

### Trace row (10 cells, header order)

| ABC-212 (security-nfr) | Security/NFR at the gate: NFR-004 per-level ceiling placed verbatim (owner …2c6fa3b1 item 1 = Architect …d2c68ace item 7) with dated and mechanism lines (one clamp HARD_CEILING_MS 32 000, each level's ceiling held by its budget ≥ 2 000 ms under it); "budget reaches HARD_CEILING_MS" bullet and "hardest level is the default" sentence retired (struck and kept) | EPIC-004 | difficulty levels | NFR-004 Target placed (other 11 rows byte-identical); AR-NFR004-A stands at 32 000 (L5 max +5 ms, 23/30 over, ≤ 31 ms; L6 max 5 005/7 000; L7 max 30 004/32 000); NFR-009 at 30 s MET (heapUsed −0.16 MiB, arrayBuffers 0; Map control +19.22 MiB); N8-LANE owed, AR-212-LANE MEDIUM (Orchestrator), indicator 1 053.5 ms vs 650 ms; ADR-0036 (b) does not fire; ASVS L1 no row fails; SEC-212-a LOW (Architect/Design), SEC-212-b INFO (Security/NFR) | `grugops/security-nfr-ABC-212` @ `26f53dec` (records + one memory reading, from `052ae3ad`)<br>`.grugops/context/security-nfr-ABC-212/notes/` (…7bc559a1, …e2c5d6b9) | NFR-009 reading in plain node --expose-gc (3 s vs 30 s, kiwipete) with a positive control; clause-b.mjs limbs 1–3 on 7727400c..052ae3ad; last-run.json record read (indicator only); row hashes before/after | signed by QE PASS_WITH_GAPS …e58d4635 under …5aaf7cec item 2 | — | PASS_WITH_RISKS (no required fix); merge waits on bapm-fold/scribe-runbook and the Orchestrator's call on AR-212-LANE; In Security/NFR → Ready for UAT is the Orchestrator's |
