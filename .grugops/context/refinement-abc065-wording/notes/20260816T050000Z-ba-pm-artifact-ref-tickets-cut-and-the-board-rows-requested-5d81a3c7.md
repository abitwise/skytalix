---
id: 20260816T050000Z-ba-pm-artifact-ref-tickets-cut-and-the-board-rows-requested-5d81a3c7
kind: artifact-ref
by: ba-pm
at: 2026-08-16T05:00:00Z
verified_by: 
confidence: high
refs:
  - ABC-068
  - ABC-069
  - ABC-070
  - ABC-065
supersedes: 
---

# What this hop wrote, and the rows it is ASKING the Orchestrator to append

**`plans/board.md` and `plans/traceability.md` were NOT written** — both are the Orchestrator's, on
this subtask's hard limit. The rows below are requests.

## Files written

| path | what |
|---|---|
| `plans/tickets/ABC-068-shared-test-helpers-have-no-written-contracts.md` | new, 196 lines |
| `plans/tickets/ABC-069-dev-run-slot-conventions-are-unwritten.md` | new, 169 lines |
| `plans/tickets/ABC-070-abc065-dependencies-names-a-drained-claim-as-live.md` | new, 154 lines |
| `plans/tickets/ABC-065-…-option-list-is-unchecked.md` | **edited** — `A2` re-worded in place (annotated, original preserved verbatim) and the identical stale pointer in `## Out of scope`; 174 → 202 lines. **No other section touched.** |
| `.grugops/queue/claimed/refinement-abc065-wording/` | claim taken by hand per Workflow 17 (bare `mkdir`), `claim.md` written, task file moved in |
| `.grugops/context/refinement-abc065-wording/notes/` | this note and three others |

**`ABC-071` was not used.** No id outside `ABC-068`…`ABC-071` was written. **No git command was run at
this hop** — the working tree is shared with two sibling BA/PM hops and the Orchestrator commits.

## Board rows requested — `Backlog`, one line each, appended after `ABC-064`

```
- [ABC-068] The shared helpers in `src/cli.test.ts` became infrastructure without contracts — `advertisedTextOf` returns garbage where its sibling throws, and the comment above them says TWO where there are FOUR  (BA/PM, XS, P2, epic: —, since: 2026-08-16, **DoR 10/10**; `G9`+`G11` folded on the Orchestrator's ruling — ONE ticket, and nobody sneaks the fix in as a drive-by; **comments only, 0 executable lines** and a criterion forbidding the doc comment from spelling an accepted argument, which would breach `ABC-065`'s merged `A5`; promote to P1 the moment `ABC-061` or `ABC-062` is pulled — they add the third caller)
- [ABC-069] The `Dev / run` slot's guard requires two rendering conventions of `AGENTS.md` and neither is written where a Scribe would see it  (BA/PM, XS, P3, epic: —, since: 2026-08-16, **DoR 10/10**; QE `Q9`, mutants `N15`/`N16` — honest documentation reds the suite; **loosening the guard is REFUSED on QE's reasoning and fenced on the page**; `AGENTS.md` Scribe's pen, 0 files under `src/`; promote to P1 when `EPIC-006` adds or renames an option)
- [ABC-070] `ABC-065` § Dependencies still names a drained claim as live and forbids pulling a ticket that merged  (BA/PM, XS, P3, epic: —, since: 2026-08-16, **DoR 10/10**; `G12`, confirmed by three separate hops as notes and still on the page; **the page contradicts its own DoR row 10**; recommends folding `G6`/`A6` in before it is pulled, and says to close it unstarted if the sentence is repaired in place instead)
```

## Traceability rows requested — `plans/traceability.md`, BA/PM's rows to append, the Orchestrator's pen here

Three rows, requirement→epic→feature→ticket, each `epic: —` and `feature: —` (all three are
guard/record-quality debt from the `ABC-065`/`ABC-066` lane, not product requirements):

| id | source requirement | status |
|---|---|---|
| `ABC-068` | `G9` + `G11` (guard hop) / `Q2` + `Q6` (QE), ruled one ticket by the Orchestrator 2026-08-16 | `Backlog` |
| `ABC-069` | `Q9` (QE, `ABC-065` gate) | `Backlog` |
| `ABC-070` | `G12` (guard hop) / `G1` (Scribe) / re-confirmed by QE | `Backlog` |

## Two things the Orchestrator must decide, neither of them mine

1. **Where `Q7` lands** — folded into the `refinement-Q8-slot-guard` lane with its criterion written
   out verbatim, or given `ABC-071` if that ticket is already closed to change. **`ABC-071` is left
   unspent for exactly this.**
2. **Whether `G6` (`ABC-065`'s `A6` wording) joins `ABC-070`** — it is on the same page with the same
   pen, it appears in neither BA/PM subtask, and it is recommended rather than absorbed.

Both are argued in this hop's dedupe and gaps notes.
