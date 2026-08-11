---
id: 20260812T164500Z-qe-e2e-observation-new-criteria-gaps-5e18a3c7
kind: observation
by: qe-e2e
at: 2026-08-12T16:45:00Z
verified_by:
confidence: high
refs:
  - quality-gate-ABC-017-narrow
  - ABC-017
  - ABC-019
  - EPIC-006
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - src/history.ts
  - 20260812T143500Z-ba-pm-decision-five-gap-rulings-8d2f4b61
  - 20260812T144000Z-ba-pm-observation-g2-trap-resolved-6e13a8d5
supersedes:
---

# FOUR gaps in the FOUR NEW criteria — every one of them routes to BA/PM. ZERO code defects, again.

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, no
> self-attested stamp. **Every gap below is in what a NEW criterion ASKS, not in what the Engineer
> BUILT** — the delivered pane is correct on every one of these inputs and I verified that separately
> for each. Reported to BA/PM as the brief directs.

**The pattern this ticket keeps producing holds one more time.** `D24`/`D25`/`D26` each closed an
input class by pinning **one point** in it. Three of the four new rows pin a point and leave the rest
of the class open, and the fourth has a scope that its own guard disagrees with.

## GAP A ⭐ — `A6`'s fourth anchor pins ONE PARITY. `WLEAD-ODD` survives 744/744.

**The build.** `const leadingHalfRow = blackToMoveAtAnchor && plies % 2 === 0 ? 1 : 0;` — the
leading-half-row correction applied at **even** ply counts only.

**Verdict: SURVIVES 744/744, skip 0.**

It renders `A6`'s brand-new fourth anchor **perfectly**, because that fixture is **20 plies — an even
number**:

```
20 plies (EVEN — A6's new fixture)      21 plies (ODD — reached by no criterion)
[  30. Nc3     Nb8    ]                 [  30.         Nb8    ]   <- phantom empty white cell
[  31. Nb1     Nc6    ]                 [  31. Nb1     Nc6    ]
[  ... ]                                [  ... ]
[  37. Nb1            ]                 [  37. Nb1     Nc6    ]
```

**That top row is `WLEAD-B`'s defect exactly** — the phantom empty white cell, *"`D5`'s class
INVERTED, passed by the criterion added FOR `D5`"* — reproduced one parity over and passing the
criterion cut to catch it. It also silently drops the `Nc3` ply off the top of the window.

**Why the parity is a real dimension and not a mutation-testing artefact.** From a black-to-move
anchor, ply *i* is white iff *i* is odd, so the **last** ply is white iff the ply count is **even**.
`A6`'s fourth anchor at 20 plies therefore has a **trailing half-row** (`37. Nb1` alone) as well as a
slid window. **The black-anchored, slid, full-last-row case — odd ply count — is reached by no
criterion on this ticket**, exactly as the black-anchored slid case was reached by none before `D24`.
The two correction terms interact with the trailing half-row, which is why one parity does not stand
in for the other.

**The delivered pane is CORRECT there, measured rather than assumed:** every odd black-anchored
length from 17 to 61 renders 8 rows of 21 characters, consecutive move numbers, the right final move
number, and a full last row — 24 lengths, zero defects. **This is a criteria gap, not a code defect.**

**The cheapest shape that closes it** (BA/PM's call, not mine): the fourth anchor's fixture carried
to **21** plies as a fifth row, or the same three assertions repeated at one odd length. One fixture,
three assertions, no production line — the same cost as `D24` itself.

## GAP B ⭐ — `A14` does not survive its own load-bearing premise. `WCACHE-LEN` passes `A14` exactly.

**The build.** A cache memoising rows per `GameHistory`, **invalidated when `moves.length` changes** —
which is the cache a competent engineer actually writes, and more natural than the naive `WeakMap`
that never invalidates.

| suite | `WCACHE` (naive) | `WCACHE-LEN` (length-keyed) |
|---|---|---|
| **full suite (744)** | KILLED ×3 — `A14` + 2 incidental `A11` | **KILLED ×2 — the 2 incidental `A11` kills ONLY** |
| **`src/history-pane.test.ts` alone — `A11`'s file NOT loaded** | **KILLED ×1 by `A14`** (17/18) | **SURVIVES 18/18** |
| control: delivered pane, same single-file run | 18/18 green | 18/18 green |

**So `A14` does not see a length-keyed cache at all. Its only catcher in the entire project is the
incidental fixture sharing in `A11`'s file** — the very thing `D25`'s ruling declared free to remove.

**BA/PM's ruling and the Engineer's check, judged separately, because the brief asked me to judge the
MEASUREMENT and not re-argue the preference:**

- **The Engineer's measurement is RIGHT and I reproduced it exactly** — naive `WCACHE` dies on `A14`
  with `A11`'s file not loaded, `1 failed | 17 passed (18)`, his figure to the test. He measured what
  he said he measured.
- **The GENERALISATION drawn from it does not follow.** The ticket now states *"`A11` can now be
  tidied to per-test fixtures freely and nothing is lost"* and *"`WCACHE` still fails with `A11`'s
  file unloaded, so `A14` owns freshness alone."* **`A14` does not own freshness alone.** It owns
  freshness against a cache that never invalidates. Tidy `A11` to per-test fixtures and `WCACHE-LEN`
  has **zero catchers in the project**.
- **The Engineer's DECISION to decline the tidy-up was therefore correct**, and correct for a stronger
  reason than the three he gave (scope, cost, `D23` inapplicability): the guard is **not redundant**.

**The comment now standing in the delivered file is the live hazard, and it is worse than the bare
fixture it replaced.** `src/history-pane.nfr.test.ts:106-112` reads *"THE SHARING HERE IS NO LONGER
LOAD-BEARING, and that is now measured rather than argued … So these may be rebuilt per test
freely."* **That is an explicit, signed invitation to delete the sole catcher for `WCACHE-LEN`** — the
exact failure QE raised `G2`'s trap to prevent, now written into the file in a form a future reader
will trust *because* it says it was measured.

**The consumer path is real and it is on the board.** Measured on the delivered pane:

```
render 1, last row:                                    "  37. Nb1            "
after playMove b8c6:                                   "  37. Nb1     Nc6    "   moves.length 21
after takeBack(1) + a DIFFERENT move g8f6:             "  37. Nb1     Nf6    "   moves.length 21
```

**Same `moves.length`, different content.** `EPIC-006` owns `undo`, `A7` already requires `takeBack`
by name, and a length-keyed cache shows the move the player just took back. Not a contrived input —
it is undo.

**The shape that would close it** (BA/PM's, not mine): `A14`'s freshness clause stated over a
**mutation that does not change `moves.length`** — `takeBack` then a different `playMove` — rather
than over an append. One extra pair of lines in the criterion `A14` already owns.

## GAP C — `A9`'s *"at no point DURING a render"* is closed for the CONTENTS of `moves` and open everywhere else. FOUR survivors.

`D26` correctly diagnosed that a before/after snapshot cannot express an interval, and the freeze is
the right *kind* of instrument. But the criterion's own words scope it to *"the caller's `moves`
array"*, and the instrument scopes it to that array's **contents**:

| build | mutates DURING the render and restores before returning | verdict |
|---|---|---|
| `WFENMID` | `history.initialFen` | **SURVIVES 744/744** |
| `WPOSMID` | `history.position.fullmoveNumber` and `.blackToMove` | **SURVIVES 744/744** |
| `WBOARDMID` | `history.position.board` — a `Uint8Array` | **SURVIVES 744/744** |
| `WMOVESWAP` | swaps the `history.moves` **property binding** to a copy and back | **SURVIVES 744/744** |

**`WMOVESWAP` is the one inside the criterion's own stated scope**, and it is an instrument gap rather
than a criterion gap: `Object.freeze(history.moves)` freezes the array the property currently points
at; it does not make the property non-writable, so reassigning `history.moves` is untouched by it.
The other three are outside the criterion's stated scope and are therefore BA/PM's to rule.

**`WBOARDMID` is the one with the loudest existing contract.** `src/history.ts:39-45` documents
`position` as *"Live, forward-applied, BORROWED — never a snapshot. Read it; never mutate it"* and
says in terms that *"`readonly` stops reassignment, it does not stop `history.position.board[0] = 0`,
and there is no deep-readonly for a `Uint8Array`."* **The module states the hazard; no criterion on
this ticket guards it during a render.**

**Honest severity: LOW, and I will not inflate it.** All four restore before returning, and this
renderer is single-threaded, so no consumer observes the intermediate state today. What makes them
worth reporting is not present harm — it is that they are **precisely the class `D26` was cut to
close**, they survive the criterion that closed it, and `D26` is already `A9`'s **third** timing
repair. The Engineer predicted a fourth would not arrive because the instrument changed *kind*; he
was right about the kind and the residual is one of **coverage** instead. He named `position` himself
as the remaining exposure — this measures it, and adds three more.

## GAP D — `A11`'s corrected scope and its own guard disagree about `perft-bench.ts`

`WPERFT-DYN` (`void import("./history.ts")` in `src/perft-bench.ts`) **SURVIVES 744/744**. The
criterion says *"zero runtime importers AMONG THE PRODUCTION MODULES"*, and **"production module" is
still undefined on the ticket** — `D27` defined *"runtime importer"* exhaustively and left the other
half of the phrase open. The delivered regex's filter treats `perft-bench.ts` as production; the load
probe's roots exclude it. Full detail and the connected reason it cannot simply be added to the roots
are in the probe note.

**This is `D27`'s own shape, one phrase over: a clause whose scope word was never defined, so two
guards implementing it disagree.** It is BA/PM's to rule, and the ruling can legitimately be *"the
benchmark harness is out of scope, say so in `A11`"* — which costs one clause and no test.

## What I checked and found HEALTHY, so it is not re-swept

- **The delivered pane is correct at every odd black-anchored slid length 17–61** — 24 lengths, 8
  rows of 21 characters each, consecutive numbers, correct final move number, full last row.
- **`A6`'s fourth anchor numbers are exact** — 30…37, row 1 white cell `Nc3`, row 8 `37. Nb1`,
  21 characters, moves 27/28/29 slid out. Third independent confirmation.
- **`A14`'s panes are exact** — `37. Nb1` → `37. Nb1 Nc6`, panes differ, `moves.length` 21.
- **The `A6` three-anchor `not.toContain(1)` loop is unchanged character for character**, so the
  `WPHANTOM` catcher I proved last pass is intact, and the fourth anchor is correctly a separate `it`
  rather than being added to that loop.
- **`A14`'s object is separate from `A6`'s** (`blackAnchorTo(20)` called twice), so the `playMove` in
  `A14` cannot corrupt `A6` through test order.

## `src/history-pane.ts:30`'s unqualified comment — I AGREE it should stay flagged and unchanged

The brief asked. *"so `src/history.ts` keeps its zero runtime importers"* carries the phrasing `A11`
was corrected for at `D27`, and the brief's reading is that changing it moves the md5 and no criterion
asks. **Agreed, for a reason worth adding:** the sentence is **true as scoped to the pane's own
contribution**, which is the thing the comment is about, and the zero-production-lines property has
now been asserted by four roles across three hops and is load-bearing evidence that both gates'
figures still describe the delivered tree. **Changing one byte to improve a comment would cost that
for nothing.** If it is ever corrected it belongs on a hop that already touches production, and
`src/status-panel.ts:24`'s *"IT ADDS NO RUNTIME IMPORTER"* is the phrasing that should win — as the
ticket already says.

## ZERO CODE DEFECTS

`src/history-pane.ts` is correct on every input I could construct at this hop, including all four
classes above. **Every survivor here is a gap in what a criterion asks or in what a guard reaches, and
none is a bug in the build.** The Engineer's fixture hop did exactly what it was owed; what is left is
what the new criteria still do not ask about.
