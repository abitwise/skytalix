---
subtask: bapm-cut-ABC-176
role: ba-pm
ticket: ABC-176
branch: grugops/bapm-cut-ABC-176 (from ad71aec4)
worktree: ../wt-bapm-cut-ABC-176
commit: 30504eed
---

# Done: ABC-176 cut (XS, P3, Backlog, DoR 10/10)

- **Commit:** `30504eed` on `grugops/bapm-cut-ABC-176`. Not pushed, not merged. Records only. No vitest and no
  timing were run. Nothing in `src/`, `tools/`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md` was touched.
- **Page:** `plans/tickets/ABC-176-a-refused-run-never-reads-as-a-clean-skip-count-or-a-quiet-result-file.md`
- **Notes** (hand-authored and unsealed, because `context-io.ts` is absent): `.grugops/context/bapm-cut-ABC-176/notes/…6d2a8f30`
  (decision) and `…9b4e1c07` (claim, `UNKNOWN - verify`: SEC's "24 files" does not reproduce; the counts are in the note).

## Criteria summary
The refusal arm is the `AGENTS.md` command with its `NODE_OPTIONS` prefix removed. The green arm is the command as spelled.
- `A1`: on the refusal arm, the spelled capture puts no integer on stdout, AND it exits non-zero or names
  `heap-guard: refused`. The gate step then reads `Skip count was not provided`, exit 1. On the green arm it prints one
  integer, exits 0, and the gate reads `No findings.`. This is tighter than the brief: exiting 1 while printing `0` fails.
- `A2`: the OLD verbatim unprefixed text also prints no integer. Feasibility is `UNKNOWN - verify` at step 1. If it
  is infeasible, the ticket goes back to BA/PM to switch to option (a).
- `A3`: `last-run.json` carries the guard's thrown message verbatim and the READ IT query prints it. A "cannot look"
  throw is named the same way. A green file has no such field.
- `A4`: the six `ABC-149` plant rows keep their discrimination, and a seventh "refused" row is added.
- `A5`: `QE-173-f` is fixed, the history pointer is in the skip-count comment, `ABC-109` `A5` holds (≤ 24,576 B,
  233 B headroom), and `ABC-173` `A3` holds (≥ 17 commands, or re-pinned with its reason).
- **Old quotes:** option (b), declared history with a pointer. There are 169 tracked `.grugops/` files plus 1 in `memory-bank/`.
- **Pins:** `ABC-109` `A5`; `ABC-173` `A3`; `ABC-173` `A4` refusal regex; the reporter header (READ IT query and the plant
  table); the `heap-guard.js` header; `RISK-ABC143-01`. Must not move: `ABC-042` `A10`, `ABC-144` `A7`, `ABC-152` `V3`.
- **May touch:** `tools/grugops/heap-guard.js`, `tools/grugops/result-file-reporter.js` (or a new `tools/grugops/`
  helper), `AGENTS.md` lines 144 and 84, and test rows in `src/cli.test.ts`. 0 production `src/` lines, so the UAT
  waiver applies.

## DoR
**10/10.** The one open item is `A2`'s feasibility. It has a stated fallback, so it is a named risk, not a blocker.
The ticket stays in `Backlog`. Board placement is the Orchestrator's. Next free id: **ABC-177**.

## Trace row (for the Orchestrator to append; columns: Ticket | Title | Epic | Feature | NFRs | Code | Tests | UAT | Release | Status)
| ABC-176 | A heap-guard-refused run never reads as a clean skip count or a quiet result file (`SEC-173-1` + `QE-173-d`; owner word `…5c8d2f71`). Cut by BA/PM, subtask `bapm-cut-ABC-176` (`30504eed`) | — | — | test integrity (`quality.test_integrity: warn`); no timing target | `tools/grugops/heap-guard.js` and/or `result-file-reporter.js`; `AGENTS.md` skip-count line + `Test (all)` comment; 0 production `src/` lines | `A1` capture no-integer on refusal; `A2` old text no-integer; `A3` file names refusal; `A4` 7 plant rows; `A5` budget + `ABC-173` `A3` | waived (0 src lines) | — | Backlog (DoR 10/10) |
