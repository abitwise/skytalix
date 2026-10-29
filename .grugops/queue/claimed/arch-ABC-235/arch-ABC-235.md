---
subtask: arch-ABC-235
role: architect-design
ticket: ABC-235
ref: .grugops/context/arch-ABC-235/
branch: new grugops/arch-ABC-235 from main, worktree ../wt-arch-ABC-235
---

# ABC-235 design step: confirm which of ABC-227's six cuts are value-identical, and how to prove it

## Read
- `plans/tickets/ABC-235-…` (scope, acceptance, Dependencies: "Architect/Design confirms value-identity at design").
- SE `se-ABC-227/…7175ebdf` (A1–A5 and the six named cuts) and `…e56997fd` (method); `raw/analysis.txt`.
- EPIC-010 (S2 for value-identical changes; the G9 gate) and the ADRs touching move generation, legality, evaluation
  and ordering. The ABC-206 precedent (legality only for captures) and its proof.

## Do
- For each of the six cuts, rule:
  - **value-identical** (same move, order, scores and node counts on every position): yes / no / conditional;
  - what could break that (tie order, ep, castling through check, promotion, pins, PST symmetry, hash keys);
  - the proof it owes (perft, node-count equality on the fixed boards, a bench of N positions with byte-equal
    `chooseMove` traces, and so on);
  - its expected share from ABC-227 (not a speed-up claim).
- Recommend the order and the split. If the ticket's M is too much for all confirmed cuts, say where to split it.
- Name any ADR needed (none expected). Name the gate set for the SE: the mandatory gates plus the value-identity proof.

## Fences
- Records only: your context plus an ADR if one is needed. No `src/`, `data/`, `tools/`, ticket, epic or board edits.
  Short single-process probes are allowed (under 5 min of CPU, only when no cutechess is running; match the process
  name, not the command text). Never push, force, amend or rebase. Never merge into main. Linters only via `npm run …`.

## Publish
- Seal notes (task `arch-ABC-235`) with `at` from `date -u`: the per-cut ruling and the gate set. Commit on your branch.
  Write `## Result` plus a 10-cell trace row into this brief, then move it and its claim.md to done/.
