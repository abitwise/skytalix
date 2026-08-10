---
id: 20260810T221500Z-architect-design-decision-b40ecd8e
kind: decision
by: architect-design
at: 2026-08-10T22:15:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-018
  - ABC-019
  - ADR-0009
  - NFR-002
  - NFR-008
  - EPIC-002
  - src/frame.ts
  - src/history.ts
supersedes:
---

# Two rulings: there is no third constant site, and `NFR-002`'s incoherence is real but is not the one flagged

Grounded in `20260810T221500Z-architect-design-observation-83fd686f` (same task) — read that first;
the seven measurements are the whole basis of both rulings. Recorded as `decision`, not `finding`:
this hop holds no `§14-gate#<id>` stamp and no `human:<name>` grant. Full record for ruling 1:
the `## AMENDMENT 2026-08-11` section of
`memory-bank/50-decisions/ADR-0009-frame-row-constant-ownership.md`.

---

## RULING 1 — the stub seam is NOT a third constant site, because a consumer must not name a count at all

The Orchestrator's consolidated decision recorded this as still owed and said `ADR-0009`'s clause 1
plus clause 5 *"plausibly covers a stub seam, but plausibly is not ruled."* It is ruled.

**`ADR-0009` is AMENDED, not superseded — clause 9 added, clauses 1–8 unchanged and not one word of
them edited.** A successor would have folded out a ruling that measurement re-confirms; the
dated-amendment convention is this project's own (`ADR-0003`, `ADR-0004`). Status stays `accepted`; no
target and no level moves, so **no owner ratification is owed**.

### The answer dissolves the question rather than answering it as asked

The subtask asked *where the constants live such that the real panels, the stub panels and
`frameHeight` all reference ONE definition.* **They already do, and the one definition is the
delivered rows.** `readonly string[].length` is the only form in which a consumer may read a row
count. `frameHeight` is then not a third reader — it is arithmetic a consumer never needs.

**Does a stub satisfy "producer owns its count" or subvert it? Both, depending on its shape — which
is why a clause was needed and a reading of clause 1 was not enough.**

- **A stub that RETURNS ROWS satisfies clause 1 exactly as `renderBoard` does.** It produces rows and
  its count *is* their length. It declares nothing, so nothing can drift from it. This is clause 6's
  logic (*"the board term is derived, never declared"*) applied to all three terms.
- **A stub that DECLARES A CONSTANT subverts clause 1.** Clause 1 says the *producer* owns its count;
  a test double exporting `STATUS_ROWS = 3` makes two modules declare one number with nothing tying
  them — `ABC-017`'s own `D13` reproduced at a third site, propagating rather than inheriting, exactly
  as the subtask feared.

### Clause 9, in brief (the ADR carries it in full)

**9. A consumer of panel rows never names a row count. It reads `.length` from the rows it was
given.**

- **9a** `ABC-019`'s loop declares no row count and imports no panel. Session height =
  `firstFrame.length`, held for the session; `beginFrameSession` called exactly once. It does not
  import `frameHeight` — it does not need the arithmetic when it has the rows.
- **9b** The panels sit behind the **one render seam `ABC-019`'s `## Scope` already declares** —
  `(GameHistory, GameStatus, thinking) => readonly string[]`, *"the render seam derives nothing."*
  **This is not a new seam; clause 9 is the ruling that the count must not cross it.** Frame
  composition, and therefore both panel constants, stay behind it where clauses 1–6 already govern.
- **9c** A test double for that seam lives in a **test file**, never as a `src/` production module.
  Merged `src/frame.test.ts` is the precedent (`statusStub` / `historyStub`). A `src/` stub module
  would be production code dead on the day the real panels land, and under coding rule 12 it would
  then be flagged rather than removed, so it would linger.
- **9d** A stub's row counts **must differ from 3 and 8**, with two shapes wanted — one keeping
  `H ≤ 24` (2/5 → 19, in-place) and one pushing `H ≥ 25` (4/9 → 25, append).
- **9e** The loop owes one assertion of its own: **every frame's `length` equals the session
  height** — real and falsifiable, and the only place `4a`'s session-constant geometry is checked.
- **9f** At the rebase the re-gate must run the loop's tests **against the REAL panels**, not merely
  rebase and re-run against stubs.

### Why, in one line each, from the measurements

- **DECLARED (a third site) fails all five swap mutants, and on two it is a live `4b` breach** — told
  23, `beginFrameSession` chooses in-place and emits 25 rows into a 24-row viewport.
- **IMPORTED is mechanically impossible under the owner's parallel-build directive** — `TS2307` × 2,
  exit 2 under this project's own `tsconfig.json`, and the project-wide typecheck is **blocking**. So
  it *requires* a stub that exports the constants, i.e. the third site in person.
- **DERIVED is the only form both buildable against stubs and correct at the swap.** Forced by
  measurement, not preferred.
- **`.length` is a total substitute** — the identity holds over 560 shapes with 0 mismatches and is
  invariant under the message region.
- **Clause 5 does not cover this** — its verdicts are identical whatever the loop does.
- **9d is what converts a merge-time landmine into a build-time failure**, and it costs two literals.

### Alternative E reopened and rejected again, on the record

**Moving `STATUS_ROWS` / `HISTORY_ROWS` into `src/frame.ts`** was `ADR-0009`'s closest call, and *a
third site* is precisely the argument that would have carried it. **Reopened here and rejected
again, and the new evidence weakens it rather than strengthening it: under clause 9 the third site
does not exist, so the premise is gone.** It would additionally put the loop's session height on a
constant rather than the delivered rows, re-acquiring every DECLARED failure above. **A single home
for the numbers is worth less than no home for them.**

### One tension surfaced and deliberately NOT acted on

Clause 5's fit-check reads **one term derived and two declared** (`renderBoard(...).length`,
`STATUS_ROWS`, `HISTORY_ROWS`), which a strict reading of clause 9 would make all three `.length`.
**Clause 5 is not reopened.** The two forms catch different things — `.length` fails when the
*delivered* geometry breaks the frame; the constant form fails when the *declared* geometry does and
therefore checks the panel's declaration and its `A11`/`A1` assertion jointly — and both fail on all
six of `ADR-0009`'s original mutants, because a real panel change moves the rows and the constant
together. Reopening an accepted clause for a near-tie is the refactor coding rule 10 forbids.
**Recorded so a later hop reads the mixed form as deliberate rather than as an oversight.**

---

## RULING 2 — `NFR-002`: the `< 16 ms` target does NOT move, and the row's incoherence is real but is not the one flagged

### First, the correction that comes before everything else

**The `≤ 100 µs @ 120 plies` bar is not in `plans/nfr-catalog.md` and never was** — `grep` for
`100 µs` across that file returns **zero matches**. The bar is `ABC-019`'s, on `ABC-019`. So the
disagreement was never internal to the row; it was **between the row and a ticket** — the
`TWO-DOCUMENTS-DISAGREE` class the catalog already tracks on `NFR-007`.

### Second, *"the correct build sits at or over the bar"* is FALSE as measured

`ABC-019`'s `[D19]` reaches 99.5–104.5 µs by two faults, both measured:

1. **It double-counts `gameStatus`.** `gameStatusOf(history)` **is**
   `gameStatus(history.position, repetitionCounts(history))` — `src/history.ts:152`, read at source.
   Nothing is owed on top of the composite.
2. **The band it quotes is a superseded wave-1 prototype band whose 300-ply end is ~7% high.**
   Measured here: **95.29 µs @ 300 = 0.95x of 100, MET with 4.7% margin.** Three independent
   harnesses read 94.43 / 95.29 / 95.64 — all **below** the band's 97 lower bound.

**BA/PM's ruling 3 stands entirely, on the stronger of its two reasons**, which this hop does not
dispute and re-confirms: **a two-derives-per-ply build reads 93.58 µs @ 120 = 0.94x and MEETS the
timing bar.** *That* is why the bar could not catch what it was written for — not because a correct
build busted it. Their `O(plies)` point also stands and is measured: the composite's ratios are
**2.33x from 40→120 and 1.97x from 120→300**, so one ply count cannot describe the line.

### Third, what the row's OWN incoherence was — and it is now fixed

The row's `Applies to` cell carried the prototype band as the quantity's **headline figure with no
label**, while the real measured figures sat further down the section. **A figure in that catalog
that is not labelled "not a bar" gets transcribed into a ticket bar — and it happened twice:**
`ABC-019`'s original bar transcribed *"46–50 µs at 120 plies"* verbatim as its derivation, and its
repair hop quoted `97–102` again and drew a false conclusion from it.

**RE-SCOPED, not re-derived in the sense of moving anything.** In the cell: the measured triple is
the headline, the prototype band is struck through and retained as history (this file's standing
convention), and the cell now states the quantity is **the `O(window)` falsifier's evidence and NOT a
bar of this row**, with a fence forbidding transcription into a ticket bar without re-deriving all
three ply counts. Also superseded: the 2026-08-04 paragraph's *"lands inside the band … 1–8% below
it"* — below a band is not inside it; measured, it is **inside at 120 and below at 300**.

### Fourth — does the `< 16 ms` frame target move? NO, and the reason is structural

**Explicitly: it does not move.** The target applies to *"one full frame"*, and **the row's own words
put this quantity in the LOOP, not in a frame.** It is not in the target's denominator at all, so no
measurement of it can move the target. As a fence rather than a bar: 95.29 µs is **0.6% of 16 ms**,
and even the three-derives wrong build (277.56 µs @ 300) is **1.7%**. Compute was never the risk on
that row — the terminal-write half was, and it was measured and discharged at `ABC-018`'s gate. **The
only thing that could move this target is the falsifier firing**, which is a structural change, not a
timing result.

### Fifth, where the bar belongs, stated once

**The row records the quantity; the ticket bars it.** `ABC-019` carries `≤ 45 @ 40`, `≤ 100 @ 120`,
`≤ 200 @ 300` plus the spied call count that actually binds. **No bar was created, moved or loosened
here, and none of `ABC-019`'s three ply-count clauses was touched.** `MET`/`MISS` stays
**Security/NFR's** at that ticket's own gate.

### A structural fact that is new on the row

Bare `gameStatus` is **FLAT in plies** (2.71 / 3.31 / 2.21 µs), so **the entire `O(plies)` term is
`repetitionCounts`** — 91.76 of the composite's 95.29 µs at 300 plies. The row's falsifier names
exactly the right call, and a renderer that called bare `gameStatus` would not void `O(window)`.

---

## Flagged, not taken — each with an owner

- **BA/PM: two acceptance criteria owed on `ABC-019`** — clause **9d** (stub row counts ≠ 3/8, two
  shapes) and clause **9e** (every frame's `length` equals the session height).
  `plans/tickets/ABC-019-turn-loop-skeleton.md` was **not edited** — `plans/tickets/` at this boundary
  is a BA/PM hop's, and one is concurrently claimed on this branch.
- **BA/PM: if any build already has the stubs at 3 and 8, that is a defect to fix, not a style
  preference** — measured: it makes a hardcoded height green at `ABC-019`'s own gate and defers the
  failure to the rebase, and it never exercises the append branch.
- **Orchestrator / QE: the rebase re-gate must run the loop against the REAL panels** (clause 9f).
  Under clause 9 the loop's own code is swap-invariant, so what the re-gate actually tests is the
  **seam wiring** — only a real-panel run tests it. This strengthens the Orchestrator's *"green on
  stubs is not evidence about the assembled frame"* rather than restating it.
- **Orchestrator: no board move is taken here.** `plans/board.md` was not touched.
- **Orchestrator: `plans/traceability.md` is written but deliberately LEFT UNSTAGED** — it carries a
  concurrent BA/PM hop's uncommitted edit that arrived between this hop's read and its write. My row
  is in the working tree, preserved alongside theirs and verified not to have clobbered them. See the
  `artifact-ref` note.
- **Security/NFR (restated so it is not lost, unchanged):** each panel ticket's gate still
  re-verifies the `src/history.ts`-importer fact on **delivered** code by `grep`. Nothing here
  discharges it. `MET`/`MISS` on `ABC-019`'s three ply-count clauses is theirs.

## What could NOT be decided here, and why

- **`HISTORY_COLS`'s value and the frame's `W`** — untouched, as `ADR-0009` already says. Not in
  scope and no new evidence bears on them.
- **Whether clause 5's fit-check should read all three terms as `.length`** — a genuine near-tie
  (see above). **Deliberately left as `ADR-0009` accepted it.** Deciding it would be reopening a
  working ruling for symmetry, which coding rule 10 forbids; it is recorded rather than silently
  left.
- **Every figure in this hop is one machine and one Node version** (Apple M3 / Node v24.12.0 /
  darwin-arm64). **`UNKNOWN - verify` on any other hardware**, and that limit is inherited by ruling 2
  in full.
- **Whether `ABC-019`'s `≤ 100 @ 120` bar is the right LEVEL** is not decided here and is not mine:
  the catalog records the quantity, the ticket sets the bar, and `MET`/`MISS` is Security/NFR's. This
  hop only established that the reason given for calling it busted was wrong.
