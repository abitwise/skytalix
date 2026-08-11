---
id: 20260811T212401Z-software-engineer-decision-ed795697
kind: decision
by: software-engineer
at: 2026-08-11T21:24:01Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-027
  - ABC-029
  - ADR-0009
  - ADR-0010
  - NFR-008
  - src/turn-loop.test.ts
  - src/turn-loop.nfr.test.ts
supersedes:
---

# Five implementation decisions, and the one I refused to make

> **Hand-authored** — `scripts/context-io.ts` does not exist here. `kind: decision` needs no stamp;
> the measurements each of these rests on are in the sibling `observation` note, and none of them is
> recorded as a `finding`, because the gate is RED and there is no verdict to stamp against.

## 1. `A20` rides the REAL panels, not a third stub — and that is what makes `A18` survive it

`## Test notes` says *"a stub whose status panel's widest row shrinks between two frames is the
shape"*. That sentence was written when neither panel existed. Building it as written now would put a
**third** stub render seam in this suite, and **`A18`'s first clause is that there are TWO** — a
criterion I would then have had to amend to satisfy a criterion, which is the shape of change this
ticket has refused five times.

The real status panel already narrows, for a reason that belongs to the domain rather than to a
fixture: its claim cell is 32 columns wide and it appears and disappears with the halfmove clock.
**So `A20` and `ADR-0009` cl. 9f's real-panel run are ONE game, and the stub shapes are untouched:
`SHAPE_A` and `SHAPE_B` both still run, neither is 3/8, and shape `B` remains the only append-branch
run in the tree.** That is `[D51]` (2) obeyed rather than quoted — the real-panel run **ADDS**.

**The cost of this choice, stated:** `A20`'s evidence now depends on the real panel's claim cell. If
a later hop removes that cell the fixture stops narrowing — so the test **asserts the narrowing
exists** rather than assuming it, and it fails loudly instead of passing vacuously. That failure
mode was chosen deliberately.

## 2. `[D51]`'s *partial* language is discharged IN FULL, and I say so in words

`[D51]` (1) was written when `src/status-panel.ts` was merged and the history pane was not, and it
required whoever ran the re-gate to **state WHICH panels were real**. **Both were real here.** The
tests read `STATUS_ROWS` and `HISTORY_ROWS` off the merged modules and call `renderStatusPanel` and
`renderHistory` themselves; no half of the seam is stubbed in that run. **The obligation `[D51]`
left open is closed, and it is closed by measurement rather than by the calendar.**

`[C9-3]` holds unchanged: **the loop gains NO production import edge to either panel.**
`src/turn-loop.ts` is byte-identical (md5 `bd793612476c9d0eac28b75e1e3297cc`) and imports neither.
The two imports are in a **test** file, which is exit 0 now that both modules exist (`[D50]`).

## 3. The re-gate asserts the SEAM WIRING, not the table again

Clause 9f says the loop's own code is swap-invariant and that what a re-gate actually tests is the
**wiring**. So the 16 table rows are **not** re-run under the real panels — that is `## Test notes`'
own argument for not re-running them under shape `B`, and it would spend `N8-LANE` budget to buy a
second copy of a measured-identical result. Four tests are added instead, each asserting something no
stub run can:

- the real pair's geometry and its in-place branch, read off the producers;
- `A19`'s four clauses at the real geometry, plus the height being **23** there — which is why
  `A18`(i) + `A19`(b) and **not the compiler** is what kills the IMPORTED form (`[D50]`);
- **the wiring**: the real panels derive **nothing** (`gameStatus` at `N + 1`, `repetitionCounts` at
  **0**, with real panels behind the seam — with stubs this assertion was vacuous by construction),
  and the thinking flag and the fourth `messages` argument both reach them;
- swap-invariance across stub 2/5, stub 4/9 and real 3/8 — **with an assertion that the FRAMES
  differ**, without which the invariance is a tautology over three seams that happen to agree.

## 4. `src/turn-loop.nfr.test.ts` is NOT changed, and that is a decision rather than an omission

It was in my file set and I left it alone. A real-panel arm at `A17`'s 40 / 120 / 300 plies would
make the real history pane replay the game once per frame — `O(plies²)` work — to re-assert a
derive count that the wiring test above already asserts at the real geometry. **A panel that derived
once per frame is caught at 2 plies exactly as it is at 300**, so the marginal evidence is ~zero and
the `N8-LANE` cost is not. Its md5 `d48a0eb3a53a14e55972418614b8bdf2` is unchanged.

## 5. ZERO production lines, and the tripwire was not tripped

`ABC-019` has a standing tripwire: a hop adding production scope must re-derive against
`SPLIT_REQUIRED` rather than by precedent. **This hop adds none.** `src/turn-loop.ts` is
byte-identical, no criterion is added, amended, renumbered or deleted, no table row is added, and no
new test FILE exists. I did not reach a point where a production line looked necessary, so there is
nothing to stop at — the brief's instruction to say so and STOP is answered by there being nothing to
report.

## 6. NO FORWARD BOARD MOVE IS REQUESTED — the one I refused to make

The Software Engineer owns `In Development → In Review`. **I am not taking it.**
`quality.gate_enforcement` is `blocking` and `npm test` is RED — for `ABC-029`'s reason, not this
ticket's, but a blocking gate does not read the reason. **`ABC-019` stays in `In Development`,
blocked on `ABC-029`**, exactly as BA/PM ruled last hop; the `Blocked` column is the Orchestrator's
call and the reason is recorded either way. `plans/board.md` was not opened.

**What this hop changes about that position is only this: the ticket's own work is now complete as
written.** The last two things `ABC-019` owed its own gate — `A20` and cl. 9f's real-panel run — are
written and green in isolation. **What stands between this branch and a green gate is `ABC-029`,
and `ABC-028` before it.**
