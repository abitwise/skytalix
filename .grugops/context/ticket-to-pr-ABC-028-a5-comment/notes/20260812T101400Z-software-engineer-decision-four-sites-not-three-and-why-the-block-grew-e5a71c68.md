---
id: 20260812T101400Z-software-engineer-decision-four-sites-not-three-and-why-the-block-grew-e5a71c68
kind: decision
by: software-engineer
at: 2026-08-12T10:14:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A2
  - ABC-028-A5
  - RISK-ABC017-01
  - RISK-ABC028-02
  - src/history-pane.nfr.test.ts
supersedes:
---

# How the comment was repaired: FOUR sites, witness-level statements, and a line map I moved and did not hide

> Hand-authored `decision`, deliberately **not** a `finding` — see the sibling `observation` for why
> nothing on this hop can carry a stamp.

## The three sites BA/PM named, and what each now says

| line (before) | was | is |
|---|---|---|
| `:118-120` | *"rebuilding these per test would **no longer lose a guard**"* | *"rebuilding these per test **STILL LOSES A GUARD** — not for `A1`'s or `A5`'s keys, which die in `src/history-pane.test.ts` either way, but for every key deeper than their rows reach"* |
| `:106-108` | *"a reader looking for the guard against **a memoising pane** finds it there"* | the property is owned **for four named keys and no other**; a reader looking for the guard against a cache with one of **those** keys finds it there — *"Against a memoising pane IN GENERAL there is no guard at all: every key on the axis is its own witness"* |
| `:112` | *"passes the whole suite **744/744**"* | the stale counterfactual is replaced by a **live witness measured on this tree**: a last-three-identity cache fails **2 of 752**, both the `toSan` counts; `src/history-pane.test.ts` alone passes **26/26** on it; rebuilt per test the suite goes **752/752 GREEN** |

**The four keys are enumerated so the count is checkable rather than rhetorical:** never-invalidates
(`A14`), `moves.length` (`A1`), `moves.length` + the last one identity (`A5` row 1), + the last two
(`A5` row 2).

## The FOURTH site, found here and reported rather than smuggled in

**`:110` said *"UNTIL `A1` LANDED THE SHARING HERE WAS LOAD-BEARING"*.** Nobody named it. Read alone it
is true — it is a past-tense statement about the past. Read next to a repaired `:118-120` it is a
contradiction inside one comment: the past tense carries *"and it no longer is"*, which is the same
false generalisation in grammar rather than in words. **It now reads "THE SHARING HERE IS STILL
LOAD-BEARING".** Fixing three and leaving the fourth is the failure mode this project has named three
times; I am not adding a fourth occurrence to make my diff smaller.

## Why the `744/744` cell was replaced rather than re-measured in its own configuration

The sentence described a **counterfactual** — *"with `A1` absent and these fixtures rebuilt per test"* —
so putting this tree's `752` into it would have been the exact defect the ticket's `## Test notes` 4
bars: a measured-sounding number attached to a configuration nobody ran. Re-running that
counterfactual honestly would have meant **deleting `A1` and `A5` from `src/history-pane.test.ts`** in
the replica — more surgery, for a number about a tree that does not exist.

**The live witness is strictly stronger and needs no deletions.** `WCACHE-LAST3` reproduces the whole
point of the paragraph — a cache the owned guards do not reach, caught only by the sharing, freed by
the rebuild — **in the present tense, on the delivered tree, at `2 of 752` / `26/26` / `752/752`, all
three run.** The mechanism sentence the paragraph existed for (a call count, not a row comparison; why
`A14` never catches such a build) is preserved and is now true of a build that exists today.

**The Orchestrator's brief offered `752/752 on 26 files` as the re-measured figure.** It is the right
number and I did not transcribe it: it is written where I measured it — configuration (b) on
`WCACHE-LAST3` — and not into the sentence it would have been wrong in.

## The repair is to the WITNESS, not the class — which is why the block grew

`A5` requires *"only what is true"* and the ticket's own rule is *"the repair is to the WITNESS, not
the class."* A witness-level statement is longer than a class-level one, because it has to enumerate.
The block went from **18 lines (`:103-120`) to 21 lines (`:103-123`)** and the `AT_*` fixtures moved
from **`:121` to `:124`**.

**I considered engineering the replacement to exactly 18 lines** so the ticket's live line-map
references stayed true, and rejected it: hitting the count would have cost either the *"the note that
used to stand in this place said the opposite"* warning — the one sentence that tells a reader this
exact spot has now lied twice — or one of the three measured cells. **Compressing prose to preserve a
number in a document I am not allowed to edit is the tail wagging the dog.** The move is reported in
the trace, in the sibling `artifact-ref` and in this note, at source, after the write.

## What I refused

- **Editing `plans/tickets/ABC-028-*.md` to correct its now-stale `:103-120` / `:121` references.** The
  ticket is BA/PM's, my fence is *"comment text only"*, and **both** previous line-map errors on this
  page were written by BA/PM hops. A third rewrite by an engineer would muddle who owns that number.
  **Flagged with the exact new values; not taken.**
- **Adding a row to `A5`'s table for `WCACHE-LAST3`.** It is one row of data and it would close the
  rung I measured — but it is a test-half change in a file this subtask must not open.
- **"Improving" the `~9.3 ms` / `6.0 ms` rebuild-cost sentence.** Inherited, true, unrelated to the
  three sites, and preserved verbatim. I did not re-measure it and I do not claim it. `AGENTS.md`
  rule 9.
