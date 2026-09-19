---
task: wave-2026-09-19
subtask: qe-ABC-107
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-107-the-message-region-cannot-show-a-seven-candidate-ambiguity.md
ref: .grugops/context/qe-ABC-107/
build_ref: .grugops/context/ticket-to-pr-ABC-107/
enqueued_by: orchestrator
enqueued_at: 2026-09-19T17:00:00Z
branch: grugops/qe-ABC-107
base: grugops/wave-2026-09-19 (contains the build at a5a9178 / 76ee264)
---

# Subtask: QE `ABC-107` — break the overflow-bound pin, or say why it cannot be broken

The build is one new file, `src/frame.overflow-bound.test.ts` (25 rows, 4 fixtures), zero
production lines, gates green at 41 / 1238 / 0. Read the Software Engineer's four notes in
`build_ref:`, `ADR-0022`, the ticket's `A1'`–`A5`, then the file.

## Do
- Re-run the four gates at the branch tip yourself; report numbers.
- Mutation-test the pin: at minimum (a) `MESSAGE_ROWS` ±1, (b) `markerFor` returning a wrong `N`,
  (c) the ambiguity list truncated in `src/move-input.ts` (the exact failure `ABC-033` `A4` names),
  (d) a candidate dropped from the resolver. Each mutant: which rows go RED, or NONE — and if none,
  that is a finding about the pin. Revert every mutant via `git checkout --`; confirm clean.
- Check each criterion `A1'`–`A5` is asserted by a row that names it, not by a comment.
- Check the file's sentences are true of what it exercises (the project's "false sentence"
  standard — `ABC-114`).
- `test-skip-integrity` → `No findings.`; skip count 0.

## Do not
- Do not touch `src/move-input.ts`, `src/san.ts`, `src/search.ts` (sibling hops `ABC-034`,
  `ABC-079` live). Do not open `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`.
- Do not "fix" the build. A defect is a FAIL verdict with the mutant and the row named; the
  Engineer fixes on a re-hop.
- Do not rule NFR-008: the Engineer's 17 s readings were taken under sibling load and are recorded
  as non-conforming; leave that to the quiet re-measure the Orchestrator owes.
- No merge, no deploy. Own `git worktree`; commit messages via a UNIQUELY-NAMED scratchpad file
  and `git commit -F`; run gates through a node script (the hook refuses `$?`).

## Publish
PASS or FAIL as a `decision` note (no `finding` is admissible — `human_admission` off), mutants as
an `observation` with the raw output, trace row appended, ticket page § QE. Claim by hand per
Workflow 17: `mkdir .grugops/queue/claimed/qe-ABC-107`, move this file in, then out to `done/`.
Report: verdict, mutant table, gate numbers, sha, `git diff --numstat` (expect zero under `src/`).
