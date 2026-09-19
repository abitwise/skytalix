---
task: wave-2026-09-19
subtask: qe-ABC-034
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-034-rejections-that-teach.md
ref: .grugops/context/qe-ABC-034/
build_ref: .grugops/context/ticket-to-pr-ABC-034/
enqueued_by: orchestrator
enqueued_at: 2026-09-19T18:00:00Z
branch: grugops/qe-ABC-034
base: grugops/wave-2026-09-19 (contains the build 6ee7cde / 3edb161, merged at f16c2a2; lane 42 / 1291 / 0)
---

# Subtask: QE `ABC-034` — break the rejection classifier, or say why it cannot be broken

The build: `src/rejection.ts` (+181), `src/rejection.test.ts` (+345), `src/move-input.ts`
(+10/−11, one call site wiring `PromptOutcome.rejected.messages`), `src/move-input.test.ts`
(+24/−11, six placeholder rows now assert the classifier). Read the Engineer's six notes in
`build_ref:` FIRST — three criteria were INTERPRETED (`A1`'s FEN is a check not a pin; `A7`'s
"nothing else under `src/`" vs the wired call site; `A8`'s placement of `e8=K` / `O-O`), each with
the alternative reading named. Then the ticket's criteria, then the code.

## Do
- Re-run the four gates at the branch tip; report numbers (expect 42 / 1291 / 0 on the merged base).
- Mutation-test the classifier: at minimum (a) swap two reason arms in the `switch`, (b) make the
  set difference `generateMoves \ legalMoves` return the wrong side, (c) drop the case-fold
  variant, (d) return `unreadable` for everything, (e) break the dispatcher call site so
  `messages` carries the old placeholder code, (f) the `ABC-033` observation — a padded lowercase
  line (`"  qh5  "`) never case-folds: is that a defect this ticket's criteria catch, or `ABC-033`'s?
  Each mutant: which rows go RED, or NONE. Revert via `git checkout --`; confirm clean.
- Rule on each of the three interpretations: does the criterion as WRITTEN pass, and if the
  Engineer's reading was the only buildable one, say so — or FAIL it with the row named.
- Every sentence the product now prints (`type e2e4 or Nf3` · `no piece on <sq>` · `<sq> is not
  yours` · `<from> cannot reach <to>` · `exposes your king` · `your king is in check` · `no move
  <san> here`) — verify each reaches the frame's message region through the real
  `assembleFrame` pipeline, hidden count 0, and that `ABC-107`'s new pin
  (`src/frame.overflow-bound.test.ts`) still holds beside it.
- False-sentence check on comments/docblocks in the four touched files (`ABC-114` standard).
- `test-skip-integrity` → `No findings.`; skip count 0.

## Do not
- Do not touch `src/search.ts` / `src/engine.ts` (`ABC-079` live), `src/turn-loop.ts`.
- Do not "fix" the build — FAIL with the mutant and the row named. Do not open `plans/board.md`,
  `AGENTS.md`, `plans/nfr-catalog.md`. Do not rule NFR-008 (the readings were under load 7–19).
- Security/NFR is a SEPARATE hop after yours (the ticket's own threshold fired on a second `src/`
  file); note anything for them, do not do their review.
- No merge, no deploy. Own `git worktree`; commit messages via a UNIQUELY-NAMED scratchpad file
  and `git commit -F`; gates/mutants through a node script (the hook refuses `$?`, `npm run`).

## Publish
PASS or FAIL as a `decision` note (no `finding` admissible), mutants as an `observation` with raw
output, trace row appended, ticket page § QE. Claim by hand per Workflow 17:
`mkdir .grugops/queue/claimed/qe-ABC-034`, move this file in, then out to `done/`.
Report: verdict, mutant table, the three interpretation rulings, gate numbers, sha, numstat.
