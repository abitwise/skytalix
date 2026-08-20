---
task: repair-ABC-115-2026-08-21
subtask: repair-abc115
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-115-piped-session-dies-on-epipe-with-the-refusal-exit-code.md
ref: .grugops/context/repair-ABC-115-2026-08-21/
enqueued_by: orchestrator
enqueued_at: 2026-08-21T03:30:00Z
branch: grugops/abc115-repair
base: grugops/abc115-residuals @ 92ccec5
---

# Subtask: REPAIR `ABC-115` — close both QE defects, then it can go back to `In Review`

**Branch off `grugops/abc115-residuals` @ `92ccec5`, NOT `main`.** Nine branches are stacked unmerged.

`ABC-115` was FAILED back to `In Development` by QE/E2E with two defects. **Both are now ruled and
both are yours to close. No new production line is expected — `A10` adds zero.**

## Defect 1 — `A10`: the re-throw branch is guarded by nothing
BA/PM re-measured QE's claim, found it holds **wider** than QE stated (delete the `code !== "EPIPE"`
test and all 40 files stay green, not just `cli.test.ts`), and wrote **`A10`** on the page. Read the
criterion and the `## Residual ruling` section for the instrument they measured and handed over,
**including the trap they named** — the wrapper exits `0` on every build, so the status must be read
from the `NODE_EXIT=` line, not from the child's own status.

`A10` asserts only **non-zero status AND non-empty stderr**. **Do not pin a status literal, an errno
or a byte count** — pinning the delivered `1` would pin the `USAGE_EXIT_CODE` collision this project
does not endorse. **Watch `A10` red against the deleted-token mutant, not against `main`** — the same
species of mistake `A9` already taught this ticket, and `A10` does not red against `main` at all.

## Defect 2 — `G-QE115-2`: a false sentence in your own test file
`src/cli.test.ts` still carries the **superseded** `≤ 0.5 s added CPU` clause and the sentence
*"THE CPU CLAUSE IS BREACHED AND IT IS SAID HERE RATHER THAN SHIPPED QUIETLY"*. The budget ruling
re-derived that clause and never reached the code, so the tree announces a breach that no longer
exists — in a comment block that cites `ABC-114` twice. Correct it to the clause now in force
(`≤ 7 added children`, `≤ 2.0 s wall`, **`≤ 0.30 s CPU per added child`**). Touch no assertion.

## Cost fences, now in force — re-measure, do not quote
- `N8-SPAWN`: **≤ 7 added children** (raised from 6 to pay for `A10`; pin **23 → 24**, and the pin is
  written as its derivation, not as a literal — `ADR-0009` clause 9a bars a literal equal to the
  frame height), **≤ 2.0 s wall**, **≤ 0.30 s CPU per added child**, on the paired-run lane
  instrument the budget ruling defines. **If you exceed any clause, STOP and report** — do not
  absorb it, do not restate the clause.
- Zero new `spawnSync` call sites; use the existing `childOf` helper. `src/cli.test.ts:1480-1485`
  pins that.

## Fences
- **Do not touch `src/cli.ts`'s delivered fix** — the 13 production lines are gated and verified.
- Do not touch `ADR-0016`, `AGENTS.md`, `plans/nfr-catalog.md`, or any other ticket.
- Do not re-open the exit code, the CPU clause, or the count ceiling. All three are ruled.
- **Do not widen the fix to handle the accepted residual** — the non-`EPIPE` path exiting `1` and
  disclosing the checkout path is a KNOWINGLY ACCEPTED residual with a pre-registered cut trigger.
- Run all four mandatory gates and report measured numbers. `self_fix_attempts` is 2, then stop.
- Report lane cost; do not grade it. Do not merge, do not deploy.

## Board
On a green repair, make your own `In Development` → `In Review` move — **this time it is genuinely
yours**, the breach that withheld it last time is ruled away. If anything is not green, leave it in
`In Development` and say why, exactly as you did before.

## Publish
Typed notes per Workflow 16 into `ref:`, hand-authored per `agent-factory/contracts/context-note.md`
(no `finding` — `human_admission` is `off`). Append your `plans/traceability.md` row with the test
evidence. Claim by hand per Workflow 17: bare `mkdir .grugops/queue/claimed/repair-abc115`, move
this file in, then out to `done/`. Work in your own `git worktree`. Commit on `grugops/abc115-repair`.
