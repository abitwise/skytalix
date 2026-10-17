---
id: 20261017T181851Z-qe-e2e-decision-abc158-verdict-d8f8e503
kind: decision
by: qe-e2e
at: 2026-10-17T18:18:51Z
verified_by:
confidence: high
refs:
  - ABC-158
  - AR-1
  - ADR-0036
  - QE-158-a
  - QE-158-b
  - QE-158-c
  - QE-158-d
  - QE-158-e
  - QE-158-f
  - 20261017T180500Z-release-manager-decision-ar1-restated-901f43b6
  - 20261017T181851Z-qe-e2e-observation-abc158-readings-169609b1
  - 20261017T181851Z-qe-e2e-observation-abc158-plants-c6b1b211
  - 20261017T181851Z-qe-e2e-observation-abc158-gap-register-c1de6771
  - 20261017T181851Z-qe-e2e-artifact-ref-abc158-commands-f3551fc8
supersedes:
---

# QE `ABC-158`: PASS_WITH_GAPS. `A1`–`A5` MET on QE's own readings; four LOW and two INFO gaps, none blocking

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install).

| item | value |
|---|---|
| subtask | `qe-ABC-158` |
| reviewed | `grugops/ABC-158-ar1-checks-widened`, tip `cdf4255b`, base `aa37f9cb` (worktree `wt-ABC-158`) |
| agreement | every RM reading and every plant row in `…901f43b6` matches QE's own. The plants are QE's texts, run before any RM harness was read |

## Per criterion

- **`A1` MET.** Checks 1–7 at the tip read `found 0` / `false` / `[true,false,false,false,false]` / exit 0 with
  nothing written / 5a empty / 5b empty / 5c `node:fs` / 5d empty / `node src/cli.ts` / `0` and `0`. That is byte-equal
  to the record (`…readings-169609b1`).
- **`A2` MET, 6 of 6.** G1 → 5a, G2 → 5d, G3 → 5b, G4 → 5b, G5 → 6, G6b → 7. Each is the check the record names.
- **`A3` MET, 6 of 6.** P1 → 5a, P2 → 5a, P3 → 5b, P3b → 5b and 5c, P4 → 5c, P4b → 5a. Each is the check the record
  names.
- **`A4` MET.** Clause (2) reads "**Any of checks 1–7** reads differently from the `A1` table". Clause (1)'s test is
  unchanged: the same (package, advisory id) set comparison, the same coverage of added, removed and empty sets, and
  the same "with the lockfile unchanged". Two editorial changes are logged as `QE-158-e`.
- **`A5` MET.** `git diff --name-only aa37f9cb` lists the RM note and the ticket page only. The numstat over
  `src/ package.json package-lock.json` is empty, and the md5s are unchanged.

## Gates at the tip

`npm run lint` exit 0 (113 files, no fixes). `npm run typecheck` exit 0. `npm run build` exit 0. `npm test` exit 0:
**58 files, 1824/1824**. Skip count **0**. Integrity `--skip-count 0`: `No findings.`

## UAT waiver reading

`git diff --name-only aa37f9cb...cdf4255b | grep -v '\.test\.ts$' | grep '^src/'` is **empty**, and so is the same
command over `cdf4255b~1 cdf4255b`. By its rule, the waiver applies. Applying it is the Orchestrator's job.

## Why not PASS

The ticket's Value line, "the trigger fires on every form that voids the premise", is not true of the delivered
checks. Eight more forms load `nanoid` on the runtime path while checks 1–7 read as recorded (`…plants-c6b1b211`).
Two of them, a `src/` symlink (N2) and `.npmrc` `node-options` (N6), are caught by no instrumented route. The criteria
name the twelve plants and are all met, so this is PASS_WITH_GAPS and not FAIL. Whether `QE-158-b` or `QE-158-d`
promotes a follow-up to `P2` is BA/PM's call.
