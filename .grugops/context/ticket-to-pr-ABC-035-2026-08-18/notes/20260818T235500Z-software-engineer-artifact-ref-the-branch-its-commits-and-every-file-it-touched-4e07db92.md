---
id: 20260818T235500Z-software-engineer-artifact-ref-the-branch-its-commits-and-every-file-it-touched-4e07db92
kind: artifact-ref
by: software-engineer
at: 2026-08-18T23:55:00Z
verified_by:
confidence: high
refs:
  - ABC-035
  - src/command-input.ts
  - src/command-input.test.ts
  - plans/traceability.md
supersedes:
---

# The branch, its commits, and every file it touched

## Branch

`grugops/abc035-in-game-commands`, branched from **`main` @ `8b055cb`** (the brief named `23312b3`;
`8b055cb` is two board/queue chore commits later and contains it — see the "found" note). **Not
merged. `main` is untouched.** This repo has no git remote, so nothing is pushed and no PR exists —
`AGENTS.md` § Branching model's standing reading of `autonomy: "pr"` here.

## Commits, in order

| sha | subject |
|---|---|
| `16114e3` | `chore(queue)` — the claim, and the subtask file moved `pending/` → `claimed/` |
| `753556a` | `feat(ABC-035)` — the four tokens, the table, the derived help |
| `9d8031a` | `test(ABC-035)` — the stream guard added after mutant M13 survived |
| `d0a21fc` | `docs(trace)` — the `ABC-035` row's Code / Tests / Status cells |
| `acb0894` | `docs(ABC-035)` — the decision note and the thirteen mutant diffs |

Committed incrementally on purpose: the brief records that an API outage cost two hops today which
had saved everything to the end.

## Files

**Production — one file, new:**

- `src/command-input.ts` (**+142 / −0**) — `COMMAND_TABLE`, `classifyCommand`, `helpMessages`,
  `resolvePromptLine`, and the `PromptLineOutcome` narrowing of `PromptOutcome`.

**Test — one file, new:**

- `src/command-input.test.ts` (**+539 / −0**) — 79 tests: fixture round-trips, `A1`-`A7`, and a
  `fences` block (grammar only, no argument, no stream write).

**State — not code:**

- `plans/traceability.md` — one row touched in place, three cells, append-only; 10 columns before and
  after.
- `.grugops/queue/claimed/abc035-in-game-commands/` — the claim record and the moved subtask file.
- `.grugops/context/ticket-to-pr-ABC-035-2026-08-18/notes/` — these notes.

**Untouched, and asserted:** `src/move-input.ts`, `src/turn-loop.ts`, `src/san.ts`,
`src/coordinate-move.ts`, `src/frame.ts`, `plans/board.md`, the ticket's DoR table.
`git diff --numstat main..HEAD -- src/` is exactly two rows, both `command-input`.

## Not committed

`mutants.py`, the scratch mutation harness, and a one-off width probe. Both deleted; neither appears
in any commit. The mutant diffs live in the sibling observation note, which is the durable record.
