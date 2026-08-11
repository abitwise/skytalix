---
id: 20260812T010500Z-software-engineer-observation-b83f2e14
kind: observation
by: software-engineer
at: 2026-08-12T01:05:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-017-dev
  - ABC-017
  - ABC-016
  - ABC-027
  - ABC-019
  - ADR-0009
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - plans/board.md
supersedes: 
---

# Criteria met and not met, three flags carried, and the board move requested

> Hand-authored; `scripts/context-io.ts` is absent. Not a `finding`.

## The verdict, criterion by criterion

| # | criterion | verdict |
|---|---|---|
| `A1` | `HISTORY_ROWS` rows at ten lengths, `= 8`, read from the export | **MET** |
| `A2` | constant `HISTORY_COLS` width, blank row is spaces, 0 = 300 | **MET** |
| `A3` | the exact eight rows and all sixteen cells of the 20-ply line | **MET** |
| `A4` | the 19-ply odd case, trailing half-row, no black ply in a white cell | **MET** |
| `A5` | move numbers 33–40 at 80 plies, as ordered integers | **MET** |
| `A6` | three anchors decide the numbers and the columns; leading half-row | **MET** |
| `A7` | `takeBack(2)` and `takeBack(1)`, both arities | **MET** |
| `A8` | top alignment at 1 and 3 plies | **MET** |
| `A9` | byte-identical twice; snapshots taken BEFORE the first render | **MET** |
| `A10` | zero code points above `U+007F`, unconditionally, on the pane's rows | **MET** |
| `A11` | the spied call counts, and the type-only import | **MET** |
| `A12` | the three-part cost bar | **MET** — parts 1 and 2 measured out of tree with the machine named, part 3 asserted in the suite. **Security/NFR owns the verdict** |
| `A13` | the composition fit-check, all three terms from delivered geometry | **MET IN PART** — `board` and `history` are live and the `<= 24` clause is added; the `status` term cannot be made live until `ABC-016` merges |

Twelve of thirteen met; one met in part for a reason the ticket's own `## Dependencies` predicted in
advance (*"`A13` is not evaluable until `ABC-016` has merged"*). The detail is in the `A13`
`decision` note.

## Three flags carried, none blocking, none acted on

**1. `A13`'s remaining term is owed at the rebase, and it is a re-gate obligation and not a
formality.** `ABC-016` and `ABC-027` both merge before this ticket. After the rebase, two edits are
owed in `src/frame.test.ts` (the `STATUS_ROWS` import and the `statusStub` sizing — both named in a
docblock at the constant's own site) and the suite must be re-run. This is the same shape as
`ADR-0009` cl. 9f's real-panel re-gate for `ABC-019`: green against a shadow is not evidence about
the delivered panel. **Owner: the Orchestrator sequences it; the engineer of the rebase hop does it.**

**2. A small defect in `A3`'s last clause, FLAGGED AND NOT AMENDED. BA/PM owns the ticket text.**
`A3` ends *"and the pane contains **neither** `e4 e5` **nor** `Nf3 Nc6`"*. Under any layout with
padded columns — which `A2` and `A3`'s own sixteen-cell requirement together force — those two
literal strings **never appear no matter what the pane renders**, because the SAN cells are not
separated by a single space. Measured on the DELIVERED pane at 3 plies — a pane that *does* contain
moves 1 and 2 in full:

```
[   1. e4      e5     ]   contains "e4 e5"   -> false
[   2. Nf3     Nc6    ]   contains "Nf3 Nc6" -> false
```

and `W15`, the build that shows the FIRST eight move numbers instead of the most recent, satisfies
both clauses for the same reason. The clause is vacuous as worded. **It is not a hole in the suite** — the row list and the ordered move numbers
`[3..10]` are what actually bind, and `W15` was killed by eight assertions — but a later reader
should not take that clause as protection. Suggested repair, for BA/PM and not taken here: state it
as move NUMBERS (*"no row is numbered 1 or 2"*), which is the form `A5` already uses and the form
that survives a layout change.

**3. `src/history.ts` now has TWO test-file runtime importers, not one.** `src/history.test.ts` and
`src/history-pane.test.ts`. The ticket's Security/NFR block instructs the gate to re-verify the
importer fact by `grep` on delivered code; the second hit is this ticket's and is expected. The
claim `NFR-002` rests on — **zero PRODUCTION runtime importers** — is unchanged and is now asserted
in the suite against delivered source. Detail in the measurement note.

## Declined, with the reason recorded

- **I did not simulate `A13`'s M1, M6 or M7 by editing the `STATUS_ROWS` shadow.** Their mutation
  lives in a module that does not exist; mutating the assertion's own input would have measured the
  assertion against itself and produced a table that looks complete and proves nothing. They are
  reported as **not evaluable on this branch** instead.
- **I did not size `statusStub` from the constant now.** It is correct today at three rows and the
  edit belongs with the `STATUS_ROWS` swap it exists to protect. Splitting the two across two hops
  is how the second half gets forgotten; both are named in one docblock at one site.
- **I did not add `HISTORY_COLS` padding to reach 24 columns.** `ADR-0010` cl. 2 forbids a panel
  declaring a frame width, and 24 was measured there to MASK the status panel's own swing.
- **No `finding` was written.** No `§14-gate#<id>` stamp exists for this hop and none was invented.

## What was NOT re-opened

`ADR-0009` and `ADR-0010` are both accepted and neither was re-litigated. The struck
widest-panel/SET-`W` reasoning was **not** reintroduced in code, comment or note — `HISTORY_COLS`'s
justification in the module header is panel-local (`A3` asserts sixteen cells in fixed columns) and
explicitly points at `ADR-0010` cl. 1 for the frame-level half. **No constant-FRAME-width criterion
or assertion was added anywhere**, per the prohibition on this ticket.

## Sizing

`S` (2) held. No stop condition fired: the criteria defect found is non-blocking and flagged, no
gate went red at any point, and the work did not grow — two test files as declared, one new
production module, no new dependency, no architecture change.

## Board move requested — NOT taken here

**`ABC-017`: `In Development` → `In Review`.** `plans/board.md` is the Orchestrator's and was not
written. `plans/traceability.md`'s `ABC-017` row was updated by this role as Workflow 04 requires —
one line changed, pipe count and table line count asserted unchanged before the write.

The merge chain is unaffected: this ticket still merges after `ABC-016` and `ABC-027` and before
`ABC-019`, and the rebase onto `ABC-027` should be clean by construction — the two tickets' edits to
`src/frame.test.ts` are in disjoint regions and none of `ABC-027`'s claimed lines was touched.
