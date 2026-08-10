---
id: 20260810T222817Z-orchestrator-decision-350dbe3f
kind: decision
by: orchestrator
at: 2026-08-10T22:28:17Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-019
  - ADR-0009
supersedes:
---

# `Ready for Dev` gate — two panels PASS, `ABC-019` HELD, and an Orchestrator commit defect

## Gate result

**`ABC-016` and `ABC-017`: `Ready` → `Ready for Dev`.** Definition of Ready re-run by the Orchestrator
against `agent-factory/checklists/definition-of-ready.md`, not rubber-stamped from BA/PM's report:

- Front matter verified on both — `status: ready` / `column: Ready`, sizes `M` and `S`, priorities `P1`
  and `P2`. Board column and ticket agree.
- Both DoR tables re-annotated by the repair hop (`D17`/`D18` on `ABC-016`, `D19`/`D20` on `ABC-017`),
  every item `✅` after repair. `ABC-017`'s item 3 (INVEST) had been **`❌`** — *independent* was false
  while `A1` evaluated `STATUS_ROWS`, coupling the project-wide **blocking** typecheck gate to
  `ABC-016`. The strike is what makes it true.
- `ABC-017`'s `A13` exists and reads all three terms **from delivered geometry**, matching `ADR-0009`
  clause 9 rather than restating a count.
- Sizes `M` (3) and `S` (2). Neither is `XL`. No `SPLIT_REQUIRED`.
- Verified BA/PM re-measured rather than transcribed: its note records *"D17 was re-measured here, not
  taken on trust. The Architect's six-mutant table was re-run."*

**`ABC-019`: HELD in `Ready`, NOT gated.** `ADR-0009` clause 9 landed after `ABC-019`'s promotion and
imposes two criteria the ticket does not carry: **9d** (stub row counts must NOT be 3/8, with two
shapes) and **9e** (the session-height invariant). Architect/Design's measurement is the reason this is
a hold and not a nicety: **a 3/8 stub is green at `ABC-019`'s own gate and breaks only at the rebase** —
it arms a landmine — while 2/5 or 4/9 go red *there*, and 4/9 also exercises the append branch a 3/8
stub never touches. Its ruling also records that stubs already written at 3/8 are *a defect, not a
preference*. Routing one further BA/PM hop rather than pulling the ticket with a known gap.

WIP after the move: `Ready` 3/8 → 1/8, `Ready for Dev` 0/6 → 2/6. No limit approached, no override.

## The stub-seam ruling, recorded because it changes what the engineer must do

**There is no third constant site, because a consumer of panel rows must not name a count at all** — the
one definition is the delivered rows, read as `.length`. The Orchestrator's framing of the question
("where do the constants live so all three sites reference one definition") presupposed three sites; the
answer is that the third site should not exist. Measured: `DECLARED` fails five of six mutants and on
M3/M5 is a **live `4b` breach** (told 23, `beginFrameSession` picks in-place, emits 25 rows into a
24-row viewport); `IMPORTED` is **mechanically impossible** against unbuilt panels (`TS2307` ×2, exit 2,
project-wide blocking typecheck); `DERIVED` is the only form both buildable against stubs and correct at
the swap. Forced, not preferred. Clause 5's fit-check does **not** cover it — its verdicts are identical
whatever the loop does, which is exactly why "plausibly covers it" was refused as an answer.

## `NFR-002` — the flag was right that the row is incoherent and wrong about why

`< 16 ms` does **not** move. The `≤ 100 µs` bar **is not in the catalog at all** (`grep` = 0), so the
disagreement was row-vs-*ticket*, not row-vs-itself. *"The correct build sits at or over the bar"* is
false as measured — it double-counted `gameStatus` (`gameStatusOf` **is**
`gameStatus(position, repetitionCounts(history))`) and quoted a superseded prototype band; three
harnesses read 94.43 / 95.29 / 95.64 µs, all below the band's 97 floor. **BA/PM's ruling stands on its
stronger reason:** a two-derives-per-ply build reads 93.58 µs = 0.94x and **meets** the clock, which is
why the bar could not catch what it was written for. The row's real defect was carrying a prototype band
as an unlabelled headline, transcribed into a ticket bar twice; now labelled evidence, not a bar.

## ORCHESTRATOR DEFECT — commit `2cd84cd` swept up another agent's in-flight work

Recorded against the Orchestrator, found by the agent it damaged.

Intent: commit `plans/board.md`, one note, and a queue normalization. Actual: **11 files, ~640 lines**,
including Architect/Design's three notes, its live `claim.md`, its `done` entry, its 219-line `ADR-0009`
amendment and its 104-line `plans/nfr-catalog.md` edit — **committed mid-hop, in a partial state.**

**Root cause:** `git commit` commits the entire **index**, not the paths passed to the preceding
`git add`. The Architect had correctly staged only its own files, as instructed; the Orchestrator's
`commit` captured them. `git add -u .grugops/queue/` compounded it by staging that agent's live claim.

**Consequence:** no data loss and the final tree is coherent (`a28fa7c` completed the ADR, `1536026`
normalized the queue entry, working tree clean, `ADR-0009` `accepted` with clause 9 intact) — but the
Architect's work is spread across **three commits, two of them other roles'**, and a reader bisecting
this branch will find a partial `ADR-0009` attributed to a board-correction commit. The audit trail is
degraded, which is the cost this project pays commit hygiene to avoid.

**The correct form on a shared branch** is `git commit -- <pathspec>`, which commits only those paths
regardless of index state, or verifying `git diff --cached --name-only` before committing. The
Orchestrator instructed both agents to "stage ONLY your own paths, never `git add -A`" and then broke
the equivalent rule itself at the commit step — an instruction it did not apply to itself.

**Applied from here:** no Orchestrator commit while any agent holds a claim, and pathspec-scoped commits.

## Hard limits held

Nothing merged, nothing deployed, no protected branch touched. `src/` byte-identical to `main` across the
entire round — zero production lines. Merge and deploy remain the owner's.
