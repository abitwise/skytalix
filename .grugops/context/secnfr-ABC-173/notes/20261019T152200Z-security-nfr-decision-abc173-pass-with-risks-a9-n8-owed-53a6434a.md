---
id: 20261019T152200Z-security-nfr-decision-abc173-pass-with-risks-a9-n8-owed-53a6434a
kind: decision
by: security-nfr
task: secnfr-ABC-173
at: 2026-10-19T15:22:00Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-173
  - NFR-008
  - NFR-010
  - ADR-0008
  - ADR-0035
  - R-173-1
  - R-173-2
  - RISK-ABC173-TEARDOWN
  - RISK-ABC173-STATE
  - RISK-ABC173-PUZZLE
  - SEC-173-1
  - SEC-173-2
  - SEC-173-3
  - QE-173-c
  - QE-173-d
  - QE-173-e
  - QE-173-f
  - QE-173-g
  - R-167-2
  - R-171-1
  - 20261019T145500Z-qe-e2e-decision-abc173-verdict-pass-with-gaps-e81b5c27
  - 20261019T151800Z-security-nfr-observation-abc173-triggers-no-new-limb-token-is-flag-only-b5ebba6c
  - 20261019T151900Z-security-nfr-observation-abc173-nfr010-row-and-nfr008-heap-clause-text-bec09225
  - 20261019T152000Z-security-nfr-observation-abc173-a9-and-n8-lane-owed-two-windows-f6b9071f
  - 20261019T152100Z-security-nfr-observation-abc173-named-risks-ruled-and-skip-count-silent-zero-f3757b98
supersedes:
---

# Security/NFR `ABC-173` at `9c97dd23`: **PASS_WITH_RISKS**. `A9` and `N8-LANE` are OWED

Hand-authored and unsealed. This is a `decision`, not a `finding`: no `§14-gate#` or `human:` stamp exists on this
install. Nothing was fixed, committed, pushed or merged. I did not touch `src/`, `plans/board.md`,
`plans/traceability.md`, `plans/nfr-catalog.md`, `../wt-ABC-173`, `../wt-ABC-171`, `../wt-uat-ABC-171`, or any process
I did not start. Scratch worktree `../wt-secnfr-ABC-173` (detached at `9c97dd23`) is removed at the end of this hop.

| item | ruling | evidence |
|---|---|---|
| Triggers: capability | **No new limb.** The guard imports `node:v8` and `node:worker_threads` only. Its effects are a throw and `provide`. The test additions use fs reads, a `typescript` load and `execPath` array-argv children, all present before | `…b5ebba6c` §1 |
| Triggers: `NODE_OPTIONS` injection (`V1.2.5`, `V2.2.1` L1) | **Not possible. Met.** The `CLI_DEEP` token is `^--max-old-space-size=[0-9]+$` or the call throws: by the regex, and by fuzz (200,016 strings, 0 unsafe tokens). It crosses as one argv element, with no shell and `env: {}` | `…b5ebba6c` §2 |
| `NFR-010` row | **Text written. Not applied.** Next free id confirmed | `…bec09225` §A |
| `NFR-008` heap clause | **Text written, with its insertion point. Not applied.** The stale Node/vitest declaration is flagged, not drafted | `…bec09225` §B, §C |
| `A9` (`npm test` wall ≤ 10 s, twin) | **OWED.** Two foreground 180 s windows, foreign in 362 of 362 polls (platform pids 40997 and 50110) | `…f6b9071f` |
| `N8-LANE` (narrow set, base old command / head new) | **OWED.** Same windows | `…f6b9071f` |
| Carry on owner word? | **Yes, both, as R-173-1 / R-173-2 (LOW).** This needs Olger Oeselg's word, because it changes the accepted addendum's "before merge" order. Re-archive the head arm at `9c97dd23` | `…f6b9071f` |
| `RISK-ABC173-TEARDOWN` | **Acceptable, LOW.** Owner Architect/Design | `…f3757b98` |
| `RISK-ABC173-STATE` | **Acceptable, LOW.** Owner Security/NFR. Fail-open residual stated | `…f3757b98` |
| `RISK-ABC173-PUZZLE` | **Acceptable, LOW.** Owner Security/NFR. One wording correction to the addendum | `…f3757b98` |
| `SEC-173-1` | **New, LOW (test integrity).** An unprefixed skip-count capture prints a silent `0`. Not a blocker. Owner word to accept, or a follow-up ticket | `…f3757b98` |
| `SEC-173-2`, `SEC-173-3` | INFO. A mixed-spelling `NODE_OPTIONS` reds the `CLI_DEEP` probe; `npm test` replaces the caller's `NODE_OPTIONS` | `…b5ebba6c` §3 |
| QE gaps `QE-173-c`..`f` | **Concur with QE's routes.** `-d` is `SEC-173-1`'s class | `…e81b5c27` |
| `QE-173-g` | **Required before the second of `ABC-171` / `ABC-173` merges:** every lane, as spelled, on the combined tree (counts and OOM, no timing). Not carriable by word | `…f6b9071f` |

**Required fixes:** none. No ASVS L1 requirement fails, and nothing meets `security.block_on: high`.

**Accepted risks** (each needs the named owner to take it; none is taken by this note):
- **R-173-1** `A9` owed. LOW. Owner: Olger Oeselg, on his word.
- **R-173-2** `N8-LANE` owed. LOW. Owner: Olger Oeselg, on his word.
- **RISK-ABC173-TEARDOWN.** LOW. Owner: Architect/Design.
- **RISK-ABC173-STATE.** LOW. Owner: Security/NFR.
- **RISK-ABC173-PUZZLE.** LOW. Owner: Security/NFR.
- **SEC-173-1**, proposed as `RISK-ABC173-SKIPZERO`. LOW. Owner: Olger Oeselg, or route it to a ticket.

**Next column:** `Ready for UAT` (UAT is waived: 0 production lines) once the Orchestrator brings R-173-1 and R-173-2
to the owner, or once a quiet window yields the readings. Merge also waits on `QE-173-g` if `ABC-171` merges first.
The board move is the Orchestrator's, per this brief.
