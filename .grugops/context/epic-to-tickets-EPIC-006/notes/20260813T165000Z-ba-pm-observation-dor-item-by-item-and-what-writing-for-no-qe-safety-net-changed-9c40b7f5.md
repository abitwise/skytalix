---
id: 20260813T165000Z-ba-pm-observation-dor-item-by-item-and-what-writing-for-no-qe-safety-net-changed-9c40b7f5
kind: observation
by: ba-pm
at: 2026-08-13T16:50:00Z
verified_by:
confidence: high
refs:
  - EPIC-006
  - ABC-041
  - ABC-042
  - ABC-043
  - ABC-044
  - ABC-045
  - ABC-046
  - AGENTS.md
  - agent-factory/checklists/definition-of-ready.md
supersedes:
---

# Definition of Ready, item by item across six tickets — one is MET and five say why they are not

> **Hand-authored, no stamp.** The full ten-row table is on each ticket. This note carries the
> cross-cutting reading and the answer to *"did writing as if QE will not save you change what you
> wrote?"* — **it did, in four specific ways, and they are named at the bottom.**

## The scores

| ticket | score | which items ⚠️ | the blocker in one line |
|---|---|---|---|
| `ABC-041` | **10/10 MET** | — | nothing it needs is open; the one decision it required (board orientation) is ruled on its page |
| `ABC-042` | 8/10 | 3 INVEST, 10 blocker | one ordering dependency: `ABC-041` |
| `ABC-043` | 7/10 | 3 INVEST, 10 blocker ×2 | `ABC-037` open **and** no `EngineSeam` exists **and** a conformance ruling is owed |
| `ABC-044` | 8/10 | 3 INVEST, 10 blocker | `ABC-043` must land first and is itself blocked |
| `ABC-045` | 8/10 | 3 INVEST, 10 blocker | three ordering dependencies, no contract question |
| `ABC-046` | 7/10 | 3 INVEST, 10 blocker ×2 | **a RULING, not an ordering** — `quit` has no representable outcome |

**Items 1, 2, 4, 5, 6, 7, 8, 9 are clean on all six.** Every ⚠️ on this board falls on **item 3
(INVEST independence)** or **item 10 (no major unresolved blocker)**, and each names what is open,
who owns it and what closes it.

**`ABC-041` is the only DoR-met ticket, and that is the useful fact in this table**: it means there is
something to pull today. **The Orchestrator can pull `ABC-041` now, and `ABC-042` the moment it
merges.**

**Nothing was smoothed to raise a score.** The board's standard is explicit — `ABC-024`, `ABC-026`,
`ABC-028`, `ABC-030` and `ABC-039` all sit or sat with DoR not met rather than rounded up — and two of
my six could have been scored 8/10 by calling their blockers "dependencies known" (item 5, which they
genuinely satisfy) and stopping there. They are 7/10 because item 10 asks a different question.

## Item 6 in particular, because it is the one most often waived

**Security is NOT pre-waived anywhere in this epic, and it fires on exactly one ticket.** `ABC-042` is
the first production module in this repository that reads `process.argv`, so it carries three
measurable bars (argv is data never code, with zero `eval`/`Function`/`child_process`/dynamic-import
occurrences; every echoed byte sanitized or zero `\x1b`, asserted by feeding `\x1b[2J`; no
`fs`/`net`/`http`) and a falsifiable firing threshold. The other five state **not triggered** with the
structural reason and a firing threshold, rather than leaving the row blank.

**Every NFR carries a number or a count, never an adjective:** `N8-LANE` ≤ 650 ms CPU on all six
(and **shared between `ABC-042` and `ABC-043`**, because they share a file); `NFR-002` as a spied
**0** derives per frame; `NFR-007` **ruled not-firing** with a `≤ 1 s` recorded reading in its place
and `plans/nfr-catalog.md` untouched; `NFR-004` named as **not** inherited so it is not picked up by
proximity.

## Did writing "as if QE will not save you" change what I wrote? Yes — four ways

The delivery audit measured the rework as almost entirely *criterion* gaps on code with zero defects,
and the owner has now moved criteria review to the `Ready for Dev` exit (`AGENTS.md` § Process rules,
rule 1, landed on `main` at `e1a44d2` **while this hop was running**). That changed the drafting:

1. **Every criterion names the wrong build that passes the others.** `ABC-042` `A3` (a subdirectory
   entry point passes everything and drops the licence guard's reach), `ABC-043` `A3` (a build that
   exits 0 passes everything else), `ABC-044` `A2` (a build printing "draw by repetition" for both the
   claimed and the automatic case passes `A1`), `ABC-045` `A1` (a build hardcoding one colour reports
   the loser as the winner half the time), `ABC-046` `A1` (a latching confirmation ends the game ten
   moves later). **This is the habit `ABC-017`'s gate hop paid for the hard way — five defects
   witnessed by wrong builds that passed every criterion as written.**
2. **I checked every criterion against merged source rather than against the ticket's own prose**,
   which is how four things turned up that a QE gate would otherwise have found on delivered code: the
   `process.stdout` rule being already false, `quit` having no arm, `new`'s stale status frame, and
   the probe's undeclared root. All four are in the observation note in this folder. **Three of them
   would have surfaced as "the ticket asked for something the contract cannot express" mid-build.**
3. **I refused three criteria I had drafted, because they were not measurable.** *"The board is
   readable"* → byte-equality against `renderBoard` (`ABC-041` `A4`). *"`random` picks a colour"* →
   **1000 spawn-free evaluations, both outcomes** (`ABC-042` `A4`), which is also what forced the
   resolver to be separately testable. *"The result screen is clear"* → a **set of size 8** plus a
   non-substring property (`ABC-044` `A1`/`A2`).
4. **Two criteria are written so that a shape the ruling might adopt FAILS them** (`ABC-046` `A3`,
   `A5`). That is deliberate: if shape (a) is chosen, amending those criteria is a recorded, deliberate
   acceptance of a known defect, not a quiet drop.

**What it did not change:** I did not add criteria for their own sake. Ticket length is down, not up —
see below.

## Rule 2 landed mid-hop, and these six are the first tickets cut under it

`AGENTS.md` § Process rules, rule 2: **ticket prose has a size budget — median length of the next ten
cut tickets ≤ 300 lines (720 today)**, with overflow to context notes.

```
ABC-045  156      ABC-041  223          median of the six  219.5 lines
ABC-046  209      ABC-043  244          max                300 (ABC-042, exactly AT the cap)
ABC-044  216      ABC-042  300          total             1348 for six tickets
```

**Median 219.5 against a 300-line bar; every one of the six is at or under it.** Reported honestly:
`ABC-042` sits **exactly at** the cap, not under it, and it is the ticket most likely to need
trimming if a seventh criterion arrives. **The overflow went where rule 2 says it goes — the
measurements, the rejected alternatives and the arithmetic are in this folder, not in the tickets.**
I was already holding length down before I read the rule; it did not change the drafting, it
confirmed it.
