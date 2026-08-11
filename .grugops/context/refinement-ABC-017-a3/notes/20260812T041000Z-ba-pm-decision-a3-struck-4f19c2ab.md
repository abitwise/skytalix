---
id: 20260812T041000Z-ba-pm-decision-a3-struck-4f19c2ab
kind: decision
by: ba-pm
at: 2026-08-12T04:10:00Z
verified_by:
confidence: high
refs:
  - refinement-ABC-017-a3
  - abc017-review-2026-08-12
  - ABC-017
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - 20260812T010500Z-software-engineer-observation-b83f2e14
  - 20260812T030000Z-orchestrator-decision-e2b48c17
supersedes:
---

# `A3`'s last clause is STRUCK, not reworded — and the Engineer's suggested repair was measured and rejected

> **HAND-AUTHORED.** `scripts/context-io.ts` does not exist in this repo, and the kit has no
> `scripts/` directory at all (`$GRUGOPS_HOME/agent-factory/scripts/` is absent).
> `mcp__grugops__propose_note` is not in this session's tools. Workflow 16 names `context-io.ts` as
> the sanctioned writer; it is absent, so this note is written by hand and says so.
> **Nothing here is a `finding`** — no `§14-gate#<id>` stamp exists for this hop and none was invented.

## The ruling

**Delete the clause. Do not reword it.** The replacement text is prose, not an assertion:

> The eight rows above are the WHOLE of what this criterion asserts about the pane's content. Moves 1
> and 2 are absent because the table begins at `3.` and ends at `10.`, and for no other reason.

## Why a rewording cannot work, measured rather than argued

All four candidate forms were run against `W15` — the wrong build that shows the FIRST eight move
numbers instead of the most recent, which is the build the clause reads as if it were guarding
against.

| clause form | verdict on `W15` | can it ever be the discriminator? |
|---|---|---|
| the exact eight-row table (asserted FIRST) | **FAIL** | **yes** — it is the criterion |
| `contains neither "e4 e5" nor "Nf3 Nc6"` — **as the ticket words it** | PASS | **no** — no build can fail it |
| `not.toContain("1. e4 e5")` on whole normalised rows — **as delivered** | **FAIL** | **no** — the table fails first |
| `no row is numbered 1 or 2` — **as the Engineer suggested** | **FAIL** | **no** — the table fails first |

**The ticket's form is vacuous absolutely.** `A2` plus this criterion's own sixteen-cell requirement
force padded fixed columns, so two SAN cells are never separated by a single space. Measured on the
delivered pane at 3 plies — a pane that *does* show move 1 in full — `contains("e4 e5")` is `false`.

**The delivered form and the suggested form are vacuous by PRECEDENCE.** Both are falsifiable in
isolation, and both are strictly implied by the eight-row `toEqual` asserted above them in the same
`it`. A failing assertion ends the test, so on `W15` the table reports and they never run. Confirmed
by running: `A3` fails with *"expected [ '1. e4 e5', '2. Nf3 Nc6', …] to deeply equal [ '3. Bc4 Bc5',
…]"* and nothing else from that block is reported.

**The general form of it:** once a criterion pins all eight rows exactly, every statement about what
the pane does **not** contain is a logical consequence of the table. There is no position inside `A3`
where such a clause can carry information.

## One correction to the Engineer's note, small and worth having

`20260812T010500Z-...-b83f2e14` illustrates the vacuity with

```
[   1. e4      e5     ]   contains "e4 e5"   -> false
[   2. Nf3     Nc6    ]   contains "Nf3 Nc6" -> false
```

**at 3 plies.** At 3 plies the second row is `2. Nf3` alone — `Nc6` is the fourth ply. The rendered
pair shown requires **4** plies. The conclusion is unaffected and correct; the fixture is off by one.

## Nothing is lost, and that was checked rather than assumed

`A5` asserts the eight most recent move numbers of the 80-ply game as an ordered list of integers, and
it is **the only assertion in its `it`**, so it reports its own verdict. Measured on `W15`:
*"expected [1,2,3,4,5,6,7,8] to deeply equal [33,…,40]"*. **`A5` is where "the window has slid" is
guarded, and it is guarded there non-vacuously.**

## Disposition

**Wording only. This defect on its own would leave `ABC-017` in `In Review`.** The ticket moves
back to `In Development` for a different reason — see the `A1`–`A12` sweep note, D23.
