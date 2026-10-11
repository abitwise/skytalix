---
id: 20261011T163112Z-software-engineer-observation-abc151-handoff-what-is-owed-de66a3a9
kind: observation
by: software-engineer
at: 2026-10-11T16:31:12Z
verified_by:
confidence: high
refs:
  - ABC-151
  - ABC-152
  - ABC-149
  - ADR-0040
  - NFR-008
  - RISK-ABC144-HEAT
  - RISK-ABC144-FCAP
  - AGENTS.md
supersedes:
---

# SE `ABC-151`: the branch, and what the build does NOT close

This note is hand-authored and unsealed.

- **Branch** `grugops/ABC-151-two-test-workers`, from `grugops/wave-2026-09-25` at `f439c8fd`. The code commit is
  `0035001c`, followed by a record commit (ticket § Delivery, a trace row, these notes, and `../probe/`). It is
  not merged and not pushed.
- **Files:** `vitest.config.ts` (+10/−6) and `src/cli.test.ts` (+8/−5). No other code file. `package.json`,
  `AGENTS.md`, `plans/board.md` and `ADR-0040` are untouched.
- **Board:** the role's `In Development → In Review` move is left to the Orchestrator, as at `ABC-144`.
- **Owed, and not this hop's:**
  - **QE:** re-plant the reds, and read `A1` (`effectiveWorkers` 2 at head, 3 at base);
  - **Security/NFR, width 1, in addendum 2's step order:**
    - `A3` wall (cooled only if warm + R > 9.0 s);
    - `A4` CPU interval below 0;
    - `A5` heat: k = 2 on head first, then k = 3 on the BASE tree. Never use head with `VITEST_MAX_THREADS=3`:
      r3b shows it red by design.
    - `A6`'s 20 consecutive green runs and the opt-in lanes' equal collection.
  - **Scribe:** the `AGENTS.md` worker-cap line, 3 → 2 (`A7`).
- **Merge order.** `ABC-152` merges after this ticket and builds on k = 2. Any `ABC-149` reading in flight
  rebases first (`ADR-0040` d5).
- **Branch overlap.** `ABC-149`'s branch also edits test files. This diff touches only the last `describe` of
  `src/cli.test.ts` and the config. Whether it overlaps textually at merge is `UNKNOWN - verify`.
