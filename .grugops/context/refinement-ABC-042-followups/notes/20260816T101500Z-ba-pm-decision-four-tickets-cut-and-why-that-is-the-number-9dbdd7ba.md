---
id: 20260816T101500Z-ba-pm-decision-four-tickets-cut-and-why-that-is-the-number-9dbdd7ba
kind: decision
by: ba-pm
at: 2026-08-16T10:15:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - ABC-057
  - ABC-058
  - ABC-059
  - ABC-060
  - Q3
  - Q5
  - Q12
  - R5
  - D1
  - Q14
  - S1
  - S4
  - S5
  - S6
  - B4
  - plans/traceability.md
supersedes: 
---

# FOUR tickets cut — `ABC-057`…`ABC-060`, sizes `XS` / `S` / `XS` / `XS`

> **Hand-authored `decision`.** No `kind: finding` is admissible on this install and no
> `§14-gate#<id>` stamp is emittable; nothing here claims one.

## The four

| id | subject | size | priority | DoR |
|---|---|---|---|---|
| **`ABC-057`** | the merged licence guard: unwitnessed comparator (`Q3`/`R5`) **and** the docblock restating `ADR-0011` clause 3's struck sentence (`D1`/`Q14`) — two sites, one file | **`XS`** | **`P2`** | **9/10, NOT MET** (⚠️×1: `ABC-042` must merge first) |
| **`ABC-058`** | three security-bar instruments that cannot observe their own clauses — `S1`/`Q5`, `S4`, `S5` — three sites in `src/cli.test.ts` | **`S`** | **`P2`** | **9/10, NOT MET** (⚠️×1: same ordering) |
| **`ABC-059`** | `AGENTS.md`'s runnability guard pins a spelling, not the fact (`S6`) | **`XS`** | **`P3`** | **9/10, NOT MET** (⚠️×1: same ordering) |
| **`ABC-060`** | four `EPIC-006` tickets copy `A12`'s diff-scoping clause without naming the diff (`Q12`) | **`XS`** | **`P2`** | **10/10, MET** |

**Three `XS` and one `S`.** The `S` is `ABC-058` and it is the verification, not the typing: ~10
lines across three sites, plus **six mutants** (`MS1`, `MS2`, `MS4`, `M3f`, `M3g`, `M3h`) rebuilt and
run against a green control. Nothing is designed in any of the four — every mechanism and every site
was named by the role that found it, and I priced what they wrote rather than re-discovering it.
**`ABC-057` is `XS` because Architect/Design priced it `XS` with the site named**, and a paragraph of
history is not a size.

## Why four and not one, and not twelve

The items cluster by **file and by review**, not by finding-id or by author:

- **`ABC-057` — one file, one block, one review.** Architect/Design routed the two sites together in
  `ADR-0011`'s third amendment: *"they should be cut together — same file, same block, one review."*
  A hop opening that file will read the docblock and the comparator in the same minute. Splitting
  them would double the read for four lines of work.
- **`ABC-058` — one file, one author, one verification style.** `S1`, `S4` and `S5` are all
  Security/NFR's findings about **its own bar text**, all in `src/cli.test.ts`, all zero production
  lines, all zero new spawns, and all verified the same way: rebuild a named mutant, run it against a
  green control. `Q5` is not a fifth item — it is `S1`'s criterion half and rides in the same ticket
  because it is the same instrument.
- **`ABC-059` — separated deliberately, and this is the judgement call.** It is also in
  `src/cli.test.ts`, so folding it into `ABC-058` was available and I refused it. `ABC-058`'s subject
  is ASVS bar instruments (Security/NFR's, with ASVS rows and levels attached); `ABC-059`'s is
  whether `AGENTS.md` may contradict itself (BA/PM's clause, no ASVS row). They have different
  owners, different failure witnesses and different reasons to be dropped. **Merging them would make
  one ticket with five sites and two subjects — the mistake this epic was raised over, in miniature.**
- **`ABC-060` — different artifact class entirely** (`plans/tickets/`, not `src/`), **and the only
  one of the four that is not blocked on `ABC-042`'s merge.** Binding it to the others would trap a
  ready `XS` behind a held ticket for no reason.

**Twelve was available and is noise.** `S1`, `S4`, `S5`, `Q5` alone would have been four tickets that
one dev opens one file to do.

## Where each new ticket's own criteria carry a repair that could not be made

`ABC-058` and `ABC-060` each carry wording that would normally have been repaired on `ABC-042`'s
page. **The page is gated and frozen, so the corrected wording lands in the new ticket's criteria and
at the instrument's own site instead** — the two places a reviewer actually reads when running the
check. `ABC-058` says this in a section of its own (`## How the wording is repaired without touching
a gated page`) rather than leaving it implicit, because the next reader will otherwise ask why bar 1b
still reads the way it does.

## What I did not do

- **No board write.** `plans/board.md` is the Orchestrator's; the four rows for `Backlog` are
  its move, not mine.
- **No code.** Zero files under `src/` touched, zero commands run against the suite.
- **No process rule.** The four-instance defect class is referenced in `ABC-059`'s out-of-scope and
  nowhere else; raising a rule from it is the owner's call via the Factory Coach, and the
  Orchestrator's note says so.
