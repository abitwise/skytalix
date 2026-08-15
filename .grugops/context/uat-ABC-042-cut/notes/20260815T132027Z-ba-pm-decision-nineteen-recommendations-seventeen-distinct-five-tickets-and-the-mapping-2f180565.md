---
id: 20260815T132027Z-ba-pm-decision-nineteen-recommendations-seventeen-distinct-five-tickets-and-the-mapping-2f180565
kind: decision
by: ba-pm
at: 2026-08-15T13:20:27Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - ABC-061
  - ABC-062
  - ABC-063
  - ABC-064
  - ABC-065
  - .grugops/context/uat-ABC-042-bapm/notes/
  - .grugops/context/uat-ABC-042-qe/notes/
  - .grugops/context/uat-ABC-042-followups-2026-08-15/notes/20260815T125900Z-orchestrator-decision-the-validator-does-not-rewrite-what-it-validated-5dd97e41.md
  - agent-factory/workflows/03-epic-to-tickets.md
  - agent-factory/checklists/definition-of-ready.md
supersedes: 
---

# Nineteen recommendations, seventeen distinct subjects, five tickets — and the mapping, so it can be checked rather than trusted

**Deduplicate first, cut second.** Two roles ran in parallel, neither could see the other's list, and
nothing was relayed between them by design. This note records the merge BEFORE the tickets, so the
Orchestrator can check the mapping rather than take my word for it. This repository already carries
`ABC-040` — 40 trace rows for 38 tickets — and a duplicate ticket set would be that same defect,
committed deliberately.

## Step 1 — the merge: 19 in, 2 exact duplicate pairs, 17 distinct subjects

| # | BA/PM (own previous hop) | QE/E2E | verdict |
|---|---|---|---|
| 1 | rec 7 — `AGENTS.md` `Dev / run` never shows the `--` separator (gap `B4`, behaviour `M1`) | `R9` — record the `--` separator in `AGENTS.md`'s `Dev / run` line | **SAME WORK, DIFFERENT NAMES → folded into `ABC-065`** |
| 2 | rec 9 — record "repeated option, last one wins" as an open convention decision | `R8` — record the repeated-option convention as a deliberate BA/PM ruling, then pin or reject it | **SAME WORK, DIFFERENT NAMES → folded, and NOT ticketed (open question `OQ-1`)** |

**Two more pairs overlap in subject and were checked rather than assumed:**

- **Node 22 is exercised by nobody** appears in both appendices (BA/PM: "recorded against `EPIC-006`
  rather than ticketed"; QE: "named so it is not lost, not test work"). **Same subject, same
  disposition, already ruled — no ticket, no new work.** Counted outside the nineteen because both
  lists filed it as an appendix rather than a recommendation.
- **UAT-13's timing** — BA/PM rec 5 asks the PACK for a method a non-engineer can execute; QE asks
  for `A11`'s deliberate design to be re-affirmed. **Different artifacts, not a duplicate:** the pack
  half is the parallel amendment hop's, the suite half is a re-affirmation with no work in it.
- **Terminal portability** — BA/PM recorded non-`Terminal` emulators as untested against `EPIC-006`;
  QE's `R10` wants a pty attached at all. **Related, NOT the same:** one is which emulator, the other
  is whether any terminal is ever attached. Kept apart; `R10` is `OQ-2` below.

**19 − 2 exact duplicates = 17 distinct subjects.**

## Step 2 — six of the seventeen are not tickets because they are being PERFORMED right now

BA/PM recs 1–6 (gaps `B7`, `B8`, `B5`, `B6`, `B2`, `B3`) are the six pack amendments. The parent
decision routed them to `uat-ABC-042-amend`, UAT Planner, running in parallel as I write. **Cutting
tickets for work in flight would be the duplicate defect one level up.** Not my judgement — the
routing's, and I did not touch that folder.

**17 − 6 in flight = 11 ticketable candidates.**

## Step 3 — the judgement: five cut, three rejected, and why

**Five cut.** Ids continue after `ABC-060`; every one lands in `Backlog` (unlimited). `Ready` was not
filled — its WIP limit is 8 and nothing here needs to jump it.

| ticket | from | size | priority | DoR |
|---|---|---|---|---|
| `ABC-061` | QE `R1` + `R2` | `S` (2) | `P1` | **10/10 MET** |
| `ABC-062` | QE `R3` + `R4` | `S` (2) | `P1` | **10/10 MET** |
| `ABC-063` | QE `R5` | `XS` (1) | `P2` | **10/10 MET** |
| `ABC-064` | QE `R7` | `S` (2) | `P2` | **10/10 MET** |
| `ABC-065` | BA/PM rec 7 ≡ QE `R9`, folded with QE `R6` | `S` (2) | `P1` | **9/10 NOT MET (⚠️×1)** |

**11 points over five tickets. No `XL`, and nothing near one** — every ticket is one test file plus,
in one case, one markdown slot.

**Three rejected, and the count is stated because the brief asks for it:**

1. **`R8` ≡ BA/PM rec 9 — the repeated-option convention. NOT CUT: it needs a ruling I should not
   make inside a ticket.** Acceptance cannot be written without first choosing last-wins,
   first-wins, or reject-duplicates, and a ticket that carried one of the three would make the
   decision silently while looking like coverage work. My own previous hop already ruled it "an open
   convention decision, not its own ticket"; QE independently called it "nobody's decision". **`OQ-1`
   below.**
2. **`R10` — the pty-attached check. NOT CUT: both of its possible homes are outside my fences, and
   the cheap half is already covered.** It is the ONLY item of the ten that costs a child, and
   `src/cli.test.ts:780` pins `spawned` at **10** with "an eleventh child is a defect" — a merged
   criterion, on a lane the owner personally ratified (`N8-SPAWN`). The alternative home QE named is
   the UAT pack as a permanent manual step, and the pack is being amended by another hop I must not
   write into. **`OQ-2` below. Note what this does NOT leave uncovered: `ABC-061` kills the M1
   mutant at the resolver for zero spawns; `R10` buys only the true end-to-end terminal.**
3. **BA/PM rec 8 — a real `--help` that exits `0`. NOT CUT: it is a scope change to a CLOSED set,
   deferred to `EPIC-006`, same disposition as Node 22.** `ACCEPTED_ARGUMENTS` is pinned
   element-for-element against `ABC-042`'s scope table at `:353`, and `:372` bars any argv literal
   outside it — so adding `--help` re-opens a merged criterion's closed set to add a feature nobody
   asked for. The refusal already prints the usage line, so a user does get the help; what they do
   not get is exit `0`. **Distribution is when this matters, and `EPIC-006` decides distribution.**
   Recorded, not lost, and not written into the epic page — that page is not this hop's to edit.

## Step 4 — two scope adjustments I made to QE's wording, recorded so they are not mistaken for drift

1. **`R2` says "widen `:359`". `ABC-061` does NOT widen it — it adds named blocks beside it and
   leaves `:359` byte-identical.** `:359` is `ABC-042`'s `A6(i)` instrument; editing a merged
   criterion's row to add coverage is exactly what `ABC-059` refused to do at `:193`, and that
   precedent is followed here. Same assertions, different home.
2. **`R6` is folded into `ABC-065` rather than cut beside `R9`.** They are mechanically coupled: the
   guard is RED until the documentation is fixed, and the fixed documentation is guarded by nothing
   without it. Split, one of the two reds on merge. This is the one fold that crosses the two note
   sets AND two roles' hands (Scribe for the markdown, engineer for the block), and the ticket says
   so.

## The three open questions — for the Orchestrator, NOT decided here

- **`OQ-1` — what does a repeated option mean?** `--colour white --colour black` resolves to black
  and `--ascii --ascii` is accepted, because the resolver walks the argv in order — an accident, not
  a choice (`src/cli-options.ts:114-139`). No criterion states it either way and no test resolves a
  repeated token, so first-wins and reject-duplicates would both ship green today. **A ruling is
  owed before a second consumer depends on it — `ABC-043`'s session commands are that consumer.**
  Owner of the ruling: BA/PM at `ABC-043`'s refinement, or the project owner if it is a product
  convention he wants to hold. **I did not write it onto `ABC-043`'s page; that page is not this
  hop's to edit.**
- **`OQ-2` — where does the terminal check live, and may the eleventh child exist?** The pty check is
  the only route to the terminal half of the glyph default and UAT-12's "the screen is not cleared".
  In the suite it costs one child against a pin of ten that a merged criterion asserts; in the pack
  it costs nothing and is a permanent manual step for a human. **Needs Architect/Design (the pin) or
  the project owner (`N8-SPAWN`, which he ratified by hand), plus the UAT Planner if it goes in the
  pack.**
- **`OQ-3` — may the accepted set grow outside `ABC-042`, and who says so?** Raised by `--help` and
  answered again by every `EPIC-006` session verb. `:353` and `:372` make the vocabulary closed by
  construction; `ABC-063`'s `A3` deliberately reds when it grows. **The question is not whether the
  rows should move — it is that they must move in the same hop as the scope decision, and no ticket
  today says whose hop that is.**

## What this decision does NOT claim

- **No `finding` kind and no `verified_by` stamp.** `context.human_admission` is `off` on this
  install; `AGENTS.md` § Role / workflow files states it and instructs against re-deriving it.
- **Nothing here is a defect against `ABC-042`.** It is merged, `Done`, and both gates passed against
  it. Every item above is a hole in what WATCHES the build; the product was correct on every point
  either role examined. **`ABC-042` does not move and its page was not edited.**
- **No ticket performs any of the work.** No test was written or edited, no file under `src/` was
  touched, and `AGENTS.md` was not edited — the `--` repair is CUT, not made.
