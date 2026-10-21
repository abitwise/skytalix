---
id: 20261021T102658Z-ba-pm-decision-f5fcdaf5
kind: decision
by: ba-pm
at: 2026-10-21T10:26:58Z
verified_by: 
confidence: high (base readings at main 69610c5b; the test file and src/book-file.ts are byte-identical to 3ab055f4, so QE's and Security/NFR's cells are cited, not re-taken); TCWD-alone base row and typecheck of the shape UNKNOWN - verify
refs:
  - ABC-184
  - ABC-183
  - ABC-180
  - ABC-162
  - ABC-095
  - ABC-168
  - ABC-161
  - ABC-164
  - ABC-172
  - AR-183-CWDARG
  - AR-180-VALIDATED
  - AR-162-FALLBACK
  - AR-095-CWD
  - QE-183-a
  - QE-183-b
  - V5.3.2
  - ADR-0036
  - EPIC-005
  - NFR-008
  - 69610c5b
  - 3ab055f4
  - 7bd2b54f
  - src/cli.real-engine.test.ts
  - src/book-file.ts
  - plans/tickets/ABC-184-a7-asserts-the-booked-child-spawned-from-neutral.md
  - plans/board.md
  - 20261021T134100Z-security-nfr-decision-41f70925
  - 20261021T134000Z-security-nfr-observation-d5fd47e1
  - 20261021T102200Z-orchestrator-decision-bc2b06ce
  - 20261021T101040Z-qe-e2e-decision-be7c2c82
  - 20261021T101020Z-qe-e2e-observation-cbd50a13
  - 20261021T082210Z-qe-e2e-observation-567002e7
  - 20261021T093500Z-orchestrator-decision-73eb06c5
supersedes: 
seal: sha256:4e0b22e23dd7204184698b2f2424df864ab02f73d1ff9d54f96dc6665e09925b
---

# BA/PM cut for `AR-183-CWDARG` (QE-183-a): `ABC-184`, XS, P3, EPIC-005, DoR 10/10, Ready. Read at `main` `69610c5b`

**Authoritative:** the page `plans/tickets/ABC-184-a7-asserts-the-booked-child-spawned-from-neutral.md`, its `## Scope` and its `## Security / NFR triggers`. This note does not restate them.

- **Base.** `src/cli.real-engine.test.ts` and `src/book-file.ts` at `69610c5b` are byte-identical to `3ab055f4` (`git diff --quiet`). So QE's TCWD cell (`…cbd50a13`) and Security/NFR's FIX cells (`…d5fd47e1`) apply unchanged. They are cited, not re-taken. This hop ran no plant and no test.
- **Id.** `ABC-184` is free: there is no `plans/tickets/ABC-184-*` and no branch. The next free id is `ABC-185`.
- **Fix shape (Security/NFR's `…41f70925` § 2).** `RealChild` gains `readonly cwd: string`, and `spawnNode` returns the argument it passed to `spawnSync`. In A7's `it`, above the stderr detector, `expect(booked.cwd, <msg with AR-183-CWDARG>).toBe(neutral)`. The change adds 0 spawns, 0 tests and 0 production lines, all in one file.
- **Acceptance.** A1: the field grep goes 0 → 1. A2: the label and `booked.cwd` greps go 0 → ≥ 1. A3: a five-row plant table, base vs head:
  - none: green / green;
  - P6f: red / red at the stderr detector;
  - TCWD + P6f: green / red at the new assertion (the close row);
  - TCWD alone: green / red;
  - TMO + P6f: red / red at ABC-183's assertion.

  A4: ABC-183 A1's `grep -B1` is re-read (QE-183-b's standing read). A5: fences in ABC-183 A5's style; `expect(` goes 75 → 76, and nothing moves above `:223`.
- **Close.** QE reads TCWD + P6f red at head with the plant. **Trigger:** as the owner recorded it (`…bc2b06ce`). ABC-168 fires it and ABC-161 does not. On fire, P2, owed before that ticket merges. The ticket is superseded if an earlier ticket edits A7, `spawnReal`, `spawnNode` or `RealChild`.
- **Expected, not measured:** the base column of TCWD alone (11/11), and typecheck of the shape. Both are `UNKNOWN - verify`, read by the SE's gates and QE.
- **ABC-168 owed-item note: not written.** The owed items for ABC-180 and ABC-183 were recorded on the owed ticket's own page and in board `_Updated:` lines, never on ABC-168's page or card. This cut follows that. The Orchestrator decides whether ABC-168 should carry the owed list.
- **For the Orchestrator:** ABC-168 Scope 3 leaves the file for its real-child lane to the Engineer. If that lane reuses `spawnNode` or `RealChild` in this file, ABC-168 carries the fix itself.
- **Board:** one `_Updated:` line, the ABC-184 Ready row, and the Ready header 1/8 → 2/8. Records only, uncommitted on `main`.
