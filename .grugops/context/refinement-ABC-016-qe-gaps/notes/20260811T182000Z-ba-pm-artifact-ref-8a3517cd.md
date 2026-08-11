---
id: 20260811T182000Z-ba-pm-artifact-ref-8a3517cd
kind: artifact-ref
by: ba-pm
at: 2026-08-11T18:20:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - EPIC-002
  - A2
  - A5
  - A6
  - A7
  - A9
  - A13
  - ADR-0010
supersedes:
---

# What this hop wrote, what it deliberately did not, and the board move it REQUESTS

## Written

| path | change |
|---|---|
| `plans/tickets/ABC-016-status-panel.md` | the whole ruling — one new amendment header (`D20`–`D26`), `A2` `A5` `A6` `A7` `A9` `A13` amended, four `## Test notes` added, `## Size and priority rationale` re-derived a fifth time, a fourth `## Definition of Ready` block, and the width flag **struck as discharged** |
| `.grugops/context/refinement-ABC-016-qe-gaps/notes/` | five notes: `decision`, `observation`, `failed-attempt`, `claim`, this `artifact-ref` |
| `.grugops/queue/claimed/refinement-ABC-016-qe-gaps/` | the claim directory, its `claim.md` registry record, and the subtask file moved `pending/` → `claimed/` |

**The `claimed/` parent directory did not exist** and the atomic `mkdir` of the task directory
returned `ENOENT` rather than `EEXIST` — a parent-missing failure, which Workflow 17 step 2 says is a
genuine error and never a lost claim. The parent was created and the **task directory itself** was
then created by a single atomic `mkdir`, which is the operation the claim actually consists of.
`scripts/claim.js` does not exist in this repo; the protocol was executed by hand and is disclosed
here rather than implied.

## NOT written, each for a stated reason

- **`src/`** — zero production lines are asked for by any of the seven, and this role does not write
  `src/` regardless. `git status --porcelain -- src/` is **empty**; `src/` is byte-identical to the
  branch tip. The temporary `probe/` directory used for the spied depth measurements was at the
  **worktree root, never under `src/`**, and is deleted.
- **`plans/board.md`** — the Orchestrator's. The move is requested below.
- **`plans/traceability.md`** — `ABC-016`'s row exists and is correct; its `Status` cell moves with
  the board move, which is not mine to make, and `Code`/`Tests`/`UAT`/`Release` are the engineers'
  to fill when code and tests exist. **Editing the row to stand in for a board move I did not make
  would be a faked trace.** No row is owed by this hop: no ticket was created, split or re-scoped.
- **`plans/tickets/ABC-017-*` and `plans/tickets/ABC-019-*`** — a BA/PM agent is live on the first
  and QE on the second. Neither was read for edit and **no channel to either was opened**; the
  on-disk shared context is the only channel and these notes are all of it.
- **`memory-bank/50-decisions/`** — `ADR-0010` and `ADR-0009` are accepted and were **not re-opened**.
  `ADR-0010` clause 5 refuses a constant-width criterion; none is added.
- **`plans/nfr-catalog.md`** — untouched. `## Security / NFR triggers` gains no fourth part; the
  three-part bar and its µs figures are unchanged, and only the **depth** of part 3's counts moved.

## The board move REQUESTED — `In Review` → `In Development`

**Backward, deliberate, and the third such move on this ticket.** It is legitimate for the reason the
previous two were: **the closes are unwritten**, and two of the four comment repairs are under
`src/`, which BA/PM may not write.

**This is the move QE argued against making at its own hop and it does not contradict QE.** QE held
the ticket in `In Review` because `A1`–`A14` were all *met* and the criteria were incomplete rather
than unmet — repairing criteria text does not move a ticket backward. **That reasoning ends where
this hop ends:** the criteria now demand fixtures nobody has written, so the ticket is no longer
done. QE's own note anticipated exactly this — *"the dev hop that writes the cases will move it
backward"*.

Suggested row text for the Orchestrator (its wording, not mine):

> **SEVEN QE CRITERION GAPS RULED by BA/PM at `refinement-ABC-016-qe-gaps`; `In Review` →
> `In Development` BACKWARD 2026-08-11 for a TEST-ONLY dev hop. All seven accepted and re-measured,
> and TWO OF QE'S OWN PROPOSED CLOSES MEASURED INSUFFICIENT AND REPLACED** — `G1`'s `CASES`-entry
> close kills **1 of 5** thinking-axis builds (the three criteria that iterate `CASES` assert purity,
> row count and ASCII, **none asserts content**), so `A7`'s widest-row clause is **replaced** by one
> that sweeps `CASES` in both thinking states and kills **5 of 5** while needing no new entry; `G3`'s
> single joint FEN survives a compensating `KNIGHT=4, BISHOP=2`, so `A6` takes **three** rows.
> `A13`'s counting clauses gain a stated ply depth ≥ 2 — **`G4` is the dimension BA/PM's own previous
> `A13` ruling did not reach**, re-spied here: both blind builds survive at 1 ply and die at 4, and
> the delivered panel is green at 1/2/4/5. `A2` gains check-crossed-with-a-claim, `A5` gains a SAN
> disambiguator (`Nexd4`), `A9` gains a forged-status case with its constructed-ness stated in the
> criterion. **Stale-comment flag CONFIRMED and WORSE THAN REPORTED — four sites, one named by
> nobody (`src/status-panel.test.ts:263-265`).** **`1 - 0` flag: QE's verdict UPHELD — no
> discrimination gap, no criterion moves**; the `> 0` line is taken in the TEST as an executable
> guard on a comment that flag 1 proves goes stale. **ZERO production lines; every added fixture
> rendered green on the delivered panel at this hop.** `M`/`P1` re-derived a fifth time, unmoved, not
> `XL`. `ADR-0010`/`ADR-0009` not re-opened, no constant-width criterion added; the ticket's stale
> width flag **struck as discharged by `ADR-0010`**. Gates re-run in the worktree: **708/708 on 24
> files**, 0 behind `main`, `src/` byte-identical.

## The dev hop's work list, so it can be enqueued without re-reading the ticket

**Zero production lines. Zero new test files. `src/status-panel.ts` is not touched.**

1. `src/status-panel.test.ts` — **two new `CASES` entries**: `4k3/8/8/8/8/8/8/4R1K1 b - - 100 60`
   (check + fifty-move claimable) and `4k3/8/8/8/3p4/8/2N1N3/4K3 w - - 0 1` played through `e2d4`
   (disambiguated SAN). Both get snapshots.
2. `src/status-panel.test.ts` — `A2` gains the check-plus-claim assertions; `A5` gains
   `last: Nexd4` plus the `last: Nxd4` negative; `A6` gains **three** table rows (`+3`, `+3`, `+5`);
   `A9` gains the forged-status case.
3. `src/status-panel.test.ts` — **`A7` rewritten**: sweep `CASES` in both thinking states and assert
   busy-with-`thinking...`-blanked is byte-identical to idle. **The widest-row assertion is
   removed**, and the stale rationale comment at `:263-265` goes with it.
4. `src/status-panel.nfr.test.ts` — both counting clauses moved to a **≥ 2-ply** fixture (the 4-ply
   `["e2e4","e7e5","g1f3","b8c6"]` already in the file); the difference half's baseline needs its own
   3-ply replay; add `expect(sanAlone).toBeGreaterThan(0)`; **rewrite the comment at `:134-139`** —
   the difference form **is** the criterion, and fix the `src/san.ts:101` cite to **`:104`**.
5. `src/status-panel.ts:95-101` — the module comment's *"makes the whole frame breathe"* rationale,
   false after `ADR-0010` clause 1. **Comment only; no code.**
6. Regenerate `src/__snapshots__/status-panel.test.ts.snap` for the two new entries.

**Expected outcome, measured at this hop: every one of these goes green on the delivered panel on the
first run.** If any does not, the ruling is wrong and not the code — that is the same posture `D19b`
took and it held.

## Downstream, flagged not taken

- **`ABC-017` and `ABC-019` are owed nothing by this hop.** No criterion here names a frame-level
  term, a row index, another panel's count or a width. The `ADR-0010` obligations on both tickets
  (`ABC-017`'s `A2` parenthetical, `ABC-019`'s `F3` criterion and its explicit no-constant-width
  prohibition) are the ADR's and are **untouched here** — agents are live on both.
- **The `ADR-0010` production line has no home on this ticket.** The board records it as `ABC-027`,
  second-to-last in the merge order. Not this ticket's, and not re-litigated.
- **The parent context `.grugops/context/abc016-qe-gaps-2026-08-11/` named as `parent_ref:` in the
  subtask brief DOES NOT EXIST** — not in this worktree, not in `main`, and `git log --all` on that
  path returns nothing. The routing reasoning was read from the subtask file and from
  `plans/board.md`'s header instead. **Recorded rather than worked around silently**, because a
  missing `parent_ref` is the kind of gap that makes the next hop believe it read something it did
  not.
