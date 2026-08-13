---
id: 20260813T112448Z-software-engineer-observation-ef5190cf
kind: observation
by: software-engineer
at: 2026-08-13T11:24:48Z
verified_by:
confidence: high
refs:
  - ABC-021
  - N8-LANE
  - NFR-002
  - src/turn-loop.ts
  - src/turn-loop.test.ts
supersedes:
---

# The four mandatory gates, as they ran

> **Hand-authored**, per the sibling `decision` notes. **This is an `observation`, NOT a `finding`:**
> there is no §14 gate in this install to issue a `§14-gate#<id>` stamp and `context.human_admission`
> is `off`. These are exit codes and counts I ran and read, published under the honest kind.
> Everything below is on the branch tip `grugops/ticket-to-pr-ABC-021`, on Apple M3 / Node v24.12.0
> / darwin-arm64 — `UNKNOWN - verify` on other hardware.

## Exit codes — all four zero, `quality.gate_enforcement` is `blocking`

```
npm run lint        LINT_EXIT=0        Checked 49 files. Found 2 infos.
npm run typecheck   TYPECHECK_EXIT=0   tsc --noEmit, no output
npm run build       BUILD_EXIT=0       tsc --noEmit, no output
npm test            TEST_EXIT=0        Test Files 28 passed (28) | Tests 814 passed (814)
```

- **The 2 lint infos are the pre-existing `biome.json` migration infos**, unchanged from the
  Orchestrator's `main` baseline, and the file count is unchanged at 49 because no file was added.
- **Lint was green only after ONE autofix pass — reported as it ran, not as it ended.** The first
  `npm run lint` was **1 error**: one `await run({...})` call over the line limit in the new test
  block. Fixed by `npx biome check --write` (formatting only, no behaviour) — **self-fix 1 of 2**,
  `self_fix_attempts` budget not exhausted. Second attempt not needed.

## Suite delta

| | before (`main` `06c5427`) | after |
| --- | --- | --- |
| tests | 807 passed / 807 | **814 passed / 814** |
| test files | 28 | **28** |
| skipped (`numPendingTests + numTodoTests`) | 0 | **0** |

`+7` tests, `+0` files. Skip count read with the AGENTS.md command
(`npx vitest run --reporter=json | jq`), which returned `{"skipped": 0, "total": 814, "passed": 814,
"files": 28}`.

## `PERFT_DEEP` — a RULING, not a gap

**`PERFT_DEEP=1 npx vitest run src/perft.test.ts` was NOT run, because the diff cannot reach the
rules core.** The changed files are `src/turn-loop.ts` and `src/turn-loop.test.ts`; `git diff --stat`
names no other file under `src/`, and neither `moves`, `legal`, `apply` nor `position` is imported
into anything this diff touched except through call sites that already existed and are unchanged.
The FAST perft suite ran anyway as part of `npm test` (24 tests, green, 1180 ms).

## One red on the way, published rather than tidied away

`A3`'s boundary clause failed on its first run — `expected ' ' to contain 'repetition 2 of 3'`. It
was an off-by-one in MY assertion, not in the loop: after four plies the refusal re-emits frame
**5**, not frame 4 (`1 + plies` precede the prompt). Fixed in the test and the fixed test now also
asserts the frame COUNT, so the index cannot drift silently again. **No production line changed to
make it pass.**

## What the numbers do NOT say

- **No wall-clock NFR number is claimed by this hop.** `NFR-002` is enforced here as a CALL-COUNT
  bar, which is the clause `turn-loop.nfr.test.ts` says binds; the timing half is `A17`'s
  out-of-tree instrument and is Security/NFR's at the gate. The claim path adds **zero** derives per
  ply, and the one derive it does add (`keyHistory` on a refused claim) is priced in the
  `decision` note that owns it — it was **not** measured on this hardware at this hop.
- **The lane cost of this hop is `+0` test files.** `ABC-026` is measuring the lane's total at
  `06c5427` concurrently; this branch changes the file count by nothing, so its measurement does not
  need re-taking on account of `ABC-021`.
