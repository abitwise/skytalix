---
id: ABC-051
title: `ABC-021` left the turn loop's per-ply bar file false in three places and its transition count without a rule — and the bar cannot see the derive the loop now makes
status: in-review
column: In Review
size: S
priority: P2
epic: EPIC-002
feature: —
---

# ABC-051 — three false sentences and a bare count in the turn loop's two files, and the one missing spy that makes the bar able to fail

> **Re-cut 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `recut-abc051`) after the build
> hop stopped at re-verification (`7eee6fb`, no code). The three questions it raised are answered:
> **site 2 keeps `ADR-0021`'s count of 18 and gains its counting rule** (no ADR is amended);
> **site 1 is dropped** (already true since `ABC-120`); **`A2` is withdrawn** as a duplicate of
> merged `A8` (ii)/(iii), and its one job (proving the spy is wired) moves into `A1`. Every line
> number below is re-anchored to the wave tip `d211c64` (`src/turn-loop.ts` md5 `0b0687a1…`,
> `src/turn-loop.nfr.test.ts` md5 `d48a0eb3…`, both unchanged since the stop). Reasoning:
> `.grugops/context/recut-abc051/notes/`.
>
> *Cut 2026-08-13 by BA/PM* (task `home-the-gaps-2026-08-13`, Workflow 07) from `quality-gate-ABC-021`
> gaps `G-1` and `G-3`. **NOT a re-open**: a gap found after a merge becomes a new ticket, and
> `ABC-021`'s page is a closed record. The gate hop named three sites. The cutting hop found the same
> false sentence a second time and a test name that is false for the same reason (rows 4 and 5).

## Problem

*User*: the next engineer or ticket-writer who reads `src/turn-loop.ts`'s transition count or the
per-ply NFR bar in `src/turn-loop.nfr.test.ts`, and believes them.

*Pain*: `ABC-021` gave the loop a derive of its own: `claimShortfall` (`src/turn-loop.ts:255`)
calls `keyHistory` (`:256`) on a refused claim. That call is an `O(plies)` replay priced at
**46–50 µs at 120 plies**, and the module's own docblock says so (`:248-253`). The NFR file still
says the loop *"derives nothing on its own"* in two places. It cannot see the derive, because its
`vi.mock("./history.ts")` (`:40-43`) wraps `repetitionCounts` alone.

**Measured at `b9e94d8`, md5-identical to today's tree** (Engineer, note `…ac73a414`): the mutant
`M2` adds `keyHistory(history);` before the advancing tail's `status = gameStatusOf(history);`
(`:436`), which puts a second replay on **every** ply. It is **green in `src/turn-loop.nfr.test.ts`,
4/4**. Only merged `A8` (i) in `src/turn-loop.test.ts` catches it (`expected "keyHistory" to be
called +0 times, but got 8 times`). The file that owns `NFR-002`'s bar is blind to the one cost
`NFR-002` forbids.

**The transition count is true but carries no rule, and that cost a hop.** `:268` says *"eighteen
transitions"* and names who added 16, 17 and 18, not what is counted. Three careful readers have
produced three different counts from the same records. `ABC-021`'s gate said 17 against the
then-16. `ADR-0021` counted 18. This page's own by-trigger rule gave 19 and stopped the build
(`7eee6fb`).

*Value*: the bar that guards `NFR-002` goes red in its own file on the derive the loop actually
makes. The loop's count can be re-derived from the sentence that states it.

## Scope

**Two files. Comment text, one test-name string, one spy and its zero assertions. ZERO production
lines.** Re-verified at source on `d211c64`.

| # | site | what it says | why it must change |
|---|---|---|---|
| 2 | `src/turn-loop.ts:268-271` | *"Eight states and eighteen transitions; the sixteenth … is `ABC-021`'s, and the seventeenth and eighteenth … are `ADR-0021`'s"* | **The count is TRUE and has no rule.** 18 is `ADR-0021` clause 5's enumeration (accepted): `ABC-019` `## Scope`'s 15 rows, `ABC-021`'s 16, and `ADR-0021`'s 17 and 18. The refused claim is an edge that enumeration does **not** number (clause 5 lists it beside 7, 8, 9, unnumbered). The same docblock calls it *"one outcome, two edges"* (`:287-290`) and never says the second edge is uncounted, so a by-trigger reader gets 19 |
| 3 | `src/turn-loop.nfr.test.ts:21-24` | *"`repetitionCounts` at 0 proves the loop derives nothing on its own"* | the loop derives via `keyHistory` on the refused claim, and this file counts neither. The same sentence cites `history.ts:152` for the `gameStatus` call. Today `:152` is `gameStatusOf`'s declaration and the call is `:153` |
| 4 | `src/turn-loop.nfr.test.ts:131` | *"The loop derives nothing on its own: every evaluation went through `gameStatusOf`."* | the same false sentence, second site |
| 5 | `src/turn-loop.nfr.test.ts:136` | test name *"derives ZERO times on a non-advancing prompt outcome"* | **false as a general statement.** It drives `rejected` only (`play(40, 12)`, seam `:86-90`). The refused claim is non-advancing too, and it derives `keyHistory` **once** |
| 6 | `src/turn-loop.nfr.test.ts:40-43` | `vi.mock("./history.ts")` returns `{ ...actual, repetitionCounts: vi.fn(...) }` | **`keyHistory` is spied by nothing.** This is the hole itself |

*Site 1 (`src/turn-loop.ts:105`, "FOUR of these do not advance") is **dropped**. `ABC-120`
(`d8e7ccc`) rewrote it, and it now names all seven non-advancing outcomes, so it carries its own
rule. Row numbers 2–6 are kept so earlier notes still resolve.*

## Out of scope

- **Any production line, in any file.** Zero. `src/turn-loop.ts` is opened for **comment text
  only**; `A4` measures it.
- **The number 18, and any renumbering.** Counting the refused claim as a nineteenth row, or
  renumbering 17/18, amends accepted `ADR-0021` clause 5. That is Architect/Design's on the owner's
  word, and it is not this ticket's. This ticket writes the rule beside the ADR's count. It does not
  re-count or re-ratify `ABC-019`'s table.
- **`src/turn-loop.test.ts`.** Merged `A8` (`:1813-1848`) already asserts the refused-claim price
  (1, then 2, never cached) and catches `M2` and `M16`. This ticket does not touch, duplicate or
  "simplify" it. That is why `A2` is withdrawn.
- **The rest of `src/turn-loop.ts`'s docblocks.** `:105-108`, `:248-253` and `:287-290` are true. Only
  the count sentence at `:268-271` changes. The paragraph may gain the rule, and nothing else moves.
- **`plans/tickets/ABC-021-*.md`, `ABC-019`'s and `ABC-120`'s pages, `plans/board.md`, any ADR,
  `plans/nfr-catalog.md`.** These are closed records. `ADR-0021:159` quotes site 5's old test name
  as of 2026-09-19. A dated record is not edited.
- **The other `*.nfr.test.ts` files** (`ABC-030`'s four and `ABC-050`'s `glyph-mode`). Their file sets
  are disjoint from this ticket's.
- **Re-measuring `NFR-002`'s timing half.** That is Security/NFR's. This ticket restores a
  **call-count** bar, which is the clause that binds.

## Acceptance (Given/When/Then)

**A1 — the bar counts the derive it claims to prove, and a named wrong build proves the spy is
wired. Given** `src/turn-loop.nfr.test.ts`'s `vi.mock("./history.ts")` factory (`:40-43`), **when**
`keyHistory: vi.fn(actual.keyHistory)` is added to it and asserted at **0** beside each existing
`repetitionCounts`-at-0 assertion (`:132`, `:142`), **then** the file is **green** on the unmodified
tree. **And** this build is **RED in this file**. It is applied to a tree pinned by md5 and restored
afterwards:

```ts
// in the loop's advancing tail, src/turn-loop.ts (today :436)
    keyHistory(history);           // a second O(plies) replay, EVERY ply
    status = gameStatusOf(history);
```

**Report the failing assertion and its message. It must be a `keyHistory`
`toHaveBeenCalledTimes(0)` in `src/turn-loop.nfr.test.ts`.** `M2` leaves `gameStatus` at
`plies + 1` and `repetitionCounts` at 0 (measured), so the new spy is the only thing in this file
that can fail on it. A red on `keyHistory` is therefore the proof that the spy is wired to
something. A red on any other assertion is not that proof, and must not be quoted as it.

**A2 — WITHDRAWN 2026-10-10.** It asked this file to assert `keyHistory` **1** on one refusal and
**2** on two. Merged `src/turn-loop.test.ts` `A8` (ii)/(iii) (`:1826-1839`) asserts exactly those
counts, and `## Out of scope` forbids duplicating `A8`. The refused-claim price is also per
command, not per ply (`src/turn-loop.ts:248-250`). So it is outside the per-ply bar this file owns.
A2's purpose, telling "derives nothing" apart from "spy wired to nothing", is now `A1`'s required
failing assertion.

**A3 — every statement in the two files about these counts is true, and the count can be
re-derived from its own sentence. Given** the repaired files, **then**

```
/usr/bin/grep -nE 'derives nothing on its own' src/turn-loop.ts src/turn-loop.nfr.test.ts
  -> exit 1, ZERO hits          (today: exit 0, two hits — nfr :23 and :131)
```

**and** the transition sentence in the docblock above `runTurnLoop` (today `:268-271`) still says
**eighteen**, and it states three things beside the count: (i) the source of the count, which is
`ABC-019` `## Scope`'s numbered rows 1–15, `ABC-021`'s 16, and `ADR-0021` clause 5's 17 and 18;
(ii) that the count is of **numbered** transitions; and (iii) that the refused claim's edge to
`rendering` is **not** one of the eighteen. A reviewer reading only that docblock can then reach 18
and see why a one-row-per-trigger count gives 19. **And** the test name at nfr `:136` names the
outcome it drives (`rejected`), with its counts (`41`, `0`) unmoved. **And** the header's
honest-limit sentence (`:21-22`) survives, and its `history.ts` cite points at the line that calls
`gameStatus` (`:153` today).

> **Do NOT change the number, and do NOT just restate it.** 18 is `ADR-0021`'s. A count with no rule
> beside it is the defect this ticket exists to remove, and it is the one that stopped the last hop.
> Refreshing a bare number is explicitly refused on this board (`ABC-030`'s `## Out of scope`).

**A4 — zero behaviour, measured not asserted. Given** the whole ticket, **then** `git diff --numstat`
shows **exactly two files**, both named above. **`src/turn-loop.ts` has ZERO non-comment lines
changed**:

```
git diff -U0 <base> -- src/turn-loop.ts | grep -E '^[+-][^+-]' \
  | grep -vE '^[+-][[:space:]]*(\*|/\*\*|\*/|//)'   -> empty
```

The **test-file count and the suite total are unchanged** (`A1` adds assertions inside existing `it`
bodies, with **no new `it` and no new file**). Skip count is **0**. Lint, typecheck and build each
exit **0**. **Measure the tip on both sides. Do not paste a number from this page.**

## Dependencies

- **None blocking.** `ABC-019`, `ABC-021` and `ABC-120` are `Done`. `ADR-0021` is accepted and is the
  authority for 18.
- **`ADR-0021` clause 10 is satisfied, not breached, by site 5.** It lists the nfr test's *"derives
  ZERO times…"* among what the **arm ticket** (`ABC-120`) must not change, and says *"their sentence
  narrows to 'non-mutating', their numbers do not move"*. Renaming the test to name `rejected` is a
  narrowing, and `41`/`0` do not move. `ABC-120`'s own "byte-identical" fence on this file
  (`ABC-120` page `:89`) was that ticket's and closed with it. **Re-verification must not stop on
  either.**
- **Ordering: none.** `ABC-036` keeps `src/turn-loop.ts` byte-identical (its page `:139`). `ABC-127`
  touches puzzle files. No branch other than this ticket's own stopped one touches the three files
  (`git log --all`, 2026-10-10).
- **Merged and read:** `keyHistory` (`src/history.ts:116`), `repetitionCounts` (`:136`),
  `gameStatusOf` (`:152-154`, call `:153`); `claimShortfall` (`src/turn-loop.ts:255`), the claim
  branch (`:354-376`, refused path `:371-374`), the advancing-tail derive (`:436`); `A8` in
  `src/turn-loop.test.ts:1813-1848` (read, never edited).

## Security / NFR triggers

- **`NFR-002` — `ABC-019`'s per-ply bar, ≤ 100 µs excluding render, input wait and engine call.**
  **This ticket does not move the bar. It restores the bar's ability to fail in its own file.** The
  measurable statement is `A1`. A build paying a second `O(plies)` replay per advancing ply costs
  **46–50 µs at 120 plies** (gate hop's measurement, Apple M3 / Node v24.12.0 / darwin-arm64; the
  same range `src/turn-loop.ts:249` cites), and it must be RED in `src/turn-loop.nfr.test.ts`. It is
  green there today, 4/4.
- **`N8-LANE`, inherited by name:** ≤ **650 ms CPU**, CPU instrument, median of paired per-round
  deltas, n ≥ 7 interleaved, identity null control ≤ 1.5%. **ZERO new test files**, so the 160
  ms-per-file term is **+0** by construction.
- **Security: no trigger, not pre-waived.** Comment text, one spy, assertions. No production line, no
  dependency, no stream write, no input path. **Firing threshold:** any line changed under
  `src/turn-loop.ts` that is not inside a comment (`A4`'s pipeline).

## Test notes

1. **The mutant is the deliverable, not a nicety.** `A1` is met only by running `M2` and watching it
   go red. Pin both files by md5, **throw** rather than measure the wrong tree, and restore from a
   pristine copy in a `finally`. The Engineer's runner did exactly this at `b9e94d8` (mutant md5
   `276de6e0…`). Today's tree is md5-identical, so it can be reused after re-checking the pins.
2. **`M16` is already caught and is NOT this ticket's.** The seam-adjudicates-via-`keyHistory` build
   dies at `A8` clause (iv) in `src/turn-loop.test.ts`. Do not re-catch it here.
3. **`A1`'s red IS the wiring proof** (this replaces "`A2` before `A1`"). A spy wired to nothing
   cannot go red on `M2`. So a red that names `keyHistory` proves the zero on the correct build
   means something. If the red names anything else, the spy did not fail, and the result is void.
4. **The honest limit on the spies stays stated.** `gameStatusOf` calls `repetitionCounts` *inside*
   `history.ts`, where a module-boundary spy cannot see it (nfr `:21-22`). That sentence is TRUE
   and must survive the rewrite. What must go is the conclusion drawn from it.
5. **Site 2 is not arithmetic and not a recount.** 18 is `ADR-0021` clause 5's enumeration. This
   ticket writes its rule beside it. The by-trigger reading that yields 19 (the refused claim as its
   own row) is **not** this ticket's, because it amends an accepted ADR. If the sentence cannot
   state the rule truthfully without contradicting `ADR-0021`, **stop and route to Architect/Design**.
   Do not change the number.

## Size and priority rationale

**Size `S` (2), unchanged.** The re-cut removes one text site and `A2`'s assertion design. Two
things keep it out of `XS`: `A1` still requires an instrument (an md5-pinned mutant run with a named
failing assertion), and site 2 now requires a sourced rule rather than a refreshed word. Calibrated
against `ABC-030` (four comment sites, no instrument, `XS`) and `ABC-021` (one outcome arm, `S`).

**Priority `P2`, re-dated 2026-10-10.** The 2026-08-13 trigger (`ABC-035`, `ABC-037` and `EPIC-006`
read the file next) is two-thirds spent: `ABC-035` and `ABC-037` are `Done`. The replacement trigger
is measured. A bare count in the canonical location has now cost **one stopped build hop and one
re-cut hop in this wave**, and *"whoever next opens the file"* is now **0-for-3**: `ABC-120` opened
it (`d8e7ccc`, 2026-09-19) and refreshed 16 → 18 with no rule. That is the bare-number refresh `ABC-030`
refuses. It is not `P1`: no user is affected, no test fails, and `M2` is caught today by merged
`A8`. It is not `P3`, because the record shows that leaving it unowned does not fix it.

## Definition of Ready

### DoR re-scored 2026-10-10 by BA/PM — 10 of 10, page `Ready`

`recut-abc051`, wave tip `d211c64`. **The board move is the Orchestrator's.** The 2026-08-13 score
(10/10 at the cutting hop) is superseded. It was correct then, and `ADR-0021` and `ABC-120` moved
sites 1 and 2 under it.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** five sites re-anchored at md5-pinned source. `M2` measured green in the bar's own file (4/4) and caught only by `A8`. Site 2's cost measured as a stopped hop |
| 2 | scope and out-of-scope clear | **✅** two files, zero production lines. New fences: the number 18 and any renumbering, the true docblocks beside it, `ADR-0021:159`'s dated quote |
| 3 | INVEST-shaped | **✅** independent (no other branch touches the files; `ABC-036` byte-identical on `src/turn-loop.ts`), small, testable. `A2` is withdrawn so the ticket no longer duplicates `A8` |
| 4 | acceptance testable and measurable | **✅** a named mutant that must go red **on a named assertion**, a `grep` that must exit 1, a three-part docblock check, and a diff pipeline that must print nothing |
| 5 | dependencies known | **✅** none blocking. `ADR-0021` clause 10 and `ABC-120`'s fence pre-cleared by name so re-verification does not stop on them |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-002` ≤ 100 µs/ply with the wrong build priced at **46–50 µs at 120 plies** and named as `A1`. `N8-LANE` ≤ **650 ms CPU**, +0 files. Security threshold falsifiable by `A4`'s pipeline |
| 7 | test notes present | **✅** five. Note 3 now makes `A1`'s red the wiring proof, and note 5 names the stop-and-route condition |
| 8 | size assigned | **✅** `S` (2), unchanged, argued against the removed work |
| 9 | priority assigned | **✅** `P2`, trigger re-dated to a measured 2026-10-10 cost. Both the not-`P1` and not-`P3` arguments are re-stated |
| 10 | no major unresolved blocker | **✅** site 2 resolved within `ADR-0021` as accepted. No ruling owed |

## Delivery

**2026-10-10: build hop STOPPED at re-verification. No code was written.** Software Engineer,
subtask `ticket-to-pr-ABC-051`, branch `grugops/ABC-051-turn-loop-records` from `b9e94d8`. Sites
3–6 are still false. Site 1 is already true. **Site 2's premise moved:** `ADR-0021` (accepted)
enumerates the machine at **18** with `quit`/`take-back` numbered 17/18, but this page's rule (the
refused claim is its own trigger) gives **19**. Choosing between them is a judgement, and the page
says the repair is arithmetic. `M2` is still green in `src/turn-loop.nfr.test.ts` (4/4) and is
still caught by merged `A8` in `src/turn-loop.test.ts`. For BA/PM's re-score:
`.grugops/context/ticket-to-pr-ABC-051/notes/` (observation `ac73a414`, decision `42b950e1`).

**2026-10-10: re-cut by BA/PM** (`recut-abc051`). All three stop questions are answered in the
header and in `.grugops/context/recut-abc051/notes/`. The next build hop starts from the table in
`## Scope`.
