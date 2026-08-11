---
id: 20260811T133000Z-architect-design-decision-4f7a26d1
kind: decision
by: architect-design
at: 2026-08-11T13:30:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-018
  - ABC-019
  - EPIC-002
  - ADR-0009
  - ADR-0010
  - NFR-002
  - memory-bank/50-decisions/ADR-0010-frame-width-stability-ownership.md
supersedes:
---

# RULED: the CONSUMER owns frame-width stability — `src/frame.ts`'s writer clears per row. `ADR-0010` accepted.

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or in the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Nothing in this task's notes is a
> `finding`** — no verification stamp is issuable to this role, and none is claimed. The measurements
> below were RUN; the disposition is a decision.

## The ruling

`ADR-0010` is **accepted**: `memory-bank/50-decisions/ADR-0010-frame-width-stability-ownership.md`.

**Neither of BA/PM's two candidates was adopted as framed.** Candidate (ii) — `ABC-018`'s writer
clears per row — is adopted; candidate (i) — the panel reserves its width — is rejected **by
measurement**, not by preference. Two candidates BA/PM did not name were constructed and scored, and
one of them (freeze `W` at frame 1, the width analogue of `ADR-0009` clause 9a) looked like the winner
until the scoring was corrected.

**The general rule the ADR actually establishes, which is bigger than this defect:**

> A frame quantity that composes by **SUM** is owned by its **PRODUCER**. A frame quantity that
> composes by **MAX** is owned by its **CONSUMER**.

`frameHeight` is a sum (`src/frame.ts:89`); `W` is a max (`:179`). A sum makes every producer's
contribution visible, so a per-producer guarantee is necessary, sufficient and checkable from outside
— that is `ADR-0009` clause 1 and it **stands**. A max makes every contribution but the largest
invisible, so a per-producer width guarantee is unverifiable from outside the panel and is green **by
masking** as its normal state.

## `ADR-0009` is cited and extended, never reopened

`ADR-0009`'s own `## Consequences` reserved this exact question: *"Which panel sets the frame's `W` is
a width question and is untouched here."* This hop answers it. **No clause of `ADR-0009` is struck,
reworded or reinterpreted.** Clause 1 is **confirmed for counts by the same measurement that denies it
for widths**, and clause 9 gains a stated scope: it governs row counts, and it works **because `H` is
invariant**. Measured over 510 shapes — `H` mismatches vs `frameHeight()` = **0**, `H` invariant under
the message region; `W` over the identical sweep = **4 distinct values**. That single asymmetry is why
clause 9a's `firstFrame.length` is sound and its width analogue is not.

## Why BA/PM was right to refuse to write a criterion

This is worth recording because it justifies the routing rather than merely complying with it.
**The correct criterion is downstream of the ownership decision, and the two candidates need opposite
criteria:**

- under *panel reserves* or *freeze `W`*, the right criterion is **"every frame's `W` equals the
  session `W`"**;
- under *writer clears*, `W` varies **by design** (measured `{24, 50}` over one game), so that same
  criterion would **fail the correct build**.

Writing a constant-width criterion into `ABC-016` would not have been picking a wording. It would have
picked candidate (i) and made the adopted fix a criterion violation.

## What each ticket is owed — named here, edited nowhere

**No file under `plans/tickets/` was read-modified at this hop; all four were read only.**

| ticket | owed | why | owner |
|---|---|---|---|
| **`ABC-016`** | **NOTHING that changes a criterion. Zero production lines.** | The width question is answered against the delivered panel and it is clear. `A7` (reserved thinking cell) **stands**. One *rationale* sentence is stale — `A7`'s stated reason, and the panel comment at `src/status-panel.ts:95-101`, justify the reserved cell by *"a cell that shrinks makes the whole frame breathe"*, which is no longer the reason. **Non-blocking.** | BA/PM, whenever convenient |
| **`ABC-017`** | **ONE ticket-text edit, and it is free exactly now.** `A2`'s constant-width assertion is **KEPT**; its parenthetical claim that the pane *"is expected to be the widest panel and therefore to SET `W`"* is **struck as measured FALSE** (`HISTORY_COLS` ≈ 21–24 against the delivered panel's 45 / 50 / 67 whenever a draw is claimable). | Unbuilt, in `Ready for Dev` — the ruling that changes it is cheap now and expensive after it is built. Same move as `ADR-0009` cl. 3/4: strike the cross-ticket clause, keep the panel-local half. | BA/PM |
| **`ABC-019`** | **YES — ONE new acceptance criterion, plus one explicit prohibition.** The criterion: over a played game containing a narrowing (a draw claim appearing then expiring), the **screen after every redraw equals the frame**. The prohibition: **NO constant-frame-width criterion.** | BA/PM flagged this as possible *if the ruling went the consumer way*. **It did, and `ABC-019` is owed.** It is the width counterpart of `ADR-0009` cl. 9e and, like 9e, the only place the property is checked at all. | BA/PM |
| **`ABC-018`'s module** | **The production change** — one expression in `beginFrameSession`'s in-place branch (`src/frame.ts:216`), plus its header sentence at `:27-29`, plus three test changes. | `ABC-018` is closed and merged, so **a home is owed and this ADR does not pick one**: a small new ticket landing before/with `ABC-019`, or attached to `ABC-019` where the defect first becomes reachable. | **Orchestrator routes** |

## Code that must change, and where — no `src/` byte was written here

- **`src/frame.ts`**, `beginFrameSession` in-place branch, `:216`. The emission becomes cursor-home,
  the rows joined by `\x1b[K`, then the single `\x1b[0J`. Measured **minimal and sufficient**: one
  `\x1b[0J`, one `write()` per frame, **+66 characters** (`(H − 1) × 3`), **0/24 stale frames** at
  both 80 and 120 columns. A trailing `\x1b[K` on the last row is **redundant** (`\x1b[0J` already
  clears the rest of the cursor's row) and is not added.
- **`src/frame.ts`** header `:27-29` — *"…without emitting a per-row erase"* becomes false and is
  edited with the line.
- **`src/frame.test.ts`** — three changes, and the first is **not optional**: the screen model
  **throws on any unmodelled escape** (`:187-188`, `:232-236`), so it must learn `\x1b[K` or the suite
  goes red; `:376`'s `occurrences(redraw, "\x1b") === 2` becomes **24**; and the file needs its **first
  narrowing fixture** — measured, its entire fixture space yields `W` ∈ **{18}**.

## NFR

**No new NFR row.** The property is a per-frame correctness invariant with no target to miss, so it
belongs in an acceptance criterion (`ADR-0010` cl. 7), not in the catalog. **`NFR-002` gains a
denominator note and no target change** — `< 16 ms` does not move, no bar is created/moved/loosened,
and **all eight table rows are byte-identical** (eight-line sha256 `1136d003…7c810` before and after;
`git diff --numstat` = 41 insertions / 0 deletions, all in a new dated section).

## Not done

- **Zero `src/` bytes written.** `git status --porcelain src/` = 0 lines. Every measurement ran on
  copies outside the repository.
- **No ticket edited.** No `plans/board.md` write. No traceability row.
- **`ADR-0009` not reopened**; no clause of it touched.
- **Nothing merged, pushed or deployed**; `main` never checked out.
- **Nothing relayed to the two live agents.** The `ABC-016` engineer's and the `ABC-019` BA/PM's
  branches were read via `git show` only; no channel was opened, and every cross-ticket item above is
  an on-disk flag with a named owner.
