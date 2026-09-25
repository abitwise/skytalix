---
task: wave-2026-09-24
subtask: ruling-abc079-oracle
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md (design ruling on a tripped stop condition)
ticket: plans/tickets/ABC-079-quiescence-search-on-captures.md
ref: .grugops/context/ruling-abc079-oracle/
build_ref: .grugops/context/ticket-to-pr-ABC-079/  (on branch grugops/ABC-079-quiescence, NOT on the wave branch)
prior_ruling_ref: .grugops/context/ruling-abc079-multiplier/
enqueued_by: orchestrator
enqueued_at: 2026-09-24T09:00:00Z
branch: grugops/ruling-abc079-oracle
base: grugops/ABC-079-quiescence @ fa80923  (branch off the re-hop so you can probe; its deep lane is red)
---

# Subtask: rule `ABC-079`'s red deep lane — the unpruned oracle under quiescence

The re-hop (`700730b`/`fa80923`) met `ADR-0024`: the `A5` ratios are under every level, the
default lane is green (41 / 1243 / 0), and `SEARCH_DEEP` `quiescence.test.ts` and `ENGINE_DEEP`
are green. It is still blocked because **`SEARCH_DEEP=1 npx vitest run src/search.test.ts` exits
1 with 4 timeouts after 2 678 s**. `searchWithoutPruning` never raises alpha, so every leaf opens
a full-window quiescence. The licensed kiwipete-only depth drop cannot make it green, and the
file is outside the ticket. Read the re-hop's notes in `build_ref:` (the most recent ones), the
ticket's § Ruling and § Delivery (re-hop), `ADR-0024`, and `src/search.test.ts`.

## Rule, and probe before you rule
1. What should the unpruned oracle compare against now that search has quiescence? Options to
   measure out-of-tree, each with the wall time and pass/fail per case: (a) the oracle runs with
   quiescence OFF and compares against `searchWithoutQuiescence`; (b) the oracle's depth drops
   by one on the four timing-out cases; (c) the oracle's quiescence is capped; (d) the timeout is
   raised (last resort only). Does any option weaken what the oracle proves? Say what it stops
   proving.
2. Is `src/search.test.ts` inside `ABC-079`'s fence for the re-hop, or does it need its own
   ticket? Rule which ticket owns the change.
3. Name the `AGENTS.md` deep-lane lines for `search.test.ts` and `quiescence.test.ts` that the
   Scribe owes, so that ruling does not get lost.

## Fences
- Your diff contains no files under `src/`: revert probes and keep scratch work outside the
  tree. The Engineer does the fix.
- Do not touch `AGENTS.md`, `plans/board.md`, or the NFR bars. Do not merge or deploy.
- Work in your own `git worktree`. Write commit messages to a uniquely named scratchpad file and
  use `git commit -F`. Run probes as node scripts.

## Publish
The ruling as a `decision` note, the probe numbers as `observation` notes, a trace row, and a
ticket § Ruling (oracle) section. Claim by hand per Workflow 17. Report: the ruling in three
sentences, the probe table (option, then per-case wall and pass/fail), what the Engineer's next
hop must change, the sha and the numstat.
