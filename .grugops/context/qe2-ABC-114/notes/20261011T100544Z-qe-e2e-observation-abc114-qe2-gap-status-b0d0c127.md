---
id: 20261011T100544Z-qe-e2e-observation-abc114-qe2-gap-status-b0d0c127
kind: observation
by: qe-e2e
role: qe-e2e
task: qe2-ABC-114
at: 2026-10-11T10:05:44Z
verified_by:
confidence: high
refs:
  - ABC-114
  - QE-114-a
  - QE-114-b
  - QE-114-c
  - QE-114-d
  - src/cli.test.ts
  - 20261011T091155Z-qe-e2e-observation-abc114-gap-register-168698b8
  - 20261011T100544Z-qe-e2e-observation-abc114-qe2-readings-8f7529a0
supersedes:
---

# QE 2nd pass `ABC-114`: the gap register at `d60cedb4`, and each new sentence against my runs

This note is hand-authored and unsealed. Every reading cited is in `…8f7529a0`.

## Every new sentence in `54644ee5`, checked

| # | sentence (`src/cli.test.ts`) | my run | holds? |
|---|---|---|---|
| N1 | "this row sits AFTER the initializer row and BEFORE the shorthand row" | source order `:2669` < `:2705` < `:2712` | yes |
| N2 | "On `D3` and `M9` it is the row that speaks, because both leave the initializer row green" | tip: `M9` and `D3` each 1 red, on the count row. The initializer row precedes it and passed. Ablation: `M9` reds the shorthand row; `D3` is 67/67 | yes |
| N3 | "`ORD` (… `tsc`-clean) reds the initializer row, and vitest stops there" | `tsc` 0. Tip, 1 red: the initializer message. The count and shorthand rows do not report | yes |
| N4 | "On `M9` … vitest stops at this row, so the shorthand row's own red is invisible from this file's output" | tip: count row only. Ablation and control: shorthand row red | yes |
| N5 | "`D4` … is `tsc`-clean. Every row of this file stays green on it" | `tsc` 0; tip 67/67 (`main:` 67/67 too) | yes |
| N6 | "On the control `A1` stays green, and the control's only reds are its 2 unrelated `ABC-042` drift rows (`A9`, `A10`)" | control on `D4`: 2 failed / 53, exactly `A9` and `A10`. The same 2 reds appear on the delivered build | yes |

The unchanged lines in the same block also hold on my runs. The `D3` bullet: on the control `A1` is
green, and only the count reds it with 2 binders. The `M9` bullet: the control's shorthand row reds
it, and here the count reds it with 2. And "Delivered → `["history ="]`, 1": the delivered build is
67/67, and the `M9`/`D3` messages show `'history ='` as the delivered binder.

## Status of the register

| id | sev | status at `d60cedb4` | owner |
|---|---|---|---|
| `QE-114-a` | HIGH | **CLOSED.** The "placed BEFORE the other two … any decoy" sentence is gone. N1–N4 replace it and hold on my runs | — |
| `QE-114-b` | LOW | **CLOSED.** "the lane GREEN on this file and on the control" is gone. N5–N6 read per row and hold | — |
| `QE-114-c` | MEDIUM | **OPEN, out of scope here.** The comment still lists `for…in` and `catch (history)` in the remainder, because `A2` mandates them. I did not re-probe either form | BA/PM (queued `bapm-fold-qe114-2026-10-11`) |
| `QE-114-d` | INFO | OPEN. The kept FIFO figures (`:2759`) are still white-only, and the fix did not touch them | Software Engineer, optional |
| `QE-114-e` | INFO | recorded only | — |
| `QE-114-f` | INFO | unchanged; the fix did not touch it | — |
| `QE-114-g` | INFO | `host-protection.js` exit 2 again (`UNKNOWN - verify`). No load timeout this pass: lane 1680/1680 at load ≈4 | — |

No new gap. I found no sixth false sentence in the fix's 9 added lines.
