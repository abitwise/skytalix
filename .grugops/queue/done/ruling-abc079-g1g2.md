---
task: wave-2026-09-24
subtask: ruling-abc079-g1g2
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md (design ruling on QE-routed readings)
ticket: plans/tickets/ABC-079-quiescence-search-on-captures.md
ref: .grugops/context/ruling-abc079-g1g2/
qe_ref: .grugops/context/qe-ABC-079/  (on branch grugops/int-ABC-079 @ 9b4dd68, NOT on the wave branch)
prior_ruling_ref: .grugops/context/ruling-abc079-oracle/  and  .grugops/context/ruling-abc079-multiplier/
enqueued_by: orchestrator
enqueued_at: 2026-09-25T00:00:00Z
branch: grugops/ruling-abc079-g1g2
base: grugops/int-ABC-079 @ 9b4dd68
---

# Subtask: rule `ABC-079`'s QE-routed readings G1 and G2, and set the repair hop's licence

QE FAILED `ABC-079` on four false sentences in `src/search.ts` (D1–D4). Behaviour meets A1–A6.
Read the QE `decision` note in `qe_ref:` (§2 G1, §3 G2, §4 D1–D4), the oracle ruling in
`prior_ruling_ref:`, the ticket's § Ruling sections, and `ADR-0024`.

## Rule, and probe before you rule
1. **G1** — the conjunction the oracle ruling gave up (a quiescence-window defect at a depth-3
   leaf changes the move on 3 of 6 benchmark boards and reds no row). Close it inside
   `ABC-079` or route it to a named ticket? If closed here, name the rows (QE's cheap option:
   pin `{score, move}` on the `A5` deep `search(kiwipete|position-6, 3)` calls) and say whether
   the pinned values need an oracle check first, or are a regression fingerprint only.
2. **G2** — `A4` deep at 50–56% of its 120 s timeout, `A7` deep at 77% when run without `A4`
   warming the memo. Name the remedy (e.g. split the corpus runs into separate cases, each with
   its own timeout, or make `A7` self-sufficient) and whether it is in `ABC-079`'s fence.
3. **Licence** — D1/D2 were frozen by the oracle ruling's "nothing else in the file changes".
   State exactly which files and lines the Engineer's ONE repair hop may touch: D1–D4 prose,
   plus whatever G1/G2 add. Everything else stays frozen.

## Fences
- Your diff has no files under `src/`. Revert probes and keep scratch work outside the tree.
  The Engineer makes the fix.
- Do not touch `AGENTS.md`, `plans/board.md`, or the NFR bars. Never merge; never ship.
- Work in your own `git worktree`. Write commit messages to a uniquely named scratchpad file and
  use `git commit -F`. Run probes as node scripts.

## Publish
The ruling as a `decision` note, any probe numbers as `observation` notes, a trace row, and a
ticket § Ruling (G1/G2) section. Claim by hand per Workflow 17. Report: the ruling in three
sentences, the licence (file:line ranges), what the Engineer's hop must change, the sha and
the numstat.
