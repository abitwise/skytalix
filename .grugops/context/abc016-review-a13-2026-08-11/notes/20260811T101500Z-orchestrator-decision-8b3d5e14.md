---
id: 20260811T101500Z-orchestrator-decision-8b3d5e14
kind: decision
by: orchestrator
at: 2026-08-11T10:15:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-019
  - ADR-0009
supersedes:
---

# `ABC-016` → `In Review` on a flagged criterion; `A13` routed to BA/PM and QE held back

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. Precedent for saying so:
> `.grugops/queue/done/refinement-ABC-019/claim.md`. **Nothing here is a `finding`** — no
> verification stamp is issuable to me.

## What I verified rather than accepted

The engineer reported gates green and one unmet criterion. This project's record is that the
Orchestrator's recurring failure mode is *believing an instrument without checking the instrument*
(five such errors on `ABC-009` alone), so each claim was re-run:

| claim | how I checked it | result |
|---|---|---|
| gates green | re-ran all four **in the worktree** | lint/typecheck/build **0**, **707/707 on 24 files**, skip **0** |
| `A13` unsatisfiable | read `src/san.ts` at source | **CONFIRMED** — `suffix()` calls `isInCheck` at `:104` |
| file boundary held | `git diff --name-only main..HEAD` | no `src/turn-loop.*`, no `src/frame.test.ts`, no `plans/board.md` |
| no index sweep | `git log --name-only` over the 3 commits | 12 files, all expected; no `node_modules` |

`A13` requires `isInCheck` **exactly 1** *and* `toSan` **exactly 1**. `toSan` calls `isInCheck`
internally, so the true count is **1 on an empty history, 2 from the first move onward**. No correct
build satisfies the criterion as written. The engineer flagged it and did **not** amend the ticket —
the correct call, and the one the subtask brief demanded.

## The routing decision, and why it is BA/PM and not QE

An unsatisfiable acceptance criterion is a **product-clarity** defect. Routing matrix sends that to
BA/PM. **QE is deliberately held back until the ruling lands**, for a reason this board has already
paid for once: `EPIC-003`'s backlog row records that *"a warning owned only by a gate that runs AFTER
the work arrives too late."* Sending QE to build a mutant net against a criterion that is about to
move would be that same waste, and QE's own hops here routinely find further criteria gaps — which
would then need a second BA/PM hop regardless.

**Both roles on `ABC-016` also share one branch and one worktree, so they cannot run concurrently
without reproducing `2cd84cd`.** Sequential is not a scheduling compromise here; it is the control.

## Board move

`ABC-016`: `In Development` → `In Review`. In Development 2/3 → **1/3** (`ABC-019` only),
In Review 0/3 → **1/3**. `Ready for Dev` unchanged at 1/6 (`ABC-017`).

The move is honest **because** `In Review` means "PR + QE running", not "criteria met" — the flagged
defect is precisely what is under review. It is not the `ABC-009` situation, where an unmet criterion
sat in `Ready for UAT` and had to be moved **backward**; that precedent is why the flag travels with
the row rather than being resolved quietly first.

## A hazard I created, and closed

The worktree `node_modules` **symlinks** are not matched by `.gitignore`'s `node_modules/` — a
trailing slash matches directories, and a symlink is not a directory. A later `git add -A` in either
worktree would have committed one. **No commit did** (verified over all three `ABC-016` commits), and
it is now excluded through the local-only `.git/info/exclude`, leaving the tracked `.gitignore`
untouched. Recorded because I introduced it when I built the worktrees.

## A consequence I am naming rather than discovering later

This board move advances `main` past **both** in-flight ticket branches, so **`ABC-016` now needs a
rebase before merge too** — not only `ABC-019`, whose rebase was already owed under `ADR-0009`
cl. 9f. The alternative was putting board moves on ticket branches, which guarantees a `board.md`
conflict the moment two tickets are in flight. Board-on-`main` plus rebase-before-merge is the
cheaper of the two, and merge order `ABC-016` → `ABC-017` → `ABC-019` is unchanged.

## Not done

- Nothing merged this hop, nothing deployed, nothing pushed.
- No `src/` byte written by me.
- No ticket criterion amended by me — that is BA/PM's, which is the whole point of the routing.
- **Nothing relayed to the `ABC-019` engineer**, which is still running. Its ticket is owed one line
  about the render seam (the `ABC-016` engineer noted it); that is a ticket-text matter for BA/PM,
  not a message for me to carry between agents.
