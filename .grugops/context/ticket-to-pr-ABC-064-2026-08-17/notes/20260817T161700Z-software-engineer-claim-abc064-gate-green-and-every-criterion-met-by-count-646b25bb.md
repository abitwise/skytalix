---
id: 20260817T161700Z-software-engineer-claim-abc064-gate-green-and-every-criterion-met-by-count-646b25bb
kind: claim
by: software-engineer
at: 2026-08-17T16:17:00Z
verified_by:
confidence: high
refs:
  - ABC-064
  - src/cli.test.ts
  - .grugops/test-skips.md
supersedes:
---

# `ABC-064` — the gate on the branch tip, and every criterion met by COUNT

Run on `grugops/abc064-frame-shape-non-default-children` @ `de38f85`. **Not merged** — the
Orchestrator holds the merge and re-runs the gate on `main` after.

`verified_by` is empty because no `finding` is admissible on this install (`AGENTS.md` § "Role /
workflow files"): `context.human_admission` is `off` and no `§14-gate#<id>` stamp can be emitted.
These are numbers I ran and read, recorded as a `claim`.

## The four mandatory gates, plus test integrity

| step | command | exit |
| --- | --- | --- |
| unit | `npm test` | **0** |
| lint | `npm run lint` | **0** |
| typecheck | `npm run typecheck` | **0** |
| build | `npm run build` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **0** — `No findings.` |

- **Suite: 869 passed / 869, on 30 test FILES.** `src/cli.test.ts` alone: **42 passed**, up from 38 —
  the four blocks this ticket adds.
- **Skip count: 0** (`numPendingTests + numTodoTests` from the JSON reporter). `.grugops/test-skips.md`
  was READ, never written — it is human-owned.
- **`spawned` = 10.** The `N8-LANE` pin at `:933` is green and `Object.keys(CHILDREN)` is still 10.
  **Zero new child processes**; all four blocks read captures `ABC-042` already took at module scope.

## Criteria, met out of required

| criterion | required | met | how |
| --- | --- | --- | --- |
| `A1` frame shape | **3 of 3** | **3 of 3** | `white`, `black`, `random` — row count derived from `frameOf(mode, orientation)`, plus exactly one newline after the last row |
| `A2` no cursor control | **3 of 3** | **3 of 3** | zero CSI introducers on each child's stdout, counted not merely absent |
| `A3` status rows | **2 of 2** | **2 of 2** | `black` and `random` byte-identical to the default child's — **measured before asserted**; see the sibling `observation` |
| `A4` `random` never appears | **zero occurrences** | **0 occurrences** | over the WHOLE of stdout, not the board region |
| `A5` nothing else moved | **exactly 1 path** | **1 path** | `git diff --name-only 9957ddf~1 9957ddf` → `src/cli.test.ts`, alone |

`A5` in full: **one path**, **zero production lines** (`+121` lines, all in `src/cli.test.ts`), **zero
new child processes** (`spawned` still `10`), suite green, skip **0**.

## Falsifiability — the part that is not a count

Every criterion was **mutated and observed**, not reasoned about: 8 mutations, 8 reds, each redding
its own target including two vacuous-pass modes. **No criterion of this ticket is unfalsifiable as
written.** The table and the messages are in the sibling `decision` note.

## Base

Branched off `main` @ **`1a806ee`**, not the brief's `base: main @ 6aedb7e`. `1a806ee` is a
board/traceability commit and `git diff --name-only 6aedb7e 1a806ee` touches **no `src/` file**, so
every line anchor the brief supplied holds unchanged at the branch point.

## Not done, deliberately

Not merged. The board was not moved and `plans/traceability.md` was not touched — both are the
Orchestrator's. The twelve blank move-list rows (`B7`) are out of scope and untouched.
