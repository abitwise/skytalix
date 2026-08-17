---
id: 20260817T160500Z-software-engineer-observation-abc063-delivered-and-gated-on-the-branch-tip-every-number-measured-643270a5
kind: observation
by: software-engineer
at: 2026-08-17T16:05:00Z
verified_by:
confidence: high
refs:
  - ABC-063
  - src/cli.test.ts
  - src/cli-options.ts
  - plans/tickets/ABC-063-uat16-six-game-verbs-named-in-no-test.md
  - e6697f6
  - 1b4c4bd
supersedes:
---

# `ABC-063` delivered and gated on `grugops/abc063-uat16-six-verbs` — every number below was run, not read

Two commits on the branch, in the order the brief's sequencing trap requires. **Not merged** — the
Orchestrator holds the merge and re-runs the gate on `main`.

## Base

Branched from `main` @ **`2ad1dff`**, not the brief's `39d3c5b`. `2ad1dff` is the board-pull commit
that landed after the queue file was written; **`git diff 39d3c5b 2ad1dff -- src/cli.test.ts` is
empty**, so every anchor the Orchestrator measured against `39d3c5b` holds unchanged at the base I
used. Recorded because the brief names a base and I used a different one.

## Gate on the branch tip (`1b4c4bd`) — `quality.gate_enforcement` is `blocking`

| step | command | result |
| --- | --- | --- |
| unit | `npm test` | **exit 0 — 865 passed (865), 30 files passed (30)**; `src/cli.test.ts` 38 tests, 16 ms |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`, exit 0** |
| lint | `npm run lint` | **exit 0** — `Checked 54 files in 79ms. No fixes applied.` |
| typecheck | `npm run typecheck` | **exit 0** |
| build | `npm run build` | **exit 0** |

Suite went 864 → **865**: exactly one new test, which is the one new `it` block. Working tree clean
at the tip.

## The ticket's own measurements

- **`A1` — case count: 6.** `["--move","e4"]`→`--move`, `["e4"]`→`e4`, `["--new"]`→`--new`,
  `["--undo"]`→`--undo`, `["--resign"]`→`--resign`, `["--quit"]`→`--quit`. Each asserted
  `.ok === false`, `.offending` deep-equal to `[token]`, `.problem` containing `unrecognised`. The
  deep equality on `.offending` is what makes `["--move","e4"]` blame `--move` rather than `e4`.
- **`A2` — list length: exactly 6**, pinned in the test itself
  (`expect(UAT_16, "the command lines UAT-16 names").toHaveLength(6)`). The comment names **UAT-16**
  and the pack folder `.grugops/context/uat-ABC-042-pack/notes/`. `--help` not folded in.
- **`spawned`: 10.** The `N8-LANE` pin at `src/cli.test.ts:933` (`expect(spawned).toBe(10)`) is
  green and untouched; `grep -c "spawnSync(" src/cli.test.ts` is **1** call site. Six pure resolver
  calls, zero new children.
- **`A3` — mutant, BOTH directions.** Mutated `src/cli-options.ts` by appending `"--resign"` to
  `ACCEPTED_ARGUMENTS` (7 elements). `npx vitest run src/cli.test.ts` → **4 failed | 34 passed
  (38)**, and the two the criterion names are both in the failure list:
  - **here** — `src/cli.test.ts:1270` (`ABC-063 — UAT-16's six game verbs, by name`)
  - **at `:435`** — `src/cli.test.ts:436` (`A6(i) — the exported enumeration EQUALS the table`)

  The other two reds are `ABC-066` at `:982` and `ABC-065` at `:1086` — both compare the accepted set
  to a documented list, so they are expected collateral of enlarging it, not a defect. **Reverted**
  from a byte copy: `git diff --stat src/cli-options.ts` empty, `npm test` **865/865 green again**.
- **`A4` — one path.** `git diff --name-only e6697f6~1 e6697f6` → **`src/cli.test.ts`**, and nothing
  else. Zero production lines. Skip 0. The page correction is the separate commit `1b4c4bd`
  (`plans/tickets/ABC-063-...md` alone), exactly as the brief's sequencing ruling requires.

## The one measurement that surprised me, and it changed the delivery

**The six-case loop alone does NOT satisfy `A3`.** Reported in full as a separate `decision` note in
this ref — in short, appending a verb to `ACCEPTED_ARGUMENTS` changes no resolver behaviour, so a
rejection-only block stays green and only `:435` reds. The block therefore also asserts the six
tokens' **absence** from `ACCEPTED_ARGUMENTS`. Without that, `A3`'s "here **and** at `:435`" is
false in the "here" half.

## Fences, checked

Zero production lines. Zero new files. `:435`, `:525`, `:554`, `:630`, `:933` byte-identical — the
delivery appends at the end of the file and moves no anchor. `ABC-062`'s block still starts at
`:1172`, in its own `describe`, untouched. `ABC-042`, `ABC-061`, `ABC-062`, `ABC-066` not re-opened.
The six are transcribed from UAT-16's words, not derived.
