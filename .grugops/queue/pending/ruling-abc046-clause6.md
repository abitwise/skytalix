---
task: wave-2026-09-24
subtask: ruling-abc046-clause6
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md (design ruling on a QE-routed reading)
ticket: plans/tickets/ABC-046-quit-and-new.md
ref: .grugops/context/ruling-abc046-clause6/
qe_ref: .grugops/context/qe-ABC-046/
build_ref: .grugops/context/ticket-to-pr-ABC-046/
enqueued_by: orchestrator
enqueued_at: 2026-09-24T20:00:00Z
branch: grugops/ruling-abc046-clause6
base: grugops/wave-2026-09-24 (QE merged at 99f66db)
---

# Subtask: rule `ADR-0021` clause 6 against the over-cap line, for `ABC-046`

QE failed `ABC-046` on two false docblock sentences. That fix is the Engineer's and is not yours
to rule. QE also routed **reading 2** to you: through the real entry point, `quit` / an over-cap
line (1 025 chars) / `quit` ENDS the session. The flag is not cleared, because the over-cap line
never reaches the resolver, and the last frame the player saw said "line too long", not the
confirmation. `ADR-0021` clause 6 says the flag is "cleared by any other line". The cheap fix
(QE probe Q9: pass the over-cap line to the resolver) turns 3 of `ABC-037`'s security-bar-2 rows
red. A real fix needs a `disarm` on the wrapper, which `A8`'s file licence does not cover.

Read these first: the QE `decision` note in `qe_ref:` (reading 2, and the Q9 row in the mutant
ledger), `ADR-0021` (clause 6 and clause 8), the ticket's `A1`/`A8` and § Ruling, and the code
at `src/command-input.ts` (the wrapper) and `src/line-input.ts` (the over-cap path).

## Rule
1. Which is right: narrow clause 6 (an over-cap line is not "a line" for the flag's purpose), or
   license a `disarm` so the flag clears? Base it on what the player sees. After "line too
   long", does a second `quit` ending the game surprise them?
2. If you license a disarm, name the exact files and lines this ticket may touch (the `A8`
   amendment), and confirm that `ABC-037`'s security-bar-2 rows stay green under that shape.
   Probe it out-of-tree.
3. If you narrow clause 6, write the replacement sentence and say whether `ADR-0021` needs a
   superseding ADR or an in-place clarification.

## Fences
- Your diff contains no files under `src/`: revert probes and keep scratch work outside the
  tree. The Engineer does the fix.
- Do not touch `AGENTS.md` or `plans/board.md`. Do not merge or deploy.
- Work in your own `git worktree`. Write commit messages to a uniquely named scratchpad file and
  use `git commit -F`. Run probes as node scripts.

## Publish
The ruling as a `decision` note, probes as `observation` notes, a trace row, and a ticket
§ Ruling (clause 6) section. Claim by hand per Workflow 17. Report: the ruling in three
sentences, the probe results, the exact change list for the Engineer's re-hop (the two docblock
sentences D1/D2, a G1 row killing mutant Q3 if `A8` licenses `src/command-input.test.ts`, and
any licensed disarm), the sha and the numstat.
