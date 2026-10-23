---
id: 20261022T190841Z-security-nfr-decision-3a990437
kind: decision
by: security-nfr
at: 2026-10-22T19:08:41Z
verified_by: 
confidence: high on the diff and the by-construction direction; census magnitudes are the SE's until QE A7
refs:
  - ABC-199
  - N8-LANE
  - NFR-008
  - NFR-003
  - NFR-006
  - ADR-0035
  - ADR-0014
  - QE-198-a
  - ABC-178
  - 08d42d01
  - 3d6856db
  - 8c0c5c81
  - 8bd75e46
  - 20261022T190834Z-security-nfr-observation-911ecf9d
  - 20261022T190056Z-software-engineer-observation-c662ec3c
  - 20261022T190056Z-software-engineer-decision-71bb85ca
  - 20261022T185854Z-ba-pm-decision-623c0fed
  - 20261021T082900Z-security-nfr-decision-06c147db
supersedes: 
seal: sha256:fb0dcf6a5fa9250c10e4ea45bfa1af209b93ba43ba974a66cbd93922dbfe770e
---

# ABC-199 A8 ruled: no N8-LANE CPU reading is owed. Result PASS. NFR-003 and NFR-006 catalog cells corrected

Security/NFR, task `security-nfr-ABC-199`, 2026-10-22. The readings are in this task's observation note. Records only. No vitest run and no timing were taken.

## A8: a CPU reading is NOT owed
- **The reason.** `N8-LANE` is a rate limit on the cost a ticket ADDS: "the tests a ticket adds may cost at most 5 % … ≤ 650 ms CPU". The catalog says "every ticket that adds a test file inherits this", and `ADR-0014` d4 and the `OQ-1` ruling say "a rate limit, not a grant". `ABC-199` adds no row, file, spawn or production line. Its only edits are two test parameters that can only lower the work, as the observation shows by construction: a lower node ceiling, and a coarser virtual-clock step. The SE census sizes the drop at 31.4 % and 46.9 % of base nodes. So the charge is ≤ 0 by construction, and a reading could not produce a NOT MET.
- **Precedent.** `security-nfr-ABC-162` (`…06c147db`) ruled the same way: 0 new files, tests and spawns, and "nothing was timed, and nothing needed to be".
- **How to record it.** Write "`N8-LANE`: not read, not owed (charge ≤ 0 by construction)". Never write it MET, because nothing was read.
- **`NFR-008`:** not re-read, as the ticket says. The next full-lane reading after the merge includes this change.
- **Condition (the re-open trigger).** The branch must merge `main` after `ABC-178` lands, and A5 and A6 are re-read on that base. The ruling holds only if that re-read still shows exactly the two hunks: no added `it`, `describe`, file or spawn, no `src/` line outside `*.test.ts`, no `package*.json`, no config and no `timeout`. If the merge-up's conflict resolution in `src/uci-session.test.ts` adds or moves anything else, the ruling is void and returns to Security/NFR. The owner of that check is QE, at the A5 re-read after the merge-up.
- **If it had been owed, the reading would be:** the `ADR-0035` D2 narrow-set CPU on each one-file set, ≤ 650 ms. It would be taken after `ABC-178`'s timing hop. This is recorded only so nobody re-derives it. It is NOT owed.

## Diff scope: confirmed
`08d42d01..3d6856db` touches `src/engine.test.ts` and `src/uci-session.test.ts` only. Nothing in `src/` outside `*.test.ts` changed, and no `package*.json`, config, `tools/` or `AGENTS.md` changed. There are no `timeout` `+` lines. Each hunk sits inside its named `describe`.

## Catalog (`plans/nfr-catalog.md`, mine to edit)
- **`NFR-003` `Verified by`:** "no prompt exists … once EPIC-003 is built" is struck and kept. The dated note says the prompt is `ABC-037`'s `"> "`. The I/O half stays `UNKNOWN - verify`, and its owner is Security/NFR at the measuring hop.
- **`NFR-006` `Verified by`:** "not built yet …" is struck and kept. The cell now reads **MET, 356,526 B against 1,048,576 B (34.0 %)**, on `ABC-093` `A5`'s instrument.
- I hashed all 11 table rows before and after. Only `NFR-003` and `NFR-006` changed. I added one `_Updated` line and one closing section. No target, bar or level moved.

## Result: PASS
- **Required fixes:** none.
- **Accepted risks:** none new.
- **Security:** not triggered (test-only, no ASVS L1 item applies).
- **The gate is not the whole ticket.** QE's A7 (re-plant K1–K4, re-read the censuses) and the post-`ABC-178` merge-up with its A5/A6 re-read are still owed. The ruling above is conditional on that A5 re-read.
- **Board.** No board or trace edit was made at this hop. The trace row is in the done record for the Orchestrator to fold in. I moved no column: the ticket is `In Review` with QE in parallel, and the moves are the Orchestrator's.
