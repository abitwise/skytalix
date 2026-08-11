---
id: ABC-027
title: The in-place frame writer clears each row as it writes it — a narrowing frame leaves stale columns on screen
status: done
column: Done
size: S
priority: P1
epic: EPIC-002
feature: —
---

# ABC-027 — the in-place writer clears each row as it writes it

> ## REPAIRED 2026-08-12 by BA/PM — `A1` PINNED THE UNSAFE EMISSION AND WAS BLOCKING THE REQUIRED FIX
>
> **Task `abc027-fail-2026-08-12`, subtask `refinement-ABC-027-a1`, Workflow 07.** The Security/NFR
> gate returned **FAIL — the first in this project's recorded history** — after measuring on a REAL
> terminal (GNU screen 5.0.2, attached pty, `TIOCSWINSZ`, read back with screen's own `hardcopy`)
> that the delivered emission **loses the last cell of every row at a window exactly `W` wide: the
> board's entire h-file plus its file label, 9 rows of 23, on every frame.** The erase fired AT the
> right margin, where the cursor sits on the last cell with the wrap pending, so `EL(0)` erased that
> cell. Required fix **`RF-1`** moves the erase to **column 0**, where the margin state cannot exist.
>
> **`A1` as written FORBADE that fix** — it pinned `\x1b[K` = `H − 1`, `\x1b` = `H + 1`, delta
> `(H − 1) × 3`, and the safe shape is `H`, `H + 2`, `H × 3`. `A1` was GREEN, and that was the
> contradiction: it described the delivered, unsafe emission byte for byte.
>
> **`A1` IS RE-DERIVED, NOT RELAXED.** Every count still comes from `H`, the text is still pinned
> byte for byte, and one clause is ADDED. QE measured `A1` as where **9 of 14 mutants die**; loosening
> it would have traded a three-character defect for the suite's strongest killer.
>
> **EVERY NUMBER BELOW WAS RUN AT THIS HOP BEFORE IT WAS WRITTEN**, on an out-of-tree copy of this
> worktree, against the DELIVERED modules: the three emissions counted from the real writer, the new
> `A1` witnessed against **nine writers** (one passes, eight fail), and the full suite taken to
> **682/682 on 22 files** with `RF-1`, the repaired `A1`, the screen model's margin repair and the new
> `A7`. **Zero `src/` bytes were written in this repository at this hop**
> (`git status --porcelain src/` = 0 lines). The baseline was verified first: **681/681 on 22 files.**
>
> **`A7` is NEW.** `A2`, `A3`, `A4`, `A5` and `A6` were each re-run against the `RF-1` emission and
> **none moves** — measured, not assumed.

> **CUT 2026-08-11 by BA/PM** (task `refinement-ABC-027-cut`, subtask `refinement-ABC-027-cut`,
> Workflow 07) to carry accepted **`ADR-0010`**'s clause 1. The Architect named the code and
> deliberately declined to pick a home; the **Orchestrator** routed it here rather than reopening
> `ABC-018`, which merged 2026-08-09 and is closed.
>
> **`ADR-0010` and `ADR-0009` are NOT re-opened.** Both are accepted. This ticket turns clause 1 into
> acceptance criteria and changes no ruling.
>
> **EVERY criterion below was RUN before it was written — against merged `src/`, on an out-of-tree
> copy, on both the merged writer and the clause-1 writer, plus three mutants.** The whole change
> was built and gated on that copy: **681/681 on 22 files, skip 0**. **Zero `src/` bytes were
> written in this repository at this hop** (`git status --porcelain src/` = 0 lines).
>
> **THE REASON THE CRITERIA ARE WORDED THIS HARD.** `ADR-0010` measured that the merged suite's
> fixtures yield `W` ∈ **{18}** because the real board pins it, so **a criterion that does not force
> a NARROWING passes on a broken build**. Two more forms were measured to be worse than useless:
> the epic `4b` form is **blind at any real terminal width**, and the merged `:379` form
> **false-positives on every screen wider than the frame**. `A2` and `A3` exist to make both
> failures impossible, and each was witnessed by a mutant that kills it.

> ## ONE CORRECTION TO `ADR-0010`'s `## Consequences`, MEASURED HERE AND REPORTED RATHER THAN QUIETLY USED
>
> **The ADR is NOT edited** — `memory-bank/50-decisions/` is not this hop's, and the correction
> changes nothing in the ruling. It changes what the engineer will find.
>
> `ADR-0010` states *"**Three** test changes ride with that production line"* and names the screen
> model, `:376`'s escape count, and *"the file needs its **first** narrowing fixture"*. Measured by
> applying clause 1 to a copy and running the suite:
>
> | ADR says | measured |
> |---|---|
> | three test changes | **five assertion sites across four tests**, plus the new criteria |
> | the model must learn `\x1b[K` | **confirmed — 5 tests THROW without it** |
> | `:376`'s escape count `2` → `24` | confirmed, **but it is masked**: `:374`'s `toContain(second.join("\n"))` fails first and is not named by the ADR |
> | — | **`:419`'s `expect(body).toBe(frame.join("\n"))` also fails and is not named by the ADR** |
> | *"the file needs its FIRST narrowing fixture"* | **FALSE — `src/frame.test.ts:735-771` already has one**, `widthOf(wide)` **24** and `widthOf(narrow)` **18**, both asserted |
>
> **`:735-771` is the sharpest form of this project's most-recorded defect class yet.** It is titled
> *"CHARACTERIZES: `W` is recomputed per frame, so a narrowing frame leaves the wider one's tail"* and
> it **asserts the defect is present**. Its own comment says it *"pins today's behaviour and fails
> loudly the day someone changes it"* — so it is not a bad test, it is a **tripwire doing its job**,
> and this ticket is the day. But the consequence is concrete: **an assertion in the merged suite
> that no correct build can satisfy after this ticket**, and the ADR's change list does not mention
> it. `A6` owns it. It is **replaced, never deleted** — the property it was built to watch is exactly
> what `A2` now asserts from the other side.

## Problem

*User*: the player looking at the board while the status panel's widest cell shrinks — a draw claim
expiring, a captured piece changing the material readout, a move number gaining a digit.

*Pain*: the frame's width `W` is a **max over the delivered panel rows** (`src/frame.ts:179`),
recomputed per frame, so `W` shrinks whenever the widest panel row shrinks. The in-place writer
emits cursor-home, the rows, and one `\x1b[0J`. **`\x1b[0J` erases downward from the end of the new
frame and never rightward**, so every column to the right of a narrowed row keeps the previous
frame's characters. Measured through a terminal model implementing this module's escape grammar:

| what the frame says | what the player sees |
|---|---|
| `last: c3  material: 0` | `last: c3  material: 00` |
| *(empty row — no claim)* | `claim: threefold repetition` |

**A wrong material count and a draw claim that has expired. That is a misreported game state, not a
smudge** — and it does not self-repair: `ADR-0010` measured the residue surviving **17 consecutive
frames**.

*Value*: what the player reads is what the frame says. This is the single change that makes the
in-place redraw honest at any terminal width, and it costs **+69 characters per frame, exactly and
always** — `H × 3`.

**Where that number comes from, stated rather than quietly changed.** `ADR-0010` measured **+66** =
`(H − 1) × 3` for the shape it proposed — the erase AFTER each row. The Security/NFR gate then
measured that shape destroying a cell per row on a real terminal at a window exactly `W` wide, so the
erase moves to **column 0** and the frame carries one more of them: `H`, not `H − 1`. **`ADR-0010` is
NOT re-opened and its ruling is untouched** — clause 1 says the in-place redraw emits a per-row erase,
which is exactly what ships; only *where in the row* it fires has changed. The ADR's `+66` is correct
for the shape it costed and is left alone; this ticket's cost is `+69` and is measured here (425 →
**494** characters on the reference layout, and the delta is content-independent: 69 at `W` = 18, 37
and 39 alike).

**Nothing is broken in production today** and that is the deadline, not a reason to defer: nothing
composes a frame in a loop until `ABC-019`, which is **`In Development` right now**. The defect
becomes reachable the moment that loop lands.

## The measurement that makes these criteria non-vacuous

Run at this hop against merged `src/frame.ts` + the real `renderBoard` (**9 rows × 18 characters**),
a 3-row status fixture and an 8-row history fixture, `H` = **23**, through the screen model:

**The fixture — a draw claim offered, then expiring, then a check announcement, then quiet:**

| frame | status row 3 | `W` |
|---|---|---|
| 1 | `White may claim: threefold repetition` | **37** |
| 2 | *(empty)* | **18** |
| 3 | `check: YES — White to move out of check` | **39** |
| 4 | *(empty)* | **18** |

Two narrowings and one widening, every frame **exactly 23 rows**. Asserting after **every** redraw
that each screen row equals its frame row (trailing spaces trimmed):

| writer | @ 80 columns | @ 120 columns |
|---|---|---|
| merged | **2 rows stale** | **2 rows stale** |
| clause 1 | **0** | **0** |

The residue, on a row the frame says is **empty**: `hreefold repetition` after redraw 2, and
` to move out of check` after redraw 4.

**Which assertion form catches it — re-measured here, and it adds one column `ADR-0010`'s table does
not have: what each form does to the CORRECT build.**

| form | narrowing @ `W`(frame 1) | narrowing @ 80/120 | steady @ 80/120 | **on the CORRECT build** |
|---|---|---|---|---|
| **F1** epic `4b` / merged `:381`, whole rows of frame N | catches | **BLIND** | pass | **FALSE POSITIVE at `W`(frame 1)** |
| **F2** merged `:379`, untrimmed screen == frame | catches | catches | **FALSE POSITIVE** | false-positives with it |
| **F3** screen == frame, **trimmed** | catches | **catches** | pass | **passes** |
| **F4** every frame's `W` == the session `W` | catches | catches | pass | **FAILS the correct build** |

Three of the four forms are wrong here, and **F1's extra failure mode is new**: at the artificial
screen width `W`(frame 1) it flags the **correct** build, because `rowsOnlyIn` compares rows padded
to two different widths. So `:381`'s form must not be reused for a narrowing test in either
direction. **`F3` is the only sound form, and `A2` is `F3`.**

**`F4` is why this ticket carries a PROHIBITION** (`## Out of scope`): under clause 1 `W` varies **by
design** — measured `{37, 18, 39, 18}` over four frames — so a constant-frame-width criterion would
fail the correct build. This is one of the two tickets this round that must not acquire one.

## Scope

**One expression in `src/frame.ts`'s in-place branch of `beginFrameSession`, and the tests that can
see it.**

- **`src/frame.ts`, the in-place branch of `beginFrameSession`** — the emitted redraw becomes
  cursor-home, **an erase-in-line, then the rows joined by newline + erase-in-line**, then the single
  existing erase-to-end-of-screen. **Every erase fires at COLUMN 0**, which is the whole of `RF-1`.
  One new module constant for `\x1b[K`, in the shape of the two that are already there.
- **`src/frame.ts:27-29`** — the header sentence *"…which is what makes an in-place redraw leave no
  character of the previous frame behind **without emitting a per-row erase**"* becomes false with
  the change and is edited with it. It is the module stating the broken invariant as a fact.
- **`src/frame.ts:66-73`** — the `ERASE_TO_END_OF_LINE` doc comment says *"Emitted once per row join
  — **`H - 1`** of them"* and *"A **trailing** one on the last row is redundant"*. **Both sentences
  are false under `RF-1`** and are edited with it: there are `H`, and none of them is trailing.
  **Named here because the merged text describes the shape that failed a real terminal**, and a
  comment left describing the old shape is how the next reader rebuilds it.
- **`src/frame.test.ts`** — the screen model learns `\x1b[K` **and its RIGHT-MARGIN case is repaired**
  (`A7`); the assertion sites that hardcode the old emission are updated; `:735-771`'s
  characterization is replaced by the criterion it was waiting for; the criteria below are added.

**Measured minimal and sufficient** (`ADR-0010` clause 1, re-run at the repair hop): **one**
`\x1b[0J`, **one** `write()` per frame, **+69 characters** = `H × 3`, **0 stale rows** at 80 and 120
columns, and **no escape emitted at the right margin**.

### The trailing-erase note, RE-ARGUED because `RF-1` inverted the shape it described

**There is no trailing erase any more: under `RF-1` every erase is LEADING.** The old note argued
that the last row needs no erase because `\x1b[0J` already clears the rest of the cursor's row, and
that a trailing one would break the slice arithmetic at the *"cursor at the start of the prompt row"*
test. **The second half is spent** — that site is edited by `RF-1` regardless (measured: it is one of
the three tests `RF-1` moves on its own). **The first half survives, but it now applies to a
different sequence**: the reserved prompt row's **leading** erase, the `H`-th one. Measured at this
hop — the emission ends `\n\x1b[K\x1b[0J`, both firing at row `H − 1` column 0 — so that erase is
**provably redundant**, and it is **kept anyway**, with the count pinned at exactly `H`:

1. **`H × 3` is the shape that was MEASURED clean** on GNU screen 5.0.2 at `C == W` and at 80
   columns. The 491-character `H − 1` variant was **not** measured. This ticket does not substitute an
   argument for a measurement on the one surface that has already produced this project's first FAIL.
2. **It costs a slice and a special case** in what is otherwise one expression, to save 3 characters
   against `NFR-002`'s measured ~2,500x headroom (+0.13 µs for the delivered +66, and the bar is
   16 ms). Coding rules 5 and 6.
3. **Both `H − 1` variants FAIL the new `A1`, measured at this hop.** Dropping row 0's leading erase
   is QE's mutant `M1`. Dropping the prompt row's is byte-distinguishable but behaviourally identical
   — and this project has already decided that class deliberately: QE's judgement 1 on mutant `M5`
   (`\x1b[0K` ≡ `\x1b[K`) records that the criteria pin the emission's **spelling**, not its meaning,
   and accepts the trade. This is the same trade, taken the same way.

**One erase per row, `H` of them, is an invariant a reader can restate without an off-by-one.**
`H − 1` is the asymmetry that attached the erase to the join separator in the first place, which is
how it came to fire at the margin.

## Out of scope

- **ANY constant-frame-width criterion, anywhere, on this ticket or downstream. This is a
  PROHIBITION, not an omission.** Under `ADR-0010` clause 1 `W` varies by design; `F4` was measured
  above to fail the **correct** build. `ADR-0010` clause 7 states the same prohibition for
  `ABC-019`. **`A7`, added by the repair hop, is NOT one and the check is not rhetorical**: it
  assembles no frame, never mentions `W`, and asserts nothing about any width being constant — it is
  a property of the screen model at a 10-column screen. **Nor does it read a terminal's width**
  (`src/frame.ts:25` and `EPIC-002`'s SIGWINCH ruling stand untouched).
- **Any change to `assembleFrame`.** `W` stays a per-frame max over delivered rows (`:179`,
  unchanged) and every frame VALUE is byte-identical with or without this ticket — `ADR-0010`
  `## Rollback` says so and `A5` asserts it. The assembler is correct; only what survives on the
  terminal between two frames changes.
- **Any panel.** `ADR-0010` clause 2: no panel reserves, pads or declares a frame width, and the
  delivered `ABC-016` panel needs **zero production lines**. Nothing here reaches into
  `src/status-panel.ts` or a history pane; neither module exists on `main` and this ticket does not
  wait for them (`## Dependencies`, where that independence is measured — **the merged text pointed
  at `A7`, which did not exist; corrected at the repair hop before `A7` did exist and turned a
  dangling reference into a wrong one**).
- **The append and short-TTY strategies.** Untouched by construction — only the in-place branch
  changes. `A5` pins it rather than assuming it.
- **Hoisting `W` to the session, freezing it at frame 1, or capping it.** `ADR-0010` alternatives B
  and E, rejected by measurement (truncation destroyed **8 panel rows** including a live draw-claim
  offer).
- **Clearing only when the frame narrows.** `ADR-0010` alternative D, rejected — it makes the writer
  stateful to save 66 characters and its correct path is the one that almost never runs.
- **Amending epic `4b`.** `ADR-0010` clause 8 rules `4b` not breached: one `\x1b[0J`, no count, no
  cursor movement, one `write()`. Its *"zero rows from frame N"* wording is blind to this defect at
  a real width (**F1**, re-measured above), and the ADR covers that at ticket level on purpose.
  **If the owner reads `4b`'s *"in one operation"* as forbidding any additional erase, `4b` needs a
  wording hop and it is BA/PM's — carried here, not owned, and not blocking.**

## Acceptance (Given/When/Then)

**Re-derived at the repair hop 2026-08-12: `A1` is rewritten, `A7` is added, and `A2`–`A6` were each
re-run against the `RF-1` emission and DO NOT MOVE — measured on an out-of-tree copy, not assumed.
The evidence is under each criterion.**

**A1 — the emitted redraw, byte for byte, and EVERY ERASE FIRES AT COLUMN 0. Given** a 23-row frame
and a TTY sink reporting 24 rows, **when** one frame is written, **then** the sink receives **exactly
one** `write()` call whose text is **exactly** cursor-home, then `\x1b[K`, then the frame's rows
joined by newline + `\x1b[K`, then one `\x1b[0J`; and in that text the count of `\x1b[K` is **`H`**
(23), the count of `\x1b[0J` is **exactly 1**, the count of `\x1b` is **`H + 2`** (25), and its length
exceeds the same frame's un-cleared emission by **exactly `H × 3`** = **69** characters; **and every
`\x1b[K` fires at column 0** — the text **begins** `\x1b[H\x1b[K`, and **no** `\x1b[K` in it is
immediately followed by a newline.

*(Every number is derived from `H`, never hardcoded — the merged file's own rule. Measured on the
reference layout at this hop, from the real writer rather than a re-implementation: 425 → **494**
characters. The `\x1b` count is the assertion at `src/frame.test.ts:391` going from `2 + (H − 1)` to
`2 + H`; the byte delta is the cost claim made falsifiable.*

***THE COLUMN-0 CLAUSE IS THE CLAUSE THIS PROJECT'S FIRST FAIL BOUGHT, and it is an assertion rather
than a comment for a measured reason.** An erase fires where the cursor is. At the right margin the
cursor sits on the **last cell** with the wrap pending, so `EL(0)` **destroys that cell** — measured
by the Security/NFR gate on GNU screen 5.0.2 at a window exactly `W` wide, where the delivered
emission lost the board's whole h-file and its file label on every frame. At column 0 that state
cannot exist, so the emission stops depending on any emulator's margin representation: **safe by
construction, not merely by measurement.** And the clause carries weight the counts no longer can —
**once the counts move to `H` / `H + 2` / `H × 3`, QE's mutant `M2` (`map(row => row + \x1b[K)` joined
by bare newlines: `H` erases, every one AT the margin) matches all three counts exactly.** Under the
old `H − 1` counts the count alone killed it. **Measured: it now dies on the byte-exact text and on
this clause, and on nothing else in `A1`.** A future hop that drops the clause as a restatement of the
`toBe` would be removing the only assertion in the criterion that names WHY the order is what it is.*

***WITNESSED at this hop against NINE writers on an out-of-tree copy — one passes, eight fail:*** *the
required `RF-1` shape **PASSES**; the **delivered** erase-after-row shape **FAILS** (this is the whole
point of the repair); the merged bare-newline join **FAILS**; dropping row 0's leading erase — QE's
`M1`, `H − 1` — **FAILS**; dropping the reserved prompt row's leading erase — `H − 1`, behaviourally
identical, killed on spelling, see `## Scope` — **FAILS**; `M2` above **FAILS**; a leading erase on
row 11 only (`M3`) **FAILS**; no `\x1b[0J` (`M4`) **FAILS**; and `\x1b[0K` for `\x1b[K` (`M5`,
semantically identical on every conformant terminal) **FAILS**. **`A1` was NOT relaxed: it kept all
four counts, kept the byte-exact text, and gained a clause.**)*

**A2 — AFTER EVERY REDRAW OF A SEQUENCE THAT NARROWS, THE SCREEN EQUALS THE FRAME, AT A REAL
TERMINAL WIDTH. This is the criterion the ticket exists for. Given** the four-frame sequence in
`## The measurement…` — `W` = **37, 18, 39, 18**, every frame exactly `H` rows — **when** the frames
are written through one session onto a modelled screen of **80** columns and again of **120**
columns, **then** after **each** of the four redraws, **every** row `0 … H − 2` of the screen, with
trailing spaces trimmed, **equals** the corresponding row of the frame just written, also trimmed.

**And the test must first assert that the sequence actually narrows**: `W` takes **at least two
distinct values**, and at least one adjacent pair has `W(next) < W(previous)`.

*(**The trimming is load-bearing and so is the width.** Untrimmed (`F2`, the merged `:379` form)
false-positives on any screen wider than the frame — that is every real terminal. At a screen width
equal to `W`(frame 1) the whole criterion degenerates into a fixture artifact, which is why 80 and
120 are named and why the test asserts each is **greater than** the widest frame. The narrowing
assertion is not ceremony: `ADR-0010` measured that the merged file's entire fixture space yields
`W` ∈ **{18}**, so a fixture that quietly stops narrowing turns this criterion green forever. **The
mutant that proves it:** with the fixture's claim string shortened so `W` no longer moves, this
criterion FAILS rather than passing vacuously. **Witnessed:** FAILS on the merged writer at both
widths (2 stale rows each); FAILS on the partial fix; PASSES on the clause-1 writer.*

***DOES NOT MOVE under `RF-1` — re-run at the repair hop and PASSES unchanged*** *at 80 and at 120.
The reason is structural rather than lucky: `F3` compares **trimmed** rows on a screen asserted to be
**wider** than the widest frame, so no row ends at the margin and where in the row the erase fires
cannot reach this criterion. It is also why `A2` could not have caught the regression — and why
`A1` has to.)*

**A3 — the fixture is PROVED able to catch the defect, in the suite, on every run. Given** the same
sequence, **when** it is written through the **un-cleared** emission — cursor-home, the rows joined
by a bare newline, one `\x1b[0J`, constructed in the test — onto the same 80-column screen, **then**
at least one row differs from its frame, and the differing text contains a fragment of the wider
frame that the narrower frame does not contain.

*(**This is a check on the check, and this project has now recorded a bar that cannot fail on the
regression it exists to catch SIX times** — most recently `ADR-0010`'s own cost table, which scored
a candidate as correct because that candidate had destroyed the substring the check keyed on.
`A3` makes `A2` self-evidencing: it fails the day the fixture stops being able to expose the defect,
which is the only way `A2` can rot. It costs one screen and two writes. **Witnessed:** passes on
both builds by construction — it tests the FIXTURE, not the writer — and FAILS on the degenerate
fixture mutant.*

***DOES NOT MOVE under `RF-1` — re-run at the repair hop and PASSES unchanged.*** *It constructs the
**un-cleared** emission in the test and the un-cleared emission is not what `RF-1` changes.)*

**A4 — a STEADY pair is not flagged. Given** two consecutive frames with the **same** `W`, **when**
they are written at 80 and 120 columns, **then** `A2`'s comparison holds with no failure.

*(The false-positive control. `F2` fails this at both widths on a **correct** build; this criterion
is what stops a future hop reaching for it. **DOES NOT MOVE under `RF-1` — re-run at the repair hop
and PASSES unchanged**, and for `A2`'s reason: it is `A2`'s comparison, at the same two real widths.)*

**A5 — the two append strategies and every frame VALUE are untouched. Given** a non-TTY sink and,
separately, a TTY sink reporting `H − 1` rows, **when** a frame is written, **then** the text is
**exactly** `frame.join("\n") + "\n"` and the count of `\x1b` is **exactly 0**; **and given** any
`assembleFrame` call, **then** its returned rows are unchanged by this ticket.

*(`ADR-0010` clause 8 keeps `4c` untouched and its `## Rollback` states no ticket's delivered
behaviour depends on the clearing. **Measured at the cut hop:** both append paths byte-identical
before and after, 0 escape bytes; full suite **676/676 on 22 files** with the production change and
before a single new test was added, so no existing frame VALUE moved.*

***DOES NOT MOVE under `RF-1` — re-run at the repair hop and PASSES unchanged.*** *`RF-1` edits the
in-place branch only; both append branches are untouched by construction and still emit 0 escape
bytes, and no frame VALUE is involved either way.)*

**A6 — the merged characterization at `src/frame.test.ts:735-771` is DISCHARGED, and replaced rather
than deleted. Given** the delivered build, **when** the suite runs, **then** that test no longer
asserts a stale tail is present, its `expect(widthOf(wide)).toBe(24)` / `expect(widthOf(narrow)).toBe(18)`
narrowing fixture **survives**, and the property it was pinning is asserted from the correct side by
`A2`.

*(**It must not be deleted.** It is the only place in the merged suite that constructs a narrowing,
its comment routes the decision to *"BA/PM + `ABC-016`/`ABC-017`"* — this ticket is that decision
arriving — and deleting a test that a ruling has just discharged is how the reason a property is
checked gets lost. **Witnessed:** with clause 1 applied, its assertion fails, and its `stale` array
is `[]`.*

***DOES NOT MOVE under `RF-1` — re-run at the repair hop and PASSES unchanged, and this one was worth
checking rather than assuming.*** *`A6` is the criterion most exposed to the repair: it is `F2` at the
**artificial** width, building `createScreen(24, widthOf(wide))`, so **every row of its `wide` frame
ends exactly at the margin** — the one place a margin change could bite. It passes because `RF-1`
fires no escape there. **Measured twice, deliberately: green under the merged screen model AND green
under `A7`'s repaired one.** Its two width assertions (`toBe(24)` / `toBe(18)`), its `stale`
computation and its `toEqual([])` are all untouched by this repair, and it stays the only criterion
keying row index 9 — QE measured that `A6` and `A2` kill different mutants precisely because they key
different rows, so nothing here narrows the suite.*

***One claim about `A6` was checked and came back FALSE, and it is recorded rather than dropped.***
*The obvious guess is that under `A7`'s repaired model the DELIVERED writer would turn `A6` red along
with the other margin-exposed sites. **It does not** — measured: with the model repaired and the
delivered writer left in place, **three existing tests go red and `A6` stays GREEN**. `A6` asserts
only about the **second, narrower** frame, whose 18-wide rows end at column 17 on its 24-column
screen — below the margin, where model and terminal agree. The wide frame's lost cells are overwritten
before anything looks at them. **So `A6` never could have caught this regression either**, and the
list of criteria that could is exactly one long: `A1`.)*

**A7 — THE SCREEN MODEL'S RIGHT MARGIN IS MEASURED, NOT ASSUMED, AND THE MODEL IS REPAIRED TO MATCH.
Given** the suite's screen model at a width of `C` columns and a row of exactly `C` printable
characters written to it, **when** `\x1b[K` is then written, **then** the cell at column `C − 1` is
**erased** — the row reads `C − 1` characters followed by one space — **and** the deferred wrap
**survives** the erase: the next printable character lands at **column 0 of the next row**. **And the
two controls that make the erased cell attributable to the escape and to nothing else:** the same `C`
characters with **no** erase leave all `C` cells intact, and `C − 1` characters followed by `\x1b[K`
leave those `C − 1` intact.

*(**A criterion on the TEST DOUBLE, and the one whose absence let a real regression pass six green
criteria, a 14-mutant campaign with zero survivors, and 681 green tests.** The model lets `column` run
to `columnCount` and makes the erase a **no-op** there (`src/frame.test.ts:212-215`, `:250-256`); a
real terminal keeps the cursor at `columnCount − 1` with the wrap pending, and `EL(0)` erases from the
cursor. `C` is the model's own column count and the row is sliced to it — nothing here is hardcoded,
and `H` and `W` do not appear.*

***The asserted behaviour is not a reading of ECMA-48. It is a MEASUREMENT*** *— the Security/NFR
gate's, on GNU screen 5.0.2 driven attached to a pty whose winsize it set with `TIOCSWINSZ`, read back
with screen's own `hardcopy`, at a 10-column window: ten characters survive; nine plus `\x1b[K`
survive; **ten plus `\x1b[K` lose the last cell**; and the wrap-pending flag survived the erase. **The
two controls above ARE that gate's two controls**, and the criterion exists so the number lives in the
suite instead of only in a note. The model's *"assumptions stated rather than buried"* block at
`:178-191` then holds four statements of which **one is measured rather than assumed, and it should
say so.**

***WHY THIS IS A CRITERION AND NOT THE ACCEPTED RISK `AR-1` ALONE — measured, not argued.*** *With
`RF-1` in place the writer never fires an escape at the margin, so the model's margin case becomes
**unreachable through the writer**. Measured at the repair hop by applying the repair and reverting
it: the full suite is **682/682 either way except for this criterion**, which **fails alone**. So
`AR-1` assigned to the Engineer *without* a criterion has **zero enforcement** — the repair could be
skipped, or silently undone a year later, and nothing anywhere goes red. That is this project's
most-recorded defect class, a check that cannot fail, in its purest form: the check would not exist.*

***AND THE REPAIR IS NOT COSMETIC — the sharpest number this hop produced.*** *With the margin
repaired and the **delivered** writer left in place, **three existing `ABC-018` tests go red**, and
the failure text is literally the lost h-file: ``expected '8 .♜:♞.♝:♛.♚:♝.♞: ' to be
'8 .♜:♞.♝:♛.♚:♝.♞:♜'``. **The suite reproduces the real-terminal FAIL on its own instrument the moment
the instrument stops lying** — which is what stops the next writer change from walking into this hole,
and it is why the repair belongs bound to `RF-1` in the same hop rather than carried as a risk.*

***WITNESSED:*** *FAILS on the merged model (``expected 'ABCDEFGHIJ' to be 'ABCDEFGHI '``), PASSES on
the repaired one, and it is **the only test in the suite that moves** between the two. **NOT a
constant-frame-width criterion and not a terminal read** — see `## Out of scope`. Neither `ADR-0009`
nor `ADR-0010` is re-opened: this is the test model's fidelity, not the ownership ruling.)*

## Dependencies

- **`ABC-018`** (the frame). **Merged on `main` 2026-08-09 and CLOSED.** This ticket edits its
  production module (`src/frame.ts`) and its test file (`src/frame.test.ts`). Named here because a
  new obligation on a closed ticket's files must be visible on a ticket rather than discovered in a
  diff — the same posture `ABC-017`'s fourth `ABC-018` edge takes. **`ABC-018` is not reopened.**
- **`ABC-014`** (the board). Merged. Supplies the real 9 × 18 `renderBoard` the fixtures use, which
  is also what pins `W` at 18 in the merged suite and therefore what the narrowing fixture has to
  beat.
- **`ADR-0010`** — accepted and merged. Clause 1 is the ruling; clause 7 is `ABC-019`'s half; clause
  2 is why no panel is touched.
- **NO dependency on `ABC-016` and NO dependency on `ABC-017`, and this was MEASURED rather than
  assumed.** Neither `src/status-panel.ts` nor a history-pane module exists on `main`; this ticket
  imports no symbol from either; and the whole change was built and run against today's `main` with
  both panels absent — **681/681 on 22 files, skip 0**. **This ticket goes green ALONE.**
- **`ABC-019`** (the turn loop). **`ABC-027` BEFORE `ABC-019` is FORCED** — `ADR-0010` clause 7 gives
  `ABC-019` a criterion (`F3` over a played game containing a narrowing) that the **correct** build
  cannot pass until this writer clears per row. Re-measured here from the other side: that form
  fails on the merged writer at 80 and 120 columns and passes on the clause-1 writer.
  **`ABC-019` is `In Development` now; nothing was written to its ticket or its branch at this hop.**

## Security / NFR triggers

- **`NFR-002` (full redraw < 16 ms) — NO target moves, no bar is created, moved or loosened, and
  `plans/nfr-catalog.md` is NOT edited by this ticket.** `ADR-0010` already recorded the denominator
  note there. This ticket adds **+69 characters per frame, exactly and always** (`H × 3`) — measured
  425 → **494** characters for a 23-row frame — which is irrelevant against a 16 ms budget and is
  stated so the row's serialized-length figures are not later read as stale for an unknown reason.
  Still **one** `write()` per frame, so `NFR-007`'s single-write constraint is untouched and `A1`
  asserts it.
  - **`+66` → `+69` does NOT re-open the bar, and the headroom is measured rather than assumed.** The
    Security/NFR gate re-derived `NFR-002` on its own instruments and found the delivered **+66
    characters cost +0.13 / +0.15 µs** — 0.0009% of the 16 ms budget, ~2,500x headroom including
    `assembleFrame`, with its merged cell reproducing `ABC-018`'s gate figures for the same quantity.
    **The three extra characters are 1/22nd of a change that was already 0.0009% of budget.** `MET`
    stands; no row is owed and none is written.
- **`NFR-008` / `N8-LANE` — declared against, NOT re-derived.** *(Re-deriving a lane bar has cost
  this board two ruling hops; nothing here reopens `NFR-008`.)* **This ticket adds ZERO test files**
  — every criterion lives in the existing `src/frame.test.ts`, which is already in the lane — so its
  floor allowance is **0 ms** and only the content allowance (≤ 650 ms CPU) applies. Measured at this
  hop by paired runs (n = 3, out-of-tree copy, Apple M3 (Mac15,13), Node v24.12.0, darwin/arm64):
  `src/frame.test.ts` at **1.43 s** CPU without the new criteria and **1.47 s** with them — a
  **~20 ms** median delta, ~3% of the content allowance. **`UNKNOWN - verify` on any other
  hardware, n = 3 is below `N8-LANE`'s own n ≥ 7 protocol, and the figure is INDICATIVE: the real
  measurement is the Security/NFR gate's on delivered code.**
- **No security trigger, and it is structural rather than a judgement.** This ticket introduces no
  input. The two escape sequences it emits are module constants; no user-supplied text reaches the
  writer un-sanitized (`sanitize` at `src/frame.ts:101-110` already strips C0 and `U+007F` from every
  panel row and message item before assembly, and this ticket does not touch it). The change adds a
  fixed 3-character sequence between rows the module itself produced.
- **`EPIC-002` acceptance `4b` and `4c`** — `ADR-0010` clause 8 rules both unbreached. `A5` is `4c`'s
  half asserted here (**0 escape bytes** on both non-in-place paths, measured); `A1` is `4b`'s.

## Test notes

- **The screen model's `\x1b[K` case is NOT OPTIONAL and it is the first thing to write.** Measured:
  with the production change and without the model change, **5 tests THROW** —
  `src/frame.test.ts:187-188` and `:232-236` make the model throw on any escape it does not
  implement, which is a deliberately good design and is why the suite cannot silently certify this.
  Implement it as erase-from-cursor-to-end-of-line, cursor unmoved, mirroring the existing
  `eraseToEndOfScreen` helper's loop. **This is delivered.** What is NOT delivered is the model's
  **margin** case, which `A7` now owns.
- **`A7`'s model repair, and the one thing that makes it subtle.** With the wrap pending the cursor is
  really at `columnCount − 1`, not one past it, so **both** erase helpers must erase from the cursor's
  real column — `eraseToEndOfScreen` as well as `eraseToEndOfLine`, because a real terminal's `ED`
  erases from the cursor too and leaving one of the two honest would be a model that disagrees with
  itself. **Measured at the repair hop: repairing both, plus `A7`, takes the suite to 682/682 on 22
  files with lint and typecheck clean; `A7` is the only test that moves when the repair is reverted.**
  The shape of the fix is one derived column, not a rewrite of the model.
- **The assertion sites that hardcode the old emission, RE-MEASURED at the repair hop by applying
  `RF-1` to an out-of-tree copy with the suite otherwise untouched.** The merged table below named
  four sites and predicted them from reading; this one was **run**, and it is **three, not four** —
  line numbers are the delivered file's.

  | site | what it says today | what `RF-1` does to it |
  |---|---|---|
  | `:389` | `expect(redraw).toContain(second.join(EL + "\n"))` | **RED** — the erase now precedes each row: `EL + second.join("\n" + EL)` |
  | `:391` | `expect(occurrences(redraw, "\x1b")).toBe(2 + (HEIGHT - 1))` | becomes `2 + H` = **25**. **MASKED AGAIN — `:389` fails first, so this one never reports.** The same masking the cut hop recorded at `:374`/`:376`; it repeats, and a build that fixes only what the runner prints will leave this wrong |
  | `:436` | `expect(body).toBe(frame.join(EL + "\n"))` | **RED** — the slice arithmetic site. `body` is now `EL + frame.join("\n" + EL)`. Its sibling assertion `expect(screen.cursor()).toEqual({row: H − 1, column: 0})` **does NOT move**: the prompt row is empty, so the cursor still lands at its start |
  | `:790` (`A6`) | `expect(stale).toEqual([])` | **GREEN, unchanged.** The merged table listed this site because clause 1 moved it; `RF-1` does not. Measured, not assumed |

- **`plans/traceability.md` carries `+66 characters … (H − 1) × 3, measured 425 → 491` in `ABC-027`'s
  NFR cell and it is OWED an update at the `RF-1` hop, not before.** Deliberately not edited at the
  repair hop: that figure is TRUE of the code that exists right now, and editing it before the code
  changes would make the trace describe a build that does not exist — the fake trace Workflow 16
  forbids. **Named here so it is not discovered in a diff.**

- **Do NOT reuse `:381`'s form (`rowsOnlyIn`) for a narrowing test.** Measured at this hop: on a
  narrowing pair at a screen width equal to `W`(frame 1) it flags the **correct** build, because it
  compares rows padded to two different widths. It is sound where it stands today only because the
  existing fixtures hold `W` at 18.
- **Do NOT reuse `:379`'s form (untrimmed `screen == frame`) at a real width.** Measured: it
  false-positives on a **steady** pair at 80 and 120 columns on a correct build. It works today only
  because the model is constructed at exactly `widthOf(first)`.
- **The narrowing fixture must move WIDTH ONLY and leave every panel's ROW COUNT at the reference
  layout.** `src/frame.test.ts` asserts `H` = 23 and ~40 assertions consume `HEIGHT`; a fixture that
  changes a row count collides with `ABC-017`'s `A13` and with `ADR-0009` clause 9c's precedent for
  `statusStub` / `historyStub`. Vary the status stub's third row; leave it three rows.
- **`partsFor(game, { status: [...] })` already accepts a status override** — `:745-750` uses it —
  so the fixture needs no new helper.
- **State the machine beside any microseconds and put no wall-clock assertion in the suite** — this
  project's standing rule. `A1`'s byte delta is a character count, not a clock, deliberately.
- **The whole change was built and gated out-of-tree at the cut hop and the expected shape was known:**
  `676/676 on 22 files` with the production change and the assertion sites repaired, and
  **`681/681 on 22 files, skip 0`** with the five criteria added — **22 files either way, because no
  test file is added.**
- **RE-MEASURED AT THE REPAIR HOP, and this is the number the `RF-1` hop should expect.** Same method,
  fresh out-of-tree copy of this worktree, `node_modules` symlinked, baseline verified at **681/681 on
  22 files** first:

  | state of the copy | result |
  |---|---|
  | `RF-1` applied, **suite untouched** | **3 failed / 29 passed** — `:389`, `:436`, `A1`, and nothing else |
  | screen model's margin repaired, **delivered writer left in place** | **3 failed** — the two in-place `ABC-018` redraw tests and the longer-previous-frame pin. `A6` stays GREEN |
  | `RF-1` + repaired `A1` + model margin repair + `A7` | **682/682 on 22 files**, `tsc --noEmit` 0, `biome check` clean |
  | the same, with the model repair **reverted** | **`A7` fails alone** |

  **`681` → `682` is one new test and ZERO new test files**, so `N8-LANE`'s floor allowance stays
  0 ms. These are BA/PM's numbers from a copy; **the gate's own run on delivered code is what counts**,
  and this hop wrote no `src/` byte in the repository.

## Merge position

**`ABC-027` BEFORE `ABC-019` is FORCED and BA/PM confirms it independently** — see
`## Dependencies`. Not disputed.

**`ABC-027` AFTER `ABC-017` was stated by the Orchestrator as a PREFERENCE and BA/PM DISPUTES it.**
The recommendation is `ABC-027` **before** `ABC-017`; the argument, the honest cost, and the
condition attached to it are in `## Size and priority rationale` and in
`.grugops/context/refinement-ABC-027-cut/notes/`. **Merge order is the Orchestrator's and this
ticket does not change it** — it records the argument where the next reader will find it.

## Size and priority rationale

**RE-DERIVED AT THE REPAIR HOP 2026-08-12: `S` and `P1` BOTH HOLD, and neither moves.** The
arguments below stand as written; what the repair adds is recorded first, so the re-derivation is
visible rather than asserted.

***Size stays `S` (2), and the honest split is worth stating.*** *The ticket's size is the WHOLE
ticket's, and most of that work is delivered. The REMAINING work at the `RF-1` hop is **`XS` by any
reading**: **three characters** of production (`+69` against `+66`), two false sentences in
`src/frame.ts` comments, **three** assertion sites, `A1`'s five assertions, one derived column in the
screen model, and `A7`'s ~15 lines. Measured end to end at this hop on a copy: **682/682 on 22 files,
zero test files added, lint and typecheck clean.** The whole-ticket estimate does not move for a
three-character correction, and `M` is still reserved for the one thing that would earn it —
`assembleFrame` having to change, which `ADR-0010` clause 2 exists to prevent and which `A5` still
asserts did not happen. **Nothing here is `XL` and no split is indicated.**

***Priority stays `P1`, and the boundary that could have moved is argued rather than skipped.*** *The
case for `P0` is real: the ticket now carries a **measured regression** rather than a projected one,
and this project's first gate FAIL. **It still fails the `P0` test, for the reason the original
argument gives.** `P0` is "drop everything", and nothing new has to be dropped: the regression lives
on a branch that has **not merged**, no player can reach it, nothing composes a frame in a loop until
`ABC-019`, and the ticket is already at the head of its lane with an Engineer hop queued behind this
one. **The gate's FAIL is what holds it, and a blocking gate is a stronger instrument than a priority
letter** — raising `P1` to `P0` would change no routing and would be inflation. `P2` is further away
than it was: the ticket now fixes one misreported game state and is under obligation not to introduce
another.*

**Size `S` (2), at the BOTTOM of the band. Not `XS`, and this board makes that argument explicitly
each time** (`ABC-009`, `ABC-015`, `ABC-022` all record a "Not `XS`" reason).

*The production side alone would be `XS`: **one** expression and **one** module constant, plus a
header sentence — measured, because the change was built. What holds it at `S` is that the test side
is not one guarded condition. It is **five assertion sites across four tests**, one of which is a
characterization that must be **replaced rather than deleted** (`A6`), plus a criterion whose
**FORM is a judgement with three measured wrong answers** — `F1` blind at real widths and
false-positive at the artificial one, `F2` false-positive at real widths, `F4` failing the correct
build. A build that reaches for any of them is wrong and reads fine. Calibrated below `ABC-018`
(`S`), which built this entire module, and below `ABC-017` (`S`, top of band, 13 criteria and two
test files). **It would move to `M` only if `assembleFrame` had to change, and `ADR-0010` clause 2
exists precisely so that it does not.***

**Priority `P1`.**

***Not `P0`.*** *`ABC-019`'s **development** is not blocked — it can build its seams and `A9b`
against today's writer, and only its owed `ADR-0010` clause 7 criterion cannot pass. And nothing
composes a frame in a loop yet, so **no player can see this defect today**. `P0` is "drop
everything" and this does not stop anyone from working.*

***Not `P2`, and the reason is the one that moved it off `ABC-017`'s tier.*** *This is a correctness
defect in **merged production code** that prints a **wrong material count** and keeps an **expired
draw claim** on screen — the owner's standing legality/correctness-first directive ranks a
misreported game state above renderer feel. It is a **hard predecessor of a `P0` ticket's
acceptance** that is `In Development` right now. And unlike `ABC-017`, which its own ticket places in
the "right thing to drop first" tier, **this ticket cannot be dropped at all**: dropping it means
`ABC-019` merges without the only criterion `ADR-0010` clause 7 requires, on a writer the ADR
measured as producing stale columns on 5–16 of every 20 redraws. `P1` also matches `ABC-016`, the
other `EPIC-002` correctness-adjacent item.*

### The merge-order dispute, argued rather than asserted

**The Orchestrator invited this argument and marked the edge arguable. BA/PM's recommendation:
put `ABC-027` before `ABC-017`. It is a recommendation, NOT a forced edge** — calling a preference
forced is an error this round has already recorded twice and this is not a third.

1. **`ABC-027` has exactly ONE ordering constraint and it is the forced one.** Measured: neither
   panel module exists on `main`, this ticket imports no symbol from either, and the full suite runs
   **681/681 on 22 files** with both absent. **`ABC-017` is NOT independent** — its own `A13` reads
   `ABC-016`'s exported `STATUS_ROWS` from delivered code, so `A13` is *"not evaluable until
   `ABC-016` has merged"* (its words). The current order puts the ticket that has a dependency ahead
   of the ticket that has none, on the path to the forced edge.
2. **The stated reason for the preference is now spent.** *"`ABC-017` is sized and ready while
   `ABC-027` is uncut, so ordering by readiness costs nothing"* was true when it was written. As of
   this hop `ABC-027` is cut, sized, prioritised and DoR-complete. The readiness gap is one gate
   move, not a wait.
3. **The shared-file reason is weak in BOTH directions, and that is a measurement.** The two tickets
   edit **disjoint regions** of `src/frame.test.ts`: `ABC-017`'s `A13` touches the shadow-constant
   block at `:38-45` and the `= 23` / `<= 24` assertions at `:288` and `:633`; `ABC-027` touches the
   screen model (`:203-207`, `:219-223`), `:374`, `:376`, `:419` and `:735-771`. **No line is claimed
   by both.** So "both touch `src/frame.test.ts`" does not favour either order — it is not an
   argument for the current one either.
4. **The risk asymmetry is the real argument.** `ABC-027` changes a **merged production expression**
   that `ABC-019`'s Engineer is building against **right now**. `ABC-017` changes **zero production
   lines** — its own ticket says so and `src/` was byte-identical at its hop. Landing the production
   change earlier puts the writer's final byte shape in front of the live branch sooner; landing the
   test-only change earlier puts nothing in front of it. Every hop `ABC-027` waits, `ABC-019`
   accumulates work against an emission that is about to gain 22 escapes per frame.
5. **The honest cost of flipping, stated rather than hidden.** `ABC-016` is `In Review`; when it
   merges, `ABC-017` becomes fully evaluable and pullable. **If the Orchestrator has a free
   development slot before it gates this ticket, pulling `ABC-017` first is better than pulling
   nothing.** So the dispute is **conditional**: gate `ABC-027` at this hop and it should go first;
   decline to gate it now and the original order stands and costs little. **Either way a rebase
   settles it, exactly as the Orchestrator said.**

## Definition of Ready

Derived from `agent-factory/checklists/definition-of-ready.md` at `refinement-ABC-027-cut`,
2026-08-11. **BA/PM's verdict: MET, 10 of 10.** Every ✅ below was verified against merged `src/` at
this hop, not asserted.

> **RE-RUN AT THE REPAIR HOP 2026-08-12, and only the four items the repair actually touched were
> re-checked.** Items **4**, **6**, **7** and **2** are re-annotated below; **1, 3, 5, 8, 9 and 10**
> were deliberately NOT re-ticked, because a DoR block that only ever says ✅ is how twenty-five
> defects got through on `ABC-019`. **Verdict unchanged: MET, 10 of 10** — the ticket does not return
> to `Backlog`. **`A1` was re-derived, not relaxed; `A7` was added; nothing was struck.**

| # | Check | Verdict | Evidence |
|---|---|---|---|
| 1 | problem clear | ✅ | user, pain and value stated; the pain is a **wrong material count** and an **expired draw claim**, both measured through the screen model, not inferred |
| 2 | scope and out-of-scope clear | ✅ **re-checked 08-12** | one expression, one constant, **two** comment blocks in `src/frame.ts`, one test file; the **prohibition** on a constant-width criterion is in `## Out of scope` as a scope item, not a footnote, **and `A7` is checked against it there rather than assumed clear**; the trailing-erase note is **re-argued, not left stale** |
| 3 | INVEST | ✅ | **independent MEASURED**: neither panel module exists on `main`, no symbol imported from either, **681/681 on 22 files** with both absent. Small, and estimable because the change was **built** |
| 4 | acceptance testable and measurable | ✅ **re-checked 08-12** | **7** criteria, every number still derived from `H` (and `A7`'s from the screen's own `C`); `A1` **re-derived to `H` / `H + 2` / `H × 3` and witnessed against NINE writers, one passing and eight failing**; `A2`–`A6` each **re-run against the `RF-1` emission and none moves**; `A7` witnessed failing on the merged model and passing on the repaired one. **Nothing became a range, a `toContain` or an approximation** |
| 5 | dependencies known | ✅ | `ABC-018` (closed, both its files edited — named, not discovered in a diff), `ABC-014`, `ADR-0010`; **`ABC-019` FORCED after**; `ABC-016`/`ABC-017` measured **not** dependencies |
| 6 | security/NFR triggers, measurable | ✅ **re-checked 08-12** | `NFR-002` **+69 characters exactly** (`H × 3`, 425 → 494), no target moves, **catalog still not edited and none owed** — the gate measured the delivered +66 at +0.13/+0.15 µs, 0.0009% of budget, so three more characters do not reach any bar; `N8-LANE` still **ZERO test files added** (`A7` lives in `src/frame.test.ts`), floor allowance 0 ms, bar **not re-derived**; security half **triggered, run and clean** at the gate over 180 cases, and `RF-1` adds one module-constant escape, no input path |
| 7 | test notes present | ✅ **re-checked 08-12** | the not-optional model change (**5 tests throw without it**), the assertion sites **re-measured by running `RF-1` rather than predicted — three, not four, and the masking repeats**, `A7`'s two-helper subtlety, the two forms that must NOT be reused with the measurement that kills each, the row-count constraint on the fixture, and the **owed `plans/traceability.md` figure named rather than left in a diff** |
| 8 | size assigned | ✅ | `S` (2), bottom of band, with the "not `XS`" argument this board requires |
| 9 | priority assigned | ✅ | `P1`, with both boundaries argued (`not P0`, `not P2`) |
| 10 | no major unresolved blocker | ✅ | `ABC-018` and `ABC-014` merged; `ADR-0010` accepted; nothing waits on `ABC-016` or `ABC-017`. **Three flags carried, each with an owner, none blocking** |

**NOT PLACED IN `Ready for Dev`.** BA/PM owns the `Backlog → Ready` exit and has signed it; the
`Ready → Ready for Dev` gate is the **Orchestrator's** and was deliberately not taken here. The
board row is **requested** in this hop's context notes, not written — `plans/board.md` is the
Orchestrator's.

**Four flags carried, each with an owner, none blocking** (three from the cut hop, one added by the
repair; flag 3 is reworded on QE's routing):

1. **`ADR-0010`'s `## Consequences` under-counts the test changes and its *"first narrowing
   fixture"* clause is false** — measured above. **Owner: Architect/Design**, whenever
   `memory-bank/50-decisions/` is free. Nothing in the ruling changes; `A6` covers the consequence.
2. **Epic `4b`'s *"zero rows from frame N"* wording is blind to this defect at any real terminal
   width** (`F1`, re-measured here, and it also false-positives on the correct build at the
   artificial width). `ADR-0010` clause 8 covers it at ticket level on purpose. **Owner: BA/PM**, and
   it is a wording hop only if the owner reads *"in one operation"* as forbidding the extra erase —
   a reading `ADR-0010` explicitly does not take.
3. **The screen model implements `\x1b[H`, `\x1b[0J` and, after this ticket, `\x1b[K` — and throws on
   everything else.** That is correct and deliberate. **REWORDED 2026-08-12 on QE's routing, because
   the merged wording invited exactly the wrong reading.** It said a red suite here "should not be
   read as a defect", which tells the next engineer to treat the red as ceremony. The accurate
   statement is narrower and more useful:

   > **Any change to the BYTES the writer emits is gated by a model edit — including a change that
   > emits a SEMANTICALLY IDENTICAL sequence. The model gates the emission's spelling, not its
   > meaning.**

   QE measured it: `\x1b[0K` and `\x1b[K` are the same sequence (ECMA-48 makes an omitted parameter
   `0`), and swapping one for the other turns **8 tests red, five of them by the model THROWING**.
   That is still the right trade — a model that parsed CSI generally would be a terminal emulator, and
   coding rule 7 forbids unrequested flexibility — but the red is **diagnosable only if the flag says
   what is gated.** The correct action on those throws is a two-line model edit, not a shrug.
   **Owner: whoever changes the writer next.**
4. **ADDED 2026-08-12 — the model's fidelity is now asserted in ONE place (`A7`) and only at the
   margin.** Everything else the model does is still assumption. `A7` covers the case a real terminal
   was measured on; the other three statements in the `:178-191` block are unmeasured and should not
   be read as promoted by association. **Owner: Architect/Design** if model fidelity is ever judged an
   ADR-level question — Security/NFR's `AR-1` names the same alternative owner. **Not blocking:** the
   remaining three are the same assumptions the suite has always carried, and `RF-1` makes none of
   them newly load-bearing.

## Source

`memory-bank/50-decisions/ADR-0010-frame-width-stability-ownership.md` (accepted, merged
2026-08-11) clauses 1, 2, 7 and 8; `.grugops/context/design-frame-width-clearing/notes/` (the
Architect's measurements); `.grugops/context/adr0010-routing-2026-08-11/notes/` (the Orchestrator's
routing, which named this id); `.grugops/context/refinement-ABC-027-cut/notes/` (the cut hop —
every criterion witnessed, and the mutants that kill each one).

**The repair hop's sources**, all read before `A1` was touched:
`.grugops/context/security-nfr-ABC-027/notes/` (five notes — the real-terminal measurement, the
primitive with its two controls, `RF-1` measured rather than proposed, and `AR-1`);
`.grugops/context/quality-gate-ABC-027-qe/notes/` (four notes — the 14-mutant campaign, the
attribution that puts 9 of 14 kills on `A1`, the margin `claim` that was right and said so, and the
flag-3 wording routing); `.grugops/context/abc027-fail-2026-08-12/notes/` (the Orchestrator's
acceptance of the FAIL and the forced BA/PM-before-Engineer ordering); and
`.grugops/context/refinement-ABC-027-a1/notes/` (**this hop** — the emissions counted from the real
writer, the nine-writer witness table for the new `A1`, and the measurement that put `A7` in the
criteria instead of leaving it as `AR-1`).
