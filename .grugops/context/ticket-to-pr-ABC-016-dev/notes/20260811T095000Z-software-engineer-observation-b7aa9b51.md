---
id: 20260811T095000Z-software-engineer-observation-b7aa9b51
kind: observation
by: software-engineer
at: 2026-08-11T09:50:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-019
supersedes:
---

# Criterion-by-criterion status, the board move I am REQUESTING, and what I did not do

> **Hand-authored**; not a `finding`. The verdict on any of this is the §14 gate's and BA/PM's.

## Where each acceptance criterion stands, in my assessment

| # | Criterion | State | How |
|---|---|---|---|
| `A1` | side to move, both ways | **met** | both directions, each with the negative |
| `A2` | CHECK on plain check, on mate, not on a quiet board | **met** | all three FENs, including the plain-check one that kills a `reason === "checkmate"` build |
| `A3` | move number both ways | **met** | three cases; the `does NOT contain 1...` clause carried |
| `A4` | move number from a loaded FEN | **met** | fullmove 27 with an empty move list, and the `1.` negative |
| `A5` | last move in SAN, and the live board survives | **met** | `toFen` snapshot taken BEFORE the first render |
| `A6` | material as exact integers | **met** | all three FENs including the promotion case |
| `A7` | thinking cell, one test, row count AND widest width | **met** | same position and history, both states |
| `A8` | claim cell, four cases, each asserting the other rule's absence | **met** | statuses derived through `gameStatus`, not asserted as literals |
| `A9` | the claim is the side-to-move's | **met** | `Black may claim: fifty-move rule` |
| `A10` | purity and determinism | **met** | over all 14 cases: byte-identical, `toFen` and `moves.length` unchanged |
| `A11` | exactly `STATUS_ROWS` rows, `STATUS_ROWS` is 3, read from the module's export | **met** | imported, never shadowed |
| `A12` | ASCII on the panel's OWN rows | **met** | on returned rows, never through `assembleFrame`; counted through the spread |
| `A13` | the panel derives nothing, as call counts | **NOT FULLY MET** | every clause met except `isInCheck` exactly 1 — see this hop's `claim` note; **defect in the criterion, flagged for BA/PM** |
| `A14` | the cost bar holds when measured | **met** | 5.68 / 8.07 / 9.94 µs at 40 / 120 / 300 plies, 0.40x of the bar, 1.75x spread |

**13 of 14 met; `A13` partially met with one clause flagged as defective.**

## The board move I am REQUESTING, not making

**`ABC-016`: `In Development` → `In Review`.** `plans/board.md` was **not written by this hop** — it
is the Orchestrator's alone, two engineers share this repo's branches this wave, and an unanchored
board edit is the exact error the Orchestrator recorded against itself at
`20260811T084500Z-orchestrator-decision-4c1a9f02` §4. My own row in `plans/traceability.md` **was**
updated, three cells, with the anchor asserted unique by line equality, the row's pipe count asserted
unchanged, every appended string asserted pipe-free and newline-free before the write, and all 34
other table lines asserted byte-identical by md5 afterwards. **No other row was touched.**

The move is requested **with the `A13` flag attached**, not in spite of it: whoever reviews should
see the defect before the column changes, and BA/PM may reasonably want the amendment before
`In Review` rather than after.

## Two things worth carrying to the next hop, neither of them mine to take

- **The merge-order flag `ABC-016` already carries is now live.** This ticket is the FIRST of the
  three to be buildable, and `ADR-0009` clause 5 puts the composition fit-check on the panel that
  merges SECOND — `ABC-017`, which is `P2` and whose own text calls it *"the right thing to drop
  first if this epic runs long."* Between this merge and `ABC-017`'s, the only delivered guard on
  `4b`'s 24-row budget is `A11`'s `= 3` clause, which sees a `status` change and is blind to a
  `history` or `board` one. **Unchanged by anything I did — restated because it stops being
  hypothetical the moment this branch merges.** Owner: the Orchestrator.
- **`ABC-019` is owed one line on its side** saying its render seam passes the status it just
  computed, per this ticket's `## Dependencies`. I have no channel to that engineer and did not open
  one — the shared context and the queue are the only channels, exactly as the subtask brief states.
  The panel's delivered signature is `renderStatusPanel(history, status, thinking): string[]`, which
  matches the seam `ADR-0009` clause 9b already names, so nothing about it should surprise that hop.

## What I did not do

- Did not create or edit anything matching `src/turn-loop.*`, and did not read that engineer's work.
- Did not touch `src/frame.test.ts`, `plans/board.md`, `plans/nfr-catalog.md`,
  `memory-bank/50-decisions/`, or any traceability row but my own.
- Did not amend `ABC-016`'s text, including the criterion I believe is defective.
- Did not re-open `ADR-0009`, which is accepted.
- Did not change a dependency, and did not refactor anything working. `biome.json`'s two pre-existing
  lint INFOS were left exactly as they were.
- Did not `git checkout main`, did not merge, did not push, did not deploy.
- Did not fake, round or re-run-until-green any number in these notes. The one red gate this hop
  produced (a formatting error) is recorded in the observation note rather than quietly fixed.
