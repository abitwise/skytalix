---
id: 20260815T224600Z-orchestrator-decision-rulings-on-the-gaps-both-hops-returned-4b19c2ef
kind: decision
by: orchestrator
at: 2026-08-15T22:46:00Z
verified_by: 
confidence: high
refs:
  - plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
  - plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md
  - .grugops/context/ticket-to-pr-ABC-065-scribe/notes/
  - .grugops/context/ticket-to-pr-ABC-066/notes/
supersedes: 
---

# Rulings on the gaps both hops returned, and why nothing merged

Both hops finished. Neither ticket is in `Done` and nothing was merged to `main` — stated plainly
because the owner's standing grant makes merge available per ticket and it would have been easy to
take. **`ABC-066` has not been through QE, and `ABC-065` is half a ticket.** The grant is permission
to merge work that PASSED; the gate binds and QE has not run.

## What I verified myself rather than accepting

| claim | how I checked | result |
|---|---|---|
| `ABC-066` `A6`: exactly 2 paths | `git diff --name-only ab0864e~1 ab0864e` | `src/cli.test.ts`, `src/cli.ts` — **2** |
| `ABC-066` production line count | `git diff --numstat` → `7 2` | consistent with `1 1` code + 6/1 comment, as reported |
| `ABC-065` `A2`: `src/cli.test.ts` byte-identical | `git rev-parse main:src/cli.test.ts` vs the branch's | both `46c8c579…` — **identical blob**, so `:193-204` cannot have moved |
| `ABC-065` touched nothing under `src/` | `git diff --name-only 39122ec~1 717e51d` | `AGENTS.md` + 6 `.grugops/` paths, **zero `src/`** |
| the shared-tree hazard was real | `git status` on the shared tree after both hops | a staged deletion and an untracked claim dir left behind — **the hazard is confirmed, not theoretical** |

Both hops independently reported the same two process defects (`G4`/`G5` in one report,
`G5`/`G7` in the other). **Two independent hops converging on one defect is the signal.**

## Ruling 1 — `ABC-065` `A1` vs `A3`: the bare `--` is NOT an option token

The Scribe measured four `--`-prefixed tokens in the slot (`--`, `--ascii`, `--colour`, `--unicode`)
against `A3`'s required three. The fourth is the separator `A1` mandates. **On a literal reading the
two criteria cannot both be satisfied.**

**Ruling: `A3`'s "`--`-prefixed tokens" means option tokens — the bare `--` separator is not one.**
The guard's collector excludes it explicitly, with a comment naming this ruling, and it must NOT be
excluded by a loose pattern that would also swallow a real option. Removing the separator to satisfy
`A3` is forbidden: it destroys the ticket's entire purpose.

This is a reading of a criterion, not a re-wording of one — criteria are BA/PM's and I have changed
no text. **Routed to BA/PM for a wording repair** so the next reader does not have to re-derive it.

## Ruling 2 — `A6`'s "exactly two paths" cannot be met by any compliant hop

Raised by the Scribe (`G6`), and it is correct. Workflows 16 and 17 REQUIRE the `notes/` and the
queue transition be committed; `A6` demands `git diff --name-only` show exactly two paths. A hop that
obeys the workflows fails the criterion. `ABC-066`'s engineer routed around it by putting process
artifacts in a **separate commit** and pointing `A6` at the delivery commit — which is what
`ABC-060`'s ruling, cited by `A6` itself, already says.

**Ruling: `A6` is scored against the DELIVERY commit, excluding `.grugops/` process substrate, and
for `ABC-065` across the ticket's two hops rather than one commit.** What `A6` protects — zero `src/`
production lines on `ABC-065`, exactly one on `ABC-066`, no new files, no new spawns — is measured
and holds on both. **Routed to BA/PM** as a wording repair on both pages.

## Ruling 3 — the tree hazard becomes a standing line in every enqueue

`G2` (files) was caught at the `Ready for Dev` exit; the tree- and index-level version was not, and
`claim_cap: 2` guarantees it recurs. **From this hop on, every subtask file I write carries: take a
linked `git worktree`, stage with explicit pathspecs, never `git commit -a`.** It is in
`quality-gate-ABC-066-qe.md` already. My schedule was right about files and wrong about the index —
recorded as my error, not the hops'.

## Ruling 4 — `base:` is stamped at enqueue, not before

Both hops hand-corrected `base: main @ 3fb6ebd` to `4e9ed1d`, independently, because my board-move
commit landed after I wrote the subtask files. Two for two on one enqueue. **I now write the queue
files, commit, and stamp `base:` at the tip that results** — or say "current `main` tip" and stop
pretending to a sha I have not yet made.

## Queue state

Both engineer/scribe subtasks drained `claimed/` → `done/` as FINISHED work, never back to
`pending/`, which invites a redo. The `ABC-065` Scribe's `claim.md` existed only on its branch (it
claimed there, and the shared tree was on another branch); it was recovered by `git show` into
`done/ticket-to-pr-ABC-065-scribe.claim.md` so the ownership record lives on `main`. **Known
consequence, flagged rather than discovered later: when
`grugops/ticket-to-pr-ABC-065-scribe` merges, it will reintroduce
`claimed/ticket-to-pr-ABC-065-scribe/` — resolve by keeping the drained state.**

`quality-gate-ABC-066-qe` is enqueued. Width 1 of 3.

## Schedule from here

1. **QE on `ABC-066`** (running). An implementer cannot be the independent check on its own guard.
2. QE green → merge `ABC-066` to `main`, gate on the tip before and on `main` after, both recorded.
3. **`ABC-065`'s guard hop branches from `grugops/ticket-to-pr-ABC-065-scribe`**, merges the updated
   `main` in to pick up the four helpers, adds the block, and the ticket lands as ONE merge. It does
   not branch from `main`: `ABC-065` is one ticket on one branch and it closes once.
