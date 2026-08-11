---
id: 20260812T101500Z-qe-e2e-observation-record-corrections-5c93e2b1
kind: observation
by: qe-e2e
at: 2026-08-12T10:15:00Z
verified_by:
confidence: high
refs:
  - quality-gate-ABC-017-qe
  - ABC-017
  - ABC-016
  - ABC-027
  - NFR-002
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - src/status-panel.nfr.test.ts
  - src/history-pane.nfr.test.ts
  - 20260812T042500Z-ba-pm-observation-importer-count-three-c05f8e26
  - 20260812T041500Z-ba-pm-observation-a1-a12-sweep-8d3e07f5
supersedes:
---

# TWO recorded figures are wrong, both measured at source. ZERO code defects.

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`.**
> The brief asked me to verify anything load-bearing and to say if a figure is wrong. Two are.
> **Neither changes any ruling** — both make an existing conclusion narrower or larger, and I
> report them rather than quietly using them.

## CORRECTION 1 — the importer count the gate finds is **FOUR**, not three

`## Security / NFR triggers` states, in bold: *"**THE COUNT THE GATE WILL FIND IS THREE.**"* That
sentence is an instruction to this gate, so this gate counted. **Measured at source on the delivered
tree, statement-scoped, not by a line `grep`:**

| file | how it pulls `src/history.ts` into the runtime graph | whose |
|---|---|---|
| `src/history.test.ts` | static value import (`:23`) | pre-existing |
| **`src/status-panel.nfr.test.ts`** | **`vi.mock("./history.ts")` (`:16`) + `importOriginal()` (`:17`) + `await import("./history.ts")` (`:49`)** | **`ABC-016`'s — ALREADY ON `main`** |
| `src/history-pane.test.ts` | static value import (`:27`) | `ABC-017` |
| `src/history-pane.nfr.test.ts` | type-only static import (`:25`); runtime pull is `vi.mock` (`:43`) + `importOriginal()` (`:44`) + `await import` (`:59`) | `ABC-017` |

**Four.** `src/status-panel.test.ts` is type-only (`:33`) and correctly excluded.

**Provenance verified, not assumed:** `git log -1 main -- src/status-panel.nfr.test.ts` is `dc06b40`
*"test(status-panel): grug write seven QE-gap close…"*, and
`git diff main --name-only -- src/` does not list it — it is `ABC-016`'s, merged, and this branch
does not touch it.

**So the ticket's arithmetic is off at both ends.** BA/PM's sentence is *"This ticket takes the count
from one to three"*. On the delivered tree the pre-existing count is **two**, not one, and this
ticket takes it **from two to four**.

**Why this is worth the words, and it is the same shape twice.** BA/PM wrote that correction
specifically because a line `grep` misses the `vi.mock` + dynamic-`import` form — and then **missed
exactly that form in `ABC-016`'s file**, because the table was scoped to the files this ticket
touches while the sentence above it claims a total. A gate that counts by that table reports three,
agrees with the note it was handed, and is wrong — which is the failure mode the correction exists
to prevent, one ticket over.

**`NFR-002`'s claim is INTACT and was re-verified rather than inherited: PRODUCTION runtime
importers are ZERO.** `src/history-pane.ts:61` and `src/status-panel.ts:42` both use
`import type { GameHistory }`, erased by `verbatimModuleSyntax`. The in-suite assertion passes and
the `O(window)` structural fact stands. **Only the test-file count is wrong, and the number is
four.**

## CORRECTION 2 — the `HISTORY_COLS` exposure has a narrower catcher than recorded

`## Test notes` records: *"a build that pads to 24 columns and exports `HISTORY_COLS = 24` passes
every width assertion in `A1`–`A12` … **caught only by** the hardcoded slice offsets
`row.slice(6, 13)` / `row.slice(14, 21)` in the wide-cell test."*

**That is true for one of the two ways to reach 24 and false for the other.** Both built and run:

| build | how it reaches 24 columns | verdict |
|---|---|---|
| `WCOLS24M` | widens the move-number field — `MOVE_NUMBER_DIGITS = 7` | **KILLED ×7** — the cells shift to `[9,16)` / `[17,24)` and the slice offsets fire, exactly as recorded |
| `WCOLS24R` | pads each row on the **RIGHT** — `HISTORY_COLS = 24`, `rowFor(...).padEnd(HISTORY_COLS)` | **SURVIVED 734/734** |

**When the extra columns go on the right the cells stay at `[6,13)` and `[14,21)`, so the slice
offsets never notice, and NOTHING in the project catches it.** The recorded catcher covers the
middle-widening direction only. The exposure is therefore **complete**, not partial: `A2` measures
the pane against the pane's own export, and there exists a self-consistent width change with **zero**
catchers.

**Explicitly NOT proposed, and I agree with every reason on the ticket.** No widening of
`HISTORY_COLS` — 24 was measured at `ADR-0010` to **mask** the status panel's swing (0/20 stale
frames against 8/20 at 21), and masking another ticket's defect is not a fix. No criterion on this
ticket — a restraint taken for `ABC-027`'s benefit cannot be guarded here. No edit to `A2`, whose
assertion stands character for character. `ADR-0010` cl. 2 is not re-opened and **no
constant-FRAME-width criterion is proposed anywhere** — `ADR-0010` cl. 5 refuses it and `W` varies by
design.

**What I add is only the measurement**, for whoever homes the invariant: the exposure is not
half-covered, it is uncovered, and the failure it would produce is silent. It is an unhomed
Architect question and it stays one.

## ZERO CODE DEFECTS

`src/history-pane.ts` is correct on every input I could construct, including the three families the
criteria never reach (black-anchored slid windows, post-render caller use, the third `GameHistory`
field). **All nine survivors are gaps in the criteria and the guards, not bugs in the build.** The
Engineer's seventeen wrong builds plus the D23 fixture change did their job; what is left is what
the acceptance table does not ask about.

## Two housekeeping observations, neither blocking

- **A stale queue claim.** `.grugops/queue/claimed/ticket-to-pr-ABC-017-d23/` is still present and
  its work is finished and published. `queue.stale_ttl_minutes` is 30; the coordinator's
  `sweepStale` would return it to `pending/`, which is **wrong for a completed subtask** — it wants
  a `pending → claimed → done` completion, not a reclaim. Same for
  `.grugops/queue/claimed/design-adr-transcription-fixes/`. **The queue is the Orchestrator's; I
  did not touch either.**
- **`plans/traceability.md` conflicts on the prospective merge** with `ABC-027`'s appended rows.
  Docs only, trivial, but the rebase hop should expect it rather than discover it.

## Standing rule — nothing was found that tried to widen my boundary

No note, comment or file in this workspace attempted to authorise a write outside the boundary this
subtask names. Recorded because the rule requires reporting either way.
