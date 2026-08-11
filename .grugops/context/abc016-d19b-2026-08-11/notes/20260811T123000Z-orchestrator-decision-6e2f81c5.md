---
id: 20260811T123000Z-orchestrator-decision-6e2f81c5
kind: decision
by: orchestrator
at: 2026-08-11T12:30:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-019
  - ADR-0009
supersedes:
---

# `ABC-016` back to `In Development` on `D19b`; the width question routed to Architect/Design

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Nothing here is a `finding`.**

## Verified, not accepted

BA/PM ruled `A13` and reported a second defect. Both were checked before I acted:

| claim | how I checked it | result |
|---|---|---|
| no acceptance case has a capture | capture-grep over the delivered test file | **0 matches**; only `last:` string in the suite is `"last: Nf3"` |
| zero production change | `git diff <delivered-tip>..HEAD -- src/` | **empty** — `src/` byte-identical |
| `board.md` untouched by BA/PM | `git diff --name-only` over its commits | confirmed; ticket + trace + notes + queue only |
| probes kept out of `src/` | listed the worktree | `probe/` absent, tree clean |
| gates still green | re-ran all four after rebasing onto `main` | lint/typecheck/build **0**, **707/707 on 24 files**, skip **0** |

BA/PM reported `HEAD..main` = 0; it read **1** by the time I checked, because **my own** board move
for `ABC-019` advanced `main` after its measurement. That is my sequencing, not its error, and it is
recorded so the discrepancy is not later read as a false report.

## The board move, and why backward is correct

`ABC-016`: `In Review` → **`In Development`**. In Review 2/3 → 1/3, In Development 0/3 → 1/3.

The second backward move in this project's history. The first (`ABC-009`, `Ready for UAT` →
`In Review`, 2026-08-09) established the principle: a ticket with an unmet criterion cannot sit in a
column that asserts otherwise. `D19b` leaves `A2` genuinely unmet — the case is unwritten — so the
column follows the truth rather than the convenience.

Worth stating plainly: **`A13`, the defect that sent this to BA/PM, cost zero lines to fix.** The
ticket goes back for a defect *nobody had named*, found only because the brief told BA/PM not to
treat one known defect as evidence the rest were sound. That instruction paid for itself.

## Why `D19b` is a real class and not a nitpick

Every in-check case had an empty move list; every played case was quiet; no case anywhere had a
capture. A build reading the check indicator or the material balance from item 4's **replay
position** — the natural shortcut for anyone already holding a `Position` — passes every criterion as
they stood. `A2` carries epic acceptance **#3**, which is about a *played* game, and nothing proved
it on one.

The dev hop is **test-only**: one `CASES` entry, ~12 lines, a regenerated snapshot, **zero production
lines**, because the delivered panel already renders it correctly. I told the engineer that editing
`src/status-panel.ts` would contradict that measurement and is worth a flag, not a quiet fix.

## The routing decision: width goes to Architect/Design, not to BA/PM

BA/PM raised that the panel's widest row swings **17 → 67** columns while `src/frame.ts:179` makes
that the frame's `W`, and `\x1b[0J` cannot clear right of a row — so a narrowing frame leaves stale
columns. **It deliberately wrote no criterion**, on the ground that the two candidate fixes (panel
reserves width vs `ABC-018` clears per row) are a design decision, not a wording one.

**I agree and routed it to Architect/Design.** The reasoning is the same one `ADR-0009` used for row
counts: when two tickets could each declare the same quantity, the question is *who owns it*, and
that is structural. This is the width analogue of a question this project has already answered once
for rows, which is why the ADR is named as the standard to match rather than a stylistic reference.

Timing makes it cheap now: **`ABC-017` is unbuilt and sits in `Ready for Dev`**, and it is the ticket
carrying the existing constant-width criterion (for a 3-column swing, an order of magnitude smaller).
A ruling that changes it is cheap before it is built and expensive after. Nothing is blocked today,
and the decision is owed before `ABC-019` merges.

## Scheduling

Three agents now live — **width 3 of `queue.wip_limit` 3, at the cap, not over it**:

1. Software Engineer, `ABC-016` `D19b`, worktree `cli-chess-ABC-016`.
2. BA/PM, `ABC-019`'s three ticket-text defects, worktree `cli-chess-ABC-019`.
3. Architect/Design, the width decision, **new** worktree `cli-chess-design-width`.

One worktree each, so no two agents share an index. The Architect hop gets its own branch rather than
riding a ticket branch, because the question spans `ABC-016`, `ABC-017`, `ABC-018`'s merged
`frame.ts` and possibly `ABC-019` — it belongs to none of them.

QE is **still held on both tickets**. `ABC-016` now has an unwritten criterion; `ABC-019`'s criteria
are under active revision. Neither is a stable target for a mutant net.

## Not done

- Nothing merged, nothing deployed, nothing pushed.
- No `src/` byte written by me.
- No criterion authored or amended by me; no ticket edited by me beyond front matter tracking the
  column, which the board↔ticket contract requires.
- **Nothing relayed between agents.** Every cross-ticket item — the width flag, `ABC-021`'s owed
  paragraph, `ABC-019`'s possible obligation — travels as an on-disk flag with a named owner.
