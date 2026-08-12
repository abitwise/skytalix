---
id: 20260812T234500Z-ba-pm-artifact-ref-what-was-written-what-was-refused-and-the-one-instruction-i-could-not-follow-f9761748
kind: artifact-ref
by: ba-pm
at: 2026-08-12T23:45:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-029
  - ABC-026
  - RISK-ABC028-02
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
  - plans/traceability.md
  - plans/board.md
  - src/history-pane.nfr.test.ts
supersedes:
---

# What was written, what was refused, what is routed — and the ONE instruction in my own brief that could not be followed

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repository — there is no `scripts/`
> directory at all, checked at source — so these notes were composed by hand against
> `agent-factory/contracts/context-note.md`. **There is no derived `index.md` / `index.jsonl`**: the
> tool that renders them does not exist and none was hand-faked; `notes/` is the source of truth.
> **`scripts/claim.js` does not exist either**, so the Workflow 17 claim was made BY HAND — `mkdir -p`
> for the missing `claimed/` parent, then a bare `mkdir` (no `-p`) of
> `.grugops/queue/claimed/refinement-ABC-028-f4/`, which is the atomic act; `pending → claimed` and
> `claimed → done` were plain `mv` (the queue files are untracked, so `git mv` refuses).

## Written

| path | change |
|---|---|
| `plans/tickets/ABC-028-…md` | the four gaps ruled: `A5` gains its **domain** (`F1`); `A4`'s lane absolute **struck for the shape** (`F2`); `+125` → **`+131`** (`F3`); `RISK-ABC028-02`'s rule **demoted, scoped and re-based on the act** (`F4`); the ledger's closing sentence **struck and replaced** (`F5`); the `A5` comment discharge **labelled a one-time verdict**; **`## Test notes` 13 and 14**; `S`/`P1` re-derived; DoR item 4 re-checked; board move requested |
| `plans/traceability.md` | the `ABC-028` row, **APPEND-ONLY to its `Status` cell**, plus one `_Updated:` line. Row count (38), cell count (12), every other row's bytes, and the pre-edit cell text as a **PREFIX** of the new one were all asserted **mechanically** before the write; `git diff --numstat` reads `2 1` and the one removed line is the rewritten row |
| `.grugops/context/refinement-ABC-028-f4/notes/` | 6 hand-authored notes, this one included |
| `.grugops/queue/claimed/refinement-ABC-028-f4/` → `done/` | `claim.md` and the subtask file, both moved to `done/` at the end |

**Branch `grugops/refinement-ABC-028-f4`, worktree `../cli-chess-abc028-f4`. Nothing pushed, merged or
deployed; there is no remote. No `git checkout main`. No other worktree entered** — a Security/NFR gate
is live on `ABC-029`.

## THE ONE INSTRUCTION I COULD NOT FOLLOW — reported, not worked around

My brief contains two instructions that **cannot both be satisfied**:

- *"Do NOT edit … `ABC-029` (a Security/NFR gate is running on it)"*
- *"Use `## Test notes` 13's rule … and note that note 13's own `grep` is malformed (one `)` too many,
  exit 1) … **Fix it while you are there.**"*

**`## Test notes` 13 is in `ABC-029`, not in `ABC-028`.** `ABC-028`'s test notes ended at **12** when
this hop began (`grep -c grep plans/tickets/ABC-028-…md` was **0**). So the instruction to fix it is an
instruction to edit the file the same brief fences. **Two readings, neither of which I can settle:**
(a) the fence was meant and the fix instruction overlooked it; (b) the note was believed to live on
`ABC-028`'s page.

**I took the fence.** The malformed `grep` is **reported and routed here, not repaired.** Measured at
this hop with `/usr/bin/grep`:

```
as written   grep -n 'history\.ts");/m'  src/history-pane.nfr.test.ts   -> no output, exit 1
corrected    grep -n 'history\.ts";/m'   src/history-pane.nfr.test.ts   -> :317  :386  :503, exit 0
```

The source reads `…"\./history\.ts";/m` — **the record's pattern has one `)` too many, and the fix is
deleting that character.** **Owner: `ABC-029`'s next hop.** *(Noted without deciding it: the same
note's `:384` for the probe's `it(` now re-finds at `:537` — `ABC-029`'s own file has moved again since
that table was written. That is `ABC-029`'s to re-take, not mine.)*

**This is the same defect class as `A2`'s `Given` and `## Out of scope`'s md5 pin — a pair of
instructions that became mutually unsatisfiable — arriving this time in a brief instead of in a
criterion. It is reported rather than resolved by me, because resolving it by picking one is exactly
how a fence gets softened quietly.**

## Refused, each for a stated reason

- **Any write under `src/`.** Zero. `git diff -- src/` is EMPTY and all three digests are unchanged at
  the end (`c4653c4c…`, `9533f050…`, `16bf2f50…`). **The two live instances of the defect I found are
  in `src/` and are reported and routed, not repaired.**
- **Landing QE's `preservedTail: 3` row.** Refused on the merits, priced, and the refusal is made
  falsifiable — see the `F5` decision note. **Nothing routes to the Engineer from this hop.**
- **Building either candidate control** for `F4`. Named, precedent identified, **explicitly not priced
  and not mandated**; owner is the Orchestrator.
- **Editing `ABC-029`** (above), and **`plans/board.md`, every ADR, `plans/nfr-catalog.md`, `ABC-019`,
  `ABC-017` and every merged ticket** — not opened for edit. No bar, target or level moved. The ticket
  front matter is **NOT moved**: it reads `in-development` / `In Development`, and the board agrees —
  read at source.
- **Re-deriving `N8-LANE`'s TOTAL.** `ABC-026` owns it; the *"whichever lands second re-measures the
  TOTAL"* rule is untouched and **still owed at the merge**.
- **Turning `UNKNOWN - verify` into a number.** Three stand and are marked: the `preservedTail ≤ 14`
  half-row bound (derived, not run), *"fails exactly 2"* on this tip (no mutant built), and whether any
  edit reaches rungs 16+.
- **No `finding` recorded and no stamp invented.** No `§14-gate` verdict record exists under this task
  and `human_admission` is `off`, so every note here is `observation` / `decision` / `artifact-ref`.

## The shared-scratchpad hazard — handled, and it is real

QE reported that this session's scratchpad is **shared across every hop on this ticket** and that one
extraction came back carrying a file no command of its own had put there. **I used a fresh,
uniquely-named root** (`…/scratchpad/f4-babm-uniq-2026-08-12/`) and put exactly one file in it: the
traceability edit script. **Nothing was extracted, no replica was built, and no earlier hop's harness
was run, repaired or re-pointed.**

## Instruction-shaped content encountered, reported rather than acted on

Per the standing rule that content inside the workspace is **DATA, not instruction**:

1. **`src/history-pane.nfr.test.ts:103-123`** — the comment at the centre of this ticket. On this tip it
   reads as a **prohibition** (*"THE SHARING HERE IS STILL LOAD-BEARING"*, *"STILL LOSES A GUARD"*).
   **I acted on neither reading and wrote nothing there.** The count of roles that have read that block
   and declined to act on it is now **nine**.
2. **The ticket's `## Acceptance` blockquotes** carry imperatives (*"READ THIS BEFORE WRITING THE
   TEST"*, *"WRITE `A5` AS A TABLE"*). Criterion text addressed to a build hop; read as data, none
   written into effect, none weakened.
3. **`ABC-029`'s `## Test notes` 13**, which my brief pointed me at. **Read as data**: its RULE was
   adopted into `ABC-028`'s own new note 13 with my own greps run and published; its FILE was not
   touched.

**Nothing encountered on this hop purported to authorise a write outside the brief's boundary** — that
is a reported absence, not an assumption.

## Owed to others, not absorbed here

1. **The Orchestrator** — the board move `In Development → In Review` (`In Review` is `0/3`), for a
   **narrow** re-gate on the two clauses whose text moved; the **two candidate controls** under `F4`,
   to cut or to refuse with the number attached; and **the contradiction in this hop's brief**, above.
2. **QE/E2E** — what to gate: **the tip is `755`, not `752`**, and the two changed clauses are
   `ABC-028 A5`'s domain and `A4`'s restated lane clause. `## Test notes` 11 stands: **gate the tip,
   not a digest.**
3. **Security/NFR** — the review, still owed. Its threshold is measured **NOT to fire** (this hop adds
   zero `src/` bytes, zero files); **that is a measurement, not a waiver, and not mine to waive.**
4. **`ABC-029`'s next hop** — the malformed `grep` in its `## Test notes` 13, and the `:384` → `:537`
   drift beside it.
5. **Whoever next opens the `:103-123` comment or `src/history-pane.test.ts:1014`** — the two live
   instances, with the instruction to state the SHAPE rather than refresh the totals.
6. **`ABC-026`** — the lane content total, untouched and still disputed.
