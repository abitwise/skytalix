---
id: 20260809T102400Z-security-nfr-artifact-ref-0a7692f3
kind: artifact-ref
by: security-nfr
at: 2026-08-09T10:24:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-018
  - ABC-018
  - NFR-002
  - plans/nfr-catalog.md
  - plans/traceability.md
  - plans/board.md
  - plans/tickets/ABC-018-frame-output-and-redraw.md
  - src/frame.ts
supersedes: 
---

# What this gate produced: four plan-file edits, zero lines under `src/`, and instruments that stay out of the repository

## Under `src/` — NOTHING

`git diff --stat -- src/` is **EMPTY**. `src/frame.ts` hashes **`bb827f52fe537817e40020a29dfa0e6d`**
before and after this gate — the Engineer's first-commit digest and the one QE published. No test
was added or changed either: this gate's questions were answered by instruments, and an instrument
that belongs in the suite would have to be a bar this project has ruled it does not keep in-tree
(`src/zobrist.nfr.test.ts:112`).

## `plans/nfr-catalog.md` — the `NFR-002` write half DISCHARGED

**Exactly 2 lines changed of 545** — the `_Updated:_` header and the `NFR-002` row. Verified rather
than asserted:

- `NFR-001` and `NFR-003`–`NFR-007` are **byte-identical**, hashed before and after.
- `NFR-002`'s **ID, Category, `Target` and `Applies to` cells are byte-identical** — hashed
  individually before and after. **NO TARGET MOVED.**
- The row still has **7 raw fields**, as do all seven table lines, so no unescaped `|` was
  introduced. The file still has **545 lines**.
- Only **measured evidence was appended**: the four write-sink definitions with two independent
  samples each, the compute re-measurement, the re-derived denominator (including the **byte** figure
  nobody had), the in-place timing the Engineer recorded as not taken, the ruling on which "write"
  the row means, the unbounded-input threshold, the single-write count, and the two instrument-limit
  corrections. No prior measurement, denominator, `UNKNOWN - verify` marker or fence was reflowed or
  re-opened.

## `plans/traceability.md` — one row, three cells

`ABC-018`'s **`NFRs`**, **`UAT`** and **`Status`** cells, updated in place. No other row touched, none
appended, none removed. **The cell count was machine-verified before and after: this row carries
twelve raw fields / ten cells**, as do 19 of the 21 `ABC-` rows. **`ABC-011` and `ABC-015` carry
thirteen — that is PRE-EXISTING at `HEAD`** (checked with `git show HEAD:plans/traceability.md`) **and
was neither introduced nor repaired here**: it is a stray unescaped `|` inside those two rows, and
repairing an adjacent row is not this gate's (`AGENTS.md` rule 9). Flagged rather than silently fixed.

## `plans/board.md` — the column move, with the counts on both sides

`ABC-018` moved **`In Security/NFR` → `Ready for UAT`**. Both column headings updated:
`## In Security/NFR (WIP 1/2)` → **`(WIP 0/2)`** and `## Ready for UAT (WIP 0/4)` → **`(WIP 1/4)`**.
The full gate record sits in the **entering** column's comment and an `EMPTIED` record in the one it
left — the shape every prior column move on this board used. Exactly one `- [ABC-018]` row exists on
the board, verified with `grep`.

## `plans/tickets/ABC-018-frame-output-and-redraw.md` — a new `## Security / NFR` section

Appended below `## QE`, the shape `ABC-015`'s ticket already uses. Frontmatter `status` and `column`
moved to `ready-for-uat` / `Ready for UAT`. **Nothing above the new section was edited: no criterion
was amended, the `CORRECTED IN PLACE` block under `## Acceptance` is untouched, and the
`## Implementation` and `## QE` sections are untouched.**

## The instruments, and why they are not in the repository

Five harnesses, all written **outside the repository** in the session scratchpad, importing `src/` by
absolute path:

| Instrument | What it answers |
|---|---|
| `lib.mjs` | this gate's own replay, stubs, capturing sink, byte census and the 21-string adversarial corpus |
| `s1-escape-bar.mjs` | the measurable security bar on the emitted stream, both modes × both strategies, message region and panel row; the module's own sequences; the C1 byte census |
| `s2-surfaces.mjs` | writer bypass, the prototype gadget with a live null control in both directions, the `mode` domain, unbounded input, what the player is told when a message does not fit, and the failure modes |
| `s3-threshold.mjs` / `s4-cold.mjs` | where unbounded input crosses the 16 ms budget — warm sweep and the cold, own-process reading that is the right instrument |
| `s5-width-fence.mjs` | where *"no emitted row exceeds `W`"* stops holding, and the proof it is unreachable |
| `s6-permission.mjs` | the three positive controls that prove the permission-model instrument ARMED before any negative result was trusted |
| `nfr002.mjs` / `nfr002b-inplace.mjs` | `NFR-002`'s two halves across four sinks, and the in-place path |

They are deliberately **not committed**: one-off gate instruments are not delivered artifacts, and
this project's rule 5 keeps unrequested machinery out of `src/`. What they produced is in the three
`observation` notes; what they could not establish is in this gate's `claim` note.
