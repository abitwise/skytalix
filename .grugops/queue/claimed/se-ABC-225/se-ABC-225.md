---
subtask: se-ABC-225
role: software-engineer
ticket: ABC-225
ref: .grugops/context/se-ABC-225/
workflow: agent-factory/workflows/ticket-to-pr (SE hop; QE follows)
branch: new grugops/ABC-225 from main, worktree ../wt-ABC-225
---

# ABC-225: `rating.ts rpair`, an interleaved R pair (tools only)

Build the ticket `plans/tickets/ABC-225-…` exactly: its scope, its acceptance A1–A6, its NFR triggers and its test notes.
Read EPIC-010 § The merge rule, BA/PM `bapm-owner-words-b/…2930f1bd`, the Architect's R/D notes
(`arch-epic008-rd/…0c5d62f4`: opening-paired error, the nps host check) and `tools/rating/rating.ts` with the ADRs it cites
(ADR-0049 d4: no tool paths in records).

## Do
- TDD encouraged. Defaults of `r` and `d` stay byte-identical: prove it with the dry-run / stub-cutechess `cmd.txt`
  comparison, as `se-tools-rating-concurrency` did.
- **A1–A4 by dry run and fixtures only. Don't play the A5 real smoke yourself:** that is QE's, ALONE. Leave A5 and A6
  for QE and say so.
- Gates: lint, typecheck, unit, build (mandatory). `npm test` stays green with its count reported; skips 0.

## Fences
- Edits only in `tools/rating/` plus its tests, the ticket's dated result line, and your context. No `src/` or `data/`
  edits.
- Own `npm ci --ignore-scripts`. Linters only via `npm run …`; never a bare `npx <name>`.
- No real cutechess run. Never push, force, amend or rebase. Never merge into main. No board edits. No host paths.

## Publish
- Seal notes (task `se-ABC-225`) with `at` from `date -u`: the design, each acceptance row's evidence, the gates. Commit on
  your branch. Write `## Result` plus a 10-cell trace row into this brief, then move it and its claim.md to done/.
