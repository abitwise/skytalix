---
task: wave-2026-09-19
subtask: ticket-to-pr-ABC-118
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-118-a-type-valid-exclude-glob-silently-changes-what-the-lane-collects.md
ref: .grugops/context/ticket-to-pr-ABC-118/
enqueued_by: orchestrator
enqueued_at: 2026-09-20T05:00:00Z
branch: grugops/ABC-118-lane-inventory
base: grugops/wave-2026-09-19 (lane 42 / 1325 / 0)
---

# Subtask: implement `ABC-118` — assert what the default lane COLLECTS (S, P1, DoR 10/10, zero production lines)

Pulled `Backlog` → `In Development` by the Orchestrator 2026-09-19. Read the ticket page in full
— § "The placement question" names a trap the delivering hop must rule on; `A5` says
`vitest.config.ts` is NEVER edited; `## Out of scope` says zero production lines. Then
`AGENTS.md`'s 12 rules and lane conventions, `vitest.config.ts`, `ABC-050`'s delivered guard
(`grep -rn "ABC-050" src/*.test.ts tools/`), and BA/PM's five notes at
`.grugops/context/cut-050-exclude-and-g06-2026-08-21/notes/` (the measured traps).

## Shape
- One instrument that asserts the default lane's INVENTORY — the set of files vitest collects
  under `--dir src` — against what the repository holds, so a type-valid `exclude` glob that
  silently drops a file goes RED. Placement per the ticket's ruling section (rule it, write the
  reason). 0 production lines; `vitest.config.ts`, `AGENTS.md`, `plans/nfr-catalog.md` byte-identical
  (`A5`'s numstat check).
- **The lane is currently 42 files.** Today's wave added `src/frame.overflow-bound.test.ts`,
  `src/rejection.test.ts`; `ABC-079`'s `src/quiescence.test.ts` is on an UNMERGED branch — the
  instrument must be derived from the filesystem/git, not a hard-coded count, or it goes stale on
  the next merge. Say how it stays true.

## Gates and budget
- Four gates green at the tip: `npx biome check .`, `npx tsc --noEmit`, `npx vitest run --dir
  src`. `test-skip-integrity` → `No findings.`
- `N8-LANE` ≤ 650 ms; if the instrument is a new file, the ~370 ms per-file floor counts — say
  which placement you chose partly on that ground. Whole-lane CPU before/after, load noted;
  > 15 s under load is REPORTED non-conforming.
- `self_fix_attempts` = 2, then stop.

## Fences
- Do not touch `plans/board.md`, `AGENTS.md` (the owed line is the Scribe's — name it),
  `vitest.config.ts`, any `src/*.ts` that is not a test file, `src/search.*`/`src/quiescence.*`
  (`ABC-079` live), `src/command-input.*`/`src/line-input.*` (`ABC-046` live).
- Do not merge, do not deploy. Own `git worktree`; commit messages via a UNIQUELY-NAMED
  scratchpad file and `git commit -F`; gates through a node script.

## Publish
Notes into `ref:` (`claim` for gates; no `finding`), trace row, ticket § Delivery. Claim by hand
per Workflow 17: `mkdir .grugops/queue/claimed/ticket-to-pr-ABC-118`, move this file in, then
out to `done/`. Report: branch, sha, numstat (expect zero non-test `src/` files), the placement
ruling, gate numbers, N8-LANE ms, lane CPU before/after, the mutant you watched red (a dropped
file must red it).
