---
id: 20261011T104858Z-software-engineer-observation-abc144-handoff-what-is-owed-c83e17a9
kind: observation
by: software-engineer
at: 2026-10-11T10:48:58Z
verified_by:
confidence: high
refs:
  - ABC-144
  - ADR-0040
  - ABC-143
  - ABC-083
  - NFR-008
  - AR-N8SPAWN-DRIFT
supersedes:
---

# SE `ABC-144`: the branch, and what the build does NOT close

- **Branch** `grugops/ABC-144-cap-test-workers`: base `5ed308a8`, code commit `d4468fd3`, then a record commit
  (ticket § Delivery, trace row, these notes). Not merged and not pushed.
- **Files:** `vitest.config.ts` (+18/−3) and `src/cli.test.ts` (+25). No other code file.
  `package.json`, `plans/board.md`, ADRs and `AGENTS.md` are untouched.
- **Board:** the role's `In Development → In Review` move is NOT made. This subtask fences `plans/board.md`,
  so the move is the Orchestrator's.
- **Owed, and not this hop's:**
  - the QE hop;
  - `A6`'s 20 consecutive green runs;
  - the `*_DEEP` lanes' equal collection;
  - Window B (width 1, Security/NFR): `A1`, `A3`, `A4`, `A5`, the `AR-N8SPAWN-DRIFT` discharge, and the
    thermal-pressure log.
- **Merge-order note.** `ABC-143` edits the `A10` hunk of `src/cli.test.ts`. This pin is appended at the
  file's end, and a single `ViteUserConfig` type import is added after line 36. No textual overlap is
  expected. That is `UNKNOWN - verify` at merge.
- **Straddle (`ADR-0040` d5).** Any paired reading whose base and head differ in `vitest.config.ts` (for
  example `ABC-083`'s open `N8-LANE`) must re-base onto this change first.
