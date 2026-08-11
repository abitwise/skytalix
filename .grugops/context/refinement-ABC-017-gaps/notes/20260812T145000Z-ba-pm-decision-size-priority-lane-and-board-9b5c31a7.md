---
id: 20260812T145000Z-ba-pm-decision-size-priority-lane-and-board-9b5c31a7
kind: decision
by: ba-pm
at: 2026-08-12T14:50:00Z
verified_by:
confidence: high
refs:
  - refinement-ABC-017-gaps
  - abc017-gaps-2026-08-12
  - ABC-017
  - ABC-010
  - ABC-019
  - ABC-027
  - EPIC-006
  - NFR-002
  - NFR-008
  - plans/board.md
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - agent-factory/checklists/definition-of-ready.md
  - 20260812T140000Z-orchestrator-decision-merge-call-d71b3e05
  - 20260812T130500Z-security-nfr-decision-verdict-and-risks-9a4e28f1
supersedes:
---

# `S` (2) and `P2` re-derived a SEVENTH time and both unmoved; `SPLIT_REQUIRED` does not apply; `N8-LANE` untouched; DoR 9 of 10 with item 4 ❌ again. Board move requested: NONE.

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, no
> self-attested stamp.

## Size — `S` (2), unmoved, and it was genuinely in question

This hop **cut a criterion** (`A14`), which is the first time since `A13`, so the question was real
rather than ceremonial.

**What is owed after this ruling:** `A6` gains one fixture and three assertions; `A9` gains one
captured field and one during-render observation; `A14` is one test with one object; `A11` gains
**words only — no assertion moves**, because the guard's reach is the Engineer's half of `RF-1`.
**Zero production lines, zero new modules, zero new test files, zero new dependencies, zero new
inputs, no architecture change.** All four edits land in the two test files that already exist.

Band `XS=1 S=2 M=3 L=5 XL=8`. On this ticket `S` has meant *"layout and numbering over a slice of an
existing list"* through six re-derivations. **Four test edits inside two existing files do not make
it `M`.** The one thing that would — a production line, or a criterion forcing one — was **declined
twice at this hop**: `HISTORY_COLS` is not widened (`ADR-0010` cl. 2 is not re-opened), and `RF-1`'s
guard is a test instrument, not a module. **`S` (2) holds, top of the band, still below `ABC-016`
(`M`).**

## `SPLIT_REQUIRED` — NO, checked explicitly rather than by precedent

The rule bites at `XL` (8) and this is **2** — four sizes clear, so the arithmetic is not close. The
more useful check is the one a number cannot answer: **a split must produce two independently
valuable tickets.** Every one of the four owed edits is a guard on the **same delivered pane, in the
same two files, owed by the same Engineer hop**; splitting them would manufacture a second ticket
with no product value that could only be worked after the first. **And the ticket is BUILT — the
remainder is smaller than the whole**, which is the opposite of the condition a split exists to
relieve. (`ABC-019` adopted a caution that a fifth production-scope hop must re-derive against
`SPLIT_REQUIRED` rather than by precedent; that caution is honoured here even though this hop adds no
production scope at all.)

## Priority — `P2`, re-read a seventh time, unmoved

**The value argument is untouched verbatim:** the game is fully playable without a history pane — the
board renders, the loop runs, the status panel names the last move — and `EPIC-006`'s end screen
carries the full list. It is the "feel" item and the right thing to drop first if this epic runs long.

**`D25` is the closest thing this hop found to a priority argument, and it deliberately does not move
one.** `A14` guards a failure that would make the pane useless inside `ABC-019`. But **a pane that is
dropped cannot be cached** — `A14` dies with the ticket it guards, so it adds **no cost to dropping
this ticket**. That is the honest distinction from `D20`, which **did** add such a cost and is
**unchanged and still carried**: `A13` is the only delivered-code guard on epic `4b`'s 24-row budget
across the `board` and `history` terms, so dropping this ticket still obliges someone to **re-home**
`A13`.

**Letting a guard gap re-rank a product is the same error as letting a checklist or a suite defect do
it** — refused on this ticket at `ADR-0009`, refused again at `D23`, refused here. `P3` stays wrong
for the reason given six times: `P3` is "someday", and this is in the epic's scope line and in its
Done.

## `N8-LANE` — NOT re-derived, NOT moved, file count still TWO

The ticket forbids re-deriving it and this hop did not. **All four owed edits land in
`src/history-pane.test.ts` and `src/history-pane.nfr.test.ts`, both already declared**, so the floor
allowance stays **~320 ms** and everything owed is **content** against the **650 ms** allowance
(5% of the lane's TOTAL budget, not of the lane as it stands).

**What I expect the fixture hop to cost, stated as an ESTIMATE with its basis — this hop measured
none of it:**

| edit | expected cost | basis |
|---|---|---|
| `A6`'s fourth anchor | sub-millisecond | a **20-ply** knight cycle; a full rebuild of all **fourteen** heavy fixtures — 2,000-ply shuffle and 300-ply deterministic game included — was measured at **8.2 ms warm** |
| `A9`'s third field + during-render clause | negligible | one captured string, one comparison, one live observation |
| `A14` | negligible | one object, one `playMove`, two renders at **39–74 µs** each (two roles' measurements) |
| `RF-1`'s guard | small | replaces a `readFileSync` scan of 14 production files with a load probe over a **7-module** closure |

**Expectation: TENS OF MILLISECONDS total, comfortably inside the 650 ms content allowance and inside
the ~410 ms this ticket has already measured against it.** For calibration, the delivered `A9`
fixture change — a heavier edit than any of these — cost the Engineer **~35 ms cold ≈ 6%** of the
allowance.

> **This is a prediction to CHECK, not a figure to inherit.** The Engineer has already caught one
> warm-state figure on this ticket (the 8.2 ms was warm; cold is 58–68 ms) and should measure rather
> than trust this table. **No bar is re-derived and no clause of `N8-LANE` is changed.**

## Definition of Ready — re-derived a fifth time: 9 of 10, item 4 ❌

**Item 4 (*acceptance testable and measurable*) is ❌ for the FOURTH time on this ticket and the
fourth time in the same place.** `D18` recorded that a wrong self-assessment is a defect because it
is what a promoting role reads; it is now a habit and is stated rather than buried.

What is new is the **question**. Item 4 was ❌ at `refinement-ABC-017` on *"can a wrong build pass?"*,
❌ at `repair-panel-tickets` on the `ADR-0009` repair, ✅ at `refinement-ABC-027-cut`, ❌ at
`refinement-ABC-017-a3` on *"can each clause actually FAIL?"* — and ❌ here on a **third** question
nobody had asked: **not can a clause fail, but is there an INPUT CLASS the whole acceptance table
never reaches?** There were two, plus one clause that was false as worded.

**The ticket does NOT return to `Ready`.** It is built, both gates passed it with zero code defects,
and the remedy is four test edits, not a re-specification. **The ❌ is recorded honestly rather than
softened to ⚠️** — a criterion that never reaches an input class is not a partially-met check, and on
this ticket a ⚠️ has twice been the shape a defect hid in.

## Flags carried — five, each with an owner, none blocking

1. **The replay coefficient for `NFR-002`** — now **measured** by Security/NFR and reported as a
   **band** (4.86–4.92 ns/ply by total-render regression against 6.93–6.98 by replay-loop isolation;
   the two instrument families disagree and that gate declined to smooth them). Whoever writes the
   catalog row should write the band, not a false point estimate.
2. **`ABC-010`'s unbounded `fullmoveNumber`** — carried, not owned.
3. **`A13`'s re-homing** if this ticket is dropped, deferred or resequenced — the Orchestrator's.
4. **`HISTORY_COLS` held at 21 for a cross-ticket reason no criterion here guards** (`G5`/`AR-4`) —
   **deliberately UNOWNED**, and this hop declined to home it.
5. **NEW — `AR-1`, the supplied-FEN width and compute path.** Owner **BA/PM at `ABC-010`**, with
   **Architect/Design at `EPIC-006`** as the checkpoint. Trigger: the first time a FEN reaches the
   process from outside it. **Accepted, not fixed here:** the gap is in `src/fen.ts`, pre-exists this
   ticket, is unreachable until `EPIC-006`, is already an accepted limitation in `## Out of scope`,
   and is **bounded at +19 characters**. Recorded on the ticket so `ABC-010` inherits a bar
   (+19 chars; compute crosses the 150 µs pane bar at ~1.5e5 FEN digits) rather than a feeling.

## BOARD MOVE REQUESTED — **NONE**. Not taken; `plans/board.md` was not written.

**`ABC-017` stays in `In Development`**, which is where the Orchestrator deliberately put it for
exactly this sequence. The Engineer's fixture hop follows this one, and a move now would have to be
reversed immediately.

| column | before | after |
|---|---|---|
| `In Development` | 1/3 (`ABC-017`) | **1/3 — unchanged** |
| `In Review` | 1/3 (`ABC-019`) | 1/3 — unchanged |
| `In Security/NFR` | 0/2 | 0/2 — unchanged |

All inside their WIP limits. **The ticket's frontmatter was NOT written either** — it already reads
`status: in-development` / `column: In Development` and is correct.

> **One trap for the Orchestrator, and it is a rebase hazard rather than a defect.** This branch is
> **one commit behind `main`** (`e22ed72`, *"docs(board): grug move ABC-017 BACKWARD…"*), so the
> branch's copy of `plans/board.md` still shows this ticket under `In Security/NFR` while its
> frontmatter says `In Development`. **`main`'s board is correct.** A later role that "fixes" the
> branch copy will conflict with `e22ed72` at the rebase. **This hop did not touch it.**

## Re-gate consequence, unchanged and restated so it is not lost

The Orchestrator already named it and this hop does not enlarge it: `RF-1` changes
`src/history-pane.nfr.test.ts`, the file holding `A11`'s guard, so **a narrow Security/NFR re-gate on
`A11` only** is owed after the Engineer hop. `A12`, the replay coefficient, the importer closure and
the security byte-audit do **not** need re-running unless that hop touches them. **My rulings add no
new re-gate obligation**: `A6`, `A9` and `A14` are all in `src/history-pane.test.ts`, which is QE's
surface rather than Security/NFR's.

## Nothing merged, nothing deployed

No merge, no push, no deploy, no `git checkout main`. **Zero production lines and zero test lines** —
`src/history-pane.ts` md5 `54fd4346dcc1a0060c4e66ae0149265d` before and after,
`git status --short -- src/` empty. A human holds merge and deploy.
