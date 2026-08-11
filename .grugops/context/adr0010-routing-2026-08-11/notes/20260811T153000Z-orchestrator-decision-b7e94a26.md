---
id: 20260811T153000Z-orchestrator-decision-b7e94a26
kind: decision
by: orchestrator
at: 2026-08-11T15:30:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-019
  - ABC-027
  - ADR-0009
  - ADR-0010
supersedes:
---

# `ADR-0010` merged; the frame-clearing change routed to a new `ABC-027`

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Nothing here is a `finding`.**

## A second instrument error of mine, this one caught in seconds

`git diff main..HEAD` on the Architect's branch reported it had edited `plans/board.md` and two
tickets. **That is a boundary violation and I nearly recorded it as one.** It was a false positive:
`main` had advanced past the branch point, so my *own* later commits appeared as removals in the
reverse direction. Re-run against `git merge-base`, the Architect touched exactly seven files —
notes, queue, the new ADR, and the catalog — and **no ticket, no board, no `src/`**.

This is the second time in this round that an instrument, not a claim, was wrong: earlier a
line-bound `grep` returned a false zero on a sentence that wraps across lines. Both were caught by
re-checking. **The pattern is worth more than either instance: `git diff A..B` and `grep` both answer
a narrower question than the one being asked, and this project's record already contains five
Orchestrator errors of exactly this shape.**

## What I verified before merging

| claim | how | result |
|---|---|---|
| boundary held | `git diff` against the **merge base** | 7 files; no ticket, no board, no `src/` |
| `ADR-0009` untouched | diff on that path | **byte-identical** |
| catalog rows unaltered | `git diff --numstat` | **41 additions, 0 deletions** |
| gates | re-ran on the tip and again on `main` | lint/typecheck/build **0**, **676/676 on 22 files**, skip **0** |
| the premise correction | read `frame.ts:179` and ran `renderBoard` | **confirmed** — `W` is a `max`, board is 9×**18** |

## The correction that lands on me

The Architect corrected a number **I had propagated**: the frame does not swing 50 columns. `W` is
`max(board 18, status, history)`, so it is 49 with the board alone, 43 with a 24-column pane, and
**26 in a real game**. The 50 was the *panel's own row* swing (17 → 67) — BA/PM's figure, correct for
what it described — and **I restated it as the frame's**. I checked the correction at source rather
than accepting it, and it holds.

The defect itself survives the correction intact, which is the part that matters: it prints
`material: 01`, persists an expired claim on a row the frame calls empty, and **does not self-repair
across 17 consecutive frames**.

## The routing decision the Architect deliberately left to me

It named the code that must change and then declined to pick a home, because `ABC-018` — the module's
ticket — **merged 2026-08-09 and is closed**. Reopening a closed ticket to carry new work is not
something this board does, and nothing in the record supports it.

**Decision: a new ticket, `ABC-027`** (verified free), cut by BA/PM.

**Merge order becomes `ABC-016` → `ABC-017` → `ABC-027` → `ABC-019`, and I am stating the two edges
at different strengths on purpose:**

- **`ABC-027` before `ABC-019` is FORCED** — `ABC-019` gains a criterion the correct build cannot
  pass until the writer clears per row.
- **`ABC-027` after `ABC-017` is a PREFERENCE** — both touch `src/frame.test.ts`, `ABC-017` is sized
  and ready while `ABC-027` is uncut, so ordering by readiness costs nothing and a rebase settles it
  either way. **I told BA/PM this edge is arguable and invited it to argue.**

I am being explicit about the difference because **earlier in this same round I called a preference a
forced edge and Architect/Design corrected me.** Repeating that after being corrected would be worse
than the original error.

## Why `ABC-019`'s owed items are not being routed yet

`ABC-019` is owed a new criterion **and a prohibition** — no constant-frame-width criterion, because
`W` varies by design and such a criterion would fail the *correct* build. That is a genuinely useful
prohibition and I want it written.

**But an Engineer is live in that worktree building `A9b`.** A BA/PM hop on the same ticket file
would reproduce `2cd84cd`. It waits for the branch to be free. Same for `ABC-016`'s one stale
rationale sentence, where QE is live. **Both are recorded as flags with named owners rather than
being spawned over a busy worktree.**

## Scheduling

Width **2 of 3** after the Architect finished: QE on `ABC-016`, Engineer on `ABC-019`. The third slot
goes to BA/PM for `ABC-027`'s cut plus `ABC-017`'s free text edit — a fresh worktree, touching
neither live ticket.

The queued `ADR-0009` transcription fix (cl. 9b and evidence (vii)) is Architect/Design's and is
**still queued, not dispatched**: it would be a second Architect hop and there is no free slot for it
that does not displace work already in flight.

## Not done

- Nothing deployed. `ADR-0010`'s merge is docs-only and added **zero `src/` bytes**.
- No ticket authored or amended by me; `ABC-027` is BA/PM's to cut, including its size and priority.
- No NFR row seeded — the Architect's reasoning (a per-frame correctness invariant with no target to
  miss belongs in a criterion, not the catalog) was accepted, not overridden.
- Nothing relayed between agents.
