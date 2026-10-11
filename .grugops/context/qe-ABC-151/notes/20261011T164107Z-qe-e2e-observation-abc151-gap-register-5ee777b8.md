---
id: 20261011T164107Z-qe-e2e-observation-abc151-gap-register-5ee777b8
kind: observation
by: qe-e2e
at: 2026-10-11T16:41:07Z
verified_by:
confidence: high
refs:
  - ABC-151
  - ABC-144
  - ABC-149
  - ABC-152
  - ABC-146
  - ADR-0040
  - QE-151-a
  - QE-151-b
  - QE-151-c
  - QE-151-d
  - QE-144-a
  - QE-144-b
  - QE-144-c
  - 20261011T164107Z-qe-e2e-observation-abc151-pin-plants-cb3b04e5
  - 20261011T164107Z-qe-e2e-observation-abc151-readings-6774ed96
supersedes:
---

# QE `ABC-151`: gap register. 1 LOW and 3 INFO. None is an unmet criterion of this build, and none blocks

This note is hand-authored and unsealed. The readings are in `…6774ed96`, and the plants are in `…cb3b04e5`.

| id | severity | owner | gap |
|---|---|---|---|
| `QE-151-a` | **LOW** | BA/PM. Carrier: `ABC-152` (it already re-reads these variable names on vitest 4.1) or a follow-up | **A hex env value raises the cap, and the pin stays green.** vitest 3.2.7 parses `VITEST_MAX_THREADS` / `VITEST_MAX_FORKS` with `Number.parseInt(x)` and no radix, so `0x3` becomes 3. The pin parses with radix 10, so `0x3` becomes 0. Plants: `0x3` resolves 3, `0x8` resolves 8, and the pin is green both times (q11, q11b). At runtime, 3 pool slots ran under `0x3`. **The pin's own title ("no env raises it") is false for this input.** It is pre-existing: the radix-10 parse came with `ABC-144`'s pin, and q11b is green at base too. It is not an `A2` miss, because `A2` asks for the `≤ 2` check, and the check is there. LOW, not INFO: the raise is proven at runtime. Not higher: nobody sets a worker count in hex by accident. **Fix shape:** parse as vitest does, or assert both parses |
| `QE-151-b` | INFO | none (conservative) | **An empty `VITEST_MAX_THREADS=` turns the pin red while the cap is fine** (q13). vitest ignores an empty value (it resolves 2), but the pin reads `NaN`, and `NaN ≤ 2` fails. It fails safe. Recorded so that a red with `expected NaN` is not mistaken for a raise |
| `QE-151-c` | INFO | Orchestrator (at merge) | **Dry-run merges conflict in `plans/traceability.md` only. Each conflict is append against append.** ABC-151 (`fc4ebb33`, plus this QE row) against the wave tip `aa932974`: clean. ABC-151 against `ABC-149`'s branch: one conflict, the `ABC-149 (build)` row against the `ABC-151 (design)` and `(build)` rows. The wave tip against `ABC-149` has the same kind of conflict, without ABC-151. A union resolves each one. `src/cli.test.ts` and `vitest.config.ts` are not touched by `ABC-149` or by the wave since base, so neither conflicts |
| `QE-151-d` | INFO | Security/NFR (window step 5); `ABC-146` for the verdict | **QE did not run the opt-in lanes' exits.** Addendum 2 puts the lanes at step 5 of the width-1 window, and the task fenced timing to that window. QE read collection only, and all 10 configurations collect equal (`…6774ed96`). `A6`'s "exits 0" for `PERFT_DEEP`, `SEARCH_DEEP`, `ENGINE_DEEP`, `INPUT_DEEP`, `ZOBRIST_DEEP`, `PUZZLE_DEEP`, `CLI_DEEP` and `LADDER_DEEP=1` is still owed. `LADDER_DEEP=verdict`'s exit stays `ABC-146`'s, as `QE-144-e` says |

## Carried from `qe-ABC-144`, still standing, not re-graded

- **`QE-144-a`** (the pin does not read `test.projects`). Not re-run: this diff does not touch the route. Its
  trigger is a vitest bump, which is `ABC-152`.
- **`QE-144-b`** (a hand-typed `--maxWorkers` is unseen). q9 is green again at k = 2: the same route, by design.
- **`QE-144-c`** (a config conditioned on `VITEST_WORKER_ID`). Not re-run: this diff does not touch it.

## Owed, and not gaps of this build

- **Security/NFR, width 1, in addendum 2's step order:** `A3` (wall), `A4` (CPU interval), `A5` (heat), and the
  lanes' exits and walls (`QE-151-d`). QE read and graded **no** timing, CPU or heat.
- **The Scribe (`A7`):** `AGENTS.md`'s worker-cap line still reads `test.maxWorkers: 3` and `VITEST_MAX_THREADS`
  ≤ 3, at head and at the wave tip. `AGENTS.md` is 24,474 B at head (budget 24,576 B).
- **`NFR-008`'s row** is unchanged at head. That is as `A7` requires, unless `A3` goes to the owner.
