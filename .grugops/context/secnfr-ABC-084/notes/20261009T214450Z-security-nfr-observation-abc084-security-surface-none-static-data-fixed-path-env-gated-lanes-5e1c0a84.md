---
id: 20261009T214450Z-security-nfr-observation-abc084-security-surface-none-static-data-fixed-path-env-gated-lanes-5e1c0a84
kind: observation
by: security-nfr
at: 2026-10-09T21:44:50Z
verified_by:
confidence: high
refs:
  - ABC-084
  - RISK-003
  - src/puzzle-corpus.ts
  - src/puzzle-suite.test.ts
  - src/puzzle-suite.baseline.json
  - src/quiescence.test.ts
  - .grugops/context/ticket-to-pr-ABC-084/notes/20261009T213713Z-software-engineer-decision-abc084-corpus-module-runner-lanes-config-99ac852f.md
supersedes:
---

# `ABC-084` security surface: **none**. Static data, one fixed-path read of a checked-in file, env-gated test lanes. The page's "Security — not triggered" is confirmed

Hand-authored and unsealed (no sanctioned writer on this install; `human_admission` is `off`).
Reviewed: `7b54dae..e426e91 -- src` on `grugops/ABC-084-puzzle-suite`. Checklist filtered to
`security.asvs_level` `L1`; `block_on` `high`; `compliance_regime` `[]`, so no Compliance Officer
hand-off is owed.

## What the diff is

| file | numstat | what it is |
|---|---|---|
| `src/puzzle-corpus.ts` | +113 | Non-test **data** module: two `ReadonlyArray` literals (FEN strings, move labels, source tags) and two types. No function, no I/O, no import except its own types |
| `src/puzzle-suite.test.ts` | +263 | Test file: the runner, the `A6` oracle, the `A4` guard rows, the env-gated deep rows |
| `src/puzzle-suite.baseline.json` | +12 | Checked-in data: counts, budget, step, provenance strings |
| `src/quiescence.test.ts` | +3 / −40 | The 24-row literal replaced by an import of the same rows |

`package.json`, `package-lock.json`, `vitest.config.ts`, `tsconfig.json`, `tools/`: **0 lines**. No
dependency added, removed or moved. `src/engine.ts`, `src/search*.ts`, `src/evaluate*.ts`,
`src/quiescence.ts`, `src/transposition.ts`: **0 lines**.

## No production importer

`grep -rn "puzzle-corpus" src --include=*.ts | grep -v test.ts` returns **nothing**. The data
module is reachable only from two test files, so it is not on `src/cli.ts`'s graph and ships nothing
into the running game.

## L1 items that could apply, each checked against the code

| ASVS L1 | reading | result |
|---|---|---|
| V5.3.2 (file paths from trusted data) | The one read is `readFileSync(new URL("./puzzle-suite.baseline.json", import.meta.url))`: a literal relative path, no input in it | Not applicable / clean |
| V1.3.2 (no dynamic code execution) | `await import("./engine.ts")` is a **literal** specifier; `vi.doMock("./evaluate.ts", …)` is a test-runner mock, reached only under `PUZZLE_DEEP=weakened`. No `eval`, no `Function`, no computed import | Clean |
| V1.2.5 (OS command injection) | No `child_process`, no spawn, no shell | Not applicable |
| V2.2.1 (input validated against limits) | The only external input is `PUZZLE_DEEP` (compared to `"1"` / `"weakened"` by equality; anything else defines no deep row) and the checked-in baseline's `budgetMs` / `stepMs`, which the runner refuses before any search when `!(step >= budgetMs / 1000)` — `NaN` and 0 included. That guard is also the resource-exhaustion bound (`ABC-086` G-QE-2) | Clean; the guard is a real control and has four refusal rows in the default lane |
| V5.2.1 / supply chain | No new file type accepted, no dependency change | Not applicable |

Secrets, auth, personal data, network, public API, file upload, migrations, queues, external
integrations: **none touched.** The puzzle sources are hand-built positions and a rules-only
oracle, not fetched content.

## Two operability notes (not security findings, no severity)

1. **An unrecognised `PUZZLE_DEEP` value is a silent green.** `PUZZLE_DEEP=true` (or `yes`) defines
   no deep row, so the run is the 9 default rows and exits 0 — no puzzle searched. This is the
   project's existing deep-lane convention (the `INPUT_DEEP` line in `AGENTS.md` uses the same
   whole-lane count control), and the Scribe's drafted `AGENTS.md` comment carries the control
   ("12 passed (9 default)", claim `…a9bf6ab2`). **The count is the guard; the Scribe's line must
   keep it.** Owner: the AGENTS.md Scribe (subtask `scribe-abc084-lane`).
2. **The UAT zero-production-lines waiver does not mechanically apply.** `AGENTS.md`'s measured test
   `git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'` lists
   `src/puzzle-corpus.ts` and `src/puzzle-suite.baseline.json`, both test-only data with no
   production importer. The rule says "measured from git, never asserted", so this gate does not
   assert the waiver either way. Owner: the Orchestrator at the `Ready for UAT` exit.
