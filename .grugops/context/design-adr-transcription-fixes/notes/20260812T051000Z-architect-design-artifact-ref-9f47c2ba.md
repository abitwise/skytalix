---
id: 20260812T051000Z-architect-design-artifact-ref-9f47c2ba
kind: artifact-ref
by: architect-design
at: 2026-08-12T05:10:00Z
verified_by:
confidence: high
refs:
  - ADR-0009
  - ADR-0010
  - ABC-019
  - ABC-027
  - ABC-016
  - ABC-017
supersedes:
---

# Artifacts touched, and what each ticket is OWED. **No ticket was edited.**

> **Hand-authored**; `scripts/context-io.ts` absent, `mcp__grugops__propose_note` unavailable. **No
> `finding`.**

## Files changed by this hop — exactly two, both under `memory-bank/50-decisions/`

| file | change | clause touched |
|---|---|---|
| `memory-bank/50-decisions/ADR-0009-frame-row-constant-ownership.md` | +39 lines: one transcription block under clause **9b**, one under evidence **(vii)** | **none** |
| `memory-bank/50-decisions/ADR-0010-frame-width-stability-ownership.md` | +68/−4: correction block on the *"three test changes"* bullet in `## Consequences`, two strike marks, one pointer clause on the `NFR-002` bullet | **none** |

`git diff --stat` = **2 files, 107 insertions, 4 deletions**. The 4 deletions are the two lines
carrying the strike marks and the `NFR-002` line, re-emitted. **Zero `src/` bytes; `plans/` untouched
entirely.**

Queue, per Workflow 17: `.grugops/queue/pending/design-adr-transcription-fixes.md` →
`.grugops/queue/claimed/design-adr-transcription-fixes/`, plus the registry record `claim.md`.

## What each ticket is owed — named here, NOT taken. The Orchestrator routes.

**`ABC-019` — owed ONE ticket-text repair, and it is the one this hop identified by attribution.**
`[D27]`'s sentence *"The seam is not new and its arguments do not change"*
(`plans/tickets/ABC-019-turn-loop-skeleton.md:242` as `main` reads today) is **falsified by the
ticket's own fourth argument**. It is the TICKET's sentence, not `ADR-0009`'s, so it cannot be
repaired from an ADR. **Owner BA/PM.** Note that `main` still carries the three-argument
`## Scope` at `:230` as well — the four-argument edit is on the `ABC-019` branch and has not merged,
so whoever takes this should check which tip they are reading. **Non-blocking on both ADRs.**

**`ABC-027` — owed NOTHING from this hop, and one thing is CONFIRMED to it.** `A6` is correct as
written: `src/frame.test.ts:735-771` is verified present on `main` at the exact line range, both
width assertions included, and *"replaced, never deleted"* is the right disposition. Separately, the
Security/NFR FAIL's routing stands untouched by me: **`A1` must be re-derived from `H` by BA/PM —
never relaxed** (QE measured `A1` as where 9 of 14 mutants die), and its numbers become `\x1b[K` =
`H` (23), `\x1b` = `H + 2`… **read as `2 + H` = 25 in the merged test's `occurrences` form**, delta
`H × 3` = 69. **This ADR hop does not authorise that edit and did not make it.**

**`ABC-016` — owed nothing new.** The stale `A7` rationale sentence already recorded at
`refinement-ABC-027-cut` is unchanged by this hop and still BA/PM's, non-blocking.

**`ABC-017` — owed nothing new.** Its `A2` disposition is unchanged by this hop.

## One residual I FLAGGED rather than took

`ADR-0010`'s `## Rollback` says *"…the escape-count assertion and **the narrowing fixture**"*, which
carries the same premise correction (1) strikes — the fixture pre-exists and would be **restored**,
not removed. **`## Rollback` is outside the `## Consequences` scope this subtask named, so it was
left alone.** It is cheap for whoever next opens the file with a mandate that reaches it. **Owner:
Architect/Design, non-blocking, no ruling involved.**

## Evidence paths — two named in the brief do NOT exist, and here is why

| brief named | actual |
|---|---|
| `.grugops/context/refinement-ABC-019-seam/notes/` | **absent** — `refinement-ABC-019-seam` is still in `.grugops/queue/pending/`; that hop has not run. Substantive evidence used instead: `.grugops/context/abc019-a9b-2026-08-11/notes/20260811T140000Z-orchestrator-decision-9a4c7e33.md` and `plans/tickets/history/ABC-016-board-history.md` |
| `.grugops/context/security-nfr-ABC-027/notes/` | **absent** — `security-nfr-ABC-027` is likewise still `pending`. Evidence used instead: `.grugops/context/abc027-fail-2026-08-12/notes/20260812T020000Z-orchestrator-decision-c73e5a81.md` (the accepted FAIL) and `.grugops/context/abc027-secnfr-2026-08-11/notes/20260811T230000Z-orchestrator-decision-f37c9b04.md` (the margin question routed to that gate) |
| `.grugops/context/refinement-ABC-027-cut/notes/` | **present**, all three notes read |

**Nothing was inferred from the absence** — in both cases a hop-specific note carrying the same
measurements was found and used, and it is cited above rather than paraphrased.
