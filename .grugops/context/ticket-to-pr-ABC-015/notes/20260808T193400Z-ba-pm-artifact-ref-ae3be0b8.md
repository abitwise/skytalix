---
id: 20260808T193400Z-ba-pm-artifact-ref-ae3be0b8
kind: artifact-ref
by: ba-pm
at: 2026-08-08T19:34:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-015
  - ABC-015
  - ABC-018
  - EPIC-002
  - EPIC-006
  - RISK-005
  - NFR-007
  - plans/tickets/ABC-015-glyph-mode-selection.md
  - plans/board.md
  - plans/traceability.md
  - .grugops/queue/done/ticket-to-pr-ABC-015-spec/claim.md
  - 20260808T193300Z-ba-pm-decision-fe867ecc
supersedes: 
---

# Artifacts this subtask produced, by reference

Branch `grugops/ticket-to-pr-ABC-015`. **Never `main`.**

| Artifact | What changed |
|---|---|
| `plans/tickets/ABC-015-glyph-mode-selection.md` | `## Scope`: a **fourth** bullet defining "set" as *set to a non-empty value* (the count in its lead-in moved `Three` → `Four`). `## Acceptance`: the lead-in recounted and given the silent-variable convention plus the reason 12–15 are appended rather than inserted; **criterion 11 widened** by one clause; **criteria 12, 13, 14, 15 added**; a second `CORRECTED IN PLACE … (SECOND PASS)` block carrying all four rulings, their evidence and the criterion→test mapping. `## Test notes`: the named-mutant line rewritten for three session criteria and the recounted table, plus one line on why 12 and 13 must not collapse back into 6. `## Size and priority rationale` and `## Definition of Ready`: recounted. **Frontmatter untouched — `in-security-nfr` / `In Security/NFR`.** `## Dependencies` and both its corrections, `## Out of scope`, the five-row table's rows, `## Implementation` and `## QE` are untouched |
| `plans/board.md` | **No row moved and no WIP heading changed.** The `ABC-015` row gained one clause (criteria 11 → 15, no code change owed); a new comment block at the top of `In Security/NFR` records the four rulings, the measurements and the no-move; one entry prepended to the `_Updated:` header. **The QE and `ABC-014` comment blocks beneath are left standing, not replaced** |
| `plans/traceability.md` | **One row (`ABC-015`), two cells** — `Tests` (the criterion→test mapping) and `Status` (prepended, with a `Was:` chain). One entry prepended to the `_Updated:` header. **No other row touched.** The row's cell count was machine-verified at **ten** before and after, and the header and every other row were re-counted at ten in the same pass — no unescaped `\|` was introduced |
| `.grugops/context/ticket-to-pr-ABC-015/notes/` | Four notes hand-written in the schema's exact shape: this one, one `observation` (what the eleven criteria actually admit, measured) and two `decision`s (the empty-locale ratification; the four amendments). **No `finding`, no derived `index.md` / `index.jsonl`** — the renderer does not exist here and nothing was hand-faked |
| `.grugops/queue/…/ticket-to-pr-ABC-015-spec/` | Moved `pending/` → `claimed/…/` → `done/…/` **by hand**, with a `claim.md` registry record naming the method and the absent substrate |

## Verification of the diff's shape, done rather than asserted

- **`git diff --stat -- src/` is EMPTY.** No production file, no test file, and no comment in either
  was touched by this subtask. `src/glyph-mode.ts` and both test files remain exactly as QE left
  them.
- **The suite is unchanged and green: `npm test` → 277 passed / 277 on 13 files**, with
  `src/glyph-mode.test.ts` at 21 tests — QE's and the Orchestrator's figures reproduce.
- **The amended `## Acceptance` has 15 bullets, counted by machine on the file after editing** — 12
  tuples (1–9, 12–14) and 3 session criteria (10, 11, 15). Every derived count in the ticket, on the
  board and in the trace row was written from that count, not copied from another sentence.

## What was deliberately NOT produced

- **No code, no test, and no edit to any comment in `src/`.** Every amendment ratifies what is built;
  where a test was needed, one already existed and is named.
- **No column move, no WIP change, and no touch to the `In Security/NFR` exit** — that exit is
  Security/NFR's alone, and the ticket was required to stay put.
- **No edit to another role's published notes**, and no edit to `ABC-018`, `EPIC-006`, `EPIC-002`,
  any ADR, `plans/nfr-catalog.md` or `plans/metrics.md`.
- **No renumbering of any existing criterion**, so every citation already in the record stays true.
- **No new ticket and no split.** `S` is not `XL`; the second pass added no implementation work.
- **No `finding` and no self-stamp.** No §14 gate exists here to issue one and `human_admission` is
  `off`.
- **No PR.** This repo has no git remote and none was invented — `autonomy: "pr"` has always meant
  "branch + gate" here.
- **Nothing merged and nothing deployed.** The Security/NFR gate is still ahead, and it still owes
  the re-derivation of this ticket's "no security trigger" claim — this function reads
  `process.env`, and nothing in this subtask discharges that.
