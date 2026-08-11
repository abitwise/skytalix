---
id: 20260812T143500Z-ba-pm-decision-five-gap-rulings-8d2f4b61
kind: decision
by: ba-pm
at: 2026-08-12T14:35:00Z
verified_by:
confidence: high
refs:
  - refinement-ABC-017-gaps
  - abc017-gaps-2026-08-12
  - ABC-017
  - ABC-019
  - ABC-027
  - EPIC-002
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history.ts
  - 20260812T101000Z-qe-e2e-observation-criteria-gaps-3d81f6a4
  - 20260812T102000Z-qe-e2e-decision-flags-and-verdict-8e47b3d5
  - 20260812T130500Z-security-nfr-decision-verdict-and-risks-9a4e28f1
  - 20260812T130000Z-security-nfr-observation-history-cols-re-derived-5d92f6b3
supersedes:
---

# The five gap rulings: FOUR CLOSED, ONE LEFT OPEN ON PURPOSE. Acceptance 13 → 14, nothing renumbered, nothing deleted.

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, no
> self-attested stamp — the §14 gate machinery does not exist in this repo.

Both gates returned **`PASS_WITH_RISKS` with ZERO code defects**. Every ruling below repairs what the
criteria **ASK**. **The Engineer is owed fixtures, not a fix**, and the pane needs no production line.

## `G1` ⭐ — CLOSED, in `A6`. Defect `D24`.

**Witness.** `WLEAD-A` returns **NINE ROWS** from a black-to-move anchor at every even ply count ≥ 16
and passes **734/734, and 740/740 on the merged tree** (QE's measurement, attributed). `WLEAD-B` puts
a phantom empty white cell atop every slid black-anchored pane — **`D5`'s class inverted, passed by
the criterion added FOR `D5`**. `WLEAD-C` does both.

**The structural gap, verified at source here rather than inherited:** `A6`'s two anchored fixtures
are **five plies each** (`src/history-pane.test.ts:193-208`), so the window never slides; `A1`'s ten
lengths are built by `deterministicGame` / `shuffleGame`, **both `newGame(START_FEN)`** (`:88`,
`:108`); `A2`'s wide black cell is **one** ply (`:164`, `:180`). **No criterion combined a
black-to-move anchor with a game long enough for the window to move**, so the pane's
`+ leadingHalfRow` / `- leadingHalfRow` terms were exercised only where they are no-ops.

**Why it is the one with a blast radius.** A nine-row pane breaks the frame-height contract that is
this ticket's entire reason for existing, and **`A13` cannot see it** — `A13` composes the exported
**constant** `HISTORY_ROWS`, never the pane's **output**. Security/NFR's `AR-2` adds the consequence:
`ADR-0009` cl. 5's `= 23` tripwire has a hole exactly here, and **the first detector would be
`ABC-019`'s clause-9 session-height assertion firing at runtime and naming the wrong subsystem.**

**The ruling.** A **fourth anchor row** in `A6`'s table: the same knight cycle from
`ANCHOR_27_BLACK`, carried to **20 plies** instead of five, requiring (i) exactly `HISTORY_ROWS`
rows, (ii) the ordered list **30, 31, 32, 33, 34, 35, 36, 37**, and (iii) **row 1's white cell NOT
empty**. That is QE's specified shape — one fixture, three assertions — and it kills all three
survivors.

**The numbers are WITNESSED, not derived.** I did the arithmetic first, then measured the delivered
pane out of tree, because a criterion carrying a number nobody ran is how this ticket has been wrong
before:

```
[  30. Nc3     Nb8    ]   [  34. Nc3     Nb8    ]
[  31. Nb1     Nc6    ]   [  35. Nb1     Nc6    ]
[  32. Nc3     Nb8    ]   [  36. Nc3     Nb8    ]
[  33. Nb1     Nc6    ]   [  37. Nb1            ]
```

Eight rows, all 21 characters, moves **27/28/29 slid out** — three rows, so an off-by-one in either
correction term is still visible. **Twenty plies rather than the minimum sixteen** on purpose: at 16
only one row has slid. The same cycle from the **white** anchor at 20 plies renders 29–36, which is
the contrast that makes the ANCHOR, not the length, the thing under test.

**Why `A6` and not `A1`, and why no new criterion.** `A1` enumerates **lengths** and is accurate as
scoped — its *"in every case"* means its own ten cases. The gap is the **product** of two dimensions,
and the anchor is `A6`'s subject. `A1` is **not edited**; `A6`'s existing *"in none of the three"*
became *"in none of the **first three**"*, a one-word repair that keeps the delivered three-anchor
loop valid — **so no existing assertion changes**, which matters because QE proved that loop is the
sole catcher for `WPHANTOM`.

## `G2` ⭐ — CLOSED, by NEW criterion `A14`. Defect `D25`.

**Witness.** `WFREEZE` and `WSPLICE` each **survive 734/734 and 740/740**. The trap resolution is the
substance here and it has its own note — `20260812T144000Z-ba-pm-observation-g2-trap-resolved-…`.
Summary: three properties were riding on two criteria, and **freshness** — which by construction
requires ONE object rendered twice ACROSS a mutation — is the one that was unnamed and was being
supplied **accidentally** by fixture sharing in `A11`'s file. Giving it its own criterion with its
own deliberately-shared object dissolves the contradiction: **`A11` can now be tidied to per-test
fixtures freely and nothing is lost.**

**`A14` measured on delivered code** (out of tree): first render's last row `[  37. Nb1            ]`,
then `playMove`, then `[  37. Nb1     Nc6    ]`; the panes differ; `moves.length` is 21. **The
delivered pane already passes.**

**Scope discipline applied honestly.** One test, one object, three assertions, no production line, no
new file. Against that: the failure it catches destroys the feature's whole purpose in its only
consumer, silently, from move 2 of every game, and `playMove` mutates in place
(`src/history.ts:85-88`) so `ABC-019`'s loop hands the **same object** every frame. **That is not
bloat; it is the cheapest possible guard on the ticket's own value proposition.**

## `G3` — CLOSED, inside `A9`. Defect `D26`.

**Witness.** `WFENSET` — rewrites the caller's `history.initialFen` on every render — **SURVIVED
734/734**. `GameHistory` is `{ initialFen, moves, position }` (`src/history.ts:34-46`, read here) and
`A9` named two of the three.

**Two clauses, not one, because the second is the same class and was also open.** (i) `initialFen`
joins the snapshot — it is not an incidental third field, it is **the anchor**, the input `A6`, `D4`
and `D5` all turn on. (ii) `A9`'s non-mutation is a **before/after** snapshot, so a pane that mutates
and **restores** is invisible to it — `WSPLICE` walks straight through, and the ticket's claim that
`A11` catches *"mutates the caller's state mid-render"* was true only for the `takeBack` route,
because `A11` spies `takeBack`/`playMove` and **raw array operations are neither**. The criterion now
says **"at no point DURING a render"**, which a snapshot cannot satisfy.

**This is `A9`'s THIRD timing repair** — `D10`/`D11` fixed a snapshot taken too late, `D23` fixed
fixtures rendered too early, and this fixes a comparison taken too coarsely. Recorded as a pattern
because a fourth would mean the criterion is the wrong shape rather than the wrong words.

## `G4` — CLOSED at the criterion level, in `A11`. Defect `D27`. **The `RF-1` verdict has its own note.**

QE said *"criterion is right; I would leave it and record the choice."* **I disagree, and the reason
is a defect neither gate named**: the clause was **measurably false** as worded. Full ruling and the
split in `20260812T144500Z-ba-pm-decision-rf1-verdict-…`.

## `G5` / `AR-4` — LEFT OPEN, UNOWNED, DELIBERATELY. No defect number, because it is not one of mine to fix.

**Witness.** `WCOLS24R` (self-consistent 24 columns, padded on the **right**) **survives 740/740** —
Security/NFR re-derived it on the rebased tip, so **`ABC-027` merging did not close it either** and
the six tests `ABC-027` added see nothing. `WCOLS24M` (widened in the middle) is killed ×7. The
exposure is **uncaught, not narrowly caught**, and the failure is silent.

**The ruling is to leave it, and the ruling is deliberate.** `HISTORY_COLS` **HOLDS at 21**. No
widening. **No criterion on this ticket or any other.** No constant-FRAME-width criterion anywhere —
`ADR-0010` cl. 5 refuses it and `W` varies by design. `ADR-0009` and `ADR-0010` read and **not
re-opened**.

**Why not home it here.** The restraint is **cross-ticket**: 21 rather than 24 was chosen at
`ADR-0010` because 24 **masks** the status panel's width swing (0/20 stale frames against 8/20), and
masking `ABC-027`'s defect is not fixing it. **A restraint taken for another ticket's benefit cannot
be guarded by a criterion on this one.** Security/NFR left it unhomed saying *"recording a fake owner
to satisfy the format would be worse than saying so"* — **upheld.** It stays an unhomed
Architect/Design question, and the brief was right that tidying it into a false home would be worse
than the honest gap.

## Criteria count: 13 → 14

`A1`…`A14`, in order, **nothing renumbered and nothing deleted** — verified mechanically after the
edits. `A14` is the only criterion cut. `A1`, `A2`, `A3`, `A4`, `A5`, `A7`, `A8`, `A10`, `A12` and
`A13` are **untouched**; `A6`, `A9` and `A11` gained text at their own sites.

## Boundary held

**Zero production lines and zero test lines.** `src/history-pane.ts` md5
`54fd4346dcc1a0060c4e66ae0149265d` before and after; `git status --short -- src/` empty. Nothing
under `src/` was written, no test was written, `plans/board.md` was **not** written,
`plans/nfr-catalog.md` and `memory-bank/50-decisions/` were **not** written, and `ABC-016`, `ABC-019`
and `ABC-027` were **not** edited. `ADR-0009` and `ADR-0010` were read and **not re-opened**.
