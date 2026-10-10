---
id: ABC-051
title: `ABC-021` landed and left the turn loop's own records false in four places — and its per-ply bar cannot see the derive the loop now makes
status: in-development
column: In Development
size: S
priority: P2
epic: EPIC-002
feature: —
---

# ABC-051 — four false sentences in the turn loop's own two files, and the one missing spy that makes the fifth of them true

> **Cut 2026-08-13 by BA/PM** (task `home-the-gaps-2026-08-13`, subtask `refinement-home-the-gaps`,
> Workflow 07) from `quality-gate-ABC-021` gaps **`G-1`** and **`G-3`**.
>
> **`ABC-021` and `EPIC-002` are `Done` and merged. This is NOT a re-open** — it is this board's own
> standing rule, written on the `ABC-028` row: *a gap found after a merge becomes a NEW ticket, never
> a silent re-open.* `ABC-021`'s page is a closed record and is not opened by this ticket.
>
> **TWO of the five sites below were reported by NOBODY.** The gate hop named `src/turn-loop.ts:105`,
> `:247` and `src/turn-loop.nfr.test.ts:23`. Re-reading the file at this hop found the same false
> sentence a **second** time at `:131` and a test **name** at `:136` that is false for the same
> reason. That is the sibling-instance pattern this board keeps producing — and it is why this ticket
> is written over the two files, not over the three reported lines.

## Problem

*User*: the next engineer or ticket-writer who reads `src/turn-loop.ts`'s type doc comment, its
transition count, or the per-ply NFR bar, and believes them.

*Pain*: `ABC-021` added a seventh `PromptOutcome` arm and two transition edges. Five statements in
the loop's own two files describe the machine as it was **before** that landed.

**And the last of them is not prose — it is a hole.** The per-ply bar in
`src/turn-loop.nfr.test.ts` proves *"the loop derives nothing on its own"* by asserting
`repetitionCounts` at **0**. After `ABC-021` the loop **does** derive on its own, on the
refused-claim path: `claimShortfall` (`src/turn-loop.ts:234`) calls `keyHistory`, an `O(plies)`
replay priced at **46–50 µs at 120 plies**. **`keyHistory` is spied by nothing in that file** — its
`vi.mock("./history.ts")` factory (`:40-43`) wraps `repetitionCounts` alone.

**Measured by the gate hop, on a tree pinned by md5:** adding **one line** — `keyHistory(history);`
on the advancing tail, a second replay on **every** ply — passes the delivered suite **814/814**,
with `repetitionCounts` still reading **0** and `gameStatus` still reading **`plies + 1`**. **Both
bars sit at their exact correct-build values while the build pays the cost `NFR-002` forbids.** A
count that nothing counts is not a bar.

*Value*: the loop's canonical records stop being transcribed wrong into the next three ticket pages,
and the bar that guards `NFR-002` starts guarding the derive the loop actually makes.

## Scope

**Two files. Comment text, one test-name string, one spy and its assertions. ZERO production
lines.** All five sites verified at source on `main` at this hop.

| # | site | what it says | why it is false |
|---|---|---|---|
| 1 | `src/turn-loop.ts:105` | *"What a prompt returns. **FOUR** of these do not advance a ply"* | **FIVE.** The same file says so twice: `:255` *"FIVE outcomes are non-advancing"* and `:259` *"THE FIFTH IS `ABC-021`'s REFUSED CLAIM and the count was THREE-of-FOUR until it landed"* |
| 2 | `src/turn-loop.ts:247` | *"Eight states and **sixteen** transitions; the sixteenth …"* | **SEVENTEEN.** `ABC-019`'s ratified table (`plans/tickets/ABC-019-turn-loop-skeleton.md:363-379`) enumerates **by trigger**, not by state pair — 7, 8 and 9 are three rows for the one pair `awaiting-human` → `rendering`. It has **15** rows; `ABC-021` adds **two** edges, and the same paragraph states the premise itself at `:261`: *"One outcome, **two edges**"* |
| 3 | `src/turn-loop.nfr.test.ts:23` | *"`repetitionCounts` at 0 proves the loop derives nothing on its own"* | the loop derives via `keyHistory` on the refused claim, and this file counts neither |
| 4 | `src/turn-loop.nfr.test.ts:131` | *"The loop derives nothing on its own: every evaluation went through `gameStatusOf`."* | **the same false sentence, second site, reported by nobody** |
| 5 | `src/turn-loop.nfr.test.ts:136` | test name *"derives ZERO times on a non-advancing prompt outcome"* | **false as a general statement, reported by nobody.** It drives `rejected` only; the refused claim is also non-advancing and derives `keyHistory` **once** |
| 6 | `src/turn-loop.nfr.test.ts:40-43` | `vi.mock("./history.ts")` returns `{ ...actual, repetitionCounts: vi.fn(...) }` | **`keyHistory` is spied by nothing** — the hole itself |

## Out of scope

- **Any production line, in any file.** Zero. `src/turn-loop.ts` is opened for **comment text only**;
  `A4` asserts it mechanically.
- **`src/turn-loop.test.ts`.** The gate hop's `A8` rows already catch both surviving mutants there
  and are **merged**. This ticket does not touch, duplicate or "simplify" them. *(`A8` clause (iv) is
  the only assertion in the tree pinning the ticket's central boundary. Leave it alone.)*
- **`plans/tickets/ABC-021-*.md`, `ABC-019`'s page, `plans/board.md`, `plans/traceability.md`, any
  ADR, `plans/nfr-catalog.md`.** `ABC-021` is `Done`; a closed record is not edited.
- **Re-counting the transitions from scratch, or re-ratifying `ABC-019`'s table.** The convention is
  **by trigger** and it is already ratified. This ticket applies it; it does not re-litigate it.
- **The other six `*.nfr.test.ts` files.** `src/turn-loop.nfr.test.ts` is **not** one of `ABC-030`'s
  four (`zobrist`, `status-panel`, `gameend`, `san`) and **not** `ABC-050`'s (`glyph-mode`). Verified;
  the three file sets are disjoint.
- **Re-measuring `NFR-002`'s timing half.** That is Security/NFR's at the gate. This ticket restores a
  **call-count** bar, which is the clause that binds.

## Acceptance (Given/When/Then)

**A1 — the bar counts the derive it claims to prove, and a named wrong build proves it counts.
Given** `src/turn-loop.nfr.test.ts`'s `vi.mock("./history.ts")` factory, **when**
`keyHistory: vi.fn(actual.keyHistory)` is added to it and asserted at **0** beside each existing
`repetitionCounts`-at-0 assertion (`:132`, `:142`), **then** on the unmodified tree the file is
**green**, **and** this build — applied to a tree pinned by md5 and restored afterwards — is **RED in
this file**:

```ts
// in the loop's advancing tail, src/turn-loop.ts
    keyHistory(history);           // a second O(plies) replay, EVERY ply
    status = gameStatusOf(history);
```

**Report the failing assertion and its message.** *(This is the gate hop's `M2`, which passed
**814/814** against the delivered suite. If the repaired file does not go red on it, the repair did
not land.)*

**A2 — the refused-claim derive is asserted POSITIVELY, not only at zero. Given** a run in which the
human submits a claim the rules core refuses, **then** `keyHistory` reads **exactly 1** for that
prompt and **2** for two refusals — the price is per refusal and is never cached — **and**
`repetitionCounts` reads **0** throughout. *(A bar that only ever asserts 0 cannot tell "the loop
derives nothing" from "the spy is wired to nothing". This clause is what makes `A1`'s zero mean
something.)*

**A3 — every statement in the two files about these counts is true, and none of them is a bare
number that the next ticket can re-stale. Given** the repaired files, **then**

```
/usr/bin/grep -nE 'FOUR of these do not advance|derives nothing on its own' \
    src/turn-loop.ts src/turn-loop.nfr.test.ts
  -> exit 1, ZERO hits
```

**and** the transition sentence at `src/turn-loop.ts:247` states the count **together with the rule
that produces it** — *by trigger, per `ABC-019`'s table* — so a reader can re-derive it instead of
trusting it; **and** the test name at `:136` names the outcome it actually drives.

> **Do NOT simply refresh `sixteen` to `seventeen`.** A live count with no rule beside it is the
> identical defect one ticket from now, and refreshing one is **explicitly refused** on this board —
> `ABC-030`'s `## Out of scope`, adopted here unchanged.

**A4 — zero behaviour, measured not asserted. Given** the whole ticket, **then**
`git diff --numstat` shows **exactly two files**, both named above; **`src/turn-loop.ts` has ZERO
non-comment lines changed**; the **test-file count and the suite total are unchanged** (`A1`/`A2` add
assertions inside existing `it` bodies and **no new `it` and no new file**); skip count **0**; lint,
typecheck and build each exit **0**. **Measure the tip on both sides; do not paste a number from this
page.**

## Dependencies

- **None blocking.** `ABC-021` is merged; `ABC-019` is `Done`; the by-trigger table is ratified.
- **Ordering against `ABC-050` and `ABC-030`: none.** File sets are disjoint, verified at this hop.
- **Merged and read:** `keyHistory` / `gameStatusOf` (`src/history.ts:116-153`), `claimShortfall`
  (`src/turn-loop.ts:234`), `PromptOutcome` (`src/turn-loop.ts:125`), the `A8` ledger rows in
  `src/turn-loop.test.ts` (read to avoid duplicating them, never edited).

## Security / NFR triggers

- **`NFR-002` — `ABC-019`'s per-ply bar, ≤ 100 µs excluding render, input wait and engine call.**
  **This ticket does not change the bar and does not move a target; it restores the bar's ability to
  fail.** The measurable statement is `A1`: a build paying a second `O(plies)` replay per advancing
  ply — **46–50 µs at 120 plies, measured, Apple M3 / Node v24.12.0 / darwin-arm64** — must be RED in
  the file that owns the bar. It is currently **green at 814/814**.
- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**, CPU instrument, median of paired per-round
  deltas, n ≥ 7 interleaved, identity null control ≤ 1.5%. **ZERO new test files** (assertions land
  in existing rows), so the 160 ms-per-file term is **+0** by construction, exactly as the gate hop's
  own two rows were.
- **Security: no trigger, not pre-waived.** Comment text, one spy, assertions. No production line, no
  new dependency, no stream write, no input path. **Firing threshold:** any line changed under
  `src/turn-loop.ts` that is not inside a comment.

## Test notes

1. **The mutant is the deliverable, not a nicety.** `A1` is only met by running `M2` and watching it
   go red. The gate hop's runner pinned both files by md5, **threw** rather than measuring the wrong
   tree, and restored from a pristine copy in a `finally`. Reproduce that discipline or do not quote
   the result.
2. **`M16` is already caught and is NOT this ticket's.** The seam-adjudicates-via-`keyHistory` build
   dies at `A8` clause (iv) in `src/turn-loop.test.ts`, merged. Do not re-catch it here.
3. **`A2` before `A1`.** Wire the spy, prove it reads **1** on a refused claim, and only then trust
   the **0** elsewhere. The reverse order is how a spy wired to nothing passes.
4. **The honest limit on the spies stays stated.** `gameStatusOf` calls `repetitionCounts` *inside*
   `history.ts`, where a module-boundary spy cannot see it — that sentence is TRUE and must survive
   the rewrite. What must go is the conclusion drawn from it.
5. **`:247`'s repair is arithmetic, not judgement.** `ABC-019`'s table has 15 rows by trigger;
   `ABC-021` adds the allowed claim (`awaiting-human` → `game-over`) and the refused claim
   (`awaiting-human` → `rendering`, its own trigger, its own code path, its own `continue`).

## Size and priority rationale

**Size `S` (2).** Five text sites in two files, one spy, two assertion clauses, and one mutant built
and run against a pinned tree. It is not `XS`: `A1` requires an instrument, and `A2` requires new
assertions rather than edited prose. Calibrated against `ABC-030` (four comment sites, no instrument,
`XS`) and `ABC-021` itself (one outcome arm, one transition, `S`).

**Priority `P2`, from a dated trigger.** `EPIC-003`'s `ABC-035` and `ABC-037` and all of `EPIC-006`
read `src/turn-loop.ts` next, and `:247`'s transition count is already cited across ticket pages —
**a wrong number in the canonical location gets transcribed, and this board has five recorded
occurrences of exactly that.** It is not `P1`: no user is affected, no test fails, and the hole is
covered *in the tree today* by the gate hop's merged `A8` rows. It is not `P3`: *"whoever next opens
the file"* was **measured 0-for-2** on this board (`ABC-030`'s evidence, including one miss by the
very commit that caused the staleness), so leaving it unowned is a disposition with a track record.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-13**. **Result: 10 of 10 — MET**, and `Backlog` regardless (see the placement note).

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** six sites with file and line, all re-verified at source at this hop; the measured consequence (`M2` green at 814/814) quoted with its build |
| 2 | scope and out-of-scope clear | **✅** two files, zero production lines; seven fences, including the merged `A8` rows and the three disjoint `*.nfr.test.ts` file sets |
| 3 | INVEST-shaped | **✅** independent (no open ticket owns any site; disjoint from `ABC-030` and `ABC-050`), negotiable, valuable, estimable, small, testable |
| 4 | acceptance testable and measurable | **✅** four criteria: a named wrong build that must go **red** with its code quoted, positive counts of **1** and **2**, a `grep` that must exit 1, and a two-file diff with **zero non-comment lines** in production |
| 5 | dependencies known | **✅** none blocking; ordering against both sibling tickets stated and nil; merged reads named |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-002` ≤ 100 µs per ply with the wrong build priced at **46–50 µs at 120 plies** and named as `A1`; `N8-LANE` ≤ **650 ms CPU** with the per-file term shown **+0**; security firing threshold falsifiable |
| 7 | test notes present | **✅** five, including the order `A2` before `A1` and the md5-pinning discipline |
| 8 | size assigned | **✅** `S` (2), calibrated against two named tickets |
| 9 | priority assigned | **✅** `P2` with a dated trigger and both the not-`P1` and not-`P3` arguments, the latter carrying a measurement |
| 10 | no major unresolved blocker | **✅** none |

### Requested board placement 2026-08-13 by BA/PM at `refinement-home-the-gaps`: `Backlog`

**Requested, not taken** — `plans/board.md` is the Orchestrator's. `Backlog`, not `Ready`.

## Delivery

**2026-10-10: build hop STOPPED at re-verification. No code was written.** Software Engineer,
subtask `ticket-to-pr-ABC-051`, branch `grugops/ABC-051-turn-loop-records` from `b9e94d8`. Sites
3–6 are still false. Site 1 is already true. **Site 2's premise moved:** `ADR-0021` (accepted)
enumerates the machine at **18** with `quit`/`take-back` numbered 17/18, but this page's rule (the
refused claim is its own trigger) gives **19**. Choosing between them is a judgement, and the page
says the repair is arithmetic. `M2` is still green in `src/turn-loop.nfr.test.ts` (4/4) and is
still caught by merged `A8` in `src/turn-loop.test.ts`. For BA/PM's re-score:
`.grugops/context/ticket-to-pr-ABC-051/notes/` (observation `ac73a414`, decision `42b950e1`).
