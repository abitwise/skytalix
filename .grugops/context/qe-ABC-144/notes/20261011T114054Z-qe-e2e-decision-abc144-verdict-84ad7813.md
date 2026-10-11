---
id: 20261011T114054Z-qe-e2e-decision-abc144-verdict-84ad7813
kind: decision
by: qe-e2e
at: 2026-10-11T11:40:54Z
verified_by:
confidence: high
refs:
  - ABC-144
  - ADR-0040
  - ADR-0008
  - ABC-042
  - ABC-143
  - NFR-008
  - N8-LANE
  - vitest.config.ts
  - src/cli.test.ts
  - 20261011T104858Z-software-engineer-decision-abc144-build-k3-as-ruled-a1f4c720
  - 20261011T104858Z-software-engineer-observation-abc144-reds-counts-gates-5b9e2d31
  - 20261011T104858Z-software-engineer-observation-abc144-handoff-what-is-owed-c83e17a9
  - 20261011T114054Z-qe-e2e-observation-abc144-readings-f287edc5
  - 20261011T114054Z-qe-e2e-observation-abc144-pin-plants-21613086
  - 20261011T114054Z-qe-e2e-observation-abc144-gap-register-0f16e7eb
  - 20261011T114054Z-qe-e2e-artifact-ref-abc144-commands-and-probe-f8aab052
supersedes:
---

# QE `ABC-144`: PASS_WITH_GAPS. `A2`, `A6` and `A7` are MET on QE's own readings; 6 INFO gaps, none blocks; `A1`, `A3`, `A4` and `A5` stay with Window B

This note is hand-authored and unsealed. AGENTS.md says no `finding` is admissible on this install, and
the ruling on that is in `…0f16e7eb`.

| item | value |
|---|---|
| subtask | `qe-ABC-144` |
| worktree | session scratchpad `wt-qe-144` (removed at exit) |
| branch | `grugops/ABC-144-cap-test-workers` |
| base | `5ed308a8` |
| code | `d4468fd3` |
| SE tip reviewed | `d675ef42` (no code change after `d4468fd3`) |
| wave tip for the dry-run merge | `9d0fcb96` (code-identical to `6053e92d`; queue and board commits only) |

## Verdict

**PASS_WITH_GAPS.** Every reading is QE's own (`…f287edc5`, `…21613086`). No timing was read or graded.

- **`A2` MET.** `effectiveWorkers: 3` at head, against 7 at base and at the wave tip. It is a fixed
  integer, ≤ 4, and the k the accepted `ADR-0040` addendum rules.
- **`A6` MET within QE's scope:**
  - `isolate: true` resolved;
  - **20 of 20 consecutive green `npm test` runs at head, in 20 total**, each with 7 of 7
    `*.nfr.test.ts` files passing;
  - files 55 = base, tests 1729 = base + 1, 0 skipped, on every run;
  - all 10 opt-in lane configurations collect equal sets;
  - 8 lanes run and exit 0 under the cap;
  - 0 production `src/` lines.
  - Not covered: `LADDER_DEEP=verdict`'s exit is not run (`QE-144-e`), and no lane wall was recorded
    (Window B's).
- **`A7` MET.**
  - The SE's r1, r2, r3, r3b and x1–x4 all reproduce RED, with the SE's messages. The lowerings to 2 and
    3 stay green, as designed.
  - QE's extras: 7 of 11 RED. The survivors are the `projects` route (`QE-144-a`, inert on vitest 3.2.7,
    proven by a leak probe), a hand-typed CLI flag (`QE-144-b`, by design) and an adversarial
    worker-env conditional (`QE-144-c`).
  - No timing or CPU assertion was added.
- **Not graded here, and owed to Window B** (Security/NFR, width 1): `A1`, `A3`, `A4`, `A5`, the
  `AR-N8SPAWN-DRIFT` discharge and the thermal-pressure log.
- **Dry-run merge against `9d0fcb96`.** One append-only conflict, in `plans/traceability.md`
  (`QE-144-d`, a union resolves it). `src/cli.test.ts` auto-merges. The merged tree has 4 gates at 0,
  55 / 1729 = wave + 1, inventory 55 = 55, and `effectiveWorkers` 3. Aborted; nothing committed.
- **Tests:** QE added none.

## Ruling asked for

**The hand-written notes being "unsealed" does not matter.** It is the repository norm (`AGENTS.md`
§ Role / workflow files: no writer, `human_admission` off, no `finding` admissible). No note here claims
a stamp, and QE re-ran every SE number it relies on. Detail in `…0f16e7eb`.

## Exit

- **UAT waiver.** `git diff --name-only 5ed308a8 d675ef42 -- src/ | grep -v '\.test\.ts$'` reads
  empty. On QE's reading the waiver applies (WAIVED, not accepted). It is the Orchestrator's to apply.
- **Next column.** The ticket's own test note 5 routes it from QE to `In Security/NFR` for `A1`–`A5`
  (Window B). It must not reach `Done` before `A1`, `A3` and `A4` are read. That move is the
  Orchestrator's. QE did not touch `plans/board.md` or production `src/`.
- QE has not merged and has not pushed.
