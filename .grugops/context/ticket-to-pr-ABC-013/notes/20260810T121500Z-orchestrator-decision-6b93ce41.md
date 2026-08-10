---
id: 20260810T121500Z-orchestrator-decision-6b93ce41
kind: decision
by: orchestrator
at: 2026-08-10T12:15:00Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - ADR-0004
  - EPIC-002
  - src/san.ts
  - plans/board.md
  - plans/tickets/ABC-013-san-rendering.md
supersedes: 
---

# `ABC-013` PULLED `Ready for Dev` → `In Development`. The DoR is met on all ten rows — and this time I checked the instrument instead of believing it.

BA/PM returned an 18-correction repair and promoted the ticket. Before taking my own exit I verified
its structural claims independently, because **believing an instrument without checking the
instrument is this Orchestrator's documented failure mode on this board** — five times on `ABC-009`,
every one caught by the role I was checking.

## What I verified myself, and how

Ran outside the repository against merged `src/`, using the project's own `parseFen`, `toFen`,
`legalMoves`, `isInCheck`, `makeMove` and `unmakeMove`. No file under `src/` was touched.

**All 18 acceptance positions — clean on every axis:**

- all 18 `parseFen` without throwing and `toFen` **byte-identically** back to the FEN in the ticket
- in **none** of them is the side-not-to-move in check (so none is an illegal position)
- `legalMoves` is **pure** on every one — `toFen` unchanged across the call

**The three structural claims the hardest criteria rest on held exactly:**

```
P-QUEENS  movers reaching e1  = [e4, h1, h4]   → the A6 ladder Qee1 / Q1e1 / Qh4e1 is the right shape
P-PIN     movers reaching e4  = [g3] ONLY      → the d2 knight is genuinely pinned, so A7's "Ne4" is
                                                 unqualified for the stated reason
P-EP      e5 moves = [e5-e6 flags=0 cap=0,
                      e5-d6 flags=1 cap=9]     → the captured pawn is NOT on d6, which is the entire
                                                 mechanism A10 exists to pin
P-START   legal move count    = 20             → matches A1's exhaustive 20-string set
```

**The pinned benchmark position re-verified:**

```
P60 = 1rb4r/3k4/p1ppNn2/1p1np1Q1/1q1P1B1P/PRP2p2/3KP1BR/6N1 w - - 2 31
      roundtrip byte-identical: true
      legal moves: 42   (ticket pins 42)
      moves giving check: 3   (ticket pins 3)
      purity across a full make/unmake sweep of all 42: true
```

**Branch-tip gates, re-run by me at this hop:**

```
npm test           625 passed / 625 on 18 files
skip count         0
npm run lint       exit 0
npm run typecheck  exit 0
git diff --stat main..HEAD -- src/   →  ZERO files
main                                  →  eb706f9, untouched
```

That last line matters: **BA/PM repaired the ticket without touching the code**, so nothing was made
green by moving the thing being measured — the same property the last five merges on this board were
checked for.

## The single most valuable thing BA/PM found, and why it justified the hop

The old NFR bars were not merely stale. **A correct reference build FAILS both of them** under the
natural per-call reading — 9.34 µs against the 6.5 µs bar, 4.50 µs against the 0.20 µs bar, on a
checking piece move — because deciding `+` versus `#` requires a **second `legalMoves`** on the
position after the move, which is `ADR-0004`'s own definition of the mate suffix.

A bar no correct implementation can meet is not a build target; it is a trap that detonates at the
Security/NFR gate, after the code is written. My own opening note called the bars "stale" and
predicted the direction of travel was reassuring. **That reading was too shallow, and BA/PM's
measurement corrected it** — the problem was never drift, it was that the bars had no stated move
population and no aggregation. `N1`–`N4` now name both, and `N1` is a **ratio**, so it survives a
hardware change. Recorded because the pre-check being wrong in a *softening* direction is worth as
much as the defects it got right.

## Definition of Ready — GREEN, ten of ten

problem ✅ · scope + out-of-scope ✅ · INVEST ✅ · **acceptance clear, testable, measurable ✅ — 22
criteria, every one a literal FEN + a `from`-`to` move + an exact expected string, positions verified
above** · dependencies ✅ (`ADR-0004` accepted; `ABC-003`/`ABC-005` merged; no merge-order constraint)
· NFR triggers with measurable targets ✅ (`N1`–`N4`, position pinned, machine named) · test notes ✅
· size `M` ✅ · priority `P1` ✅ · no major unresolved blocker ✅.

**Not XL — no `SPLIT_REQUIRED`.**

## What is NOT verified, and it is the thing most likely to bite

**The 52 expected SAN strings.** I verified the *positions*; I did not verify the *notation*. Every
expected string was hand-derived and corroborated only by a reference build written by the same role
that wrote the rows — no external implementation, no PGN corpus, no specification text. BA/PM said so
itself and named `Q1e1`, `Qee1`, `Ne4` and `exd6` as the rows it would attack first.

**This is the exact dependency `ABC-023` broke.** There, the table's validating instrument was the
instrument of the role that wrote the rows, and QE's independent harness then found **fourteen**
builds that passed every criterion and the whole suite. Expect the same shape here. The engineer is
told explicitly: a disagreement with an expected string is a fork in the road to be written up, not a
bug to be coded around, and never a row to be quietly edited.

I also did **not**: reproduce any timing figure; verify the claim that nine wrong builds passed the
original thirteen criteria; check the 52 strings against the FIDE/PGN standard; or run `npm run perft`.

## One unexamined field, recorded rather than waved through

**`## Size and priority rationale` is byte-unchanged** and still describes the pre-repair ticket —
*"four disambiguation levels, two castle forms, four promotion pieces and two suffixes"* — after the
table grew 13 → 22 criteria, 1 → 18 FENs and 52 hand-typed rows. It was not re-derived.

`M` is nonetheless still right, and arguably more defensible than before: the repair moved the hard
part — constructing positions and deriving expectations — **out** of dev and into the ticket, so the
engineer transcribes rather than derives. Not blocking, not `SPLIT_REQUIRED`. Flagged so it is fixed
deliberately rather than discovered later, which is the shape of defect 4 in my opening note.

## Routing and width

One subtask enqueued: **`ticket-to-pr-ABC-013-dev` → Software Engineer (Workflow 04)**.

Width **1**, by dependency: there is one module to write and nothing else can proceed until it
exists. QE and Security/NFR come after, per Workflow 04. `queue.wip_limit` is 3; the room exists and
is deliberately unused.

## Board state after this note

`Ready` 0/8 · `Ready for Dev` **1/6 → 0/6** · `In Development` **0/3 → 1/3** · `Blocked` empty. Every
WIP limit respected. The outgoing `_Updated:` header was appended **verbatim** to
`plans/tickets/history/ABC-013-board-history.md` and byte-checked (3,117 chars, `in` test true)
**before** replacement, per the board's own rule — the rule that was violated twice on 2026-08-09.

The ticket front matter moved to `status: in-development` / `column: In Development` so the
board↔ticket contract does not drift.

## Not authorised

The owner said "go forward with ABC-013" and nothing else. **That is not a merge instruction** — the
last four hops each carried an explicit one and this does not. I will return to the owner at the merge
point. Nothing is deployed; a human holds deploy.
