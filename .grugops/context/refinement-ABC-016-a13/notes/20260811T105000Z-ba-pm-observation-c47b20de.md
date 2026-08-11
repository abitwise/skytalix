---
id: 20260811T105000Z-ba-pm-observation-c47b20de
kind: observation
by: ba-pm
at: 2026-08-11T10:50:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - A2
  - A6
  - EPIC-002
supersedes:
---

# `D19b` — a SECOND acceptance defect, found by checking the criteria `A13` was not about

> **Hand-authored**; an `observation` and not a `finding` — no verification stamp is issuable to me.
> The measurements below were RUN, out of tree, and the harness was deleted.

The subtask brief said the record on this board is that DoR blocks reading all ✅ have hidden 16, 18
and 25 defects, and that `A13` being the known one is not evidence the rest are sound. It was not.

## The gap, measured over all fourteen cases rather than eyeballed

I generated the matrix by **running** every case this ticket names, not by reading the list:

| plies | in check | captures | case |
|---|---|---|---|
| 0 | false | 0 | start position (×2, one thinking) |
| 1 / 2 / 1 | false | 0 | after `1.e4`, after `1.e4 e5`, after `1.Nf3` |
| **0** | **true** | 0 | **in check** (loaded FEN) |
| **0** | **true** | 0 | **checkmated** (loaded FEN) |
| 0 | false | 0 | loaded FEN at move 27, material −9, material +8 |
| 8 | false | **0** | threefold claimable |
| 0 | false | 0 | fifty-move claimable |
| 8 | false | **0** | both claimable |
| 0 | false | 0 | black may claim |

**Every case that is in check has an EMPTY move list. Every case with a move played is quiet and
capture-free. No case anywhere contains a single capture.**

## What that lets through

Items 2 (check indicator) and 5 (material) both read `history.position`. Item 4 builds a **second**
`Position` — the replay to ply *n*−1 — and holds it in scope. **A build that reads the indicator or
the balance from that replay position passes every criterion as they stood**, because the only cases
that would tell them apart do not exist on this ticket. It is not an exotic mutant: it is the natural
shortcut for an engineer who already has a `Position` in hand.

Measured on merged `src/` at the proposed case `1.e4 e5 2.Qh5 g6 3.Qxe5+`:

- **live** `rnbqkbnr/pppp1p1p/6p1/4Q3/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 0 3` — Black to move,
  `isInCheck` **true**, **3 legal replies**, `{result:"in-progress",reason:null}`
- **replay** `rnbqkbnr/pppp1p1p/6p1/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR w KQkq - 0 3` — **White** to move,
  `isInCheck` **false**

→ the replay-reading build renders **nothing**; the correct one renders `CHECK`. The case kills it.

**This matters more than a normal coverage gap because `A2` carries epic acceptance #3** — *"Given
the side to move is in check, when the board renders, then the status line states it explicitly"* —
which is the stated reason this ticket exists. Epic acceptance #3 is about a **played game**. Until
this case, nothing on the ticket proved the indicator on one. The irony is on the record: this
ticket's own `D13` correction (2026-08-10) is *specifically* about the loaded-FEN vs
reached-by-play distinction, and then every in-check case it wrote was a loaded FEN.

## The repair

One case appended to `A2`, pinning four cell strings in one render, measured on delivered code:

```
Black to move  3...  CHECK
last: Qxe5+  material: +1
```

It closes both halves at once — the **played check** (items 2 + 4 together) and the **only capture on
the ticket** (item 5 against the live board rather than the replay). Two `## Test notes` were added:
build it by **playing** the plies (loading the resulting FEN reproduces exactly the empty-move-list
shape that caused the gap), and put it in `CASES` so `A10`, `A11` and `A12` pick it up and it gets a
snapshot.

## THIS is what sends the ticket back to `In Development`

**Measured: the delivered `src/status-panel.ts` already renders this case correctly, so no production
line changes and the new case goes green on the code as it stands.** But the case is **unwritten**,
and an acceptance criterion with no test behind it is not met. The work is one `CASES` entry, one
assertion block of roughly a dozen lines, and a regenerated snapshot file — Engineer's, not QE's, in
line with how every other `A1`–`A14` assertion on this ticket was authored.

## Criteria I checked and did NOT change, so the absence is on the record too

`A1`, `A3`, `A4`, `A5`, `A7`, `A8`, `A9`, `A10`, `A11`, `A12`, `A14` were each read against the
delivered test and against "what wrong build survives this". No further defect found.

- `A3`'s `does NOT contain 1...` and `A4`'s `does NOT contain 1.` negatives are load-bearing and both
  are correctly placed; the `1...`-contains-`1.` substring trap is real and is handled.
- `A8`'s four rows are derived through the real `gameStatus` with a replayed Zobrist counts map, not
  asserted as status literals — stronger than the criterion requires, and correct.
- `A7`'s width clause is met by reserving the idle thinking cell's width. **It is also the only width
  clause on the ticket, which is the subject of a separate flag** — see this hop's `claim` note.
- `A11`'s *"read from the module's own export"* remains an instruction about the test file rather
  than an assertion a test can make, as the ticket already admits. Left as is: the alternative is
  worse and the 2026-08-11 amendment already reasoned it out.
