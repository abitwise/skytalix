---
id: 20261019T131500Z-qe-e2e-decision-abc171-recheck-verdict-pass-d60ef4d9
kind: decision
by: qe-e2e
task: qe2-ABC-171
at: 2026-10-19T13:15:00Z
verified_by:
confidence: high
refs:
  - ABC-171
  - plans/tickets/ABC-171-the-uci-session-offers-ownbook-and-skill-level.md
  - ABC-168
  - ABC-174
  - NFR-008
  - R-167-1
  - R-167-2
  - QE-171-a
  - QE-171-b
  - QE-171-c
  - QE-171-d
  - QE-171-e
  - QE-171-f
  - QE2-171-g
  - 20261019T121000Z-qe-e2e-decision-abc171-verdict-pass-with-gaps-9d61b7e3
  - 20261019T125000Z-qe-e2e-observation-abc171-rows-and-gates-90488973
  - 20261019T131000Z-qe-e2e-observation-abc171-mutants-443377ed
  - 20261019T124500Z-qe-e2e-observation-abc171-n8-lane-owed-7a2a5442
supersedes: 20261019T121000Z-qe-e2e-decision-abc171-verdict-pass-with-gaps-9d61b7e3
---

# QE re-check of `ABC-171` at `5dee231c` (rows `b62baabc`, code `b6afd021`): **PASS**, with N8-LANE OWED

Hand-authored and unsealed. Nothing was committed to `grugops/ABC-171`, and nothing was pushed or merged. No defect
was fixed, and nothing was self-signed.

I did not touch any of these:
- `src/`, `plans/board.md` or `plans/traceability.md`;
- `../wt-ABC-171` or `../wt-ABC-173`;
- any process I did not start.

## Why PASS
- **The rows:** A8 (reworded) and A13a–d are present, match the page and are green (`…90488973`).
- **The mutants:** the 7 named mutants are killed, each by its intended row. The full set is 94 run, 80 killed. No
  regression; the survivors are the 14 already ruled (`…443377ed`).
- **The gates:** 1962/1962, `success: true`; skips 0, `No findings.`; `merge-tree` against main `68bbf33f` clean. A12
  is the two files, and R-167-1 adds nothing.
- **Production code:** `src/uci-session.ts` is unchanged since the first pass.

## The gaps
| gap | state | why |
|---|---|---|
| QE-171-a (seed oracle) | **CLOSED** | A13a; kills S32 and S33 |
| QE-171-b (book hit at a blunder level) | **CLOSED** | A8 reworded, and A13b; kills S25 and S31 |
| QE-171-c (`nodes`/`mate` dropped line) | **CLOSED** | A13c; kills S38 and S39 |
| QE-171-d (invalid `OwnBook` keeps `true`) | **CLOSED** | A13d; kills S12 |
| QE-171-e (warn → `info string`) | **ACCEPTED for ABC-171, routed to ABC-168** | ABC-168's page already pins the substance: `warn` writes `info string <message>` (Scope 1), and the away-from-clone row writes exactly one book warning. D10's wording `opening book … playing on without it` is not pinned there. That residue is INFO for ABC-168's QE |
| QE-171-f (open readings f1–f4) | **ACCEPTED** | BA/PM ruled f1–f4 ACCEPT with no row (page § QE-171-f). S02, S03 and S07 stay as accepted survivors |

**New gap: QE2-171-g, INFO, routed to ABC-174.** ABC-174's § Pins that move cites the ABC-171 A8 row at
`src/uci-session.test.ts:877-893`. At `5dee231c` that row sits at `:882-897`. Every other pin line checked holds.

## N8-LANE: OWED
The 180 s foreground window was not quiet:
- the `oeselg-labs/platform` workers were present in 181 of 181 polls;
- a `Projects/public/grugops` vitest run started inside the window;
- an ABC-173 SE hop started while this hop ran.

Nothing was timed or estimated (`…7a2a5442`).

## Next column
- **Recommended:** `In Security/NFR`, for the N8-LANE reading, or an owner word like R-167-2's.
- **Then the owner's UAT applies,** because `src/uci-session.ts` is +97/−15 against main.
- The Orchestrator decides.
