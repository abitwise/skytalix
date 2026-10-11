---
id: 20261011T164107Z-qe-e2e-decision-abc151-verdict-333ce1b6
kind: decision
by: qe-e2e
at: 2026-10-11T16:41:07Z
verified_by:
confidence: high
refs:
  - ABC-151
  - ABC-144
  - ABC-149
  - ABC-152
  - ADR-0040
  - ADR-0008
  - NFR-008
  - N8-LANE
  - vitest.config.ts
  - src/cli.test.ts
  - 20261011T163112Z-software-engineer-decision-abc151-build-k2-as-addendum-2-rules-586f20f4
  - 20261011T163112Z-software-engineer-observation-abc151-reds-counts-gates-d73145f6
  - 20261011T163112Z-software-engineer-observation-abc151-handoff-what-is-owed-de66a3a9
  - 20261011T164107Z-qe-e2e-observation-abc151-readings-6774ed96
  - 20261011T164107Z-qe-e2e-observation-abc151-pin-plants-cb3b04e5
  - 20261011T164107Z-qe-e2e-observation-abc151-gap-register-5ee777b8
  - 20261011T164107Z-qe-e2e-artifact-ref-abc151-commands-and-probe-43898bdd
supersedes:
---

# QE `ABC-151`: PASS_WITH_GAPS. `A1` and `A2` are MET, and so is QE's part of `A6`; 1 LOW and 3 INFO gaps, none blocks; `A3`, `A4`, `A5` and the lanes' exits stay with the window

This note is hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install, and
`qe-ABC-144` `…0f16e7eb` has the ruling on unsealed notes, which still applies).

| item | value |
|---|---|
| subtask | `qe-ABC-151` |
| worktree | session scratchpad `wt-qe-151` |
| branch | `grugops/ABC-151-two-test-workers` |
| base | `f439c8fd` |
| code | `0035001c` |
| SE tip reviewed | `fc4ebb33` (no code change after `0035001c`) |
| wave tip for the dry-run merge | `aa932974` (queue and board commits only since base) |

## Verdict

**PASS_WITH_GAPS.** Every reading is QE's own (`…6774ed96`, `…cb3b04e5`). No timing, CPU or heat was read or
graded.

- **`A1` MET.**
  - The config's `test` holds `pool: "threads"` and `maxWorkers: 2`. There is no `isolate` key and no
    `poolOptions`.
  - `resolved-workers.mjs` reads `effectiveWorkers` **2 at head and 3 at base**, with `isolate: true`.
  - Cross-checked at runtime: the runner used 2 pool slots at head and 3 at base.
- **`A2` MET.**
  - The pin has `toBe(2)`, an env check of `≤ 2` for both variables, and titles that say 2.
  - QE re-planted every red, each on a fresh copy:
    - r1, r2, r3, r3b (`VITEST_MAX_THREADS=3`) and `maxWorkers: 3` are all **RED**, with the SE's messages;
    - `=2` and `=1` stay green.
  - QE's 19 extras: 15 are RED as designed. `0x3` and `0x8` survive (`QE-151-a`). The empty value is a false red
    (`QE-151-b`). The CLI flag is the known `QE-144-b`.
- **`A6` MET within QE's scope:**
  - `isolate: true` resolved;
  - **20 of 20 consecutive green `npm test` at head, in 20 runs total**, each with 7 of 7 `*.nfr` files passing;
  - files 56 and tests 1740, **both equal to base**, with 0 skipped on every run;
  - all 10 opt-in lane configurations collect the same files and tests as base; only the renamed pin id differs;
  - 0 production `src/` lines.
  - **Not covered:** the lanes' exits and walls are window step 5 (`QE-151-d`), and `LADDER_DEEP=verdict` is
    `ABC-146`'s.
- **`A7`, the parts that exist at this hop:**
  - the addendum states decision 4 at k = 2: sets of ≤ 2 files carry over, and no recorded `F` moves;
  - the config header names the owner's pick and addendum 2;
  - `NFR-008`'s row is unchanged (`plans/nfr-catalog.md` is not in the diff).
  - **Owed to the Scribe:** the `AGENTS.md` worker-cap line still says 3. `AGENTS.md` is 24,474 B.
- **Not graded here, and owed to Security/NFR's width-1 window, in addendum 2's step order:** `A3`, `A4`, `A5`
  and the lanes' exits.
- **Dry-run merge.**
  - **Against `aa932974`:** clean, and the merged tree is green (4 gates at 0, 56 / 1740, `effectiveWorkers` 2).
    Aborted; nothing was committed.
  - **Against `ABC-149`:** one append-only conflict, in `plans/traceability.md` (`QE-151-c`). A union resolves
    it, and the union tree is green. **There is no `src/cli.test.ts` overlap**: `ABC-149` touches only the
    reporter.
- **Tests:** QE added none to the repository.

## Gaps (`…5ee777b8`)

| id | severity | one line |
|---|---|---|
| `QE-151-a` | LOW | A hex env value (`0x3`, `0x8`) raises the cap with the pin green, because vitest parses with no radix and the pin with radix 10. Pre-existing since `ABC-144`. Proposed carrier: `ABC-152` |
| `QE-151-b` | INFO | An empty `VITEST_MAX_THREADS=` gives a false red (`NaN`). It fails safe |
| `QE-151-c` | INFO | Traceability append against append with `ABC-149`. A union resolves it, at merge |
| `QE-151-d` | INFO | The lanes' exits are not run by QE. They are window step 5 |

## Exit

- **UAT waiver.** `git diff --name-only f439c8fd fc4ebb33 | grep -v '\.test\.ts$' | grep '^src/'` reads empty. On
  QE's reading the waiver applies (WAIVED, not accepted). Applying it is the Orchestrator's.
- **Next column.** By test note 4, the route is QE, then `In Security/NFR` for the width-1 window (`A3`, `A4`,
  `A5`, then the lanes). The ticket must not reach `Done` before `A3` and `A4` are read. A head over W, or a CPU
  interval not wholly below 0, holds for the owner's word. The move is the Orchestrator's. QE did not touch
  `plans/board.md` or production `src/`.
- QE has not merged and has not pushed.
