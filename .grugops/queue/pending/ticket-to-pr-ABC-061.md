---
task: ticket-to-pr-ABC-061-2026-08-17
subtask: ticket-to-pr-ABC-061
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-061-2026-08-17/
parent_ref: .grugops/context/ticket-to-pr-ABC-061-2026-08-17/
ticket: plans/tickets/ABC-061-resolver-accepting-path-asserts-only-ok.md
enqueued_by: orchestrator
enqueued_at: 2026-08-17T10:00:00Z
branch: grugops/abc061-resolver-value-assertions
base: main @ 86594fb
---

# Subtask: pin the six accepted argvs by VALUE — `ABC-061`, zero production lines

Read the ticket. Read `ref:` — it holds ONE Orchestrator note, the criteria re-read against the built
tree at the `Ready for Dev` exit. **The page was cut 2026-08-15 and FIVE tickets have merged into
`src/cli.test.ts` since. Every line number on the page has drifted, one by 91 lines, and `A5`'s
protected line number now points at an unrelated block. Read that note before you open the source.**
Nothing from it is restated here.

## Hard limits on this subtask

- **Zero production lines.** Nothing under `src/` that is not a `.test.ts` file. The mutants are run
  on a COPY of the tree OUTSIDE the repository and reverted — never committed, never left in place.
- **The merged `A6(i)` accepting row stays byte-identical.** `A5` names it by a stale line number;
  protect it **by identity** — the `it("A6(i) — every documented spelling resolves in its legal argv
  position")` block. Your new assertions live BESIDE it under their own name.
- **No new child process.** `spawned` stays at 10. No pty check, no `--ascii` as a spawned child —
  both are fenced out by `## Out of scope` and the second buys nothing on a pipe.
- **Do not assert `selectGlyphMode`'s behaviour** — `src/glyph-mode.test.ts` owns that rule.
- **One path in the diff: `src/cli.test.ts`** (`.grugops/` excluded as process artifact).

## Definition of done for this subtask

`A1`–`A6` each answered with the verdict or number the criterion asks for, measured not asserted —
**including `A1` and `A4`, which require you to WATCH EACH MUTANT GO RED before writing the guard**
(`## Test notes` 1: a guard that passes only because the mutant was never run has not been tested).
Record the green baseline you measured before mutating. Gates (`lint`, `typecheck`, `build`,
`npm test`, test-integrity) run on your branch tip and recorded. Notes published per Workflow 16
under `ref:`, hand-authored per `agent-factory/contracts/context-note.md` — **no `kind: finding`, no
invented stamp; none is emittable on this install** (`AGENTS.md`). Queue claim taken by hand per
`AGENTS.md`. Do not merge — the Orchestrator re-runs the gate itself and holds the merge.
